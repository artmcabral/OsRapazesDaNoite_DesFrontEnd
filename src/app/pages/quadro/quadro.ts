
import {
  Component,
  OnInit,
  computed,
  inject,
  signal
} from '@angular/core';

import { Api } from '../../services/api';
import { FiltrosTarefas } from '../../services/filtros-tarefas';
import { FiltrosTarefasComponent } from '../../components/filtros-tarefas/filtros-tarefas';
import { TarefaCard } from '../../components/tarefa-card/tarefa-card';

import type { Status, Tarefa } from '../../../tipos';

@Component({
  selector: 'app-quadro',
  imports: [FiltrosTarefasComponent, TarefaCard],
  templateUrl: './quadro.html',
  styleUrl: './quadro.css',
})
export class Quadro implements OnInit {

  private api = inject(Api);

  // Compartilha os filtros com a página de lista
  readonly filtros = inject(FiltrosTarefas);

  tarefas = signal<Tarefa[]>([]);
  carregando = signal(true);
  erro = signal<string | null>(null);

  // Define as colunas do quadro
  readonly colunas: {
    status: Status;
    titulo: string;
  }[] = [
    { status: 'a-fazer', titulo: 'A fazer' },
    { status: 'em-andamento', titulo: 'Em andamento' },
    { status: 'em-revisao', titulo: 'Em revisão' },
    { status: 'concluida', titulo: 'Concluída' },
  ];

  // Reutiliza os filtros da lista
  tarefasFiltradas = computed(() => {
    return this.filtros.filtrar(this.tarefas());
  });

  // Retorna as tarefas de cada coluna
  tarefasDaColuna(status: Status): Tarefa[] {
    return this.tarefasFiltradas().filter(
      (tarefa) => tarefa.status === status
    );
  }

  // Carrega os dados da API
  async ngOnInit() {
    try {
      this.tarefas.set(await this.api.listarTarefas());
    } catch {
      this.erro.set(
        'Não foi possível carregar as tarefas do quadro.'
      );
    } finally {
      this.carregando.set(false);
    }
  }
}
