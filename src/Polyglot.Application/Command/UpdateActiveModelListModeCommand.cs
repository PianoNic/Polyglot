using Mediator;
using Microsoft.EntityFrameworkCore;
using Polyglot.Application.Dtos;
using Polyglot.Application.Models;
using Polyglot.Domain.Enums;
using Polyglot.Infrastructure;

namespace Polyglot.Application.Command
{
    public record UpdateActiveModelListModeCommand(ModelListMode Mode) : ICommand<Result<AdminSettingsDto>>;

    public class UpdateActiveModelListModeCommandHandler(PolyglotDbContext dbContext) : ICommandHandler<UpdateActiveModelListModeCommand, Result<AdminSettingsDto>>
    {
        public async ValueTask<Result<AdminSettingsDto>> Handle(UpdateActiveModelListModeCommand command, CancellationToken cancellationToken)
        {
            var settings = await dbContext.AdminSettings.SingleAsync(cancellationToken);
            settings.ActiveModelListMode = command.Mode;
            await dbContext.SaveChangesAsync(cancellationToken);
            return Result<AdminSettingsDto>.Success(new AdminSettingsDto(settings.MaxPricePerMillionTokens, settings.ActiveModelListMode));
        }
    }
}
