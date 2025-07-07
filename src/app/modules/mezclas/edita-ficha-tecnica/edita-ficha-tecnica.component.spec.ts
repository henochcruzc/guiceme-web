import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditaFichaTecnicaComponent } from './edita-ficha-tecnica.component';

describe('EditaFichaTecnicaComponent', () => {
  let component: EditaFichaTecnicaComponent;
  let fixture: ComponentFixture<EditaFichaTecnicaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditaFichaTecnicaComponent]
    });
    fixture = TestBed.createComponent(EditaFichaTecnicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
