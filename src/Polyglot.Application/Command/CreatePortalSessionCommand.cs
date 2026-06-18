using Mediator;
using Polyglot.Application.Dtos;
using Polyglot.Application.Models;
using Polyglot.Infrastructure.Services;

namespace Polyglot.Application.Command
{
    // Starts a Stripe Customer Portal session for the current user so they can manage
    // or cancel a subscription, returning the hosted-portal URL the client redirects to.
    public record CreatePortalSessionCommand() : ICommand<Result<PortalSessionDto>>;

    public class CreatePortalSessionCommandHandler(IUserService userService, IStripeBillingService billing)
        : ICommandHandler<CreatePortalSessionCommand, Result<PortalSessionDto>>
    {
        public async ValueTask<Result<PortalSessionDto>> Handle(CreatePortalSessionCommand command, CancellationToken cancellationToken)
        {
            if (!billing.IsConfigured)
                return Result<PortalSessionDto>.Failure("Billing is not configured.");

            var userId = await userService.GetCurrentUserIdAsync(cancellationToken);

            try
            {
                var url = await billing.CreatePortalSessionAsync(userId, cancellationToken);
                return Result<PortalSessionDto>.Success(new PortalSessionDto { Url = url });
            }
            catch (Exception ex)
            {
                return Result<PortalSessionDto>.Failure(ex.Message);
            }
        }
    }
}
