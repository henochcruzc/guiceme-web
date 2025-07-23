import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { HeaderDetalleMezclaComponent } from 'src/app/shared/layout/header-detalle-mezcla/header-detalle-mezcla.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DetalleProgresoComponent } from '../../detalle-progreso/detalle-progreso.component';
import { SessionStorageService } from 'src/app/modules/login/services/session-storage.service';
import { CatalogoService } from 'src/app/shared/services/catalogo.service';
import { SeguimientoService } from 'src/app/shared/services/seguimiento.service';
import { GeneralComponent } from 'src/app/modules/general/general.component';
import { DialogFormlyComponent } from 'src/app/shared/dialog-formly/dialog-formly.component';
import { GenericDialogService } from 'src/app/shared/dialog/genericDialog.service';
import { state } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { AlertService } from 'src/app/shared/alert';
import { NAV } from 'src/app/shared/config/global';
import { MezclasService } from 'src/app/shared/services/mezclas.service';
import { FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'app-aprobar-no-aprobar',
  templateUrl: './aprobar-no-aprobar.component.html',
  styleUrls: ['./aprobar-no-aprobar.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    DetalleProgresoComponent,
    HeaderDetalleMezclaComponent
  ]
})
export class AprobarNoAprobarComponent extends GeneralComponent {
  origen: boolean;
  origenAcondicionamiento: boolean = false;
  origenOrdenDistribucion: boolean = false;
  idEstatusMezcla: any;
  tablaMedicamentos = [];
  tablaDiluyentes = [];
  tablaMezcla = [];
  tablaPacientes = [];
  dataEtiqueta: any;
  tablaMedicamentos2 = []
  tablaMedicamentos3 = []
  tablaComponentes = []
  tablaMedicamentosAnt = []
  arrayComponentes = []

  textGrad = "°C";

  bulletPoint = '\u2022 ';

  constructor(private dialog: MatDialog,
    private alertServices: AlertService,
    private mezclaService: MezclasService) {
    super();
  }

  sessionStorageService = inject(SessionStorageService)
  dialogService = inject(GenericDialogService);
  _seguimientoService = inject(SeguimientoService);
  _catalogoService = inject(CatalogoService);
  dataResolucion = this.sessionStorageService.getDataResolucion();
  user = this.sessionStorageService.getUser();


  ngOnInit() {
    //console.log('data resolucion ',this.dataResolucion.origen)
    //console.log('data modelo ',this.dataResolucion.modelo)
    //console.log('userrr', this.user)
    console.log('data resolucion ', this.dataResolucion);
    if (this.dataResolucion.origen == NAV.acondicionamiento) {
      this.origenAcondicionamiento = true
      this.idEstatusMezcla = this.dataResolucion.modelo.estatusDosis.idEstatusMezcla;
    } else if (this.dataResolucion.origen == NAV.ordenDistribucion) {
      this.origenOrdenDistribucion = true
    }


  }

  dialogoNoAprobar() {

    const dialogRef = this._dialog.open(
      DialogFormlyComponent,
      this._dialogFormlyService.guardarNoAprobarMA()
    );

    dialogRef.afterClosed().subscribe(
      async data => {

        if (data != null) {
          this.noAprobada(data);
        }
      }
    );
  }

  dialogoAprobar() { // Aprobar mezcla - Acondicionamiento,3
    console.log("this.idEstatusMezcla", this.idEstatusMezcla);
    //invocar aprobarPreparada
    if (this.idEstatusMezcla === 5) {//cuando se da click en Aprobar mezcla

      this.preAprobarPreparada();

    } else {
      //se incorpora la mejora 18 y 19
      // debugger;
      if (this.dataResolucion.modelo.idTipoMezcla == 3 || this.dataResolucion.modelo.idTipoMezcla == 1) {//antibiotico citotoxico

        const dialogRef = this._dialog.open(
          DialogFormlyComponent,
          this._dialogFormlyService.imprimirEtiquetaAntCito(this.dataResolucion.modelo.cveFolioMezclaDosis)
        );
        dialogRef.afterClosed().subscribe(
          async data => {
            //debugger
            if (data != null) {
              console.log("data recomendaciones", data);
              this.imprimirAprobada(data.recomendaciones);


            } else {
              console.log("data recomendaciones", data);
              this.cerrarAprobada();

            }
          }
        );

      }
      else if (this.dataResolucion.modelo.idTipoMezcla == 2) {//NTP

        const dialogRef = this._dialog.open(
          DialogFormlyComponent,
          this._dialogFormlyService.imprimirEtiquetaNTP(this.dataResolucion.modelo.cveFolioMezclaDosis)
        );
        dialogRef.afterClosed().subscribe(
          async data => {
            //debugger
            if (data != null) {
              console.log("data recomendaciones", data);
              this.imprimirAprobada(data.recomendaciones);


            } else {
              console.log("data recomendaciones", data);
              this.cerrarAprobada();

            }
          }
        );

      }


      /* se comenta por mejora 18 19
            const dialogRef = this.dialog.open(
              DialogComponent,
              this._dialogService.modalGenerico('Aprobación de mezcla', '¿Deseas imprimir la mezcla con folio <b>' + this.dataResolucion.modelo.cveFolioMezclaDosis + '</b>?', null, 'Imprimir')
            );
            dialogRef.afterClosed().subscribe(
              async result => {
                if (result) {//aceptar
                  this.imprimirAprobada();
                } else {//cerrar
                  console.log('cerrar Preparada acondicionamiento')
                  this.cerrarAprobada();
                }
                //setTimeout(() => this._router.navigate([this._nav.acondicionamiento]), 1000);
              }
            );*/
    }


  }

