using Polyglot.Infrastructure.Dtos;

namespace Polyglot.Infrastructure.Clients
{
    public interface IOpenRouterClient
    {
        Task<List<AvailableModelDto>> GetModelsAsync(CancellationToken cancellationToken = default);
    }
}
