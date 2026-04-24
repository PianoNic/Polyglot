using Mediator;
using Polyglot.Application.Dtos;
using Polyglot.Application.Interfaces;
using Polyglot.Application.Mappers;
using Polyglot.Application.Models;

namespace Polyglot.Application.Queries
{
    public record GetChatQuery(Guid ChatId) : IQuery<Result<ChatDetailDto>>;

    public class GetChatQueryHandler(IUserService userService, IChatRepository chatRepository) : IQueryHandler<GetChatQuery, Result<ChatDetailDto>>
    {
        public async ValueTask<Result<ChatDetailDto>> Handle(GetChatQuery query, CancellationToken cancellationToken)
        {
            var userId = await userService.GetCurrentUserIdAsync(cancellationToken);
            var chat = await chatRepository.GetByIdAsync(query.ChatId, userId, cancellationToken);

            if (chat is null)
                return Result<ChatDetailDto>.Failure("Chat not found");

            return Result<ChatDetailDto>.Success(chat.ToDetailDto());
        }
    }
}
