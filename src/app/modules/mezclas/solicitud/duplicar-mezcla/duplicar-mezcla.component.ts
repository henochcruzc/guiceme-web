import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormlyFieldConfig } from '@ngx-formly/core';
import * as moment from 'moment';
import { from, Subject } from 'rxjs';
import { GeneralComponent } from 'src/app/modules/general/general.component';
import { NAV } from 'src/app/shared/config/global';
import { DialogFormlyComponent } from 'src/app/shared/dialog-formly/dialog-formly.component';
import { EstatusMezcla, TipoMezcla } from 'src/app/shared/general.enum';
import { CatalogoService } from 'src/app/shared/services/catalogo.service';
import { SeguimientoService } from 'src/app/shared/services/seguimiento.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { HeaderDetalleMezclaComponent } from "../../../../shared/layout/header-detalle-mezcla/header-detalle-mezcla.component";
import { SessionStorageService } from 'src/app/modules/login/services/session-storage.service';
import { DetalleAntibioticoComponent } from './detalle-antibiotico/detalle-antibiotico.component';
import { DetalleCitotoxicoComponent } from './detalle-citotoxico/detalle-citotoxico.component';
import { DetalleNptComponent } from './detalle-npt/detalle-npt.component';

@Component({
    selector: 'app-duplicar-mezcla',
    templateUrl: './duplicar-mezcla.component.html',
    styleUrls: ['./duplicar-mezcla.component.css','../../../../../styles-estatus.scss'],
    standalone: true,
    imports: [
        CommonModule,
        SharedModule,
        HeaderDetalleMezclaComponent
    ]
})
export class DuplicarMezclaComponent extends GeneralComponent {

  constructor() {
      super();
      this.objUrl = this._sesionStorage.getLoginUrl();
      this.refNss = this.objUrl.PAC_NSS;
      this.model = { refNss: this.objUrl.PAC_NSS };
  }

  _seguimientoService = inject(SeguimientoService);
  _catalogoService = inject(CatalogoService);
  sessionStorageService = inject(SessionStorageService)
  dataDuplicadoSolicitud = this.sessionStorageService.getDataDuplicadoSolicitud();

  desTipoMezcla: any;

  objUrl: any = {};
  maxLengthFolio: number = 20;
  refNss = '';
  model: any = {};
  form = new FormGroup({});
  fields: FormlyFieldConfig[] = [
      {
          fieldGroupClassName: 'row',
          fieldGroup: [
              {
                  key: 'refNss',
                  defaultValue: this.refNss,
              },
              {
                  key: 'valPerfil',
                  defaultValue: 'medico',
              },
              {
                  key: 'Cancelada',
                  defaultValue: true,
              },
              {
                  key: 'tMezcla',
                  defaultValue: this.dataDuplicadoSolicitud.id,
              },
              {
                  className: "col-lg-3 col-md-6",
                  key: 'rangoFechaAux',
                  type: 'material-date',
                  templateOptions: {
                      label: 'Rango de fecha',
                      range: true,
                  },

              },
              {
                  className: "col-lg-3 col-md-6",
                  key: 'estatus',
                  type: 'select',
                  props: {
                      label: 'Estatus',
                      placeholder: 'Selecciona el estatus',
                      valueProp: 'id',
                      labelProp: 'desEstatusMezcla',
                      options: from(this._catalogoService.getEstatusMezclaSeguimiento()),
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
                      radioObs: new Subject<any>(),
                  },
                  expressions: {
                      'props.maxLength': (field) => {
                          return field.model.tipoFolioAux == 1 ? 20 : 15;
                      },
                  },
                  hooks: {
                      afterViewInit: async (field) => {

                          field.props['radioObs'].subscribe(
                              (change) => {
                                  if (change == 1) {
                                      this.maxLengthFolio = 20;
                                  }
                                  if (change == 2) {
                                      this.maxLengthFolio = 15;

                                  }

                              }
                          )

                      },
                  }
              },{
                className: "col-lg-1 col-md-6",
                key: 'btn-limpiar',
                type: 'button',
                props: {
                    classBtn: 'btn-alinear widthBtn boton',
                    btnType: 'danger',
                    text: 'Limpiar',
                    label: ' ',
                    disabled: false,
                    onClick: () => {
                        this.resetForm();
                    },
                },
                expressionProperties: {
                    'props.disabled': (model: any) => {
                      if ((
                        this.form.valid)
                        && (
                            model.rangoFechaAux != undefined
                            || model.estatus != undefined
                            || (model.folioAux != undefined && model.folioAux != ''))
                    ) {
                        return false;
                    }
              
                    return true;
                    },
                },
            }, {
                className: "col-lg-1 col-md-6",
                key: 'btn-buscar',
                type: 'button',
                props: {
                    classBtn: 'btn-primary widthBtn boton',
                    text: 'Buscar',
                    label: ' ',
                    disabled: false,
                    width: '105px',
                    onClick: () => {
                        //this.getDetalleList(0, this.ConfigTabla.NUM_ELEMENTOS_TABLA)
                        //agregar el servicio de busqueda de mezclas
                        this.pageChanged(1);
                    },
                },
                expressionProperties: {
                    'props.disabled': (model: any) => {
                      if ((
                        this.form.valid)
                        && (
                            model.rangoFechaAux != undefined
                            || model.estatus != undefined
                            || (model.folioAux != undefined && model.folioAux != ''))
                    ) {
                        return false;
                    }
              
                    return true;
                    },
                },
            }
          ]
      },



  ];

