using Mediator;
using Microsoft.EntityFrameworkCore;
using Polyglot.Application.Dtos;
using Polyglot.Application.Mappers;
using Polyglot.Application.Models;
using Polyglot.Domain.Enums;
using Polyglot.Infrastructure;
using Polyglot.Infrastructure.Services;

namespace Polyglot.Application.Command
{
    // AuthorizationHeader convention: null keeps the existing secret, an empty string clears it,
    // and any other value replaces it. This lets the UI edit a server without re-entering the secret.
    public record UpdateMcpServerCommand(
        Guid Id,
        string Name,
        string Url,
        McpTransportMode TransportMode,
        string? AuthorizationHeader,
        bool Enabled) : ICommand<Result<McpServerDto>>;

    public class UpdateMcpServerCommandHandler(IUserService userService, PolyglotDbContext dbContext)
        : ICommandHandler<UpdateMcpServerCommand, Result<McpServerDto>>
    {
        public async ValueTask<Result<McpServerDto>> Handle(UpdateMcpServerCommand command, CancellationToken cancellationToken)
        {
            var userId = await userService.GetCurrentUserIdAsync(cancellationToken);
            var user = await dbContext.Users.SingleAsync(user => user.Id == userId, cancellationToken);

            var server = await dbContext.McpServers.SingleOrDefaultAsync(server => server.Id == command.Id, cancellationToken);
            if (server is null)
                return Result<McpServerDto>.Failure("MCP server not found");

            if (!McpServerAuthorization.CanManage(server, user))
                return Result<McpServerDto>.Failure("You are not allowed to manage this MCP server");

            var validation = McpServerValidation.Validate(command.Name, command.Url);
            if (validation is not null)
                return Result<McpServerDto>.Failure(validation);

            server.Name = command.Name.Trim();
            server.Url = command.Url.Trim();
            server.TransportMode = command.TransportMode;
            server.Enabled = command.Enabled;
            if (command.AuthorizationHeader is not null)
                server.AuthorizationHeader = command.AuthorizationHeader.Length == 0 ? null : command.AuthorizationHeader;

            await dbContext.SaveChangesAsync(cancellationToken);

            return Result<McpServerDto>.Success(server.ToDto(canManage: true));
        }
    }
}
