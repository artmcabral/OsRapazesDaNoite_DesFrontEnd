import { Component, input } from '@angular/core';

// Issue #34 — mensagem quando não há tarefas, quando o projeto não tem tarefas
// ou quando a busca e os filtros não encontram nada
@Component({
  selector: 'app-estado-vazio',
  templateUrl: './estado-vazio.html',
  styleUrl: './estado-vazio.css',
})
export class EstadoVazio {

  // Frase principal (ex.: "Nenhuma tarefa encontrada.")
  titulo = input.required<string>();

  // Explicação opcional logo abaixo
  dica = input('');
}
