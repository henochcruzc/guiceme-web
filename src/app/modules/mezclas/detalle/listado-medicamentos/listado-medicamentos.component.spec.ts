import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoMedicamentosComponent } from './listado-medicamentos.component';

describe('ListadoMedicamentosComponent', () => {
  let component: ListadoMedicamentosComponent;
  let fixture: ComponentFixture<ListadoMedicamentosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListadoMedicamentosComponent]
    });
    fixture = TestBed.createComponent(ListadoMedicamentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
