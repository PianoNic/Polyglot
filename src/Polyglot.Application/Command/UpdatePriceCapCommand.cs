using Mediator;
using Polyglot.Application.Dtos;
using Polyglot.Application.Interfaces;
using Polyglot.Application.Models;

namespace Polyglot.Application.Command
{
    public record UpdatePriceCapCommand(decimal? MaxPricePerMillionTokens) : ICommand<Result<AdminSettingsDto>>;

    public class UpdatePriceCapCommandHandler(IAdminSettingsRepository adminSettingsRepository) : ICommandHandler<UpdatePriceCapCommand, Result<AdminSettingsDto>>
    {
        public async ValueTask<Result<AdminSettingsDto>> Handle(UpdatePriceCapCommand command, CancellationToken cancellationToken)
        {
            var settings = await adminSettingsRepository.GetAsync(cancellationToken);
            settings.MaxPricePerMillionTokens = command.MaxPricePerMillionTokens;
            await adminSettingsRepository.SaveChangesAsync(cancellationToken);
            return Result<AdminSettingsDto>.Success(new AdminSettingsDto(settings.MaxPricePerMillionTokens));
        }
    }
}
