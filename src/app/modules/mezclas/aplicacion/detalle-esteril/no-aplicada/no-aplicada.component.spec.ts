import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoAplicadaComponent } from './no-aplicada.component';

describe('NoAplicadaComponent', () => {
  let component: NoAplicadaComponent;
  let fixture: ComponentFixture<NoAplicadaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NoAplicadaComponent]
    });
    fixture = TestBed.createComponent(NoAplicadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
