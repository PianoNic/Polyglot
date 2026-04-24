using Mediator;
using Polyglot.Application.Dtos;
using Polyglot.Application.Interfaces;
using Polyglot.Application.Mappers;
using Polyglot.Application.Models;

namespace Polyglot.Application.Queries
{
    public record GetChatsQuery() : IQuery<Result<List<ChatDto>>>;

    public class GetChatsQueryHandler(IUserService userService, IChatRepository chatRepository) : IQueryHandler<GetChatsQuery, Result<List<ChatDto>>>
    {
        public async ValueTask<Result<List<ChatDto>>> Handle(GetChatsQuery query, CancellationToken cancellationToken)
        {
            var userId = await userService.GetCurrentUserIdAsync(cancellationToken);
            var chats = await chatRepository.GetAllByUserAsync(userId, cancellationToken);
            return Result<List<ChatDto>>.Success(chats.Select(c => c.ToDto()).ToList());
        }
    }
}
