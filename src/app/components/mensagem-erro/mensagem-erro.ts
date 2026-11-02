import { Component, input, output } from '@angular/core';

// Issue #33 — mensagem clara quando a API falha + opção de tentar de novo
@Component({
  selector: 'app-mensagem-erro',
  templateUrl: './mensagem-erro.html',
  styleUrl: './mensagem-erro.css',
})
export class MensagemErro {

  // Texto específico de cada tela (ex.: "Não foi possível carregar as tarefas.")
  mensagem = input.required<string>();

  // Avisa a página para buscar os dados outra vez
  tentarNovamente = output<void>();
}
