import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';;

@Component({
    selector: 'app-dialogo-imprimir',
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule
    ],
    templateUrl: './dialogo-imprimir.component.html',
    styleUrls: ['./dialogo-imprimir.component.scss'],
})
export class DialogoImprimirComponent {
    constructor(
        private dialogRef: MatDialogRef<DialogoImprimirComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
      ) {}

      closeDialog() {
        this.dialogRef.close(false);
      }
 }
