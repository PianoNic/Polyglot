using Mediator;
using Microsoft.EntityFrameworkCore;
using Polyglot.Application.Dtos;
using Polyglot.Application.Mappers;
using Polyglot.Application.Models;
using Polyglot.Infrastructure;

namespace Polyglot.Application.Queries
{
    public record GetModelListEntriesQuery() : IQuery<Result<List<ModelListEntryDto>>>;

    public class GetModelListEntriesQueryHandler(PolyglotDbContext dbContext) : IQueryHandler<GetModelListEntriesQuery, Result<List<ModelListEntryDto>>>
    {
        public async ValueTask<Result<List<ModelListEntryDto>>> Handle(GetModelListEntriesQuery query, CancellationToken cancellationToken)
        {
            var entries = await dbContext.ModelListEntries.ToListAsync(cancellationToken);
            return Result<List<ModelListEntryDto>>.Success(entries.Select(e => e.ToDto()).ToList());
        }
    }
}
