
import { Injectable, signal } from '@angular/core';
import type { Tarefa } from '../../tipos';

@Injectable({
  providedIn: 'root'
})
export class FiltrosTarefas {

  // Valores compartilhados entre lista e quadro
  readonly busca = signal('');
  readonly statusSelecionado = signal('');
  readonly prioridadeSelecionada = signal('');

  // Aplica todos os filtros às tarefas
  filtrar(tarefas: Tarefa[]): Tarefa[] {
    const texto = this.busca().toLowerCase().trim();
    const status = this.statusSelecionado();
    const prioridade = this.prioridadeSelecionada();

    return tarefas.filter((tarefa) => {
      const correspondeBusca =
        tarefa.titulo.toLowerCase().includes(texto) ||
        tarefa.responsavel.toLowerCase().includes(texto);

      const correspondeStatus =
        !status || tarefa.status === status;

      const correspondePrioridade =
        !prioridade || tarefa.prioridade === prioridade;

      return (
        correspondeBusca &&
        correspondeStatus &&
        correspondePrioridade
      );
    });
  }
}
