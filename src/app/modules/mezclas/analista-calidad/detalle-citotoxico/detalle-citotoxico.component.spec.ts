import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleCitotoxicoComponent } from './detalle-citotoxico.component';

describe('DetalleCitotoxicoComponent', () => {
  let component: DetalleCitotoxicoComponent;
  let fixture: ComponentFixture<DetalleCitotoxicoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetalleCitotoxicoComponent]
    });
    fixture = TestBed.createComponent(DetalleCitotoxicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
