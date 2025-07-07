import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignacionMedicamentosComponent } from './asignacion-medicamentos.component';

describe('AsignacionMedicamentosComponent', () => {
  let component: AsignacionMedicamentosComponent;
  let fixture: ComponentFixture<AsignacionMedicamentosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AsignacionMedicamentosComponent]
    });
    fixture = TestBed.createComponent(AsignacionMedicamentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
