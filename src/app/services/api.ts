import { Injectable } from '@angular/core';
import type { NovaTarefa, Projeto, Tarefa } from '../../tipos';

// IMPORTANTE: NÃO importar environment aqui!

const DADOS_INICIAIS = {
  projetos: [
    {
      id: '1',
      nome: 'Gerenciador de Tarefas',
      descricao: 'Projeto em equipe da disciplina',
      disciplina: 'Desenvolvimento Frontend',
      criadoEm: '2026-10-01'
    },
    {
      id: '2',
      nome: 'Modelagem da Biblioteca',
      descricao: 'Trabalho de modelagem de dados',
      disciplina: 'Banco de Dados',
      criadoEm: '2026-10-02'
    },
    {
      id: 'ZZFHRnAYU1I',
      nome: 'Back End',
      descricao: 'Atividades de backend',
      disciplina: 'Desenvolvimento Backend',
      criadoEm: '2026-10-03'
    }
  ],
  tarefas: [
    {
      id: '2',
      projetoId: '1',
      titulo: 'Subir o json-server',
      descricao: 'API local a partir do db.json',
      status: 'em-andamento',
      prioridade: 'alta',
      responsavel: 'Bruno',
      prazo: '2026-10-06'
    },
    {
      id: '3',
      projetoId: '1',
      titulo: 'Montar o quadro no GitHub Projects',
      descricao: 'Colunas por status e uma tarefa por marco',
      status: 'a-fazer',
      prioridade: 'media',
      responsavel: 'Carla',
      prazo: '2026-10-07'
    },
    {
      id: '4',
      projetoId: '1',
      titulo: 'Listar as tarefas na tela',
      descricao: 'Primeira entrega do Marco 2',
      status: 'a-fazer',
      prioridade: 'media',
      responsavel: 'Diego',
      prazo: '2026-10-14'
    },
    {
      id: '5',
      projetoId: '2',
      titulo: 'Desenhar o diagrama ER',
      descricao: 'Entidades livro, leitor e empréstimo',
      status: 'a-fazer',
      prioridade: 'baixa',
      responsavel: 'Ana',
      prazo: '2026-10-20'
    },
    {
      id: '6',
      projetoId: '1',
      titulo: 'Criar a barra de busca e filtros',
      descricao: 'Componente compartilhado entre a lista e o quadro',
      status: 'concluida',
      prioridade: 'alta',
      responsavel: 'Bruno',
      prazo: '2026-10-21'
    },
    {
      id: '7',
      projetoId: '1',
      titulo: 'Aplicar o tema visual da aplicação',
      descricao: 'Estilos globais com variáveis de cor',
      status: 'em-andamento',
      prioridade: 'media',
      responsavel: 'Carla',
      prazo: '2026-11-04'
    },
    {
      id: '8',
      projetoId: '2',
      titulo: 'Definir chaves e relacionamentos',
      descricao: 'Chaves primárias e estrangeiras',
      status: 'a-fazer',
      prioridade: 'media',
      responsavel: 'Diego',
      prazo: '2026-11-11'
    }
  ]
};

export type ProjetoComTarefas = Projeto & { tarefas: Tarefa[] };

export function ehNaoEncontrado(erro: unknown): boolean {
  return erro instanceof Error && erro.message === 'HTTP 404';
}

@Injectable({ providedIn: 'root' })
export class Api {

  async listarTarefas(): Promise<Tarefa[]> {
    return DADOS_INICIAIS.tarefas as unknown as Tarefa[];
  }

  async buscarTarefa(id: string): Promise<Tarefa> {
    const tarefa = DADOS_INICIAIS.tarefas.find(t => t.id === id);
    if (!tarefa) throw new Error('HTTP 404');
    return tarefa as unknown as Tarefa;
  }

  async listarProjetos(): Promise<Projeto[]> {
    return DADOS_INICIAIS.projetos as unknown as Projeto[];
  }

  async buscarProjeto(id: string): Promise<ProjetoComTarefas> {
    const projeto = DADOS_INICIAIS.projetos.find(p => p.id === id);
    if (!projeto) throw new Error('HTTP 404');
    
    const tarefasDoProjeto = DADOS_INICIAIS.tarefas.filter(t => t.projetoId === id);
    return { 
      ...(projeto as unknown as Projeto), 
      tarefas: tarefasDoProjeto as unknown as Tarefa[] 
    };
  }

  private async enviar<T>(_caminho: string, _metodo: 'POST' | 'PATCH', corpo: unknown): Promise<T> {
    return corpo as T;
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

  async excluirTarefa(_id: string): Promise<void> {
    return;
  }
}