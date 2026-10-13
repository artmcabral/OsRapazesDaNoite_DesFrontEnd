import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Api } from '../../../services/api';
import type { Tarefa } from '../../../../tipos';

@Component({
  selector: 'app-detalhe-tarefa',
  imports: [RouterLink],
  templateUrl: './detalhe-tarefa.html',
  styleUrl: './detalhe-tarefa.css',
})
export class DetalheTarefa implements OnInit {
  private api = inject(Api);
  private rota = inject(ActivatedRoute);

  tarefa = signal<Tarefa | null>(null);
  carregando = signal(true);
  erro = signal<string | null>(null);

  async ngOnInit() {
    const id = this.rota.snapshot.paramMap.get('id');

    if (!id) {
      this.erro.set('Identificador da tarefa não encontrado.');
      this.carregando.set(false);
      return;
    }

    try {
      this.tarefa.set(await this.api.buscarTarefa(id));
    } catch {
      this.erro.set('Não foi possível carregar os detalhes da tarefa.');
    } finally {
      this.carregando.set(false);
    }
  }
}