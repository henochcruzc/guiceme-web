import { CommonModule, formatDate } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { FormlyFieldConfig } from '@ngx-formly/core';
import * as moment from 'moment';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { TituloComponent } from 'src/app/shared/layout/frames/titulo/titulo.component';
import { CatalogoService } from 'src/app/shared/services/catalogo.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { GeneralComponent } from '../../general/general.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-detalle-mezcla-ntp',
  templateUrl: './detalle-mezcla-ntp.component.html',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    TituloComponent

  ],
  styleUrls: ['./detalle-mezcla-ntp.component.scss']
})
export class DetalleMezclaNTPComponent extends GeneralComponent implements OnInit {
  viaAdminBackup: any;
  tiempoInfusionBackup: any;
  velocidadInfusionBackup: any;
  cadaBackup: any;
  numTotalDosisBackup: any;
  fechaAplBackup: any;
  diluyenteBackup: any;
  isDisabled = true;

  seleccionarTodos: boolean = false;

  seleccionarTodosBackup: boolean = false;
  disableComp: boolean = true;
  eliminarBtn: boolean = true;
  canceEdicion: boolean = false;
  editar: boolean = true;
  saveEdicion: boolean = false;
  disabledEliminar: boolean = false

  @Input() mezclaDetails: any;
  @Input() mezclaName: any;
  @Input() componenteTotal2: number;
  @Input() componenteExcluidos2: any= [];
  @Output() onSelected = new EventEmitter<any>();
  @Output() onDisabledSend = new EventEmitter<any>();

 componenteTotal: number = 0;
 componenteExcluidos: any= [];

  dosisTotales: number = 0;
  cadaLst: any;

  public minDate = moment(new Date()).add(1, 'days').format('YYYY-MM-DD');
  public maxdate = moment(this.minDate, 'YYYY-MM-DD').add(29, 'days').format('YYYY-MM-DD');
  public date = new Date();
  public today: string = formatDate(this.date, 'yyyy-MM-dd', 'en-US');
  fechasToAplDosis = [];
  meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  tabs = [];
  tabsBackup = [];
  tabsNTP = [];
  tabsNTPBackup = [];

  counterNTP = this.tabsNTP.length + 1;
  counter = this.tabs.length + 1;
  active;
  destipoMezcla: any;
  color: boolean = false;
  listMezclaCat: any;
  listDiluyente: any;
  ruta: any;
  fechas: any;
  osmolaridadBackup: any;
  nitrogenoBackup: any;
  proteinasBackup: any;
  kctotalesBackup: any;
  volumenTotalBackup: any;
  btnAddDisabled: boolean;
  btnDisabled: boolean = false;
  componenteTotalBackup: number;
  fechObs: any;
    onNavChangeNTP(changeEvent: NgbNavChangeEvent) {

  }

  lsMedicamentos: any = [];
  items = [];
  numMezclas: number = 0;
  antibioticosDisplayedColumns: string[] = [
    'medicamento',
    'dosis',
    'unidadMedida',
    'rechazar'
  ];
  medicamentosTotal: number = 0;
  antibioticosDataSource = new MatTableDataSource<any>([]);

  noMezcla: boolean = true;
  boton: boolean = true;
  tipoMezcla: any;
  idMezcla: any;
  valorCada: any;
  disabled: boolean = false



  constructor(private cd: ChangeDetectorRef,
    private catalogService: CatalogoService,
    private activatedRoute: ActivatedRoute) {
    super();

  }

