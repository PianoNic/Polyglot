using Mediator;
using Microsoft.EntityFrameworkCore;
using Polyglot.Application.Models;
using Polyglot.Domain;
using Polyglot.Infrastructure;

namespace Polyglot.Application.Command
{
    // Grants credits from a verified Stripe webhook event. Idempotent: the Stripe event
    // id is recorded so retried deliveries of the same event credit the user only once.
    public record GrantStripeCreditsCommand(string EventId, Guid? UserId, string? StripeCustomerId, long Credits)
        : ICommand<Result>;

    public class GrantStripeCreditsCommandHandler(PolyglotDbContext dbContext)
        : ICommandHandler<GrantStripeCreditsCommand, Result>
    {
        public async ValueTask<Result> Handle(GrantStripeCreditsCommand command, CancellationToken cancellationToken)
        {
            if (command.Credits <= 0)
                return Result.Failure("Credits must be positive");

            if (await dbContext.StripeEvents.AnyAsync(e => e.Id == command.EventId, cancellationToken))
                return Result.Success();

            var user = command.UserId is { } userId
                ? await dbContext.Users.SingleOrDefaultAsync(u => u.Id == userId, cancellationToken)
                : !string.IsNullOrEmpty(command.StripeCustomerId)
                    ? await dbContext.Users.SingleOrDefaultAsync(u => u.StripeCustomerId == command.StripeCustomerId, cancellationToken)
                    : null;

            if (user is null)
                return Result.Failure("User not found for Stripe grant");

            user.CreditBalance += command.Credits;
            dbContext.StripeEvents.Add(new StripeEvent { Id = command.EventId });
            await dbContext.SaveChangesAsync(cancellationToken);

            return Result.Success();
        }
    }
}
