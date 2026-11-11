import { Injectable } from '@angular/core';
import type { NovaTarefa, Projeto, Tarefa } from '../../tipos';

const API = '/db.json';

export type ProjetoComTarefas = Projeto & { tarefas: Tarefa[] };

export function ehNaoEncontrado(erro: unknown): boolean {
  return erro instanceof Error && erro.message === 'HTTP 404';
}

@Injectable({ providedIn: 'root' })
export class Api {

  async listarTarefas(): Promise<Tarefa[]> {
    const resposta = await fetch(API);
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
    const dados = await resposta.json();
    return (dados.tarefas || []) as Tarefa[];
  }

  async buscarTarefa(id: string): Promise<Tarefa> {
    const tarefas = await this.listarTarefas();
    const tarefa = tarefas.find(t => t.id === id);
    if (!tarefa) throw new Error('HTTP 404');
    return tarefa;
  }

  async listarProjetos(): Promise<Projeto[]> {
    const resposta = await fetch(API);
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
    const dados = await resposta.json();
    return (dados.projetos || []) as Projeto[];
  }

  async buscarProjeto(id: string): Promise<ProjetoComTarefas> {
    const projetos = await this.listarProjetos();
    const projeto = projetos.find(p => p.id === id);
    if (!projeto) throw new Error('HTTP 404');
    
    const tarefas = await this.listarTarefas();
    const tarefasDoProjeto = tarefas.filter(t => t.projetoId === id);
    
    return { ...projeto, tarefas: tarefasDoProjeto };
  }

  private async enviar<T>(
    _caminho: string,
    _metodo: 'POST' | 'PATCH',
    corpo: unknown
  ): Promise<T> {
    return corpo as T;
  }

  criarTarefa(dados: NovaTarefa): Promise<Tarefa> {
    return this.enviar<Tarefa>('/tarefas', 'POST', dados);
  }

  atualizarTarefa(
    id: string,
    dados: Partial<NovaTarefa>
  ): Promise<Tarefa> {
    return this.enviar<Tarefa>(`/tarefas/${id}`, 'PATCH', dados);
  }

  criarProjeto(dados: Omit<Projeto, 'id'>): Promise<Projeto> {
    return this.enviar<Projeto>('/projetos', 'POST', dados);
  }

  atualizarProjeto(
    id: string,
    dados: Partial<Omit<Projeto, 'id'>>
  ): Promise<Projeto> {
    return this.enviar<Projeto>(`/projetos/${id}`, 'PATCH', dados);
  }

  // ISSUE #31 - EXCLUIR TAREFA
  async excluirTarefa(_id: string): Promise<void> {
    return;
  }
}