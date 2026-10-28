import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Quadro } from './quadro';

describe('Quadro', () => {
  let component: Quadro;
  let fixture: ComponentFixture<Quadro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Quadro],
    }).compileComponents();

    fixture = TestBed.createComponent(Quadro);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
