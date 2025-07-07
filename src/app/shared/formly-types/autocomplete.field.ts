import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { FieldType } from '@ngx-formly/material';
import { MatInput } from '@angular/material/input';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Observable, of } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { FieldTypeConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-autocomplete-type',
  template: `
    <input
      matInput
      class="auto-complete form-control"
      [matAutocomplete]="auto"
      [formControl]="formControl"      
      [class.is-invalid]="showError"
      [formlyAttributes]="field"
      [placeholder]="props['placeholder']"
      [matAutocompleteDisabled]="props['disabled']"
    />

    <button
      type="button"
      class="close"
      aria-label="Close"
      (click)="borrar()"
      *ngIf="formControl.value && !props['disabled']"
    >
      <span aria-hidden="true">&times;</span>
    </button>

    <mat-autocomplete
      #auto="matAutocomplete"
      [displayWith]="displayFn.bind(this)"
    >
      <mat-option
        *ngFor="let value of filter | async"
        [value]="value"
        [matTooltip]="props['showToolTip'] ? value[props['labelProp']] : null"
      >
        {{ value[props['labelProp']] }}
      </mat-option>
    </mat-autocomplete>
  `,
  styles: [
    `
      input[disabled]{
        background-color: #eee;
        opacity: 1;
        color:#000;
      }

      ::ng-deep formly-autocomplete-type {
        display: flex;
        flex-direction: row;
        align-items: center;
        position: relative; 
      }

      .close {
        position: absolute;
        font-size: 57px;
        font-weight: lighter;
        line-height: 0;
        right: 0px;
        border: 0;
        background-color: transparent;
      }
    `,
  ],
})
export class AutoCompleteType extends FieldType<FieldTypeConfig> implements OnInit, AfterViewInit {
  @ViewChild(MatInput) formFieldControl: MatInput;
  @ViewChild(MatAutocompleteTrigger) autocomplete: MatAutocompleteTrigger;

  filter: Observable<any>;
  public valorPropiedad: any = null;

  targetName: string;

  selectedoptionAux;

  lista: any;
  async ngOnInit() {

    this.targetName = this.props['target'];


    if (this.props['listaObs']) {
      this.props['listaObs'].subscribe(async (res) => {
        //console.log('listObs',res)
        await this.llenarLista(res);
        this.filter = this.formControl.valueChanges.pipe(
          startWith(''),
          switchMap((term) => of(this.filterOptions(term)))
        );
      });
    }

    await this.llenarLista(this.props['opciones']);

    this.filter = this.formControl.valueChanges.pipe(
      startWith(''),
      switchMap((term) => {
        return of(this.filterOptions(term));
      })
    );
  }

  async llenarLista(data) {
    //console.log('llenar lista ',data)
    if (Array.isArray(data) && data.length > 0) {
      this.lista = data;
    } else if (Array.isArray(data) && data.length == 0) {
      this.lista = []
    } else if (data && data instanceof Observable) {
      await data.toPromise().then((data) => {
        this.lista = data;
      });
    }
  }

  filterOptions(name: any) {

    // console.log(name, 'selectedoptionAux', this.selectedoptionAux)

    if (name == null) {
      this.model[this.targetName] = null;
      return this.lista
    }

    if (typeof name !== 'string') {
      return null;
    }

    if (this.lista) {

      if (name == '' && !this.selectedoptionAux) {
        this.model[this.targetName] = null;
        this.formControl.setValue(null);
      }

      const listaFiltrada = this.lista.filter(
        (elemento) => {
          if (elemento) {
            if (name == '' && !this.selectedoptionAux) {
              return true;
            }
            else {
              if (elemento[this.props['labelProp']]) {
                return elemento[this.props['labelProp']].toLowerCase().includes(name.toLowerCase())
              } else {
                return false;
              }
            }
          }
        }
      );
      if (listaFiltrada.length == 0) {
        this.model[this.targetName] = null;
      }
      return listaFiltrada;
    }
    return null;
  }

  ngAfterViewInit() {
    (<any>this.autocomplete)._formField = this.formField;
  }

  displayFn(selectedoption) {
    if (selectedoption) {
      if (!this.lista) {
        this.selectedoptionAux = selectedoption;
      }
      this.model[this.targetName] = selectedoption[this.props['valueProp']];
      return selectedoption[this.props['labelProp']];
    }
  }

  borrar() {
    this.model[this.targetName] = null;
    this.formControl.patchValue(null);
  }
}
