import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { MaterialModule } from './material.module';
import { NoLayoutComponent } from './layout/no-layout/no-layout.component';
import { DialogComponent } from './dialog/dialog.component';
import { AlertModule } from './alert';
import { HttpClientModule } from '@angular/common/http';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { FormlyFieldButton } from './formly-types/field-button.component';
import { ReCaptcheFieldType } from './formly-types/re-captcha.component';
import { RecaptchaModule } from 'ng-recaptcha';
import { FormlyFieldSelect } from './formly-types/FormlyFieldSelect';
import { FormlySelectModule } from '@ngx-formly/core/select';

import { TituloComponent } from './layout/frames/titulo/titulo.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { FormlyWrapperField } from './formly-wrapper/form-field';
import { TextField } from './formly-types/text.component';
import { FormlyFieldRadio } from '@ngx-formly/material/radio';
import { WrapperFormFieldRadio } from './formly-wrapper/form-field-radio';


import { BootstrapModule } from './bootstrao.module';
import { FormlyWrapperFieldRadioBtnCheck } from './formly-wrapper/form-field-radioBtn-text';
import { textFieldText } from './formly-types/text.field';
import { TextoTitulo } from './formly-types/textoTitulo.field';
import { FormlyFieldTextArea } from '@ngx-formly/bootstrap/textarea';
import { NoDataComponent } from './layout/no-data/no-data.component';
import { CheckBoxType } from './formly-types/checkBox.field';
import { MaterialDateField } from './formly-types/materialDate';
import { AutoCompleteType } from './formly-types/autocomplete.field';
import { ValidadorMultiselect, autocompleteObjectValidator, decimalFill, decimalNumbers, onlyNumbers, zeroFill } from './formly-validator/validators';
import { FormlyWrapperFieldCheckBox } from './formly-wrapper/form-field-checkbox';
import { NumberField } from './formly-types/number.field';
import { FormlyWrapperFieldCheckBoxInline } from './formly-wrapper/form-field-checkbox-inline';
import { TimeField } from './formly-types/time.field';
import { InputPasswordField } from './formly-types/InputPassword.field';
import { InputTypeMaskField } from './formly-types/inputMask.field';
import { InputMaskDirective } from './directives/inputDirective';
import { FormlyWrapperFieldFolio } from './formly-wrapper/form-field-folio';
import { FormlyWrapperFieldInline } from './formly-wrapper/form-field-inline';
import { fieldMatchValidator } from '../modules/login/components/actualizar-main/actualizar-main.component';
import { FormlyFieldSelectModal } from './formly-types/FormlyFieldSelect-modal';
import { MaterialDateFieldPlace } from './formly-types/materialDate-place';
import { FormlyFieldDataTable } from './formly-types/dataTableType';
import { textFieldTextBold } from './formly-types/text.field.bold';
import {  lineType } from './formly-types/line';
import { turnoFieldText } from './formly-types/turno.field';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { FormlyWrapperFieldGris } from './formly-wrapper/form-field-gris';
import { FormlyWrapperTurnoField } from './formly-wrapper/turno-field';
import { FormlyWrapperFieldFigma } from './formly-wrapper/form-field-figma';
import { WrapperFormFieldRadioLeft } from './formly-wrapper/formly-wrapper-radioBtn-left';
import { InputTypeMaskRelojField } from './formly-types/inputMask.reloj.field';
import { MultiselectField } from './formly-types/multi-select.field';
import { NgSelectModule } from '@ng-select/ng-select';
import { DecimalField } from './formly-types/decimal.field';




