import { computed, Injectable, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'polyglot.theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  systemDark = signal(this.readSystem());
  mode = signal<ThemeMode>(this.readStored());
  resolved = computed(() =>
    this.mode() === 'system' ? (this.systemDark() ? 'dark' : 'light') : this.mode(),
  );

  constructor() {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
      this.systemDark.set(event.matches);
      this.apply();
    });
    this.apply();
  }

  set(mode: ThemeMode): void {
    this.mode.set(mode);
    localStorage.setItem(STORAGE_KEY, mode);
    this.apply();
  }

  apply(): void {
    document.documentElement.classList.toggle('dark', this.resolved() === 'dark');
  }

  readSystem(): boolean {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  readStored(): ThemeMode {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
  }
}
