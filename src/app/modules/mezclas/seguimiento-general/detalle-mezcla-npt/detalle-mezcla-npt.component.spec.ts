import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleMezclaNptComponent } from './detalle-mezcla-npt.component';

describe('DetalleMezclaNptComponent', () => {
  let component: DetalleMezclaNptComponent;
  let fixture: ComponentFixture<DetalleMezclaNptComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetalleMezclaNptComponent]
    });
    fixture = TestBed.createComponent(DetalleMezclaNptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
