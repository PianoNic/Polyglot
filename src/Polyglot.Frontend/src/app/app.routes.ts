import { Routes } from '@angular/router';
import { autoLoginPartialRoutesGuard } from 'angular-auth-oidc-client';
import { AppLayout } from './shared/layouts/app-layout/app-layout';
import { Chat } from './chat/chat';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'chat' },
  {
    path: '',
    component: AppLayout,
    canActivateChild: [autoLoginPartialRoutesGuard],
    children: [
      { path: 'chat', component: Chat },
      { path: 'chat/:id', component: Chat },
      { path: 'mcp', loadComponent: () => import('./mcp/mcp').then((module) => module.Mcp) },
      {
        path: 'settings',
        loadComponent: () => import('./settings/settings').then((module) => module.Settings),
      },
      { path: 'billing', loadComponent: () => import('./billing/billing').then((module) => module.Billing) },
      { path: 'admin', loadComponent: () => import('./admin/admin').then((module) => module.Admin) },
    ],
  },
  { path: '**', redirectTo: 'chat' },
];
