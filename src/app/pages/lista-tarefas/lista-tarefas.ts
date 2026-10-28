
import {
  Component,
  OnInit,
  inject,
  signal,
  computed
} from '@angular/core';

import { Api } from '../../services/api';
import { FiltrosService } from '../../services/filtros';
import { TarefaCard } from '../../components/tarefa-card/tarefa-card';
import { BarraFiltros } from '../../components/barra-filtros/barra-filtros';

import type { Tarefa } from '../../../tipos';
import { filtrarTarefas } from '../../../derivar';

@Component({
  selector: 'app-lista-tarefas',
  imports: [TarefaCard, BarraFiltros],
  templateUrl: './lista-tarefas.html',
  styleUrl: './lista-tarefas.css',
})
export class ListaTarefas implements OnInit {

  private api = inject(Api);

  // Serviço de filtros compartilhado com o quadro
  private filtrosService = inject(FiltrosService);

  tarefas = signal<Tarefa[]>([]);
  carregando = signal(true);
  erro = signal<string | null>(null);

  // Atualiza automaticamente os resultados
  // quando as tarefas ou os filtros mudam
  readonly tarefasFiltradas = computed(() =>
    filtrarTarefas(
      this.tarefas(),
      this.filtrosService.filtros()
    )
  );

  // Busca as tarefas na API
  async ngOnInit() {
    try {
      const dados = await this.api.listarTarefas();
      this.tarefas.set(dados);
    } catch (erro) {
      console.error('Erro ao carregar tarefas:', erro);

      this.erro.set(
        'Não foi possível carregar as tarefas. O json-server está rodando?'
      );
    } finally {
      this.carregando.set(false);
    }
  }

  // Atualiza o estado local após salvar o novo status na API
  aoAlterarStatus(tarefaAtualizada: Tarefa) {
    this.tarefas.update(tarefas =>
      tarefas.map(tarefa =>
        tarefa.id === tarefaAtualizada.id
          ? tarefaAtualizada
          : tarefa
      )
    );
  }
}
