
import {
  Component,
  OnInit,
  computed,
  inject,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Api } from '../../services/api';
import { FiltrosService } from '../../services/filtros';
import { FILTROS_INICIAIS, filtrarTarefas } from '../../../derivar';
import { BarraFiltros } from '../../components/barra-filtros/barra-filtros';
import { TarefaCard } from '../../components/tarefa-card/tarefa-card';
import { MensagemErro } from '../../components/mensagem-erro/mensagem-erro';
import { EstadoVazio } from '../../components/estado-vazio/estado-vazio';
import { RouterLink } from '@angular/router';

import type { Status, Tarefa } from '../../../tipos';

@Component({
  selector: 'app-quadro',
  standalone: true,
  imports: [
    CommonModule,
    BarraFiltros,
    TarefaCard,
    MensagemErro,
    EstadoVazio,
    RouterLink
  ],
  templateUrl: './quadro.html',
  styleUrl: './quadro.css'
})
export class Quadro implements OnInit {

  private api = inject(Api);

  // Estado compartilhado com a lista
  readonly filtrosService = inject(FiltrosService);

  tarefas = signal<Tarefa[]>([]);
  carregando = signal(true);
  erro = signal<string | null>(null);

  // Colunas do quadro
  readonly colunas: {
    status: Status;
    titulo: string;
  }[] = [
    { status: 'a-fazer', titulo: 'A fazer' },
    { status: 'em-andamento', titulo: 'Em andamento' },
    { status: 'em-revisao', titulo: 'Em revisão' },
    { status: 'concluida', titulo: 'Concluída' },
  ];

  // Aplica os filtros
  readonly tarefasFiltradas = computed(() =>
    filtrarTarefas(
      this.tarefas(),
      this.filtrosService.filtros()
    )
  );

  // Agrupa tarefas por status
  tarefasDaColuna(status: Status): Tarefa[] {
    return this.tarefasFiltradas().filter(
      tarefa => tarefa.status === status
    );
  }

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
      this.erro.set('Não foi possível carregar as tarefas do quadro.');
    } finally {
      this.carregando.set(false);
    }
  }

  // Limpa os filtros
  limparFiltros() {
    this.filtrosService.alterar({ ...FILTROS_INICIAIS });
  }

  // Atualiza status da tarefa
  aoAlterarStatus(tarefaAtualizada: Tarefa) {
    this.tarefas.update(tarefas =>
      tarefas.map(tarefa =>
        tarefa.id === tarefaAtualizada.id
          ? tarefaAtualizada
          : tarefa
      )
    );
  }

  // ISSUE #31 - Remove a tarefa do quadro
  aoExcluir(id: string) {
    this.tarefas.update(lista =>
      lista.filter(t => t.id !== id)
    );
  }
}
