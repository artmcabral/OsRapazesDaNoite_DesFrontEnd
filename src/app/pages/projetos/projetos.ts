import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Api } from '../../services/api';
import { MensagemErro } from '../../components/mensagem-erro/mensagem-erro';
import { EstadoVazio } from '../../components/estado-vazio/estado-vazio';
import type { Projeto } from '../../../tipos';

@Component({
  selector: 'app-projetos',
  imports: [RouterLink, MensagemErro, EstadoVazio],
  templateUrl: './projetos.html',
  styleUrl: './projetos.css',
})
export class Projetos implements OnInit {
  private api = inject(Api);

  projetos = signal<Projeto[]>([]);
  carregando = signal(true);
  erro = signal<string | null>(null);

  async ngOnInit() {
    await this.carregar();
  }

  // Busca os projetos na API
  // (também é chamada pelo botão "Tentar de novo" - #33)
  async carregar() {
    this.carregando.set(true);
    this.erro.set(null);

    try {
      this.projetos.set(await this.api.listarProjetos());
    } catch {
      this.erro.set('Não foi possível carregar os projetos.');
    } finally {
      this.carregando.set(false);
    }
  }
}