using Mediator;
using Polyglot.Application.Interfaces;
using Polyglot.Application.Models;

namespace Polyglot.Application.Command
{
    public record DeleteChatCommand(Guid ChatId) : ICommand<Result>;

    public class DeleteChatCommandHandler(IUserService userService, IChatRepository chatRepository) : ICommandHandler<DeleteChatCommand, Result>
    {
        public async ValueTask<Result> Handle(DeleteChatCommand command, CancellationToken cancellationToken)
        {
            var userId = await userService.GetCurrentUserIdAsync(cancellationToken);
            var chat = await chatRepository.GetByIdAsync(command.ChatId, userId, cancellationToken);

            if (chat is null)
                return Result.Failure("Chat not found");

            await chatRepository.DeleteAsync(chat, cancellationToken);
            return Result.Success();
        }
    }
}
