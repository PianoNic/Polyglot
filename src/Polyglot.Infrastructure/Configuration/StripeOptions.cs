namespace Polyglot.Infrastructure.Configuration
{
    // Bound from the "Stripe" configuration section. Secrets are supplied via
    // environment/user-secrets, never committed. Products map a Stripe Price id to the
    // number of credits a successful payment grants.
    public class StripeOptions
    {
        public const string SectionName = "Stripe";

        public string? SecretKey { get; set; }
        public string? PublishableKey { get; set; }
        public string? WebhookSecret { get; set; }

        // Where Stripe Checkout redirects the browser after success/cancel.
        public string SuccessUrl { get; set; } = string.Empty;
        public string CancelUrl { get; set; } = string.Empty;

        // Where the Stripe Customer Portal returns the browser when the user is done.
        // Falls back to CancelUrl when unset.
        public string PortalReturnUrl { get; set; } = string.Empty;

        public List<StripeProductOption> Products { get; set; } = new();

        public bool IsConfigured => !string.IsNullOrWhiteSpace(SecretKey);
    }

    public class StripeProductOption
    {
        // The Stripe Price id (price_...) this entry grants credits for.
        public string PriceId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public long Credits { get; set; }

        // "payment" for one-time credit packs, "subscription" for recurring plans.
        public string Mode { get; set; } = "payment";

        public bool IsSubscription => string.Equals(Mode, "subscription", StringComparison.OrdinalIgnoreCase);
    }
}
