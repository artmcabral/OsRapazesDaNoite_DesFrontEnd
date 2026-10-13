import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { Api } from '../../services/api';
import { TarefaCard } from '../../components/tarefa-card/tarefa-card';
import type { Tarefa, Status, Prioridade } from '../../../tipos';

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

  busca = signal('');
  statusSelecionado = signal('');
  prioridadeSelecionada = signal('');

  tarefasFiltradas = computed(() => {
    const texto = this.busca().toLowerCase().trim();
    const status = this.statusSelecionado();
    const prioridade = this.prioridadeSelecionada();

    return this.tarefas().filter((tarefa) => {
      const correspondeBusca =
        tarefa.titulo.toLowerCase().includes(texto) ||
        tarefa.responsavel.toLowerCase().includes(texto);

      const correspondeStatus = !status || tarefa.status === status;
      const correspondePrioridade =
        !prioridade || tarefa.prioridade === prioridade;

      return correspondeBusca && correspondeStatus && correspondePrioridade;
    });
  });

  async ngOnInit() {
    try {
      this.tarefas.set(await this.api.listarTarefas());
    } catch {
      this.erro.set('Não foi possível carregar as tarefas. O json-server está rodando?');
    } finally {
      this.carregando.set(false);
    }
  }

  atualizarBusca(valor: string) {
    this.busca.set(valor);
  }

  atualizarStatus(valor: string) {
    this.statusSelecionado.set(valor);
  }

  atualizarPrioridade(valor: string) {
    this.prioridadeSelecionada.set(valor);
  }
}