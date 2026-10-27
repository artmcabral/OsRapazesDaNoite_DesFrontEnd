
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { Api } from '../../services/api';
import { FiltrosTarefas } from '../../services/filtros-tarefas';
import { FiltrosTarefasComponent } from '../../components/filtros-tarefas/filtros-tarefas';
import { TarefaCard } from '../../components/tarefa-card/tarefa-card';
import type { Tarefa } from '../../../tipos';

@Component({
  selector: 'app-lista-tarefas',
  imports: [TarefaCard, FiltrosTarefasComponent],
  templateUrl: './lista-tarefas.html',
  styleUrl: './lista-tarefas.css',
})
export class ListaTarefas implements OnInit {
  private api = inject(Api);

  // Serviço compartilhado entre lista e quadro
  readonly filtros = inject(FiltrosTarefas);

  tarefas = signal<Tarefa[]>([]);
  carregando = signal(true);
  erro = signal<string | null>(null);

  // Aplica os filtros utilizando o serviço compartilhado
  tarefasFiltradas = computed(() => {
    return this.filtros.filtrar(this.tarefas());
  });

  // Carrega as tarefas da API
  async ngOnInit() {
    try {
      this.tarefas.set(await this.api.listarTarefas());
    } catch {
      this.erro.set(
        'Não foi possível carregar as tarefas. O json-server está rodando?'
      );
    } finally {
      this.carregando.set(false);
    }
  }

  // Atualiza a tarefa na lista após salvar na API
  aoAlterarStatus(tarefaAtualizada: Tarefa) {
    this.tarefas.update((tarefas) =>
      tarefas.map((tarefa) =>
        tarefa.id === tarefaAtualizada.id
          ? tarefaAtualizada
          : tarefa
      )
    );
  }
}