  displayedColumns = ['folioSolicitud', 'folioMezcla', 'ultimaFecha', 'estatus', 'seguimiento']

  myData;
  tableDS: MatTableDataSource<any>;
  paginaActual: number = 0;

  headerData = {
      navAtras: NAV.solicitud,
      uno: [
          {
              class: 'col-lg-3',
              titulo: 'Paciente',
              texto: ''
          },
          {
              class: 'col-lg-7',
              titulo: 'Diagnóstico',
              isDiagnostico: true,
              texto: ''
          },

          {
              class: 'col-lg-2',
              texto: 'Duplicar prescripción'
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
                      texto: '',

                  },
                  {
                      separador: true,
                      titulo: 'Sexo',
                      texto: '',

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
                      texto: '',
                  },
                  {
                      separador: true,
                      titulo: 'A. Médico',
                      texto: '',
                  },
                  {
                      separador: true,
                      titulo: 'U. de Adscripción',
                      texto: '',
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
                      texto: '',
                  },

              ]

          },

      ]
  }
  collectionSize: number = 0;

  tipoMezcla = [
      "Nutrición Parenteral",
      "Antibiótico",
      "Citotóxico"
  ]

  estatus = [
      {
          descripcion: "Solicitada"
          , id: this.EstatusMezcla.SOLICITADA
      },
      {
          descripcion: "No aprobada"
          , id: this.EstatusMezcla.NO_APROBADA
      },
      {
          descripcion: "Aprobada"
          , id: this.EstatusMezcla.APROBADA
      },
      {
          descripcion: "Disponible"
          , id: this.EstatusMezcla.DISPONIBLE
      },
      {
          descripcion: "Aplicada"
          , id: this.EstatusMezcla.APLICADA
      },
      {
          descripcion: "No aplicada"
          , id: this.EstatusMezcla.NO_APLICADA
      },
      {
          descripcion: "Cancelada"
          , id: this.EstatusMezcla.CANCELADA
      },
      {
          descripcion: "ratificada"
          , id: this.EstatusMezcla.RATIFICADA
      },
      {
          descripcion: "No aprobada"
          , id: this.EstatusMezcla.NO_APROBADA_CANCELADA_SISTEMA
      }

  ]
  ngOnInit(): void {

      this.desTipoMezcla =  this.dataDuplicadoSolicitud.desTipoMezcla;

      let aux = { ...this.headerData };
      this._seguimientoService.getDatosPaciente(this.refNss).then(
          resp => {
              aux['uno'][0].texto = resp.nombrePaciente;
              aux['uno'][1].texto = resp.diagnostico;
              aux['dos'][0].informacion[0].texto = resp.edad;
              aux['dos'][0].informacion[1].texto = resp.sexo;
              aux['dos'][1].informacion[0].texto = resp.nss;
              aux['dos'][1].informacion[1].texto = resp.agregadoMedico;
              aux['dos'][1].informacion[2].texto = resp.desUnidadMedica;
              aux['dos'][2].informacion[0].texto = resp.curp;
              this.headerData = { ...aux }
          }
      )
  }


  pageChanged(event: any) {
      if (this.model.rangoFechaAux != undefined && this.model.rangoFechaAux.startDate != null && this.model.rangoFechaAux.endDate != null) {
          this.model.fecha = this.model.rangoFechaAuxString.startDate + '--' + this.model.rangoFechaAuxString.endDate;
      }
      if (this.model.tipoFolioAux == 1 && this.model.folioAux) {
          this.model.folMezcla = this.model.folioAux;
          delete this.model['folSol'];
      }
      if (this.model.tipoFolioAux == 2 && this.model.folioAux) {
          this.model.folSol = this.model.folioAux;
          delete this.model['folMezcla'];
      }

      let req = {
          page: event - 1,
          size: this.ConfigTabla.NUM_ELEMENTOS_TABLA,
          //sort:'folioSolicitud,desc',
          filtros: this.model,
      }

      this._seguimientoService.getHistorial(req).then(resp => {

          if (resp) {
              this.collectionSize = resp.totalElements;
              this.myData = resp.content;
              this.tableDS = new MatTableDataSource(this.myData);
          }

          if (this.collectionSize == 0) {
              this._alertServices.error('<strong>No se encontraron resultados</strong> con los criterios de búsqueda.');
          }
      })
  }

  onVerDetalle(elemento) {
      if (elemento.idTipoMezcla == 3) {
          let data = { mezcla: elemento, objUrl: this.objUrl, diagnostico: this.headerData['uno'][1].texto, dataSolicitudes: this.tableDS.data};
          const dialogRef = this._dialog.open(DetalleAntibioticoComponent, { disableClose: true, width: '99%', data });
          dialogRef.afterClosed();
      }
      if (elemento.idTipoMezcla == 1) {
          let data = { mezcla: elemento, objUrl: this.objUrl, diagnostico: this.headerData['uno'][1].texto, dataSolicitudes: this.tableDS.data};
          const dialogRef = this._dialog.open(DetalleCitotoxicoComponent, { disableClose: true, width: '99%', data });
          dialogRef.afterClosed();
      }
      if (elemento.idTipoMezcla == 2) {
          let data = { mezcla: elemento, objUrl: this.objUrl, diagnostico: this.headerData['uno'][1].texto, dataSolicitudes: this.tableDS.data};
          const dialogRef = this._dialog.open(DetalleNptComponent, { disableClose: true, width: '99%', data });
          dialogRef.afterClosed();
      }
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
      this.model = { ...{ tipoFolioAux: 1, rangoFechaAux: undefined, refNss: this.refNss, tMezcla: this.dataDuplicadoSolicitud.id } }
      this.form.reset(this.model)
      this.pageChanged(1);
  }


  validaAcciones() {
      if ((
          this.form.valid)
          && (
              this.model.rangoFechaAux != undefined
              || this.model.estatus != undefined
              || (this.model.folioAux != undefined && this.model.folioAux != '')
              || this.model.tMezcla != undefined)
      ) {
          return false;
      }

      return true;
  }



  // abrirModal(Component: any, data: any): Observable<any> {
  //     const dialogRef = this._dialog.open(Component, { width: '496px', data });
  //     return dialogRef.afterClosed();
  //   }



  validaFecha(dia) {
      return !(moment(dia, 'DD/MM/YYYY').isSameOrBefore(moment().add(1, 'days'), 'days'))
  }


  //validar con estatus no aprobada
  validar(element) {

      let ver = true;

      if (element.idTipoMezcla == TipoMezcla.CITOTOXICO) {
          ver = false;
      }

      if (element.estatus.id == EstatusMezcla.SOLICITADA && !this.validaFecha(element.fechaAplicaionDia)) {
          ver = false;
      }

      if (element.estatus.id != EstatusMezcla.SOLICITADA) {
          ver = false;
      }

      return ver;
  }

  shortTable(sort: Sort) {
      console.log("colName " + sort);

      const array = this.tableDS.data;
      let des = sort.direction == 'desc';
      const sortedArray = this.sortArrayOfObjects(array, sort.active, des);
      //let otherModel = {...this.modelo};
      // otherModel.content = sortedArray;
      // console.log(otherModel)
      this.tableDS = new MatTableDataSource(sortedArray);
  }

  validaTipo(){
    if (this.dataDuplicadoSolicitud.id == 3) {
        return 'espacio-anti'
    }else{
        return 'espacio-npt'
    }
  }
}
