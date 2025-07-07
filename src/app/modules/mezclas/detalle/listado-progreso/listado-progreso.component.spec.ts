import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoProgresoComponent } from './listado-progreso.component';

describe('ListadoProgresoComponent', () => {
  let component: ListadoProgresoComponent;
  let fixture: ComponentFixture<ListadoProgresoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListadoProgresoComponent]
    });
    fixture = TestBed.createComponent(ListadoProgresoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
