import { CommonModule, formatDate } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { HeaderDetalleMezclaComponent } from 'src/app/shared/layout/header-detalle-mezcla/header-detalle-mezcla.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { GeneralComponent } from '../../general/general.component';

import { from, Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { SeguimientoService } from 'src/app/shared/services/seguimiento.service';
import { CatalogoService } from 'src/app/shared/services/catalogo.service';

import { DescripcionEstatusMezcla, desPerfil, EstatusMezcla, eventoBitacora, Perfil } from 'src/app/shared/general.enum';


import { NAV } from 'src/app/shared/config/global';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AplicacionMezclaService } from 'src/app/shared/services/aplicacion-mezcla.service';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { DetalleAplicacionMezcla, MezclaEsterilRequest } from 'src/app/shared/models/aplicacion-mezcla.model';
import { Estatus } from 'src/app/shared/models/estatus.model';

import { ActivatedRoute, Router } from '@angular/router';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { CamposSvComponent } from './detalle-esteril/campos-sv/campos-sv.component';
import * as moment from 'moment';
import { SignosVitalesHelper } from 'src/app/shared/signos-vtales-helper';
import { MezclasService } from 'src/app/shared/services/mezclas.service';
import { AuthService } from '../../login/services/auth.service';
@Component({
  selector: 'app-aplicacion',
  templateUrl: './aplicacion.component.html',
  standalone: true,
  styleUrls: ['./aplicacion.component.scss'],
  imports: [
    CommonModule,
    SharedModule,
    HeaderDetalleMezclaComponent,

    CamposSvComponent
  ]
})
export class AplicacionComponent extends GeneralComponent {
  public FechaActual = new Date();
  public MesAnterior = new Date(this.FechaActual.getFullYear(), this.FechaActual.getMonth() - 1, this.FechaActual.getDate());
  public FechaMinima = moment(this.MesAnterior, 'YYYY-MM-DD');
  public FechaMaxima = moment(this.FechaActual, 'YYYY-MM-DD');
  url_nss: string;
  objUrl: any = {};
  blnBuscarBloqueado: boolean = true;
  blnLimpiarBloqueado: boolean = true;
  refNss: any;

  @ViewChild('tSort', { static: true }) sort: MatSort;

  //  public minDate = moment(new Date()).add(1, 'days').format('YYYY-MM-DD');
  hoy = new Date();
  public maxdate: any;


  constructor(private router: Router,
    private _HelperSV: SignosVitalesHelper,
    public authService: AuthService
  ) {
    super();
    this.objUrl = this._sesionStorage.getLoginUrl();
    this.refNss = this.objUrl.PAC_NSS;
  }

  _mezclaService = inject(MezclasService);
  _seguimientoService = inject(SeguimientoService);
  _catalogoService = inject(CatalogoService);
  _aplicacionMezcla = inject(AplicacionMezclaService);
  folioMezcla: string = '';
  folioSolicitud: string = '';

  model: any = {};
  filtros: any = {};
  form = new FormGroup({});

  displayedColumns = ['folioSolicitudMezcla', 'folioMezclaDosis', 'desTipoMezcla', 'fechaAplicacion', 'desEstatusMezcla']

  myData;
  tableDS: MatTableDataSource<any>;
  paginaActual: number = 0;
  headerDataDetalle: any;
  headerData: any;

  collectionSize: number = 0;
  maxLengthFolio: number = 20;





