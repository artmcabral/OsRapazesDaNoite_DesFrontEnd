import { Component, OnInit, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Api } from '../../services/api';
import type { NovaTarefa, Prioridade, Projeto, Status, Tarefa } from '../../../tipos';

@Component({
  selector: 'app-formulario-tarefa',
  imports: [ReactiveFormsModule],
  templateUrl: './formulario-tarefa.html',
  styleUrl: './formulario-tarefa.css',
})
export class FormularioTarefa implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(Api);

  tarefa = input<Tarefa | null>(null);
  salvar = output<NovaTarefa>();

  projetos = signal<Projeto[]>([]);

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

  async ngOnInit() {
    this.projetos.set(await this.api.listarProjetos());

    const atual = this.tarefa();
    if (atual) this.form.patchValue(atual);
  }

  enviar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.salvar.emit(this.form.getRawValue());
  }
}