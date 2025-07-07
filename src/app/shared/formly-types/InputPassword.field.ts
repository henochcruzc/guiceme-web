import { Component, ViewChild } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-input-password',
  template: `

    <div class="group-password">
    <input matInput #passwordField      
      class="form-control input-password"
      [type]="props.type"
      [formControl]="formControl"
      [formlyAttributes]="field"
      [class.is-invalid]="showError">
      <mat-icon matSuffix 
    class="toggle-password" [class.is-invalid]="showError" *ngIf="props.type == 'text' && (formControl.value != '' && formControl.value != undefined)"
    (click)="showHidePassword()">visibility</mat-icon>
    <mat-icon matSuffix 
    class="toggle-password" [class.is-invalid]="showError" *ngIf="props.type == 'password' && (formControl.value != '' && formControl.value != undefined)"
    (click)="showHidePassword()">visibility_off</mat-icon>
    </div>
 `,
  styles: [`
  .group-password{
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    position: relative;
  }
  .input-password{
    padding-right: 34px;
  }
  .toggle-password { 
    color: #ccc;
    cursor: pointer; 
    position: absolute;
    right: 6px;
  }

  .toggle-password.is-invalid { 
    right: 34px;
  }
  `]
})
export class InputPasswordField extends FieldType<FieldTypeConfig> {
  showHidePassword() {
    this.props.type = this.props.type == 'password' ? 'text' : 'password';
  }

}
