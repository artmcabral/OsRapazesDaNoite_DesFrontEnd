
import {
  Component,
  OnInit,
  computed,
  inject,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Api } from '../../services/api';
import { FiltrosService } from '../../services/filtros';
import { FILTROS_INICIAIS, filtrarTarefas } from '../../../derivar';
import { BarraFiltros } from '../../components/barra-filtros/barra-filtros';
import { TarefaCard } from '../../components/tarefa-card/tarefa-card';
import { Carregando } from '../../components/carregando/carregando';
import { MensagemErro } from '../../components/mensagem-erro/mensagem-erro';
import { EstadoVazio } from '../../components/estado-vazio/estado-vazio';
import { FaseLua } from '../../components/fase-lua/fase-lua';

import type { Status, Tarefa } from '../../../tipos';

@Component({
  selector: 'app-quadro',
  standalone: true,
  imports: [
    CommonModule,
    BarraFiltros,
    TarefaCard,
    Carregando,
    MensagemErro,
    EstadoVazio,
    FaseLua,
    RouterLink
  ],
  templateUrl: './quadro.html',
  styleUrl: './quadro.css'
})
export class Quadro implements OnInit {

  private api = inject(Api);
  readonly filtrosService = inject(FiltrosService);

  tarefas = signal<Tarefa[]>([]);
  carregando = signal(true);
  erro = signal<string | null>(null);

  // Colunas do quadro Kanban — cada status é uma fase da lua
  readonly colunas: {
    status: Status;
    titulo: string;
    fase: string;
  }[] = [
    { status: 'a-fazer', titulo: 'A fazer', fase: 'Lua nova' },
    { status: 'em-andamento', titulo: 'Em andamento', fase: 'Lua crescente' },
    { status: 'em-revisao', titulo: 'Em revisão', fase: 'Lua gibosa' },
    { status: 'concluida', titulo: 'Concluída', fase: 'Lua cheia' },
  ];

  // Progresso da equipe (considera todas as tarefas, sem filtros)
  readonly totalConcluidas = computed(() =>
    this.tarefas().filter(t => t.status === 'concluida').length
  );

  readonly percentualConcluido = computed(() => {
    const total = this.tarefas().length;
    return total ? Math.round((this.totalConcluidas() / total) * 100) : 0;
  });

  // Aplica os filtros compartilhados
  readonly tarefasFiltradas = computed(() =>
    filtrarTarefas(
      this.tarefas(),
      this.filtrosService.filtros()
    )
  );

  // Separa as tarefas por coluna
  tarefasDaColuna(status: Status): Tarefa[] {
    return this.tarefasFiltradas().filter(
      tarefa => tarefa.status === status
    );
  }

  async ngOnInit() {
    await this.carregar();
  }

  // ISSUE #32 - Busca com controle de carregamento
  async carregar() {
    this.carregando.set(true);
    this.erro.set(null);

    try {
      const dados = await this.api.listarTarefas();
      this.tarefas.set(dados);
    } catch (erro) {
      console.error('Erro ao carregar tarefas:', erro);
      this.erro.set(
        'Não foi possível carregar as tarefas do quadro.'
      );
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

  // ISSUE #31 - Remove a tarefa excluída do quadro
  aoExcluir(id: string) {
    this.tarefas.update(lista =>
      lista.filter(t => t.id !== id)
    );
  }
}
