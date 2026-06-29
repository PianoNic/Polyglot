using Mediator;
using Microsoft.EntityFrameworkCore;
using Polyglot.Application.Dtos;
using Polyglot.Application.Mappers;
using Polyglot.Application.Models;
using Polyglot.Domain;
using Polyglot.Domain.Enums;
using Polyglot.Infrastructure;
using Polyglot.Infrastructure.Services;

namespace Polyglot.Application.Command
{
    // Global == true creates a shared server visible to everyone and requires the admin role.
    public record CreateMcpServerCommand(
        string Name,
        string Url,
        McpTransportMode TransportMode,
        string? AuthorizationHeader,
        bool Enabled,
        bool Global) : ICommand<Result<McpServerDto>>;

    public class CreateMcpServerCommandHandler(IUserService userService, PolyglotDbContext dbContext)
        : ICommandHandler<CreateMcpServerCommand, Result<McpServerDto>>
    {
        public async ValueTask<Result<McpServerDto>> Handle(CreateMcpServerCommand command, CancellationToken cancellationToken)
        {
            var userId = await userService.GetCurrentUserIdAsync(cancellationToken);
            var user = await dbContext.Users.SingleAsync(dbUser => dbUser.Id == userId, cancellationToken);

            if (command.Global && user.Role != UserRole.Admin)
                return Result<McpServerDto>.Failure("Only administrators can manage shared MCP servers");

            var validation = McpServerValidation.Validate(command.Name, command.Url);
            if (validation is not null)
                return Result<McpServerDto>.Failure(validation);

            var server = new McpServer
            {
                Name = command.Name.Trim(),
                Url = command.Url.Trim(),
                TransportMode = command.TransportMode,
                AuthorizationHeader = string.IsNullOrWhiteSpace(command.AuthorizationHeader) ? null : command.AuthorizationHeader,
                Enabled = command.Enabled,
                UserId = command.Global ? null : userId
            };

            dbContext.McpServers.Add(server);
            await dbContext.SaveChangesAsync(cancellationToken);

            return Result<McpServerDto>.Success(server.ToDto(canManage: true));
        }
    }
}