  fields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [

        {
          className: "col-lg-3 col-md-6",
          key: 'rangoFechaAux',
          type: 'material-date',
          props: {
            label: 'Rango de fecha',
            range: true,
            //   minDate: this.minDate,

            numDias: 30,
            minDate: this.FechaMinima,
            maxDate: this.FechaMaxima,
          },

        },

        {
          className: "col-lg-3 col-md-6",
          key: 'tipoMezcla',
          type: 'select',
          props: {
            label: 'Tipo de mezcla estéril',
            placeholder: 'Selecciona un tipo de mezcla',
            valueProp: 'id',
            labelProp: 'desTipoMezcla',
            // options: from(this._catalogoService.getTipoMezcla()),
          },
          hooks: {
            onInit: async (field) => {
              let lst = [];
              this._catalogoService.getTipoMezcla()
                .then(
                  (data: any) => {
                    if (data) {
                      //        console.log(data)
                    
                      for (let r of data) {
                        if (!r.desTipoMezcla.toLowerCase().includes('citotóxico')) {
                          lst.push(r);
                        }
                      }
                      field.props.options = lst;

                    }
                  },
                  (_err) => { }
                );
            },
          },

        },
        {
          className: "col-lg-3 col-md-6",
          key: 'folioAux',
          type: 'input-folio',
          props: {
            label: 'Folio',
            placeholder: 'Ingresa el folio',
            tipoFolioAuxDefault: '1',
            maxLength: 20,
            pattern: /^([A-Za-z0-9]*)$/,
            attributes: {
              autocomplete: 'off',
            },
          },
          expressions: {
            'props.maxLength': (field) => {
              return field.model.tipoFolioAux == 1 ? 20 : 15;
            },
          },
          hooks: {
            /*   afterViewInit: async (field) => {
  
                field.props['folioAux'].subscribe(
                  (change) => {
                    if (change == 1) {
                      this.maxLengthFolio = 20;
                    }
                    if (change == 2) {
                      this.maxLengthFolio = 15;
  
                    }
  
                  }
                )
  
              }, */
          },
          validation: {
            messages: {

              pattern: (error: any, field: FormlyFieldConfig) => `Sólo letras y números`,
            }


          },
        },
        {
          className: "col-lg-1 col-md-2",
          key: 'btn-limpiar',
          type: 'button',
          props: {
            classBtn: 'boton btn-danger',
            text: 'Limpiar',
            label: ' ',
            disabled: this.blnLimpiarBloqueado,
            onClick: () => {

              this.resetForm();
            },
          }, expressionProperties: {
            'props.disabled': () => {
              return this.validaForm();

            },
          },

        },
        {
          className: "col-lg-1 col-md-2",



        },

        {
          className: "col-lg-1 col-md-2 ",
          key: 'btn-buscar',
          type: 'button',
          props: {
            classBtn: 'boton btn-primary ',
            text: 'Buscar',
            label: ' ',
            disabled: this.blnBuscarBloqueado,
            onClick: () => {

              this.pageChanged(1);
            },
          }
          , expressionProperties: {
            'props.disabled': () => {
              return this.validaForm();

            },
          },
        }



      ]
    },



  ];
  idUsuarioMedico: number;
  cveUsuarioAlta: number;

  ngOnInit(): void {


    this._mezclaService.getUsuario(this.objUrl.medico_mat, this.objUrl.medico_nombre, this.objUrl.medico_apaterno, this.objUrl.medico_amaterno, this.objUrl.PAC_AMEDICO, Perfil.ENFERMERIA).then(
      (respuesta) => {
        if (respuesta != null) {
          this.cveUsuarioAlta = respuesta.id;
          this.idUsuarioMedico = respuesta.id;
          //  console.log("getusuario: ",respuesta);

          //se integra evento bitacora en inicio de sesion 
          let model ={
            "idEvento": eventoBitacora.LOGIN_EXITOSO_PHEDS_APLICACION,
            "cveUsuario": respuesta.id,
            "refNombreUsuario": this.objUrl.medico_nombre + ' ' + this.objUrl.medico_apaterno + ' ' + this.objUrl.medico_amaterno,
            "refPerfilUsuario": desPerfil.ENFERMERIA
          }
          this.authService.eventoBitacora(model)
        }
      }
    )

    this.blnBuscarBloqueado = true;
    this.blnLimpiarBloqueado = true;
    this.hoy = new Date();
    // this.maxdate = moment(this.hoy, 'YYYY-MM-DD').add(0, 'days').format('YYYY-MM-DD');
    const currentYear = this.hoy.getFullYear();
    const currentMonth = this.hoy.getMonth();
    const currentDay = this.hoy.getDay();

    // this.minDate = new Date(currentYear,0);

    this.maxdate = new Date(currentYear, currentMonth, currentDay);
    this.fillHeaderData();
    console.log("AplicacionComponent");

    let aux = { ...this.headerData };
    this._seguimientoService.getDatosPaciente(this.refNss).then(
      resp => {
        console.log(resp)
        aux['uno'][0].texto = resp.nombrePaciente ? resp.nombrePaciente : 'SIN DATO';
        aux['uno'][1].texto = resp.diagnostico;
        aux['dos'][0].informacion[0].texto = resp.edad;
        aux['dos'][0].informacion[1].texto = resp.sexo;
        aux['dos'][1].informacion[0].texto = resp.nss;
        aux['dos'][1].informacion[1].texto = resp.agregadoMedico;
        aux['dos'][1].informacion[2].texto = resp.refUnidadMedicaHosp;
        aux['dos'][2].informacion[0].texto = resp.curp;

        this.headerData = { ...aux }
      }
    )
    this.pageChanged(1);
  }


  validaForm(): boolean {
    let res: boolean;

    if (this.model.folioAux != null && this.model.folioAux?.length > 0
      || this.model.rangoFechaAux?.endDate != null || this.model.rangoFechaAux?.startDate != null
      || this.model.fechaFinal != null || this.model.fechaInicial != null
      || this.model.tipoMezcla != null) {

      res = false;
    } else {

      res = true;
    }

    return res;
  }




  fillHeaderData() {
    this.headerData = {
      uno: [
        {
          class: 'col-lg-3',
          titulo: 'Paciente',
          texto: '--'
        },

        {
          class: 'col-lg-6',
          titulo: 'Diagnóstico',
          isDiagnostico: true,
          texto: '--'
        },

        {
          class: 'col-lg-3',
          texto: 'Aplicación de mezcla'
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
              texto: '--'

            },
            {
              separador: true,
              titulo: 'Sexo',
              texto: '--'

            }
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
              texto: '--'
            },
            {
              separador: true,
              titulo: 'A. Médico',
              texto: '--'
            },
            {
              separador: true,
              titulo: 'U.M. de Aplicación',
              texto: '--'
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
              texto: '--'
            },

          ]

        },

      ]
    }
  }

  fillHeaderDetalle() {
    this.headerDataDetalle = {
      uno: [
        {
          class: 'col-lg-2',
          titulo: 'Folio de mezcla',
          texto: this.folioMezcla
        },
        {
          class: 'col-lg-2',
          titulo: 'Folio de solicitud',
          texto: this.folioSolicitud
        },
        {
          class: 'col-lg-5',
          titulo: 'Diagnóstico',
          isDiagnostico: true,
          texto: this.headerData['uno'][1].texto
        },

        {
          class: 'col-lg-3',
          texto: 'Aplicación de mezcla'
        },
      ],
      dos: this.headerData['dos'],


    }

  }

  pageChanged(event: any) {
    //this.form.reset(this.filtros)
    //console.log("model buscar: ", this.model);


    if (this.model.rangoFechaAuxString) {

      if (this.model.rangoFechaAuxString.startDate != null) {

        this.filtros.fechaInicial = this.model.rangoFechaAuxString.startDate;

      } else {
        delete this.filtros['fechaInicial'];
      }
      if (this.model.rangoFechaAuxString.endDate != null) {
        this.filtros.fechaFinal = this.model.rangoFechaAuxString.endDate;
      } else {
        delete this.filtros['fechaFinal'];
      }


      delete this.filtros['rangoFechaAuxString'];
      delete this.filtros['rangoFecha'];
    }



    if (this.model.tipoFolioAux == '1' || this.model.tipoFolioAux == '2'
      && this.model.folioAux?.length != 0) {

      if (this.model.tipoFolioAux == '1' && this.model.folioAux) {//1 folio solcitus

        this.filtros.folioMezclaDosis = this.model.folioAux;
        delete this.filtros['folioMezcla'];
        delete this.filtros['tipoFolioAux'];
        delete this.filtros['folioAux'];
        delete this.filtros['folioSolicitudMezcla'];
      }




      if (this.model.tipoFolioAux == '2' && this.model.folioAux) {//2 folio de mezcla
        this.filtros.folioSolicitudMezcla = this.model.folioAux;

        delete this.filtros['folioMezcla'];
        delete this.filtros['tipoFolioAux'];
        //delete this.filtros['folioAux'];
        delete this.filtros['folioMezclaDosis'];

      }

    }

    if (this.model.tipoMezcla) {
      this.filtros.tipoMezcla = this.model.tipoMezcla;


    } else {
      delete this.filtros['tipoMezcla'];

    }



    this.filtros.page = event - 1;
    this.filtros.size = this.ConfigTabla.NUM_ELEMENTOS_TABLA;
    this.filtros.refNss = this.refNss;

    //console.log("getHistorialMezclas: ", this.filtros);
    this.myData = [];
    //  this._seguimientoService.getHistorial(req).then(resp => {
    this._aplicacionMezcla.getHistorialMezclas(this.filtros)
      .then((resp: MezclaEsterilRequest) => {
        //  .subscribe((resp: MezclaEsterilRequest) => {
        //console.log("resultados: ", resp);
        if (resp != null) {
          if (resp.content != null) {
            let lst: any = [];
            for (let reg of resp.content) {
              if (reg.idEstatus == 9) {
                reg.desEstatusMezcla = 'Por aplicar';
              }
              lst.push(reg);
            }
            this.myData = lst;
            this.collectionSize = resp.totalElements;
            this.totalElements = resp.totalElements;
            this.pageSize = resp.numberOfElements;
          } else {
            this.totalElements = 0;
            this.collectionSize = 0;
            this._alertServices.error(this._Mensajes.MSG25);
          }

          this.tableDS = new MatTableDataSource(this.myData);
        } else {
          this.pageSize = 0;
          this.collectionSize = 0;
          this.totalElements = 0;
          this.tableDS = new MatTableDataSource(this.myData);

          this._alertServices.error(this._Mensajes.MSG25);
        }


        this.tableDS.sort = this.sort;



      })
  }

  totalElements = 0;
  pageSize = 0;

  findClass(estatus, aplicar, proceso) {
    let est = estatus.toLowerCase();
    let color = '';
    switch (est) {
      case DescripcionEstatusMezcla.EN_PROCESO:
        color = 'purple';
        break;
      case DescripcionEstatusMezcla.POR_APLICAR:
        color = 'blue';
        break;
      case DescripcionEstatusMezcla.NO_APLICADA://No aprobada
        color = 'orange';
        break;
      case DescripcionEstatusMezcla.APLICADA://Aprobada
        color = 'green';
        break;


      default:
        break;
    }
    if (aplicar == 1) {
      color = 'blue';
    }
    if (proceso == 1) {
      color = 'purple';
    }
    return color;
  }

  findClassClock(tipo) {
    switch (tipo) {

      case DescripcionEstatusMezcla.EN_PROCESO:
        return 'blue';

      case DescripcionEstatusMezcla.NO_APLICADA://No aprobada
        return 'orange';

      case DescripcionEstatusMezcla.APLICADA://Aprobada
        return 'green';


      default:
        break;
    }


    return '';
  }

  detalleEsterilAntibiotico: DetalleAplicacionMezcla;


  setParametros(detalle: DetalleAplicacionMezcla): void {
    sessionStorage.setItem(window.btoa('CEME'), window.btoa(encodeURIComponent(JSON.stringify(detalle))));
  }
  onVerDetalle(elemento) {
    this.detalleEsterilAntibiotico = new DetalleAplicacionMezcla();
    this.folioMezcla = elemento.folioMezclaDosis;
    this.folioSolicitud = elemento.folioSolicitudMezcla;
    this.fillHeaderDetalle();

    this.detalleEsterilAntibiotico.header = this.headerDataDetalle;
    //console.log('headerDataDetalle: ', this.headerDataDetalle);
    this.detalleEsterilAntibiotico.parametros = this._HelperSV.getParametrosSV(this.headerDataDetalle.dos[2].informacion[0].texto),
      this.detalleEsterilAntibiotico.idPersona = this.idUsuarioMedico;
    this.detalleEsterilAntibiotico.idClaveAlta = this.cveUsuarioAlta;
    //console.log("lo que manda: ", this.detalleEsterilAntibiotico);
    let estatus = new Estatus();
    estatus.descripcion = elemento.aplicacion;
    estatus.id = elemento.idEstatus;
    elemento.estatus = estatus;


    //let registro = { ...{ folioMezcla: elemento.folioMezclaDosis } }


    // elemento.folioMezcla = elemento.folioMezclaDosis;
    this.detalleEsterilAntibiotico.registro = elemento;
    //console.log("se manda a detalle: ", this.detalleEsterilAntibiotico);
    this.setParametros(this.detalleEsterilAntibiotico);
    // let data = { registro: elemento, objUrl: this.objUrl, diagnostico: this.headerData['uno'][1].texto };
    switch (elemento.desTipoMezcla.toLowerCase().trim()) {
      case 'antibiótico':
        this.router.navigateByUrl(NAV.aplicacionDetalleAntibiotico);
        break;
      case 'nutrición parenteral':
        this.router.navigateByUrl(NAV.aplicacionDetalleNPT);
        break;

      default:
        break;
    }

    /* 
         const dialogRef = this._dialog.open(DetalleCitotoxicoComponent, { disableClose: true, width: '99%', data });
        dialogRef.afterClosed();  */

    /*     let data = { registro: elemento, objUrl: this.objUrl, diagnostico: this.headerData['uno'][1].texto };
   
   
        const dialogRef = this._dialog.open(DetalleMezclaAntibioticoComponent, { disableClose: true, width: '99%', data });
       dialogRef.afterClosed(); */





  }

  fieldsRat: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: "col-lg-3 col-md-6",
          key: 'EstatusMezcla',
          type: 'select',
          props: {
            label: 'Tipo de mezcla',
            placeholder: 'Selecciona el tipo de mezcla',
            valueProp: 'id',
            labelProp: 'desEstatusMezcla',
            options: [],
          },
        },
      ]
    },
  ];

  resetForm() {


    this.model = { ...{ tipoFolioAux: '1' } }
    this.filtros = { ...{} }
    this.form.reset(this.model)
    this.form.reset(this.filtros)

    this.pageChanged(1);
  }



  findClassSeguimiento(tipo, columna) {


    if (columna == 1 && tipo == EstatusMezcla.SOLICITADA) { // solicitada
      return 'blue'
    }
    if (columna == 1 && tipo == EstatusMezcla.CANCELADA) { // cancelada
      return 'red'
    }

    if ((columna == 2 || columna == 3 || columna == 4) && (tipo == EstatusMezcla.SOLICITADA || tipo == EstatusMezcla.CANCELADA)) {
      return 'gray'
    }

    if (columna == 2 && (tipo == EstatusMezcla.NO_APROBADA || tipo == EstatusMezcla.RATIFICADA)) { // no aprobada
      return 'orange'
    }

    if (columna == 2 && tipo == EstatusMezcla.NO_APROBADA_CANCELADA_SISTEMA) { // no aprobada cancelada por sistema
      return 'red'
    }

    if (columna == 2 && tipo == EstatusMezcla.APROBADA) { // aprobada
      return 'blue'
    }

    if ((columna == 3 || columna == 4) && (tipo == EstatusMezcla.NO_APROBADA || tipo == EstatusMezcla.APROBADA)) {
      return 'gray'
    }
    if ((columna == 1 || columna == 2) && (tipo == EstatusMezcla.NO_APROBADA || tipo == EstatusMezcla.APROBADA || tipo == EstatusMezcla.DISPONIBLE || tipo == EstatusMezcla.NO_APROBADA_CANCELADA_SISTEMA || tipo == EstatusMezcla.RATIFICADA)) {
      return 'blue no-border'
    }

    if (columna == 3 && tipo == EstatusMezcla.DISPONIBLE) { // disponible
      return 'blue'
    }

    if (columna == 4 && tipo == EstatusMezcla.APLICADA) { // aplicada
      return 'green'
    }
    if (columna == 4 && tipo == EstatusMezcla.NO_APLICADA) { // No aplicada
      return 'orange'
    }

    if ((tipo == EstatusMezcla.APLICADA) && (columna == 1 || columna == 2 || columna == 3)) { // No aplicada
      return 'green no-border'
    }
    if ((tipo == EstatusMezcla.NO_APLICADA) && (columna == 1 || columna == 2 || columna == 3)) { // No aplicada
      return 'blue no-border'
    }

    return 'gray';



  }

  findClassHrR(tipo, columna) {


    if ((columna == 1) && (tipo == EstatusMezcla.NO_APROBADA || tipo == EstatusMezcla.APROBADA || tipo == EstatusMezcla.NO_APROBADA_CANCELADA_SISTEMA || tipo == EstatusMezcla.RATIFICADA)) {
      return 'blue'
    }

    if ((columna == 1 || columna == 2) && (tipo == EstatusMezcla.DISPONIBLE)) {
      return 'blue'
    }

    if ((tipo == EstatusMezcla.APLICADA) && (columna == 1 || columna == 2 || columna == 3)) {
      return 'green'
    }
    if ((tipo == EstatusMezcla.NO_APLICADA) && (columna == 1 || columna == 2 || columna == 3)) {
      return 'blue'
    }

    return 'gray';


  }

  findClassHrL(tipo, columna) {
    if ((columna == 2) && (tipo == EstatusMezcla.NO_APROBADA || tipo == EstatusMezcla.APROBADA || tipo == EstatusMezcla.DISPONIBLE || tipo == EstatusMezcla.NO_APROBADA_CANCELADA_SISTEMA || tipo == EstatusMezcla.RATIFICADA)) {
      return 'blue'
    }
    if ((columna == 3) && (tipo == EstatusMezcla.DISPONIBLE)) {
      return 'blue'
    }
    if ((tipo == EstatusMezcla.APLICADA) && (columna == 1 || columna == 2 || columna == 3 || columna == 4)) {
      return 'green'
    }
    if ((tipo == EstatusMezcla.NO_APLICADA) && (columna == 1 || columna == 2 || columna == 3 || columna == 4)) {
      return 'blue'
    }

    return 'gray';

  }



  shortTable(sort: Sort) {


    const array = this.tableDS.data;
    let des = sort.direction == 'desc';
    const sortedArray = this.sortArrayOfObjects(array, sort.active, des);
    //let otherModel = {...this.modelo};
    // otherModel.content = sortedArray;
    // console.log(otherModel)
    this.tableDS = new MatTableDataSource(sortedArray);
  }
}
