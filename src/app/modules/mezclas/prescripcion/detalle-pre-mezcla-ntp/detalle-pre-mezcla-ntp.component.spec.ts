import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallePreMezclaNTPComponent } from './detalle-pre-mezcla-ntp.component';

describe('DetallePreMezclaNTPComponent', () => {
  let component: DetallePreMezclaNTPComponent;
  let fixture: ComponentFixture<DetallePreMezclaNTPComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetallePreMezclaNTPComponent]
    });
    fixture = TestBed.createComponent(DetallePreMezclaNTPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
