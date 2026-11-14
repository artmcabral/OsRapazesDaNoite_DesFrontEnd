import { Component, computed, input } from '@angular/core';

import type { Status } from '../../../tipos';

/**
 * Ícone da fase da lua que representa o status de uma tarefa
 * (tema "Céu noturno"):
 *   a-fazer      → lua nova
 *   em-andamento → lua crescente
 *   em-revisao   → lua gibosa
 *   concluida    → lua cheia
 */
@Component({
  selector: 'app-fase-lua',
  template: `
    <svg
      [attr.width]="tamanho()"
      [attr.height]="tamanho()"
      viewBox="0 0 20 20"
      [attr.role]="rotulo() ? 'img' : null"
      [attr.aria-label]="rotulo() ? nomes[status()] : null"
      [attr.aria-hidden]="rotulo() ? null : 'true'"
    >
      @switch (status()) {
        @case ('a-fazer') {
          <circle cx="10" cy="10" r="8" fill="none" [style.stroke]="cor()" stroke-width="1.6" />
        }
        @case ('em-andamento') {
          <circle cx="10" cy="10" r="8" fill="none" [style.stroke]="cor()" stroke-width="1.6" />
          <path d="M10 2a8 8 0 0 1 0 16a4 8 0 0 0 0-16z" [style.fill]="cor()" />
        }
        @case ('em-revisao') {
          <circle cx="10" cy="10" r="8" fill="none" [style.stroke]="cor()" stroke-width="1.6" />
          <path d="M10 2a8 8 0 0 1 0 16a4 8 0 0 1 0-16z" [style.fill]="cor()" />
        }
        @case ('concluida') {
          <circle cx="10" cy="10" r="8" [style.fill]="cor()" />
        }
      }
    </svg>
  `,
  styles: `
    :host {
      display: inline-flex;
      flex: none;
    }
  `,
})
export class FaseLua {
  status = input.required<Status>();

  /** Tamanho do ícone em px */
  tamanho = input(20);

  /** Quando true, o ícone é lido pelo leitor de tela (ex.: "Concluída") */
  rotulo = input(false);

  readonly nomes: Record<Status, string> = {
    'a-fazer': 'A fazer',
    'em-andamento': 'Em andamento',
    'em-revisao': 'Em revisão',
    concluida: 'Concluída',
  };

  readonly cor = computed(() => `var(--status-${this.status()})`);
}
