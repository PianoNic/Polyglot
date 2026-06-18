namespace Polyglot.Domain
{
    // Records Stripe webhook event ids that have already been processed so credit
    // grants stay idempotent across Stripe's at-least-once webhook delivery.
    public class StripeEvent
    {
        public required string Id { get; init; }
        public DateTime ProcessedAt { get; init; } = DateTime.UtcNow;
    }
}
