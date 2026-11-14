import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Api } from '../../services/api';
import { EstadoVazio } from '../../components/estado-vazio/estado-vazio';
import { Carregando } from '../../components/carregando/carregando';
import { MensagemErro } from '../../components/mensagem-erro/mensagem-erro';
import type { Projeto, Tarefa } from '../../../tipos';

@Component({
  selector: 'app-projetos',
  imports: [
    Carregando,
    RouterLink,
    MensagemErro,
    EstadoVazio
  ],
  templateUrl: './projetos.html',
  styleUrl: './projetos.css',
})
export class Projetos implements OnInit {

  private api = inject(Api);

  projetos = signal<Projeto[]>([]);
  tarefas = signal<Tarefa[]>([]);
  carregando = signal(true);
  erro = signal<string | null>(null);

  // Constelação de cada projeto: uma estrela por tarefa,
  // acesa quando a tarefa está concluída (acesas primeiro)
  readonly estrelasPorProjeto = computed(() => {
    const mapa = new Map<string, boolean[]>();
    for (const tarefa of this.tarefas()) {
      const lista = mapa.get(tarefa.projetoId) ?? [];
      lista.push(tarefa.status === 'concluida');
      mapa.set(tarefa.projetoId, lista);
    }
    for (const lista of mapa.values()) {
      lista.sort((a, b) => Number(b) - Number(a));
    }
    return mapa;
  });

  estrelas(projetoId: string): boolean[] {
    return this.estrelasPorProjeto().get(projetoId) ?? [];
  }

  concluidas(projetoId: string): number {
    return this.estrelas(projetoId).filter(Boolean).length;
  }

  async ngOnInit() {
    await this.carregar();
  }

  // ISSUE #32 - Carrega os projetos
  async carregar() {
    this.carregando.set(true);
    this.erro.set(null);

    try {
      const [projetos, tarefas] = await Promise.all([
        this.api.listarProjetos(),
        this.api.listarTarefas(),
      ]);
      this.projetos.set(projetos);
      this.tarefas.set(tarefas);
    } catch {
      this.erro.set(
        'Não foi possível carregar os projetos.'
      );
    } finally {
      this.carregando.set(false);
    }
  }
}