using Mediator;
using Polyglot.Application.Dtos;
using Polyglot.Application.Interfaces;
using Polyglot.Application.Models;
using Polyglot.Domain.Enums;

namespace Polyglot.Application.Queries
{
    public record GetAvailableModelsQuery() : IQuery<Result<List<AvailableModelDto>>>;

    public class GetAvailableModelsQueryHandler(IOpenRouterClient openRouterClient, IModelListRepository modelListRepository, IAdminSettingsRepository adminSettingsRepository) : IQueryHandler<GetAvailableModelsQuery, Result<List<AvailableModelDto>>>
    {
        public async ValueTask<Result<List<AvailableModelDto>>> Handle(GetAvailableModelsQuery query, CancellationToken cancellationToken)
        {
            var models = await openRouterClient.GetModelsAsync(cancellationToken);
            var listEntries = await modelListRepository.GetAllAsync(cancellationToken);
            var settings = await adminSettingsRepository.GetAsync(cancellationToken);

            var whitelist = listEntries.Where(e => e.ListType == ModelListType.Whitelist).Select(e => e.ModelId).ToHashSet();
            var blacklist = listEntries.Where(e => e.ListType == ModelListType.Blacklist).Select(e => e.ModelId).ToHashSet();

            var filtered = models.AsEnumerable();

            if (whitelist.Count > 0)
                filtered = filtered.Where(m => whitelist.Contains(m.Id));

            filtered = filtered.Where(m => !blacklist.Contains(m.Id));

            if (settings.MaxPricePerMillionTokens is not null)
            {
                var cap = settings.MaxPricePerMillionTokens.Value;
                filtered = filtered.Where(m => Math.Max(m.PromptPricePerMillion, m.CompletionPricePerMillion) <= cap);
            }

            return Result<List<AvailableModelDto>>.Success(filtered.ToList());
        }
    }
}
