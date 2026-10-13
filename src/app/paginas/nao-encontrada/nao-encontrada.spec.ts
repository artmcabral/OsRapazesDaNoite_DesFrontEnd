import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NaoEncontrada } from './nao-encontrada';

describe('NaoEncontrada', () => {
  let component: NaoEncontrada;
  let fixture: ComponentFixture<NaoEncontrada>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NaoEncontrada],
    }).compileComponents();

    fixture = TestBed.createComponent(NaoEncontrada);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
