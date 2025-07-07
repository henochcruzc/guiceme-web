import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoComponentesComponent } from './listado-componentes.component';

describe('ListadoComponentesComponent', () => {
  let component: ListadoComponentesComponent;
  let fixture: ComponentFixture<ListadoComponentesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListadoComponentesComponent]
    });
    fixture = TestBed.createComponent(ListadoComponentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
