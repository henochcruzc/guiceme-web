import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoDiluyenteComponent } from './listado-diluyente.component';

describe('ListadoDiluyenteComponent', () => {
  let component: ListadoDiluyenteComponent;
  let fixture: ComponentFixture<ListadoDiluyenteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListadoDiluyenteComponent]
    });
    fixture = TestBed.createComponent(ListadoDiluyenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
