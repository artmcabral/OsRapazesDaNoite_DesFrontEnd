import type { Prioridade, Status, Tarefa } from './tipos';

export interface Filtros {
  busca: string;
  status: Status | 'todos';
  prioridade: Prioridade | 'todas';
}

export const FILTROS_INICIAIS: Filtros = {
  busca: '',
  status: 'todos',
  prioridade: 'todas',
};

export function filtrarTarefas(tarefas: Tarefa[], f: Filtros): Tarefa[] {
  const termo = f.busca.trim().toLocaleLowerCase('pt-BR');
  return tarefas.filter(
    (t) =>
      (t.titulo.toLocaleLowerCase('pt-BR').includes(termo) ||
        t.responsavel.toLocaleLowerCase('pt-BR').includes(termo)) &&
      (f.status === 'todos' || t.status === f.status) &&
      (f.prioridade === 'todas' || t.prioridade === f.prioridade),
  );
}