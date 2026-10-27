import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { Api } from '../../services/api';
import { FiltrosService } from '../../services/filtros';
import { TarefaCard } from '../../components/tarefa-card/tarefa-card';
import { BarraFiltros } from '../../components/barra-filtros/barra-filtros';
import type { Tarefa } from '../../../tipos';
import { filtrarTarefas } from '../../../derivar';

@Component({
  selector: 'app-lista-tarefas',
  imports: [TarefaCard, BarraFiltros],
  templateUrl: './lista-tarefas.html',
  styleUrl: './lista-tarefas.css',
})
export class ListaTarefas implements OnInit {
  private api = inject(Api);
  private filtrosService = inject(FiltrosService);

  tarefas = signal<Tarefa[]>([]);
  carregando = signal(true);
  erro = signal<string | null>(null);

  tarefasFiltradas = computed(() =>
    filtrarTarefas(this.tarefas(), this.filtrosService.filtros()),
  );

  async ngOnInit() {
    try {
      this.tarefas.set(await this.api.listarTarefas());
    } catch {
      this.erro.set('Não foi possível carregar as tarefas. O json-server está rodando?');
    } finally {
      this.carregando.set(false);
    }
  }
}