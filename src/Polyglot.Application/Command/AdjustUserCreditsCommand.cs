using Mediator;
using Microsoft.EntityFrameworkCore;
using Polyglot.Application.Models;
using Polyglot.Infrastructure;

namespace Polyglot.Application.Command
{
    public record AdjustUserCreditsCommand(Guid UserId, long Amount) : ICommand<Result>;

    public class AdjustUserCreditsCommandHandler(PolyglotDbContext dbContext) : ICommandHandler<AdjustUserCreditsCommand, Result>
    {
        public async ValueTask<Result> Handle(AdjustUserCreditsCommand command, CancellationToken cancellationToken)
        {
            var user = await dbContext.Users.SingleOrDefaultAsync(u => u.Id == command.UserId, cancellationToken);
            if (user is null)
                return Result.Failure("User not found");

            user.CreditBalance += command.Amount;

            if (user.CreditBalance < 0)
                return Result.Failure("Credit balance cannot go below zero");

            await dbContext.SaveChangesAsync(cancellationToken);

            return Result.Success();
        }
    }
}
