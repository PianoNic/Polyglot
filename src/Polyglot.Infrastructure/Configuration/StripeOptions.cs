namespace Polyglot.Infrastructure.Configuration
{
    public class StripeOptions
    {
        public const string SectionName = "Stripe";

        public string? SecretKey { get; set; }
        public string? PublishableKey { get; set; }
        public string? WebhookSecret { get; set; }

        public string SuccessUrl { get; set; } = string.Empty;
        public string CancelUrl { get; set; } = string.Empty;

        public string PortalReturnUrl { get; set; } = string.Empty;

        public List<StripeProductOption> Products { get; set; } = new();

        public bool IsConfigured => !string.IsNullOrWhiteSpace(SecretKey);
    }

    public class StripeProductOption
    {
        public string PriceId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public long Credits { get; set; }

        public string Mode { get; set; } = "payment";

        public bool IsSubscription => string.Equals(Mode, "subscription", StringComparison.OrdinalIgnoreCase);
    }
}
