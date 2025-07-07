import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleMezclaComponent } from './detalle-mezcla.component';

describe('DetalleMezclaComponent', () => {
  let component: DetalleMezclaComponent;
  let fixture: ComponentFixture<DetalleMezclaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetalleMezclaComponent]
    });
    fixture = TestBed.createComponent(DetalleMezclaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
