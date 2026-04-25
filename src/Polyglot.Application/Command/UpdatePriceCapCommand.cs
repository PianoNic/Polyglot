using Mediator;
using Microsoft.EntityFrameworkCore;
using Polyglot.Application.Dtos;
using Polyglot.Application.Models;
using Polyglot.Infrastructure;

namespace Polyglot.Application.Command
{
    public record UpdatePriceCapCommand(decimal? MaxPricePerMillionTokens) : ICommand<Result<AdminSettingsDto>>;

    public class UpdatePriceCapCommandHandler(PolyglotDbContext dbContext) : ICommandHandler<UpdatePriceCapCommand, Result<AdminSettingsDto>>
    {
        public async ValueTask<Result<AdminSettingsDto>> Handle(UpdatePriceCapCommand command, CancellationToken cancellationToken)
        {
            var settings = await dbContext.AdminSettings.SingleAsync(cancellationToken);
            settings.MaxPricePerMillionTokens = command.MaxPricePerMillionTokens;
            await dbContext.SaveChangesAsync(cancellationToken);
            return Result<AdminSettingsDto>.Success(new AdminSettingsDto(settings.MaxPricePerMillionTokens, settings.ActiveModelListMode));
        }
    }
}
