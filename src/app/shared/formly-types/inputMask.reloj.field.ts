import { Component} from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-mask',
  template: `
      <input
        type="input"
        [formControl]="formControl"
        class="form-control reloj"
        [formlyAttributes]="field"
        [class.is-invalid]="showError"
        [appInputMask]="props['appInputMaskType']"
      />
        
     `,
     styles: [`
     .reloj{ 
    background-color: #fff;
    background-image: url("../../../assets/images/RelojPeriodos.svg");
    background-repeat: no-repeat;
    background-position-y: center;
    background-position-x: right;/* 340px;*/
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;

     }
     `]

})
export class InputTypeMaskRelojField extends FieldType<FieldTypeConfig> {

}

