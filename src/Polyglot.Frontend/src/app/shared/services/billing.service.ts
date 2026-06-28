import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { BASE_PATH } from '../../api/variables';

export interface StripeProduct {
  priceId: string;
  name: string;
  credits: number;
  mode: string;
  amount?: number | null;
  currency?: string | null;
}

export interface BillingConfig {
  configured: boolean;
  publishableKey?: string | null;
  products: StripeProduct[];
}

export interface CheckoutSession {
  url: string;
}

export interface PortalSession {
  url: string;
}

// Billing talks to the API directly via HttpClient (like the chat stream and attachment
// upload) rather than the generated client, which is produced from a running backend.
@Injectable({ providedIn: 'root' })
export class BillingService {
  private readonly http = inject(HttpClient);
  private readonly basePath = inject(BASE_PATH);

  getConfig(): Promise<BillingConfig> {
    return firstValueFrom(this.http.get<BillingConfig>(`${this.basePath}/api/billing/products`));
  }

  createCheckout(priceId: string): Promise<CheckoutSession> {
    return firstValueFrom(
      this.http.post<CheckoutSession>(`${this.basePath}/api/billing/checkout`, { priceId }),
    );
  }

  createPortalSession(): Promise<PortalSession> {
    return firstValueFrom(this.http.post<PortalSession>(`${this.basePath}/api/billing/portal`, {}));
  }
}
