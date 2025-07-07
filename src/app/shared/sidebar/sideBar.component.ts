import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { DialogComponent } from '../dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';

import { MatDialogConfig } from "@angular/material/dialog";
import { GenericDialogService } from '../dialog/genericDialog.service';
@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormlyModule
  ],
  templateUrl: './sideBar.component.html',
  styleUrls: ['./sideBar.component.css'],
})
export class SideBarComponent {

  constructor(
    private activeOffcanvas: NgbActiveOffcanvas,
    private _dialog: MatDialog,
    private _dialogService: GenericDialogService
  ) { }

  tituloOffCanvas: string;
  modelOffCanvas: any = {};
  formOffCanvas = new FormGroup({});
  fieldsOffCanvas: FormlyFieldConfig[];
  dialogConfigCloseOffCanvas: MatDialogConfig;
  dialogConfigConfirmOffCanvas: MatDialogConfig;


  closeOffCanvas() {

    if (this.dialogConfigCloseOffCanvas) {
      const dialogRef = this._dialog.open(
        DialogComponent,
        this.dialogConfigCloseOffCanvas
      );

      dialogRef.afterClosed().subscribe(
        async data => {
          if (data == true) {
            this.activeOffcanvas.close(null);
          }
        }
      );
    } else {
      this.activeOffcanvas.close(null);
    }



  }

  confirmOffCanvas() {

    if (this.formOffCanvas.invalid) {
      this.validaCamposFormulario([this.formOffCanvas])
      return
    }

    const dialogRef = this._dialog.open(
      DialogComponent,
      this.dialogConfigConfirmOffCanvas ? this.dialogConfigConfirmOffCanvas : this._dialogService.guardar()
    );

    dialogRef.afterClosed().subscribe(
      async data => {
        if (data == true) {
          this.activeOffcanvas.close(this.modelOffCanvas);
        }
      }
    );


  }

  validaCamposFormulario(formGroups: FormGroup[]) {
    formGroups.forEach((formulario) => {
      Object.keys(formulario.controls).forEach((field) => {
        const control = formulario.get(field);
        if (control instanceof FormControl) {
          control.markAsTouched({ onlySelf: true });
        } else if (control instanceof FormGroup) {
          this.validaCamposFormulario([control]);
        } else if (control instanceof FormArray) {
          control.controls.forEach((element) => {
            if (element instanceof FormControl) {
              element.markAsTouched({ onlySelf: true });
            } else if (element instanceof FormGroup) {
              this.validaCamposFormulario([element]);
            }
          });
        }
      });
    });
  }

}
