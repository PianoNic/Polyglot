using Mediator;
using Microsoft.AspNetCore.Mvc;
using Polyglot.Application.Command;

namespace Polyglot.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController(IMediator mediator) : ControllerBase
    {
        [HttpGet("sync")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Sync(CancellationToken cancellationToken)
        {
            var result = await mediator.Send(new SyncUserCommand(), cancellationToken);
            if (result.IsSuccess)
                return NoContent();

            return BadRequest(result.Error);
        }
    }
}
