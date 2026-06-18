import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { BASE_PATH } from '../../../api/variables';

// Renders an attachment image inline. The attachment endpoint requires auth, so the
// blob is fetched through HttpClient (the auth interceptor adds the token) and shown
// via an object URL rather than a plain <img src>.
@Component({
  selector: 'polyglot-auth-image',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    @if (src(); as url) {
      <img
        [src]="url"
        [alt]="alt()"
        class="max-h-80 max-w-full cursor-pointer rounded-md border"
        (click)="open(url)"
      />
    } @else if (failed()) {
      <div class="text-destructive text-xs">Failed to load image.</div>
    } @else {
      <div class="bg-muted h-48 w-48 animate-pulse rounded-md"></div>
    }
  `,
})
export class AuthImage implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly basePath = inject(BASE_PATH);
  private readonly destroyRef = inject(DestroyRef);

  readonly attachmentId = input.required<string>();
  readonly alt = input('Generated image');

  protected readonly src = signal<string | null>(null);
  protected readonly failed = signal(false);
  private objectUrl: string | null = null;

  ngOnInit(): void {
    void this.load();
    this.destroyRef.onDestroy(() => {
      if (this.objectUrl) URL.revokeObjectURL(this.objectUrl);
    });
  }

  private async load(): Promise<void> {
    try {
      const blob = await firstValueFrom(
        this.http.get(`${this.basePath}/api/Attachment/${this.attachmentId()}`, { responseType: 'blob' }),
      );
      this.objectUrl = URL.createObjectURL(blob);
      this.src.set(this.objectUrl);
    } catch {
      this.failed.set(true);
    }
  }

  protected open(url: string): void {
    window.open(url, '_blank');
  }
}
