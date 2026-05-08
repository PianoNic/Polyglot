import { computed, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../api/api/user.service';
import type { UserDto } from '../api/model/userDto';

@Injectable({ providedIn: 'root' })
export class UserStore {
  private readonly _api = inject(UserService);

  readonly currentUser = signal<UserDto | null>(null);
  readonly isLoading = signal(false);

  readonly creditBalance = computed(() => this.currentUser()?.creditBalance ?? 0);

  async load(): Promise<void> {
    if (this.isLoading()) return;
    this.isLoading.set(true);
    try {
      const me = await firstValueFrom(this._api.apiUserMeGet());
      this.currentUser.set(me);
    } finally {
      this.isLoading.set(false);
    }
  }
}
