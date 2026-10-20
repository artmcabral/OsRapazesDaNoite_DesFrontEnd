import { Routes } from '@angular/router';
import { NaoEncontrada } from './paginas/nao-encontrada/nao-encontrada';
import { ListaTarefas } from './pages/lista-tarefas/lista-tarefas';
import { DetalheTarefa } from './pages/lista-tarefas/detalhe-tarefa/detalhe-tarefa';
import { Projetos } from './pages/projetos/projetos';
import { DetalheProjeto } from './pages/projetos/detalhe-projeto';
import { FormularioTarefa } from './components/formulario-tarefa/formulario-tarefa';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tarefas',
    pathMatch: 'full',
  },
  {
    path: 'tarefas',
    component: ListaTarefas,
  },
  {
    path: 'tarefas/nova',
    component: FormularioTarefa,
    title: 'Nova Tarefa',
  },
  {
    path: 'tarefas/:id/editar',
    component: FormularioTarefa,
    title: 'Editar Tarefa',
  },
  {
    path: 'tarefas/:id',
    component: DetalheTarefa,
  },
  {
    path: 'projetos',
    component: Projetos,
  },
  {
    path: 'projetos/:id',
    component: DetalheProjeto,
  },
  {
    path: '**',
    component: NaoEncontrada,
  },
];