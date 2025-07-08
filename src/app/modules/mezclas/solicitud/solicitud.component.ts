import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TituloComponent } from 'src/app/shared/layout/frames/titulo/titulo.component';
import { CatalogoService } from 'src/app/shared/services/catalogo.service';

import { SharedModule } from 'src/app/shared/shared.module';
import { GeneralComponent } from '../../general/general.component';
import { DetalleMezclaComponent } from '../detalle-mezcla/detalle-mezcla.component';
import { DatosPacienteComponent } from "../datos-paciente/datos-paciente.component";
import { NoMedicamentoComponent } from "../../../shared/layout/no-medicamento/no-medicamento.component";
import { NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { ActivatedRoute } from '@angular/router';
import { SessionStorageService } from '../../login/services/session-storage.service';
import { DetalleMezclaNTPComponent } from '../detalle-mezcla-ntp/detalle-mezcla-ntp.component';
import { MezclasService } from 'src/app/shared/services/mezclas.service';
import { HeaderDetalleMezclaComponent } from 'src/app/shared/layout/header-detalle-mezcla/header-detalle-mezcla.component';
import { Sort } from '@angular/material/sort';
import { SeguimientoService } from 'src/app/shared/services/seguimiento.service';
import { NAV } from 'src/app/shared/config/global';
import { Subject } from 'rxjs';
import * as CircularJSON from 'circular-json';
import { Perfil, desPerfil, eventoBitacora } from 'src/app/shared/general.enum';
import { AuthService } from '../../login/services/auth.service';

const DATA_MEZCLAS_AGREGADAS = 'mezclas-agregadas'

@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.component.html',
  standalone: true,
  styleUrls: ['./solicitud.component.scss'],
  imports: [
    CommonModule,
    SharedModule,
    DetalleMezclaComponent,
    NoMedicamentoComponent,
    DetalleMezclaNTPComponent,
    HeaderDetalleMezclaComponent
  ]
})
export class SolicitudComponent extends GeneralComponent implements OnInit {

  dosisTotales: number = 0;
  cadaLst: any;
  seleccionarTodos: any;
  public minDate = moment(new Date()).format('YYYY-MM-DD');
  //public maxdate = moment(this.minDate, 'YYYY-MM-DD').add(29, 'days').format('YYYY-MM-DD');
  fechasToAplDosis = [];
  meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  tabs = [];
  tabsNTP = [];
  counterNTP = this.tabsNTP.length + 1;
  counter = this.tabs.length + 1;
  active = 0;
  destipoMezcla: any;
  color: boolean = false;
  listMezclaCat: any;
  listDiluyente: any;
  ruta: any;
  lsTipoComponente: any;
  tipoComponenteId: any = 0;
  paginaActual: number = 1;
  valorCada: any
  fecAplicacion: any = [];
  lstMedicamentos: any = [];
  componenteTotal: number = 0;
  fechaUrl: string;
  btnDisabled: boolean = false;
  btnAddDisabled: boolean = false;
  componenteExcluidos: any = [];
  disabledSend: any;
  tipoMezclaDS: any;
  DatosDuplicar: any;
  DatosDuplicarTipoM: any;
  listaMezclasAgregadas: any;
  observableData = new Subject<any>();//declaracion observable
  calculoIMC: number = 0;
  onNavChange(changeEvent: NgbNavChangeEvent) {

  }
  onNavChangeNTP(changeEvent: NgbNavChangeEvent) {

  }

  sessionStorageService = inject(SessionStorageService)
  loginUrl = this.sessionStorageService.getLoginUrl();


