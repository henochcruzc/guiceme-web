import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleMezclaAntibioticoComponent } from './detalle-mezcla-antibiotico.component';

describe('DetalleMezclaAntibioticoComponent', () => {
  let component: DetalleMezclaAntibioticoComponent;
  let fixture: ComponentFixture<DetalleMezclaAntibioticoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetalleMezclaAntibioticoComponent]
    });
    fixture = TestBed.createComponent(DetalleMezclaAntibioticoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
