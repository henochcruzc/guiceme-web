import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MezclasNoAprobadasComponent } from './mezclas-no-aprobadas.component';

describe('MezclasNoAprobadasComponent', () => {
  let component: MezclasNoAprobadasComponent;
  let fixture: ComponentFixture<MezclasNoAprobadasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MezclasNoAprobadasComponent]
    });
    fixture = TestBed.createComponent(MezclasNoAprobadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
