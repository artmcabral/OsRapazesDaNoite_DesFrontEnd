
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Api } from '../../../services/api';
import { Carregando } from '../../../components/carregando/carregando';
import { MensagemErro } from '../../../components/mensagem-erro/mensagem-erro';
import type { Tarefa } from '../../../../tipos';

@Component({
  selector: 'app-detalhe-tarefa',
  imports: [Carregando, RouterLink, MensagemErro],
  templateUrl: './detalhe-tarefa.html',
  styleUrl: './detalhe-tarefa.css',
})
export class DetalheTarefa implements OnInit {

  private api = inject(Api);
  private rota = inject(ActivatedRoute);

  tarefa = signal<Tarefa | null>(null);
  carregando = signal(true);
  erro = signal<string | null>(null);

  // ISSUE #33 - Controle de novas tentativas
  podeTentarDeNovo = signal(true);

  async ngOnInit() {
    await this.carregar();
  }

  // ISSUE #32 - Carregamento dos detalhes da tarefa
  async carregar() {

    const id = this.rota.snapshot.paramMap.get('id');

    this.carregando.set(true);
    this.erro.set(null);
    this.podeTentarDeNovo.set(true);

    if (!id) {
      this.erro.set('Identificador da tarefa não encontrado.');
      this.podeTentarDeNovo.set(false);
      this.carregando.set(false);
      return;
    }

    try {

      // Busca a tarefa na API
      this.tarefa.set(
        await this.api.buscarTarefa(id)
      );

    } catch (erro) {

      const naoExiste =
        erro instanceof Error &&
        erro.message === 'HTTP 404';

      this.erro.set(
        naoExiste
          ? 'Tarefa não encontrada.'
          : 'Não foi possível carregar os detalhes da tarefa.'
      );

      this.podeTentarDeNovo.set(!naoExiste);

    } finally {

      // Finaliza o carregamento mesmo em caso de erro
      this.carregando.set(false);

    }
  }
}
