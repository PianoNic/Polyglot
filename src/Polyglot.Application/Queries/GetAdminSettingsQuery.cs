using Mediator;
using Polyglot.Application.Dtos;
using Polyglot.Application.Interfaces;
using Polyglot.Application.Models;

namespace Polyglot.Application.Queries
{
    public record GetAdminSettingsQuery() : IQuery<Result<AdminSettingsDto>>;

    public class GetAdminSettingsQueryHandler(IAdminSettingsRepository adminSettingsRepository) : IQueryHandler<GetAdminSettingsQuery, Result<AdminSettingsDto>>
    {
        public async ValueTask<Result<AdminSettingsDto>> Handle(GetAdminSettingsQuery query, CancellationToken cancellationToken)
        {
            var settings = await adminSettingsRepository.GetAsync(cancellationToken);
            return Result<AdminSettingsDto>.Success(new AdminSettingsDto(settings.MaxPricePerMillionTokens));
        }
    }
}
