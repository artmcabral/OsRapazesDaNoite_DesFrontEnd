import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Api, ehNaoEncontrado } from '../../../services/api';
import { Carregando } from '../../../components/carregando/carregando';
import { MensagemErro } from '../../../components/mensagem-erro/mensagem-erro';
import { NaoEncontrada } from '../../../paginas/nao-encontrada/nao-encontrada';
import type { Tarefa } from '../../../../tipos';

@Component({
  selector: 'app-detalhe-tarefa',
  imports: [Carregando, RouterLink, MensagemErro, NaoEncontrada],
  templateUrl: './detalhe-tarefa.html',
  styleUrl: './detalhe-tarefa.css',
})
export class DetalheTarefa implements OnInit {

  private api = inject(Api);
  private rota = inject(ActivatedRoute);

  tarefa = signal<Tarefa | null>(null);
  carregando = signal(true);
  erro = signal<string | null>(null);

  // Issue #37 - a tarefa do endereço não existe
  naoEncontrada = signal(false);

  async ngOnInit() {
    await this.carregar();
  }

  // ISSUE #32 - Carregamento dos detalhes da tarefa
  async carregar() {

    const id = this.rota.snapshot.paramMap.get('id');

    this.carregando.set(true);
    this.erro.set(null);

    if (!id) {
      this.naoEncontrada.set(true);
      this.carregando.set(false);
      return;
    }

    try {

      // Busca a tarefa na API
      this.tarefa.set(
        await this.api.buscarTarefa(id)
      );

    } catch (erro) {

      if (ehNaoEncontrado(erro)) {
        this.naoEncontrada.set(true);
      } else {
        this.erro.set('Não foi possível carregar os detalhes da tarefa.');
      }

    } finally {

      // Finaliza o carregamento mesmo em caso de erro
      this.carregando.set(false);

    }
  }
}