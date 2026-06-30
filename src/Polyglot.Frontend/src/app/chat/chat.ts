import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUp, lucideLightbulb, lucideCode, lucideBookOpen, lucideSparkles, lucidePaperclip, lucideMic, lucideChevronDown, lucideGlobe } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmDialogService } from '@spartan-ng/helm/dialog';
import { toast } from '@spartan-ng/brain/sonner';
import { ImagePreview } from '../shared/components/image-preview/image-preview';
import { MessageRole } from '../api/model/messageRole';
import type { AttachmentDto } from '../api/model/attachmentDto';
import type { MessageDto } from '../api/model/messageDto';
import { BASE_PATH } from '../api/variables';
import { ContentHeader } from '../shared/components/content-header/content-header';
import { PkAttachmentChip } from '../../../libs/prompt-kit/attachment-preview';
import type { Attachment } from '../../../libs/prompt-kit/attachment-preview';
import { PkChatContainerImports } from '../../../libs/prompt-kit/chat-container';
import { PkChatEmpty } from '../../../libs/prompt-kit/chat-empty/pk-chat-empty';
import { PkFileUploadImports } from '../../../libs/prompt-kit/file-upload';
import { PkChainOfThoughtStepsImports } from '../../../libs/prompt-kit/chain-of-thought-steps';
import type { ChatEmptySuggestion } from '../../../libs/prompt-kit/chat-empty/pk-chat-empty';
import { PkLoader } from '../../../libs/prompt-kit/loader/pk-loader';
import { PkMessageImports } from '../../../libs/prompt-kit/message';
import { PkModelPickerImports } from '../../../libs/prompt-kit/model-picker';
import { PkPromptInputImports } from '../../../libs/prompt-kit/prompt-input';
import { PkResponseStream } from '../../../libs/prompt-kit/response-stream';
import { PkScrollButton } from '../../../libs/prompt-kit/scroll-button/pk-scroll-button';
import { PkTokenCounter } from '../../../libs/prompt-kit/token-counter/pk-token-counter';
import { ChatStore } from '../shared/stores/ChatStore.store';
import type { CotStep } from '../shared/stores/ChatStore.store';
import { PkAuthImageImports } from '../../../libs/prompt-kit/auth-image';
import { modelIconUrl } from '../../../libs/prompt-kit/model-icon';

const SUGGESTIONS: ChatEmptySuggestion[] = [
  { label: 'Explain a concept', icon: 'lucideLightbulb', prompt: 'Explain how OAuth 2.0 works.' },
  { label: 'Review code', icon: 'lucideCode', prompt: 'Review this snippet for issues:\n\n' },
  { label: 'Summarise', icon: 'lucideBookOpen', prompt: 'Summarise the key points of: ' },
  { label: 'Brainstorm', icon: 'lucideSparkles', prompt: 'Brainstorm 5 ideas for ' },
];

