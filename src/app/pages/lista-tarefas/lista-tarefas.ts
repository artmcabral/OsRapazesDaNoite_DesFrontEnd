import { Component, OnInit, inject, signal } from '@angular/core';
import { Api } from '../../services/api';
import { TarefaCard } from '../../components/tarefa-card/tarefa-card';
import type { Tarefa } from '../../../tipos';

@Component({
  selector: 'app-lista-tarefas',
  imports: [TarefaCard],
  templateUrl: './lista-tarefas.html',
  styleUrl: './lista-tarefas.css',
})
export class ListaTarefas implements OnInit {
  private api = inject(Api);

  tarefas = signal<Tarefa[]>([]);
  carregando = signal(true);
  erro = signal<string | null>(null);

  async ngOnInit() {
    try {
      this.tarefas.set(await this.api.listarTarefas());
    } catch {
      this.erro.set('Não foi possível carregar as tarefas. O json-server está rodando?');
    } finally {
      this.carregando.set(false);
    }
  }
}