import { Routes } from '@angular/router';
import { NaoEncontrada } from './paginas/nao-encontrada/nao-encontrada';

// Seus colegas já devem ter criado alguns desses componentes. 
// Caso algum ainda não exista no projeto, você pode importar o componente que estiver disponível 
// ou manter a rota apontada para o componente correto assim que for criado.

export const routes: Routes = [
  { path: '', redirectTo: 'tarefas', pathMatch: 'full' },
  
  // Rota inicial / tarefas (pode importar o componente de lista de tarefas)
  // { path: 'tarefas', component: ListaTarefasComponent },
  
  // Rota de detalhe da tarefa
  // { path: 'tarefas/:id', component: DetalheTarefaComponent },
  
  // Rota de lista de projetos
  // { path: 'projetos', component: ListaProjetosComponent },
  
  // Rota da página do projeto
  // { path: 'projetos/:id', component: PaginaProjetoComponent },

  // Rota Coringa para erro 404 (deve ser sempre a ÚLTIMA da lista!)
  { path: '**', component: NaoEncontrada }
];