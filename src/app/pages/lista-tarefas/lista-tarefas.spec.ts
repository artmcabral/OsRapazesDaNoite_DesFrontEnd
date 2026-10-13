import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaTarefas } from './lista-tarefas';

describe('ListaTarefas', () => {
  let component: ListaTarefas;
  let fixture: ComponentFixture<ListaTarefas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaTarefas],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaTarefas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
