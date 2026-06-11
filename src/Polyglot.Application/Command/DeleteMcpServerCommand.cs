using Mediator;
using Microsoft.EntityFrameworkCore;
using Polyglot.Application.Mappers;
using Polyglot.Application.Models;
using Polyglot.Infrastructure;
using Polyglot.Infrastructure.Services;

namespace Polyglot.Application.Command
{
    public record DeleteMcpServerCommand(Guid Id) : ICommand<Result>;

    public class DeleteMcpServerCommandHandler(IUserService userService, PolyglotDbContext dbContext)
        : ICommandHandler<DeleteMcpServerCommand, Result>
    {
        public async ValueTask<Result> Handle(DeleteMcpServerCommand command, CancellationToken cancellationToken)
        {
            var userId = await userService.GetCurrentUserIdAsync(cancellationToken);
            var user = await dbContext.Users.SingleAsync(u => u.Id == userId, cancellationToken);

            var server = await dbContext.McpServers.SingleOrDefaultAsync(s => s.Id == command.Id, cancellationToken);
            if (server is null)
                return Result.Failure("MCP server not found");

            if (!McpServerAuthorization.CanManage(server, user))
                return Result.Failure("You are not allowed to manage this MCP server");

            dbContext.McpServers.Remove(server);
            await dbContext.SaveChangesAsync(cancellationToken);

            return Result.Success();
        }
    }
}
