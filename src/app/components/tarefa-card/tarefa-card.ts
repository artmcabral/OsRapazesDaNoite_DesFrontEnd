
import {
  Component,
  inject,
  input,
  output,
  signal
} from '@angular/core';

import { RouterLink } from '@angular/router';
import { Api } from '../../services/api';

import type {
  Prioridade,
  Status,
  Tarefa
} from '../../../tipos';

@Component({
  selector: 'app-tarefa-card',
  imports: [RouterLink],
  templateUrl: './tarefa-card.html',
  styleUrl: './tarefa-card.css',
})
export class TarefaCard {

  private api = inject(Api);

  // Recebe a tarefa que será exibida
  tarefa = input.required<Tarefa>();

  // Avisa a página quando o status é atualizado
  statusAlterado = output<Tarefa>();

  // Controla o salvamento
  salvando = signal(false);
  erro = signal<string | null>(null);

  // Status disponíveis
  statusDisponiveis: {
    valor: Status;
    rotulo: string;
  }[] = [
    { valor: 'a-fazer', rotulo: 'A fazer' },
    { valor: 'em-andamento', rotulo: 'Em andamento' },
    { valor: 'em-revisao', rotulo: 'Em revisão' },
    { valor: 'concluida', rotulo: 'Concluída' },
  ];

  rotuloStatus: Record<Status, string> = {
    'a-fazer': 'A fazer',
    'em-andamento': 'Em andamento',
    'em-revisao': 'Em revisão',
    'concluida': 'Concluída',
  };

  rotuloPrioridade: Record<Prioridade, string> = {
    baixa: 'Baixa',
    media: 'Média',
    alta: 'Alta',
  };

  // Salva o novo status na API
  async alterarStatus(
    novoStatus: Status,
    seletor: HTMLSelectElement
  ) {

    // Evita salvar duas vezes
    if (
      this.salvando() ||
      novoStatus === this.tarefa().status
    ) {
      return;
    }

    this.salvando.set(true);
    this.erro.set(null);

    try {

      // Atualiza somente o status da tarefa
      const tarefaAtualizada =
        await this.api.atualizarTarefa(
          this.tarefa().id,
          { status: novoStatus }
        );

      // Notifica a página
      this.statusAlterado.emit(tarefaAtualizada);

    } catch {

      // Restaura o status anterior
      seletor.value = this.tarefa().status;

      this.erro.set(
        'Não foi possível atualizar o status.'
      );

    } finally {
      this.salvando.set(false);
    }
  }

  formatarData(data: string): string {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  }
}
