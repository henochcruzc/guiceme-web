import { Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'formly-wrapper-form-field',
  template: `

    <div class="form-group" style="display: flex; flex-direction: column;" [class.has-error]="showError">
    <label *ngIf="to.label && to['hideLabel'] !== true" [attr.for]="id" class="form-label" >
        <span>{{ to.label }}<span *ngIf="to.required && to['hideRequiredMarker'] !== true" aria-hidden="true">*</span></span>
        
      </label>
      <ng-template #fieldComponent></ng-template>
 
    </div>

    
  `,
  styles: [
    `
    label{
      min-height: 35px;
      display: flex;
      align-items: flex-end;
      color: #BC955C;
      font-feature-settings: 'clig' off, 'liga' off;  
      /* Link/Body/M/M . SemiBold.12 */
      font-family: Montserrat;
      font-size: 12px;
      font-style: normal;
      font-weight: 600;
      line-height: 120%; /* 14.4px */
    }
   
    `
  ]
})
export class FormlyWrapperFieldGris extends FieldWrapper { }
