import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Prioridade, Status, Tarefa } from '../../../tipos';

@Component({
  selector: 'app-tarefa-card',
  imports: [RouterLink],
  templateUrl: './tarefa-card.html',
  styleUrl: './tarefa-card.css',
})
export class TarefaCard {
  tarefa = input.required<Tarefa>();

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

  formatarData(data: string): string {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  }
}