  ngAfterViewInit() {
    this.formAbajoNtp.controls['osmolaridad'].disable();
    this.formAbajoNtp.controls['nitrogeno'].disable();
    this.formAbajoNtp.controls['proteinas'].disable();
    this.formAbajoNtp.controls['kcnoproteicas'].disable();
    this.formAbajoNtp.controls['kctotales'].disable();
    this.formAbajoNtp.controls['volumenTotal'].disable();
  }
  ngOnInit(): void {
    this.noMezcla = false;
    this.disabled = true
    //console.log('info del padre ', this.mezclaDetails);
    this.tabs = [];
    this.tabsNTP = [];
    this.tipoMezcla = this.mezclaDetails.tipoMezcla;
    this.idMezcla = this.mezclaDetails.id;
    this.componenteTotal = this.componenteTotal2;
    //this.tabsNTP=this.mezclaDetails.componentes;
    //this.tabsNTP= JSON.parse(JSON.stringify(this.mezclaDetails.componentes));
    this.cargarTablas(true);

    // this.modelNTP.unidadMedida = this.mezclaDetails.medicamento.unidadMedida;
    this.modelNTP.tipoComponente = this.mezclaDetails.tipoComponente
    this.modelNTP.componente = this.mezclaDetails.componente
    this.modelNTP.dosis = this.mezclaDetails.dosis
    this.modelNTP.unidadMedidaNpt = this.mezclaDetails.medicamento.unidadMedida
    this.modelAbajoNtp.osmolaridad = this.mezclaDetails.diluyente.osmolaridad,
    this.modelAbajoNtp.nitrogeno = this.mezclaDetails.diluyente.nitrogeno,
    this.modelAbajoNtp.proteinas = this.mezclaDetails.diluyente.proteinas,
    this.modelAbajoNtp.kcnoproteicas = this.mezclaDetails.diluyente.kcnoproteicas,
    this.modelAbajoNtp.kctotales = this.mezclaDetails.diluyente.kctotales,
    this.modelAbajoNtp.volumenTotal = this.mezclaDetails.diluyente.volumenTotal,
    // this.modelAbajoNtp.diluyente = this.mezclaDetails.diluyente.diluyente;
    // this.modelAbajoNtp.dosis = this.mezclaDetails.diluyente.dosis;
    // this.modelAbajoNtp.unidadMedidaDil = this.mezclaDetails.diluyente.unidadMedida

    this.modelAbajoNtp.fecApl = this.mezclaDetails.fecApl;

    this.modelAbajoNtp.cada = this.mezclaDetails.cada;
    this.modelAbajoNtp.numDosis = this.mezclaDetails.numDosis;
    this.modelViaAdminNtp.viaAdmon = this.mezclaDetails.viaAdmon;
    this.modelViaAdminNtp.tiempoInfusion = this.mezclaDetails.unidadTiempo;
    this.modelViaAdminNtp.velocidadInfusion = this.mezclaDetails.velocidadInfusion;
    this.modelViaAdminNtp.unidadTiempo = this.mezclaDetails.unidadTiempo,
    this.componenteExcluidos = this.mezclaDetails.componenteExcluidos
    //this.componenteExcluidos.push(this.mezclaDetails.componenteExcluidos);

      //this.tabs = this.mezclaDetails.mesesDosis;
      this.tabs = JSON.parse(JSON.stringify(this.mezclaDetails.mesesDosis));
    //console.log("tabs recibidas", this.tabs);
    this.formAbajoNtp.disable();
    this.formNTP.disable();

  }



  // NTP

  lsComponentes = []


  displayedColumns: string[] = [
    'medicamento',
    'dosis',
    'unidadMedida',
    'rechazar'
  ];