// imports: [NgbTimepickerModule, ReactiveFormsModule, JsonPipe, NgIf, MatDatepickerModule, FormlyModule],
@NgModule({
  declarations: [
    NoLayoutComponent,
    FormlyFieldButton,
    ReCaptcheFieldType,
    FormlyFieldSelect,
    FormlyFieldSelectModal,
    FormlyWrapperField,
    WrapperFormFieldRadio,
    FormlyWrapperFieldRadioBtnCheck,
    FormlyWrapperFieldCheckBox,
    FormlyWrapperFieldCheckBoxInline,
    WrapperFormFieldRadioLeft,
    TextField,
    lineType,
    CheckBoxType,
    MaterialDateField,
    MaterialDateFieldPlace,
    AutoCompleteType,
    NumberField,
    TextoTitulo,
    InputPasswordField,
    InputMaskDirective,
    InputTypeMaskField,
    InputTypeMaskRelojField,
    FormlyWrapperFieldFolio,
    FormlyWrapperFieldInline,
    FormlyFieldDataTable,
    FormlyWrapperFieldFigma,
    MultiselectField,
    DecimalField
  ],
  imports: [
    AlertModule,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RecaptchaModule,
    MaterialModule,
    NgSelectModule,
    BootstrapModule,
    FormlySelectModule,
    FormlyMaterialModule,
    FormlyBootstrapModule,
    NgbTimepickerModule,
    TimeField,
    FormlyModule.forRoot({
      types: [
        { name: 'datatable', component: FormlyFieldDataTable },
        {
          name: 'password',
          component: InputPasswordField,
          wrappers: ['form-field'],
          defaultOptions: {
            props: {
              type: 'password',
            },
          },
        },
        {
          name: 'captcha',
          component: ReCaptcheFieldType,
          wrappers: ['form-field'],
        },
        {
          name: 'button', component: FormlyFieldButton, wrappers: ['form-field'],
          defaultOptions: {
            props: {
              //  btnType: 'primary',
              type: 'button',
            },
          },
        },
        {
          name: 'textarea',
          component: FormlyFieldTextArea,
          defaultOptions: {
            props: {
              rows: 5,
              attributes: {
                //style: 'text-transform: uppercase',
              },

              description: 'dasdasda'
            },
            parsers: [
              (value) => {
                if (value) {
                  //return (value = value.toUpperCase());
                  return value;
                }

              },
            ],
            expressions: {
              'props.description': (field: FormlyFieldConfig) => {
                if (field.formControl.value == undefined) {
                  return `${(0)} de ${(field.props.maxLength)}` //this.getCountTextArea(512, 0);
                }
                return `${(field.formControl.value.length)} de ${(field.props.maxLength)}` //this.getCountTextArea(512, model.observaciones.length);
              },
            },
          },
        },

        { name: 'select', component: FormlyFieldSelect, wrappers: ['form-field'] },
        {
          name: 'multi-select',
          component: MultiselectField,
          wrappers: ['form-field'],
          defaultOptions: {
            templateOptions: {
              placeholder: 'Selecionar',
            },
            validators: {
              validation: [ValidadorMultiselect],
            },
          },
        },
        { name: 'selectModal', component: FormlyFieldSelectModal, wrappers: ['form-field'] },
        { name: 'text', component: TextField },
        { name: 'text2', component: textFieldText, wrappers: ['form-field'] },
        { name: 'textBold', component: textFieldTextBold, wrappers: ['form-field'] },
        { name: 'text-inline', component: textFieldText, wrappers: ['form-field-inline'] },
        { name: 'textoTitulo', component: TextoTitulo, },
        { name: 'lineaAzul', component: lineType },
        { name: 'turno', component: turnoFieldText, wrappers: ['turno-field'] },
        {
          name: 'input-mask',
          component: InputTypeMaskField,
          wrappers: ['form-field']
        },
        {
          name: 'input-mask-reloj',
          component: InputTypeMaskRelojField,
          wrappers: ['form-field']
        },
        {
          name: 'numFloat',
          component: NumberField,
          wrappers: ['form-field'],
          defaultOptions: {
            templateOptions: {
              mask: '00.00',
              //placeholder: '5 dígitos',
              required: true,
              maxLength: 5,
              minLength: 1,
              blur: (field, $event) => {
                let valor = field.formControl.value;
                let c = parseFloat(valor)
              
                if (field.formControl.value) {

                  field.formControl.setValue(
                    valor
                  );
                  console.log(field.formControl.value);
                }
              },
            }
          },
        },
        {
          name: 'numExpediente',
          component: NumberField,
          wrappers: ['form-field'],
          defaultOptions: {
            templateOptions: {
              mask: '00',
              placeholder: '5 dígitos',
              required: true,
              maxLength: 2,
              minLength: 2,
              blur: (field, $event) => {
                if (field.formControl.value) {
                  field.formControl.setValue(
                    zeroFill(field.formControl.value, 2)
                  );
                }
              },
            }
          },
        },
        {
          name: 'mat-radio',
          component: FormlyFieldRadio,
          wrappers: ['mat-radio-wrapper'],
        },
        {
          name: 'mat-radio-left',
          component: FormlyFieldRadio,
          wrappers: ['mat-radio-wrapper-left'],
        },
        
        {
          name: 'mat-radio2',
          component: FormlyFieldRadio,
          wrappers: ['mat-radio-wrapper-RadioBtnCheck'],
        },
        { name: 'check-box', component: CheckBoxType, wrappers: ['form-field'] },
        { name: 'check-box2', component: CheckBoxType, wrappers: ['form-field'] },
        {
          name: 'material-date', component: MaterialDateField, wrappers: ['form-field'],
          defaultOptions: {
            props: {
              // maxDate: formatDate(new Date(), 'yyyy-MM-dd', 'en-US'),
              placeholder: 'dd/mm/yyyy',
              minDate: new Date(1900, 1, 1),
              maxDate: new Date(2500, 1, 1)
            },
            validators: {
            }
          },
        },
        {
          name: 'material-date-place', component: MaterialDateFieldPlace, wrappers: ['form-field'],
          defaultOptions: {
            props: {
              // maxDate: formatDate(new Date(), 'yyyy-MM-dd', 'en-US'),
              placeholder: 'dd/mm/yyyy',
              minDate: new Date(1900, 1, 1),
              maxDate: new Date(2500, 1, 1)
            },
            validators: {
            }
          },
        },
        {
          name: 'autoComplete',
          component: AutoCompleteType,
          wrappers: ['form-field'],
        },
        {
          name: 'time',
          component: TimeField,
          wrappers: ['form-field'],
        },
        {
          name: 'input-folio',
          extends: 'input',
          wrappers: ['form-wrapper-folio'],
        },
        {
          name: 'decimal',
          component: DecimalField,
          wrappers: ['form-field'],
          defaultOptions: {
            templateOptions: {
              appInputMaskType: 'point',
              placeholder: '000.00',
              required: true,
              maxLength: 7,
              minLength: 1,
              numEnteros:3,
              numDecimales:2,
              blur: (field, $event) => {
                if (field.formControl.value) {
                  field.formControl.setValue(
                    decimalFill(field)
                  );
                }
              },
            },
            validators: {
              validation: [decimalNumbers],
            },
          },
        },

      ],
      wrappers: [
      
        { name: 'form-field', component: FormlyWrapperField },
        { name: 'form-field-inline', component: FormlyWrapperFieldInline },
        { name: 'form-field-checkbox-inline', component: FormlyWrapperFieldCheckBoxInline },
        { name: 'mat-radio-wrapper', component: WrapperFormFieldRadio },
        { name: 'mat-radio-wrapper-RadioBtnCheck', component: FormlyWrapperFieldRadioBtnCheck },
        { name: 'form-wrapper-CheckBox', component: FormlyWrapperFieldCheckBox },
        { name: 'form-wrapper-folio', component: FormlyWrapperFieldFolio },
        { name: 'form-field-gris', component: FormlyWrapperFieldGris },
        { name: 'form-field-figma', component: FormlyWrapperFieldFigma },
        { name: 'turno-field', component: FormlyWrapperTurnoField },
        { name: 'mat-radio-wrapper-left', component: WrapperFormFieldRadioLeft },
      ],
      validators: [
        { name: 'autocomplete', validation: autocompleteObjectValidator },
        { name: 'fieldMatch', validation: fieldMatchValidator },
        { name: 'numero', validation: onlyNumbers },

      ],
      validationMessages: [

        { name: 'required', message: `Campo obligatorio` },
        { name: 'minLength', message: `Se deben registrar por lo menos 15 caracteres.` },
      ],
    }),
    TituloComponent,
    HeaderComponent,
    FooterComponent,
    DialogComponent,
    NoDataComponent,
  ],
  exports: [
    NoLayoutComponent,
    DialogComponent,
    AlertModule,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    BootstrapModule,
    FormlyMaterialModule,
    FormlyBootstrapModule,
    ReCaptcheFieldType,
    FormlyFieldButton,
    FormlySelectModule,
    HeaderComponent,
    FooterComponent,
    FormlyModule,
    FormlyWrapperField,
    TituloComponent,
    FormlyWrapperFieldRadioBtnCheck,
    FormlyWrapperFieldCheckBox,
    NoDataComponent,
    CheckBoxType,
    MaterialDateField,
    MaterialDateFieldPlace,
    AutoCompleteType,
    InputMaskDirective,
    InputTypeMaskField,
    InputTypeMaskRelojField,
    FormlyFieldSelectModal,
    FormlyFieldDataTable,
    MultiselectField
  ],
  providers: [

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule { }
