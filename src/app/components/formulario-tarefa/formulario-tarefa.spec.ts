import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormularioTarefa } from './formulario-tarefa';

describe('FormularioTarefa', () => {
  let component: FormularioTarefa;
  let fixture: ComponentFixture<FormularioTarefa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioTarefa],
    }).compileComponents();

    fixture = TestBed.createComponent(FormularioTarefa);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
