import { AfterViewInit, Component, OnInit, signal } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'formly-wrapper-form-field-RadioBtnCheck',
  template: `

    <div class="form-group" style="display: flex; flex-direction: column;" [class.has-error]="showError">
      <div class="d-flex ">
        <mat-checkbox class="m-ch" [id]="id+'-checkbox'" (change)="radioChange($event)" [checked]="formControl.value != undefined"> </mat-checkbox>
        <label *ngIf="props.label && to['hideLabel'] !== true" [attr.for]="id" [id]="id" class="form-label" >
          <span>{{ to.label }}<span *ngIf="props.required && to['hideRequiredMarker'] !== true" aria-hidden="true">*</span></span>
        </label>
      </div>
      <ng-template #fieldComponent></ng-template>
      <small *ngIf="props.description" [ngClass]="this.field.type == 'textarea'? 'description-text-area': to['classDescripcion'] " class="form-text text-muted">{{ to.description }}</small>
      <div *ngIf="showError && !to['optionalRequiredMarker']" class="invalid-feedback" [style.display]="'block'">
        <formly-validation-message [field]="field"></formly-validation-message>
      </div>
    </div>    
  `,
  styles: [
    `
    label{
      min-height: 35px;
      display: flex;
      align-items: flex-end;
    }      
    `
  ]
})
export class FormlyWrapperFieldRadioBtnCheck extends FieldWrapper implements OnInit, AfterViewInit {


  ngOnInit(): void {
    this.formControl.valueChanges.subscribe(value => {
      // console.log(this.id, 'formControl value ', value)
      if (value === undefined && this.props.disabled == false) {
        this.props.disabled = true;
      }
    }
    )
  }

  ngAfterViewInit(): void {
    this.formControl.disable();
    const alto = document.getElementById(this.id).offsetHeight;
    const checkElement: HTMLElement = document.getElementById(this.id + '-checkbox');
    if (alto <= 35) {
      checkElement.style.marginBottom = '-8px';
    }
    if (alto >= 36) {
      checkElement.style.marginBottom = '4px';
    }
    this.formControl.patchValue(null);
  }

  radioChange(values: any): void {
    // console.log('values.checked: ', values.checked);

    if (values.checked == false) {
      this.formControl.disable();
      this.formControl.patchValue(null);
    }
    if (values.checked == true) {
      this.formControl.patchValue(null);
      this.formControl.enable();
    }
  }



}
