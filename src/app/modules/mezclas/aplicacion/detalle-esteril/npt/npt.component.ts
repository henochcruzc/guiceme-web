import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { GeneralComponent } from 'src/app/modules/general/general.component';
import { NAV } from 'src/app/shared/config/global';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { GrupoEdad } from 'src/app/shared/general.enum';
import { HeaderDetalleMezclaComponent } from 'src/app/shared/layout/header-detalle-mezcla/header-detalle-mezcla.component';
import { DetalleAplicacionMezcla } from 'src/app/shared/models/aplicacion-mezcla.model';
import { DetalleDiluyente } from 'src/app/shared/models/diluyente.model';
import { Estatus } from 'src/app/shared/models/estatus.model';
import { MezclaNoAplicadaRequest } from 'src/app/shared/models/mezcla.model';
import { SignosVitalesPermitidos } from 'src/app/shared/models/signos-vitales.model';
import { AplicacionMezclaService } from 'src/app/shared/services/aplicacion-mezcla.service';
import { CatalogoService } from 'src/app/shared/services/catalogo.service';
import { SeguimientoService } from 'src/app/shared/services/seguimiento.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { SignosVitalesHelper } from 'src/app/shared/signos-vtales-helper';
import { ListadoComponentesComponent } from '../../../detalle/listado-componentes/listado-componentes.component';
import { ListadoDiluyenteComponent } from '../../../detalle/listado-diluyente/listado-diluyente.component';
import { ListadoMedicamentosComponent } from '../../../detalle/listado-medicamentos/listado-medicamentos.component';
import { CamposAplicacionComponent } from '../campos-aplicacion/campos-aplicacion.component';
import { CamposSvComponent } from '../campos-sv/campos-sv.component';
import { NoAplicadaComponent } from '../no-aplicada/no-aplicada.component';
import * as moment from 'moment';
@Component({
  selector: 'app-npt',
  templateUrl: './npt.component.html',
  styleUrls: ['./npt.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    HeaderDetalleMezclaComponent,
    ListadoMedicamentosComponent,
    ListadoDiluyenteComponent,
    ListadoComponentesComponent,
    CamposSvComponent,
    CamposAplicacionComponent

  ]
})
export class NptComponent extends GeneralComponent {
  public FechaActual = new Date();
  public MesAnterior = new Date(this.FechaActual.getFullYear(), this.FechaActual.getMonth() - 1, this.FechaActual.getDate());
  public MesPosterior = new Date(this.FechaActual.getFullYear(), this.FechaActual.getMonth() + 1, this.FechaActual.getDate() - 1);
  public FechaMinima = moment(this.MesAnterior, 'YYYY-MM-DD');
  public FechaMaxima = moment(new Date(), 'YYYY-MM-DD');

  public FechaMinimaFin = moment(this.FechaActual, 'YYYY-MM-DD');
  public FechaMaxFin = moment(this.MesPosterior, 'YYYY-MM-DD');

  detalle: DetalleAplicacionMezcla;
  detalleAntibiotico: any;
  modelDiluyente: DetalleDiluyente;
  model: any = {};
  getMmodel: any = {};
  modelAplicacion: any = {};
  detalleRegistro: any;
  headerData: any;
  blnNuevo: boolean;
  blnRegistrar: boolean = true;
  blnBtnAplicar: boolean = true;
  blnBtnEditar: boolean = false;
  blnEditar: boolean = false;
  blnMostrarEdicionSV: boolean = false;
  blnMostrarLecturaSV: boolean = false;
  blnBloqueaCampos: boolean = false;


  //sección SignosVitales
  blnSVLectura: boolean = false;
  blnSVcamposEditar: boolean = false;
  blnSVcamposBloquear: boolean = false;
  blnAplicacionLectura: boolean = false;
  blnMostrarBtnSV: boolean = false;

  //seccion aplicacion
  blnAplicarLectura: boolean = false;
  blnAplicarcamposEditar: boolean = false;
  blnAplicarcamposBloquear: boolean = false;
  blnHayFechaInicio: boolean = false;

  blnMostrarBtnFinalizar: boolean = false;
  blnOcultarTurnoInicio: boolean = true;
  blnBloquearFinalizar: boolean = true;