  dialogoReimpresion() {
    //getValidadNumReimpresion
    this.mezclaService.getValidadNumReimpresion(this.dataResolucion.modelo.idMezclaAplicDiaDosis)
      .then(data => {

        console.log('valor num data', data)
        let numero = data;
        let param1;
        let param2;
        if (data != null) {

          if (numero === 1) {//si es 1,shabilitar Una impresion, deshabilitar Dos
            param1 = false;
            param2 = true;
          } else if (numero === 2) {//se habilitan los dos
            param1 = false;
            param2 = false;
          } else {
            param1 = false;
            param2 = false;
          }

          this.modelModal = {
            ...this.modelModal,
            bloquearUno: param1,
            bloquearDos: param2
          }
          const dialogRef = this._dialog.open(
            DialogFormlyComponent,
            this._dialogFormlyService.guardarReimpresion('Solicitar reimpresión', 'Solicitar', this.fieldsReimpresion, this.modelModal)
          );

          dialogRef.afterClosed().subscribe(
            async data => {
              if (data != null) {
                console.log('data recibida reimpresion _>', data);
                this.solicitarReimpresion(data);
              }
            }
          );

        } else {
          this._alertServices.error("<strong>Error</strong> al validar numero de impresiones.");
        }

      });

  }

  modelModal: any = {};
  fieldsReimpresion: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',

