using Mediator;
using Polyglot.Application.Models;
using Polyglot.Application.Interfaces;

namespace Polyglot.Application.Command
{
    public record SyncUsersCommand() : ICommand<Result>;

    public class SyncUsersCommandHandler(ICurrentUserService userService) : ICommandHandler<SyncUsersCommand, Result>
    {
        public async ValueTask<Result> Handle(SyncUsersCommand command, CancellationToken cancellationToken)
        {
            
        }
    }
}