  blnMuestraCamposBloqueadosAplicacion: boolean = true;//muestra campos bloqueados
  blnBloqueaFechaFin = true;
  blnBloqueaFechaInicio = false;
  blnGuardoFechaInicio = false;
  blnHaySV: boolean = false;
  turno: string = "";
  blnMostrarBtnIniciar = true;

  blnMostrarTurnoInicio: boolean = false;
  //estatus
  blnEstatusAplicada: boolean = false;
  blnEstatusPorAplicar: boolean = false;
  estatusMezcla: Estatus = new Estatus();

  idUsuarioMedico: number;
  cveUsuarioAlta: number;
  constructor(private formBuilder: FormBuilder,
    private _seguimientoService: SeguimientoService,
    private _accionService: AplicacionMezclaService,
    private _catalogoService: CatalogoService,
    private _HelperSignos: SignosVitalesHelper,
    private router: Router,
    public dialog: MatDialog
  ) {
    super();
  }

  edadPaciente = 0;
  parametrosVitales: SignosVitalesPermitidos;
  mezcla: any;
  diluyente: any;
  detalleComponente: any;
  lstComponentesTabs: [];

  form = new FormGroup({});
  fields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: "col-lg-2 col-md-6",
          key: 'numPacTenArtSistolica',
          type: 'input-mask',
          props: {
            label: 'Tensión arterial sistólica',
            placeholder: 'Ingresa la TAS',
            appInputMaskType: 'integer',
            required: true,
            maxLength: 3,

            attributes: {
              autocomplete: 'off',
            },

          },

