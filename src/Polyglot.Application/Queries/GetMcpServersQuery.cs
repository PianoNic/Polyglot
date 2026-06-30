using Mediator;
using Microsoft.EntityFrameworkCore;
using Polyglot.Application.Dtos;
using Polyglot.Application.Mappers;
using Polyglot.Application.Models;
using Polyglot.Infrastructure;
using Polyglot.Infrastructure.Services;

namespace Polyglot.Application.Queries
{
    public record GetMcpServersQuery() : IQuery<Result<List<McpServerDto>>>;

    public class GetMcpServersQueryHandler(IUserService userService, PolyglotDbContext dbContext)
        : IQueryHandler<GetMcpServersQuery, Result<List<McpServerDto>>>
    {
        public async ValueTask<Result<List<McpServerDto>>> Handle(GetMcpServersQuery query, CancellationToken cancellationToken)
        {
            var userId = await userService.GetCurrentUserIdAsync(cancellationToken);
            var user = await dbContext.Users.SingleAsync(user => user.Id == userId, cancellationToken);

            var servers = await dbContext.McpServers
                .Where(server => server.UserId == null || server.UserId == userId)
                .AsNoTracking()
                .OrderByDescending(server => server.UserId == null)
                .ThenBy(server => server.Name)
                .ToListAsync(cancellationToken);

            var dtos = servers
                .Select(server => server.ToDto(canManage: McpServerAuthorization.CanManage(server, user)))
                .ToList();

            return Result<List<McpServerDto>>.Success(dtos);
        }
    }
}
