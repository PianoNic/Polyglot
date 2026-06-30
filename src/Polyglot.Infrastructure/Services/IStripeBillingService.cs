namespace Polyglot.Infrastructure.Services
{
    public record StripeProductInfo(string PriceId, string Name, long Credits, string Mode, long? Amount, string? Currency);

    public record StripeGrant(string EventId, Guid? UserId, string? StripeCustomerId, long Credits);

    public interface IStripeBillingService
    {
        bool IsConfigured { get; }
        string? PublishableKey { get; }

        Task<IReadOnlyList<StripeProductInfo>> GetProductsAsync(CancellationToken cancellationToken = default);

        Task<string> CreateCheckoutSessionAsync(Guid userId, string priceId, CancellationToken cancellationToken = default);

        Task<string> CreatePortalSessionAsync(Guid userId, CancellationToken cancellationToken = default);

        StripeGrant? ParseWebhook(string json, string signatureHeader);
    }
}
