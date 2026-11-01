
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
import { MensagemErro } from '../../components/mensagem-erro/mensagem-erro';
import { EstadoVazio } from '../../components/estado-vazio/estado-vazio';
import { RouterLink } from '@angular/router';

import type { Tarefa } from '../../../tipos';
import { FILTROS_INICIAIS, filtrarTarefas } from '../../../derivar';

@Component({
  selector: 'app-lista-tarefas',
  imports: [
    TarefaCard,
    BarraFiltros,
    MensagemErro,
    EstadoVazio,
    RouterLink
  ],
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

  // Atualiza resultados quando tarefas ou filtros mudam
  readonly tarefasFiltradas = computed(() =>
    filtrarTarefas(
      this.tarefas(),
      this.filtrosService.filtros()
    )
  );

  async ngOnInit() {
    await this.carregar();
  }

  // Busca tarefas na API
  async carregar() {
    this.carregando.set(true);
    this.erro.set(null);

    try {
      const dados = await this.api.listarTarefas();
      this.tarefas.set(dados);
    } catch (erro) {
      console.error('Erro ao carregar tarefas:', erro);
      this.erro.set('Não foi possível carregar as tarefas.');
    } finally {
      this.carregando.set(false);
    }
  }

  // Limpa os filtros
  limparFiltros() {
    this.filtrosService.alterar({ ...FILTROS_INICIAIS });
  }

  // Atualiza o status de uma tarefa
  aoAlterarStatus(tarefaAtualizada: Tarefa) {
    this.tarefas.update(tarefas =>
      tarefas.map(tarefa =>
        tarefa.id === tarefaAtualizada.id
          ? tarefaAtualizada
          : tarefa
      )
    );
  }

  // ISSUE #31 - Remove a tarefa da lista
  aoExcluir(id: string) {
    this.tarefas.update(lista =>
      lista.filter(t => t.id !== id)
    );
  }
}
