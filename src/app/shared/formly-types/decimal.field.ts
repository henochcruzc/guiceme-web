import { Component } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-input',
  template: `
  <input

  type="input"
        [formControl]="formControl"
        class="form-control"
        [formlyAttributes]="field"
        [class.is-invalid]="showError"
        [appInputMask]="props['appInputMaskType']"
      />
 `,
})
export class DecimalField extends FieldType<FieldTypeConfig>{


}
