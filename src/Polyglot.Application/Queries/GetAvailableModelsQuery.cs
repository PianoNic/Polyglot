using Mediator;
using Microsoft.EntityFrameworkCore;
using Polyglot.Application.Models;
using Polyglot.Domain.Enums;
using Polyglot.Infrastructure;
using Polyglot.Infrastructure.Dtos;

namespace Polyglot.Application.Queries
{
    public record GetAvailableModelsQuery() : IQuery<Result<List<AvailableModelDto>>>;

    public class GetAvailableModelsQueryHandler(PolyglotDbContext dbContext) : IQueryHandler<GetAvailableModelsQuery, Result<List<AvailableModelDto>>>
    {
        public async ValueTask<Result<List<AvailableModelDto>>> Handle(GetAvailableModelsQuery query, CancellationToken cancellationToken)
        {
            var settings = await dbContext.AdminSettings.SingleAsync(cancellationToken);

            var modelsQuery = dbContext.Models.AsQueryable();

            if (settings.ActiveModelListMode == ModelListMode.Whitelist)
            {
                var whitelistIds = dbContext.ModelListEntries
                    .Where(entry => entry.ListType == ModelListType.Whitelist)
                    .Select(entry => entry.ModelId);
                modelsQuery = modelsQuery.Where(model => whitelistIds.Contains(model.ModelId));
            }
            else if (settings.ActiveModelListMode == ModelListMode.Blacklist)
            {
                var blacklistIds = dbContext.ModelListEntries
                    .Where(entry => entry.ListType == ModelListType.Blacklist)
                    .Select(entry => entry.ModelId);
                modelsQuery = modelsQuery.Where(model => !blacklistIds.Contains(model.ModelId));
            }

            if (settings.MaxPricePerMillionTokens is not null)
            {
                var cap = settings.MaxPricePerMillionTokens.Value;
                modelsQuery = modelsQuery.Where(model => model.PromptPricePerMillion <= cap && model.CompletionPricePerMillion <= cap);
            }

            var models = await modelsQuery
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
