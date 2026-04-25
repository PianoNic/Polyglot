using Mediator;
using Microsoft.AspNetCore.Mvc;
using Polyglot.Application.Command;
using Polyglot.Application.Dtos;
using Polyglot.Application.Queries;
using Polyglot.Infrastructure.Dtos;

namespace Polyglot.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController(IMediator mediator) : ControllerBase
    {
        [HttpGet("all-models")]
        [ProducesResponseType(typeof(List<AvailableModelDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAllModels(CancellationToken cancellationToken)
        {
            var result = await mediator.Send(new GetAllModelsQuery(), cancellationToken);
            if (result.IsSuccess)
                return Ok(result.Value);

            return BadRequest(result.Error);
        }

        [HttpGet("models")]
        [ProducesResponseType(typeof(List<ModelListEntryDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetModelListEntries(CancellationToken cancellationToken)
        {
            var result = await mediator.Send(new GetModelListEntriesQuery(), cancellationToken);
            if (result.IsSuccess)
                return Ok(result.Value);

            return BadRequest(result.Error);
        }

        [HttpPost("models")]
        [ProducesResponseType(typeof(ModelListEntryDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> AddModelListEntry([FromBody] AddModelListEntryCommand command, CancellationToken cancellationToken)
        {
            var result = await mediator.Send(command, cancellationToken);
            if (result.IsSuccess)
                return Ok(result.Value);

            return BadRequest(result.Error);
        }

        [HttpDelete("models/{id:guid}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> RemoveModelListEntry(Guid id, CancellationToken cancellationToken)
        {
            var result = await mediator.Send(new RemoveModelListEntryCommand(id), cancellationToken);
            if (result.IsSuccess)
                return NoContent();

            return BadRequest(result.Error);
        }

        [HttpGet("settings")]
        [ProducesResponseType(typeof(AdminSettingsDto), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAdminSettings(CancellationToken cancellationToken)
        {
            var result = await mediator.Send(new GetAdminSettingsQuery(), cancellationToken);
            if (result.IsSuccess)
                return Ok(result.Value);

            return BadRequest(result.Error);
        }

        [HttpPut("settings/list-mode")]
        [ProducesResponseType(typeof(AdminSettingsDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdateActiveModelListMode([FromBody] UpdateActiveModelListModeCommand command, CancellationToken cancellationToken)
        {
            var result = await mediator.Send(command, cancellationToken);
            if (result.IsSuccess)
                return Ok(result.Value);

            return BadRequest(result.Error);
        }

        [HttpPut("settings/price-cap")]
        [ProducesResponseType(typeof(AdminSettingsDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdatePriceCap([FromBody] UpdatePriceCapCommand command, CancellationToken cancellationToken)
        {
            var result = await mediator.Send(command, cancellationToken);
            if (result.IsSuccess)
                return Ok(result.Value);

            return BadRequest(result.Error);
        }
    }
}
