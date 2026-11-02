
import {
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';

import { Api, ehNaoEncontrado } from '../../services/api';
import type { ProjetoComTarefas } from '../../services/api';
import { TarefaCard } from '../../components/tarefa-card/tarefa-card';
import { Carregando } from '../../components/carregando/carregando';
import { MensagemErro } from '../../components/mensagem-erro/mensagem-erro';
import { EstadoVazio } from '../../components/estado-vazio/estado-vazio';
import { NaoEncontrada } from '../../paginas/nao-encontrada/nao-encontrada';

import type { Tarefa } from '../../../tipos';

@Component({
  selector: 'app-detalhe-projeto',
  imports: [
    Carregando,
    RouterLink,
    TarefaCard,
    MensagemErro,
    EstadoVazio,
    NaoEncontrada
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

  // Issue #37 - o projeto do endereço não existe
  naoEncontrado = signal(false);

  async ngOnInit() {
    await this.carregar();
  }

  // ISSUE #32 - Carrega os dados do projeto
  async carregar() {

    const id = this.rota.snapshot.paramMap.get('id');

    this.carregando.set(true);
    this.erro.set(null);

    if (!id) {
      this.naoEncontrado.set(true);
      this.carregando.set(false);
      return;
    }

    try {

      const dados = await this.api.buscarProjeto(id);
      this.projeto.set(dados);

    } catch (erro) {

      if (ehNaoEncontrado(erro)) {
        this.naoEncontrado.set(true);
      } else {
        this.erro.set('Não foi possível carregar o projeto.');
      }

    } finally {
      this.carregando.set(false);
    }
  }

  // Atualiza o status da tarefa
  aoAlterarStatus(tarefaAtualizada: Tarefa) {

    this.projeto.update(projeto => {

      if (!projeto) {
        return projeto;
      }

      return {
        ...projeto,
        tarefas: projeto.tarefas.map(tarefa =>
          tarefa.id === tarefaAtualizada.id
            ? tarefaAtualizada
            : tarefa
        )
      };
    });
  }

  // ISSUE #31 - Remove uma tarefa excluída
  aoExcluir(id: string) {

    this.projeto.update(projeto =>
      projeto
        ? {
            ...projeto,
            tarefas: projeto.tarefas.filter(
              tarefa => tarefa.id !== id
            )
          }
        : projeto
    );
  }
}