  headerData = {
    uno: [
      {
        class: 'col-lg-3',
        titulo: 'Paciente',
        texto: this.loginUrl?.PAC_NOMBRE + ' ' + this.loginUrl?.PAC_APAT + ' ' + this.loginUrl?.PAC_AMAT
      },
      {
        class: 'col-lg-6',
        titulo: 'Diagnóstico',
        isDiagnostico: true,
        texto: this.loginUrl?.diagnostico,
      },
      {
        class: 'col-lg-2',
        texto: 'Prescripción de mezcla'
      },
    ],
    dos: [
      {
        class: 'col-lg-3',
        colorClass: 'yellow',
        iconName: 'yellow-h.svg',
        informacion: [
          {
            separador: false,
            titulo: 'Edad',
            texto: this.loginUrl.PAC_CURP != '' ? this.calculaEdad(this.obtenerFechaDeNacimiento(this.loginUrl.PAC_CURP)) + ' Años' : '',
          },
          {
            separador: true,
            titulo: 'Sexo',
            texto: this.loginUrl?.sexo,
          },
        ]

      },
      {
        class: 'col-lg-6',
        colorClass: 'green',
        iconName: 'green-h.svg',
        informacion: [
          {
            separador: false,
            titulo: 'NSS',
            texto: this.loginUrl?.PAC_NSS,
          },
          {
            separador: true,
            titulo: 'A. Médico',
            texto: this.loginUrl?.PAC_AMEDICO,
          },
          {
            separador: true,
            titulo: 'U. de Adscripción',
            texto: this.loginUrl?.unidad_ascripcion_desc == 'SR' ? '' : this.loginUrl?.unidad_ascripcion_desc,
          },
        ]

      },
      {
        class: 'col-lg-3',
        colorClass: 'blue',
        iconName: 'info-h.svg',
        informacion: [
          {
            separador: false,
            titulo: 'CURP',
            texto: this.loginUrl?.PAC_CURP,
          },
        ]

      },

    ]
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


  constructor(private cd: ChangeDetectorRef,
    private catalogService: CatalogoService,
    private activatedRoute: ActivatedRoute,
    private mezclasService: MezclasService,
    public authService: AuthService) {
    super();
  }

  ngAfterViewInit() {
    this.DatosDuplicar = this._sesionStorage.getDuplicadoSolicitudData();

    if (this.DatosDuplicar) {

      this.DatosDuplicarTipoM = this._sesionStorage.getDataDuplicadoSolicitud();

      //se deserializa objeto para su consumo
      this.listaMezclasAgregadas = CircularJSON.parse(this._sesionStorage.getDataMezclasAgregadas());
      //console.log('obeto deserializado 2 ',this.listaMezclasAgregadas);

      this.modelTipoMezcla = { ...this._sesionStorage.getModelTipoMezcla() }
      //console.log('get datoss para duplicar XD --> ', this.DatosDuplicar);

      this.llenaModelosDuplicar(this.DatosDuplicar);

      if (this.listaMezclasAgregadas) {
        this.items = this.listaMezclasAgregadas;
      }

    } else {
      this._sesionStorage.setDataMezclasAgregadas(null);
      this.items = [];
    }

  }

  ngOnInit(): void {
    this.noMezcla = false;
    this.mezclasService.getUsuario(this.loginUrl.medico_mat, this.loginUrl.medico_nombre, this.loginUrl.medico_apaterno, this.loginUrl.medico_amaterno, this.loginUrl.medico_cedula, Perfil.MEDICO).then(
      (respuesta) => {
        if (respuesta != null) {
          //se integra evento bitacora en inicio de sesion 
          let model = {
            "idEvento": eventoBitacora.LOGIN_EXITOSO_PHEDS_PRESCRIPCION,
            "cveUsuario": respuesta.id,
            "refNombreUsuario": this.loginUrl.medico_nombre + ' ' + this.loginUrl.medico_apaterno + ' ' + this.loginUrl.medico_amaterno,
            "refPerfilUsuario": desPerfil.MEDICO
          }
          this.authService.eventoBitacora(model)
        }
      }
    )
  }

  modelTipoMezcla: any = {};
  formTipoMezcla = new FormGroup({});
  fieldsTipoMezcla: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: "col-lg-4 col-md-6",
          key: 'tipoMezcla',
          type: 'selectModal',
          props: {
            label: 'Tipo de mezcla estéril',
            required: true,
            placeholder: 'Selecciona el tipo de mezcla',
            options: [],
            valueProp: 'id',
            labelProp: 'desTipoMezcla',
            dataModal: { titulo: 'Modificar tipo de mezcla', mensaje: '¿Deseas modificar el tipo de mezcla? <br>  <b> La información previamente ingresada se perderá. </b>', textOk: 'Modificar tipo', textCancel: 'textp btn cancelar' },
            optInicial: this.observableData
          },

          hooks: {
            afterContentInit: async (field) => {
              const datePart = this.loginUrl?.nota_fechahora.split(' ')[0];

              const parts = datePart.replace(/\//g, '-').split('-'); // Dividir la cadena por el guion
              const invertedDate = parts[2] + '-' + parts[1] + '-' + parts[0];
              this.fechaUrl = invertedDate;

              let model = {
                "numFolio": this.loginUrl?.nota_folio,
                "refAnio": this.loginUrl?.nota_anio,
                "cvePartidaPresupuestal": this.loginUrl?.unidad_cvepresup,
                "numTipoSolicitud": this.loginUrl?.nota_tipo,
                "numConsecutivo": this.loginUrl?.nota_consecutivo,
                "stpNotaMedica": this.fechaUrl,
              }

              this.mezclasService.validaTipoMezclaFlag(model)
                .then(
                  (data: any) => {
                    if (data) {
                      this.listMezclaCat = data

                      const indiceAEliminar = data.findIndex(objeto => objeto.id === 1);
                      if (indiceAEliminar !== -1) {
                        data.splice(indiceAEliminar, 1);
                      }

                      if (this.loginUrl?.ORIGEN == 'ECE') {
                        const indiceAEliminar = data.findIndex(objeto => objeto.id === 2);
                        if (indiceAEliminar !== -1) {
                          data.splice(indiceAEliminar, 1);
                        }
                      }

                      field.props.options = data;
                      data.forEach(element => {
                        if (element.disabled == true) {
                          this._alertServices.warn("La nota médica ya cuenta con una <strong>solicitud de mezcla esteril " + element.desTipoMezcla + "</strong>");
                        }
                      });

                      if (this.DatosDuplicarTipoM) {
                        this.observableData.next(this.DatosDuplicarTipoM.id)
                      }

                    } else
                      this._alertServices.error("<strong>Error</strong> al obtener conceptos de Tipos Mezcla");
                  },
                  (_err) => {
                    this._alertServices.error("<strong>Error</strong> al obtener conceptos de Tipos Mezcla");
                  }
                );

              if (this.DatosDuplicar == undefined) {
                const tipoMezcla = field.form.get('tipoMezcla');
                if (tipoMezcla != null) {
                  tipoMezcla.valueChanges.subscribe((x) => {
                    if (x != null && x != '' && Number(x)) {
                      this.tipoMezcla = x;
                      this.noMezcla = true;
                    } else {
                      this.tipoMezcla = 0;
                      this.noMezcla = false;
                    }
                  });
                }
              }
            },
            onInit: async (field) => {
              if (this.DatosDuplicar == undefined) {
                const medicamento = field.form.get('tipoMezcla');
                if (medicamento != null) {
                  medicamento.valueChanges.subscribe((x) => {
                    if (x != null && x != '') {
                      let tipoMezcla = this.listMezclaCat.find(e => e.id == x);
                      if (tipoMezcla != null) {
                        this.destipoMezcla = tipoMezcla.desTipoMezcla
                        this.tipoMezclaDS = tipoMezcla
                      }
                    }
                  });

                }
              }

              field.formControl.valueChanges.subscribe((value) => {
                if (value === 'undefined') {
                  this.destipoMezcla = '';
                } else if (this.tipoMezcla != undefined) {
                  if (value === this.tipoMezcla) {
                    // console.log('no limpiar ')
                  } else {
                    //console.log('limpiar ');
                    if (this.tipoMezcla === 3) {
                      this.limpiarCamposANT();
                      this.validaHistoria(value)
                      this._sesionStorage.setDataMezclasAgregadas(null);
                      //localStorage.removeItem(DATA_MEZCLAS_AGREGADAS);
                    } else {
                      this.limpiarCamposNPT();
                      this.validaHistoria(value)
                      this._sesionStorage.setDataMezclasAgregadas(null);
                      //localStorage.removeItem(DATA_MEZCLAS_AGREGADAS);
                    }

                  }
                } else {
                  this.validaHistoria(value)
                }
              });

            },
          },
        },

        {
          className: "col-lg-8 col-md-6",
          key: 'especialidad',
          type: 'select',
          props: {
            label: 'Especialidad',
            placeholder: 'Selecciona la especialidad',
            options: this.catalogService.getEspecialidad(),
            valueProp: 'id',
            labelProp: 'desServicioEspecialidad',
            required: true

          },
          hooks: {
            onInit: async (field) => {
              let id = 1;//Obtenerlo del session

              /* this.catalogService.getEspecialidades()
                 .then(
                   (data: any) => {
                     if (data) {
 
                       field.props.options = data;
                     } else {
 
                       this._alertServices.error("<strong>Error</strong> al obtener conceptos de especialidades");
 
                     }
 
 
                   },
                   (_err) => {
                     this._alertServices.error("<strong>Error</strong> al obtener conceptos de especialidades");
                   }
                 );
 */

            },
          },
        },
        {
          className: "col-lg-2 col-md-6",
          key: 'piso',
          type: 'input-mask',

          props: {
            label: 'Piso',
            placeholder: 'Ingresar el piso',
            required: false,
            appInputMaskType: 'integer',
            maxLength: 2,
            disabled: !(this.loginUrl?.piso == null || this.loginUrl?.piso == "")
          },
          hooks: {
            afterViewInit: async (field) => {
              const piso = this.loginUrl?.piso;
              //console.log(piso)
              field.form.get('piso').setValue(piso);
            },
          },
        },

        {
          className: "col-lg-2 col-md-6",
          key: 'numCama',
          type: 'input-mask',

          props: {
            label: 'Cama',
            placeholder: 'Ingresar el cama',
            required: false,
            appInputMaskType: 'integer',
            maxLength: 4,
            disabled: !(this.loginUrl?.nombre_cama == null || this.loginUrl?.nombre_cama == '')
          },
          hooks: {
            afterViewInit: async (field) => {
              const nombre_cama = this.loginUrl?.nombre_cama;
              //console.log(nombre_cama)
              field.form.get('numCama').setValue(nombre_cama);
            },
          },
        },
        {
          className: "col-lg-2 col-md-6",
          key: 'refPeso',
          //type: 'input-mask',
          type: 'decimal',
          props: {
            label: 'Peso (kg.)',
            placeholder: '000.0',
            required: true,
            maxLength: 5,
            numEnteros: 3,
            numDecimales: 1,
          },
          hooks: {

            onInit: async (field) => {
              const refPeso = field.form.get('refPeso');
              if (refPeso != null) {
                refPeso.valueChanges.subscribe((x) => {
                  if (x != null && x != '') {
                    let refTalla = field.form.get('refTalla');
                    if (refTalla != null) {
                      let tallaValue = refTalla.value;
                      if (tallaValue != null && !isNaN(tallaValue)) {
                        let tallaNumber = parseFloat(tallaValue);
                        let refPesoNumber = parseFloat(x);
                        this.calculoIMC = refPesoNumber / (tallaNumber * tallaNumber);
                        field.form.get('refSuperfCorporal').setValue(this.calculoIMC.toFixed(2));
                      }
                    }
                  }
                });
              }
            }
          },
        },
        {
          className: "col-lg-2 col-md-6",
          key: 'refTalla',
          //type: 'input-mask',
          type: 'decimal',
          props: {
            label: 'Estatura (m.)',
            placeholder: '0.00',
            required: true,
            maxLength: 4,
            numEnteros: 1,
            numDecimales: 2,
          },
          hooks: {
            onInit: async (field) => {
              const refTalla = field.form.get('refTalla');
              if (refTalla != null) {
                refTalla.valueChanges.subscribe((x) => {
                  if (x != null && x != '') {
                    let refPeso = field.form.get('refPeso');
                    if (refPeso != null) {
                      let refPesoValue = refPeso.value;
                      if (refPeso != null && !isNaN(refPesoValue)) {
                        let tallaNumber = parseFloat(x);
                        let refPesoNumber = parseFloat(refPesoValue);
                        this.calculoIMC = refPesoNumber / (tallaNumber * tallaNumber);
                        field.form.get('refSuperfCorporal').setValue(this.calculoIMC.toFixed(2));
                      }
                    }
                  }
                })
              }
            }
          },
        },
        {
          className: "col-lg-2 col-md-6",
          key: 'refSuperfCorporal',
          type: 'numFloat',

          props: {
            label: 'IMC (kg/m²)',
            placeholder: '----',
            required: true,
            appInputMaskType: 'integer',
            disabled: true
          },
          hooks: {

          },
        }



      ]
    }
  ]
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
            placeholder: 'Selecciona un medicamento',
            required: true,
            valueProp: 'id',
            labelProp: 'desCortaMedicamento',
            options: [],

          },
          hooks: {
            afterViewInit: async (field) => {

              this.catalogService.getMedicamentos()
                .then(
                  (data: any) => {
                    if (data) {

                      this.lsMedicamentos = data;
                      field.props.options = data;
                    } else
                      this._alertServices.error("<strong>Error</strong> al obtener conceptos de Medicamentos");
                  },
                  (_err) => {
                    this._alertServices.error("<strong>Error</strong> al obtener conceptos de Medicamentos");
                  }
                );

            },

            onInit: async (field) => {
              const medicamento = field.form.get('medicamento');
              if (medicamento != null) {
                medicamento.valueChanges.subscribe((x) => {
                  if (x != null && x != '') {
                    let medicamentoObj = this.lsMedicamentos.find(e => e.id == x);
                    if (medicamentoObj.refUnidadMinMedida != null) {
                      //se integra validacion de SAIFARMACIA 
                      this.mezclasService.consultaMedicamentoSAI(medicamentoObj.id).then(
                        (data: any) => {
                          if (data) {
                            //console.log('respuesta sai ', data);
                            if (!(data.existencia != null && data.existencia > 0)) {
                              let mensaje = 'El medicamento <b>' + medicamentoObj.desCortaMedicamento + '/' + (medicamentoObj.cveMedicamento == null ? '' : medicamentoObj.cveMedicamento + ' ') + medicamentoObj.refUnidadMinMedida + '</b> no está disponible actualmente para la mezcla solicitada'
                              this._alertServices.warn(mensaje);
                            }

                            field.form.get('unidadMedida').setValue(medicamentoObj.refUnidadMinMedida);
                          }
                        }
                      );
                    }
                  }
                });
              }
            },
          },
        },


        {
          className: "col-lg-2 col-md-6",
          key: 'dosis',
          type: 'decimal',
          props: {
            label: 'Dosis',
            placeholder: 'Ingresar la dosis',
            //appInputMaskType: 'integer',
            maxLength: 11,//2
            numEnteros: 8,
            numDecimales: 2,
            required: true,
          },
        },
        {
          className: "col-lg-2 col-md-6",
          key: 'unidadMedida',
          type: 'input',// 'input-mask',
          props: {
            label: 'Unidad de medida',
            placeholder: '-------------',
            disabled: true,
            maxLength: 5
          }, hooks: {
            afterViewInit: async (field) => {
              field.formControl.setValue(this.lsMedicamentos.refUnidadMinMedida);
            }
          }
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
            afterViewInit: async (field) => {
              this.catalogService.getDiluyentes()
                .then(
                  (data: any) => {
                    if (data) {
                      this.listDiluyente = data
                      field.props.options = data;
                    } else
                      this._alertServices.error("<strong>Error</strong> al obtener conceptos de Diluyente");
                  },
                  (_err) => {
                    this._alertServices.error("<strong>Error</strong> al obtener conceptos de Diluyente");
                  }
                );
            },
            onInit: async (field) => {

              const medicamento = field.form.get('diluyente');
              if (medicamento != null) {
                medicamento.valueChanges.subscribe((x) => {
                  if (x != null && x != '') {
                    let diluyente = this.listDiluyente.find(e => e.id == x);
                    if (diluyente.refUnidadMinMedida != null) {
                      field.form.get('unidadMedidaDil').setValue(diluyente.refUnidadMinMedida);
                    }
                  }
                });

              }

            },
          },
        },
        {
          className: "col-lg-2 col-md-6",
          key: 'dosis',
          type: 'decimal',
          props: {
            label: 'Dosis',
            placeholder: 'Ingresa la dosis',
            required: true,
            maxLength: 11,//2
            numEnteros: 8,
            numDecimales: 2,
          },
        },
        {
          className: "col-lg-2 col-md-6",
          key: 'unidadMedidaDil',

          type: 'input',
          props: {
            label: 'Unidad de medida',
            placeholder: '-------------',
            disabled: true,
            maxLength: 5
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
            //maxDate: this.maxdate
          },
          hooks: {

            onInit: async (field) => {
              const fecApl = field.form.get('fecApl');
              if (fecApl != null) {
                //listener cuando cambia
                fecApl.valueChanges.subscribe((x) => {
                  if (x != null && x != '') {
                    this.tabs = this.getTabsMesDias(x);
                  }
                });
              }
            }

          }
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
                    this.valorCada = x
                    this.calculoDosis(this.valorCada)

                    this.formAbajoAnti.controls['numDosis'].setValue(this.dosisTotales);

                  }

                });
              }







            }
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
          // hooks: {

          //   onInit: async (field) => {
          //     const cada = field.form.get('cada');
          //     this.dosisTotales = 0;

          //     if (cada != null) {
          //       //listener cuando cambia
          //       cada.valueChanges.subscribe((x) => {
          //         if (x != null && x != '') {

          //           const cadaVal = this.cadaLst.find((e) => e.id === x);
          //           let hrs = Number(cadaVal.desAplicacionCada.split(" ", 1));
          //           //console.log("cada >", hrs);

          //           this.dosisTotales = 0;
          //           for (let index = 0; index < this.tabs.length; index++) {
          //             const element = this.tabs[index];
          //             for (let j = 0; j < element.dias.length; j++) {
          //               const dias = element.dias[j];
          //               if (dias.check == true) {
          //                 this.dosisTotales = this.dosisTotales + 24 / hrs;

          //               }

          //             }

          //           }
          //           field.formControl.setValue(this.dosisTotales);

          //         }

          //       });
          //     }
          //   }



          // }


        },



      ]
    },
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
            placeholder: 'Selecciona la vía de administración',
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
        },
        {
          className: "col-md-6 col-lg-2",
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
          //  validators: {
          //   validation: [alphaNumber],
          // },

        }
      ]
    },
  ]
  // NTP

  lsComponentes = []
  /*[{id:1, desc:'1. Aminoácidos'},
                 {id:2, desc:'Fosfato'},
                 {id:3, desc:'Sodio cloruro'},
                 {id:4, desc:'Potasio cloruro'},
                 {id:5, desc:'Glucosa'},
                 {id:6, desc:'Agua destilada'},
                 {id:7, desc:'Magnesio sulfato'},
                 {id:8, desc:'Calcio gluconato'},
                 {id:9, desc:'Oligoelementos'},
                 {id:10, desc:'Lípidos'},
                 {id:11, desc:'Vitaminas'},]*/


  displayedColumns: string[] = [
    'medicamento',
    'dosis',
    'unidadMedida',
    'rechazar'
  ];

  //panel NTP
  modelNTP: any = {};
  formNTP = new FormGroup({});
  fieldsNTP: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          key: 'componenteTotal',
          //defaultValue: this.componenteTotal,
        },
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
                      if (this.DatosDuplicar == undefined) {
                        this.cargarTablas(true);
                      }

                    } else
                      this._alertServices.error("<strong>Error</strong> al obtener conceptos de tipoComponente");
                  },
                  (_err) => {
                    this._alertServices.error("<strong>Error</strong> al obtener conceptos de tipoComponente");
                  }
                );





            }
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
        },

        {
          className: "col-lg-2 col-md-6",
          key: 'dosis',
          type: 'decimal',
          props: {
            label: 'Volumen',
            placeholder: 'Ingresa el volumen',
            maxLength: 11,//2
            numEnteros: 8,
            numDecimales: 2,
            required: true,
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
          key: 'btnAdd',
          type: 'button',
          props: {
            label: ' ',
            text: 'Agregar componente',
            onClick: (to, $event, field) => {
              if (this.formNTP.valid) {
                this.agregarMedicamento(field);
                this.eliminarMedicamento(this.modelNTP.componente);
              }
            },
            classBtn: 'btn-ico estilo-btn',
            btnType: 'outline-basic',
            icon: 'agregar',
          },
          expressionProperties: {
            'props.disabled': (model: any) => {
              if (this.btnAddDisabled == true) {
                return true
              } else {
                return false
              }

            },
          },
        },
      ]
    },



  ]

  eliminarMedicamento(medicamento: any) {
    let list = {
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
            //maxDate: this.maxdate
            numDias: 30

          },
          hooks: {

            onInit: async (field) => {
              const fecApl = field.form.get('fecApl');
              if (fecApl != null) {
                //listener cuando cambia
                fecApl.valueChanges.subscribe((x) => {
                  if (x != null && x != '') {
                    this.tabs = this.getTabsMesDias(x);
                  }
                });
              }
            }

          }
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
                    this.valorCada = x
                    this.calculoDosis(this.valorCada)

                    this.formAbajoNtp.controls['numDosis'].setValue(this.dosisTotales);

                  }

                });
              }







            }
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
          // hooks: {

          //   onInit: async (field) => {
          //     const cada = field.form.get('cada');
          //     this.dosisTotales = 0;

          //     if (cada != null) {
          //       //listener cuando cambia
          //       cada.valueChanges.subscribe((x) => {
          //         if (x != null && x != '') {
          //           this.valorCada = x
          //           this.calculoDosis(this.valorCada)
          //           field.formControl.setValue(this.dosisTotales);

          //         }

          //       });
          //     }
          //   }



          // }


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
        },
        {
          className: "col-md-6 col-lg-2",
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
          //  validators: {
          //   validation: [alphaNumber],
          // },

        }
      ]
    },

  ]

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



  rechazarNtp(element, tabId) {

    const dialogRef = this._dialog.open(
      DialogComponent,
      this._dialogService.modalGenerico('Eliminar componente', '¿Deseas eliminar este componente de la mezcla?', null, 'Eliminar componente')
    );

    dialogRef.afterClosed().subscribe(
      async data => {
        if (data == true) {
          this.eliminarComponente(element, data, tabId)
        }
      }
    );

  }

  eliminarComponente(element, data, tabId) {
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

    } else {
      this.btnAddDisabled = false
    }

    this.formNTP.reset(); // Esto restablecerá el estado del formulario
    this.modelNTP = {};
  }

  agregarMedicamento(field) {

    if (this.formNTP.valid) {
      //console.log('med select list ',this.lsMedicamentos)
      if (this.modelNTP.componente !== undefined) {
        let itemComponent = this.lsMedicamentos.find(e => e.id === this.modelNTP.componente);

        let dosis = this.model.dosis;


        let newRow = {
          'idMedicamento': itemComponent.id,
          'medicamento': itemComponent.desCortaMedicamento,
          //'cveMedicamento': this.model2.cveMedicamento,
          'dosis': this.modelNTP.dosis,
          'unidadMedida': this.modelNTP.unidadMedidaNpt

        }


        let tabElement = this.tabsNTP.find(e => e.id == this.modelNTP.tipoComponente);
        const newData = [...tabElement.data.data];
        newData.push(newRow);
        tabElement.data.data = newData;
        tabElement.counter = tabElement.data.data.length;

        this.componenteTotal = 1 + this.componenteTotal;

        if (this.componenteTotal >= 50) {
          this.btnAddDisabled = true

        } else {
          this.btnAddDisabled = false
        }

        //console.log("datasource data", tabElement.data.data);

        /*
              // calculos
              this.dosisCalc = this.dosisCalc + Number(dosis);
              //setting values
              this.modelAbajoAnti = {
                ...this.modelAbajoAnti,
                numDosis: this.dosisCalc
              }*/

      }

    } else {

      const formValidar = [this.formNTP];
      this.validaCamposFormulario(formValidar);
      this._alertServices.errorCamposObligatorios();
    }

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
    if (this.tipoMezcla == 3) {
      this.formAbajoAnti.controls['numDosis'].setValue(this.dosisTotales);
    }
    if (this.tipoMezcla == 2) {
      this.formAbajoNtp.controls['numDosis'].setValue(this.dosisTotales);
    }

    item.check = event; // Actualizar el estado del elemento individual

    // Actualizar el estado de selección de todos los elementos
    this.actualizarSeleccionTodo();

    //console.log("tabs", this.tabs);

  }

  agregarMezclaAnti() {

    this.numMezclas++;
    let mezclaDetail;

    let meses = JSON.parse(JSON.stringify(this.tabs));
    if (this.modelTipoMezcla.tipoMezcla == 3) {//Mezcla antibiotico
      let nvoMedicamento = {
        medicamento: this.model.medicamento,
        dosis: this.model.dosis,
        unidadMedida: this.model.unidadMedida
      }
      let nvoDiluyente = {
        diluyente: this.modelAbajoAnti.diluyente,
        dosis: this.modelAbajoAnti.dosis,
        unidadMedida: this.modelAbajoAnti.unidadMedidaDil
      }
      mezclaDetail = {
        id: this.numMezclas,
        tipoMezcla: this.modelTipoMezcla.tipoMezcla,
        medicamento: nvoMedicamento,
        diluyente: nvoDiluyente,
        fecApl: this.modelAbajoAnti.fecApl,
        cada: this.modelAbajoAnti.cada,
        numDosis: this.modelAbajoAnti.numDosis,
        viaAdmon: this.modelViaAdmin.viaAdmon,
        tiempoInfusion: this.modelViaAdmin.unidadTiempo,
        velocidadInfusion: this.modelViaAdmin.velocidadInfusion,
        unidadTiempo: this.modelViaAdmin.unidadTiempo,

        mesesDosis: meses
      }

    } else if (this.modelTipoMezcla.tipoMezcla == 2) {//Mezcla NTP

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

      let nvoMedicamento = {
        medicamento: this.modelNTP.componente,
        dosis: this.modelNTP.dosis,
        unidadMedida: this.modelNTP.unidadMedidaNpt
      }

      // mezclaDetail = {
      //   id: this.numMezclas,
      //   piso: 1,
      //   tipoMezcla: this.modelTipoMezcla.tipoMezcla,
      //   componentes: this.tabsNTP,// se quito la tabla ahora es solo uno
      //   diluyente: nvoDiluyente,
      //   fecApl: this.modelAbajoNtp.fecApl,
      //   cada: this.modelAbajoNtp.cada,
      //   numDosis: this.modelAbajoNtp.numDosis,
      //   viaAdmon: this.modelViaAdminNtp.viaAdmon,
      //   tiempoInfusion: this.modelViaAdminNtp.unidadTiempo,
      //   velocidadInfusion: this.modelViaAdminNtp.velocidadInfusion,
      //   unidadTiempo: this.modelViaAdminNtp.unidadTiempo,
      //   mesesDosis: meses
      // }

      mezclaDetail = {
        tipoComponente: this.modelNTP.tipoComponente,
        componente: this.modelNTP.componente,
        dosis: this.modelNTP.dosis,
        id: this.numMezclas,
        medicamento: nvoMedicamento,
        piso: 1,
        tipoMezcla: this.modelTipoMezcla.tipoMezcla,
        componentes: this.tabsNTP,// se quito la tabla ahora es solo uno
        diluyente: nvoDiluyente,
        fecApl: this.modelAbajoNtp.fecApl,
        cada: this.modelAbajoNtp.cada,
        numDosis: this.modelAbajoNtp.numDosis,
        viaAdmon: this.modelViaAdminNtp.viaAdmon,
        tiempoInfusion: this.modelViaAdminNtp.unidadTiempo,
        velocidadInfusion: this.modelViaAdminNtp.velocidadInfusion,
        unidadTiempo: this.modelViaAdminNtp.unidadTiempo,
        mesesDosis: this.tabs,
        componenteExcluidos: this.componenteExcluidos
      }

    }

    let numeroMezcla = this.items.length + 1

    this.items.push({ id: this.numMezclas, name: "Mezcla " + numeroMezcla, tipoMezcla: this.modelTipoMezcla.tipoMezcla, value: mezclaDetail });

    if (this.modelTipoMezcla.tipoMezcla == 2)
      this.cargarTablas(false);

    this._sesionStorage.setDuplicadoSolicitudData(null);
    this._sesionStorage.setDataDuplicadoSolicitud(null);

    //let serializedItems = flatted.stringify(this.items);
    let serializedObj = CircularJSON.stringify(this.items);

    //console.log('obteto serializado' , serializedObj)

    this._sesionStorage.setDataMezclasAgregadas(serializedObj);

    //let deserializedObject = flatted.parse(serializedItems);
    //console.log('obeto deserializado 1',deserializedObject);
    //console.log('detalle Mezcla Agregada --> ' , this.items)
    //localStorage.setItem(DATA_MEZCLAS_AGREGADAS, JSON.parse(JSON.stringify(this.items)));
    this.cd.detectChanges();
    this.tabs = [];
    this.componenteExcluidos = [];

    this.form.reset();
    this.formAbajoAnti.reset({ fecApl: undefined })
    this.formAbajoNtp.reset();
    this.formViaAdminNtp.reset();
    this.formViaAdmin.reset();
    this.modelAbajoAnti = {};
    this.boton = false;
    this._alertServices.success('<b>La mezcla</b> se agregó.');
    this.componenteExcluidos = [];
    this.componenteTotal = 0;
    this.seleccionTodo = false;
    this.btnAddDisabled = false; // Asignación corregida
    this.formNTP.reset();
    this.modelNTP = {};
  }

  eliminar(id) {
    const index = this.items.findIndex((e) => e.id === id);
    this.items.splice(index, 1);
    if (this.items.length == 0) this.numMezclas = 0;

    let serializedObj = CircularJSON.stringify(this.items);
    //console.log('obteto serializado' , serializedObj)
    this._sesionStorage.setDataMezclasAgregadas(serializedObj);

    this.cd.detectChanges();

  }
  onEditMezclaDetail(mezclaUpdated) {

    let mezclaAct = mezclaUpdated;
    //console.log("Recibiendo mezcla para " + mezclaUpdated.operacion);
    if (mezclaUpdated.operacion == 'delete')
      this.eliminar(mezclaUpdated.id);
    else if (mezclaUpdated.operacion == 'update') {
      //console.log("Mezcla Updated from Chidl", mezclaUpdated);
      this.actualizarItemsMezcla(mezclaUpdated);


    }
  }
  //metodo para actualizar la lista de items de mezcla de la parte de detalle
  actualizarItemsMezcla(mezclaUpdated) {
    //debugger;
    //console.log("items en control", this.items);
    let elementItem = this.items.find(e => e.id == mezclaUpdated.id);
    if (elementItem.tipoMezcla == 3) {//Antibiotico
      elementItem.value.medicamento = mezclaUpdated.medicamento;
      elementItem.value.diluyente = mezclaUpdated.diluyente;
      elementItem.value.mesesDosis = mezclaUpdated.mesesDosis;
      elementItem.value.fecApl = mezclaUpdated.fecApl;
      elementItem.value.cada = mezclaUpdated.cada;
      elementItem.value.numDosis = mezclaUpdated.numDosis;
      elementItem.value.unidadTiempo = mezclaUpdated.unidadTiempo;
      elementItem.value.velocidadInfusion = mezclaUpdated.velocidadInfusion;
      elementItem.value.viaAdmon = mezclaUpdated.viaAdmon;

    }
    else if (elementItem.tipoMezcla == 2)//NTP
    {
      elementItem.value.componentes = mezclaUpdated.componentes;
      elementItem.value.mesesDosis = mezclaUpdated.mesesDosis;
      elementItem.value.cada = mezclaUpdated.cada;
      elementItem.value.diluyente = mezclaUpdated.diluyente;
      elementItem.value.fechApl = mezclaUpdated.fecApl;
      elementItem.value.id = mezclaUpdated.id;
      elementItem.value.tiempoInfusion = mezclaUpdated.tiempoInfusion;
      elementItem.value.unidadTiempo = mezclaUpdated.unidadTiempo;
      elementItem.value.velocidadInfusion = mezclaUpdated.velocidadInfusion;
      elementItem.value.viaAdmon = mezclaUpdated.viaAdmon;

    }

    //console.log("items Actualizado", this.items);
    this._alertServices.success('La información de la mezcla se actualizó.');


  }
  continuar() {
    //console.log(this.items)
    let objeto = []
    let fecAplicacion = []
    for (let i = 0; i < this.items.length; i++) {
      this.fecAplicacion = [];
      for (let j = 0; j < this.items[i].value.mesesDosis.length; j++) {
        for (let k = 0; k < this.items[i].value.mesesDosis[j].dias.length; k++) {
          if (this.items[i].value.mesesDosis[j].dias[k].check == true) {

            let dia = String(this.items[i].value.mesesDosis[j].dias[k].nombreAnio + '-' + this.items[i].value.mesesDosis[j].dias[k].numMes + '-' + this.items[i].value.mesesDosis[j].dias[k].nombreDia)
            //console.log(dia)
            let fechas = {
              fecAplicacionDia: dia,
            }

            this.fecAplicacion.push(fechas)

          }
        }
      }

      this.lstMedicamentos = [];
      if (this.modelTipoMezcla.tipoMezcla == 2) {
        //console.log('componentes ---> ' , this.items[i].value.componentes)
        this.items[i].value.componentes.forEach(element => {
          if (element.data.data) {
            element.data.data.forEach(componente => {
              //console.log('componente tabs ->', componente);
              let componentes = {
                "idMedicamento": componente.idMedicamento,
                "numDosisMedicamento": Number(componente.dosis)
              }
              this.lstMedicamentos.push(componentes)
            });
          } else {
            //console.log(element.data.filteredData)
            element.data.filteredData.forEach(componente => {
              //console.log('componente tabs ->', componente);
              let componentes = {
                "idMedicamento": componente.idMedicamento,
                "numDosisMedicamento": Number(componente.dosis)
              }
              this.lstMedicamentos.push(componentes)
            });
          }
          //console.log('Elemento de componentes tabs ->', element.data.data);

        });
      } else {
        let componentes = {
          "idMedicamento": this.items[i].value.medicamento.medicamento,
          "numDosisMedicamento": Number(this.items[i].value.medicamento.dosis)
        }
        this.lstMedicamentos.push(componentes)
      }

      let lstIdDiluyenteAux = undefined;

      if (this.modelTipoMezcla.tipoMezcla == this.TipoMezcla.ANTIBIOTICO) {
        lstIdDiluyenteAux = [
          {
            "idDiluyente": this.items[i].value.diluyente.diluyente,
            "numDosisDiluyente": Number(this.items[i].value.diluyente.dosis)
          }
        ]
      }


      let modelMezclasOps = {
        "lstMedicamentos": this.lstMedicamentos,
        "lstFechasAplicacion": this.fecAplicacion,
        "fecInicioAplicacion": this.items[i].value.fecApl.startDate,
        "fecFinAplicacion": this.items[i].value.fecApl.endDate,
        "idAplicacionCada": this.items[i].value.cada,
        "lstIdDiluyente": lstIdDiluyenteAux,
        "numOsmolaridad": this.items[i].value.diluyente.osmolaridad ? this.items[i].value.diluyente.osmolaridad : '',
        "numNitrogeno": this.items[i].value.diluyente.nitrogeno ? this.items[i].value.diluyente.nitrogeno : '',
        "numProteinas": this.items[i].value.diluyente.proteinas ? this.items[i].value.diluyente.proteinas : '',
        "numKcalNoProteicas": this.items[i].value.diluyente.kcnoproteicas ? this.items[i].value.diluyente.kcnoproteicas : '',
        "numKcalTotales": this.items[i].value.diluyente.kctotales ? this.items[i].value.diluyente.kctotales : '',
        "numVolumenTotal": this.items[i].value.diluyente.volumenTotal ? this.items[i].value.diluyente.volumenTotal : '',
        "idViaAdministracion": this.items[i].value.viaAdmon,
        "idTiempoInfusion": this.items[i].value.tiempoInfusion,
        "refVelInfusion": this.items[i].value.velocidadInfusion
      }
      objeto.push(modelMezclasOps)

      //console.log(objeto)

    }

    const texto = this.loginUrl.diagnostico;
    const partes = texto.split(' - ');

    let model = {
      "lstMezclaRequest": objeto,
      "pacienteRequest": {
        "edad": this.loginUrl.PAC_EDAD ? this.loginUrl.PAC_EDAD : null,
        "fecNacimiento": this.obtenerFechaDeNacimiento(this.loginUrl.PAC_CURP),//------revisar
        "refSexo": this.loginUrl.sexo == 'Femenino' ? 'F' : 'M',
        "refNss": this.loginUrl.PAC_NSS ? this.loginUrl.PAC_NSS : null,
        "refAgregadoMedico": this.loginUrl.PAC_AMEDICO ? this.loginUrl.PAC_AMEDICO : null,
        "refUnidadMedicaHosp": this.loginUrl?.unidad_ascripcion_desc == 'SR' ? '' : this.loginUrl?.unidad_ascripcion_desc, //this.loginUrl.unidad_ascripcion_desc ? this.loginUrl.unidad_ascripcion_desc : null,//revisar  
        "unidadAscripcion": this.loginUrl.unidad_ascripcion ? this.loginUrl.unidad_ascripcion : null,
        "refCurp": this.loginUrl.PAC_CURP ? this.loginUrl.PAC_CURP : null,
        "nomNombre": this.loginUrl.PAC_NOMBRE ? this.loginUrl.PAC_NOMBRE : null,
        "nomPaterno": this.loginUrl.PAC_APAT ? this.loginUrl.PAC_APAT : null,
        "nomMaterno": this.loginUrl.PAC_AMAT ? this.loginUrl.PAC_AMAT : null,
        "refTalla": this.modelTipoMezcla.refTalla,
        "refPeso": this.modelTipoMezcla.refPeso,
        "refSuperfCorporal": this.modelTipoMezcla.refSuperfCorporal,
      },
      "medicoRequest": {
        "nomNombre": this.loginUrl.medico_nombre ? this.loginUrl.medico_nombre : null,
        "nomPaterno": this.loginUrl.medico_apaterno ? this.loginUrl.medico_apaterno : null,
        "nomMaterno": this.loginUrl.medico_amaterno ? this.loginUrl.medico_amaterno : '',
        "refMatricula": this.loginUrl.medico_mat ? this.loginUrl.medico_mat : null,
        "refCedulaProfesional": this.loginUrl.medico_cedula ? this.loginUrl.medico_cedula : null
      },
      "unidadMedicaRequest": {
        "clavePresupuestal": this.loginUrl.unidad_cvepresup,//revisar
        // "clavePresupuestal": this.loginUrl.unidad_cvepresup ? this.loginUrl.unidad_cvepresup : null,
        "clavePisoCentral": this.modelTipoMezcla.piso ? Number(this.modelTipoMezcla.piso) : null,//------revisar
        "nombrePisoCentral": this.modelTipoMezcla.piso ? this.modelTipoMezcla.piso : null,
        "calveCama": 0,
        "nombreCama": this.modelTipoMezcla.numCama ? this.modelTipoMezcla.numCama : null
      },
      "notaMedicaRequest": {
        "numFolio": this.loginUrl.nota_folio ? this.loginUrl.nota_folio : null,
        "refAnio": this.loginUrl.nota_anio ? this.loginUrl.nota_anio : null,
        "refUnidadMedica": this.loginUrl.nota_unidad ? this.loginUrl.nota_unidad : null,
        "numTipoSolicitud": this.loginUrl.nota_tipo ? this.loginUrl.nota_tipo : null,
        "numConsecutivo": this.loginUrl.nota_consecutivo ? this.loginUrl.nota_consecutivo : null,
        "stpNotaMedica": this.fechaUrl,//------revisar
        "refEspecialidad": this.loginUrl.nota_especialidad ? this.loginUrl.nota_especialidad : null,
        "cveDiagnosticoCie": partes[0] ? partes[0] : null,
      },
      //"lstFechasAplicacion": fecAplicacion,
      "cveUsuario": 1,
      "idTipoMezcla": this.modelTipoMezcla.tipoMezcla ? this.modelTipoMezcla.tipoMezcla : null,
      "idEspecialidad": this.modelTipoMezcla.especialidad ? this.modelTipoMezcla.especialidad : null,
      "timSolicitudMezcla": 3, //------revisar
      "cveSistemaExterno": 'SISTEMAPHEDS'
      // "idAplicacionCada": this.loginUrl.sexo ? this.loginUrl.sexo : null,
      // "idViaAdministracion": this.loginUrl.sexo ? this.loginUrl.sexo : null,
      // "idTiempoInfusion": this.loginUrl.sexo ? this.loginUrl.sexo : null,
      // "refVelInfusion": this.loginUrl.sexo ? this.loginUrl.sexo : null

    }
    this.mezclasService.saveSolicitud(model).then(data => {
      //console.log(data)
      if (data.folio != null || data.folio != undefined) {
        //this._alertServices.success('<b>La mezcla</b> se agregó.');
        let mensaje = "El número de folio de la solicitud es <b>" + data.folio + "</b> <br><br> <b>Solicitante:</b> <br> " + this.loginUrl.medico_nombre + " " + this.loginUrl.medico_apaterno + " " + this.loginUrl.medico_amaterno + " <br><br> <b>Paciente:</b> <br> " + this.loginUrl?.PAC_NOMBRE + " " + this.loginUrl?.PAC_APAT + " " + this.loginUrl?.PAC_AMAT + "";
        const dialogRefSave = this._dialog.open(
          DialogComponent,
          this._dialogService.envioExcitosoSolicitud("Solicitud registrada", mensaje, false)
        );

        dialogRefSave.afterClosed().subscribe(
          async data => {
            this._sesionStorage.setDuplicadoSolicitudData(null);
            this._sesionStorage.setDataDuplicadoSolicitud(null);
            this._sesionStorage.setDataMezclasAgregadas(null);
            //localStorage.removeItem(DATA_MEZCLAS_AGREGADAS);
            this.limpiarCamposANT()
            this.limpiarCamposNPT()
            this.actualizaDoom();
          }
        );

      }
      (_err) => {
        //console.log(<any>_err);
      }
    },
      (_err) => {
        //console.log(<any>_err);
        this._alertServices.error("<strong>Error</strong> alguardar la Solicitud");
      })


  }
  actualizaDoom() {
    let model = {
      "numFolio": this.loginUrl?.nota_folio,
      "refAnio": this.loginUrl?.nota_anio,
      "cvePartidaPresupuestal": this.loginUrl?.unidad_cvepresup,
      "numTipoSolicitud": this.loginUrl?.nota_tipo,
      "numConsecutivo": this.loginUrl?.nota_consecutivo,
      "stpNotaMedica": this.fechaUrl,
    }

    this.mezclasService.validaTipoMezclaFlag(model)
      .then(
        (data: any) => {
          if (data) {
            let i = 0
            const indiceAEliminar = data.findIndex(objeto => objeto.id === 1);
            if (indiceAEliminar !== -1) {
              data.splice(indiceAEliminar, 1);
            }
            data.forEach(element => {
              if (element.disabled == true) {
                i = i++;
              }
            });

            if (data.length = i) {
              window.open('', '_self', '');
              window.close();
            } else {
              window.location.reload();
            }
          } else
            this._alertServices.error("<strong>Error</strong> al obtener conceptos de Tipos Mezcla");
        },
        (_err) => {
          this._alertServices.error("<strong>Error</strong> al obtener conceptos de Tipos Mezcla");
        }
      );
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


  seleccionarTodo(event) {

    //console.log("seleccionar todos");

    this.seleccionTodo = !this.seleccionTodo;
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
    this.calculoDosis(this.valorCada)
    if (this.tipoMezcla == 3) {
      this.formAbajoAnti.controls['numDosis'].setValue(this.dosisTotales);
    }
    if (this.tipoMezcla == 2) {
      this.formAbajoNtp.controls['numDosis'].setValue(this.dosisTotales);
    }

  }

  dialogoSalir() {
    const dialogRef = this._dialog.open(
      DialogComponent,
      this._dialogService.modalGenerico("Salir de la solicitud", "¿Deseas salir de la solicitud? <br> </b> <b>Esta acción no se puede deshacer.</b>", "Regresar", "Salir de solicitud")
    );

    dialogRef.afterClosed().subscribe(
      async data => {
        if (data == true) {
          window.open('', '_self', '');
          window.close();
        }
      }
    );
  }


  cargarTablas(primeraVez: boolean) {


    //console.log('cargando tables')
    if (primeraVez) {
      this.tabsNTP = [];
      for (let index = 0; index < this.lsComponentes.length; index++) {
        const element = this.lsComponentes[index];

        let aminoAcidosDataSource = new MatTableDataSource<any>([]);
        let compData = {
          nombre: this.lsComponentes[index].desTipoComponente,
          counter: 0,
          id: this.lsComponentes[index].id,
          data: aminoAcidosDataSource,
          active: false,

          displayCols: this.displayedColumns,
        }

        this.tabsNTP.push(compData)

      }
      //console.log("tabsNTP cargadas primera vez", this.tabsNTP);

    } else {
      this.tabsNTP = null;
      this.tabsNTP = [];
      for (let index = 0; index < this.lsComponentes.length; index++) {
        const element = this.lsComponentes[index];

        let aminoAcidosDataSource = new MatTableDataSource<any>([]);
        let compData = {
          nombre: this.lsComponentes[index].desTipoComponente,
          counter: 0,
          id: this.lsComponentes[index].id,
          data: aminoAcidosDataSource,
          active: false,

          displayCols: this.displayedColumns,
        }

        this.tabsNTP.push(compData)

      }
      //console.log("tabsNTP cargadas primera vez", this.tabsNTP);
      /*for (let index = 0; index < this.tabsNTP.length; index++) {
        let element = this.tabsNTP[index];
        element.data= new MatTableDataSource<any>([]);
        element.counter=0;
        
      }*/

    }

  }

  pageChanged(event: any) {
    //console.log(event)
    const startItem = (event - 1) * this.ConfigTabla.NUM_ELEMENTOS_TABLA;
    const endItem = event * this.ConfigTabla.NUM_ELEMENTOS_TABLA;
    //console.log(startItem, endItem, this.tabsNTP.slice(startItem, endItem));
    //this.tableDS = new MatTableDataSource(this.myData.slice(startItem, endItem));
  }

  limpiarCamposNPT() {
    this.tabs = [];
    this.form.reset();
    //this.modelAbajoAnti.fecApl = null;
    this.formAbajoNtp.reset();
    this.formViaAdminNtp.reset();
    //this.formTipoMezcla.reset();
    this.boton = true;
    this.items = [];
    //this.destipoMezcla = null;
    this.dosisTotales = 0
    this.btnAddDisabled == false;

    this.formNTP.reset(); // Esto restablecerá el estado del formulario
    this.modelNTP = {};
    this.componenteTotal = 0;
    this.seleccionTodo = false;
  }

  limpiarCamposANT() {
    this.tabs = [];
    this.form.reset();
    this.formAbajoAnti.reset();
    this.formViaAdmin.reset();
    //this.modelAbajoAnti.fecApl = null;
    //this.formTipoMezcla.reset();
    this.boton = true;
    this.items = [];
    //this.destipoMezcla = null;
    this.dosisTotales = 0;
    this.seleccionTodo = false;
  }

  checkDisabledOption(field: FormlyFieldConfig, selectedValue: any) {
    const selectedOption = this.listMezclaCat.find(option => option.idTipoMezcla === selectedValue);
    if (selectedOption && selectedOption.disabled) {
      this._alertServices.success('<b>hola mundo.');
    }
  }

  obtenerFechaDeNacimiento(curp: string): Date | null {


    // Extraer los primeros 10 caracteres que representan la fecha de nacimiento
    const fechaNacimientoStr = curp.substring(4, 10);

    const año = +moment(fechaNacimientoStr, 'YYMMDD').format('YY')
    const mes = +moment(fechaNacimientoStr, 'YYMMDD').format('MM')
    const dia = +moment(fechaNacimientoStr, 'YYMMDD').locale('es').format('DD')

    const fecha = +moment(new Date(), 'YYMMDD').format('YY');

    let añoValidacion = 0
    if (año <= fecha) {
      añoValidacion = 2000
    } else {
      añoValidacion = 1900
    }

    // Crear un objeto Date con la fecha de nacimiento extraída
    const fechaNacimiento = new Date(añoValidacion + año, mes, dia);

    return fechaNacimiento;
  }

  shortTable(sort: Sort, tab) {
    //console.log("colName " + sort);

    const array = tab.data;
    let des = sort.direction == 'desc';
    const sortedArray = this.sortArrayOfObjects(array, sort.active, des);
    //let otherModel = {...this.modelo};
    // otherModel.content = sortedArray;
    // console.log(otherModel)
    tab = new MatTableDataSource(sortedArray);
  }

  ///////////// Metodos de duplicar Mezcla CU03 ////////////////////////////////

  _seguimientoService = inject(SeguimientoService);
  existeHistorial: any;

  redireccionDuplicar() {
    this._sesionStorage.setModelTipoMezcla(this.modelTipoMezcla);
    this._sesionStorage.setDataDuplicadoSolicitud(this.tipoMezclaDS);
    this._router.navigate([NAV.duplicarSolicitud]);
  }

  validaHistoria(tipoMezcla: any) {

    let model = {
      tMezcla: tipoMezcla,
      refNss: this.loginUrl.PAC_NSS,
      Cancelada: true,
      valPerfil: 'medico'
    }

    let req = {
      page: 0,
      size: this.ConfigTabla.NUM_ELEMENTOS_TABLA,
      //sort:'folioSolicitud,desc',
      filtros: model,
    }

    this._seguimientoService.getHistorial(req).then(resp => {

      if (resp.content.length > 0) {
        this.existeHistorial = true;
      } else {
        this.existeHistorial = false;
      }
    })
  }

  llenaModelosDuplicar(DatosDuplicar: any) {

    let aux = { ...this.modelTipoMezcla }
    aux.tipoMezcla = this.DatosDuplicarTipoM.id;

    this.fieldsTipoMezcla[0].fieldGroup[0].defaultValue = this.DatosDuplicarTipoM.id

    this.modelTipoMezcla = { ...aux };
    this.formTipoMezcla.reset(this.modelTipoMezcla)
    this.tipoMezcla = this.DatosDuplicarTipoM.id;
    this.destipoMezcla = this.DatosDuplicarTipoM.desTipoMezcla
    this.noMezcla = true;
    this.tipoMezclaDS = this.tipoMezcla;

    if (this.tipoMezcla === 2) {
      this.cargaNpt()
    } else {
      this.cargaAntibiotico()
    }

  }
  cargaAntibiotico() {
    this._seguimientoService.getDetalleAntibiotico(this.DatosDuplicar.idMezclaAplicDiaDosis).then(
      resp => {
        this.model = { ...resp.detalleMezcla };
        //console.log('carga desde historico --->>> ',resp)

        this.model = {
          ...this.model,
          medicamento: resp.medicamentos[0].idMedicamento,
          dosis: resp.medicamentos[0].numDosisMedicamento,
          unidadMedida: resp.medicamentos[0].refUnidadMinMedida,
        }

        this.modelAbajoAnti = {
          ...this.modelAbajoAnti,
          diluyente: resp.diluyentes[0].idDiluyente,
          dosis: Number(resp.diluyentes[0].numDosisDiluyente),
          unidadMedidaDil: resp.diluyentes[0].refUnidadMinMedida,
        }

        this.modelViaAdmin = {
          ...this.modelViaAdmin,
          viaAdmon: resp.diluyentes[0].idViaAdministracion,
          unidadTiempo: resp.diluyentes[0].idTiempoInfusion,
          velocidadInfusion: resp.diluyentes[0].refVelInfusion,
        }
      }
    );
  }
  cargaNpt() {

    this.catalogService.getTipoComponente()
      .then(
        (data: any) => {
          if (data) {
            this.lsComponentes = data;
            const compareFn = (a, b) => (a.id < b.id ? -1 : 0);
            let sortArray = data.sort(compareFn);
            for (let index = 0; index < sortArray.length; index++) {
              const element = sortArray[index];
              let dataSource = new MatTableDataSource<any>([]);
              let compData = {
                nombre: sortArray[index].desTipoComponente,
                counter: 0,
                id: sortArray[index].id,
                data: dataSource,
                active: false,
                displayCols: this.displayedColumns,
                original: null
              }
              this.tabsNTP.push(compData)
            }

          }
        },

      );


    /* this._seguimientoService.getDetalleNpt(this.DatosDuplicar.idMezclaAplicDiaDosis).then(
       resp => {
 
         if (resp) {
 
           this.tabsNTP = [];
           for (let index = 0; index < resp.componentes.length; index++) {
             const element = resp.componentes[index];
             let data = JSON.parse(JSON.stringify(element.data));
             let aminoAcidosDataSource = new MatTableDataSource<any>(data);
             let compData = {
               nombre: element.nombre,
               counter: element.data.length,
               id: element.id,
               data: aminoAcidosDataSource,
               active: false,
 
               displayCols: this.displayedColumns,
             }
 
             this.componenteTotal = element.data.length + this.componenteTotal;
 
             if (this.componenteTotal >= 50) {
               this.btnAddDisabled = true
 
             } else {
               this.btnAddDisabled = false
             }
             this.tabsNTP.push(compData)
           }
           console.log(resp)
           this.modelViaAdminNtp = {
             ...this.modelViaAdminNtp,
             viaAdmon: resp.detalleDiluyente.idViaAdministracion,
             unidadTiempo: resp.detalleDiluyente.idTiempoInfusion,
             velocidadInfusion: resp.detalleDiluyente.refVelInfusion,
           }
 
           this.modelAbajoNtp = {
             ...this.modelAbajoNtp,
 
             diluyente: resp.detalleDiluyente.idDiluyente,
             dosis: resp.detalleDiluyente.numDosisDiluyente,
             unidadMedidaDil: resp.detalleDiluyente.refUnidadMinMedida,
             osmolaridad: resp.detalleMezcla.numOsmolaridad,
             nitrogeno: resp.detalleMezcla.numNitrogeno,
             proteinas: resp.detalleMezcla.numProteinas,
             kcnoproteicas: resp.detalleMezcla.numKcalNoProteicas,
             kctotales: resp.detalleMezcla.numKcalTotales,
             volumenTotal: resp.detalleMezcla.numVolumenTotal,
           }
         }
       }
     );*/

    this._seguimientoService.getDetalleNpt(this.DatosDuplicar.idMezclaAplicDiaDosis).then(
      resp => {

        if (resp) {
          //this.model = { ...resp.detalleMezcla };
          //this.detalleDiluyente = {...resp.detalleDiluyente}
          //this.detalleMezcla = resp.detalleMezcla;

          if (resp.componentes) {
            const compareFn = (a, b) => (a.idComponente < b.idComponente ? -1 : 0);
            let sortArray = resp.componentes.sort(compareFn);
            //this.tabsNTP = [];
            for (let index = 0; index < sortArray.length; index++) {
              const element = sortArray[index];
              let dataSource = new MatTableDataSource<any>(sortArray[index].data);
              let compData = {
                nombre: sortArray[index].nombre,
                counter: sortArray[index].data.length,
                id: sortArray[index].idComponente,
                data: dataSource,
                active: false,
                displayCols: this.displayedColumns,
                original: sortArray[index]
              }

              this.tabsNTP = this.replaceOrAppend(this.tabsNTP, compData, (a, b) => a.id === b.id);

              // this.tabsNTP.push(compData)
            }

            // Utilizando map() y flat()
            this.componenteExcluidos = this.tabsNTP.map(tabNTP =>
              tabNTP.data.data.map(element => ({ medicamento: element.idMedicamento }))
            ).flat();


            this.componenteTotal = this.componenteExcluidos.length;

            if (this.componenteTotal >= 50) {
              this.btnAddDisabled = true

            } else {
              this.btnAddDisabled = false
            }
          }

          this.modelViaAdminNtp = {
            ...this.modelViaAdminNtp,
            viaAdmon: resp.detalleDiluyente.idViaAdministracion,
            unidadTiempo: resp.detalleDiluyente.idTiempoInfusion,
            velocidadInfusion: resp.detalleDiluyente.refVelInfusion,
          }

          this.modelAbajoNtp = {
            ...this.modelAbajoNtp,

            // diluyente: resp.detalleDiluyente.idDiluyente,
            // dosis: resp.detalleDiluyente.numDosisDiluyente,
            // unidadMedidaDil: resp.detalleDiluyente.refUnidadMinMedida,
            osmolaridad: resp.detalleMezcla.numOsmolaridad,
            nitrogeno: resp.detalleMezcla.numNitrogeno,
            proteinas: resp.detalleMezcla.numProteinas,
            kcnoproteicas: resp.detalleMezcla.numKcalNoProteicas,
            kctotales: resp.detalleMezcla.numKcalTotales,
            volumenTotal: resp.detalleMezcla.numVolumenTotal,
          }
        }
      }
    );
  }

  replaceOrAppend(arr, val, compFn) {
    const res = [...arr];
    const i = arr.findIndex(v => compFn(v, val));
    if (i === -1) res.push(val);
    else res.splice(i, 1, val);
    return res;
  };

  calculaEdad(fechaNacimientoUrl) {
    const moment = require('moment');

    // Fecha de nacimiento
    const fechaNacimiento = moment(fechaNacimientoUrl);

    // Fecha actual
    const fechaActual = moment();

    // Calcular la diferencia en años
    const edadAnios = fechaActual.diff(fechaNacimiento, 'years');

    //console.log('Edad:', edadAnios);
    return edadAnios;

  }
}


