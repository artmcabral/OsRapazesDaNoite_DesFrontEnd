import {
  Component,
  ElementRef,
  OnInit,
  inject,
  input,
  output,
  signal
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { Api } from '../../services/api';
import { Carregando } from '../carregando/carregando';
import { MensagemErro } from '../mensagem-erro/mensagem-erro';

import type {
  NovaTarefa,
  Prioridade,
  Projeto,
  Status,
  Tarefa
} from '../../../tipos';

type CampoObrigatorio =
  'titulo' | 'projetoId' | 'responsavel' | 'prazo';

@Component({
  selector: 'app-formulario-tarefa',
  imports: [
    ReactiveFormsModule,
    Carregando,
    MensagemErro
  ],
  templateUrl: './formulario-tarefa.html',
  styleUrl: './formulario-tarefa.css',
})
export class FormularioTarefa implements OnInit {

  private fb = inject(FormBuilder);
  private api = inject(Api);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private host = inject<ElementRef<HTMLElement>>(ElementRef);

  tarefa = input<Tarefa | null>(null);
  salvar = output<NovaTarefa>();

  projetos = signal<Projeto[]>([]);
  enviando = signal(false);

  // ISSUE #32 / ISSUE #38 - Estados de carregamento e erro[cite: 15]
  carregando = signal(true);
  erro = signal<string | null>(null);

  private tarefaAtual: Tarefa | null = null;

  readonly statusOpcoes: {
    valor: Status;
    rotulo: string;
  }[] = [
    { valor: 'a-fazer', rotulo: 'A fazer' },
    { valor: 'em-andamento', rotulo: 'Em andamento' },
    { valor: 'em-revisao', rotulo: 'Em revisão' },
    { valor: 'concluida', rotulo: 'Concluída' },
  ];

  readonly prioridadeOpcoes: {
    valor: Prioridade;
    rotulo: string;
  }[] = [
    { valor: 'baixa', rotulo: 'Baixa' },
    { valor: 'media', rotulo: 'Média' },
    { valor: 'alta', rotulo: 'Alta' },
  ];

  // Campos do formulário
  form = this.fb.nonNullable.group({
    titulo: ['', Validators.required],
    descricao: [''],
    projetoId: ['', Validators.required],
    status: ['a-fazer' as Status, Validators.required],
    prioridade: ['media' as Prioridade, Validators.required],
    responsavel: ['', Validators.required],
    prazo: ['', Validators.required],
  });

  // Verifica se um campo obrigatório é inválido
  mostrarErro(campo: CampoObrigatorio): boolean {
    const controle = this.form.controls[campo];
    return controle.invalid && controle.touched;
  }

  // Foca no primeiro campo inválido
  private focarPrimeiroInvalido() {
    const nome = Object.keys(this.form.controls).find(
      campo => this.form.get(campo)?.invalid
    );

    if (!nome) return;

    this.host.nativeElement
      .querySelector<HTMLElement>(
        `[formcontrolname="${nome}"]`
      )
      ?.focus();
  }

  // Inicialização
  async ngOnInit() {
    await this.carregar();
  }

  // ISSUE #32 - Carrega os dados necessários
  async carregar() {

    this.carregando.set(true);
    this.erro.set(null);

    try {

      // Busca os projetos disponíveis
      this.projetos.set(
        await this.api.listarProjetos()
      );

      // Verifica se a tarefa está sendo editada
      const id = this.route.snapshot.paramMap.get('id');

      this.tarefaAtual =
        this.tarefa() ??
        (id ? await this.api.buscarTarefa(id) : null);

      if (this.tarefaAtual) {

        // Preenche os campos ao editar
        this.form.patchValue(this.tarefaAtual);

      } else {

        // Seleciona o projeto ao criar uma tarefa
        const projetoId =
          this.route.snapshot.queryParamMap.get('projetoId');

        if (projetoId) {
          this.form.patchValue({ projetoId });
        }

      }

    } catch (erro) {

      console.error(
        'Erro ao carregar formulário da tarefa:',
        erro
      );

      this.erro.set(
        'Não foi possível carregar os dados do formulário.'
      );

    } finally {

      // Encerra o carregamento
      this.carregando.set(false);

    }
  }

  // Salva a tarefa (Ajustado para Issue #38)[cite: 15]
  async enviar() {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.focarPrimeiroInvalido();
      return;
    }

    this.enviando.set(true);
    this.erro.set(null);

    const dadosFormulario = this.form.getRawValue();

    try {

      const atual = this.tarefaAtual;

      if (atual) {

        // Atualiza uma tarefa existente
        await this.api.atualizarTarefa(
          atual.id,
          dadosFormulario
        );

      } else {

        // Cria uma nova tarefa
        await this.api.criarTarefa(
          dadosFormulario
        );

      }

      this.salvar.emit(dadosFormulario);

      await this.router.navigate([
        '/projetos',
        dadosFormulario.projetoId
      ]);

    } catch (erro) {

      console.error(
        'Erro ao salvar a tarefa:',
        erro
      );

      // ISSUE #38: Notifica a falha sem resetar o formulário[cite: 15]
      this.erro.set(
        'Não foi possível salvar a tarefa. Verifique a ligação e tente novamente.'
      );

    } finally {

      this.enviando.set(false);

    }
  }
}