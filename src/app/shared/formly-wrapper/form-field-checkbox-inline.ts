import { Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'formly-wrapper-form-field-checkbox-inline',
  template: `
    <div class="form-group ch-inline" style="display: flex; flex-direction: column; height: 100%;" [class.has-error]="showError">
    <ng-template  #fieldComponent></ng-template>
    <label *ngIf="to.label && to['hideLabel'] !== true" [attr.for]="id" class="form-label" >
        <span>{{ to.label }}<span *ngIf="to.required && to['hideRequiredMarker'] !== true" aria-hidden="true">*</span></span>
      </label>
      <!-- <small *ngIf="to.description" [ngClass]="this.field.type == 'textarea'? 'description-text-area': to['classDescripcion'] " class="form-text text-muted">{{ to.description }}</small>
      <div *ngIf="showError && !to['optionalRequiredMarker']" class="invalid-feedback" [style.display]="'block'">
        <formly-validation-message [field]="field"></formly-validation-message>
      </div> -->
    </div>

    
  `,
  styles: [
    `
    label{
      min-height: 35px;
      display: flex;
      align-items: flex-end;
      color: var(--gobierno-escala-de-grises-tono-1, #000);
      font-feature-settings: 'clig' off, 'liga' off;  
      /* Link/Body/M/M . SemiBold.12 */
      font-family: Montserrat;
      font-size: 12px;
      font-style: normal;
      font-weight: 600;
      line-height: 120%; /* 14.4px */
    }

    .ch-inline{

      display: flex;
      flex-direction: row !important;
      align-items: center;
      flex-wrap: nowrap;

      label{
        margin-top:-12px!important 
      }


    }
   
    `
  ]
})
export class FormlyWrapperFieldCheckBoxInline extends FieldWrapper { }
