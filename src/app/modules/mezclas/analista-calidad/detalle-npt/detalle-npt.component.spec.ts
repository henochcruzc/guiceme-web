import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleNPTComponent } from './detalle-npt.component';

describe('DetalleNPTComponent', () => {
  let component: DetalleNPTComponent;
  let fixture: ComponentFixture<DetalleNPTComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetalleNPTComponent]
    });
    fixture = TestBed.createComponent(DetalleNPTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
