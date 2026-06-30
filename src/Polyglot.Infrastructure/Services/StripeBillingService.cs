using System.Collections.Concurrent;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Polyglot.Infrastructure.Configuration;
using Stripe;
using Stripe.Checkout;

namespace Polyglot.Infrastructure.Services
{
    public class StripeBillingService(
        IOptions<StripeOptions> options,
        PolyglotDbContext dbContext,
        ILogger<StripeBillingService> logger) : IStripeBillingService
    {
        private const string CreditsMetadataKey = "credits";
        private const string UserIdMetadataKey = "userId";

        private readonly StripeOptions _options = options.Value;

        public bool IsConfigured => _options.IsConfigured;
        public string? PublishableKey => _options.PublishableKey;

        private static readonly ConcurrentDictionary<string, (long? Amount, string? Currency)> PriceCache = new();

        public async Task<IReadOnlyList<StripeProductInfo>> GetProductsAsync(CancellationToken cancellationToken = default)
        {
            var configured = _options.Products.Where(product => !string.IsNullOrWhiteSpace(product.PriceId)).ToList();
            var client = IsConfigured ? new StripeClient(_options.SecretKey) : null;

            var result = new List<StripeProductInfo>(configured.Count);
            foreach (var product in configured)
            {
                var (amount, currency) = client is null
                    ? (null, null)
                    : await GetPriceAsync(client, product.PriceId, cancellationToken);
                result.Add(new StripeProductInfo(
                    product.PriceId, product.Name, product.Credits, product.IsSubscription ? "subscription" : "payment", amount, currency));
            }
            return result;
        }

        private async Task<(long? Amount, string? Currency)> GetPriceAsync(StripeClient client, string priceId, CancellationToken cancellationToken)
        {
            if (PriceCache.TryGetValue(priceId, out var cached))
                return cached;

            try
            {
                var price = await new PriceService(client).GetAsync(priceId, cancellationToken: cancellationToken);
                var entry = (price.UnitAmount, price.Currency);
                PriceCache[priceId] = entry;
                return entry;
            }
            catch (Exception ex)
            {
                logger.LogWarning(ex, "Could not fetch Stripe price {PriceId}", priceId);
                return (null, null);
            }
        }

        public async Task<string> CreateCheckoutSessionAsync(Guid userId, string priceId, CancellationToken cancellationToken = default)
        {
            if (!IsConfigured)
                throw new InvalidOperationException("Stripe is not configured.");

            var product = _options.Products.FirstOrDefault(product => product.PriceId == priceId)
                ?? throw new InvalidOperationException($"Unknown price '{priceId}'.");

            var user = await dbContext.Users.SingleOrDefaultAsync(user => user.Id == userId, cancellationToken)
                ?? throw new InvalidOperationException("User not found.");

            var client = new StripeClient(_options.SecretKey);

            if (string.IsNullOrEmpty(user.StripeCustomerId))
            {
                var customer = await new CustomerService(client).CreateAsync(new CustomerCreateOptions
                {
                    Email = user.Email,
                    Metadata = new Dictionary<string, string> { [UserIdMetadataKey] = user.Id.ToString() },
                }, cancellationToken: cancellationToken);
                user.StripeCustomerId = customer.Id;
                await dbContext.SaveChangesAsync(cancellationToken);
            }

            var sessionOptions = new SessionCreateOptions
            {
                Mode = product.IsSubscription ? "subscription" : "payment",
                Customer = user.StripeCustomerId,
                ClientReferenceId = user.Id.ToString(),
                LineItems = new List<SessionLineItemOptions>
                {
                    new() { Price = priceId, Quantity = 1 },
                },
                SuccessUrl = _options.SuccessUrl,
                CancelUrl = _options.CancelUrl,
                Metadata = new Dictionary<string, string>
                {
                    [UserIdMetadataKey] = user.Id.ToString(),
                    [CreditsMetadataKey] = product.Credits.ToString(),
                },
            };

            if (product.IsSubscription)
            {
                sessionOptions.SubscriptionData = new SessionSubscriptionDataOptions
                {
                    Metadata = new Dictionary<string, string>
                    {
                        [UserIdMetadataKey] = user.Id.ToString(),
                        [CreditsMetadataKey] = product.Credits.ToString(),
                    },
                };
            }

            var session = await new SessionService(client).CreateAsync(sessionOptions, cancellationToken: cancellationToken);
            return session.Url;
        }

        public async Task<string> CreatePortalSessionAsync(Guid userId, CancellationToken cancellationToken = default)
        {
            if (!IsConfigured)
                throw new InvalidOperationException("Stripe is not configured.");

            var user = await dbContext.Users.SingleOrDefaultAsync(user => user.Id == userId, cancellationToken)
                ?? throw new InvalidOperationException("User not found.");

            if (string.IsNullOrEmpty(user.StripeCustomerId))
                throw new InvalidOperationException("No billing account to manage.");

            var client = new StripeClient(_options.SecretKey);

            var returnUrl = string.IsNullOrWhiteSpace(_options.PortalReturnUrl)
                ? _options.CancelUrl
                : _options.PortalReturnUrl;

            var session = await new Stripe.BillingPortal.SessionService(client).CreateAsync(
                new Stripe.BillingPortal.SessionCreateOptions
                {
                    Customer = user.StripeCustomerId,
                    ReturnUrl = returnUrl,
                }, cancellationToken: cancellationToken);

            return session.Url;
        }

        public StripeGrant? ParseWebhook(string json, string signatureHeader)
        {
            if (string.IsNullOrWhiteSpace(_options.WebhookSecret))
                throw new InvalidOperationException("Stripe webhook secret is not configured.");

            var stripeEvent = EventUtility.ConstructEvent(
                json, signatureHeader, _options.WebhookSecret, throwOnApiVersionMismatch: false);

            switch (stripeEvent.Type)
            {
                case EventTypes.CheckoutSessionCompleted:
                {
                    if (stripeEvent.Data.Object is not Session session || session.Mode != "payment")
                        return null;
                    if (!string.Equals(session.PaymentStatus, "paid", StringComparison.OrdinalIgnoreCase))
                        return null;

                    var credits = ReadCredits(session.Metadata);
                    var userId = ParseUserId(session.ClientReferenceId);
                    if (credits <= 0 || userId is null)
                    {
                        logger.LogWarning("Stripe checkout session {Event} missing credits/userId metadata", stripeEvent.Id);
                        return null;
                    }
                    return new StripeGrant(stripeEvent.Id, userId, null, credits);
                }

                case EventTypes.InvoicePaid:
                {
                    if (stripeEvent.Data.Object is not Invoice invoice)
                        return null;

                    long credits = 0;
                    foreach (var line in invoice.Lines)
                    {
                        var priceId = line.Pricing?.PriceDetails?.PriceId;
                        if (priceId is null)
                            continue;
                        var product = _options.Products.FirstOrDefault(product => product.PriceId == priceId);
                        if (product is not null)
                            credits += product.Credits;
                    }

                    if (credits <= 0 || string.IsNullOrEmpty(invoice.CustomerId))
                        return null;

                    return new StripeGrant(stripeEvent.Id, null, invoice.CustomerId, credits);
                }

                default:
                    return null;
            }
        }

        private static long ReadCredits(IDictionary<string, string>? metadata)
        {
            if (metadata is not null && metadata.TryGetValue(CreditsMetadataKey, out var raw) && long.TryParse(raw, out var credits))
                return credits;
            return 0;
        }

        private static Guid? ParseUserId(string? value) =>
            Guid.TryParse(value, out var id) ? id : null;
    }
}
