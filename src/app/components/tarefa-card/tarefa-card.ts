
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

  // ISSUE #31 - Avisa a página quando a tarefa é excluída
  excluida = output<string>();

  // Controla o salvamento
  salvando = signal(false);

  // ISSUE #31 - Controla a exclusão
  excluindo = signal(false);

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
      this.excluindo() ||
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

  // ISSUE #31 - Excluir tarefa com confirmação
  async excluir() {

    // Impede operações simultâneas
    if (this.salvando() || this.excluindo()) {
      return;
    }

    // Solicita confirmação ao usuário
    if (!confirm(`Excluir a tarefa "${this.tarefa().titulo}"?`)) {
      return;
    }

    this.excluindo.set(true);
    this.erro.set(null);

    try {

      const id = this.tarefa().id;

      // Exclui a tarefa na API
      await this.api.excluirTarefa(id);

      // Avisa a página para remover o cartão
      this.excluida.emit(id);

    } catch {

      // Exibe o erro dentro do cartão
      this.erro.set(
        'Não foi possível excluir a tarefa.'
      );

    } finally {
      this.excluindo.set(false);
    }
  }

  formatarData(data: string): string {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  }
}
