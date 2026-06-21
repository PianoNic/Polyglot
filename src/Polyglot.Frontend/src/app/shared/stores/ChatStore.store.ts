import { computed, inject } from '@angular/core';
import { type HttpEvent } from '@angular/common/http';
import { firstValueFrom, type Observable } from 'rxjs';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
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
import { readSseHttpEvents } from '../../../../libs/prompt-kit/streaming';
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
  streamingText: string;
  streamToolSteps: ToolStep[];
  streamDone: boolean;
  pendingAttachments: AttachmentDto[];
  isLoadingChat: boolean;
  sendError: string | null;
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
  streamingText: '',
  streamToolSteps: [],
  streamDone: false,
  pendingAttachments: [],
  isLoadingChat: false,
  sendError: null,
  chatsLoaded: false,
  modelsLoaded: false,
};

export const ChatStore = signalStore(
  { providedIn: 'root' },
  withState(initialChatStore),
  withComputed((store) => ({
    activeModel: computed<AvailableModelDto | null>(() => {
      const id = store.selectedModelId();
      return id ? (store.models().find((m) => m.id === id) ?? null) : null;
    }),
    tokenSums: computed(() => {
      let input = 0;
      let output = 0;
      for (const m of store.messages()) {
        const t = Math.ceil(m.content.length / 4);
        if (m.role === MessageRole.User) input += t;
        else if (m.role === MessageRole.Assistant) output += t;
      }
      return { input, output };
    }),
  })),
  withComputed((store) => ({
    estimatedInputTokens: computed(() => store.tokenSums().input),
    estimatedOutputTokens: computed(() => store.tokenSums().output),
  })),
  withMethods((store) => {
    const chatApi = inject(ChatService);
    const modelApi = inject(ModelService);
    const attachmentApi = inject(AttachmentService);
    let inFlight: { id: string; promise: Promise<void> } | null = null;
    let pendingStream: { response: SendMessageDto; optimisticId: string } | null = null;

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
      patchState(store, (state) => ({
        isSending: true,
        sendError: null,
        streamingText: '',
        streamToolSteps: [],
        streamDone: false,
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
            onToken: (token) =>
              patchState(store, (state) => ({ streamingText: state.streamingText + token })),
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

        // Hold the final messages until the reveal animation catches up —
        // commitStream() (wired to pk-response-stream's `finished` output)
        // performs the actual swap.
        pendingStream = { response, optimisticId: optimistic.id };
        patchState(store, {
          activeChatTitle: response.chatTitle,
          isSending: false,
          streamDone: true,
        });

        if (!store.streamingText()) commitStream();

        if (response.chatId !== store.activeChatId()) {
          patchState(store, { activeChatId: response.chatId });
          await loadChats(true);
          return { kind: 'sent', newId: response.chatId };
        }
        touchChat(store.activeChatId());
        return { kind: 'sent', newId: null };
      } catch (err) {
        const message = describeHttpError(err, ERROR_MESSAGES);
        pendingStream = null;
        patchState(store, {
          messages: store.messages().filter((m) => m.id !== optimistic.id),
          sendError: message,
          isSending: false,
          streamingText: '',
          streamToolSteps: [],
          streamDone: false,
          pendingAttachments: attachments,
        });
        return { kind: 'error', error: message };
      }
    }

    function commitStream(): void {
      if (!pendingStream) return;
      const { response, optimisticId } = pendingStream;
      pendingStream = null;
      patchState(store, {
        messages: [
          ...store.messages().filter((m) => m.id !== optimisticId),
          response.userMessage,
          response.assistantMessage,
        ],
        streamingText: '',
        streamToolSteps: [],
        streamDone: false,
      });
    }

    function clearSendError(): void {
      patchState(store, { sendError: null });
    }

    async function uploadAttachment(file: File): Promise<void> {
      try {
        const dto = await firstValueFrom(attachmentApi.apiAttachmentPost(file));
        patchState(store, (state) => ({ pendingAttachments: [...state.pendingAttachments, dto] }));
      } catch (err) {
        patchState(store, { sendError: describeHttpError(err, ERROR_MESSAGES) });
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
      clearSendError,
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

interface StreamHandlers {
  onToken: (token: string) => void;
  onToolCall: (name: string, input: string) => void;
  onToolResult: (name: string, output: string) => void;
}

/**
 * Consumes the SSE stream from POST /api/Chat using ngx-prompt-kit's
 * readSseHttpEvents() helper (frame buffering + cumulative partialText handling),
 * dispatching each frame to the handlers and resolving with the Done payload.
 */
async function streamSend(
  events$: Observable<HttpEvent<ChatStreamPayload>>,
  handlers: StreamHandlers,
): Promise<SendMessageDto> {
  let result: SendMessageDto | null = null;
  let failed: string | null = null;

  await readSseHttpEvents(events$, (data) => {
    // The discriminator lives in the payload (not the SSE event name) so the
    // same handling works over any transport, e.g. WebSockets.
    const payload = JSON.parse(data) as ChatStreamPayload;
    if (payload.type === ChatStreamPayloadType.Chunk && payload.text) {
      handlers.onToken(payload.text);
    } else if (payload.type === ChatStreamPayloadType.ToolCall && payload.toolName) {
      handlers.onToolCall(payload.toolName, payload.toolInput ?? '');
    } else if (payload.type === ChatStreamPayloadType.ToolResult && payload.toolName) {
      handlers.onToolResult(payload.toolName, payload.toolOutput ?? '');
    } else if (payload.type === ChatStreamPayloadType.Done && payload.result) {
      result = payload.result;
    } else if (payload.type === ChatStreamPayloadType.Error) {
      failed = payload.error ?? 'Send failed.';
    }
  });

  if (failed) throw new Error(failed);
  if (!result) throw new Error('The stream ended unexpectedly.');
  return result;
}

function readPersistedModel(): string | null {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem(SELECTED_MODEL_KEY);
}