  formTipoMezcla = new FormGroup({});
  //panel NTP
  modelNTP: any = {};
  formNTP = new FormGroup({});
  fieldsNTP: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: "col-lg-2 col-md-6",
          key: 'tipoComponente',
          type: 'select',
          props: {
            label: 'Tipo de Componente',
            placeholder: 'Selecciona un tipo',
            required: true,
            valueProp: 'id',
            labelProp: 'desTipoComponente',
            options: []
          },
          hooks: {
            onInit: async (field) => {

              this.catalogService.getTipoComponente()
                .then(
                  (data: any) => {
                    if (data) {
                      this.lsComponentes = data;
                      field.props.options = data;


                    } else
                      this._alertServices.error("<strong>Error</strong> al obtener conceptos de tipoComponente");
                  },
                  (_err) => {
                    this._alertServices.error("<strong>Error</strong> al obtener conceptos de tipoComponente");
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
          className: "col-lg-4 col-md-6",
          key: 'componente',

          type: 'select',
          props: {
            label: 'Componente',
            placeholder: 'Selecciona un componente',
            required: true,
            valueProp: 'id',
            labelProp: 'desCortaMedicamento',
            options: [],

          },
          hooks: {
            afterViewInit: async (field) => {

              const medicamento = field.form.get('tipoComponente');
              if (medicamento != null) {
                medicamento.valueChanges.subscribe((x) => {
                  if (x != null && x != '') {
                    let tipoComponente = this.lsComponentes.find(e => e.id == x);
                    if (tipoComponente != null) {
                      this.catalogService.getMedicamentoByFilter(tipoComponente.id)
                        .then(
                          (data: any) => {
                            if (data) {
                              this.lsMedicamentos = []
                              //console.log(this.componenteExcluidos)
                              this.componenteExcluidos.forEach(element => {
                                const idEliminar = data.findIndex(y => y.id === element.medicamento);
                                if (idEliminar != -1) {
                                  data.splice(idEliminar, 1);
                                }
                              });
                              this.lsMedicamentos = data;
                              //console.log('nueva lista filtrada ',this.lsMedicamentos);
                              field.props.options = this.lsMedicamentos;
                            } else
                              this._alertServices.error("<strong>Error</strong> al obtener conceptos de componente");
                          },
                          (_err) => {
                            this._alertServices.error("<strong>Error</strong> al obtener conceptos de componente");
                          }
                        );
                    }
                  }
                });
              }

              const componente = field.form.get('componente');
              if (componente != null) {
                componente.valueChanges.subscribe((x) => {
                  //console.log("valor de this.lsMedicamentos  ",this.lsMedicamentos);
                  if (x != null && x != '') {
                    let componente = this.lsMedicamentos.find(e => e.id == x);
                    if (componente != null) {
                      field.form.get('unidadMedidaNpt').setValue(componente.refUnidadMinMedida);
                    }
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
          key: 'dosis',
          type: 'input-mask',
          props: {
            label: 'Dosis',
            placeholder: 'Ingresa la dosis',
            appInputMaskType: 'integer',
            maxLength:6,

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
          key: 'unidadMedidaNpt',
          type: 'input',// 'input-mask',
          props: {
            label: 'Unidad de medida',
            placeholder: '-------------',
            disabled: true
          },
        },
        {
          className: 'col-lg-2 col-md-6',
          key:'btnAdd',
          type: 'button',
          props: {
            label: ' ',
            text: 'Agregar componente',
            onClick: (to, $event, field) => {
              if (this.formNTP.valid) {
                this.agregarMedicamento();
                this.eliminarMedicamento(this.modelNTP.componente);
              }
            },
            classBtn: 'btn-ico estilo-btn',
            btnType: 'outline-basic',
            icon: 'agregar'
          },
          expressionProperties: {
            'props.disabled': (model: any) => {
                if (this.btnAddDisabled == true ) {
                    return true
                }else {
                  return false
                }
                
            },
         },
        },

      ]
    },



  ]

  //panel de abajo
  modelAbajoNtp: any = {};
  formAbajoNtp = new FormGroup({});
  fieldsAbajoNtp: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: "col-lg-2 col-md-6",
          key: 'osmolaridad',

          type: 'input-mask',
          props: {
            label: 'Osmolaridad (mOsmol/ml)',
            placeholder: '00',
            appInputMaskType: 'integer',
            maxLength: 5,
            //disabled: true,

          },
        },
        {
          className: "col-lg-2 col-md-6",
          key: 'nitrogeno',

          type: 'input-mask',
          props: {
            label: 'Nitrógeno (gr)',
            //disabled: true,
            placeholder: '00',
            appInputMaskType: 'integer',
            maxLength: 5,
          },
        },
        {
          className: "col-lg-2 col-md-6",
          key: 'proteinas',

          type: 'input-mask',
          props: {
            label: 'Proteínas (gr)',
            //disabled: true,
            placeholder: '00',
            appInputMaskType: 'integer',
            maxLength: 5,
          },
        },
        {
          className: "col-lg-2 col-md-6",
          key: 'kcnoproteicas',

          type: 'input-mask',
          props: {
            label: 'Kcal no proteicas (Kcal)',
            //disabled: true,
            placeholder: '00',
            appInputMaskType: 'integer',
            maxLength: 5,
          },
        },
        {
          className: "col-lg-2 col-md-6",
          key: 'kctotales',

          type: 'input-mask',
          props: {
            label: 'Kcal totales (Kcal)',
            //disabled: true,
            placeholder: '00',
            appInputMaskType: 'integer',
            maxLength: 5,
          },
        },
        {
          className: "col-lg-2 col-md-6",
          key: 'volumenTotal',

          type: 'input-mask',
          props: {
            label: 'Volumen total (ml)',
            //disabled: true,
            placeholder: '00',
            appInputMaskType: 'integer',
            maxLength: 5,
          },
        },


      ]

    },
    // {
    //   fieldGroupClassName: 'row',
    //   fieldGroup: [
    //     {
    //       className: "col-lg-8 col-md-6",
    //       key: 'diluyente',
    //       type: 'select',

    //       props: {
    //         label: 'Diluyente',
    //         required: true,
    //         placeholder: 'Selecciona el diluyente',
    //         valueProp: 'id',
    //         labelProp: 'desCortaDiluyente',

    //         options: [],
    //       },
    //       hooks: {
    //         afterViewInit: async (field) => {
    //           this.catalogService.getDiluyentes()
    //             .then(
    //               (data: any) => {
    //                 if (data) {
    //                   this.listDiluyente = data
    //                   field.props.options = data;
    //                 } else
    //                   this._alertServices.error("<strong>Error</strong> al obtener conceptos de Diluyente");
    //               },
    //               (_err) => {
    //                 this._alertServices.error("<strong>Error</strong> al obtener conceptos de Diluyente");
    //               }
    //             );
    //         },
    //         onInit: async (field) => {

    //           const medicamento = field.form.get('diluyente');
    //           if (medicamento != null) {
    //             medicamento.valueChanges.subscribe((x) => {
    //               if (x != null && x != '') {
    //                 let diluyente = this.listDiluyente.find(e => e.id == x);
    //                 if (diluyente.refUnidadMinMedida != null) {
    //                   field.form.get('unidadMedidaDil').setValue(diluyente.refUnidadMinMedida);
    //                 }
    //               }
    //             });

    //           }

    //         },
    //       },
    //       expressionProperties: {
    //         'props.disabled': (model: any) => {
    //           if (this.disabled) {
    //             return true
    //           } else {
    //             return false
    //           }

    //         },
    //       },
    //     },
    //     {
    //       className: "col-lg-2 col-md-6",
    //       key: 'dosis',

    //       type: 'input-mask',
    //       props: {
    //         label: 'Dosis',
    //         placeholder: 'Ingresa la dosis',
    //         required: true,
    //         appInputMaskType: 'integer',
    //         maxLength: 6,

    //       },
    //       expressionProperties: {
    //         'props.disabled': (model: any) => {
    //           if (this.disabled) {
    //             return true
    //           } else {
    //             return false
    //           }

    //         },
    //       },
    //     },
    //     {
    //       className: "col-lg-2 col-md-6",
    //       key: 'unidadMedidaDil',

    //       type: 'input',
    //       props: {
    //         label: 'Unidad de medida',
    //         placeholder: '-------------',
    //         disabled: true,
    //         maxLength: 5
    //       },
    //     },


    //   ]
    // },
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
                    this.formAbajoNtp.controls['numDosis'].setValue(this.dosisTotales);


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

          type: 'input-mask',
          props: {
            label: 'Número total de dosis',
            placeholder: '-------------',
            disabled: true,
            appInputMaskType: 'integer',
            maxLength: 2,
          },
          hooks: {

            onInit: async (field) => {
              const cada = field.form.get('cada');
              this.dosisTotales = 0;

              if (cada != null) {
                //listener cuando cambia
                cada.valueChanges.subscribe((x) => {
                  if (x != null && x != '') {
                    this.valorCada = x
                    this.calculoDosis(this.valorCada)
                    field.formControl.setValue(this.dosisTotales);

                  }

                });
              }
            }



          }


        },



      ]
    },
  ]

