using Microsoft.EntityFrameworkCore;
using Polyglot.Application.Interfaces;
using Polyglot.Domain;
using Polyglot.Domain.Enums;

namespace Polyglot.Infrastructure.Repositories
{
    public class ModelListRepository(PolyglotDbContext dbContext) : IModelListRepository
    {
        public async Task<List<ModelListEntry>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            return await dbContext.ModelListEntries.ToListAsync(cancellationToken);
        }

        public async Task<ModelListEntry> AddAsync(string modelId, ModelListType listType, CancellationToken cancellationToken = default)
        {
            var entry = new ModelListEntry { ModelId = modelId, ListType = listType };
            dbContext.ModelListEntries.Add(entry);
            await dbContext.SaveChangesAsync(cancellationToken);
            return entry;
        }

        public async Task<bool> RemoveAsync(Guid id, CancellationToken cancellationToken = default)
        {
            var entry = await dbContext.ModelListEntries.FindAsync([id], cancellationToken);
            if (entry is null) return false;

            dbContext.ModelListEntries.Remove(entry);
            await dbContext.SaveChangesAsync(cancellationToken);
            return true;
        }
    }
}
