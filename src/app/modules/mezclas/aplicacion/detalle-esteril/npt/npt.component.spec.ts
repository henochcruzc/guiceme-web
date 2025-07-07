import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NptComponent } from './npt.component';

describe('NptComponent', () => {
  let component: NptComponent;
  let fixture: ComponentFixture<NptComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NptComponent]
    });
    fixture = TestBed.createComponent(NptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
