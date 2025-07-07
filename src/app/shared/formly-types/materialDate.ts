import { DatePipe } from '@angular/common';
import { Component, OnInit, effect, signal } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';
import * as moment from 'moment';
import { NativeDateAdapter } from '@angular/material/core';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';

const CELENDAR_ICON =
  `
<svg xmlns="http://www.w3.org/2000/svg" width="22" height="23" viewBox="0 0 22 23" fill="none">
  <path d="M17.4167 4.16536H16.5V2.33203H14.6667V4.16536H7.33333V2.33203H5.5V4.16536H4.58333C3.56583 4.16536 2.75917 4.99036 2.75917 5.9987L2.75 18.832C2.75 19.8404 3.56583 20.6654 4.58333 20.6654H17.4167C18.425 20.6654 19.25 19.8404 19.25 18.832V5.9987C19.25 4.99036 18.425 4.16536 17.4167 4.16536ZM17.4167 18.832H4.58333V9.66536H17.4167V18.832ZM17.4167 7.83203H4.58333V5.9987H17.4167V7.83203ZM8.25 13.332H6.41667V11.4987H8.25V13.332ZM11.9167 13.332H10.0833V11.4987H11.9167V13.332ZM15.5833 13.332H13.75V11.4987H15.5833V13.332ZM8.25 16.9987H6.41667V15.1654H8.25V16.9987ZM11.9167 16.9987H10.0833V15.1654H11.9167V16.9987ZM15.5833 16.9987H13.75V15.1654H15.5833V16.9987Z" fill="#ADB8CC"/>
</svg>
`;
export const MY_FORMATS = {
  parse: {
      dateInput: 'LL'
  },
  display: {
      dateInput: 'DD/MM/YYYY',
      monthYearLabel: 'YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'YYYY'
  }
};


@Component({
  selector: 'formly-field-material-date',
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-MX' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }],
  template: `
  <div class="d-flex date-control form-control align-items-center" [class.is-invalid]="showError" [class.is-disabled]="props.disabled"  *ngIf="!props['range']"  >
    <input    
      class="w-100 border-0"        
      [matDatepicker]="basicDatepicker"
      [formControl]="formControl"      
      [formlyAttributes]="field"
      [placeholder]="props['placeholder']"
      (dateChange)="dateChange($event)"       
      [disabled]="props.disabled"   
      [min]="props['minDate']"
      [max]="props['maxDate']"
      readonly
    />
  <mat-datepicker-toggle class="d-flex align-items-center" [for]="basicDatepicker">
    <mat-icon class="calendar-icon" svgIcon="calendar-icon" matDatepickerToggleIcon></mat-icon>
  </mat-datepicker-toggle>
  <mat-datepicker #basicDatepicker></mat-datepicker>
</div>
<div class="d-flex date-control form-control align-items-center" [class.is-invalid]="showError2" [class.is-disabled]="props.disabled" *ngIf="props['range']">
  <mat-date-range-input 
    [formlyAttributes]="field"  
    class="w-100 border-0"     
    [formGroup]="rangeDate" 
    [rangePicker]="picker"
    [disabled]="props.disabled"
    [min]="props['minDate']"
    [max]="props['maxDate']"
    [dia]="props['numDias']"
    >
    <input matStartDate formControlName="startDate" placeholder="Fecha inicio" readonly>
    <input matEndDate formControlName="endDate" placeholder="Fecha fin" readonly>
  </mat-date-range-input>
  <mat-datepicker-toggle  class="d-flex align-items-center"  matIconSuffix [for]="picker">
    <mat-icon class="calendar-icon" svgIcon="calendar-icon"  matDatepickerToggleIcon></mat-icon>
  </mat-datepicker-toggle>
  <mat-date-range-picker #picker></mat-date-range-picker>
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
    
    `
  ]


})
export class MaterialDateField extends FieldType<FieldTypeConfig> implements OnInit {

  rangeDate = new FormGroup({
    startDate: new FormControl<Date | null>(null),
    endDate: new FormControl<Date | null>(null),
  });
  showError2: boolean = false;


  constructor(private dateAdapter: DateAdapter<any>, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    super();
    this.dateAdapter.setLocale('es');
    iconRegistry.addSvgIconLiteral('calendar-icon', sanitizer.bypassSecurityTrustHtml(CELENDAR_ICON));

    this.rangeDate.valueChanges.subscribe(val => {
      this.formControl.patchValue(val);


      let maxDate = moment(val.startDate, 'YYYY-MM-DD').add(29, 'days').format('YYYY-MM-DD');
      this.props['maxDate'] = maxDate;

      if (this.props.required && (val.startDate == null && val.endDate == null)) {
        this.formControl.setErrors(null)
        this.showError2 = false;
      }
      else if (this.props.required && (val.startDate == null || val.endDate == null)) {
        this.showError2 = true;
        this.formControl.setErrors({ required: true })

        this.model[this.field.key + 'String'] = null;

      } else if (!this.props.required && (val.startDate == null && val.endDate == null)) {
        this.formControl.setErrors(null)
        this.showError2 = false;
      } else if (val.startDate && val.endDate == null) {
        this.showError2 = true;
        this.formControl.setErrors({ required: true })
      } else if (val.startDate && val.endDate) {
        this.formControl.setErrors(null)
        this.showError2 = false;

        this.model[this.field.key + 'String'] = {
          startDate: moment(val.startDate).format("YYYY-MM-DD"),
          endDate: moment(val.endDate).format("YYYY-MM-DD"),
        }
      }


    }
    )
  }

  ngOnInit(): void {

    if (this.props['fechaObs']) {
      this.props['fechaObs'].subscribe(async (res) => {
        if (res) {
          this.rangeDate.patchValue(res);
        }
      });
    }



    this.formControl.valueChanges.subscribe(val => {
      val?val:null
      if (val === null || val === undefined) {
        this.rangeDate.patchValue({
          startDate: null,
          endDate: null,
        });
        delete this.model[this.field.key + ''];
        delete this.model[this.field.key + 'String']
      }
    })
    // Establecer la fecha mínima
    if (this.model.fecApl != undefined) {
      this.rangeDate.patchValue({
        startDate: this.model.fecApl.startDate,
        endDate: this.model.fecApl.endDate,
      });
    }

  }

  dateChange(event: MatDatepickerInputEvent<Date>) {
    if (event) {
      this.model[this.field.key + 'String'] = moment(event.value).format("YYYY-MM-DD");
    }

  }


}

