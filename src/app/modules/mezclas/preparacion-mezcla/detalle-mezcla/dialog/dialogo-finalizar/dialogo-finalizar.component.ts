import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-dialogo-finalizar',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule
  ],
  templateUrl: './dialogo-finalizar.component.html',
  styleUrls: ['./dialogo-finalizar.component.scss'],
})
export class DialogoFinalizarComponent {
  constructor(
    private dialogRef: MatDialogRef<DialogoFinalizarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
  
  closeDialog() {
    this.dialogRef.close(false);
  }

  confirmDialog() {
    this.dialogRef.close(true);
  }

}
