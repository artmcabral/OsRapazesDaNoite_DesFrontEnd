
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Api } from '../../services/api';
import type { ProjetoComTarefas } from '../../services/api';
import { TarefaCard } from '../../components/tarefa-card/tarefa-card';
import { MensagemErro } from '../../components/mensagem-erro/mensagem-erro';
import { EstadoVazio } from '../../components/estado-vazio/estado-vazio';
import type { Tarefa } from '../../../tipos';

@Component({
  selector: 'app-detalhe-projeto',
  imports: [
    RouterLink,
    TarefaCard,
    MensagemErro,
    EstadoVazio
  ],
  templateUrl: './detalhe-projeto.html',
  styleUrl: './detalhe-projeto.css',
})
export class DetalheProjeto implements OnInit {

  private api = inject(Api);
  private rota = inject(ActivatedRoute);

  projeto = signal<ProjetoComTarefas | null>(null);
  carregando = signal(true);
  erro = signal<string | null>(null);

  // Controla se é possível tentar novamente
  podeTentarDeNovo = signal(true);

  async ngOnInit() {
    await this.carregar();
  }

  // Busca os dados do projeto
  async carregar() {
    const id = this.rota.snapshot.paramMap.get('id');

    this.carregando.set(true);
    this.erro.set(null);
    this.podeTentarDeNovo.set(true);

    if (!id) {
      this.erro.set('Projeto não encontrado.');
      this.podeTentarDeNovo.set(false);
      this.carregando.set(false);
      return;
    }

    try {
      this.projeto.set(await this.api.buscarProjeto(id));
    } catch (erro) {

      const naoExiste =
        erro instanceof Error &&
        erro.message === 'HTTP 404';

      this.erro.set(
        naoExiste
          ? 'Projeto não encontrado.'
          : 'Não foi possível carregar o projeto.'
      );

      this.podeTentarDeNovo.set(!naoExiste);

    } finally {
      this.carregando.set(false);
    }
  }

  // Atualiza o status da tarefa
  aoAlterarStatus(tarefaAtualizada: Tarefa) {
    this.projeto.update((projeto) => {

      if (!projeto) {
        return projeto;
      }

      return {
        ...projeto,
        tarefas: projeto.tarefas.map((tarefa) =>
          tarefa.id === tarefaAtualizada.id
            ? tarefaAtualizada
            : tarefa
        )
      };
    });
  }

  // ISSUE #31 - Exclui a tarefa da lista do projeto
  aoExcluir(id: string) {
    this.projeto.update(projeto =>
      projeto
        ? {
            ...projeto,
            tarefas: projeto.tarefas.filter(
              t => t.id !== id
            )
          }
        : projeto
    );
  }
}
