import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Api } from '../../../services/api';
import { MensagemErro } from '../../../components/mensagem-erro/mensagem-erro';
import type { Tarefa } from '../../../../tipos';

@Component({
  selector: 'app-detalhe-tarefa',
  imports: [RouterLink, MensagemErro],
  templateUrl: './detalhe-tarefa.html',
  styleUrl: './detalhe-tarefa.css',
})
export class DetalheTarefa implements OnInit {
  private api = inject(Api);
  private rota = inject(ActivatedRoute);

  tarefa = signal<Tarefa | null>(null);
  carregando = signal(true);
  erro = signal<string | null>(null);

  // false quando a tarefa não existe: tentar de novo não adianta (#33)
  podeTentarDeNovo = signal(true);

  async ngOnInit() {
    await this.carregar();
  }

  // Busca a tarefa na API
  // (também é chamada pelo botão "Tentar de novo" - #33)
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
      this.tarefa.set(await this.api.buscarTarefa(id));
    } catch (erro) {
      // A API responde 404 quando o id não existe
      const naoExiste = erro instanceof Error && erro.message === 'HTTP 404';

      this.erro.set(
        naoExiste
          ? 'Tarefa não encontrada.'
          : 'Não foi possível carregar os detalhes da tarefa.'
      );
      this.podeTentarDeNovo.set(!naoExiste);
    } finally {
      this.carregando.set(false);
    }
  }
}