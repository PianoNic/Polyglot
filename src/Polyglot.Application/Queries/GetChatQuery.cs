using Mediator;
using Microsoft.EntityFrameworkCore;
using Polyglot.Application.Dtos;
using Polyglot.Application.Mappers;
using Polyglot.Application.Models;
using Polyglot.Infrastructure;
using Polyglot.Infrastructure.Services;

namespace Polyglot.Application.Queries
{
    public record GetChatQuery(Guid ChatId) : IQuery<Result<ChatDetailDto>>;

    public class GetChatQueryHandler(IUserService userService, PolyglotDbContext dbContext) : IQueryHandler<GetChatQuery, Result<ChatDetailDto>>
    {
        public async ValueTask<Result<ChatDetailDto>> Handle(GetChatQuery query, CancellationToken cancellationToken)
        {
            var userId = await userService.GetCurrentUserIdAsync(cancellationToken);
            var chat = await dbContext.Chats
                .Include(c => c.Messages.OrderBy(m => m.SequenceNumber))
                .SingleOrDefaultAsync(c => c.Id == query.ChatId && c.UserId == userId, cancellationToken);

            if (chat is null)
                return Result<ChatDetailDto>.Failure("Chat not found");

            return Result<ChatDetailDto>.Success(chat.ToDetailDto());
        }
    }
}
