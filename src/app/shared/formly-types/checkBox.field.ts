import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/material';
import { FieldTypeConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-checkbox-type',
  template: `
    <mat-checkbox
      [formControl]="formControl"
      [formlyAttributes]="field"
      [class.is-invalid]="showError"
      class="m-ch"
      (change)="fieldsChange($event)"
    ></mat-checkbox>
  `,
  styles: [
    `
    
    `,
  ],
})
export class CheckBoxType extends FieldType<FieldTypeConfig>{
  fieldsChange(values: any): void {
    console.log(values.checked);
    this.formControl.setValue(values.checked);
  }
}
