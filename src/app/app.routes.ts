import { FormularioProjeto } from './components/formulario-projeto/formulario-projeto';
import { Routes } from '@angular/router';
import { NaoEncontrada } from './paginas/nao-encontrada/nao-encontrada';
import { ListaTarefas } from './pages/lista-tarefas/lista-tarefas';
import { DetalheTarefa } from './pages/lista-tarefas/detalhe-tarefa/detalhe-tarefa';
import { Projetos } from './pages/projetos/projetos';
import { DetalheProjeto } from './pages/projetos/detalhe-projeto';
import { FormularioTarefa } from './components/formulario-tarefa/formulario-tarefa';
import { Quadro } from './pages/quadro/quadro';

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
  },
  {
    path: 'tarefas/:id',
    component: DetalheTarefa,
  },
  {
    path: 'tarefas/:id/editar',
    component: FormularioTarefa,
  },
  {
    path: 'projetos',
    component: Projetos,
  },
  {
    path: 'projetos/novo',
    component: FormularioProjeto,
  },
  {
    path: 'projetos/:id',
    component: DetalheProjeto,
  },
  {
    path: 'projetos/:id/editar',
    component: FormularioProjeto,
  },
  {
    path: 'quadro',
    component: Quadro,
  },
  {
    path: '**',
    component: NaoEncontrada,
  },
];