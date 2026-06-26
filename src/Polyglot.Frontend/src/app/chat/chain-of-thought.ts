import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { PkChainOfThoughtImports } from '../../../libs/prompt-kit/chain-of-thought';
import { PkReasoningImports } from '../../../libs/prompt-kit/reasoning';
import { PkCodeBlockImports } from '../../../libs/prompt-kit/code-block';
import { PkMarkdown } from '../../../libs/prompt-kit/markdown';
import type { CotStep } from '../shared/stores/ChatStore.store';

/**
 * Renders an assistant's ordered chain of thought: reasoning segments and tool
 * calls interleaved in the order they happened. When there are tool steps it
 * shows a chain-of-thought disclosure per step (reasoning as markdown, tools as
 * code blocks). When it is reasoning only, it shows the reasoning as a single
 * fading/collapsible block instead of a step list.
 */
@Component({
  selector: 'polyglot-chain-of-thought',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [...PkChainOfThoughtImports, ...PkReasoningImports, ...PkCodeBlockImports, PkMarkdown],
  host: { class: 'block' },
  template: `
    @if (steps().length > 0) {
      @if (hasTools()) {
        <pk-chain-of-thought>
          @for (step of steps(); track $index; let isLast = $last) {
            <pk-chain-of-thought-step [last]="isLast">
              @if (step.type === 'reasoning') {
                <pk-chain-of-thought-trigger>Reasoning</pk-chain-of-thought-trigger>
                <pk-chain-of-thought-content>
                  <pk-chain-of-thought-item>
                    <pk-markdown
                      [content]="step.text ?? ''"
                      class="prose prose-sm dark:prose-invert"
                    />
                  </pk-chain-of-thought-item>
                </pk-chain-of-thought-content>
              } @else {
                <pk-chain-of-thought-trigger>
                  {{ step.output == null ? 'Running' : 'Ran' }} {{ step.name }}
                </pk-chain-of-thought-trigger>
                <pk-chain-of-thought-content>
                  <pk-chain-of-thought-item>
                    <pk-code-block>
                      <pk-code-block-code [code]="toolInput(step)" language="javascript" />
                    </pk-code-block>
                  </pk-chain-of-thought-item>
                  @if (step.output != null) {
                    <pk-chain-of-thought-item>
                      <pk-code-block>
                        <pk-code-block-code [code]="step.output" language="text" />
                      </pk-code-block>
                    </pk-chain-of-thought-item>
                  }
                </pk-chain-of-thought-content>
              }
            </pk-chain-of-thought-step>
          }
        </pk-chain-of-thought>
      } @else {
        <pk-reasoning [isStreaming]="streaming()">
          <pk-reasoning-trigger>Reasoning</pk-reasoning-trigger>
          <pk-reasoning-content
            [content]="reasoningText()"
            [markdown]="true"
            contentClass="text-xs"
          />
        </pk-reasoning>
      }
    }
  `,
})
export class ChainOfThought {
  public readonly steps = input.required<readonly CotStep[]>();
  /** True while the reply is still streaming (auto-opens the reasoning block). */
  public readonly streaming = input<boolean>(false);

  protected readonly hasTools = computed(() => this.steps().some((s) => s.type === 'tool'));

  /** Concatenated reasoning text, for the reasoning-only fading view. */
  protected readonly reasoningText = computed(() =>
    this.steps()
      .filter((s) => s.type === 'reasoning')
      .map((s) => s.text ?? '')
      .join(''),
  );

  /** For execute_javascript, show the code; otherwise the raw input JSON. */
  protected toolInput(step: CotStep): string {
    const input = step.input ?? '';
    try {
      const args = JSON.parse(input) as Record<string, unknown>;
      if (typeof args['code'] === 'string') return args['code'];
    } catch {
      // fall through to raw input
    }
    return input;
  }
}
