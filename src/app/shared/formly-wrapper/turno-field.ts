import { Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'formly-wrapper-turno-field',
  template: `
<div class="espacio">
    
    <label class="label-form">
        {{to.label}} 
    </label>
    
      <ng-template #fieldComponent></ng-template>
      
     

    
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
      min-width:180px;
      margin-bottom: 7px;
    }

    .espacio{
 
        margin-right:10px;
    }

   
   
    `
  ]
})
export class FormlyWrapperTurnoField extends FieldWrapper { }
