import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignacionLoteComponent } from './asignacion-lote.component';

describe('AsignacionLoteComponent', () => {
  let component: AsignacionLoteComponent;
  let fixture: ComponentFixture<AsignacionLoteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AsignacionLoteComponent]
    });
    fixture = TestBed.createComponent(AsignacionLoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
