import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Api } from '../../services/api';

@Component({
  selector: 'app-formulario-projeto',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './formulario-projeto.html',
  styleUrl: './formulario-projeto.css',
})
export class FormularioProjeto implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private api = inject(Api);

  idProjeto = signal<string | null>(null);
  nome = signal<string>('');
  descricao = signal<string>('');
  carregando = signal<boolean>(false);
  erro = signal<string | null>(null);

  isEdicao = signal<boolean>(false);

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'novo') {
      this.idProjeto.set(id);
      this.isEdicao.set(true);
      await this.carregarProjeto(id);
    }
  }

  async carregarProjeto(id: string) {
    try {
      this.carregando.set(true);
      const proj = await this.api.buscarProjeto(id);
      // Suporta 'titulo' ou 'nome' de acordo com o padrão do db.json
      const nomeEncontrado = (proj as any).titulo || proj.nome || '';
      this.nome.set(nomeEncontrado);
      this.descricao.set(proj.descricao || '');
    } catch (e: any) {
      this.erro.set('Erro ao carregar dados do projeto.');
    } finally {
      this.carregando.set(false);
    }
  }

  async salvar(event: Event) {
    event.preventDefault();
    if (!this.nome().trim()) {
      this.erro.set('O nome do projeto é obrigatório.');
      return;
    }

    try {
      this.carregando.set(true);
      this.erro.set(null);

      const dados = {
        titulo: this.nome(),
        nome: this.nome(),
        descricao: this.descricao(),
      };

      if (this.isEdicao() && this.idProjeto()) {
        await this.api.atualizarProjeto(this.idProjeto()!, dados as any);
      } else {
        await this.api.criarProjeto(dados as any);
      }

      this.router.navigate(['/projetos']);
    } catch (e: any) {
      this.erro.set('Erro ao salvar o projeto. Tente novamente.');
    } finally {
      this.carregando.set(false);
    }
  }
}