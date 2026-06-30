namespace Polyglot.Domain
{
    public class StripeEvent
    {
        public required string Id { get; init; }
        public DateTime ProcessedAt { get; init; } = DateTime.UtcNow;
    }
}
