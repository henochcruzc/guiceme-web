import { Component, ChangeDetectionStrategy, Type, inject } from '@angular/core';
import { FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { FieldType, FormlyFieldProps } from '@ngx-formly/bootstrap/form-field';
import { FormlyFieldSelectProps } from '@ngx-formly/core/select';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { GenericDialogService } from '../dialog/genericDialog.service';
import { State } from '@popperjs/core';
import { Observable } from 'rxjs';
interface SelectProps extends FormlyFieldProps, FormlyFieldSelectProps {
  multiple?: boolean;
  compareWith?: (o1: any, o2: any) => boolean;
}

export interface FormlySelectFieldConfig extends FormlyFieldConfig<SelectProps> {
  type: 'selectModal' | Type<FormlyFieldSelectModal>;
}

@Component({
  selector: 'formly-field-select',
  template: `

<select #s id="selectOp" 
class="form-control" 
name="selectOp" 
[ngModel]="selectedOp"
[class.is-invalid]="showError"
[formlyAttributes]="field"   
(ngModelChange)="onStateChange(selectedOp, $event, s)">
                        
<option *ngIf="props.placeholder" [value]="undefined">{{ props.placeholder }}</option>
  <ng-container *ngIf="props.options | formlySelectOptions : field | async as opts">
    <ng-container *ngFor="let opt of opts">
      <option [ngValue]="opt.value" [disabled]="opt.disabled">
        {{ opt.label }}
      </option>      
    </ng-container>
  </ng-container>
</select>

    `,

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldSelectModal extends FieldType<FieldTypeConfig> {

  constructor( private dialog: MatDialog) {
    super();
  }
  _dialogService = inject(GenericDialogService);
  selectedOp: State;

  ngOnInit(): void {

    this.props['optInicial'].subscribe(data => {
      //this.formControl.patchValue(data);
      this.onStateChange(undefined, data, null);
    })

  }

  onStateChange(previousState: any, state: any, selectOpEl: HTMLSelectElement): void {
    this.formControl
    if (previousState === undefined || previousState === 'undefined') {
      this.selectedOp = state;
      this.formControl.patchValue(state);
      return;
    }

    if (state === 'undefined') {
      this.selectedOp = state;
      this.formControl.patchValue(state);
      return;
    }

    const dialogRef = this.dialog.open(
      DialogComponent,
      this._dialogService.modalGenerico(this.props['dataModal']['titulo'], this.props['dataModal']['mensaje'], null, this.props['dataModal']['textOk'])
    );

    dialogRef.afterClosed().subscribe(
      async result => {
          this.chage(result,state,previousState, selectOpEl)
      }
    );
  }

  async chage(result, state, previousState, selectOpEl){
    if (result) {
      console.log('$########################## aqui se cambio')
      this.selectedOp = state;
      this.formControl.patchValue(state);
    } else {
      let index = 0;
      if(this.props.options instanceof Observable){
       index = (await this.props.options.toPromise().then(
          res => { return res; }
        )).map(e => e.value).indexOf(previousState);
      }else{
        //index =  this.props.options.map(e => e.value).indexOf(previousState)
       index = Number(previousState) == 3  ? 1 : Number(previousState) == 2  ? 2 : Number(previousState); // Si es el
      }
      selectOpEl.selectedIndex = index;
      this.formControl.patchValue(previousState);
    }

    console.log(this.selectedOp)
  }


}