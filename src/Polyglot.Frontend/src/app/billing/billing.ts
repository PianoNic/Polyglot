import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { toast } from '@spartan-ng/brain/sonner';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { ContentHeader } from '../shared/components/content-header/content-header';
import { UserStore } from '../shared/stores/UserStore.store';
import { BillingService, type BillingConfig } from '../shared/services/billing.service';

@Component({
  selector: 'polyglot-billing',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex min-h-0 flex-1 flex-col' },
  imports: [CurrencyPipe, DecimalPipe, HlmButton, HlmBadge, ContentHeader],
  templateUrl: './billing.html',
})
export class Billing implements OnInit {
  private readonly billing = inject(BillingService);
  private readonly route = inject(ActivatedRoute);
  protected readonly userStore = inject(UserStore);

  protected readonly config = signal<BillingConfig | null>(null);
  protected readonly pending = signal<string | null>(null);
  protected readonly notice = signal<'success' | 'cancel' | null>(null);
  protected readonly managing = signal(false);

  // The Customer Portal is only useful once the catalogue offers subscriptions.
  protected readonly hasSubscriptions = computed(
    () => this.config()?.products.some((product) => product.mode === 'subscription') ?? false,
  );

  async ngOnInit(): Promise<void> {
    void this.userStore.load();

    // Stripe redirects back here with ?checkout=success|cancel. On success the
    // webhook credits asynchronously, so re-fetch the balance.
    const checkout = this.route.snapshot.queryParamMap.get('checkout');
    if (checkout === 'success') {
      this.notice.set('success');
      void this.userStore.reload();
    } else if (checkout === 'cancel') {
      this.notice.set('cancel');
    }

    try {
      this.config.set(await this.billing.getConfig());
    } catch {
      toast.error('Could not load billing information.');
    }
  }

  protected async buy(priceId: string): Promise<void> {
    this.pending.set(priceId);
    try {
      const session = await this.billing.createCheckout(priceId);
      window.location.href = session.url;
    } catch {
      toast.error('Could not start checkout. Please try again.');
      this.pending.set(null);
    }
  }

  protected async manage(): Promise<void> {
    this.managing.set(true);
    try {
      const session = await this.billing.createPortalSession();
      window.location.href = session.url;
    } catch {
      toast.error('Could not open the billing portal. Please try again.');
      this.managing.set(false);
    }
  }
}
