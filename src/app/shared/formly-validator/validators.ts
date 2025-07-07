import { AbstractControl, FormControl, ValidationErrors } from "@angular/forms";
import { FormlyFieldConfig } from "@ngx-formly/core";

const currentYear = new Date().getFullYear();

export function autocompleteObjectValidator(control: FormControl) {
  if (control.value) {
    if (typeof control.value == "string") {
      return { 'invalidAutocompleteObject': { value: control.value, message: `Selecciona una opción disponible` } }
    }
  }
}

export function zeroFill(number, width) {
  return (number + '').padStart(width, '0').slice(-width)
}


export function decimalFill(field) {

  var numEnteros = field.props["numEnteros"];
  var numDecimales = field.props["numDecimales"];

  var regexpEntero = new RegExp('^\\d+$');

  var validacionRegexEntero = regexpEntero.test(field.formControl.value);

  if (validacionRegexEntero) { // es entero
    console.log('es entero')   

    if(field.formControl.value.length > numEnteros){
      return (field.formControl.value)
    }

    var entero = '0';

    if(+field.formControl.value != 0){
      entero = field.formControl.value
    }


    var decimal = (0 + '').padEnd(numDecimales, '0').slice(-numDecimales)  ;

    return entero + '.'+   decimal;
  }else if (!validacionRegexEntero){

    var splitValues = field.formControl.value.split('.');

    console.log('dasda',splitValues );
    
    if(splitValues.length == 2){

      var entero  = '';

      if(+splitValues[0] != 0){
        entero = splitValues[0]
      }else{
        entero = '0';
      }

      var decimal = '';
      if(splitValues[1] == ''){
        decimal = (splitValues[1] + '').padEnd(numDecimales, '0').slice(-numDecimales)  ;
      }

      if(splitValues[1].length > numDecimales){
        return  entero + '.'+   splitValues[1]; 
      }

      decimal = (splitValues[1] + '').padEnd(numDecimales, '0').slice(-numDecimales)  ;

      return  entero + '.'+   decimal;
    }

  }

  return (field.formControl.value)
}

export function decimalNumbers(control: FormControl, field: FormlyFieldConfig): ValidationErrors {
  // console.log(control)
  var numEnteros = field.props["numEnteros"];
  var numDecimales = field.props["numDecimales"];

  //primero saber si en decimal o entero 

  var regexpEntero = new RegExp('^\\d+$');

  var validacionRegexEntero = regexpEntero.test(control.value);

  if (validacionRegexEntero) { // es entero
    console.log('es entero')

    if(control.value.length > numEnteros){
      return { 'decimalNumbers': { message: `"${field.formControl.value}" no es un valor válido` } }
    }


    return null;
  }else if (!validacionRegexEntero){

    var regexpDecimal = new RegExp('^\\d{0,' + numEnteros + '}\\.{0,1}\\d{' + numDecimales + '}$');

    var validacionRegexDecimal = regexpDecimal.test(control.value);
  
    if (!validacionRegexDecimal) {
      if (control.value != "") {
        // console.log('entro')
        return { 'decimalNumbers': { message: `"${field.formControl.value}" no es un valor válido` } }
      }
    }
  

  }

}


/*export function fieldMatchValidator(control: AbstractControl) {
  const { password, passwordUpdate } = control.value;

  if (!password || !passwordUpdate) {
    return null;
  }

  if (password === passwordUpdate) {
    return null;
  }

  return { noPass: true}
  //return { fieldMatch: { message: 'La contraseña no es igual' } };
}*/


export function onlyNumbers(control: FormControl, field: FormlyFieldConfig): ValidationErrors {
  // console.log(control)
  if (!control.value || !/^[0-9]+$/.test(control.value)) {
    if (control.value != "") {
      // console.log('entro')
      return { 'numero': { message: `"${field.formControl.value}" no es un valor válido` } }
    }
  }
}

export function maxMinDate(control: AbstractControl, field: FormlyFieldConfig): ValidationErrors {
  //console.log('validator',control)
  if (control.value) {

    var dateInput = new Date(control.value.split('-')[0], control.value.split('-')[1] - 1, control.value.split('-')[2]);

    if (field.props["minDate"] != undefined && '' != field.props["minDate"].toString().trim()) {
      var minDate = new Date(field.props["minDate"].split('-')[0], field.props["minDate"].split('-')[1] - 1, field.props["minDate"].split('-')[2]);
      if (minDate > dateInput) {
        //field.formControl.reset()
        return { 'minDate': { message: `El día seleccionado no es válido, es menor al permitido` } }
      }
    }

    if (field.props["maxDate"] != undefined && '' != field.props["maxDate"].toString().trim()) {
      var maxDate = new Date(field.props["maxDate"].split('-')[0], field.props["maxDate"].split('-')[1] - 1, field.props["maxDate"].split('-')[2]);
      if (dateInput > maxDate) {
        //field.formControl.reset()
        return { 'maxDate': { message: `El día seleccionado no es válido, es mayor al permitido` } }

      }
    }

  }

  if (field.templateOptions.required && (!control.value || control.value.length <= 0)) {
    return { required: true }
  }

  return null;

}


export function ValidadorMultiselect(control: FormControl, field: FormlyFieldConfig): ValidationErrors {

  if (!control.value || control.value.length <= 0) {
    return { required: true }
  }

  return null;

}