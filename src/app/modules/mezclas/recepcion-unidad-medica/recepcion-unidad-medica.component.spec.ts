import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecepcionUnidadMedicaComponent } from './recepcion-unidad-medica.component';

describe('RecepcionUnidadMedicaComponent', () => {
  let component: RecepcionUnidadMedicaComponent;
  let fixture: ComponentFixture<RecepcionUnidadMedicaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecepcionUnidadMedicaComponent]
    });
    fixture = TestBed.createComponent(RecepcionUnidadMedicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
