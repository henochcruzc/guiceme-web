import { Component, Injectable, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';
import * as moment from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { NgbTimeAdapter, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

const CELENDAR_ICON =
  `
<svg xmlns="http://www.w3.org/2000/svg" width="22" height="23" viewBox="0 0 22 23" fill="none">
  <path d="M17.4167 4.16536H16.5V2.33203H14.6667V4.16536H7.33333V2.33203H5.5V4.16536H4.58333C3.56583 4.16536 2.75917 4.99036 2.75917 5.9987L2.75 18.832C2.75 19.8404 3.56583 20.6654 4.58333 20.6654H17.4167C18.425 20.6654 19.25 19.8404 19.25 18.832V5.9987C19.25 4.99036 18.425 4.16536 17.4167 4.16536ZM17.4167 18.832H4.58333V9.66536H17.4167V18.832ZM17.4167 7.83203H4.58333V5.9987H17.4167V7.83203ZM8.25 13.332H6.41667V11.4987H8.25V13.332ZM11.9167 13.332H10.0833V11.4987H11.9167V13.332ZM15.5833 13.332H13.75V11.4987H15.5833V13.332ZM8.25 16.9987H6.41667V15.1654H8.25V16.9987ZM11.9167 16.9987H10.0833V15.1654H11.9167V16.9987ZM15.5833 16.9987H13.75V15.1654H15.5833V16.9987Z" fill="#ADB8CC"/>
</svg>
`;

const pad = (i: number): string => (i < 10 ? `0${i}` : `${i}`);

@Injectable()
export class NgbTimeStringAdapter extends NgbTimeAdapter<string> {
  fromModel(value: string | null): NgbTimeStruct | null {
    if (!value) {
      return null;
    }
    const split = value.split(':');
    return {
      hour: parseInt(split[0], 10),
      minute: parseInt(split[1], 10),
      second: parseInt(split[2], 10),
    };
  }

  toModel(time: NgbTimeStruct | null): string | null {
    return time != null ? `${pad(time.hour)}:${pad(time.minute)}:${pad(time.second)}` : null;
  }
}

export const MY_FORMATS = {
  parse: {
      dateInput: 'LL'
  },
  display: {
      dateInput: 'DD/MM/YYYY; HH:mm:ss',
      monthYearLabel: 'YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'YYYY'
  }
};

@Component({
  selector: 'formly-field-material-date-place',
  providers: [
    { provide: NgbTimeAdapter, useClass: NgbTimeStringAdapter },
    { provide: MAT_DATE_LOCALE, useValue: 'es-MX' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}],
  template: `

  <div class="d-flex date-control form-control align-items-center" [class.is-invalid]="showError" [class.is-disabled]="props.disabled"  *ngIf="!props['range']"  >
    <input    
      class="w-100 border-0" 
      [matDatepicker]="basicDatepicker"
      [formControl]="formControl"      
      [formlyAttributes]="field"
      [placeholder]="fechaHora"
      (dateChange)="dateChange($event)"       
      [disabled]="props.disabled"   
      [min]="props['minDate']"
      [max]="props['maxDate']"
      readonly
    />
 <mat-datepicker-toggle class="d-flex align-items-center" [for]="basicDatepicker">
    <mat-icon class="calendar-icon" svgIcon="calendar-icon" matDatepickerToggleIcon></mat-icon>
  </mat-datepicker-toggle>
  <mat-datepicker #basicDatepicker>
      <mat-datepicker-actions>
        <div class='time-footer'>
          <ngb-timepicker [class.is-invalid]="ctrl.errors" [required]="props.required"  [formControl]="ctrl"  ></ngb-timepicker>
        </div>
        <div class='boton-accion'>
          <button type="button" class="btn btn-primary" matDatepickerApply [disabled]="ctrl.errors">OK</button>
        </div>
  </mat-datepicker-actions>
  </mat-datepicker>
</div>
  `,
  styles: [
    `
    .date-control > input{
      color: var(--bs-body-color);
      background-color: var(--bs-body-bg);
      border-color: #86b7fe;
      outline: 0;
      box-shadow: 0;
    }

    .date-control{
      padding-left: 0.725rem!important;
    }

    .date-control,
    .mat-datepicker-toggle{
      height: 35px;
      padding: 0;
    }

    ::ng-deep .calendar-icon > svg{
      margin-top: -18px !important;
      vertical-align: middle !important;
    }   

    .date-control.is-invalid{
      height: 35px;
      padding-right: 23px;
    }

    .date-control.is-disabled,
    .date-control > input:disabled{
      background-color: var(--bs-secondary-bg)!important;
      opacity: 1;
    }

    ::ng-deep .mat-date-range-input-separator-hidden{
      opacity: 1!important;
    }

    ::ng-deep .mat-datepicker-actions{
      display: flex;
      align-items: center;
      flex-direction: column;
      .boton-accion{
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
      }
    }
    
    `
  ]


})
export class MaterialDateFieldPlace extends FieldType<FieldTypeConfig> implements OnInit {

  fechaHora = 'Selecciona una fecha y hora';
  getPlaceholder(type: 'start' | 'end'): string {
    return type === 'start' ? 'Fecha inicio' : 'Fecha fin';
  }

  constructor(private dateAdapter: DateAdapter<any>, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    super();
    this.dateAdapter.setLocale('es');
    iconRegistry.addSvgIconLiteral('calendar-icon', sanitizer.bypassSecurityTrustHtml(CELENDAR_ICON));

  }


  fieldValue(): string {
   
      return this.fechaHora;
   
  };

  ctrl = new FormControl<NgbTimeStruct | null>(null, (control: FormControl<NgbTimeStruct | null>) => {
    const value = control.value;

    if (!value) {
      return null;
    }

    return null;
  });


  ngOnInit(): void {
    if (this.formControl.value) {
      console.log(this.formControl.value)
      this.ctrl.patchValue(this.formControl.value)
    }
  }

  dateChange(event: MatDatepickerInputEvent<Date>) {
    if (event) {
      this.fechaHora = moment(moment(event.value).format("YYYY-MM-DD") + ' ' + this.ctrl.value).format("YYYY-MM-DD HH:mm:ss");
      this.formControl.patchValue(this.fechaHora);
    }

  }

  setHoras() {

  }

}

