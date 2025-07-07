import { Component} from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field',
  template: `

    <label  class="label-texto-value" > 
 
    <span class="bold"><strong> {{ getData() }} </strong> </span> </label>
    
    
    `,
    styles: [
    `
      .label-texto-value{
        color: #222;
        font-feature-settings: 'clig' off, 'liga' off;
        font-family: Montserrat;
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
      }

    `
    ]
})
export class textFieldTextBold extends FieldType {

  getData() {
    if (this.formControl.value != null && this.formControl.value != '') {

      if (
        this.formControl.value instanceof Boolean &&
        this.formControl.value == true
      ) {
        return 'Si';
      } else if (
        this.formControl.value instanceof Boolean &&
        this.formControl.value == false
      ) {
        return 'No';
      }

      return this.formControl.value;
    }  else {
      if(this.to['labelPersonalizado']){
        return this.to['labelPersonalizado'];
      }
      return 'SIN INFORMACIÓN';
    }
  }
 }
