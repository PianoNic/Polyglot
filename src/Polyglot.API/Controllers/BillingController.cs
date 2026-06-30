using Mediator;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Polyglot.Application.Command;
using Polyglot.Application.Dtos;
using Polyglot.Application.Queries;
using Polyglot.Infrastructure.Services;

namespace Polyglot.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BillingController(IMediator mediator, IStripeBillingService billing) : ControllerBase
    {
        public record CheckoutRequest(string PriceId);

        [HttpGet("products")]
        [ProducesResponseType(typeof(BillingConfigDto), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetProducts(CancellationToken cancellationToken)
        {
            var result = await mediator.Send(new GetBillingProductsQuery(), cancellationToken);
            return result.IsSuccess ? Ok(result.Value) : BadRequest(result.Error);
        }

        [HttpPost("checkout")]
        [ProducesResponseType(typeof(CheckoutSessionDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Checkout([FromBody] CheckoutRequest request, CancellationToken cancellationToken)
        {
            var result = await mediator.Send(new CreateCheckoutSessionCommand(request.PriceId), cancellationToken);
            return result.IsSuccess ? Ok(result.Value) : BadRequest(result.Error);
        }

        [HttpPost("portal")]
        [ProducesResponseType(typeof(PortalSessionDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Portal(CancellationToken cancellationToken)
        {
            var result = await mediator.Send(new CreatePortalSessionCommand(), cancellationToken);
            return result.IsSuccess ? Ok(result.Value) : BadRequest(result.Error);
        }

        [HttpPost("webhook")]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Webhook(CancellationToken cancellationToken)
        {
            var json = await new StreamReader(Request.Body).ReadToEndAsync(cancellationToken);
            var signature = Request.Headers["Stripe-Signature"].ToString();

            StripeGrant? grant;
            try
            {
                grant = billing.ParseWebhook(json, signature);
            }
            catch (Exception)
            {
                return BadRequest();
            }

            if (grant is not null)
            {
                var result = await mediator.Send(
                    new GrantStripeCreditsCommand(grant.EventId, grant.UserId, grant.StripeCustomerId, grant.Credits),
                    cancellationToken);
                if (result.IsFailure)
                    return BadRequest(result.Error);
            }

            return Ok();
        }
    }
}
