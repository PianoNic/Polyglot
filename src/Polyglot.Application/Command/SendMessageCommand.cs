using System.ComponentModel;
using System.Runtime.CompilerServices;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Mediator;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.AI;
using Microsoft.Extensions.Configuration;
using Polyglot.Application.Dtos;
using Polyglot.Application.Mappers;
using Polyglot.Domain;
using Polyglot.Domain.Enums;
using Polyglot.Infrastructure;
using Polyglot.Infrastructure.Clients;
using Polyglot.Infrastructure.Extensions;
using Polyglot.Infrastructure.Services;

namespace Polyglot.Application.Command
{
    public record SendMessageCommand(Guid? ChatId, string Message, string Model, List<Guid>? AttachmentIds = null, bool WebSearchEnabled = false) : IStreamCommand<ChatStreamEvent>;

    public abstract record ChatStreamEvent;
    public sealed record ChatStreamChunk(string Text) : ChatStreamEvent;
    public sealed record ChatStreamReasoning(string Text) : ChatStreamEvent;
    public sealed record ChatStreamToolCall(string Name, string Input) : ChatStreamEvent;
    public sealed record ChatStreamToolResult(string Name, string Output) : ChatStreamEvent;
    public sealed record ChatStreamDone(SendMessageDto Result) : ChatStreamEvent;
    public sealed record ChatStreamError(string Message) : ChatStreamEvent;

    public class SendMessageCommandHandler(IUserService userService, PolyglotDbContext dbContext, IChatClientFactory chatClientFactory, ICreditsService creditsService, IChatTitleGenerator titleGenerator, IJsExecutionService jsExecutionService, IMcpToolProvider mcpToolProvider, IOpenRouterClient openRouterClient, IConfiguration configuration) : IStreamCommandHandler<SendMessageCommand, ChatStreamEvent>
    {
        private const string FallbackImageModel = "google/gemini-2.5-flash-image";

        // Prepended to every request. Generated images are delivered as real
        // attachments shown below the reply, so the model must not try to embed
        // or mark the image itself: no inline image markup (which renders as a
        // broken image) and no textual placeholder/caption (like "(Image of a
        // cow)") standing in for where the image should go.
        private const string SystemPrompt =
            "You are a helpful assistant inside a chat application. When you call the generate_image tool, "
            + "the resulting image is automatically attached to your reply and displayed to the user below your message. "
            + "Do not try to embed or mark the image yourself: no image markdown, links, or URLs, no data: URIs or "
            + "base64 image data, no attachment:// or sandbox: paths, and no textual placeholders or captions such as "
            + "\"(image here)\" or \"(Image of a cow)\". Write your reply as if the image is already shown; you may "
            + "mention it naturally in a sentence, but never insert a standalone placeholder for it.";

        // Tool steps are serialized for human display in the chat UI, so keep
        // characters like '+' readable instead of \u-escaped.
        private static readonly JsonSerializerOptions ToolStepJsonOptions = new(JsonSerializerOptions.Web)
        {
            Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
        };

