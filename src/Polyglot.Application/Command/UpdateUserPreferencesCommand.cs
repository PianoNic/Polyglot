using Mediator;
using Microsoft.EntityFrameworkCore;
using Polyglot.Application.Dtos;
using Polyglot.Application.Mappers;
using Polyglot.Application.Models;
using Polyglot.Infrastructure;
using Polyglot.Infrastructure.Services;

namespace Polyglot.Application.Command
{
    public record UpdateUserPreferencesCommand(string? PreferredImageModel) : ICommand<Result<UserDto>>;

    public class UpdateUserPreferencesCommandHandler(IUserService userService, PolyglotDbContext dbContext)
        : ICommandHandler<UpdateUserPreferencesCommand, Result<UserDto>>
    {
        public async ValueTask<Result<UserDto>> Handle(UpdateUserPreferencesCommand command, CancellationToken cancellationToken)
        {
            var userId = await userService.GetCurrentUserIdAsync(cancellationToken);
            var user = await dbContext.Users.SingleAsync(dbUser => dbUser.Id == userId, cancellationToken);

            user.Preferences.PreferredImageModel = string.IsNullOrWhiteSpace(command.PreferredImageModel)
                ? null
                : command.PreferredImageModel.Trim();

            await dbContext.SaveChangesAsync(cancellationToken);

            return Result<UserDto>.Success(user.ToDto());
        }
    }
}
