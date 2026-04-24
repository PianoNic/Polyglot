using Mediator;
using Polyglot.Application.Dtos;
using Polyglot.Application.Interfaces;
using Polyglot.Application.Mappers;
using Polyglot.Application.Models;
using Polyglot.Domain;
using Polyglot.Domain.Enums;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.ChatCompletion;

namespace Polyglot.Application.Command
{
    public record SendMessageCommand(Guid? ChatId, string Message, string? Model) : ICommand<Result<SendMessageDto>>;

    public class SendMessageCommandHandler(IUserService userService, IChatRepository chatRepository, IChatCompletionService chatCompletionService) : ICommandHandler<SendMessageCommand, Result<SendMessageDto>>
    {
        public async ValueTask<Result<SendMessageDto>> Handle(SendMessageCommand command, CancellationToken cancellationToken)
        {
            var userId = await userService.GetCurrentUserIdAsync(cancellationToken);

            Chat chat;
            if (command.ChatId is not null)
            {
                var existing = await chatRepository.GetByIdAsync(command.ChatId.Value, userId, cancellationToken);
                if (existing is null)
                    return Result<SendMessageDto>.Failure("Chat not found");
                chat = existing;
            }
            else
            {
                chat = await chatRepository.CreateAsync(userId, "New Chat", cancellationToken);
            }

            var nextSequence = chat.Messages.Select(m => m.SequenceNumber).DefaultIfEmpty(-1).Max() + 1;

            var userMessage = new Message
            {
                ChatId = chat.Id,
                Role = MessageRole.User,
                Content = command.Message,
                SequenceNumber = nextSequence
            };

            chat.Messages.Add(userMessage);

            var history = new ChatHistory();
            foreach (var msg in chat.Messages.OrderBy(m => m.SequenceNumber))
            {
                switch (msg.Role)
                {
                    case MessageRole.User:
                        history.AddUserMessage(msg.Content);
                        break;
                    case MessageRole.Assistant:
                        history.AddAssistantMessage(msg.Content);
                        break;
                    case MessageRole.System:
                        history.AddSystemMessage(msg.Content);
                        break;
                }
            }

            var settings = command.Model is not null ? new PromptExecutionSettings { ModelId = command.Model } : null;

            var response = await chatCompletionService.GetChatMessageContentAsync(history, settings, cancellationToken: cancellationToken);

            var assistantMessage = new Message
            {
                ChatId = chat.Id,
                Role = MessageRole.Assistant,
                Content = response.Content ?? string.Empty,
                Model = command.Model,
                FinishReason = response.Metadata?.TryGetValue("FinishReason", out var fr) == true ? fr?.ToString() : null,
                SequenceNumber = nextSequence + 1
            };
            chat.Messages.Add(assistantMessage);

            if (chat.Title == "New Chat" && nextSequence == 0)
            {
                chat.Title = command.Message.Length > 50
                    ? command.Message[..50] + "..."
                    : command.Message;
            }

            await chatRepository.SaveChangesAsync(cancellationToken);

            return Result<SendMessageDto>.Success(new SendMessageDto(chat.Id, userMessage.ToDto(), assistantMessage.ToDto()));
        }
    }
}
