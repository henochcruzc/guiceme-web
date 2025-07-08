import { CommonModule, formatDate } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TituloComponent } from 'src/app/shared/layout/frames/titulo/titulo.component';
import { CatalogoService } from 'src/app/shared/services/catalogo.service';
import { SharedModule } from 'src/app/shared/shared.module';
import * as moment from 'moment';
import { GeneralComponent } from '../../general/general.component';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { StorageService } from '../../login/services/storage.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-detalle-mezcla',
  templateUrl: './detalle-mezcla.component.html',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,

  ],
  styleUrls: ['./detalle-mezcla.component.scss']
})
export class DetalleMezclaComponent extends GeneralComponent implements OnInit {

  medicamentoBackup: any;
  dosisMedicamentoBackup: any;
  diluyenteBackup: any;
  dosisDiluyenteBackup: any;
  fechaAplBackup: any;
  cadaBackup: any;
  numTotalDosisBackup: any;
  viaAdmonBackup: any;
  tiempoAdmonBackup: any;
  velocidadInfusionBackup: any;
  tabsBackup = [];
  isDisabled = true;

  public minDate = moment(new Date()).add(1, 'days').format('YYYY-MM-DD');
  public maxdate = moment(this.minDate, 'YYYY-MM-DD').add(29, 'days').format('YYYY-MM-DD');
  lsMedicamentos: any;
  lsDiluyentesNTP: any;
  meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  tabs = [];
  counter = this.tabs.length + 1;
  active;

  @Input() mezclaDetails: any;
  @Input() mezclaName: any;
  @Output() onSelected = new EventEmitter<any>();
  @Output() onDisabledSend = new EventEmitter<any>();

  disableComp: boolean = true;
  eliminar: boolean = true;
  canceEdicion: boolean = false;
  editar: boolean = true;
  saveEdicion: boolean = false;
  disabledEliminar: boolean = false
  cadaLst: any;
  dosisTotales: number = 0;
  valorCada: any;


  antibioticosDisplayedColumns: string[] = [
    'medicamento',
    'dosis',
    'unidadMedida',
    'rechazar'
  ];
  medicamentosTotal: number = 0;
  antibioticosDataSource = new MatTableDataSource<any>([]);
  noMezcla: boolean;
  boton: boolean = true;
  tipoMezcla: any;

  formTipoMezcla = new FormGroup({});

  //panel antibioticos
  model: any = {};
  form = new FormGroup({});
  fields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: "col-lg-8 col-md-6",
          key: 'medicamento',

