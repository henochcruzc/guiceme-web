import { Component, OnInit } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-input',
  template: `
  <div class='form-control-captcha'>
    <re-captcha (resolved)="onChange($event)"  ></re-captcha>
  </div>
  `,
  styles:[
    `
    .form-control-captcha{
      padding-bottom: 30px;
    }
    `
  ]
})
export class ReCaptcheFieldType extends FieldType<FieldTypeConfig> {
  token: string | null;

  onChange(newValue) {
    // console.log(newValue);
    
    if (newValue) {
      this.formControl.setValue(newValue);
    } else {
      this.formControl.setValue(undefined);
    }
  }
}
