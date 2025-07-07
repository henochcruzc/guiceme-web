import { Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'formly-wrapper-form-field',
  template: `

    <div class="form-group" style="display: flex; flex-direction: row; align-items: baseline; font-size: 12px;" [class.has-error]="showError">
    <label *ngIf="to.label && to['hideLabel'] !== true" [attr.for]="id" class="form-label bold" >
        <span>{{ to.label }}:  &nbsp;
        <!-- <span class="form-label" aria-hidden="true">: &nbsp;</span>
       -->
      </span>
      </label>
      <ng-template #fieldComponent></ng-template>
    </div>

    
  `,
  styles: [
    `
    .form-label.bold{
   /*    font-weight: 800 !important; */
      color: #FFF;

      font-feature-settings: 'clig' off, 'liga' off;
      font-family: Montserrat;
      font-size: 12px;
      font-style: normal;
      font-weight: 600;
      line-height: 91%; /* 14.4px */
    }
    label{

      display: flex;
      align-items: flex-end;
/*       font-family: Montserrat;
      font-size: 12px;
      font-style: bold;
      font-weight: 800; */

      color: #FFF;
      font-feature-settings: 'clig' off, 'liga' off;
      font-family: Montserrat;
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 120%;
      
    }
   
    `
  ]
})
export class FormlyWrapperFieldInline extends FieldWrapper { }
