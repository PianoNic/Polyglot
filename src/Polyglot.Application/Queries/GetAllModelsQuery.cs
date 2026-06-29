using Mediator;
using Microsoft.EntityFrameworkCore;
using Polyglot.Application.Models;
using Polyglot.Infrastructure;
using Polyglot.Infrastructure.Dtos;

namespace Polyglot.Application.Queries
{
    public record GetAllModelsQuery() : IQuery<Result<List<AvailableModelDto>>>;

    public class GetAllModelsQueryHandler(PolyglotDbContext dbContext) : IQueryHandler<GetAllModelsQuery, Result<List<AvailableModelDto>>>
    {
        public async ValueTask<Result<List<AvailableModelDto>>> Handle(GetAllModelsQuery query, CancellationToken cancellationToken)
        {
            var models = await dbContext.Models
                .Select(model => new AvailableModelDto
                {
                    Id = model.ModelId,
                    Name = model.Name,
                    Provider = model.ModelId.Contains("/") ? model.ModelId.Substring(0, model.ModelId.IndexOf("/")) : string.Empty,
                    Currency = "USD",
                    ContextLength = model.ContextLength,
                    InputModalities = model.InputModalities,
                    OutputModalities = model.OutputModalities,
                    SupportedParameters = model.SupportedParameters,
                    InputPricePer1M = model.PromptPricePerMillion,
                    OutputPricePer1M = model.CompletionPricePerMillion,
                })
                .ToListAsync(cancellationToken);

            return Result<List<AvailableModelDto>>.Success(models);
        }
    }
}
