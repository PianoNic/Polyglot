using Mediator;
using Polyglot.Application.Models;
using Polyglot.Infrastructure;

namespace Polyglot.Application.Command
{
    public record RemoveModelListEntryCommand(Guid Id) : ICommand<Result>;

    public class RemoveModelListEntryCommandHandler(PolyglotDbContext dbContext) : ICommandHandler<RemoveModelListEntryCommand, Result>
    {
        public async ValueTask<Result> Handle(RemoveModelListEntryCommand command, CancellationToken cancellationToken)
        {
            var entry = await dbContext.ModelListEntries.FindAsync([command.Id], cancellationToken);
            if (entry is null) 
                return Result.Failure("Entry not found");

            dbContext.ModelListEntries.Remove(entry);
            await dbContext.SaveChangesAsync(cancellationToken);
            return Result.Success();
        }
    }
}
