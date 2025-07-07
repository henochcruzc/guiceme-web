import { Component} from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field',
  template: `

    <label class="label-texto-value" >{{ getData() }}</label>
    
    `
})
export class textFieldText extends FieldType {

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
      return ' ';
    }
  }
 }
