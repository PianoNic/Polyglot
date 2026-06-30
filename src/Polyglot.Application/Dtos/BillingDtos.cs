namespace Polyglot.Application.Dtos
{
    public record StripeProductDto
    {
        public required string PriceId { get; init; }
        public required string Name { get; init; }
        public required long Credits { get; init; }
        public required string Mode { get; init; }

        public long? Amount { get; init; }
        public string? Currency { get; init; }
    }

    public record BillingConfigDto
    {
        public required bool Configured { get; init; }
        public string? PublishableKey { get; init; }
        public required List<StripeProductDto> Products { get; init; }
    }

    public record CheckoutSessionDto
    {
        public required string Url { get; init; }
    }

    public record PortalSessionDto
    {
        public required string Url { get; init; }
    }
}