          type: 'select',
          props: {
            label: 'Medicamento',
            placeholder: 'Seleccionar',
            required: true,
            valueProp: 'id',
            labelProp: 'desCortaMedicamento',
            options: [],
            disable: true,
          },
          hooks: {
            onInit: async (field) => {

              this.catalogService.getMedicamentos()
                .then(
                  (data: any) => {
                    if (data) {

                      this.lsMedicamentos = data;
                      field.props.options = data;
                      field.props['disable'] = true;
                    } else
                      this._alertServices.error("<strong>Error</strong> al obtener conceptos de Medicamentos");
                  },
                  (_err) => {
                    this._alertServices.error("<strong>Error</strong> al obtener conceptos de Medicamentos");
                  }
                );

            }
          },
          expressionProperties: {
            'props.disabled': (model: any) => {
              if (this.disabled) {
                return true
              } else {
                return false
              }

            },
          },
        },


        {
          className: "col-lg-2 col-md-6",
          key: 'dosis',
          type: 'input-mask',
          props: {
            label: 'Dosis',
            placeholder: 'Ingresar dosis',
            appInputMaskType: 'integer',
            disable: true,
            maxLength: 6,
            required: true,
          },
          expressionProperties: {
            'props.disabled': (model: any) => {
              if (this.disabled) {
                return true
              } else {
                return false
              }

            },
          },
        },
        {
          className: "col-lg-2 col-md-6",
          key: 'unidadMedida',
          type: 'input',// 'input-mask',
          props: {
            label: 'Unidad de medida',
            placeholder: '-------------',
            disabled: true
          },
        },
        /*{
          className: 'col-lg-2 col-md-6',
          //key:'rfc',
          type: 'button',
          templateOptions: {
            text: 'Agregar Medicamento ',
            onClick: (to, $event) => {
              //this.tipoMezclaDataSource= new MatTableDataSource<any>(MockData.mockTipoMezcla);
              //this.buscarMezclas();
              this.agregarMedicamento();

            },
            classBtn: 'btn btn-primary btn-sm btn-pro'
          }

        },*/


      ]
    },



  ]

  //panel de abajo
  modelAbajoAnti: any = {};
  formAbajoAnti = new FormGroup({});
  fieldsAbajoAnti: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: "col-lg-8 col-md-6",
          key: 'diluyente',
          type: 'select',

          props: {
            label: 'Diluyente',
            required: true,
            placeholder: 'Selecciona el diluyente',
            valueProp: 'id',
            labelProp: 'desCortaDiluyente',

            options: [],
          },
          hooks: {
            onInit: async (field) => {
              this.catalogService.getDiluyentes()
                .then(
                  (data: any) => {
                    if (data) {
                      field.props.options = data;
                    } else
                      this._alertServices.error("<strong>Error</strong> al obtener conceptos de Diluyente");
                  },
                  (_err) => {
                    this._alertServices.error("<strong>Error</strong> al obtener conceptos de Diluyente");
                  }
                );
            }
          },
          expressionProperties: {
            'props.disabled': (model: any) => {
              if (this.disabled) {
                return true
              } else {
                return false
              }

            },
          },
        },
        {
          className: "col-lg-2 col-md-6",
          key: 'dosis',

          type: 'input',
          props: {
            label: 'Dosis',
            placeholder: 'Ingresa la dosis',
            maxLength: 6,
            required: true
          },
          expressionProperties: {
            'props.disabled': (model: any) => {
              if (this.disabled) {
                return true
              } else {
                return false
              }

            },
          },

        },
        {
          className: "col-lg-2 col-md-6",
          key: 'unidadMedida',

          type: 'input',
          props: {
            label: 'Unidad de medida',
            placeholder: '-------------',
            disabled: true
          },
          expressionProperties: {
            'props.disabled': (model: any) => {
              if (this.disabled) {
                return true
              } else {
                return false
              }

            },
          },
        },
      ]
    },

    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: 'col-lg-4 col-md-6',
          key: 'fecApl',
          type: 'material-date',
          templateOptions: {
            label: 'Fechas de aplicación',
            range: true,
            placeholder: 'Seleccionar fecha y hora',
            required: true,
            minDate: this.minDate,
            maxDate: this.maxdate,
            fechaObs: new Subject<any>(),
          },
          hooks: {

            onInit: async (field) => {
              const fecApl = field.form.get('fecApl');

              if (fecApl != null) {
                //listener cuando cambia
                fecApl.valueChanges.subscribe((x) => {
                  const inputs = document.querySelectorAll('.mat-datepicker-toggle-active');
                  //console.log(inputs);
                  if (inputs.length > 0) {
                    if (x != null && x != '') {
                      this.tabs = this.getTabsMesDias(x);
                    }
                  }
                });
              }
            },
            afterViewInit: async (field) => {

              if (this.mezclaDetails.fecApl) {
                let fecha = {
                  startDate: moment(this.mezclaDetails.fecApl.startDate, 'DD-MM-YYYY').format("YYYY-MM-DD"),
                  endDate: moment(this.mezclaDetails.fecApl.endDate, 'DD-MM-YYYY').format("YYYY-MM-DD"),
                }
                //this.modelAbajoAnti.fecApl = fecha;

                if (field.props && field.props['fechaObs'] && typeof field.props['fechaObs'].next === 'function') {
                  field.props['fechaObs'].next(fecha);
                }
              }

              this.fechObs = field.props['fechaObs']

            },
          },
          expressionProperties: {
            'props.disabled': (model: any) => {
              if (this.disabled) {
                return true
              } else {
                return false
              }

            },
          },
        },
        {
          className: "col-lg-2 col-md-6",
          key: 'cada',
          type: 'select',

          props: {
            label: 'Cada',
            required: true,
            placeholder: 'Selecciona el periodo',
            valueProp: 'id',
            labelProp: 'desAplicacionCada',
            options: [],
          },
          hooks: {
            onInit: async (field) => {


              this.catalogService.getAplicacionCada()
                .then(
                  (data: any) => {
                    if (data) {
                      field.props.options = data;
                      this.cadaLst = data;
                    } else
                      this._alertServices.error("<strong>Error</strong> al obtener conceptos de Diluyente");
                  },
                  (_err) => {
                    this._alertServices.error("<strong>Error</strong> al obtener conceptos de Diluyente");
                  }
                );

              const cada = field.form.get('cada');
              this.dosisTotales = 0;

              if (cada != null) {
                //listener cuando cambia
                cada.valueChanges.subscribe((x) => {
                  if (x != null && x != '') {
                    //se comento esta pendiente por cicla los llamados
                    this.valorCada = x
                    this.calculoDosis(this.valorCada)
                    this.formAbajoAnti.controls['numDosis'].setValue(this.dosisTotales);
                  }

                });
              }







            }
          },
          expressionProperties: {
            'props.disabled': (model: any) => {
              if (this.disabled) {
                return true
              } else {
                return false
              }

            },
          },
        },

        {
          className: "col-lg-2 col-md-6",
          key: 'numDosis',

          type: 'input',
          props: {
            label: 'Numero total de dosis',
            placeholder: '-------------',

            disabled: true
          },
          expressionProperties: {
            'props.disabled': (model: any) => {
              if (this.disabled) {
                return true
              } else {
                return false
              }

            },
          },
        },



      ]
    }





  ]

  //panel viad administracion
  modelViaAdmin: any = {};
  formViaAdmin = new FormGroup({});
  fieldsViaAdmin: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: "col-lg-4 col-md-6",
          key: 'viaAdmon',

          type: 'select',
          props: {
            label: 'Vía de administración',
            placeholder: 'Seleccionar',
            required: true,
            options: [],
            valueProp: 'id',
            labelProp: 'desViaAdministracion',
          },
          hooks: {
            onInit: async (field) => {
              this.catalogService.getViaAdmon(this.tipoMezcla)
                .then(
                  (data: any) => {
                    if (data) {
                      field.props.options = data;
                    } else this._alertServices.error("<strong>Error</strong> al obtener conceptos de vía de administración");
                  },
                  (_err) => {
                    this._alertServices.error("<strong>Error</strong> al obtener conceptos de vía de administración");
                  }
                );
            }
          },
          expressionProperties: {
            'props.disabled': (model: any) => {
              if (this.disabled) {
                return true
              } else {
                return false
              }

            },
          },
        },
        // {
        //   className: "col-lg-2 col-md-6",
        //   key: 'tiempoInfusion',

        //   type: 'input',
        //   props: {
        //     label: 'Tiempo de infusión',
        //     placeholder: 'Seleccionar',
        //     required: true,
        //     options: [],
        //     valueProp: 'id',
        //     labelProp: 'desTiempoInfusion',
        //   },
        //   expressionProperties: {
        //     'props.disabled': (model: any) => {
        //       if (this.disabled) {
        //         return true
        //       } else {
        //         return false
        //       }

        //     },
        //   },
        //   hooks: {
        //     onInit: async (field) => {
        //       this.catalogService.getTiempoInfusion()
        //         .then(
        //           (data: any) => {
        //             if (data) {
        //               field.props.options = data;
        //             } else this._alertServices.error("<strong>Error</strong> al obtener conceptos de vía de administración");
        //           },
        //           (_err) => {
        //             this._alertServices.error("<strong>Error</strong> al obtener conceptos de vía de administración");
        //           }
        //         );
        //     }
        //   },
        // },
        {
          className: "col-md-6 col-lg-2",
          key: 'unidadTiempo',
          type: 'select',
          props: {
            label: 'Tiempo de infusión',
            placeholder: 'Seleccionar',
            required: true,
            options: [],
            valueProp: 'id',
            labelProp: 'desTiempoInfusion',
          },
          expressionProperties: {
            'props.disabled': (model: any) => {
              if (this.disabled) {
                return true
              } else {
                return false
              }

            },
          },
          hooks: {
            onInit: async (field) => {
              this.catalogService.getTiempoInfusion()
                .then(
                  (data: any) => {
                    if (data) {
                      field.props.options = data;
                    } else this._alertServices.error("<strong>Error</strong> al obtener conceptos de vía de administración");
                  },
                  (_err) => {
                    this._alertServices.error("<strong>Error</strong> al obtener conceptos de vía de administración");
                  }
                );
            }
          },
        },
        {
          className: "col-md-6 col-lg-2",
          key: 'velocidadInfusion',
          type: 'input',
          props: {
            label: 'Velocidad de infusión (ml/hrs.)',
            placeholder: 'Ingresa la velocidad',
            required: true,
          },
          expressionProperties: {
            'props.disabled': (model: any) => {
              if (this.disabled) {
                return true
              } else {
                return false
              }

            },
          },

        }
      ]
    },
  ]

  color: any;
  disabled: boolean = false
  fechObs: any;//import("@ngx-formly/core").FormlyFieldProps & { [additionalProperties: string]: any; };

  ngOnInit(): void {
    this.modelAbajoAnti.fecApl = {}
    this.modelAbajoAnti.fecAplString = {}
    this.disabled = true
    //console.log('info del padre ', this.mezclaDetails);
    //console.log('FORM ', this.formTipoMezcla);




    //debugger
    this.tabs = [];
    this.tipoMezcla = this.mezclaDetails.tipoMezcla;
    this.model.medicamento = this.mezclaDetails.medicamento.medicamento;
    this.model.dosis = this.mezclaDetails.medicamento.dosis;
    this.model.unidadMedida = this.mezclaDetails.medicamento.unidadMedida;
    this.modelAbajoAnti.diluyente = this.mezclaDetails.diluyente.diluyente;
    this.modelAbajoAnti.dosis = this.mezclaDetails.diluyente.dosis;
    this.modelAbajoAnti.unidadMedida = this.mezclaDetails.diluyente.unidadMedida;
    //this.modelAbajoAnti.fecApl = this.mezclaDetails.fecApl;

    this.modelAbajoAnti.cada = this.mezclaDetails.cada;
    this.modelAbajoAnti.numDosis = this.mezclaDetails.numDosis;
    this.modelViaAdmin.viaAdmon = this.mezclaDetails.viaAdmon;
    this.modelViaAdmin.tiempoInfusion = this.mezclaDetails.unidadTiempo;
    this.modelViaAdmin.velocidadInfusion = this.mezclaDetails.velocidadInfusion;
    this.modelViaAdmin.unidadTiempo = this.mezclaDetails.unidadTiempo,

      this.tabs = JSON.parse(JSON.stringify(this.mezclaDetails.mesesDosis));

    //console.log("tabs recibidas", this.tabs);
    this.formAbajoAnti.disable();
    this.form.disable();
    //this.formAbajoAnti.controls['fecApl'].setValue(null)
    //console.log(this.formAbajoAnti)
  }

  calculoDosis(element) {
    //console.log(element)

    const cadaVal = this.cadaLst.find((e) => e.id === element);
    let hrs = Number(cadaVal.desAplicacionCada.split(" ", 1));
    //console.log("cada >", hrs);

    this.dosisTotales = 0;
    for (let index = 0; index < this.tabs.length; index++) {
      const element = this.tabs[index];
      for (let j = 0; j < element.dias.length; j++) {
        const dias = element.dias[j];
        if (dias.check == true) {
          this.dosisTotales = this.dosisTotales + 24 / hrs;

        }

      }

    }
  }

  async editarMezcla() {

    localStorage.removeItem("fechasFlag")

    this.onDisabledSend.emit(!this.saveEdicion);
    this.canceEdicion = true
    this.editar = false
    this.saveEdicion = true
    this.disabledEliminar = true

    //console.log(this.form)
    //console.log(this.formAbajoAnti)
    //console.log(this.formViaAdmin)

    //se ejecuta backup de info

    await this.backupInfo();

    this.form.controls['dosis'].enable();
    this.form.controls['medicamento'].enable();
    this.formAbajoAnti.controls['cada'].enable();
    this.formAbajoAnti.controls['diluyente'].enable();
    this.formAbajoAnti.controls['dosis'].enable();
    this.formAbajoAnti.controls['fecApl'].enable();
    this.tabs = JSON.parse(JSON.stringify(this.mezclaDetails.mesesDosis));
    this.formViaAdmin.controls['unidadTiempo'].enable();
    this.formViaAdmin.controls['viaAdmon'].enable();
    this.formViaAdmin.controls['velocidadInfusion'].enable();

    this.isDisabled = !this.isDisabled;
    // this.form.enable();
    // this.formAbajoAnti.enable();
    // this.formViaAdmin.enable();
  }

  async cancelarEdicion() {

    this.onDisabledSend.emit(!this.saveEdicion);
    this.canceEdicion = false
    this.editar = true
    this.saveEdicion = false

    //console.log(this.form)
    //console.log(this.modelAbajoAnti)
    //console.log(this.formViaAdmin)

    await this.restoreInfo();

    this.form.controls['dosis'].disable();
    this.form.controls['medicamento'].disable();
    this.formAbajoAnti.controls['cada'].disable();
    this.formAbajoAnti.controls['diluyente'].disable();
    this.formAbajoAnti.controls['dosis'].disable();
    this.formAbajoAnti.controls['fecApl'].disable();
    this.formViaAdmin.controls['unidadTiempo'].disable();
    this.formViaAdmin.controls['viaAdmon'].disable();
    this.formViaAdmin.controls['velocidadInfusion'].disable();
    this.isDisabled = !this.isDisabled;
    //await this.ngOnInit();

  }
  guardarEdicion() {

    if (this.form.valid && this.formAbajoAnti.valid && this.formTipoMezcla.valid && this.formViaAdmin.valid) {
      let mensaje = "¿Deseas guardar los cambios realizados en la <b>" + this.mezclaName + "</b> ?"
      const dialogRef = this._dialog.open(
        DialogComponent,
        this._dialogService.modalGenerico("Guardar cambios", mensaje, null, "Guardar cambios")
      );

      dialogRef.afterClosed().subscribe(
        async data => {
          if (data == true) {
            this.onDisabledSend.emit(!this.saveEdicion);
            let mezclaDetailUpdate;

            let nvoDiluyente = {
              diluyente: this.modelAbajoAnti.diluyente,
              dosis: this.modelAbajoAnti.dosis,
              unidadMedida: this.modelAbajoAnti.unidadMedidaDil
            }
            let medicamento = {
              medicamento: this.model.medicamento,
              dosis: this.model.dosis,
            };

            mezclaDetailUpdate = {
              id: this.mezclaDetails.id,
              operacion: 'update',
              tipoMezcla: this.mezclaDetails.tipoMezcla,
              medicamento: medicamento,
              diluyente: nvoDiluyente,
              fecApl: this.modelAbajoAnti.fecApl,
              cada: this.modelAbajoAnti.cada,
              numDosis: this.modelAbajoAnti.numDosis,
              viaAdmon: this.modelViaAdmin.viaAdmon,
              velocidadInfusion: this.modelViaAdmin.velocidadInfusion,
              unidadTiempo: this.modelViaAdmin.unidadTiempo,
              mesesDosis: this.tabs
            }


            this.onSelected.emit(mezclaDetailUpdate);
            this.canceEdicion = false
            this.editar = true
            this.saveEdicion = false
            this.disabledEliminar = true
            this.disabled = true

            this.form.controls['dosis'].disable();
            this.form.controls['medicamento'].disable();
            this.formAbajoAnti.controls['cada'].disable();
            this.formAbajoAnti.controls['diluyente'].disable();
            this.formAbajoAnti.controls['dosis'].disable();
            this.formAbajoAnti.controls['fecApl'].disable();
            this.formViaAdmin.controls['unidadTiempo'].disable();
            this.formViaAdmin.controls['viaAdmon'].disable();
            this.formViaAdmin.controls['velocidadInfusion'].disable();
            // this.form.enable();
            this.isDisabled = !this.isDisabled;
          }
        }
      );
    }
  }
  eliminarMezcla() {

    const dialogRef = this._dialog.open(
      DialogComponent,
      this._dialogService.modalGenerico("Eliminar mezcla", "¿Deseas eliminar esta mezcla de tu solicitud? </br> <b>Esta acción no se puede deshacer.</b>", null, "Eliminar mezcla")
    );

    dialogRef.afterClosed().subscribe(
      async data => {
        if (data == true) {
          let mezclaDetailUpdated = {
            id: this.mezclaDetails.id,
            operacion: 'delete',
          }
          this.onSelected.emit(mezclaDetailUpdated);
        }
      }
    );


  }
  rechazarAnti(element) {

  }
  actualizarMezcla() {

  }

  seleccionarTodo(event) {


    this.seleccionTodo = !this.seleccionTodo;
    //console.log("seleccionar todos");
    let backupTabs = JSON.parse(JSON.stringify(this.tabs));

    this.cd.detectChanges();



    for (let index = 0; index < this.tabs.length; index++) {
      let element = this.tabs[index];
      for (let j = 0; j < element.dias.length; j++) {
        let dia = element.dias[j];
        dia.check = event;
      }

    }
    //console.log("seleccionados todos?", this.tabs)
    this.calculoDosis(this.mezclaDetails.cada)
    this.formAbajoAnti.controls['numDosis'].setValue(this.dosisTotales);
    // this.cd.detectChanges();
  }

  seleccionTodo: boolean = false;

  actualizarSeleccionTodo(): void {
    let todosSeleccionados = true;

    this.tabs.forEach(tab => {
      tab.dias.forEach(dia => {
        if (!dia.check) {
          todosSeleccionados = false;
          return; // Salir del bucle interno tan pronto como se encuentre un día no seleccionado
        }
      });

      if (!todosSeleccionados) {
        return; // Salir del bucle externo tan pronto como se encuentre un día no seleccionado
      }
    });

    this.seleccionTodo = todosSeleccionados;
  }

  actualizarDia(event, item) {
    //console.log('data', event);
    //console.log('data', item);

    let elementMes = this.tabs.find((e) => e.nombreMes === item.nombreMes && e.nombreAnio == item.nombreAnio);
    let elementDia = elementMes.dias.find((e) => e.nombreMes === item.nombreMes && e.nombreAnio == item.nombreAnio && e.nombreDia == item.nombreDia);
    elementDia.check = event;
    this.calculoDosis(this.mezclaDetails.cada)
    this.formAbajoAnti.controls['numDosis'].setValue(this.dosisTotales);

    this.actualizarSeleccionTodo();

    //console.log("tabs", this.tabs);
  }
  onNavChange(changeEvent: NgbNavChangeEvent) {


  }
  bandera: any
  constructor(private cd: ChangeDetectorRef, private catalogService: CatalogoService,) {
    super();

  }

  backupInfo() {
    this.tabsBackup = [];
    this.tabsBackup = JSON.parse(JSON.stringify(this.tabs));

    this.medicamentoBackup = this.model.medicamento;
    this.dosisMedicamentoBackup = this.model.dosis;
    this.diluyenteBackup = this.modelAbajoAnti.diluyente;
    this.dosisDiluyenteBackup = this.modelAbajoAnti.dosis;
    this.fechaAplBackup = this.mezclaDetails.fecApl;
    this.cadaBackup = this.modelAbajoAnti.cada;
    this.numTotalDosisBackup = this.modelAbajoAnti.numDosis;
    this.viaAdmonBackup = this.modelViaAdmin.viaAdmon;
    this.tiempoAdmonBackup = this.modelViaAdmin.unidadTiempo;
    this.velocidadInfusionBackup = this.modelViaAdmin.velocidadInfusion;
  }
  restoreInfo() {

    this.formAbajoAnti.reset()
    //console.log(this.fechaAplBackup)
    //console.log(this.mezclaDetails.fecApl)
    this.tabs = this.tabsBackup;

    let modelFechas = {

      startDate: null,
      endDate: null

    }

    this.model = {
      ...this.model,
      medicamento: this.medicamentoBackup,
      dosis: this.dosisMedicamentoBackup
    }

    this.modelViaAdmin = {
      ...this.modelViaAdmin,
      viaAdmon: this.viaAdmonBackup,
      unidadTiempo: this.tiempoAdmonBackup,
      velocidadInfusion: this.velocidadInfusionBackup,
    }

    this.modelAbajoAnti.diluyente = this.diluyenteBackup
    this.modelAbajoAnti.dosis = this.dosisDiluyenteBackup

    //this.modelAbajoAnti.fecApl = this.mezclaDetails.fecApl;
    let fecha = {
      startDate: moment(this.mezclaDetails.fecApl.startDate, 'DD-MM-YYYY').format("YYYY-MM-DD"),
      endDate: moment(this.mezclaDetails.fecApl.endDate, 'DD-MM-YYYY').format("YYYY-MM-DD"),
    }
    //this.modelAbajoAnti.fecApl = fecha;


    this.fechObs.next(fecha)

    this.modelAbajoAnti.cada = this.cadaBackup,
      this.modelAbajoAnti.numDosis = this.numTotalDosisBackup

    this.cd.detectChanges();
  }

}
