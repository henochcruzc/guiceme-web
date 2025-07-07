import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleMezclaCitotoxicoComponent } from './detalle-mezcla-citotoxico.component';

describe('DetalleMezclaCitotoxicoComponent', () => {
  let component: DetalleMezclaCitotoxicoComponent;
  let fixture: ComponentFixture<DetalleMezclaCitotoxicoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetalleMezclaCitotoxicoComponent]
    });
    fixture = TestBed.createComponent(DetalleMezclaCitotoxicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
