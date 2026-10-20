import { Component, OnInit, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Api } from '../../services/api';
import type { NovaTarefa, Prioridade, Projeto, Status, Tarefa } from '../../../tipos';

type CampoObrigatorio = 'titulo' | 'projetoId' | 'responsavel' | 'prazo';

@Component({
  selector: 'app-formulario-tarefa',
  imports: [ReactiveFormsModule],
  templateUrl: './formulario-tarefa.html',
  styleUrl: './formulario-tarefa.css',
})
export class FormularioTarefa implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(Api);
  private router = inject(Router);

  tarefa = input<Tarefa | null>(null);
  salvar = output<NovaTarefa>();

  projetos = signal<Projeto[]>([]);
  enviando = signal(false);

  readonly statusOpcoes: { valor: Status; rotulo: string }[] = [
    { valor: 'a-fazer', rotulo: 'A fazer' },
    { valor: 'em-andamento', rotulo: 'Em andamento' },
    { valor: 'em-revisao', rotulo: 'Em revisão' },
    { valor: 'concluida', rotulo: 'Concluída' },
  ];

  readonly prioridadeOpcoes: { valor: Prioridade; rotulo: string }[] = [
    { valor: 'baixa', rotulo: 'Baixa' },
    { valor: 'media', rotulo: 'Média' },
    { valor: 'alta', rotulo: 'Alta' },
  ];

  form = this.fb.nonNullable.group({
    titulo: ['', Validators.required],
    descricao: [''],
    projetoId: ['', Validators.required],
    status: ['a-fazer' as Status, Validators.required],
    prioridade: ['media' as Prioridade, Validators.required],
    responsavel: ['', Validators.required],
    prazo: ['', Validators.required],
  });
  
  mostrarErro(campo: CampoObrigatorio): boolean {
    const controle = this.form.controls[campo];
    return controle.invalid && controle.touched;
  }

  async ngOnInit() {
    this.projetos.set(await this.api.listarProjetos());

    const atual = this.tarefa();
    if (atual) this.form.patchValue(atual);
  }

  async enviar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.enviando.set(true);

    const dadosFormulario = this.form.getRawValue();
    this.salvar.emit(dadosFormulario);

    try {
      const atual = this.tarefa();
      if (atual) {
        await this.api.atualizarTarefa(atual.id, dadosFormulario);
      } else {
        await this.api.criarTarefa(dadosFormulario);
      }

      this.router.navigate(['/projetos', dadosFormulario.projetoId]);
    } catch (erro) {
      console.error('Erro ao salvar a tarefa:', erro);
    } finally {
      this.enviando.set(false);
    }
  }
}