        public async IAsyncEnumerable<ChatStreamEvent> Handle(SendMessageCommand command, [EnumeratorCancellation] CancellationToken cancellationToken)
        {
            var preflight = await PreflightAsync(command, cancellationToken);
            if (preflight.Error is not null)
            {
                yield return new ChatStreamError(preflight.Error);
                yield break;
            }

            var ctx = preflight.Context!;
            // OpenRouter's ":online" suffix attaches its web plugin to the request;
            // validation and pricing stay keyed to the base model id.
            var chatClient = chatClientFactory.Create(command.WebSearchEnabled ? $"{command.Model}:online" : command.Model);

            var assistantContent = new StringBuilder();
            UsageDetails? usage = null;
            ChatFinishReason? finishReason = null;
            string? streamError = null;
            // Ordered chain-of-thought: reasoning segments interleaved with tool
            // calls, in the order they occur. Serialized onto Message.ToolCalls.
            var steps = new List<CotStep>();
            var pendingToolCalls = new Dictionary<string, CotStep>();
            CotStep? currentReasoning = null;

            // Built-in image-generation tool: images it produces are collected here and
            // linked to the assistant message once it is created, and their upstream cost
            // is billed in credits during finalize.
            var generatedImages = new List<Attachment>();
            decimal imageCostUsd = 0m;

            // Tool gating: only models that advertise tool support get tools attached.
            // The built-in JavaScript and image-generation tools run in-process (using the
            // server's OpenRouter key and billing the user); MCP tools come from the user's
            // own and shared servers and are appended, with the toolset disposed below.
            ChatOptions? chatOptions = null;
            var mcpToolset = McpToolset.Empty;
            if (ctx.Model.SupportedParameters.Contains("tools"))
            {
                mcpToolset = await mcpToolProvider.GetToolsForUserAsync(ctx.User.Id, cancellationToken);

                var tools = new List<AITool> { CreateJsExecutionTool(), CreateImageGenerationTool(ctx, generatedImages, c => imageCostUsd += c) };
                var seenNames = new HashSet<string>(StringComparer.Ordinal) { "execute_javascript", "generate_image" };
                foreach (var mcpTool in mcpToolset.Tools)
                    if (seenNames.Add(mcpTool.Name))
                        tools.Add(mcpTool);

                chatOptions = new ChatOptions { Tools = tools };
            }

            try
            {
                var stream = chatClient.GetStreamingResponseAsync(ctx.Messages, chatOptions, cancellationToken);
                await using var updates = stream.GetAsyncEnumerator(cancellationToken);
                while (true)
                {
                    ChatResponseUpdate? update = null;
                    try
                    {
                        if (await updates.MoveNextAsync())
                            update = updates.Current;
                    }
                    catch (OperationCanceledException)
                    {
                        throw;
                    }
                    catch (Exception ex)
                    {
                        streamError = $"The model provider returned an error: {ex.Message}";
                    }
                    if (update is null)
                        break;

                    if (update.FinishReason is { } fr)
                        finishReason = fr;

                    // Reasoning arrives in OpenRouter's non-standard delta.reasoning
                    // field, which the OpenAI SDK does not surface as content; pull it
                    // from the raw update. Consecutive reasoning deltas coalesce into
                    // one step until a tool call breaks the segment.
                    var reasoningDelta = ExtractReasoningDelta(update);
                    if (!string.IsNullOrEmpty(reasoningDelta))
                    {
                        if (currentReasoning is null)
                        {
                            currentReasoning = new CotStep { Type = "reasoning", Text = string.Empty };
                            steps.Add(currentReasoning);
                        }
                        currentReasoning.Text += reasoningDelta;
                        yield return new ChatStreamReasoning(reasoningDelta);
                    }

                    foreach (var content in update.Contents)
                    {
                        switch (content)
                        {
                            case TextContent { Text: { Length: > 0 } text }:
                                assistantContent.Append(text);
                                yield return new ChatStreamChunk(text);
                                break;
                            case FunctionCallContent fcc:
                                {
                                    // A tool call closes the current reasoning segment; later
                                    // reasoning starts a fresh step after the tool.
                                    currentReasoning = null;
                                    var input = fcc.Arguments is null ? string.Empty : JsonSerializer.Serialize(fcc.Arguments, ToolStepJsonOptions);
                                    var step = new CotStep { Type = "tool", Name = fcc.Name, Input = input };
                                    steps.Add(step);
                                    pendingToolCalls[fcc.CallId] = step;
                                    yield return new ChatStreamToolCall(fcc.Name, input);
                                    break;
                                }
                            case FunctionResultContent frc:
                                {
                                    var step = pendingToolCalls.GetValueOrDefault(frc.CallId);
                                    var output = frc.Result?.ToString() ?? string.Empty;
                                    if (step is not null)
                                        step.Output = output;
                                    yield return new ChatStreamToolResult(step?.Name ?? "tool", output);
                                    break;
                                }
                            case UsageContent uc:
                                // Tool calls produce one completion per loop turn; bill them all.
                                if (usage is null)
                                {
                                    usage = uc.Details;
                                }
                                else
                                {
                                    usage.InputTokenCount = (usage.InputTokenCount ?? 0) + (uc.Details.InputTokenCount ?? 0);
                                    usage.OutputTokenCount = (usage.OutputTokenCount ?? 0) + (uc.Details.OutputTokenCount ?? 0);
                                    usage.TotalTokenCount = (usage.TotalTokenCount ?? 0) + (uc.Details.TotalTokenCount ?? 0);
                                }
                                break;
                        }
                    }
                }

                if (streamError is not null)
                {
                    yield return new ChatStreamError(streamError);
                    yield break;
                }

                var done = await FinalizeAsync(command, ctx, assistantContent.ToString(), finishReason, usage, steps, generatedImages, imageCostUsd, cancellationToken);
                yield return new ChatStreamDone(done);
            }
            finally
            {
                await mcpToolset.DisposeAsync();
            }
        }

