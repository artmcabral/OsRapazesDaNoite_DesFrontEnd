import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Api } from '../../services/api';
import type { Projeto } from '../../../tipos';

@Component({
  selector: 'app-projetos',
  imports: [RouterLink],
  templateUrl: './projetos.html',
  styleUrl: './projetos.css',
})
export class Projetos implements OnInit {
  private api = inject(Api);

  projetos = signal<Projeto[]>([]);
  carregando = signal(true);
  erro = signal<string | null>(null);

  async ngOnInit() {
    try {
      this.projetos.set(await this.api.listarProjetos());
    } catch {
      this.erro.set('Não foi possível carregar os projetos.');
    } finally {
      this.carregando.set(false);
    }
  }
}