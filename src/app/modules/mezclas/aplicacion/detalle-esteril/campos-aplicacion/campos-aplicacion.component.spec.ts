import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CamposAplicacionComponent } from './campos-aplicacion.component';

describe('CamposAplicacionComponent', () => {
  let component: CamposAplicacionComponent;
  let fixture: ComponentFixture<CamposAplicacionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CamposAplicacionComponent]
    });
    fixture = TestBed.createComponent(CamposAplicacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
