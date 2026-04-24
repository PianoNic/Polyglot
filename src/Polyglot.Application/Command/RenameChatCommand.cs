using Mediator;
using Polyglot.Application.Interfaces;
using Polyglot.Application.Models;

namespace Polyglot.Application.Command
{
    public record RenameChatCommand(Guid ChatId, string Title) : ICommand<Result>;

    public class RenameChatCommandHandler(IUserService userService, IChatRepository chatRepository) : ICommandHandler<RenameChatCommand, Result>
    {
        public async ValueTask<Result> Handle(RenameChatCommand command, CancellationToken cancellationToken)
        {
            var userId = await userService.GetCurrentUserIdAsync(cancellationToken);
            var chat = await chatRepository.GetByIdAsync(command.ChatId, userId, cancellationToken);

            if (chat is null)
                return Result.Failure("Chat not found");

            chat.Title = command.Title;
            await chatRepository.SaveChangesAsync(cancellationToken);
            return Result.Success();
        }
    }
}
