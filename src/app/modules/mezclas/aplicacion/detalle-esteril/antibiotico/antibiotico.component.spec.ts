import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AntibioticoComponent } from './antibiotico.component';

describe('AntibioticoComponent', () => {
  let component: AntibioticoComponent;
  let fixture: ComponentFixture<AntibioticoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AntibioticoComponent]
    });
    fixture = TestBed.createComponent(AntibioticoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
