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

const ERROR_MESSAGES = { forbidden: 'Out of credits or not authorized for this model.' } as const;

export type SendResult = { kind: 'sent'; newId: string | null } | { kind: 'error'; error: string };

export interface CotStep {
  type: 'reasoning' | 'tool';
  text?: string;
  name?: string;
  input?: string;
  output?: string | null;
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
  streamSteps: CotStep[];
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
  streamSteps: [],
  pendingAttachments: [],
  isLoadingChat: false,
  chatsLoaded: false,
  modelsLoaded: false,
};

export const ChatStore = signalStore(
  { providedIn: 'root' },
  withState(initialChatStore),
  withProps(() => ({ stream: createStreamingMessage() })),
  withComputed((store) => ({
    activeModel: computed<AvailableModelDto | null>(() => {
      const id = store.selectedModelId();
      return id ? (store.models().find((model) => model.id === id) ?? null) : null;
    }),
    streamingText: store.stream.text,
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
      if (!list.some((chat) => chat.id === id)) return;
      const now = new Date();
      patchState(store, {
        chats: list
          .map((chat) => (chat.id === id ? { ...chat, updatedAt: now } : chat))
          .sort(byUpdatedDesc),
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
        streamSteps: [],
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
              attachmentIds: attachments.map((attachment) => attachment.id),
              webSearchEnabled: store.webSearchEnabled(),
            },
            'events',
            true,
          ),
          {
            onToken: (token) => store.stream.append(token),
            onReasoning: (delta) =>
              patchState(store, (state) => {
                const steps = [...state.streamSteps];
                const last = steps[steps.length - 1];
                if (last?.type === 'reasoning') {
                  steps[steps.length - 1] = { ...last, text: (last.text ?? '') + delta };
                } else {
                  steps.push({ type: 'reasoning', text: delta });
                }
                return { streamSteps: steps };
              }),
            onToolCall: (name, input) =>
              patchState(store, (state) => ({
                streamSteps: [
                  ...state.streamSteps,
                  { type: 'tool', name, input, output: null } as CotStep,
                ],
              })),
            onToolResult: (name, output) =>
              patchState(store, (state) => {
                const steps = [...state.streamSteps];
                for (let index = steps.length - 1; index >= 0; index--) {
                  const step = steps[index];
                  if (step.type === 'tool' && step.name === name && step.output === null) {
                    steps[index] = { ...step, output };
                    break;
                  }
                }
                return { streamSteps: steps };
              }),
          },
        );

        store.stream.end(() =>
          patchState(store, {
            messages: [
              ...store.messages().filter((message) => message.id !== optimistic.id),
              response.userMessage,
              response.assistantMessage,
            ],
            streamSteps: [],
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
          messages: store.messages().filter((message) => message.id !== optimistic.id),
          isSending: false,
          streamSteps: [],
          pendingAttachments: attachments,
        });
        return { kind: 'error', error: message };
      }
    }

    function commitStream(): void {
      store.stream.finished();
    }

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
        pendingAttachments: state.pendingAttachments.filter((attachment) => attachment.id !== id),
      }));
    }

    async function renameChat(id: string, title: string): Promise<void> {
      await firstValueFrom(chatApi.apiChatIdPut(id, { title }));
      const list = store.chats();
      if (!list.some((chat) => chat.id === id)) return;
      const now = new Date();
      patchState(store, {
        chats: list.map((chat) => (chat.id === id ? { ...chat, title, updatedAt: now } : chat)),
        ...(store.activeChatId() === id ? { activeChatTitle: title } : {}),
      });
    }

    async function deleteChat(id: string): Promise<void> {
      await firstValueFrom(chatApi.apiChatIdDelete(id));
      patchState(store, { chats: store.chats().filter((chat) => chat.id !== id) });
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

function byUpdatedDesc(first: Conversation, second: Conversation): number {
  return new Date(second.updatedAt).getTime() - new Date(first.updatedAt).getTime();
}

function streamSend(
  events$: Observable<HttpEvent<ChatStreamPayload>>,
  handlers: ChatStreamHandlers,
): Promise<SendMessageDto> {
  return readChatStream<SendMessageDto>(
    events$,
    (data): ChatStreamFrame<SendMessageDto> | null => {
      const payload = JSON.parse(data) as ChatStreamPayload;
      switch (payload.type) {
        case ChatStreamPayloadType.Chunk:
          return payload.text ? { kind: 'token', text: payload.text } : null;
        case ChatStreamPayloadType.Reasoning:
          return payload.text ? { kind: 'reasoning', text: payload.text } : null;
        case ChatStreamPayloadType.ToolCall:
          return payload.toolName
            ? { kind: 'tool-call', name: payload.toolName, input: payload.toolInput ?? '' }
            : null;
        case ChatStreamPayloadType.ToolResult:
          return payload.toolName
            ? { kind: 'tool-result', name: payload.toolName, output: payload.toolOutput ?? '' }
            : null;
        case ChatStreamPayloadType.Done:
          return payload.result ? { kind: 'done', result: payload.result } : null;
        case ChatStreamPayloadType.Error:
          return { kind: 'error', error: payload.error ?? 'Send failed.' };
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
