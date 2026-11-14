import { DOCUMENT } from '@angular/common';
import { Injectable, effect, inject, signal } from '@angular/core';

export type Tema = 'noite' | 'dia';

const CHAVE = 'tema';

/**
 * Guarda o tema escolhido (Noite = escuro, Dia = claro).
 * O tema é aplicado com o atributo data-tema na tag <html>,
 * e as cores mudam pelas variáveis CSS definidas em styles.css.
 * A escolha fica salva no localStorage para valer em todas as páginas.
 */
@Injectable({ providedIn: 'root' })
export class TemaService {
  private documento = inject(DOCUMENT);

  readonly tema = signal<Tema>(this.lerTemaSalvo());

  constructor() {
    effect(() => {
      const tema = this.tema();
      this.documento.documentElement.dataset['tema'] = tema;
      try {
        localStorage.setItem(CHAVE, tema);
      } catch {
        // localStorage indisponível (ex.: modo privado): o tema só não fica salvo
      }
    });
  }

  alterar(tema: Tema) {
    this.tema.set(tema);
  }

  private lerTemaSalvo(): Tema {
    try {
      return localStorage.getItem(CHAVE) === 'dia' ? 'dia' : 'noite';
    } catch {
      return 'noite';
    }
  }
}
