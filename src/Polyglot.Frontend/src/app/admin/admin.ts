import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLock, lucideLockOpen, lucideTrash2, lucidePlus } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmNativeSelectImports } from '@spartan-ng/helm/native-select';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';
import { ContentHeader } from '../shared/components/content-header/content-header';
import { AdminStore } from '../shared/stores/AdminStore.store';
import { CreditAdjustmentMode } from '../api/model/creditAdjustmentMode';
import { ModelListMode } from '../api/model/modelListMode';
import { ModelListType } from '../api/model/modelListType';
import type { UserDto } from '../api/model/userDto';
import { runGuarded } from '../shared/util/guarded-runner';

type SettingsDraft = {
  maxPricePerMillionTokens: number | null;
  activeModelListMode: ModelListMode;
  startingBalance: number;
  costMultiplier: number;
  creditsPerUsd: number;
  defaultImageModel: string | null;
};

@Component({
  selector: 'polyglot-admin',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex min-h-0 flex-1 flex-col' },
  imports: [
    DecimalPipe,
    FormsModule,
    NgIcon,
    HlmButton,
    HlmBadge,
    HlmInput,
    HlmLabel,
    HlmNativeSelectImports,
    HlmTableImports,
    HlmTabsImports,
    ContentHeader,
  ],
  providers: [provideIcons({ lucideLock, lucideLockOpen, lucideTrash2, lucidePlus })],
  templateUrl: './admin.html',
})
export class Admin implements OnInit {
  protected readonly store = inject(AdminStore);
  protected readonly ListType = ModelListType;
  protected readonly listModes = Object.values(ModelListMode);
  protected readonly adjustModes = Object.values(CreditAdjustmentMode);

  protected readonly creditUser = signal<UserDto | null>(null);
  protected readonly creditAmount = signal(0);
  protected readonly creditMode = signal<CreditAdjustmentMode>(CreditAdjustmentMode.Add);
  protected readonly newEntryModelId = signal('');
  protected readonly newEntryType = signal<ModelListType>(ModelListType.Whitelist);

  protected readonly settingsDraft = signal<SettingsDraft>({
    maxPricePerMillionTokens: null,
    activeModelListMode: ModelListMode.None,
    startingBalance: 0,
    costMultiplier: 1,
    creditsPerUsd: 10000,
    defaultImageModel: null,
  });

  // Image-capable models, for the default image-generation model setting.
  protected readonly imageModels = computed(() =>
    this.store.allModels().filter((model) => model.outputModalities?.includes('image')),
  );

  ngOnInit(): void {
    void this.store.loadUsers();
    void this.store.loadModels();
    void this.store.loadSettings().then(() => {
      const settings = this.store.settings();
      if (settings) {
        this.settingsDraft.set({
          maxPricePerMillionTokens: settings.maxPricePerMillionTokens ?? null,
          activeModelListMode: settings.activeModelListMode,
          startingBalance: settings.startingBalance,
          costMultiplier: settings.costMultiplier,
          creditsPerUsd: settings.creditsPerUsd,
          defaultImageModel: settings.defaultImageModel ?? null,
        });
      }
    });
  }

  protected toggleLock(user: UserDto): void {
    void this.run(() => this.store.setUserLock(user.id, !user.isLocked));
  }

  protected openCreditEditor(user: UserDto): void {
    this.creditUser.set(user);
    this.creditAmount.set(0);
    this.creditMode.set(CreditAdjustmentMode.Add);
  }

  protected applyCredits(): void {
    const user = this.creditUser();
    if (!user) return;
    void this.run(async () => {
      await this.store.adjustCredits(user.id, Number(this.creditAmount()), this.creditMode());
      this.creditUser.set(null);
    });
  }

  protected addEntry(): void {
    const modelId = this.newEntryModelId().trim();
    if (!modelId) return;
    void this.run(async () => {
      await this.store.addListEntry(modelId, this.newEntryType());
      this.newEntryModelId.set('');
    });
  }

  protected removeEntry(id: string): void {
    void this.run(() => this.store.removeListEntry(id));
  }

  protected saveSettings(): void {
    const draft = this.settingsDraft();
    void this.run(() =>
      this.store.saveSettings({
        maxPricePerMillionTokens:
          draft.maxPricePerMillionTokens === null ? null : Number(draft.maxPricePerMillionTokens),
        activeModelListMode: draft.activeModelListMode,
        startingBalance: Number(draft.startingBalance),
        costMultiplier: Number(draft.costMultiplier),
        creditsPerUsd: Number(draft.creditsPerUsd),
        defaultImageModel: draft.defaultImageModel || null,
      }),
    );
  }

  protected patchDraft(patch: Partial<SettingsDraft>): void {
    this.settingsDraft.update((draft) => ({ ...draft, ...patch }));
  }

  private run(action: () => Promise<void>): Promise<void> {
    return runGuarded(action);
  }
}
