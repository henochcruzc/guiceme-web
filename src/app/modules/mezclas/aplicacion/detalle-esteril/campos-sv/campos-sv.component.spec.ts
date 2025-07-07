import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CamposSvComponent } from './campos-sv.component';

describe('CamposSvComponent', () => {
  let component: CamposSvComponent;
  let fixture: ComponentFixture<CamposSvComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CamposSvComponent]
    });
    fixture = TestBed.createComponent(CamposSvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
