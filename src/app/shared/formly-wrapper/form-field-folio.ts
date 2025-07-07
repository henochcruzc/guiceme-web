import { Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'formly-wrapper-form-field',
  template: `

    <div class="form-group" style="display: flex; flex-direction: column;" [class.has-error]="showError">

    <div class="label-radio">    
      <label *ngIf="to.label && to['hideLabel'] !== true" [attr.for]="id" class="form-label" >
        <span>{{ to.label }}<span *ngIf="to.required && to['hideRequiredMarker'] !== true" aria-hidden="true">*</span></span>
      </label>
      <div class="radios">
      <mat-radio-group aria-label="opcion" [(ngModel)]="tipoFolioAux " (change)="radioChange($event)">
        <mat-radio-button class="rd-12" value="1" selected >Mezcla</mat-radio-button>
        <mat-radio-button class="rd-12" value="2" >Solicitud</mat-radio-button>
      </mat-radio-group>
      </div>
    </div>


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
    }

    .label-radio{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: flex-end;
    }

    .radios{
      margin-bottom: -5px;
    }
    ::ng-deep  .mat-mdc-radio-button.rd-12 {
      .mdc-form-field{
        font-size:12px!important;
        
      }
    }
   
    `
  ]
})
export class FormlyWrapperFieldFolio extends FieldWrapper { 

  tipoFolioAux: string ;

  ngOnInit() {

    const reset$ = this.formControl.valueChanges;
    reset$.subscribe((e) => {
      if (e === undefined) {
        this.tipoFolioAux = "1";
      }
    });


    if(this.props['tipoFolioAuxDefault']){
      this.tipoFolioAux = this.props['tipoFolioAuxDefault']
    }else{
      this.tipoFolioAux = "1";
      
    }
    this.model.tipoFolioAux = this.tipoFolioAux;
  }

  radioChange(event) { 
    
    this.model.tipoFolioAux = this.tipoFolioAux;
    if(this.model.tipoFolioAux == 1 && this.formControl.value.length > 20 ){
      this.formControl.setErrors({minLength : { message: 'Tamaño máximo de 20 caracteres' }});
    }else if (this.model.tipoFolioAux == 1 && this.formControl.value.length <= 20 ){
      this.formControl.setErrors(null);
    }
    if(this.model.tipoFolioAux == 2 && this.formControl.value.length > 15 ){
      this.formControl.setErrors({minLength : { message: 'Tamaño máximo de 15 caracteres' }});
    }else if(this.model.tipoFolioAux == 2 && this.formControl.value.length <= 15 ){
      this.formControl.setErrors(null);
    }
    
    this.props['radioObs'].next(this.tipoFolioAux)
    console.log(event);
  }
}
