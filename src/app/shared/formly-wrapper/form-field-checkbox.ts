import { Component, OnInit } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'formly-wrapper-form-field-CheckBox',
  template: `

    <div class="form-group" style="display: flex; flex-direction: column;" [class.has-error]="showError">
      <div class="d-flex ">
        <mat-checkbox class="m-ch" (change)="radioChange($event)" [checked]="cheked" > </mat-checkbox>
        <label *ngIf="props.label && to['hideLabel'] !== true" [attr.for]="id" class="form-label" >
          <span>{{ to.label }}<span *ngIf="props.required && to['hideRequiredMarker'] !== true" aria-hidden="true">*</span></span>
        </label>
      </div>
      <!-- <ng-template #fieldComponent></ng-template>
      <small *ngIf="props.description" [ngClass]="this.field.type == 'textarea'? 'description-text-area': to['classDescripcion'] " class="form-text text-muted">{{ to.description }}</small>
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
      font-size: 14px!important;
      font-weight: bold;
    }

    .m-ch{
      align-self: center;
      // transform: scale(.889);
    }

    // ::ng-deep .m-ch > .mdc-form-field > .mdc-checkbox > .mdc-checkbox__background{
    //     border-radius: 20px !important;
    //   }
    // ::ng-deep .m-ch > .mdc-form-field > .mdc-checkbox > .mdc-checkbox__background > .mdc-checkbox__checkmark{
    //   display:none;
    // }
    
    // ::ng-deep .m-ch > .mdc-form-field > .mdc-checkbox > .mdc-checkbox__background > .mdc-checkbox__mixedmark{
    //   height: 14px;
    //   background-color: var(--mdc-radio-selected-icon-color);
    //   opacity: 100;
    //   border-radius: 50%;
    // } 
      
    `
  ]
})
export class FormlyWrapperFieldCheckBox extends FieldWrapper implements OnInit {

  cheked: boolean = false;

  ngOnInit(): void {
    // this.props.disabled = true;
  }

  radioChange(values: any): void {
    console.log(values.checked);
    this.props.disabled = !values.checked;

    if (values.checked == false) {
      this.formControl.patchValue(null);
    }
  }

}
