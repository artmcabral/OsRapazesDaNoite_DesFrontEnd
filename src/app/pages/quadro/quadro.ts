import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Api } from '../../services/api';
import { FiltrosService } from '../../services/filtros';
import { filtrarTarefas } from '../../../derivar';

@Component({
  selector: 'app-quadro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quadro.html',
  styleUrl: './quadro.css'
})
export class Quadro implements OnInit {
  private filtrosService = inject(FiltrosService);

  tarefas = signal<any[]>([]);
  carregando = signal<boolean>(true);

  // Mesmo estado e mesma função de filtro da lista (#28)
  tarefasFiltradas = computed(() => filtrarTarefas(this.tarefas(), this.filtrosService.filtros()));

  aFazer = computed(() => this.tarefasFiltradas().filter(t => t.status === 'a-fazer'));
  emAndamento = computed(() => this.tarefasFiltradas().filter(t => t.status === 'em-andamento' || t.status === 'em-revisao'));
  concluidas = computed(() => this.tarefasFiltradas().filter(t => t.status === 'concluida'));

  constructor(private api: Api) {}

  async ngOnInit() {
    try {
      const dados = await this.api.listarTarefas();
      this.tarefas.set(dados);
    } catch (erro) {
      console.error('Erro ao carregar tarefas para o quadro:', erro);
    } finally {
      this.carregando.set(false);
    }
  }
}