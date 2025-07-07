import { Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'formly-wrapper-form-field-figma',
  template: `

    <div class="form-group" style="display: flex; flex-direction: column; text-align: left; margin-top: 15px;" [class.has-error]="showError">
    <label *ngIf="to.label && to['hideLabel'] !== true" [attr.for]="id" class="form-label" >
        <span>{{ to.label }}<span *ngIf="to.required && to['hideRequiredMarker'] !== true" aria-hidden="true">*</span></span>
        
      </label>
      <ng-template #fieldComponent></ng-template>
      <small *ngIf="to.description" [ngClass]="this.field.type == 'textarea'? 'description-text-area': to['classDescripcion'] " class="form-text text-muted">{{ to.description }}</small>
      <div *ngIf="showError && !to['optionalRequiredMarker']" class="invalid-feedback" [style.display]="'block'">
        <formly-validation-message [field]="field"></formly-validation-message>
      </div>
    </div>

    
  `,
  styles: [
    `
    label{
      color: var(--Text-Titulos, #626262);
      font-feature-settings: 'clig' off, 'liga' off;
      font-family: Montserrat;
      font-size: 12px;
      font-style: normal;
      font-weight: 400 !important;
      line-height: normal;
    }
    
    label.form-label.ng-star-inserted {
        font-weight: 400 !important;
    }
   
    `
  ]
})
export class FormlyWrapperFieldFigma extends FieldWrapper { }
