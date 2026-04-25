using Mediator;
using Microsoft.EntityFrameworkCore;
using Polyglot.Application.Dtos;
using Polyglot.Application.Mappers;
using Polyglot.Application.Models;
using Polyglot.Infrastructure;
using Polyglot.Infrastructure.Services;

namespace Polyglot.Application.Queries
{
    public record GetChatsQuery() : IQuery<Result<List<ChatDto>>>;

    public class GetChatsQueryHandler(IUserService userService, PolyglotDbContext dbContext) : IQueryHandler<GetChatsQuery, Result<List<ChatDto>>>
    {
        public async ValueTask<Result<List<ChatDto>>> Handle(GetChatsQuery query, CancellationToken cancellationToken)
        {
            var userId = await userService.GetCurrentUserIdAsync(cancellationToken);
            var chats = await dbContext.Chats
                .Where(c => c.UserId == userId)
                .OrderByDescending(c => c.UpdatedAt)
                .ToListAsync(cancellationToken);
            return Result<List<ChatDto>>.Success(chats.Select(c => c.ToDto()).ToList());
        }
    }
}
