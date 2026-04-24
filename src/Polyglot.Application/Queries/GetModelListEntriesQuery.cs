using Mediator;
using Polyglot.Application.Dtos;
using Polyglot.Application.Interfaces;
using Polyglot.Application.Mappers;
using Polyglot.Application.Models;

namespace Polyglot.Application.Queries
{
    public record GetModelListEntriesQuery() : IQuery<Result<List<ModelListEntryDto>>>;

    public class GetModelListEntriesQueryHandler(IModelListRepository modelListRepository) : IQueryHandler<GetModelListEntriesQuery, Result<List<ModelListEntryDto>>>
    {
        public async ValueTask<Result<List<ModelListEntryDto>>> Handle(GetModelListEntriesQuery query, CancellationToken cancellationToken)
        {
            var entries = await modelListRepository.GetAllAsync(cancellationToken);
            return Result<List<ModelListEntryDto>>.Success(entries.Select(e => e.ToDto()).ToList());
        }
    }
}
