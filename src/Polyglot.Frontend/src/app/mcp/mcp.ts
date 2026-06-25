import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTrash2, lucidePlus, lucidePencil } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmCheckbox } from '@spartan-ng/helm/checkbox';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmNativeSelectImports } from '@spartan-ng/helm/native-select';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { ContentHeader } from '../shared/components/content-header/content-header';
import { McpStore } from '../shared/stores/McpStore.store';
import { UserStore } from '../shared/stores/UserStore.store';
import { McpTransportMode } from '../api/model/mcpTransportMode';
import type { McpServerDto } from '../api/model/mcpServerDto';
import { runGuarded } from '../shared/util/guarded-runner';

type ServerDraft = {
  name: string;
  url: string;
  transportMode: McpTransportMode;
  authorizationHeader: string;
  enabled: boolean;
  global: boolean;
};

function emptyDraft(): ServerDraft {
  return {
    name: '',
    url: '',
    transportMode: McpTransportMode.Auto,
    authorizationHeader: '',
    enabled: true,
    global: false,
  };
}

@Component({
  selector: 'polyglot-mcp',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex min-h-0 flex-1 flex-col' },
  imports: [
    FormsModule,
    NgIcon,
    HlmButton,
    HlmBadge,
    HlmCheckbox,
    HlmInput,
    HlmLabel,
    HlmNativeSelectImports,
    HlmTableImports,
    ContentHeader,
  ],
  providers: [provideIcons({ lucideTrash2, lucidePlus, lucidePencil })],
  templateUrl: './mcp.html',
})
export class Mcp implements OnInit {
  protected readonly store = inject(McpStore);
  protected readonly userStore = inject(UserStore);
  protected readonly transportModes = Object.values(McpTransportMode);

  protected readonly draft = signal<ServerDraft>(emptyDraft());
  protected readonly editingId = signal<string | null>(null);
  protected readonly editDraft = signal<ServerDraft>(emptyDraft());

  ngOnInit(): void {
    void this.userStore.load();
    void this.run(() => this.store.load());
  }

  protected patchDraft(patch: Partial<ServerDraft>): void {
    this.draft.update((d) => ({ ...d, ...patch }));
  }

  protected patchEditDraft(patch: Partial<ServerDraft>): void {
    this.editDraft.update((d) => ({ ...d, ...patch }));
  }

  protected addServer(): void {
    const draft = this.draft();
    if (!draft.name.trim() || !draft.url.trim()) return;
    void this.run(async () => {
      await this.store.create({
        name: draft.name.trim(),
        url: draft.url.trim(),
        transportMode: draft.transportMode,
        authorizationHeader:
          draft.authorizationHeader.trim() === '' ? null : draft.authorizationHeader.trim(),
        enabled: draft.enabled,
        global: this.userStore.isAdmin() ? draft.global : false,
      });
      this.draft.set(emptyDraft());
    });
  }

  protected startEdit(server: McpServerDto): void {
    this.editingId.set(server.id);
    this.editDraft.set({
      name: server.name,
      url: server.url,
      transportMode: server.transportMode,
      authorizationHeader: '',
      enabled: server.enabled,
      global: server.isGlobal,
    });
  }

  protected cancelEdit(): void {
    this.editingId.set(null);
  }

  protected saveEdit(): void {
    const id = this.editingId();
    if (!id) return;
    const draft = this.editDraft();
    if (!draft.name.trim() || !draft.url.trim()) return;
    void this.run(async () => {
      await this.store.update(id, {
        name: draft.name.trim(),
        url: draft.url.trim(),
        transportMode: draft.transportMode,
        // Blank keeps the existing secret; the server never returns the value to edit.
        authorizationHeader:
          draft.authorizationHeader.trim() === '' ? null : draft.authorizationHeader.trim(),
        enabled: draft.enabled,
      });
      this.editingId.set(null);
    });
  }

  protected removeServer(id: string): void {
    void this.run(() => this.store.remove(id));
  }

  private run(action: () => Promise<void>): Promise<void> {
    return runGuarded(action);
  }
}
