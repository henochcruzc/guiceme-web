import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { GeneralComponent } from '../../general/general.component';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Subject, of } from 'rxjs';
import { DialogFormlyComponent } from 'src/app/shared/dialog-formly/dialog-formly.component';
@Component({
    selector: 'app-test',
    standalone: true,
    templateUrl: './test.component.html',
    styleUrls: ['./test.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        SharedModule
    ]
})
export class TestComponent extends GeneralComponent implements OnInit {
    @ViewChild('matSort') sortAlertas: MatSort;
    model: any = {};
    form = new FormGroup({});
    
    fields: FormlyFieldConfig[] = [
        {
            fieldGroupClassName: 'row',
            fieldGroup: [
                {
                    className: "col-md-3",
                    key: 'selectNormal',
                    type: 'select',
                    props: {
                        label: 'select normal',
                        placeholder: 'select',
                        options: [
                            { label: 'Iron Man', value: 1 },
                            { label: 'Captain America', value: 2 },
                            { label: 'Black Widow', value: 3 },
                            { label: 'Hulk', value: 4 },
                            { label: 'Captain Marvel', value: 5 },
                        ],

                        dataModal:{titulo:'titulo',mensaje:'mensaje',textOk:'texto boton ok', textCancel:'textp btn cancelar'} // solo cuando se usa un modal
                    },
                },
                {
                    className: "col-md-3",
                    key: 'selectModal',
                    type: 'selectModal',
                    props: {
                        label: 'select modal',
                        placeholder: 'select',
                        options: [
                            { label: 'Iron Man', value: 1 },
                            { label: 'Captain America', value: 2 },
                            { label: 'Black Widow', value: 3 },
                            { label: 'Hulk', value: 4 },
                            { label: 'Captain Marvel', value: 5 },
                        ],
                        dataModal:{titulo:'titulo',mensaje:'mensaje',textOk:'texto boton ok', textCancel:'textp btn cancelar'} // solo cuando se usa un modal
                    },
                },
                {
                    className: "col-md-3",
                    key: 'input',
                    type: 'input',

                    props: {
                        label: 'input',

                        // required: true,
                    },
                },
                {
                    className: "col-md-3",
                    key: 'password',
                    type: 'password',

                    props: {
                        label: 'password',

                        // required: true,
                    },
                },
                {
                    className: "col-md-3",
                    key: 'captcha',
                    type: 'captcha',
                    props: {
                        label: 'captcha',
                        // required: true,
                    },
                },


            ]
        },
        {
            fieldGroupClassName: 'row',
            fieldGroup: [
                {
                    className: "col-md-3",
                    key: 'button ',
                    type: 'button',
                    props: {
                        classBtn: '',
                        text: 'button',
                        onClick: () => {
                            this.accion();
                        },
                        disabled: false,

                    },
                },
                {
                    className: 'col-md-3 ',
                    type: 'text',
                    props: {
                        label: 'texto plano',
                    },

                },
                {
                    className: "col-md-3",
                    key: 'mat-radio',
                    type: 'mat-radio',
                    props: {
                        label: 'mat-radio',
                        // required: true,
                        options: [
                            { value: true, label: 'Si' },
                            { value: false, label: 'No' },
                        ],
                    },
                },


            ]
        },

        {
            fieldGroupClassName: 'row',
            fieldGroup: [
                {
                    className: 'col-md-3',
                    key: 'checkBox',
                    type: 'check-box',
                    defaultValue: false,
                    props: {
                        label: 'check box',

                    }

                },
                {
                    className: 'col-md-3',
                    key: 'checkBoxInline',
                    type: 'check-box',
                    defaultValue: false,
                    wrappers: ['form-field-checkbox-inline'],
                    props: {
                        label: 'check box inline',
                    }
                },
                {
                    className: 'col-md-3',
                    key: 'inputCheck',
                    type: 'input',
                    props: {
                        label: 'input with check box',
                    },
                    expressions: {
                        'props.disabled': () => {                    
                            return !this.model['checkBoxInline']
                        },
                      },

                },
                {
                    className: "col-md-3",
                    key: 'materialDate1',
                    type: 'material-date',
                    props: {
                        label: 'material-date',
                        required: true,
                    },
                },
                {
                    className: "col-md-3",
                    key: 'materialRangeDate1',
                    type: 'material-date',
                    props: {
                        range: true,
                        label: 'material-range-date1',
                        required: true,
                    },
                },
                {
                    className: "col-md-3",
                    key: 'materialRangeDate1Disable',
                    type: 'material-date',
                    props: {
                        range: true,
                        label: 'material-range-date1 disabled',
                        required: true,
                        disabled: true,
                    },
                },

                {
                    className: "col-md-3",
                    key: 'folio',
                    type: 'input',
                    wrappers: ['mat-radio-wrapper-RadioBtnCheck'],
                    props: {
                        label: 'Folio de la solicitud ',
                        placeholder: '',
                    },
                },
                {
                    className: "col-md-3",
                    key: 'folioDos',
                    type: 'input',
                    wrappers: ['mat-radio-wrapper-RadioBtnCheck'],
                    props: {
                        label: 'Esto es a dos lineas para ver como se comporta el radio aun le falta mas texto para ver  ',
                        placeholder: '',
                    },
                },
                {
                    className: 'col-md-3',
                    key: 'autoComplete',
                    type: 'autoComplete',
                    props: {
                        placeholder: 'AUTO COMPLETE',
                        label: 'AUTO-COMPLETE',
                        valueProp: 'id',
                        labelProp: 'descripcion',
                        opciones: of([{ id: 1, descripcion: 'des uno' }, { id: 2, descripcion: 'des dos' }]),
                        target: 'cveAutocomplete',
                        listaObs: new Subject<any>(),
                        required: false
                    },
                },
                {
                    className: "col-md-3",
                    key: 'materialDate1Disable',
                    type: 'material-date',
                    props: {
                        label: 'material-date disable',
                        required: true,
                        disabled: true,
                    },
                },
                {
                    className: 'col-md-3',
                    key: 'btn-limpiar',
                    type: 'button',
                    props: {
                      label: ' ',
                      text: 'Limpiar',
                      //classBtn: 'btn-sm btn-pro'
                      classBtn: '',
                      onClick: () => {
                        this.resetFormulario();
                      },
                      disabled: false,
                    }
                  },



            ]
        },
        {
            fieldGroupClassName: 'row',
            fieldGroup: [
                {
                    className: 'col-md-3',
                    key: 'horas',
                    type: 'time',
                    defaultValue: '13:30:00',
                    props: {
                        label: 'time',

                    }

                },
                {
                    className: 'col-md-3',
                    key: 'horas 2',
                    type: 'time',
                    props: {
                        label: 'time2',
                        required: true

                    }

                },
                {
                    className: 'col-md-3',
                    key: 'material-date-place',
                    type: 'material-date-place',
                    props: {
                        label: 'material-date-place',
                        required: true

                    }

                },
                {
                    className: 'col-md-6',
                    key: 'multiselect',
                    type: 'multi-select',
                    templateOptions: {
                      multiple: true,
                      label: 'Multi select',
                      placeholder: 'Seleccionar',
                      opciones:of([{id:1,descripcion:'uno'},{id:2,descripcion:'dos'},{id:3,descripcion:'tres'},{id:4,descripcion:'cuatro'}]),
                      valueProp: 'id',
                      labelProp: 'descripcion',
                      required: true,
                      target:'multiselect'
                    },
                  },
                  {
                    className: 'col-md-6',
                    key: 'decimalNumber',
                    type: 'decimal',
                    templateOptions: {                      
                      label: 'Decimal',  
                      numEnteros:3,
                      numDecimales:3,
                      placeholder: '000.000',
                    },
                  }


                

            ]
        },


    ]
    displayedColumns = ['titulo1', 'titulo2', 'titulo3', 'titulo4', 'titulo5', 'titulo6', 'titulo7', 'titulo8', 'acciones']
    myData;
    tableDS: MatTableDataSource<any>;
    paginaActual : number=1;
    resetFormulario(){
        this.form.reset();
    }

