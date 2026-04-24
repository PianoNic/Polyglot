using Mediator;
using Polyglot.Application.Interfaces;
using Polyglot.Application.Models;

namespace Polyglot.Application.Command
{
    public record RemoveModelListEntryCommand(Guid Id) : ICommand<Result>;

    public class RemoveModelListEntryCommandHandler(IModelListRepository modelListRepository) : ICommandHandler<RemoveModelListEntryCommand, Result>
    {
        public async ValueTask<Result> Handle(RemoveModelListEntryCommand command, CancellationToken cancellationToken)
        {
            var removed = await modelListRepository.RemoveAsync(command.Id, cancellationToken);
            return removed ? Result.Success() : Result.Failure("Entry not found");
        }
    }
}
