import { Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'mat-radio-wrapper-left',
  template: `
    <div style="display: table;     text-align: left; flex-direction: column; margin-top: 4px;" [class.has-error]="showError">
      <label *ngIf="to.label &&  to['hideLabel'] !== true" [attr.for]="id" class="form-label">
        {{ to.label }}
        <span *ngIf="to.required && to['hideRequiredMarker']  !== true" aria-hidden="true">*</span>
      </label>
      <div style="margin-top: 7px; margin-left: -10px;"><ng-template #fieldComponent></ng-template></div>
      <div *ngIf="showError" class="invalid-feedback" [style.display]="'block'">
        <formly-validation-message [field]="field"></formly-validation-message>
      </div>
      <small *ngIf="to.description" class="form-text text-muted">{{ to.description }}</small>
    </div>
  `,
  styles: [
    `
    .form-label{
      margin-top: 16px;
      margin-bottom: 0px;
      color: var(--gobierno-escala-de-grises-tono-1, #000);
      font-feature-settings: "clig" off, "liga" off;
      font-family: Montserrat;
      font-size: 12px;
      font-style: normal;
      font-weight: 700;
      line-height: 120%;
    }


   
    `]
})
export class WrapperFormFieldRadioLeft extends FieldWrapper {}
