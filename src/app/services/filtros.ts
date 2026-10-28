import { Service, signal } from '@angular/core';
import { FILTROS_INICIAIS, type Filtros } from '../../derivar';

@Service()
export class FiltrosService {
  private readonly estado = signal<Filtros>({ ...FILTROS_INICIAIS });

  readonly filtros = this.estado.asReadonly();

  alterar(parcial: Partial<Filtros>): void {
    this.estado.update((atual) => ({ ...atual, ...parcial }));
  }
}