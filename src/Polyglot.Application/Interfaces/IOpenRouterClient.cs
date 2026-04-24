using Polyglot.Application.Dtos;

namespace Polyglot.Application.Interfaces
{
    public interface IOpenRouterClient
    {
        Task<List<AvailableModelDto>> GetModelsAsync(CancellationToken cancellationToken = default);
    }
}
