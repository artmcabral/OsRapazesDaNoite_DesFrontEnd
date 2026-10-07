export type Status = 'a-fazer' | 'em-andamento' | 'em-revisao' | 'concluida'
export type Prioridade = 'baixa' | 'media' | 'alta'
export interface Projeto {
id: string
nome: string
descricao: string
disciplina: string
criadoEm: string
}
export interface Tarefa {
id: string
projetoId: string
titulo: string
descricao: string
status: Status
prioridade: Prioridade
responsavel: string
prazo: string
}
export type NovaTarefa = Omit<Tarefa, 'id'>