@Component({
  selector: 'polyglot-chat',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex min-h-0 flex-1 flex-col' },
  imports: [
    NgIcon,
    HlmButton,
    HlmIcon,
    PkAuthImageImports,
    PkChatContainerImports,
    PkFileUploadImports,
    PkChatEmpty,
    PkLoader,
    PkMessageImports,
    PkModelPickerImports,
    PkAttachmentChip,
    PkPromptInputImports,
    PkResponseStream,
    ContentHeader,
    PkScrollButton,
    PkTokenCounter,
    ...PkChainOfThoughtStepsImports,
  ],
  providers: [
    provideIcons({
      lucideArrowUp,
      lucideLightbulb,
      lucideCode,
      lucideBookOpen,
      lucideSparkles,
      lucidePaperclip,
      lucideMic,
      lucideChevronDown,
      lucideGlobe,
    }),
  ],
  templateUrl: './chat.html',
})
export class Chat implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  http = inject(HttpClient);
  basePath = inject(BASE_PATH);
  store = inject(ChatStore);
  dialog = inject(HlmDialogService);
  destroyRef = inject(DestroyRef);
  Role = MessageRole;

  acceptTypes = computed(() => {
    const documents = '.pdf,.txt,.md,.csv';
    const model = this.store.activeModel();
    return model?.inputModalities?.includes('image') ? `image/*,${documents}` : documents;
  });

  draft = signal('');
  lastFailed = signal<string | null>(null);
  suggestions = SUGGESTIONS;
  inputLimit = 4000;

  modelsWithIcons = computed(() =>
    this.store.models().map((model) => ({
      id: model.id,
      name: model.name,
      provider: model.provider,
      iconUrl: modelIconUrl(model),
    })),
  );

  hasMessages = computed(() => this.store.messages().length > 0);
  canSend = computed(() => {
    const draftText = this.draft();
    return draftText.trim().length > 0 && draftText.length <= this.inputLimit && !this.store.isSending() && !this.store.streamingText() && !!this.store.selectedModelId();
  });

  ngOnInit(): void {
    void this.store.loadChats();
    void this.store.loadModels();
    this.route.paramMap
      .pipe(
        map((params) => params.get('id')),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((chatId) => {
        if (chatId) {
          void this.store.openChat(chatId);
        } else {
          this.store.newChat();
        }
      });
  }

  onModelChanged(modelId: string | null): void {
    if (modelId) {
      this.store.setSelectedModel(modelId);
    }
  }

  onSuggestion(suggestion: ChatEmptySuggestion): void {
    this.draft.set(suggestion.prompt);
  }

  async onSubmit(): Promise<void> {
    if (!this.canSend()) return;
    const text = this.draft();
    this.draft.set('');
    const result = await this.store.sendMessage(text);
    if (result.kind === 'error') {
      this.lastFailed.set(text);
      this.draft.set(text);
      toast.error(result.error, { action: { label: 'Retry', onClick: () => void this.retry() } });
      return;
    }
    this.lastFailed.set(null);
    if (result.newId) {
      void this.router.navigate(['/chat', result.newId]);
    }
  }

  async retry(): Promise<void> {
    const text = this.lastFailed();
    if (!text) return;
    this.draft.set(text);
    await this.onSubmit();
  }

  async onFiles(files: File[]): Promise<void> {
    for (const file of files) {
      const error = await this.store.uploadAttachment(file);
      if (error) toast.error(error);
    }
  }

  stepsCache = new Map<string, CotStep[]>();

  steps(message: MessageDto): CotStep[] {
    if (!message.toolCalls) return [];
    let steps = this.stepsCache.get(message.id);
    if (!steps) {
      try {
        const parsed = JSON.parse(message.toolCalls) as CotStep[];
        steps = parsed.map((step): CotStep => (step.type ? step : { type: 'tool', name: step.name, input: step.input, output: step.output ?? null }));
      } catch {
        steps = [];
      }
      this.stepsCache.set(message.id, steps);
    }
    return steps;
  }

  modelName(message: MessageDto): string {
    const modelId = message.model;
    if (!modelId) return 'Assistant';
    return this.store.models().find((model) => model.id === modelId)?.name ?? modelId.split('/').pop() ?? modelId;
  }

  modelIcon(message: MessageDto): string {
    return message.model ? modelIconUrl({ id: message.model }) : '';
  }

  activeModelName = computed(() => this.store.activeModel()?.name ?? 'Assistant');
  activeModelIcon = computed(() => {
    const model = this.store.activeModel();
    return model ? modelIconUrl({ id: model.id }) : '';
  });

  asChip(attachment: AttachmentDto): Attachment {
    return {
      id: attachment.id,
      name: attachment.fileName,
      type: attachment.mediaType.startsWith('image/') ? 'image' : 'file',
      size: attachment.sizeBytes,
      mimeType: attachment.mediaType,
    };
  }

  attachmentUrl(id: string): string {
    return `${this.basePath}/api/Attachment/${id}`;
  }

  openImage(id: string): void {
    this.dialog.open(ImagePreview, {
      context: { url: this.attachmentUrl(id) },
      contentClass: 'sm:max-w-2xl',
    });
  }

  async openAttachment(id: string): Promise<void> {
    const blob = await firstValueFrom(this.http.get(this.attachmentUrl(id), { responseType: 'blob' }));
    window.open(URL.createObjectURL(blob), '_blank');
  }
}
