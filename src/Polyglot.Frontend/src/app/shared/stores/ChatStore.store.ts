import { computed, inject } from '@angular/core';
import { type HttpEvent } from '@angular/common/http';
import { firstValueFrom, type Observable } from 'rxjs';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { AttachmentService } from '../../api/api/attachment.service';
import { ChatService } from '../../api/api/chat.service';
import { ModelService } from '../../api/api/model.service';
import type { AttachmentDto } from '../../api/model/attachmentDto';
import type { AvailableModelDto } from '../../api/model/availableModelDto';
import type { ChatStreamPayload } from '../../api/model/chatStreamPayload';
import { ChatStreamPayloadType } from '../../api/model/chatStreamPayloadType';
import type { MessageDto } from '../../api/model/messageDto';
import type { SendMessageDto } from '../../api/model/sendMessageDto';
import { MessageRole } from '../../api/model/messageRole';
import type { Conversation } from '../../../../libs/prompt-kit/conversation-list/pk-conversation-types';
import {
  readChatStream,
  type ChatStreamFrame,
  type ChatStreamHandlers,
} from '../../../../libs/prompt-kit/streaming';
import { createStreamingMessage } from '../../../../libs/prompt-kit/streaming-message';
import { describeHttpError } from '../../../../libs/prompt-kit/http-error';

const SELECTED_MODEL_KEY = 'polyglot.selectedModel';

/** Polyglot-specific copy for 402/403 (credits/model authorization). */
const ERROR_MESSAGES = { forbidden: 'Out of credits or not authorized for this model.' } as const;

export type SendResult = { kind: 'sent'; newId: string | null } | { kind: 'error'; error: string };

/** One tool invocation in the assistant's chain of thought. Matches the
 *  camelCase JSON persisted on MessageDto.toolCalls. */
export interface ToolStep {
  name: string;
  input: string;
  output: string | null;
}

type ChatStoreState = {
  chats: Conversation[];
  activeChatId: string | null;
  activeChatTitle: string | null;
  messages: MessageDto[];
  models: AvailableModelDto[];
  selectedModelId: string | null;
  webSearchEnabled: boolean;
  isSending: boolean;
  streamToolSteps: ToolStep[];
  pendingAttachments: AttachmentDto[];
  isLoadingChat: boolean;
  chatsLoaded: boolean;
  modelsLoaded: boolean;
};

export const initialChatStore: ChatStoreState = {
  chats: [],
  activeChatId: null,
  activeChatTitle: null,
  messages: [],
  models: [],
  selectedModelId: readPersistedModel(),
  webSearchEnabled: false,
  isSending: false,
  streamToolSteps: [],
  pendingAttachments: [],
  isLoadingChat: false,
  chatsLoaded: false,
  modelsLoaded: false,
};

