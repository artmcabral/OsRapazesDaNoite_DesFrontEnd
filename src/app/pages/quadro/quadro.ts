import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Api } from '../../services/api';

@Component({
  selector: 'app-quadro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quadro.html',
  styleUrl: './quadro.css'
})
export class Quadro implements OnInit {
  tarefas = signal<any[]>([]);
  carregando = signal<boolean>(true);

  // Filtros ajustados aos nomes exatos da tua base de dados
  aFazer = computed(() => this.tarefas().filter(t => t.status === 'A fazer' || t.status === 'a-fazer'));
  emAndamento = computed(() => this.tarefas().filter(t => t.status === 'Em andamento' || t.status === 'Em revisão' || t.status === 'em-andamento'));
  concluidas = computed(() => this.tarefas().filter(t => t.status === 'Concluída' || t.status === 'concluida'));

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