    ngOnInit(): void {

        this.myData = [...Array(500).keys()].map((index) => ({
            id: index,
            firstName: `firstName_${index}`,
            lastName: `lastName_${index}`,
            text: `texto_${index} `,
            age: 18 + (index % 12),
        }))

        this.tableDS = new MatTableDataSource(this.myData.slice(0, this.ConfigTabla.NUM_ELEMENTOS_TABLA));

    }

    dialogo() {
        const dialogRef = this._dialog.open(
            DialogComponent,
            this._dialogService.guardar()
        );

        dialogRef.afterClosed().subscribe(
            async data => {
                if (data == true) {
                    this._alertServices.success('succes');
                    this._alertServices.error('error');
                    this._alertServices.info('info');
                    this._alertServices.warn('warn');
                }
            }
        );
    }
   dialogoRecomendaciones(){

    
  
    const dialogRef = this._dialog.open(
        DialogFormlyComponent,
        this._dialogFormlyService.imprimirEtiquetaAntCito("MN20240208000123")
      );
      dialogRef.afterClosed().subscribe(
        async data => {
          //debugger
          if (data !=null) {
             console.log("data recomendaciones",data);
      

          }else {
            console.log("data recomendaciones",data);
        
          }
        }
      );
   }
   dialogoRecomendacionesNTP(){

    
  
    const dialogRef = this._dialog.open(
        DialogFormlyComponent,
        this._dialogFormlyService.imprimirEtiquetaNTP("MN20240208000123")
      );
      dialogRef.afterClosed().subscribe(
        async data => {
          //debugger
          if (data !=null) {
             console.log("data recomendaciones",data);
      

          }else {
            console.log("data recomendaciones",data);
        
          }
        }
      );
   }
   dialogoRechazarAtribuible(){
     
const dialogRef = this._dialog.open(
    DialogFormlyComponent,
    this._dialogFormlyService.noAprobarRecepcionUM("MN20240208000123")
  );

  dialogRef.afterClosed().subscribe(
    async data => {
      //debugger
     if(data){
         console.log("data",data);
     }
    }
  );  
   }
    clickAccion() {
        this._alertServices.success('succes click');
    }

