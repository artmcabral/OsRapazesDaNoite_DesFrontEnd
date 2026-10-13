import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TarefaCard } from './tarefa-card';

describe('TarefaCard', () => {
  let component: TarefaCard;
  let fixture: ComponentFixture<TarefaCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarefaCard],
    }).compileComponents();

    fixture = TestBed.createComponent(TarefaCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
