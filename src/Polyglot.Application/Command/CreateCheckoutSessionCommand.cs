using Mediator;
using Polyglot.Application.Dtos;
using Polyglot.Application.Models;
using Polyglot.Infrastructure.Services;

namespace Polyglot.Application.Command
{
    // Starts a Stripe Checkout session for the current user and the chosen price,
    // returning the hosted-checkout URL the client redirects to.
    public record CreateCheckoutSessionCommand(string PriceId) : ICommand<Result<CheckoutSessionDto>>;

    public class CreateCheckoutSessionCommandHandler(IUserService userService, IStripeBillingService billing)
        : ICommandHandler<CreateCheckoutSessionCommand, Result<CheckoutSessionDto>>
    {
        public async ValueTask<Result<CheckoutSessionDto>> Handle(CreateCheckoutSessionCommand command, CancellationToken cancellationToken)
        {
            if (!billing.IsConfigured)
                return Result<CheckoutSessionDto>.Failure("Billing is not configured.");

            var products = await billing.GetProductsAsync(cancellationToken);
            if (products.All(product => product.PriceId != command.PriceId))
                return Result<CheckoutSessionDto>.Failure("Unknown product.");

            var userId = await userService.GetCurrentUserIdAsync(cancellationToken);

            try
            {
                var url = await billing.CreateCheckoutSessionAsync(userId, command.PriceId, cancellationToken);
                return Result<CheckoutSessionDto>.Success(new CheckoutSessionDto { Url = url });
            }
            catch (Exception ex)
            {
                return Result<CheckoutSessionDto>.Failure(ex.Message);
            }
        }
    }
}
