using Mediator;
using Microsoft.AspNetCore.Mvc;
using Polyglot.Application.Command;
using Polyglot.Application.Dtos;
using Polyglot.Application.Queries;

namespace Polyglot.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class McpController(IMediator mediator) : ControllerBase
    {
        // Returns the shared (global) servers plus the caller's own servers. Each entry
        // carries a canManage flag; creating or editing a global server requires admin rights,
        // which the command handlers enforce.
        [HttpGet("servers")]
        [ProducesResponseType(typeof(List<McpServerDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetServers(CancellationToken cancellationToken)
        {
            var result = await mediator.Send(new GetMcpServersQuery(), cancellationToken);
            if (result.IsSuccess)
                return Ok(result.Value);

            return BadRequest(result.Error);
        }

        [HttpPost("servers")]
        [ProducesResponseType(typeof(McpServerDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateServer([FromBody] CreateMcpServerCommand command, CancellationToken cancellationToken)
        {
            var result = await mediator.Send(command, cancellationToken);
            if (result.IsSuccess)
                return Ok(result.Value);

            return BadRequest(result.Error);
        }

        [HttpPut("servers/{id:guid}")]
        [ProducesResponseType(typeof(McpServerDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdateServer(Guid id, [FromBody] UpdateMcpServerCommand command, CancellationToken cancellationToken)
        {
            var result = await mediator.Send(command with { Id = id }, cancellationToken);
            if (result.IsSuccess)
                return Ok(result.Value);

            return BadRequest(result.Error);
        }

        [HttpDelete("servers/{id:guid}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> DeleteServer(Guid id, CancellationToken cancellationToken)
        {
            var result = await mediator.Send(new DeleteMcpServerCommand(id), cancellationToken);
            if (result.IsSuccess)
                return NoContent();

            return BadRequest(result.Error);
        }
    }
}