    accion() {
        this._alertServices.success('succes click');
    }

    pageChanged(event: any) {
        console.log(event)
        const startItem = (event - 1) * this.ConfigTabla.NUM_ELEMENTOS_TABLA;
        const endItem = event * this.ConfigTabla.NUM_ELEMENTOS_TABLA;
        console.log(startItem, endItem, this.myData.slice(startItem, endItem));
        this.tableDS = new MatTableDataSource(this.myData.slice(startItem, endItem));
    }


    tabs = [1, 2, 3, 4, 5];
    counter = this.tabs.length + 1;
    active;

    onNavChange(changeEvent: NgbNavChangeEvent) {

    }

    fieldsOffCanvas: FormlyFieldConfig[] = [
        {
            fieldGroupClassName: 'row',
            fieldGroup: [,
                {
                    className: "col-lg-12 col-md-12",
                    key: 'motivo',
                    type: 'select',
                    props: {
                        label: 'Motivo de rechazo de la mezcla',
                        placeholder: 'Seleccionar',
                        // required: true,
                        options: [
                            { label: 'Seleccionar 1', value: 'IdSeleccionar' },
                            { label: 'Seleccionar 2', value: 'IdSeleccionar' },
                            { label: 'Seleccionar 3', value: 'IdSeleccionar' },
                            { label: 'Seleccionar 4', value: 'IdSeleccionar' },

                        ],
                    },
                },]
        },
        {
            fieldGroupClassName: 'row',
            fieldGroup: [,
                {
                    className: 'col-lg-12 col-md-12',
                    key: 'observaciones',
                    type: 'textarea',
                    props: {
                        label: 'Observaciones',
                        // required: true,
                        maxLength: 15,
                        minLength: 15,
                        rows: 5,
                    },
                },]
        }
    ]


    openSideBar() {
        this.abrirOffCanvas('Preparación de mezclas estériles', this.fieldsOffCanvas).then(
            async data => {
                console.log(data)
                if (null != data) {
                    this._alertServices.success(JSON.stringify(data));
                }
                if (null == data) {
                    this._alertServices.error(data);
                }
            }
        );

    }

    shortTable(sort:Sort) {
        console.log("colName " + sort);
    
        const array = this.tableDS.data ;
        let des = sort.direction == 'desc';
        const sortedArray = this.sortArrayOfObjects(array, sort.active, des);    
        //let otherModel = {...this.modelo};
       // otherModel.content = sortedArray;
       // console.log(otherModel)
        this.tableDS = new MatTableDataSource(sortedArray);
      }

}
