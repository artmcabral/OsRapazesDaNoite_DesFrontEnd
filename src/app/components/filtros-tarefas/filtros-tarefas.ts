
import { Component, inject } from '@angular/core';
import { FiltrosTarefas } from '../../services/filtros-tarefas';

@Component({
  selector: 'app-filtros-tarefas',
  templateUrl: './filtros-tarefas.html',
  styleUrl: './filtros-tarefas.css'
})
export class FiltrosTarefasComponent {

  readonly filtros = inject(FiltrosTarefas);

}
