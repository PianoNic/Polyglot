import { ChangeDetectionStrategy, Component } from '@angular/core';
import { injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { PkAuthImageImports } from '../../../../../libs/prompt-kit/auth-image';

@Component({
  selector: 'polyglot-image-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PkAuthImageImports, HlmSpinnerImports],
  templateUrl: './image-preview.html',
})
export class ImagePreview {
  context = injectBrnDialogContext<{ url: string }>();
  url = this.context.url;
}
