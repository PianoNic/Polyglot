using Polyglot.Application.Dtos;
using Polyglot.Domain;

namespace Polyglot.Application.Mappers
{
    public static class ChatMapper
    {
        public static ChatDto ToDto(this Chat chat)
        {
            return new ChatDto
            {
                Id = chat.Id,
                Title = chat.Title,
                CreatedAt = chat.CreatedAt,
                UpdatedAt = chat.UpdatedAt,
            };
        }

        public static ChatDetailDto ToDetailDto(this Chat chat, ILookup<Guid, AttachmentDto> attachmentsByMessage)
        {
            return new ChatDetailDto
            {
                Id = chat.Id,
                Title = chat.Title,
                CreatedAt = chat.CreatedAt,
                UpdatedAt = chat.UpdatedAt,
                Messages = chat.Messages.OrderBy(message => message.SequenceNumber).Select(message => message.ToDto(attachmentsByMessage[message.Id].ToList())).ToList(),
            };
        }
    }
}
