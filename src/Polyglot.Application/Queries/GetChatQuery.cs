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
                .Include(chat => chat.Messages.OrderBy(message => message.SequenceNumber))
                .SingleOrDefaultAsync(chat => chat.Id == query.ChatId && chat.UserId == userId, cancellationToken);

            if (chat is null)
                return Result<ChatDetailDto>.Failure("Chat not found");

            var messageIds = chat.Messages.Select(message => message.Id).ToList();
            var attachments = await dbContext.Attachments
                .Where(attachment => attachment.MessageId != null && messageIds.Contains(attachment.MessageId.Value))
                .Select(attachment => new
                {
                    MessageId = attachment.MessageId!.Value,
                    Dto = new AttachmentDto
                    {
                        Id = attachment.Id,
                        FileName = attachment.FileName,
                        MediaType = attachment.MediaType,
                        SizeBytes = attachment.SizeBytes,
                    },
                })
                .ToListAsync(cancellationToken);
            var attachmentsByMessage = attachments.ToLookup(attachment => attachment.MessageId, attachment => attachment.Dto);

            return Result<ChatDetailDto>.Success(chat.ToDetailDto(attachmentsByMessage));
        }
    }
}
