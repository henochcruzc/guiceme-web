import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignacionTurnoComponent } from './asignacion-turno.component';

describe('AsignacionTurnoComponent', () => {
  let component: AsignacionTurnoComponent;
  let fixture: ComponentFixture<AsignacionTurnoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AsignacionTurnoComponent]
    });
    fixture = TestBed.createComponent(AsignacionTurnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
