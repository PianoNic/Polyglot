namespace Polyglot.Infrastructure.Services
{
    // A configured purchasable product, safe to expose to the client.
    public record StripeProductInfo(string PriceId, string Name, long Credits, string Mode);

    // A normalized, idempotent credit grant derived from a Stripe webhook event.
    // Exactly one grant is produced per processed event so per-event idempotency
    // (keyed on EventId) credits the user once regardless of webhook retries.
    public record StripeGrant(string EventId, Guid? UserId, string? StripeCustomerId, long Credits);

    public interface IStripeBillingService
    {
        bool IsConfigured { get; }
        string? PublishableKey { get; }

        IReadOnlyList<StripeProductInfo> GetProducts();

        // Creates a Stripe Checkout session for the user/price and returns its redirect URL.
        Task<string> CreateCheckoutSessionAsync(Guid userId, string priceId, CancellationToken cancellationToken = default);

        // Verifies the webhook signature and translates a supported event into a single
        // credit grant, or null for events that should not credit. Throws on bad signature.
        StripeGrant? ParseWebhook(string json, string signatureHeader);
    }
}
