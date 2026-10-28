import { Injectable } from '@angular/core';
import type { NovaTarefa, Projeto, Tarefa } from '../../tipos';

const API = 'http://localhost:3000';

export type ProjetoComTarefas = Projeto & { tarefas: Tarefa[] };

@Injectable({ providedIn: 'root' })
export class Api {
  async listarTarefas(): Promise<Tarefa[]> {
    const resposta = await fetch(`${API}/tarefas`);
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
    return resposta.json() as Promise<Tarefa[]>;
  }

  async buscarTarefa(id: string): Promise<Tarefa> {
    const resposta = await fetch(`${API}/tarefas/${id}`);
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
    return resposta.json() as Promise<Tarefa>;
  }

  async listarProjetos(): Promise<Projeto[]> {
    const resposta = await fetch(`${API}/projetos`);
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
    return resposta.json() as Promise<Projeto[]>;
  }

  async buscarProjeto(id: string): Promise<ProjetoComTarefas> {
    const resposta = await fetch(`${API}/projetos/${id}?_embed=tarefas`);
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
    return resposta.json() as Promise<ProjetoComTarefas>;
  }

  private async enviar<T>(caminho: string, metodo: 'POST' | 'PATCH', corpo: unknown): Promise<T> {
    const resposta = await fetch(`${API}${caminho}`, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(corpo),
    });
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
    return resposta.json() as Promise<T>;
  }

  criarTarefa(dados: NovaTarefa): Promise<Tarefa> {
    return this.enviar<Tarefa>('/tarefas', 'POST', dados);
  }

  atualizarTarefa(id: string, dados: Partial<NovaTarefa>): Promise<Tarefa> {
    return this.enviar<Tarefa>(`/tarefas/${id}`, 'PATCH', dados);
  }

  criarProjeto(dados: Omit<Projeto, 'id'>): Promise<Projeto> {
    return this.enviar<Projeto>('/projetos', 'POST', dados);
  }

  atualizarProjeto(id: string, dados: Partial<Omit<Projeto, 'id'>>): Promise<Projeto> {
    return this.enviar<Projeto>(`/projetos/${id}`, 'PATCH', dados);
  }
}