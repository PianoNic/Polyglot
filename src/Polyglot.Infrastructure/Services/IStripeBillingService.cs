namespace Polyglot.Infrastructure.Services
{
    // A configured purchasable product, safe to expose to the client. Amount is the
    // price in the currency's minor unit (e.g. cents/rappen); both are null when the
    // price could not be fetched from Stripe.
    public record StripeProductInfo(string PriceId, string Name, long Credits, string Mode, long? Amount, string? Currency);

    // A normalized, idempotent credit grant derived from a Stripe webhook event.
    // Exactly one grant is produced per processed event so per-event idempotency
    // (keyed on EventId) credits the user once regardless of webhook retries.
    public record StripeGrant(string EventId, Guid? UserId, string? StripeCustomerId, long Credits);

    public interface IStripeBillingService
    {
        bool IsConfigured { get; }
        string? PublishableKey { get; }

        // Returns the configured products enriched with each Stripe price's amount/currency.
        Task<IReadOnlyList<StripeProductInfo>> GetProductsAsync(CancellationToken cancellationToken = default);

        // Creates a Stripe Checkout session for the user/price and returns its redirect URL.
        Task<string> CreateCheckoutSessionAsync(Guid userId, string priceId, CancellationToken cancellationToken = default);

        // Creates a Stripe Customer Portal session for the user (to manage/cancel a
        // subscription) and returns its URL. Throws when the user has no Stripe customer.
        Task<string> CreatePortalSessionAsync(Guid userId, CancellationToken cancellationToken = default);

        // Verifies the webhook signature and translates a supported event into a single
        // credit grant, or null for events that should not credit. Throws on bad signature.
        StripeGrant? ParseWebhook(string json, string signatureHeader);
    }
}
