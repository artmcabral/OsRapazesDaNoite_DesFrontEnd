import { Component, inject } from '@angular/core';
import { FiltrosService } from '../../services/filtros';
import type { Filtros } from '../../../derivar';

@Component({
  selector: 'app-barra-filtros',
  templateUrl: './barra-filtros.html',
  styleUrl: './barra-filtros.css',
})
export class BarraFiltros {
  private filtrosService = inject(FiltrosService);

  filtros = this.filtrosService.filtros;

  atualizarBusca(valor: string) {
    this.filtrosService.alterar({ busca: valor });
  }

  atualizarStatus(valor: string) {
    this.filtrosService.alterar({ status: valor as Filtros['status'] });
  }

  atualizarPrioridade(valor: string) {
    this.filtrosService.alterar({ prioridade: valor as Filtros['prioridade'] });
  }
}