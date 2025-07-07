import { Component} from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-mask',
  template: `
      <input
        type="input"
        [formControl]="formControl"
        class="form-control"
        [formlyAttributes]="field"
        [class.is-invalid]="showError"
        [appInputMask]="props['appInputMaskType']"
      />
        
     `

})
export class InputTypeMaskField extends FieldType<FieldTypeConfig> {

}

