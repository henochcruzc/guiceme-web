import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleAntiComponent } from './detalle-anti.component';

describe('DetalleAntiComponent', () => {
  let component: DetalleAntiComponent;
  let fixture: ComponentFixture<DetalleAntiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetalleAntiComponent]
    });
    fixture = TestBed.createComponent(DetalleAntiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
