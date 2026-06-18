using Polyglot.Infrastructure.Dtos;

namespace Polyglot.Infrastructure.Clients
{
    public interface IOpenRouterClient
    {
        Task<List<AvailableModelDto>> GetModelsAsync(CancellationToken cancellationToken = default);

        Task<GeneratedImage> GenerateImageAsync(string model, string prompt, CancellationToken cancellationToken = default);
    }

    // A generated image plus the actual upstream cost (USD) OpenRouter reported,
    // used to bill the user in credits.
    public record GeneratedImage(byte[] Data, string MediaType, decimal CostUsd);
}
