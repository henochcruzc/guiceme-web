import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleMezclaNTPComponent } from './detalle-mezcla-ntp.component';

describe('DetalleMezclaNTPComponent', () => {
  let component: DetalleMezclaNTPComponent;
  let fixture: ComponentFixture<DetalleMezclaNTPComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetalleMezclaNTPComponent]
    });
    fixture = TestBed.createComponent(DetalleMezclaNTPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
