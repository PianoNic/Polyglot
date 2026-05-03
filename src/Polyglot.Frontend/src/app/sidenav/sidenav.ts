import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmIcon } from '@spartan-ng/helm/icon';
import {
  lucideMessageCircle,
  lucideSettings,
  lucideShield,
  lucideChevronsUpDown,
  lucideSparkles,
  lucideBadgeCheck,
  lucideCreditCard,
  lucideBell,
  lucideLogOut,
} from '@ng-icons/lucide';
import { HlmSidebarImports, HlmSidebarService } from '@spartan-ng/helm/sidebar';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';

@Component({
  selector: 'polyglot-sidenav',
  imports: [
    HlmSidebarImports,
    HlmDropdownMenuImports,
    HlmAvatarImports,
    NgIcon,
    HlmIcon,
    RouterLink,
    RouterLinkActive,
  ],
  providers: [
    provideIcons({
      lucideMessageCircle,
      lucideSettings,
      lucideShield,
      lucideChevronsUpDown,
      lucideSparkles,
      lucideBadgeCheck,
      lucideCreditCard,
      lucideBell,
      lucideLogOut,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.css',
})
export class Sidenav {
  private readonly _sidebarService = inject(HlmSidebarService);
  protected readonly _menuSide = computed(() =>
    this._sidebarService.isMobile() ? 'top' : 'right'
  );

  protected readonly _items = [
    { title: 'Chat', url: '/chat', icon: 'lucideMessageCircle' },
    { title: 'Admin', url: '/admin', icon: 'lucideShield' },
  ];

  protected readonly _user = {
    name: 'PianoNic',
    email: 'hello@pianonic.ch',
    avatar: '',
  };
}
