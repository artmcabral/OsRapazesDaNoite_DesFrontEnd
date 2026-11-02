import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';



@Component({
  selector: 'app-nao-encontrada',
  imports: [RouterLink],
  templateUrl: './nao-encontrada.html',
  styleUrl: './nao-encontrada.css',
})
export class NaoEncontrada {
  titulo = input('Página não encontrada');
  mensagem = input('O endereço que você tentou acessar não existe ou foi movido.');
  destino = input('/');
  rotuloLink = input('Voltar para a página inicial');
}