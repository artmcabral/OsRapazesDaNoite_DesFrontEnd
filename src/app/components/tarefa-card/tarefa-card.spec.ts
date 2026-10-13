import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TarefaCard } from './tarefa-card';
import type { Tarefa } from '../../../tipos';

const tarefaExemplo: Tarefa = {
  id: '1',
  projetoId: '1',
  titulo: 'Criar o repositório',
  descricao: 'Repositório da equipe no GitHub',
  status: 'em-andamento',
  prioridade: 'alta',
  responsavel: 'Ana',
  prazo: '2026-10-06',
};

describe('TarefaCard', () => {
  let component: TarefaCard;
  let fixture: ComponentFixture<TarefaCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarefaCard],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(TarefaCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('tarefa', tarefaExemplo);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('mostra o título, o status com rótulo e o prazo formatado', () => {
    const texto = (fixture.nativeElement as HTMLElement).textContent;
    expect(texto).toContain('Criar o repositório');
    expect(texto).toContain('Em andamento');
    expect(texto).toContain('06/10/2026');
  });
});