      fieldGroup: [
        {
          className: "col-8",
          key: 'idmotivoReimp',
          type: 'select',
          props: {
            label: 'Motivo de reimpresión',
            placeholder: 'Selecciona un motivo de reimpresión',
            valueProp: 'id',
            required: true,
            labelProp: 'desMotivoReimpresion',
            options: [],
          },
          hooks: {
            onInit: async (field) => {

              this._catalogoService.getMotivoReimpresion()
                .then(
                  (data: any) => {
                    if (data) {

                      field.props.options = data;
                    } else
                      this.alertServices.error("<strong>Error</strong> al obtener conceptos de Motivos de Reimpresión");
                  },
                  (_err) => {
                    this.alertServices.error("<strong>Error</strong> al obtener conceptos de Motivos de Reimpresión");
                  }
                );

            },

          },
        },
        {
          className: "col-md-4",
          key: 'mat_radio',
          type: 'mat-radio',
          props: {
            label: 'Número de impresiones',
            required: true,

            options: [
              { value: 1, label: 'Uno', },
              { value: 2, label: 'Dos', },
            ],
            valueProp: 'value',
          },
          hooks: {
            onInit: (field) => {
              console.log('field', field)
            }
          },
          expressionProperties: {
            'props.options[0].disabled': (model: any) => {
              //console.log('valor model1', model)
              return model.bloquearUno
            },
            'props.options[1].disabled': (model: any) => {
              //console.log('valor model2', model)
              return model.bloquearDos
            }

          }
        },

        {
          className: "col-12",
          key: 'refObsResolucInvest',
          type: 'textarea',
          props: {
            rows: 5,
            label: 'Observaciones',
            maxLength: 500,
            required: true
          },
        },
      ]
    },
  ];



  solicitarReimpresion(data) {
    let request =
    {
      "cveUsuarioAlta": this.user.cemetUsuarios[0].id,
      "idUsuarioResponsable": this.user.cemetUsuarios[0].id,
      "idSolicitudMezcla": this.dataResolucion.modelo.idSolicitudMezcla,
      "idMezcla": this.dataResolucion.modelo.idMezcla,
      "idMezclaAplicDia": this.dataResolucion.modelo.idMezclaAplicDia,
      "idMezclaAplicDiaDosis": this.dataResolucion.modelo.idMezclaAplicDiaDosis,
      "idInspecCalidadMezcla": this.dataResolucion.modelo.idInspecCalidadMezcla,
      "idMotivoReimpresion": data.idmotivoReimp,
      "refReimpresionObs": data.refObsResolucInvest,
      "numImpresionEtiqueta": data.mat_radio
    };

    this.mezclaService.solicitarReimpresion(request)
      .then(data => {
        if (data) {
          console.log('respuesta re', data)
          //envia msg13 y redirecciona a acondicionamiento
          this._alertServices.success('La solicitud de <strong>reimpresión</strong> se envió con exito.');
          setTimeout(() => this._router.navigate([this._nav.acondicionamiento]), 4000);
        } else
          this._alertServices.error("<strong>Error</strong> al solicitar reimpresión.");
      });


  }

  cerrarAprobada() {
    let request = {
      "cveUsuarioAlta": this.user.cemetUsuarios[0].id, //?
      "idUsuarioResponsable": this.user.cemetUsuarios[0].id,
      "idSolicitudMezcla": this.dataResolucion.modelo.idSolicitudMezcla,
      "idMezcla": this.dataResolucion.modelo.idMezcla,
      "idMezclaAplicDia": this.dataResolucion.modelo.idMezclaAplicDia,
      "idMezclaAplicDiaDosis": this.dataResolucion.modelo.idMezclaAplicDiaDosis,
      "idInspecCalidadMezcla": this.dataResolucion.modelo.idInspecCalidadMezcla
    }
    this.mezclaService.cerrarMezcla(request)
      .then(data => {
        if (data) {
          this.alertServices.warn('La etiqueta de la mezcla <strong>' + this.dataResolucion.modelo.cveFolioMezclaDosis + '</strong> no se imprimió.');
          if (this.dataResolucion.origen === 'acondicionamiento') {
            setTimeout(() => this._router.navigate([this._nav.acondicionamiento]), 4000); //ver si es distribución o acoondicionamiento
          } else {
            setTimeout(() => this._router.navigate([this._nav.ordenDistribucion]), 4000);
          }

        } else
          this._alertServices.error("<strong>Error</strong> al cerrar la mezcla.");
      });

  }

  imprimirAprobada(recoArray) {
    // (imprimir)
    let request =
    {
      "cveUsuarioAlta": this.user.cemetUsuarios[0].id,
      "idSolicitudMezcla": this.dataResolucion.modelo.idSolicitudMezcla,
      "idMezcla": this.dataResolucion.modelo.idMezcla,
      "idMezclaAplicDia": this.dataResolucion.modelo.idMezclaAplicDia,
      "idMezclaAplicDiaDosis": this.dataResolucion.modelo.idMezclaAplicDiaDosis,
      "idInspecCalidadMezcla": this.dataResolucion.modelo.idInspecCalidadMezcla,
      "idRecomendaciones": recoArray//[1,4,5,6]
    }
    console.log("request", request);

    //validar el nombre del endpoint
    this.mezclaService.obtenerEtiqueta(request)
      .then(data => {
        if (data) {
          this.alertServices.success('La etiqueta de la mezcla <strong>' + this.dataResolucion.modelo.cveFolioMezclaDosis + '</strong> se imprimió.');
          //llamar al servicio para imprimir las o la etiqueta
          //llama a servicio para imprimir etiqueta , IMP, evaluamos en tipo de mezcla

          if (this.dataResolucion.modelo.idTipoMezcla == 3 || this.dataResolucion.modelo.idTipoMezcla == 1) {
            this.impresionEtiquetaPdf(data);
          } else {//NTP
            this.impresionEtiquetaPdfNTP(data);
          }
          //

          //********************************************** */
          if (this.dataResolucion.origen === 'acondicionamiento') {
            setTimeout(() => this._router.navigate([this._nav.acondicionamiento]), 4000);
          } else {
            setTimeout(() => this._router.navigate([this._nav.ordenDistribucion]), 4000);
          }

        } else
          this._alertServices.error("<strong>Error</strong> al aprobar la mezcla.");
      });

  }

  impresionEtiquetaPdfNTP(data) {

    this.tablaDiluyentes = [];
    this.tablaMedicamentos = [];
    this.tablaMedicamentos2 = [];
    this.tablaMedicamentos3 = [];
    this.tablaMezcla = [];
    this.tablaPacientes = [];
    this.tablaComponentes = [];
    //let ntpEstado = false; 
    this.arrayComponentes = [];

    let numEtiquetas = data.numImpresionEtiqueta;
    let milVelInf = ' ';

    if (data.datosMezcla.refVelInfusion !== null && data.datosMezcla.refVelInfusion != undefined) {
      let num = Number(data.datosMezcla.refVelInfusion);

      if (num) {
        milVelInf = this.convertirMiles(num);
        milVelInf = String(milVelInf).concat(' ml/hrs')
      } else {
        milVelInf = data.datosMezcla.refVelInfusion
        milVelInf = String(milVelInf).concat(' ml/hrs')
      }
    }

    for (let index = 0; index < numEtiquetas; index++) {//si se imprime 1 o 2 veces


      let paciente = {
        nomMedico: data.datosMezcla.nombreMedico,
        diagnostico: data.datosMezcla.diagnostico,
        nombre: data.datosPaciente.nombrePaciente,
        fechaNac: data.datosPaciente.fecNacimiento ? data.datosPaciente.fecNacimiento : ' ',
        edad: data.datosPaciente.edad ? data.datosPaciente.edad : ' ',
        peso: data.datosPaciente.refPeso ? data.datosPaciente.refPeso : ' ',
        piso: data.datosPaciente.refNombrePiso ? data.datosPaciente.refNombrePiso : ' ',
        cama: data.datosPaciente.refNombreCama ? data.datosPaciente.refNombreCama : ' ',
        nss: data.datosPaciente.refNss ? data.datosPaciente.refNss : ' ',
        agregado: data.datosPaciente.agregadoMedico ? data.datosPaciente.agregadoMedico : ' ',
        servicio: data.datosPaciente.desServicioEspecialidad ? data.datosPaciente.desServicioEspecialidad : ' ',
        unidad: data.datosPaciente.desUnidadMedica ? data.datosPaciente.desUnidadMedica : ' '
      }
      this.tablaPacientes.push(paciente)
      let mezcla = {
        via: data.datosMezcla.desViaAdministracion ? data.datosMezcla.desViaAdministracion : ' ',
        unidadMed: data.datosMezcla.refUnidadMinMedida ? data.datosMezcla.refUnidadMinMedida : ' ',
        velocidad: milVelInf,
        fPrepa: data.datosMezcla.fechaPreparacion ? data.datosMezcla.fechaPreparacion : ' ',
        ambiente: data.datosMezcla.fechaCaducidadAmbiente ? data.datosMezcla.fechaCaducidadAmbiente : ' ',
        fria: data.datosMezcla.fechaCaducidadRedFria ? data.datosMezcla.fechaCaducidadRedFria : ' ',
        usuario: data.datosMezcla.nombreUsuarioPreparador ? data.datosMezcla.nombreUsuarioPreparador : ' ',
        folio: data.datosMezcla.cveFolioMezclaDosis ? data.datosMezcla.cveFolioMezclaDosis : ' '
      }

      this.tablaMezcla.push(mezcla);


    }//for


    // for (let index = 0; index < 60; index++) { //pruebas para ver formato de tabla 
    //   let dosis = data.componentesNpt[0].data[0].dosis ? data.componentesNpt[0].data[0].dosis + "" : ' ';
    //     let unidad = data.componentesNpt[0].data[0].unidadMedida ? data.componentesNpt[0].data[0].unidadMedida : ' '
    //     let datos = {
    //       descripcion: this.bulletPoint + data.componentesNpt[0].data[0].medicamento + ' ' + '- ' + dosis + unidad//+' '+dosis+' '+data.componentesNpt[i].data[j].unidadMedida
    //     }
    //     this.tablaComponentes.push(datos)
    // }

    //cambiar medicamentos por componentesNPT, poner todos los medi de comp en otra tabla
    let cnum = data.componentesNpt.length
    for (let i = 0; i < cnum; i++) {
      let dataNum = data.componentesNpt[i].data.length
      for (let j = 0; j < dataNum; j++) {
        let dosis = data.componentesNpt[i].data[j].dosis ? data.componentesNpt[i].data[j].dosis + "" : ' ';
        let unidad = data.componentesNpt[i].data[j].unidadMedida ? data.componentesNpt[i].data[j].unidadMedida : ' '
        let datos = {
          descripcion: this.bulletPoint + data.componentesNpt[i].data[j].medicamento + ' ' + '- ' + dosis + unidad//+' '+dosis+' '+data.componentesNpt[i].data[j].unidadMedida
        }
        this.tablaComponentes.push(datos)
      }
    }
    console.log('componentes* ', this.tablaComponentes)

    // let dil = {}

    // for (let i = 0; i < data.diluyentes.length; i++) {
    //   let dosis = data.diluyentes[i].numDosisDiluyente;
    //   let unidad = data.diluyentes[i].refUnidadMinMedida;
    //   dil = {
    //     descripcion: data.diluyentes[i].desCortaDiluyente + ' ' + '- ' + dosis + unidad
    //   }
    //   this.tablaDiluyentes.push(dil)  NP no tiene diluyentes
    // }

    let leyenda1 = ' '
    let leyenda2 = ' '

    if (data.requisitoConservacion.length > 0) {
      if (data.requisitoConservacion.length == 1) {
        leyenda1 = data.requisitoConservacion[0];
        leyenda2 = ' ';
      }
      if (data.requisitoConservacion.length == 2) {
        leyenda1 = data.requisitoConservacion[0];
        leyenda2 = data.requisitoConservacion[1];
      }
    }

    let conservacion = {
      param1: leyenda1,
      param2: leyenda2
    }

    let milOsmo = ' ';
    let milKcalTo = ' ';
    let milKcalNo = ' ';
    let milNitro = ' ';
    let milVol = ' ';
    let milProteinas = ' ';


    if (data.detalleMezclaNpt.numOsmolaridad !== null && data.detalleMezclaNpt.numOsmolaridad !== undefined) {
      milOsmo = this.convertirMiles(data.detalleMezclaNpt.numOsmolaridad);
      milOsmo = String(milOsmo).concat(' mOsmol/ml');
    }
    if (data.detalleMezclaNpt.numKcalTotales !== null && data.detalleMezclaNpt.numKcalTotales !== undefined) {
      milKcalTo = this.convertirMiles(data.detalleMezclaNpt.numKcalTotales);
      milKcalTo = String(milKcalTo).concat(' Kcal');
    }
    if (data.detalleMezclaNpt.numKcalNoProteicas !== null && data.detalleMezclaNpt.numKcalNoProteicas !== undefined) {
      milKcalNo = this.convertirMiles(data.detalleMezclaNpt.numKcalNoProteicas);
      milKcalNo = String(milKcalNo).concat(' Kcal')
    }
    if (data.detalleMezclaNpt.numNitrogeno !== null && data.detalleMezclaNpt.numNitrogeno !== undefined) {
      milNitro = this.convertirMiles(data.detalleMezclaNpt.numNitrogeno);
      milNitro = String(milNitro).concat(' gr')
    }
    if (data.detalleMezclaNpt.numVolumenTotal !== null && data.detalleMezclaNpt.numVolumenTotal != undefined) {
      milVol = this.convertirMiles(data.detalleMezclaNpt.numVolumenTotal);
      milVol = String(milVol).concat(' ml')
    }
    if (data.detalleMezclaNpt.numProteinas !== null && data.detalleMezclaNpt.numProteinas != undefined) {
      milProteinas = this.convertirMiles(data.detalleMezclaNpt.numProteinas);
      milProteinas = String(milProteinas).concat(' gr')
    }


    let nptMezcla = {
      osmolaridad: milOsmo,
      kcalNoProt: milKcalNo,
      kcalTotal: milKcalTo,
      nitrogeno: milNitro,
      kcalN: ' ',
      volTotal: milVol,
      overfill: ' ',
      velInfu: milVelInf,
      proteinas: milProteinas,
      fPrep: data.datosMezcla.fechaPreparacion ? data.datosMezcla.fechaPreparacion : ' ',
      fAmb: data.datosMezcla.fechaCaducidadAmbiente ? data.datosMezcla.fechaCaducidadAmbiente : ' ',
      fFria: data.datosMezcla.fechaCaducidadRedFria ? data.datosMezcla.fechaCaducidadRedFria : ' '
    }

    let arreglo: any = [...data.temperaturaEstabilidad];


    let minNumTemperaturaEstbAmb = Math.min(...arreglo.map(a => a.numTemperaturaEstbAmb));
    let minNumTemperaturaEstbRf = Math.min(...arreglo.map(a => a.numTemperaturaEstbRf));

    console.log('##################################### ', minNumTemperaturaEstbAmb, '           ', minNumTemperaturaEstbRf)

    this.dataEtiqueta = {
      paciente: this.tablaPacientes,
      mezcla: this.tablaMezcla,
      cons: conservacion,
      medicamento: this.tablaMedicamentos,
      diluyente: this.tablaDiluyentes,
      elabora: data.datosMezcla.nombreUsuarioElabora,
      textoCodigo: data.textoCodigoBarra,
      codigoBarra: 'data:image/png;base64,' + data.codigoBarraBytes,
      tipoMezcla: data.datosMezcla.desTipoMezcla,
      numImpresion: 2,
      nptMezcla: nptMezcla,
      direccion: data.datosMezcla.direcccion ? data.datosMezcla.direcccion : ' ',
      temperatura: data.datosMezcla.numTemperaturaEstbFormato ? data.datosMezcla.numTemperaturaEstbFormato : ' ',
      tempEstabFria: minNumTemperaturaEstbAmb + this.textGrad,
      tempEstabAmb: minNumTemperaturaEstbRf + this.textGrad,
      requisitoConservacion: data.requisitoConservacion,
    }
    //console.log('dataEtiquetanpt',this.dataEtiqueta)

    this._reporteMezclasAprobadas.createEtiquetaFormatoNTP(this.dataEtiqueta).then((data) => {
      //console.log('responseReporteEtiqueta', data)
      this._spinner.hide();
    });



  }



  convertirMiles(numero) {
    const exp = /(\d)(?=(\d{3})+(?!\d))/g;
    const rep = '$1,';
    let arr = numero.toString().split('.');
    arr[0] = arr[0].replace(exp, rep);
    return arr[1] ? arr.join('.') : arr[0];
  }


  impresionEtiquetaPdf(data) {



    this.tablaDiluyentes = [];
    this.tablaMedicamentos = [];
    this.tablaMezcla = [];
    this.tablaPacientes = [];
    this.tablaMedicamentos2 = [];
    this.tablaMedicamentos3 = [];
    this.tablaComponentes = [];

    let numEtiquetas = data.numImpresionEtiqueta;
    let milVelInfu = ' ';

    if (data.datosMezcla.refVelInfusion !== null || data.datosMezcla.refVelInfusion != undefined) {
      let num = Number(data.datosMezcla.refVelInfusion)

      if (num) {
        milVelInfu = this.convertirMiles(num);
        milVelInfu = String(milVelInfu).concat(' ml/hrs')
      } else {
        milVelInfu = data.datosMezcla.refVelInfusion
        milVelInfu = String(milVelInfu).concat(' ml/hrs')
      }


    }

    //index < numEtiquetas;
    for (let index = 0; index < numEtiquetas; index++) {

      let paciente = {
        nomMedico: data.datosMezcla.nombreMedico,
        diagnostico: data.datosMezcla.diagnostico,
        nombre: data.datosPaciente.nombrePaciente ? data.datosPaciente.nombrePaciente : ' ',
        fechaNac: data.datosPaciente.fecNacimiento ? data.datosPaciente.fecNacimiento : ' ',
        edad: data.datosPaciente.edad ? data.datosPaciente.edad : ' ',
        peso: data.datosPaciente.refPeso ? data.datosPaciente.refPeso : ' ',
        piso: data.datosPaciente.refNombrePiso ? data.datosPaciente.refNombrePiso : ' ',
        cama: data.datosPaciente.refNombreCama ? data.datosPaciente.refNombreCama : ' ',
        nss: data.datosPaciente.refNss ? data.datosPaciente.refNss : ' ',
        agregado: data.datosPaciente.agregadoMedico ? data.datosPaciente.agregadoMedico : ' ',
        servicio: data.datosPaciente.desServicioEspecialidad ? data.datosPaciente.desServicioEspecialidad : ' ',
        unidad: data.datosPaciente.desUnidadMedica ? data.datosPaciente.desUnidadMedica : ' '
      }
      this.tablaPacientes.push(paciente)
      let mezcla = {
        via: data.datosMezcla.desViaAdministracion ? data.datosMezcla.desViaAdministracion : ' ',
        unidadMed: data.datosMezcla.refUnidadMinMedida ? data.datosMezcla.refUnidadMinMedida : ' ',
        velocidad: milVelInfu,//data.datosMezcla.refVelInfusion?data.datosMezcla.refVelInfusion+' ml/hr': ' ',
        fPrepa: data.datosMezcla.fechaPreparacion ? data.datosMezcla.fechaPreparacion : ' ',
        ambiente: data.datosMezcla.fechaCaducidadAmbiente ? data.datosMezcla.fechaCaducidadAmbiente : ' ',
        fria: data.datosMezcla.fechaCaducidadRedFria ? data.datosMezcla.fechaCaducidadRedFria : ' ',
        usuario: data.datosMezcla.nombreUsuarioPreparador ? data.datosMezcla.nombreUsuarioPreparador : ' ',
        folio: data.datosMezcla.cveFolioMezclaDosis
      }

      this.tablaMezcla.push(mezcla);


    }

    let med = {}
    let unidad = ' ';
    let dosis = ' ';
    let lote = ' ';

    // for (let index = 0; index < 60; index++) { //pruebas para ver formato de tabla //hcc
    //   unidad = data.medicamentos[0].refUnidadMinMedida ? data.medicamentos[0].refUnidadMinMedida : ' ';
    //   dosis = data.medicamentos[0].numDosisMedicamento ? data.medicamentos[0].numDosisMedicamento : ' ';
    //   med = {
    //     descripcion: this.bulletPoint + data.medicamentos[0].desCortaMedicamento+' '+'- '+dosis+unidad//data.medicamentos[i].desCortaMedicamento + ' ' + dosis + ' ' + unidad
    //   }
    //   this.tablaMedicamentos.push(med)
    // }

    for (let i = 0; i < data.medicamentos.length; i++) {
      unidad = data.medicamentos[i].refUnidadMinMedida ? data.medicamentos[i].refUnidadMinMedida : ' ';
      dosis = data.medicamentos[i].numDosisMedicamento ? data.medicamentos[i].numDosisMedicamento : ' ';
      lote = data.medicamentos[i].lote ? ' Lote: '+ data.medicamentos[i].lote : ' ';
      med = {
        descripcion: this.bulletPoint + data.medicamentos[i].desCortaMedicamento + ' ' + '- ' + dosis + unidad + lote//data.medicamentos[i].desCortaMedicamento + ' ' + dosis + ' ' + unidad
      }
      this.tablaMedicamentos.push(med)
    }

    let dil = {}
    let unidadD = ' ';
    let dosisD = ' ';


    // for (let index = 0; index < 60; index++) { //pruebas para ver el formato de tablas
    //   unidadD = data.diluyentes[0].refUnidadMinMedida ?  data.diluyentes[0].refUnidadMinMedida:' ';
    //       dosisD = data.diluyentes[0].numDosisDiluyente ? data.diluyentes[0].numDosisDiluyente: ' ';
    //       dil = {
    //         descripcion:  this.bulletPoint + data.diluyentes[0].desCortaDiluyente+' '+'- '+dosisD+unidadD//data.diluyentes[i].desCortaDiluyente+' '+dosisD + ' / '+unidadD
    //       }
    //       this.tablaDiluyentes.push(dil)
    // }

    for (let i = 0; i < data.diluyentes.length; i++) {
      unidadD = data.diluyentes[i].refUnidadMinMedida ? data.diluyentes[i].refUnidadMinMedida : ' ';
      dosisD = data.diluyentes[i].numDosisDiluyente ? data.diluyentes[i].numDosisDiluyente : ' ';
      dil = {
        descripcion: this.bulletPoint + data.diluyentes[i].desCortaDiluyente + ' ' + '- ' + dosisD + unidadD//data.diluyentes[i].desCortaDiluyente+' '+dosisD + ' / '+unidadD
      }
      this.tablaDiluyentes.push(dil)
    }

    let leyenda1 = ' '
    let leyenda2 = ' '

    if (data.requisitoConservacion.length > 0) {
      if (data.requisitoConservacion.length == 1) {
        if (data.requisitoConservacion[0].includes('MANTENER') || data.requisitoConservacion[0].includes('Mantener')) {
          leyenda1 = data.requisitoConservacion[0];
          leyenda2 = ' ';
        } else {
          leyenda1 = ' ';
          leyenda2 = data.requisitoConservacion[0];
        }
      }
      if (data.requisitoConservacion.length == 2) {
        leyenda1 = data.requisitoConservacion[0];
        leyenda2 = data.requisitoConservacion[1];
      }
    }

    let conservacion = {
      param1: leyenda1,
      param2: leyenda2
    }


    let arreglo: any = [...data.temperaturaEstabilidad];

    let minNumTemperaturaEstbAmb = Math.min(...arreglo.map(a => a.numTemperaturaEstbAmb));
    let minNumTemperaturaEstbRf = Math.min(...arreglo.map(a => a.numTemperaturaEstbRf));


    this.dataEtiqueta = {
      paciente: this.tablaPacientes,
      mezcla: this.tablaMezcla,
      cons: conservacion,
      medicamento: this.tablaMedicamentos,
      diluyente: this.tablaDiluyentes,
      elabora: data.datosMezcla.nombreUsuarioElabora,
      textoCodigo: data.textoCodigoBarra,
      codigoBarra: 'data:image/png;base64,' + data.codigoBarraBytes,
      tipoMezcla: data.datosMezcla.desTipoMezcla,
      numImpresion: 2,
      direccion: data.datosMezcla.direcccion ? data.datosMezcla.direcccion : ' ',
      temperatura: data.datosMezcla.numTemperaturaEstbFormato ? data.datosMezcla.numTemperaturaEstbFormato : ' ',
      tempEstabFria: minNumTemperaturaEstbRf + this.textGrad,
      tempEstabAmb: minNumTemperaturaEstbAmb + this.textGrad,
      velocidad: milVelInfu,
      requisitoConservacion: data.requisitoConservacion,
    }
    //console.log('dataEtiqueta',this.dataEtiqueta)

    this._reporteMezclasAprobadas.createEtiquetaFormato(this.dataEtiqueta).then((data) => { //quitar formato
      //console.log('responseReporteEtiqueta', data)
      this._spinner.hide();
    });
  }

  imprimirAprobadaPre(id, observArray) {
    let request =
    {
      "cveUsuarioAlta": this.user.cemetUsuarios[0].id,
      "idSolicitudMezcla": this.dataResolucion.modelo.idSolicitudMezcla,
      "idMezcla": this.dataResolucion.modelo.idMezcla,
      "idMezclaAplicDia": this.dataResolucion.modelo.idMezclaAplicDia,
      "idMezclaAplicDiaDosis": this.dataResolucion.modelo.idMezclaAplicDiaDosis,
      "idInspecCalidadMezcla": id,
      "idRecomendaciones": observArray//[2,4,5,6]
    }
    this.mezclaService.obtenerEtiqueta(request)
      .then(data => {
        //console.log('respuestaPreImprimir',data)
        if (data) {

          //llama a servicio para imprimir etiqueta , IMP, evaluamos en tipo de mezcla
          if (this.dataResolucion.modelo.idTipoMezcla == 3 || this.dataResolucion.modelo.idTipoMezcla == 1) {
            this.impresionEtiquetaPdf(data);
          } else {//NTP
            this.impresionEtiquetaPdfNTP(data);
          }
          //
          this.alertServices.success('La etiqueta de la mezcla <strong>' + this.dataResolucion.modelo.cveFolioMezclaDosis + '</strong> se imprimió.');
          if (this.dataResolucion.origen === 'acondicionamiento') {
            setTimeout(() => this._router.navigate([this._nav.acondicionamiento]), 4000);
          } else {
            setTimeout(() => this._router.navigate([this._nav.ordenDistribucion]), 4000);
          }

        } else
          this._alertServices.error("<strong>Error</strong> al aprobar la mezcla.");
      });
  }

  preAprobarPreparada() {

    let request = {
      "cveUsuarioAlta": this.user.cemetUsuarios[0].id,
      "idUsuarioResponsable": this.user.cemetUsuarios[0].id,
      "idSolicitudMezcla": this.dataResolucion.modelo.idSolicitudMezcla,
      "idMezcla": this.dataResolucion.modelo.idMezcla,
      "idMezclaAplicDia": this.dataResolucion.modelo.idMezclaAplicDia,
      "idMezclaAplicDiaDosis": this.dataResolucion.modelo.idMezclaAplicDiaDosis,
    }
    //validar el nombre del endpoint
    this.mezclaService.aprobarPreparada(request)
      .then(data => {
        if (data) {

          //console.log('servicio correcto preaprobada ID', data)
          //se incorpora la mejora 18 y 19
          if (this.dataResolucion.modelo.idTipoMezcla == 3 || this.dataResolucion.modelo.idTipoMezcla == 1) {//antibiotico citotoxico

            const dialogRef = this._dialog.open(
              DialogFormlyComponent,
              this._dialogFormlyService.imprimirEtiquetaAntCito(this.dataResolucion.modelo.cveFolioMezclaDosis)
            );
            dialogRef.afterClosed().subscribe(
              async data1 => {
                //debugger
                if (data1 != null) {
                  console.log("data recomendaciones", data1);

                  this.imprimirAprobadaPre(data, data1.recomendaciones);


                } else {
                  console.log("data recomendaciones", data1);
                  this.cerrarAprobada();

                }
              }
            );

          }
          else if (this.dataResolucion.modelo.idTipoMezcla == 2) {//NTP

            const dialogRef = this._dialog.open(
              DialogFormlyComponent,
              this._dialogFormlyService.imprimirEtiquetaNTP(this.dataResolucion.modelo.cveFolioMezclaDosis)
            );
            dialogRef.afterClosed().subscribe(
              async data1 => {
                //debugger
                if (data1 != null) {
                  console.log("data recomendaciones", data1);

                  this.imprimirAprobadaPre(data, data1.recomendaciones);


                } else {
                  console.log("data recomendaciones", data1);
                  this.cerrarAprobada();

                }
              }
            );

          }

          /* Se cometna mejora 18 19
          const dialogRef = this.dialog.open(
            DialogComponent,
            this._dialogService.modalGenerico('Aprobación de mezcla', '¿Deseas imprimir la mezcla con folio <b>' + this.dataResolucion.modelo.cveFolioMezclaDosis + '</b>?', null, 'Imprimir')
          );
          dialogRef.afterClosed().subscribe(
            async result => {
              if (result) {//aceptar
                this.imprimirAprobadaPre(data);
              } else {//cerrar
                //console.log('cerrar Preparada acondicionamiento')
                this.cerrarAprobada();
              }
              //setTimeout(() => this._router.navigate([this._nav.acondicionamiento]), 1000);
            }
          );*/
          //llamar modal imprimir etiqueta
          //this.imprimirAprobadaPre(data);

        } else
          this._alertServices.error("<strong>Error</strong> al aprobar la mezcla.");
      });
  }

  noAprobada(data) {
    let request = {
      "cveUsuarioAlta": this.user.cemetUsuarios[0].id,
      "idUsuarioResponsable": this.user.cemetUsuarios[0].id,
      "idSolicitudMezcla": this.dataResolucion.modelo.idSolicitudMezcla,
      "idMezcla": this.dataResolucion.modelo.idMezcla,
      "idMezclaAplicDia": this.dataResolucion.modelo.idMezclaAplicDia,
      "idMezclaAplicDiaDosis": this.dataResolucion.modelo.idMezclaAplicDiaDosis,
      "idInspecCalidadMezcla": null,
      "idMotivoRechInspecCalidad": data.idmotivoRch,
      "refRechInspecCalidadObs": data.refObsResolucInvest
    }

    //console.log('request_>', request);


    this.mezclaService.noAprobarMezcla(request)
      .then(data => {
        if (data) {
          //console.log('data_______>',data)
          //envia msg27 y redirecciona a acondicionamiento
          this._alertServices.success('La mezcla <strong>' + this.dataResolucion.modelo.cveFolioMezclaDosis + '</strong> no fue aprobada.');
          setTimeout(() => this._router.navigate([this._nav.acondicionamiento]), 4000);

        } else {
          this._alertServices.error("<strong>Error</strong> al no aprobar la mezcla.");
        }

      });

  }

}