  //panel viad administracion
  modelViaAdminNtp: any = {};
  formViaAdminNtp = new FormGroup({});
  fieldsViaAdminNtp: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: "col-lg-4 col-md-6",
          key: 'viaAdmon',
          type: 'select',
          props: {
            label: 'Vía de administración',
            placeholder: 'Selecciona la vía de administración',
            required: true,
            options: [],
            valueProp: 'id',
            labelProp: 'desViaAdministracion',
          },
          hooks: {
            onInit: async (field) => {
              this.catalogService.getViaAdmon(2)
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
        {
          className: "col-md-2",
          key: 'unidadTiempo',
          type: 'select',
          props: {
            label: 'Tiempo de infusión',
            placeholder: 'Selecciona el tiempo',
            required: true,
            options: [],
            valueProp: 'id',
            labelProp: 'desTiempoInfusion',
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
          key: 'velocidadInfusion',
          type: 'input',
          props: {
            label: 'Velocidad de infusión (ml/hrs.)',
            placeholder: 'Ingresa la velocidad',
            required: true,
            maxLength: 15
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
          //  validators: {
          //   validation: [alphaNumber],
          // },

        }
      ]
    },

  ]








  rechazarNtp(element, tabId) {

    const dialogRef = this._dialog.open(
      DialogComponent,
      this._dialogService.modalGenerico('Eliminar componente','¿Deseas eliminar este componente de la mezcla?',null,'Eliminar componente')
    );

    dialogRef.afterClosed().subscribe(
      async data => {
        if (data == true) {
          this.eliminarComponente(element,data, tabId)
        }
      }
    );

  }

  eliminarComponente(element, data, tabId){
    let tabElement = this.tabsNTP.find(e => e.id == tabId);

    const index = tabElement.data.data.findIndex((e) => e.idMedicamento === element.idMedicamento);
    tabElement.data.data.splice(index, 1);

    const indexCom = this.componenteExcluidos.findIndex((e) => e.medicamento === element.idMedicamento);
    this.componenteExcluidos.splice(indexCom, 1);

    tabElement.data = new MatTableDataSource<any>(tabElement.data.data);
    tabElement.counter = tabElement.data.data.length;
    this.componenteTotal = this.componenteTotal - 1

    if (this.componenteTotal >= 50) {
      this.btnAddDisabled = true

    }else{
      this.btnAddDisabled = false
    }

    this.formNTP.reset(); // Esto restablecerá el estado del formulario
    //this.modelNTP = {};
  }
  agregarMedicamento() {

    if (this.formNTP.valid) {

      let itemComponent = this.lsMedicamentos.find(e => e.id == this.modelNTP.componente);


      let newRow = {
        'idMedicamento': itemComponent.id,
        'medicamento': itemComponent.desCortaMedicamento,
        //'cveMedicamento': this.model2.cveMedicamento,
        'dosis': this.modelNTP.dosis,
        'unidadMedida': this.modelNTP.unidadMedidaNpt

      }
      //console.log(newRow);

      let tabElement = this.tabsNTP.find(e => e.id == this.modelNTP.tipoComponente);
      const newData = [...tabElement.data.data];
      newData.push(newRow);
      tabElement.data.data = newData;
      tabElement.counter = tabElement.data.data.length;

      //console.log("datasource data", tabElement.data.data);

      this.componenteTotal = 1 + this.componenteTotal;

      if (this.componenteTotal >= 50) {
        this.btnAddDisabled = true

      }else{
        this.btnAddDisabled = false
      }

      /*
            // calculos
            this.dosisCalc = this.dosisCalc + Number(dosis);
            //setting values
            this.modelAbajoAnti = {
              ...this.modelAbajoAnti,
              numDosis: this.dosisCalc
            }*/


    } else {

      const formValidar = [this.formNTP];
      this.validaCamposFormulario(formValidar);
      this._alertServices.errorCamposObligatorios();
    }

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

    this.color = event;

    let elementMes = this.tabs.find((e) => e.nombreMes === item.nombreMes && e.nombreAnio == item.nombreAnio);
    let elementDia = elementMes.dias.find((e) => e.nombreMes === item.nombreMes && e.nombreAnio == item.nombreAnio && e.nombreDia == item.nombreDia);
    elementDia.check = event;
    //console.log(this.tipoMezcla)
    this.calculoDosis(this.valorCada)
    this.formAbajoNtp.controls['numDosis'].setValue(this.dosisTotales);

    this.actualizarSeleccionTodo();
    //console.log("tabs", this.tabs);
  }
  editarMezcla() {

    this.onDisabledSend.emit(!this.saveEdicion);
    this.canceEdicion = true
    this.editar = false
    this.saveEdicion = true
    this.disabledEliminar = true

    //console.log(this.formNTP)
    //console.log(this.formAbajoNtp)
    //console.log(this.formViaAdminNtp)
    this.formNTP.controls['dosis'].enable();
    this.formNTP.controls['componente'].enable();
    this.formNTP.controls['tipoComponente'].enable();
    this.formAbajoNtp.controls['cada'].enable();

    this.formAbajoNtp.controls['osmolaridad'].enable();
    this.formAbajoNtp.controls['nitrogeno'].enable();
    this.formAbajoNtp.controls['proteinas'].enable();
    this.formAbajoNtp.controls['kcnoproteicas'].enable();
    this.formAbajoNtp.controls['kctotales'].enable();
    this.formAbajoNtp.controls['volumenTotal'].enable();
    
    // this.formAbajoNtp.controls['dosis'].enable();
    this.formAbajoNtp.controls['fecApl'].enable();
    // this.formAbajoNtp.controls['diluyente'].enable();
    this.formViaAdminNtp.controls['unidadTiempo'].enable();
    this.formViaAdminNtp.controls['viaAdmon'].enable();
    this.formViaAdminNtp.controls['velocidadInfusion'].enable();
    this.isDisabled = !this.isDisabled;

    
    if (this.componenteTotal >= 50) {
      this.btnAddDisabled = true

    }else{
      this.btnAddDisabled = false
    }

    this.formNTP.reset();
    // this.form.enable();
    // this.formAbajoAnti.enable();
    // this.formViaAdmin.enable();

    //Respaldamos info 
    this.backupInfo();
  }
  backupInfo() {

    this.tabsBackup = [];
    this.tabsNTPBackup = [];

    for (let index = 0; index < this.mezclaDetails.componentes.length; index++) {
      const element = this.mezclaDetails.componentes[index];
      let data = JSON.parse(JSON.stringify(element.data?.data));
      let aminoAcidosDataSource = new MatTableDataSource<any>(data);
      let compData = {
        nombre: element.nombre,
        counter: element.counter,
        id: element.id,
        data: aminoAcidosDataSource,
        active: false,

        displayCols: this.displayedColumns,
      }

      this.tabsNTPBackup.push(compData)

    }
    //console.log("tabsNTPBackup respaldadas", this.tabsNTPBackup);

    this.tabsBackup = JSON.parse(JSON.stringify(this.tabs));


    //console.log("tabs Backup", this.tabsBackup);

    this.seleccionarTodosBackup = this.seleccionarTodos;

    this.viaAdminBackup = this.modelViaAdminNtp.viaAdmon;
    this.tiempoInfusionBackup = this.modelViaAdminNtp.tiempoInfusion;
    this.velocidadInfusionBackup = this.modelViaAdminNtp.velocidadInfusion;
    this.cadaBackup = this.modelAbajoNtp.cada;
    this.numTotalDosisBackup = this.modelAbajoNtp.numDosis;
    this.fechaAplBackup = this.mezclaDetails.fecApl;
    // this.diluyenteBackup = this.modelAbajoNtp.diluyente;

    this.osmolaridadBackup = this.mezclaDetails.diluyente.osmolaridad,
    this.nitrogenoBackup = this.mezclaDetails.diluyente.nitrogeno,
    this.proteinasBackup = this.mezclaDetails.diluyente.proteinas,
    this.proteinasBackup = this.mezclaDetails.diluyente.kcnoproteicas,
    this.kctotalesBackup = this.mezclaDetails.diluyente.kctotales,
    this.volumenTotalBackup = this.mezclaDetails.diluyente.volumenTotal
    this.componenteTotalBackup = this.componenteTotal

  }
  restoreInfo() {

    this.tabsNTP = [];
    for (let index = 0; index < this.tabsNTPBackup.length; index++) {
      const element = this.tabsNTPBackup[index];
      let data = JSON.parse(JSON.stringify(element.data?.data));
      let aminoAcidosDataSource = new MatTableDataSource<any>(data);
      let compData = {
        nombre: element.nombre,
        counter: element.counter,
        id: element.id,
        data: aminoAcidosDataSource,
        active: false,

        displayCols: this.displayedColumns,
      }

      this.tabsNTP.push(compData)

    }
    
    this.tabs = JSON.parse(JSON.stringify(this.tabsBackup));

    //console.log("restore info de meses", this.tabs);
    this.seleccionarTodos = this.seleccionarTodosBackup;//pendiente ver que regrese el check de todos a como estaba..

    this.modelViaAdminNtp = {
      ...this.modelViaAdminNtp,
      viaAdmon: this.viaAdminBackup,
      tiempoInfusion: this.tiempoInfusionBackup,
      velocidadInfusion: this.velocidadInfusionBackup,
    }

    this.modelAbajoNtp = {
      ...this.modelAbajoNtp,

      osmolaridad: this.osmolaridadBackup,
      nitrogeno: this.nitrogenoBackup,
      proteinas: this.proteinasBackup,
      kcnoproteicas: this.proteinasBackup,
      kctotales: this.kctotalesBackup,
      volumenTotal: this.volumenTotalBackup,
      cada: this.cadaBackup,
      numDosis: this.numTotalDosisBackup,
      fecApl: this.fechaAplBackup,
      diluyente: this.diluyenteBackup,
    }

    this.componenteTotal =  this.componenteTotalBackup;

    //this.modelAbajoAnti.fecApl = this.mezclaDetails.fecApl;
    let fecha = {
      startDate: moment(this.mezclaDetails.fecApl.startDate, 'DD-MM-YYYY').format("YYYY-MM-DD"),
      endDate: moment(this.mezclaDetails.fecApl.endDate, 'DD-MM-YYYY').format("YYYY-MM-DD"),
    }
    //this.modelAbajoAnti.fecApl = fecha;
    this.fechObs.next(fecha)

    this.cd.detectChanges();


  }
  eliminar(id) {
    //pendiente implementar el borrado

    const index = this.items.findIndex((e) => e.id === id);
    this.items.splice(index, 1);

    this.cd.detectChanges();

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
    this.cd.detectChanges();
  }

  dialogo() {
    const dialogRef = this._dialog.open(
      DialogComponent,
      this._dialogService.cancelar()
    );

    dialogRef.afterClosed().subscribe(
      async data => {
        if (data == true) {

        }
      }
    );
  }


  guardarEdicion() {

    if (this.formAbajoNtp.valid && this.formTipoMezcla.valid && this.formViaAdminNtp.valid && this.componenteTotal > 0) {
      let mensaje = "¿Deseas guardar los cambios realizados en la <b>"+this.mezclaName+"</b> ?"
      const dialogRef = this._dialog.open(
        DialogComponent,
        this._dialogService.modalGenerico("Guardar cambios", mensaje, null, "Guardar cambios")
      );
  
      dialogRef.afterClosed().subscribe(
        async data => {
          if (data == true) {
            let mezclaDetailUpdate;
            this.onDisabledSend.emit(!this.saveEdicion);
            let nvoDiluyente = {
              osmolaridad: this.modelAbajoNtp.osmolaridad,
              nitrogeno: this.modelAbajoNtp.nitrogeno,
              proteinas: this.modelAbajoNtp.proteinas,
              kcnoproteicas: this.modelAbajoNtp.kcnoproteicas,
              kctotales: this.modelAbajoNtp.kctotales,
              volumenTotal: this.modelAbajoNtp.volumenTotal,
              // diluyente: this.modelAbajoNtp.diluyente,
              // dosis: this.modelAbajoNtp.dosis,
              // unidadMedida: this.modelAbajoNtp.unidadMedidaDil
            }
        
            mezclaDetailUpdate = {
              id: this.mezclaDetails.id,
              operacion: 'update',
              tipoMezcla: this.mezclaDetails.tipoMezcla,
        
              componentes: this.tabsNTP,// se quito la tabla ahora es solo uno
              diluyente: nvoDiluyente,
              fecApl: this.modelAbajoNtp.fecApl,
              cada: this.modelAbajoNtp.cada,
              numDosis: this.modelAbajoNtp.numDosis,
              viaAdmon: this.modelViaAdminNtp.viaAdmon,
              tiempoInfusion: this.modelViaAdminNtp.unidadTiempo,
              velocidadInfusion: this.modelViaAdminNtp.velocidadInfusion,
              unidadTiempo: this.modelViaAdminNtp.unidadTiempo,
              mesesDosis: this.tabs
            }
        
        
            this.onSelected.emit(mezclaDetailUpdate);
            this.canceEdicion = false
            this.editar = true
            this.saveEdicion = false
            this.disabledEliminar = true
            this.disabled = true
        
            this.formNTP.controls['dosis'].disable();
            this.formNTP.controls['componente'].disable();
            this.formNTP.controls['tipoComponente'].disable();
            this.formAbajoNtp.controls['cada'].disable();
        
            this.formAbajoNtp.controls['osmolaridad'].disable();
            this.formAbajoNtp.controls['nitrogeno'].disable();
            this.formAbajoNtp.controls['proteinas'].disable();
            this.formAbajoNtp.controls['kcnoproteicas'].disable();
            this.formAbajoNtp.controls['kctotales'].disable();
            this.formAbajoNtp.controls['volumenTotal'].disable();
        
            // this.formAbajoNtp.controls['diluyente'].disable();
            // this.formAbajoNtp.controls['dosis'].disable();
            this.formAbajoNtp.controls['fecApl'].disable();
            this.formViaAdminNtp.controls['unidadTiempo'].disable();
            this.formViaAdminNtp.controls['viaAdmon'].disable();
            this.formViaAdminNtp.controls['velocidadInfusion'].disable();
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

  calculoDosis(element) {


    const cadaVal = this.cadaLst.find((e) => e.id === element);
    if (cadaVal != null) {
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
  }

  cargarTablas(primeraVez: boolean) {


    //console.log('cargando tables')
    if (primeraVez) {
      this.tabsNTP = [];
      for (let index = 0; index < this.mezclaDetails.componentes.length; index++) {
        const element = this.mezclaDetails.componentes[index];

        let aminoAcidosDataSource = new MatTableDataSource<any>(element.data?.data ? element.data?.data : element.data?.filteredData);
        let compData = {
          nombre: element.nombre,
          counter: element.counter,
          id: element.id,
          data: aminoAcidosDataSource,
          active: false,

          displayCols: this.displayedColumns,
        }

        this.tabsNTP.push(compData)

      }
      //console.log("tabsNTP cargadas primera vez", this.tabsNTP);

    }
    //console.log("tabsNTP cargadas primera vez", this.tabsNTP);
    /*for (let index = 0; index < this.tabsNTP.length; index++) {
      let element = this.tabsNTP[index];
      element.data= new MatTableDataSource<any>([]);
      element.counter=0;
      
    }*/



  }
  cancelarEdicion() {

    this.onDisabledSend.emit(!this.saveEdicion);
    this.canceEdicion = false
    this.editar = true
    this.saveEdicion = false


    this.formNTP.controls['dosis'].disable();
    this.formNTP.controls['componente'].disable();
    this.formNTP.controls['tipoComponente'].disable();
    this.formAbajoNtp.controls['cada'].disable();
    // this.formAbajoNtp.controls['diluyente'].disable();
    // this.formAbajoNtp.controls['dosis'].disable();
    this.formAbajoNtp.controls['fecApl'].disable();
    this.formViaAdminNtp.controls['unidadTiempo'].disable();
    this.formViaAdminNtp.controls['viaAdmon'].disable();
    this.formViaAdminNtp.controls['velocidadInfusion'].disable();

    this.formAbajoNtp.controls['osmolaridad'].disable();
    this.formAbajoNtp.controls['nitrogeno'].disable();
    this.formAbajoNtp.controls['proteinas'].disable();
    this.formAbajoNtp.controls['kcnoproteicas'].disable();
    this.formAbajoNtp.controls['kctotales'].disable();
    this.formAbajoNtp.controls['volumenTotal'].disable();

    this.isDisabled = !this.isDisabled;

    
    if (this.componenteTotal >= 50) {
      this.btnAddDisabled = true

    }else{
      this.btnAddDisabled = false
    }

    this.formNTP.reset();
    // this.form.enable();
    // this.formAbajoAnti.enable();
    // this.formViaAdmin.enable();
    //Restore info 
    this.restoreInfo();
  }

  eliminarMedicamento(medicamento: any) {
    let list ={
      medicamento
    }    
    this.componenteExcluidos.push(list);

      this.lsMedicamentos = [];
    

    const selectField = this.fieldsNTP.reduce((foundField, groupField) => {
      // Buscar dentro de cada grupo de campos
      if (groupField.fieldGroup) {
        const selectFieldInGroup = groupField.fieldGroup.find(field => field.key === 'componente');
        if (selectFieldInGroup) {
          foundField = selectFieldInGroup;
        }
      }
      return foundField;
    }, undefined);

    if (selectField) {
      selectField.props.options = [];
      this.modelNTP.componente = null;
      this.modelNTP.dosis = null;
      this.formNTP.reset();
    }
  }
}