export const ChatStore = signalStore(
  { providedIn: 'root' },
  withState(initialChatStore),
  // The pk-response-stream reveal handshake (buffer + done + finished→commit) is
  // owned by createStreamingMessage(); only tool-step accumulation stays local.
  withProps(() => ({ stream: createStreamingMessage() })),
  withComputed((store) => ({
    activeModel: computed<AvailableModelDto | null>(() => {
      const id = store.selectedModelId();
      return id ? (store.models().find((m) => m.id === id) ?? null) : null;
    }),
    /** Live streamed text — bind to pk-response-stream's [textStream]. */
    streamingText: store.stream.text,
    /** Source stream finished — bind to pk-response-stream's [done]. */
    streamDone: store.stream.done,
  })),
  withMethods((store) => {
    const chatApi = inject(ChatService);
    const modelApi = inject(ModelService);
    const attachmentApi = inject(AttachmentService);
    let inFlight: { id: string; promise: Promise<void> } | null = null;

    function touchChat(id: string | null): void {
      if (!id) return;
      const list = store.chats();
      if (!list.some((c) => c.id === id)) return;
      const now = new Date();
      patchState(store, {
        chats: list.map((c) => (c.id === id ? { ...c, updatedAt: now } : c)).sort(byUpdatedDesc),
      });
    }

    async function loadChats(force = false): Promise<void> {
      if (store.chatsLoaded() && !force) return;
      patchState(store, { chatsLoaded: true });
      try {
        const list = await firstValueFrom(chatApi.apiChatGet());
        patchState(store, { chats: list });
      } catch (err) {
        patchState(store, { chatsLoaded: false });
        throw err;
      }
    }

    function setSelectedModel(id: string): void {
      patchState(store, { selectedModelId: id });
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(SELECTED_MODEL_KEY, id);
      }
    }

    function toggleWebSearch(): void {
      patchState(store, { webSearchEnabled: !store.webSearchEnabled() });
    }

    async function loadModels(): Promise<void> {
      if (store.modelsLoaded()) return;
      patchState(store, { modelsLoaded: true });
      try {
        const list = await firstValueFrom(modelApi.apiModelListGet());
        patchState(store, { models: list });
        if (!store.selectedModelId() && list.length > 0) {
          setSelectedModel(list[0].id);
        }
      } catch (err) {
        patchState(store, { modelsLoaded: false });
        throw err;
      }
    }

    function openChat(id: string): Promise<void> {
      if (inFlight?.id === id) return inFlight.promise;
      if (store.activeChatId() === id && !inFlight) return Promise.resolve();

      patchState(store, {
        activeChatId: id,
        activeChatTitle: null,
        messages: [],
        isLoadingChat: true,
      });
      const promise = (async () => {
        try {
          const detail = await firstValueFrom(chatApi.apiChatIdGet(id));
          if (inFlight?.id !== id) return;
          patchState(store, { messages: detail.messages, activeChatTitle: detail.title });
        } finally {
          if (inFlight?.id === id) {
            patchState(store, { isLoadingChat: false });
            inFlight = null;
          }
        }
      })();
      inFlight = { id, promise };
      return promise;
    }

    function newChat(): void {
      if (store.activeChatId() === null && store.messages().length === 0 && !inFlight) return;
      patchState(store, { activeChatId: null, activeChatTitle: null, messages: [] });
      inFlight = null;
    }

    async function sendMessage(text: string): Promise<SendResult> {
      const trimmed = text.trim();
      const model = store.selectedModelId();
      if (!trimmed || !model) return { kind: 'error', error: 'Pick a model and type a message.' };
      if (store.isSending() || store.streamingText())
        return { kind: 'error', error: 'A message is already being sent.' };

      const attachments = store.pendingAttachments();
      const optimistic: MessageDto = {
        id: `temp-${crypto.randomUUID()}`,
        role: MessageRole.User,
        content: trimmed,
        sequenceNumber: store.messages().length,
        createdAt: new Date().toISOString(),
        attachments,
      };
      store.stream.reset();
      patchState(store, (state) => ({
        isSending: true,
        streamToolSteps: [],
        pendingAttachments: [],
        messages: [...state.messages, optimistic],
      }));

      try {
        const response = await streamSend(
          chatApi.apiChatPost(
            {
              chatId: store.activeChatId(),
              message: trimmed,
              model,
              attachmentIds: attachments.map((a) => a.id),
              webSearchEnabled: store.webSearchEnabled(),
            },
            'events',
            true,
          ),
          {
            onToken: (token) => store.stream.append(token),
            onToolCall: (name, input) =>
              patchState(store, (state) => ({
                streamToolSteps: [...state.streamToolSteps, { name, input, output: null }],
              })),
            onToolResult: (name, output) =>
              patchState(store, (state) => {
                const steps = [...state.streamToolSteps];
                const idx = steps.findIndex((s) => s.name === name && s.output === null);
                if (idx !== -1) steps[idx] = { ...steps[idx], output };
                return { streamToolSteps: steps };
              }),
          },
        );

        // Hold the final messages until the reveal animation catches up. The
        // controller runs this on pk-response-stream's (finished), or now if
        // there was no buffered text to reveal.
        store.stream.end(() =>
          patchState(store, {
            messages: [
              ...store.messages().filter((m) => m.id !== optimistic.id),
              response.userMessage,
              response.assistantMessage,
            ],
            streamToolSteps: [],
          }),
        );
        patchState(store, { activeChatTitle: response.chatTitle, isSending: false });

        if (response.chatId !== store.activeChatId()) {
          patchState(store, { activeChatId: response.chatId });
          await loadChats(true);
          return { kind: 'sent', newId: response.chatId };
        }
        touchChat(store.activeChatId());
        return { kind: 'sent', newId: null };
      } catch (err) {
        const message = describeHttpError(err, ERROR_MESSAGES);
        store.stream.reset();
        patchState(store, {
          messages: store.messages().filter((m) => m.id !== optimistic.id),
          isSending: false,
          streamToolSteps: [],
          pendingAttachments: attachments,
        });
        return { kind: 'error', error: message };
      }
    }

    /** Wired to pk-response-stream's (finished): commit the held final messages. */
    function commitStream(): void {
      store.stream.finished();
    }

    /** Uploads an attachment; returns an error message on failure, else null. */
    async function uploadAttachment(file: File): Promise<string | null> {
      try {
        const dto = await firstValueFrom(attachmentApi.apiAttachmentPost(file));
        patchState(store, (state) => ({ pendingAttachments: [...state.pendingAttachments, dto] }));
        return null;
      } catch (err) {
        return describeHttpError(err, ERROR_MESSAGES);
      }
    }

    function removeAttachment(id: string): void {
      patchState(store, (state) => ({
        pendingAttachments: state.pendingAttachments.filter((a) => a.id !== id),
      }));
    }

    async function renameChat(id: string, title: string): Promise<void> {
      await firstValueFrom(chatApi.apiChatIdPut(id, { title }));
      const list = store.chats();
      if (!list.some((c) => c.id === id)) return;
      const now = new Date();
      patchState(store, {
        chats: list.map((c) => (c.id === id ? { ...c, title, updatedAt: now } : c)),
        ...(store.activeChatId() === id ? { activeChatTitle: title } : {}),
      });
    }

    async function deleteChat(id: string): Promise<void> {
      await firstValueFrom(chatApi.apiChatIdDelete(id));
      patchState(store, { chats: store.chats().filter((c) => c.id !== id) });
      if (inFlight?.id === id) inFlight = null;
      if (store.activeChatId() === id) newChat();
    }

    return {
      loadChats,
      loadModels,
      openChat,
      newChat,
      setSelectedModel,
      toggleWebSearch,
      sendMessage,
      commitStream,
      uploadAttachment,
      removeAttachment,
      renameChat,
      deleteChat,
    };
  }),
  withHooks(() => ({})),
);

