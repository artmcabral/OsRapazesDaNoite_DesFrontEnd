import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormularioProjeto } from './formulario-projeto';

describe('FormularioProjeto', () => {
  let component: FormularioProjeto;
  let fixture: ComponentFixture<FormularioProjeto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioProjeto],
    }).compileComponents();

    fixture = TestBed.createComponent(FormularioProjeto);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