          hooks: {
            onInit: field => {
              const campo = field.form.get('numPacTenArtSistolica');
              if (campo != null) {
                campo.valueChanges.subscribe(x => {

                  field.props.max = this.parametrosVitales.numPacTenArtSistolicaMax;
                  field.props.min = this.parametrosVitales.numPacTenArtSistolicaMin;

                })
              }
            }
          },
          validation: {
            messages: {

              max: (error: any, field: FormlyFieldConfig) => this._Mensajes.MSG41,
              min: (error: any, field: FormlyFieldConfig) => this._Mensajes.MSG41,
            }
          },
        },
        {
          className: "col-lg-2 col-md-6",
          key: 'numPacTenArtDiastolica',
          type: 'input-mask',
          props: {
            label: 'Tensión arterial diastólica',
            placeholder: 'Ingresa la TAD',
            appInputMaskType: 'integer',
            required: true,

            maxLength: 3,
            attributes: {
              autocomplete: 'off',
            },

          },
          hooks: {
            onInit: field => {
              const campo = field.form.get('numPacTenArtDiastolica');
              if (campo != null) {
                campo.valueChanges.subscribe(x => {
                  field.props.max = this.parametrosVitales.numPacTenArtDiastolicaMax;
                  field.props.min = this.parametrosVitales.numPacTenArtDiastolicaMin;

                })
              }
            }
          },
          validation: {
            messages: {
              max: (error: any, field: FormlyFieldConfig) => this._Mensajes.MSG41,
              min: (error: any, field: FormlyFieldConfig) => this._Mensajes.MSG41,
            }
          },

        },
        {
          className: "col-lg-2 col-md-6",
          key: 'numPacFrecCardiaca',
          type: 'input-mask',
          props: {
            label: 'Frecuencia cardiaca',
            placeholder: 'Ingresa la FC',
            appInputMaskType: 'integer',

            required: true,
            maxLength: 3,
            attributes: {
              autocomplete: 'off',
            },
          },
          hooks: {
            onInit: field => {
              const campo = field.form.get('numPacFrecCardiaca');
              if (campo != null) {
                campo.valueChanges.subscribe(x => {
                  field.props.max = this.parametrosVitales.numPacFrecCardiacaMax;
                  field.props.min = this.parametrosVitales.numPacFrecCardiacaMin;

                })
              }
            }
          },
          validation: {
            messages: {
              max: (error: any, field: FormlyFieldConfig) => this._Mensajes.MSG41,
              min: (error: any, field: FormlyFieldConfig) => this._Mensajes.MSG41,
            }
          },

        },

        {
          className: "col-lg-2 col-md-6",
          key: 'numPacFrecRespiratoria',
          type: 'input-mask',
          props: {
            label: 'Frecuencia respiratoria',
            placeholder: 'Ingresa la FR',
            appInputMaskType: 'integer',
            required: true,

            maxLength: 3,
            attributes: {
              autocomplete: 'off',
            },
          },
          hooks: {
            onInit: field => {
              const campo = field.form.get('numPacFrecRespiratoria');
              if (campo != null) {
                campo.valueChanges.subscribe(x => {
                  field.props.max = this.parametrosVitales.numPacFrecRespiratoriaMax;
                  field.props.min = this.parametrosVitales.numPacFrecRespiratoriaMin;
                })
              }
            }
          },
          validation: {
            messages: {
              max: (error: any, field: FormlyFieldConfig) => this._Mensajes.MSG41,
              min: (error: any, field: FormlyFieldConfig) => this._Mensajes.MSG41,
            }
          },
        },
        {
          className: "col-lg-2 col-md-6",
          key: 'numPacTemperatura',
          type: 'decimal',
          props: {
            label: 'Temperatura',
            placeholder: 'Ingresa la temperatura',

            required: true,
           
            numEnteros:2,
                      numDecimales:2,
          
          //  pattern: /^([0-9]{1,2}(.[0-9]{0,2})?)$/,
            attributes: {
              autocomplete: 'off',
            },
          },
        
        },



      ]
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup: [

        {
          className: "col-lg-12 col-md-6",
          key: 'refPacObs',
          type: 'input',
          props: {

            label: 'Observaciones',
            placeholder: 'Ingresa la observación',
            appInputMaskType: 'integer',
            maxLength: 500,

            attributes: {
              autocomplete: 'off',
            },
          },

        },
      ]
    }



  ];

  // --aplicacion
  formAplicacion = new FormGroup({});
  fieldsAplicacion: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [


        {
          className: "col-lg-3 col-md-6",
          key: 'stpAplicacInicio',
          type: 'material-date-place',
          props: {
            label: 'Fecha y hora de inicio',
            range: false,
            placeholder: 'Selecciona una fecha y hora',
            required: false,
            minDate: this.FechaMinima,
            maxDate: this.FechaMaxima,
            numDias: 30
          },
          expressionProperties: {
            'props.disabled': () => {
              // console.log("campo fecha fin ", this.blnBloqueaFechaFin);
              if (
                this.blnBloqueaFechaInicio
              ) {

                return true
              }
              return false
            },
          },
          hooks: {
            onInit: field => {
              const campo = field.form.get('stpAplicacInicio');


              if (campo != null) {
                campo.valueChanges.subscribe(x => {
                  //console.log("elige hora inicio");
                  this.obtenerTurno(true);



                })


              }
            }
          },
        },

        {
          className: "col-lg-1 ",
          key: 'desTurnoInicio',
          type: 'turno',
          props: {
            label: 'Turno que inició'
          },
          expressions: { hide: '!model.desTurnoInicio' },
        },
        {
          className: "col-lg-1 col-md-6",

          type: 'lineaAzul',

        },
        {
          className: "col-lg-3 col-md-6",
          key: 'stpAplicacTermino',
          type: 'material-date-place',
          templateOptions: {
            label: 'Fecha y hora de término',
            range: false,
            placeholder: 'Selecciona una fecha y hora',
            required: true,
            numDias: 30

          },
          expressionProperties: {
            'props.disabled': () => {

              if (
                this.blnBloqueaFechaFin
              ) {

                return true
              }
              return false
            },
          }, hooks: {
            onInit: field => {
              // 
              const campo = field.form.get('stpAplicacTermino');
              field.props['minDate'] = this.FechaMinimaFin;
              field.props['maxDate'] = this.FechaMaxFin;
              if (campo != null) {
                campo.valueChanges.subscribe(x => {
                  //console.log("elige hora fin");

                  this.obtenerTurno(false);
                })
              }
            }
          },

        },


      ]
    }

  ];

  private ValidarSVRequeridos(): boolean {
    if (this.model.numPacTenArtSistolica != null && this.model.numPacTenArtSistolica != ''
      && this.model.numPacTenArtDiastolica != null && this.model.numPacTenArtDiastolica != ''
      && this.model.numPacFrecCardiaca != null && this.model.numPacFrecCardiaca != ''
      && this.model.numPacFrecRespiratoria != null && this.model.numPacFrecRespiratoria != ''
      && this.model.numPacTemperatura != null && this.model.numPacTemperatura != ''
    ) {
      return true;
    } else {
      return false;
    }
  }


  ngDoCheck() {
    //console.log("docheck: ",this.model);
    /*     if(this.model.numPacTenArtSistolica == ''){
          delete this.model['numPacTenArtSistolica'];
        } */

    if (this.ValidarSVRequeridos()) {
      this.blnRegistrar = false;
    } else {
      this.blnRegistrar = true;
    }

    if (this.model.stpAplicacInicioString != null
      || (this.model.stpAplicacInicio != null
        /*   || this.model.stpAplicacTerminoString != null */
      )
    ) {
      this.blnBtnAplicar = false;
    } else {
      this.blnBtnAplicar = true;
    }

    if (this.model.indEnProceso == 1
      && this.model.stpAplicacTermino != null
    ) {
      this.blnBloquearFinalizar = false;
    } else {
      this.blnBloquearFinalizar = true;
    }






  }



  ngOnInit() {


    this.getDetalle();
    //console.log("entro a NptComponent", this.detalle);
    this.parametrosVitales = this.detalle.parametros;
    if (this.detalle) {
      this.detalleRegistro = this.detalle.registro;
      this.headerData = this.detalle.header;
      this.headerData.uno[3].texto = 'Detalle de la mezcla';
      this.headerData.navAtras = NAV.aplicacionMezcla;
      this.idUsuarioMedico = this.detalle.idPersona;
      this.cveUsuarioAlta = this.detalle.idClaveAlta;
      this.getDetalleNTP(this.detalle);

      if (this.detalle.registro.idAplicacionMezcla) {
        //console.log("va a buscar signos vitales: ", this.detalle.registro.idAplicacionMezcla);
        this.getSignosVitales(this.detalle.registro.idAplicacionMezcla);
      } else {
        this.blnNuevo = true;
        this.controlVista(this.estatusMezcla, 0, 0);
      }
    }

  }


  OnDestroy() {
    sessionStorage.removeItem(window.btoa('CEME'));
  }

  atras() {
    this.router.navigateByUrl(NAV.aplicacionMezcla);
  }


  private convertirDate(f: string): Date {
    let data = f;
    let fechaInicio = data.replace(/-/g, "");
    return this._HelperSignos.convertirDateAplic(fechaInicio);
  }

  private convertirDateNext(f: string): Date {
    let data = f;
    let fechaInicio = data.replace(/-/g, "");
    return this._HelperSignos.convertirDateMonthNext(fechaInicio);
  }
  blnDatosLectura: boolean = false;
  private controlVista(estatus: Estatus, indPorAplicar?: number, indEnProceso?: number) {
    //console.log("estatus: " + estatus.descripcion);
    switch (estatus.id) { // por estatus

      case 9://por aplicar
        if (indEnProceso == 0 && indPorAplicar == 0) {
          //console.log("viene por UM");
          this.blnEstatusPorAplicar = true;
          this.blnMostrarBtnFinalizar = true;
          if (this.blnHaySV) {//existen signos vitales
            this.blnSVcamposBloquear = true;
            this.blnSVcamposEditar = false;
            this.blnSVLectura = false;
            this.blnBtnEditar = true;
            this.blnMostrarBtnSV = true
            this.blnOcultarEditarSV = false;

            //          this.modelAplicacion = this.model;
            this.blnAplicarcamposBloquear = false;
            this.blnBloqueaFechaInicio = false;
            this.blnBloqueaFechaFin = true;
            this.blnAplicarcamposEditar = true;
            this.blnMostrarBtnIniciar = true;


            this.blnMostrarBtnFinalizar = true;


          } else {// no hay SV registrados
            //console.log("Configuración por aplicar:  sin datos ");
            this.blnNuevo = true;
            this.blnMostrarBtnSV = true;

            this.blnSVcamposEditar = true;
            this.blnSVcamposBloquear = false;
            this.blnBtnEditar = false; //controla color boton


            this.blnAplicarcamposBloquear = true;
            this.blnAplicarcamposEditar = false;
            this.blnGuardoFechaInicio = true;

            if (this.model.stpAplicacTermino == null) {

            }
          }

        }
        if (indEnProceso == 0 && indPorAplicar == 1) {
          //console.log("UM pero esta por aplicar");
          this.blnSVcamposEditar = true;
          this.blnEstatusPorAplicar = true;
        }
        if (indEnProceso == 1) {
          this.estatusEnProceso();
        }
        break;

      case 11://aplicada
        //console.log("es aplicada***");
        if (this.blnHaySV) {
          if (this.model.stpAplicacInicio && this.model.stpAplicacTermino) {
            this.blnEstatusAplicada = true;
            this.blnSVLectura = true;
            this.blnEstatusAplicada = true;
            this.blnAplicacionLectura = true;
            this.blnAplicarcamposBloquear = false;
            this.blnAplicarcamposEditar = false;
            this.blnMostrarBtnIniciar = false;
            this.blnMostrarBtnFinalizar = true;
          }


        }
        this.blnMostrarBtnFinalizar = false;

        break;
      case 12://no aplicada
        //console.log("no viene por aplicar");
        if (this.blnHaySV) {
          this.blnSVLectura = true;
          this.blnAplicacionLectura = true;
          this.blnMostrarBtnIniciar = false;
          this.blnAplicarcamposEditar = false;
        }
        break;


      default:

        break;

    }
    //console.log("indEnProceso:  ", indEnProceso);
    //console.log("indPorAplicar:  ", indPorAplicar);
    if (indEnProceso == 1 && indPorAplicar == 0) { // estatus en proceso
      //console.log("Configuración en indEnProceso:  ", indEnProceso);
      this.estatusEnProceso();
    }

    if (indEnProceso == 0 && indPorAplicar == 1) { // estatus por aplicar
      console.log("viene por indPorAplicar");

      this.blnMostrarBtnFinalizar = false;
      if (this.blnHaySV) {//existen signos vitales
        this.blnSVcamposBloquear = true;
        this.blnSVcamposEditar = false;
        this.blnSVLectura = false;
        this.blnBtnEditar = true;
        this.blnMostrarBtnSV = true
        this.blnOcultarEditarSV = false;

        //          this.modelAplicacion = this.model;
        this.blnAplicarcamposBloquear = false;
        this.blnBloqueaFechaInicio = false;
        this.blnBloqueaFechaFin = true;
        this.blnAplicarcamposEditar = true;
        this.blnMostrarBtnIniciar = true;


        this.blnMostrarBtnFinalizar = true;


      } else {// no hay SV registrados
        /*    this.blnNuevo = true;
           this.blnSVcamposEditar = true;
           this.blnSVcamposBloquear = false;
           this.blnBtnEditar = false; //controla color boton
           this.blnMostrarBtnSV = false;
   
           this.blnAplicarcamposBloquear = true;
           this.blnAplicarcamposEditar = false; */
      }


    }

  }



  private estatusEnProceso() {
    //console.log("Configuración en proceso:  ");

    if (this.blnHaySV) {
      //seccion SIgnos Vitales

      this.blnBloqueaFechaInicio = true;
      this.blnMostrarBtnIniciar = false;


      this.blnSVcamposBloquear = true;
      this.blnAplicarcamposEditar = true;
      this.blnMostrarBtnSV = false;

      this.blnMostrarBtnIniciar = false;
      this.blnMostrarBtnFinalizar = true;

      if (this.model.stpAplicacInicio != null
        || this.model.stpAplicacInicioString != null) {
        this.blnBloqueaFechaInicio = true;
        this.blnBloqueaFechaFin = false;
        this.blnMostrarBtnIniciar = false;


      }
    } else {

    }
  }

  private bloquearSeccionAplicacion() {
    this.blnMuestraCamposBloqueadosAplicacion = true;
    this.modelAplicacion = {};
  }





  private estatusPorAplicarSV() {
    this.blnEstatusPorAplicar = true;
    this.blnNuevo = true;
    this.blnRegistrar = true;
    this.blnHaySV = true;
    this.blnDatosLectura = false;
    this.blnBtnEditar = false;
    this.blnBloqueaCampos = true;
    this.blnMostrarEdicionSV = false;


  }

  getDetalle(): DetalleAplicacionMezcla | null {
    let encodeJson = sessionStorage.getItem(window.btoa('CEME'));
    // console.log("encodeJson",encodeJson);
    if (encodeJson && encodeJson.length > 0) {

      this.detalle = JSON.parse(decodeURIComponent(window.atob(encodeJson)));
      this.estatusMezcla.id = this.detalle.registro.idEstatus;
      this.estatusMezcla.descripcion = this.detalle.registro.desEstatusMezcla;

      return JSON.parse(decodeURIComponent(window.atob(encodeJson)));

    } else {
      return null;
    }


  }
  getDetalleNTP(detalle: DetalleAplicacionMezcla) {
    this._seguimientoService.getDetalleNpt(detalle.registro.idMezclaAplicDiaDosis).then(
      resp => {


        this.model = { ...resp.detalleMezcla };
        if (resp.detalleMezcla) {
          this.mezcla = resp.detalleMezcla;
        }
        if (resp.detalleDiluyente) {
          this.diluyente = resp.detalleDiluyente;
          this.diluyente.totalDosis = resp.detalleDiluyente.numTotalDosis;
          //console.log("diluyente", this.diluyente);
        }
        if (resp.componentes) {


          this.detalleComponente = {};

          this.lstComponentesTabs = resp.componentes;
          this.detalleComponente.lstComponentesTabs = this.lstComponentesTabs;


        }

      }
    );
  }


  public registrarSignos() {
    this.bloquearSeccionAplicacion();
    if (this.form.controls['numPacTemperatura'].errors) {
      if (this.form.controls['numPacTemperatura'].errors['pattern']) {
        this.blnRegistrar = true;
        this._alertServices.error('Formato es de dos dígitos enteros, dos decimales');
      } else {
        this.blnRegistrar = false;
      }
    }

    if (!this.blnRegistrar || this.blnMostrarEdicionSV) {


      if (this.blnNuevo) {

        if (this.ValidarSVRequeridos()) {
          this.saveSignos(this.model);
        }

      } else {

        //console.log("actualiza");
        if (this.ValidarSVRequeridos()) {
          this.updateSignos(this.model);
        }

      }
    }




  }

  public btnIiniciarAplicacion() {


    if (!this.blnBtnAplicar) {//si boton deshabilitado
      this.modelAplicacion = {};
      this.modelAplicacion.turno = this.model.desTurnoInicio;
      this.modelAplicacion.idAplicacionMezcla = this.model.idAplicacionMezcla;
      this.modelAplicacion.idMezclaAplicDiaDosis = this.model.idMezclaAplicDiaDosis;
      this.modelAplicacion.cveUsuarioAlta = this.model.cveUsuarioAlta;
      let formatFecha = this.model.stpAplicacInicio.replace(" ", "T");
      this.modelAplicacion.stpAplicacInicio = formatFecha;//this.model.stpAplicacInicio;
      this.iniciarAplicacion(this.modelAplicacion);
    }
  }



  public editarSignos() {


    this.blnSVcamposEditar = true;

    this.blnBtnEditar = false;
  }


  private getSignosVitales(idAplicacionMezcla: number) {
    this.idAplicacionMezcla = idAplicacionMezcla;
    this.model = {};
    this._accionService.getSignosVitales(idAplicacionMezcla).then(
      resp => {

        //  console.log("getSignosVitales ", resp);
        if (resp) {//hay datos
          this.blnNuevo = false;
          this.blnHaySV = true;
          this.model = { ...resp };
          this.modelAplicacion = { ...resp };

          if (this.model.stpAplicacInicio) {
            this.FechaMinimaFin = moment(this.convertirDate(this.model.stpAplicacInicio), 'YYYY-MM-DD');
            this.FechaMaxFin = moment(this.convertirDateNext(this.model.stpAplicacInicio), 'YYYY-MM-DD');
          }

          // console.log("model obtenido: ", this.getMmodel);
          if (this.blnGuardoFechaInicio) {
            this.blnBloqueaFechaFin = false;
            this.blnBloqueaFechaInicio = true;
            this.blnMostrarBtnIniciar = false;
            this.blnOcultarEditarSV = true;

          }



        } else {//es nuevo
          this.blnHaySV = false;

          this.blnNuevo = true;
          this.model = {};
          this.getMmodel = {};
          this.blnBtnEditar = false;
        }

        this.controlVista(this.estatusMezcla, this.model.indPorAplicar, this.model.indEnProceso);

      }

    );
  }





  private saveSignos(model: any) {
    let datos: any = {};
    datos.idPaciente = this.detalleRegistro.idPaciente;
    datos.cveUsuarioAlta = this.cveUsuarioAlta;
    datos.idUsuarioResponsable = this.idUsuarioMedico;
    datos.idMezclaAplicDiaDosis = this.detalleRegistro.idMezclaAplicDiaDosis;
    datos.numPacFrecCardiaca = model.numPacFrecCardiaca;
    datos.numPacFrecRespiratoria = model.numPacFrecRespiratoria;
    datos.numPacTemperatura = model.numPacTemperatura;
    datos.numPacTenArtDiastolica = model.numPacTenArtDiastolica;
    datos.numPacTenArtSistolica = model.numPacTenArtSistolica;
    datos.refAplicacReaccionObs = model.refAplicacReaccionObs;
    datos.refPacObs = model.refPacObs;


    this._accionService.saveSignosVitales(datos).then(
      resp => {
        if (resp) {


          this.blnBtnEditar = true;
          this.blnMuestraCamposBloqueadosAplicacion = false;
          // this.blnSVGuardados = true;
          this.blnSVcamposEditar = false;
          setTimeout(() => {
            this._alertServices.success(this._Mensajes.MSG38);
            this.getSignosVitales(resp.idAplicacionMezcla);
          }, 1000);


          if (this.blnEstatusPorAplicar) {
            this.estatusPorAplicarSV();
          }
        } else {
          // this.blnSVGuardados = false;
        }


      }
    );
  }
  blnSVGuardados: boolean = false;
  private updateSignos(model: any) {


    let datos: any = {};
    datos.idPaciente = this.detalleRegistro.idPaciente;
    datos.cveUsuarioModifica = this.cveUsuarioAlta;
    datos.idUsuarioResponsable = this.idUsuarioMedico;
    datos.idAplicacionMezcla = model.idAplicacionMezcla;
    datos.idMezclaAplicDiaDosis = this.detalleRegistro.idMezclaAplicDiaDosis;
    datos.numPacFrecCardiaca = model.numPacFrecCardiaca;
    datos.numPacFrecRespiratoria = model.numPacFrecRespiratoria;
    datos.numPacTemperatura = model.numPacTemperatura;
    datos.numPacTenArtDiastolica = model.numPacTenArtDiastolica;
    datos.numPacTenArtSistolica = model.numPacTenArtSistolica;
    datos.refPacObs = model.refPacObs;

    //  console.log("datos", datos);

    this._accionService.updateSignosVitales(datos).then(
      resp => {
        if (resp) {
          //   console.log("getSignosVitales ", resp);
          this._alertServices.success(this._Mensajes.MSG38);
          this.blnBloqueaCampos = true;
          this.blnMostrarEdicionSV = false;
          this.blnBtnEditar = true;
          this.blnMuestraCamposBloqueadosAplicacion = false;
          //  this.blnSVGuardados = true;
          this.getSignosVitales(resp.idAplicacionMezcla);

        } else {
          this.blnBloqueaCampos = false;
          //this.blnSVGuardados = false;
        }


      }
    );
  }

  private obtenerTurno(blnInicio) {
    //let hora = '15:00';
    //console.log("obtenerTurno: ", this.model);
    let fecha: string = ''
    let calendario, hora;

    switch (blnInicio) {
      case true:
        fecha = this.model.stpAplicacInicio;
        calendario = fecha.split(' ');
        hora = calendario[1].substring(0, 5);
        if (this.model.stpAplicacInicio != null) {


          this._accionService.getTurno(hora)
            //.subscribe((resp: any) => {
            .then(
              resp => {
                this.model.desTurnoInicio = resp.turno;

              });
        }
        break;
      case false:

        if (this.model.stpAplicacTermino != null) {
          fecha = this.model.stpAplicacTermino;
          calendario = fecha.split(' ');
          hora = calendario[1].substring(0, 5);
          this._accionService.getTurno(hora)
            .then(
              resp => {
                this.model.desTurnoTermino = resp.turno;
                //  console.log("model: ", this.model);
              });
        }
        break;
      default:
        break;
    }


  }

  blnOcultarEditarSV: boolean = false;

  private iniciarAplicacion(modelAplicacion: any) {





    this._accionService.iniciarAplicacion(modelAplicacion).then(
      resp => {
        if (resp) {
          //eliminar estyas lineas

          this.blnBloquearFinalizar = false;

          ////
          this._alertServices.success(this._Mensajes.MSG26);// aqui la mezcla a estatus en proceso
          setTimeout(() => {
            this.getSignosVitales(this.idAplicacionMezcla);
          }, 800);

          //    window.location.reload();
        } else {

        }


      }
    );
  }



  public btnFinalizarAplicacion() {

    if (!this.blnBloquearFinalizar) {
      let titulo = 'Finalizar aplicación'
      const dialogo = this.mostrarDialogo(titulo, this._Mensajes.MSG39, null, titulo);
      dialogo.afterClosed().subscribe(
        async data => {
          //      console.log("data log: ", data);
          if (data == true) {
            this.finalizarAplicacion();
            dialogo.close();
          }
        }
      );
      // this.finalizarAplicacion();

    }
  }

  idAplicacionMezcla: number;

  private finalizarAplicacion() {
    let datos: any = {};
    datos.idAplicacionMezcla = this.idAplicacionMezcla;
    let formatFecha = this.model.stpAplicacTermino.replace(" ", "T");
    datos.stpAplicacTermino = formatFecha;
    datos.turno = this.model.desTurnoTermino;
    datos.cveUsuarioAlta = this.cveUsuarioAlta;
    this._accionService.finalizarAplicacion(datos).then(
      resp => {

        //  console.log("finalizarAplicacion ", resp);


        if (resp == null) {// cambia estatus de mezcla a aplicada
          setTimeout(() => {
            this.atras();
            this._alertServices.success(this._Mensajes.MSG40);
          }, 1000);
        }



      }
    );

  }

  public btnNoAplicar() {
    let datos: any = {};

    this.dialogoNoAplicada();


  }

  private mostrarDialogo(titulo: string, mensaje: string, cancelar: string, btnOk: string) {


    return this._dialog.open(DialogComponent,
      this._dialogService.modalGenerico(titulo, mensaje, null, btnOk)

    );

  }


  private dialogoNoAplicada() {
    let data = new MezclaNoAplicadaRequest();
    data.stpAplicacInicio = this.model.stpAplicacInicio;
    data.stpAplicacTermino = this.model.stpAplicacTermino;
    data.idAplicacionMezcla = this.idAplicacionMezcla;
    data.indEnProceso = this.model.indEnProceso;
    data.cveUsuarioAlta = this.cveUsuarioAlta;
    data.idAplicacReaccAdversa = 2;
    if (!this.blnHaySV) {
      data.idMezclaAplicDiaDosis = this.detalleRegistro.idMezclaAplicDiaDosis;
      data.idPaciente = this.detalleRegistro.idPaciente;
      data.idUsuarioResponsable = this.idUsuarioMedico;
    }





    //   console.log("mando el id de la mezcla", data);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = data;
    const dialogo1 = this.dialog.open(NoAplicadaComponent, dialogConfig);
    if (this.model.indEnProceso == 1) {
      dialogConfig.width = '732px';
    }
    if (this.model.indEnProceso == 0) {
      dialogConfig.width = '673px';
    }
    dialogConfig.height = '428px';

    dialogo1.afterClosed().subscribe(res => {

      if (res) {
        if (res.event) {





        }
      }

    });

  }

}