
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-carregando',
  templateUrl: './carregando.html',
  styleUrl: './carregando.css',
})
export class Carregando {
  mensagem = input('Carregando...');
}
