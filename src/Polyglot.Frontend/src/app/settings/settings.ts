import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmNativeSelectImports } from '@spartan-ng/helm/native-select';
import { ContentHeader } from '../shared/components/content-header/content-header';
import { ChatStore } from '../shared/stores/ChatStore.store';
import { UserStore } from '../shared/stores/UserStore.store';

@Component({
  selector: 'polyglot-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex min-h-0 flex-1 flex-col' },
  imports: [FormsModule, HlmLabel, HlmNativeSelectImports, ContentHeader],
  templateUrl: './settings.html',
})
export class Settings implements OnInit {
  protected readonly store = inject(ChatStore);
  protected readonly userStore = inject(UserStore);

  // Image-capable models for the image-generation preference.
  protected readonly imageModels = computed(() =>
    this.store.models().filter((model) => model.outputModalities?.includes('image')),
  );

  ngOnInit(): void {
    void this.store.loadModels();
    void this.userStore.load();
  }

  protected setImageModel(modelId: string): void {
    void this.userStore.setPreferredImageModel(modelId === '' ? null : modelId);
  }
}