function byUpdatedDesc(a: Conversation, b: Conversation): number {
  return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
}

/**
 * Consumes the SSE stream from POST /api/Chat with ngx-prompt-kit's
 * readChatStream(): the adapt() maps Polyglot's ChatStreamPayload to normalised
 * frames; the library owns the frame loop + terminal done/error resolution.
 */
function streamSend(
  events$: Observable<HttpEvent<ChatStreamPayload>>,
  handlers: ChatStreamHandlers,
): Promise<SendMessageDto> {
  return readChatStream<SendMessageDto>(
    events$,
    (data): ChatStreamFrame<SendMessageDto> | null => {
      const p = JSON.parse(data) as ChatStreamPayload;
      switch (p.type) {
        case ChatStreamPayloadType.Chunk:
          return p.text ? { kind: 'token', text: p.text } : null;
        case ChatStreamPayloadType.ToolCall:
          return p.toolName
            ? { kind: 'tool-call', name: p.toolName, input: p.toolInput ?? '' }
            : null;
        case ChatStreamPayloadType.ToolResult:
          return p.toolName
            ? { kind: 'tool-result', name: p.toolName, output: p.toolOutput ?? '' }
            : null;
        case ChatStreamPayloadType.Done:
          return p.result ? { kind: 'done', result: p.result } : null;
        case ChatStreamPayloadType.Error:
          return { kind: 'error', error: p.error ?? 'Send failed.' };
        default:
          return null;
      }
    },
    handlers,
  );
}

function readPersistedModel(): string | null {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem(SELECTED_MODEL_KEY);
}
