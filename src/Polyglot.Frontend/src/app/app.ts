import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { Sidenav } from './sidenav/sidenav';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HlmSidebarImports, Sidenav],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Polyglot.Frontend');
}
