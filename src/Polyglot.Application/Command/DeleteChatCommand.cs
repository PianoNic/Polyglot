using Mediator;
using Microsoft.EntityFrameworkCore;
using Polyglot.Application.Models;
using Polyglot.Infrastructure;
using Polyglot.Infrastructure.Services;

namespace Polyglot.Application.Command
{
    public record DeleteChatCommand(Guid ChatId) : ICommand<Result>;

    public class DeleteChatCommandHandler(IUserService userService, PolyglotDbContext dbContext) : ICommandHandler<DeleteChatCommand, Result>
    {
        public async ValueTask<Result> Handle(DeleteChatCommand command, CancellationToken cancellationToken)
        {
            var userId = await userService.GetCurrentUserIdAsync(cancellationToken);
            var chat = await dbContext.Chats.SingleOrDefaultAsync(c => c.Id == command.ChatId && c.UserId == userId, cancellationToken);

            if (chat is null)
                return Result.Failure("Chat not found");

            dbContext.Chats.Remove(chat);
            await dbContext.SaveChangesAsync(cancellationToken);
            return Result.Success();
        }
    }
}
