import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Api } from '../../services/api';
import type { ProjetoComTarefas } from '../../services/api';
import { TarefaCard } from '../../components/tarefa-card/tarefa-card'; 

@Component({
  selector: 'app-detalhe-projeto',
  imports: [RouterLink, TarefaCard], 
  templateUrl: './detalhe-projeto.html',
  styleUrl: './detalhe-projeto.css',
})
export class DetalheProjeto implements OnInit {
  private api = inject(Api);
  private rota = inject(ActivatedRoute);

  projeto = signal<ProjetoComTarefas | null>(null);
  carregando = signal(true);
  erro = signal<string | null>(null);

  async ngOnInit() {
    const id = this.rota.snapshot.paramMap.get('id');

    if (!id) {
      this.erro.set('Projeto não encontrado.');
      this.carregando.set(false);
      return;
    }

    try {
      this.projeto.set(await this.api.buscarProjeto(id));
    } catch {
      this.erro.set('Não foi possível carregar o projeto.');
    } finally {
      this.carregando.set(false);
    }
  }
}