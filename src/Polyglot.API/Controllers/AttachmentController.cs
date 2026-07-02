using Mediator;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;
using Polyglot.Application.Command;
using Polyglot.Application.Dtos;
using Polyglot.Application.Queries;

namespace Polyglot.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AttachmentController(IMediator mediator) : ControllerBase
    {
        [HttpPost]
        [RequestSizeLimit(6 * 1024 * 1024)]
        [ProducesResponseType(typeof(AttachmentDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Upload(IFormFile file, CancellationToken cancellationToken)
        {
            using var stream = new MemoryStream();
            await file.CopyToAsync(stream, cancellationToken);

            var result = await mediator.Send(new UploadAttachmentCommand(file.FileName, file.ContentType, stream.ToArray()), cancellationToken);
            if (result.IsSuccess)
                return Ok(result.Value);

            return BadRequest(result.Error);
        }

        [HttpGet("{id:guid}")]
        [ProducesResponseType(typeof(FileContentResult), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Download(Guid id, CancellationToken cancellationToken)
        {
            var result = await mediator.Send(new GetAttachmentQuery(id), cancellationToken);
            if (!result.IsSuccess)
                return BadRequest(result.Error);

            Response.Headers.CacheControl = "private, max-age=31536000, immutable";
            var entityTag = new EntityTagHeaderValue($"\"{id}\"");
            return File(result.Value!.Data, result.Value.MediaType, result.Value.FileName, lastModified: null, entityTag: entityTag);
        }
    }
}
