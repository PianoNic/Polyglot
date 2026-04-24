using Polyglot.Domain;
using Polyglot.Domain.Enums;

namespace Polyglot.Application.Interfaces
{
    public interface IModelListRepository
    {
        Task<List<ModelListEntry>> GetAllAsync(CancellationToken cancellationToken = default);
        Task<ModelListEntry> AddAsync(string modelId, ModelListType listType, CancellationToken cancellationToken = default);
        Task<bool> RemoveAsync(Guid id, CancellationToken cancellationToken = default);
    }
}
