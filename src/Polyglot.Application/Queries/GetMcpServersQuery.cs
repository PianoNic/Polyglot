using Mediator;
using Microsoft.EntityFrameworkCore;
using Polyglot.Application.Dtos;
using Polyglot.Application.Mappers;
using Polyglot.Application.Models;
using Polyglot.Infrastructure;
using Polyglot.Infrastructure.Services;

namespace Polyglot.Application.Queries
{
    // Returns the servers visible to the current user: every shared/global server plus
    // the user's own servers, each flagged with whether the caller may manage it.
    public record GetMcpServersQuery() : IQuery<Result<List<McpServerDto>>>;

    public class GetMcpServersQueryHandler(IUserService userService, PolyglotDbContext dbContext)
        : IQueryHandler<GetMcpServersQuery, Result<List<McpServerDto>>>
    {
        public async ValueTask<Result<List<McpServerDto>>> Handle(GetMcpServersQuery query, CancellationToken cancellationToken)
        {
            var userId = await userService.GetCurrentUserIdAsync(cancellationToken);
            var user = await dbContext.Users.SingleAsync(u => u.Id == userId, cancellationToken);

            var servers = await dbContext.McpServers
                .Where(s => s.UserId == null || s.UserId == userId)
                .AsNoTracking()
                .OrderByDescending(s => s.UserId == null)
                .ThenBy(s => s.Name)
                .ToListAsync(cancellationToken);

            var dtos = servers
                .Select(s => s.ToDto(canManage: McpServerAuthorization.CanManage(s, user)))
                .ToList();

            return Result<List<McpServerDto>>.Success(dtos);
        }
    }
}