        private async Task<PreflightResult> PreflightAsync(SendMessageCommand command, CancellationToken cancellationToken)
        {
            var userId = await userService.GetCurrentUserIdAsync(cancellationToken);
            var user = await dbContext.Users.SingleAsync(u => u.Id == userId, cancellationToken);

            if (user.IsLocked)
                return new PreflightResult { Error = "Your account has been locked. Please contact an administrator." };

            var model = await dbContext.Models.SingleOrDefaultAsync(m => m.ModelId == command.Model, cancellationToken);
            if (model is null)
                return new PreflightResult { Error = $"Model '{command.Model}' not found" };

            var settings = await dbContext.AdminSettings.SingleAsync(cancellationToken);

            if (settings.ActiveModelListMode == ModelListMode.Whitelist)
            {
                var isWhitelisted = await dbContext.ModelListEntries
                    .AnyAsync(e => e.ListType == ModelListType.Whitelist && e.ModelId == command.Model, cancellationToken);
                if (!isWhitelisted)
                    return new PreflightResult { Error = $"Model '{command.Model}' is not available" };
            }
            else if (settings.ActiveModelListMode == ModelListMode.Blacklist)
            {
                var isBlacklisted = await dbContext.ModelListEntries
                    .AnyAsync(e => e.ListType == ModelListType.Blacklist && e.ModelId == command.Model, cancellationToken);
                if (isBlacklisted)
                    return new PreflightResult { Error = $"Model '{command.Model}' is not available" };
            }

            if (settings.MaxPricePerMillionTokens is not null
                && (model.PromptPricePerMillion > settings.MaxPricePerMillionTokens
                    || model.CompletionPricePerMillion > settings.MaxPricePerMillionTokens))
                return new PreflightResult { Error = $"Model '{command.Model}' is not available" };

            Chat chat;
            if (command.ChatId is not null)
            {
                var existing = await dbContext.Chats
                    .Include(c => c.Messages.OrderBy(m => m.SequenceNumber))
                    .SingleOrDefaultAsync(c => c.Id == command.ChatId.Value && c.UserId == userId, cancellationToken);
                if (existing is null)
                    return new PreflightResult { Error = "Chat not found" };
                chat = existing;
            }
            else
            {
                chat = new Chat
                {
                    UserId = userId,
                    Title = "New Chat",
                    User = null!,
                    Messages = []
                };
                dbContext.Chats.Add(chat);
            }

            var inputCharCount = chat.Messages.Sum(m => m.Content.Length) + command.Message.Length;
            var worstCaseCredits = await creditsService.EstimateChatCreditsAsync(
                inputCharCount,
                model.PromptPricePerMillion,
                model.CompletionPricePerMillion,
                cancellationToken);

            if (user.CreditBalance < worstCaseCredits)
                return new PreflightResult { Error = $"Insufficient credits (need ~{worstCaseCredits}, have {user.CreditBalance})" };

            var newAttachments = new List<Attachment>();
            if (command.AttachmentIds is { Count: > 0 })
            {
                newAttachments = await dbContext.Attachments
                    .Where(a => command.AttachmentIds.Contains(a.Id) && a.UserId == userId && a.MessageId == null)
                    .ToListAsync(cancellationToken);
                if (newAttachments.Count != command.AttachmentIds.Count)
                    return new PreflightResult { Error = "One or more attachments were not found" };
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
            dbContext.Messages.Add(userMessage);

            foreach (var attachment in newAttachments)
                attachment.MessageId = userMessage.Id;

            var historyIds = chat.Messages.Where(m => m.Id != userMessage.Id).Select(m => m.Id).ToList();
            var historyAttachments = await dbContext.Attachments
                .Where(a => a.MessageId != null && historyIds.Contains(a.MessageId.Value))
                .ToListAsync(cancellationToken);
            var attachmentsByMessage = historyAttachments
                .Concat(newAttachments)
                .ToLookup(a => a.MessageId!.Value);

            var messages = new List<ChatMessage>(chat.Messages.Count + 1);
            messages.Add(new ChatMessage(ChatRole.System, SystemPrompt));
            foreach (var msg in chat.Messages.OrderBy(m => m.SequenceNumber))
            {
                var role = msg.Role switch
                {
                    MessageRole.User => ChatRole.User,
                    MessageRole.Assistant => ChatRole.Assistant,
                    MessageRole.System => ChatRole.System,
                    MessageRole.Tool => ChatRole.Tool,
                    _ => ChatRole.User
                };

                var contents = new List<AIContent>();
                if (!string.IsNullOrEmpty(msg.Content))
                    contents.Add(new TextContent(msg.Content));
                foreach (var attachment in attachmentsByMessage[msg.Id])
                    contents.Add(ToAIContent(attachment));
                messages.Add(new ChatMessage(role, contents));
            }

            return new PreflightResult
            {
                Context = new PreflightContext(chat, model, user, userMessage, messages, nextSequence, newAttachments, settings.DefaultImageModel)
            };
        }

        private async Task<SendMessageDto> FinalizeAsync(SendMessageCommand command, PreflightContext ctx, string assistantText, ChatFinishReason? finishReason, UsageDetails? usage, List<CotStep> steps, List<Attachment> generatedImages, decimal imageCostUsd, CancellationToken cancellationToken)
        {
            var promptTokens = (int)(usage?.InputTokenCount ?? 0);
            var completionTokens = (int)(usage?.OutputTokenCount ?? 0);
            var actualCredits = await creditsService.CalculateChatCreditsAsync(
                promptTokens,
                completionTokens,
                ctx.Model.PromptPricePerMillion,
                ctx.Model.CompletionPricePerMillion,
                cancellationToken);

            // Image generation is billed separately from the OpenRouter cost it reported.
            var imageCredits = imageCostUsd > 0m
                ? await creditsService.FromUsdAsync(imageCostUsd, cancellationToken)
                : 0L;

            ctx.User.CreditBalance -= actualCredits + imageCredits;

            var assistantMessage = new Message
            {
                ChatId = ctx.Chat.Id,
                Role = MessageRole.Assistant,
                Content = assistantText,
                Model = command.Model,
                ToolCalls = steps.Count > 0 ? JsonSerializer.Serialize(steps, ToolStepJsonOptions) : null,
                FinishReason = finishReason?.ToString(),
                TokenUsage = $"{promptTokens}/{completionTokens}",
                SequenceNumber = ctx.UserSequence + 1
            };
            ctx.Chat.Messages.Add(assistantMessage);
            dbContext.Messages.Add(assistantMessage);

            // Attach any images the generate_image tool produced to this assistant message.
            foreach (var image in generatedImages)
            {
                image.MessageId = assistantMessage.Id;
                dbContext.Attachments.Add(image);
            }

            var isFirstExchange = ctx.Chat.Title == "New Chat" && ctx.UserSequence == 0;
            if (isFirstExchange)
            {
                ctx.Chat.Title = command.Message.Length > 50
                    ? command.Message[..50] + "..."
                    : command.Message;
            }

            await dbContext.SaveChangesAsync(cancellationToken);

            if (isFirstExchange)
            {
                var placeholderTitle = ctx.Chat.Title;
                var chatId = ctx.Chat.Id;
                var userText = command.Message;
                _ = Task.Run(() => titleGenerator.GenerateAndSaveAsync(chatId, userText, assistantText, placeholderTitle));
            }

            var userAttachmentDtos = ctx.NewAttachments
                .Select(a => new AttachmentDto
                {
                    Id = a.Id,
                    FileName = a.FileName,
                    MediaType = a.MediaType,
                    SizeBytes = a.SizeBytes,
                })
                .ToList();

            var assistantAttachmentDtos = generatedImages
                .Select(a => new AttachmentDto
                {
                    Id = a.Id,
                    FileName = a.FileName,
                    MediaType = a.MediaType,
                    SizeBytes = a.SizeBytes,
                })
                .ToList();

            return new SendMessageDto
            {
                ChatId = ctx.Chat.Id,
                ChatTitle = ctx.Chat.Title,
                UserMessage = ctx.UserMessage.ToDto(userAttachmentDtos),
                AssistantMessage = assistantMessage.ToDto(assistantAttachmentDtos),
            };
        }

        private AIFunction CreateJsExecutionTool() =>
            AIFunctionFactory.Create(
                ([Description("The JavaScript source code to run.")] string code) =>
                {
                    var result = jsExecutionService.Execute(code);
                    if (result.Success)
                        return result.Output.Length > 0 ? result.Output : "(code ran successfully but produced no output)";
                    return $"Execution failed: {result.Error}"
                        + (result.Output.Length > 0 ? $"\nOutput before failure:\n{result.Output}" : string.Empty);
                },
                "execute_javascript",
                "Executes JavaScript code in a secure sandbox and returns its console output and the value of the final expression. "
                + "There is no network, filesystem, DOM, or module access; use console.log to print intermediate results. "
                + "If execution fails, the error is returned so the code can be fixed and retried.");

        // Built-in image-generation tool. Runs in-process so it can use the server's
        // OpenRouter key and bill the user: generated images are added to the shared list
        // (linked to the assistant message in FinalizeAsync) and their cost is reported
        // back via addCost for credit billing.
        private AIFunction CreateImageGenerationTool(PreflightContext ctx, List<Attachment> generatedImages, Action<decimal> addCost)
        {
            var imageModel = !string.IsNullOrWhiteSpace(ctx.User.Preferences?.PreferredImageModel)
                ? ctx.User.Preferences!.PreferredImageModel!
                : !string.IsNullOrWhiteSpace(ctx.AdminDefaultImageModel)
                    ? ctx.AdminDefaultImageModel!
                    : configuration["ImageGen:DefaultModel"] ?? FallbackImageModel;

            return AIFunctionFactory.Create(
                async ([Description("A detailed description of the image to generate.")] string prompt, CancellationToken ct) =>
                {
                    if (ctx.User.CreditBalance <= 0)
                        return "Insufficient credits to generate an image.";
                    try
                    {
                        var image = await openRouterClient.GenerateImageAsync(imageModel, prompt, ct);
                        var ext = image.MediaType switch
                        {
                            "image/png" => "png",
                            "image/jpeg" => "jpg",
                            "image/webp" => "webp",
                            "image/gif" => "gif",
                            _ => "img"
                        };
                        generatedImages.Add(new Attachment
                        {
                            UserId = ctx.User.Id,
                            FileName = $"generated-image-{generatedImages.Count + 1}.{ext}",
                            MediaType = image.MediaType,
                            Data = image.Data,
                            SizeBytes = image.Data.Length,
                        });
                        addCost(image.CostUsd);
                        return "Image generated and attached to your reply.";
                    }
                    catch (OperationCanceledException)
                    {
                        throw;
                    }
                    catch (Exception ex)
                    {
                        return $"Image generation failed: {ex.Message}";
                    }
                },
                "generate_image",
                "Generates an image from a text description and attaches it to your reply. Provide a detailed prompt describing what the image should show.");
        }

        // Images and PDFs go to the model as base64 data URIs (DataContent);
        // plain-text files are inlined as prompt text.
        private static AIContent ToAIContent(Attachment attachment)
        {
            if (attachment.MediaType.StartsWith("text/", StringComparison.OrdinalIgnoreCase))
                return new TextContent($"[Attached file: {attachment.FileName}]\n{System.Text.Encoding.UTF8.GetString(attachment.Data)}");

            return new DataContent(attachment.Data, attachment.MediaType);
        }

        // One ordered chain-of-thought step, serialized onto Message.ToolCalls so
        // the sequence (reasoning, tool, reasoning, ...) re-renders on reload.
        // Type is "reasoning" (uses Text) or "tool" (uses Name/Input/Output).
        private sealed class CotStep
        {
            public string Type { get; set; } = "";
            public string? Text { get; set; }
            public string? Name { get; set; }
            public string? Input { get; set; }
            public string? Output { get; set; }
        }

        // OpenRouter streams reasoning in delta.reasoning (or delta.reasoning_details[].text),
        // which the OpenAI SDK drops. Recover it from the raw update. reasoning and
        // reasoning_details carry the same text, so prefer reasoning and only fall back.
        private static string? ExtractReasoningDelta(ChatResponseUpdate update)
        {
            if (update.RawRepresentation is null) return null;
            try
            {
                var bin = System.ClientModel.Primitives.ModelReaderWriter.Write(update.RawRepresentation);
                using var doc = JsonDocument.Parse(bin.ToMemory());
                if (!doc.RootElement.TryGetProperty("choices", out var choices)
                    || choices.ValueKind != JsonValueKind.Array
                    || choices.GetArrayLength() == 0
                    || !choices[0].TryGetProperty("delta", out var delta))
                    return null;

                if (delta.TryGetProperty("reasoning", out var r) && r.ValueKind == JsonValueKind.String)
                {
                    var s = r.GetString();
                    if (!string.IsNullOrEmpty(s)) return s;
                }

                if (delta.TryGetProperty("reasoning_details", out var rd) && rd.ValueKind == JsonValueKind.Array)
                {
                    var sb = new StringBuilder();
                    foreach (var item in rd.EnumerateArray())
                        if (item.TryGetProperty("text", out var t) && t.ValueKind == JsonValueKind.String)
                            sb.Append(t.GetString());
                    if (sb.Length > 0) return sb.ToString();
                }
            }
            catch
            {
                // Reasoning is best-effort; never fail the stream over it.
            }
            return null;
        }

        private sealed class PreflightResult
        {
            public string? Error { get; init; }
            public PreflightContext? Context { get; init; }
        }

        private sealed record PreflightContext(
            Chat Chat,
            Domain.Model Model,
            User User,
            Message UserMessage,
            List<ChatMessage> Messages,
            int UserSequence,
            List<Attachment> NewAttachments,
            string? AdminDefaultImageModel);
    }
}
