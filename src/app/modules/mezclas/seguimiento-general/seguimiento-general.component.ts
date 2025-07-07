import { CommonModule } from '@angular/common';
import { Component, inject,  ViewChild } from '@angular/core';
import { from } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatTableDataSource } from '@angular/material/table';
import { GeneralComponent } from '../../general/general.component';
import { EstatusMezcla } from 'src/app/shared/general.enum';
import { SeguimientoService } from 'src/app/shared/services/seguimiento.service';
import { CatalogoService } from 'src/app/shared/services/catalogo.service';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { SeguimientoGeneralService } from 'src/app/shared/services/seguimiento-general.service';
import { MatExpansionPanel } from '@angular/material/expansion';
import { DetalleMezclaAntibioticoComponent } from './detalle-mezcla-antibiotico/detalle-mezcla-antibiotico.component';
import { DetalleMezclaNptComponent } from './detalle-mezcla-npt/detalle-mezcla-npt.component';
import { DetalleMezclaCitotoxicoComponent } from './detalle-mezcla-citotoxico/detalle-mezcla-citotoxico.component';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Mezcla } from 'src/app/shared/models/mezcla.model';

import * as moment from 'moment';

@Component({
  selector: 'app-seguimiento-general',
  standalone: true,
  templateUrl: './seguimiento-general.component.html',
  styleUrls: ['./seguimiento-general.component.scss','../../../../styles-estatus.scss'],
  imports: [
    CommonModule,
    SharedModule,

  ],
  viewProviders: [MatExpansionPanel]
})
export class SeguimientoGeneralComponent extends GeneralComponent {
  public FechaActual = new Date();
  public MesAnterior = new Date(this.FechaActual.getFullYear(), this.FechaActual.getMonth(), this.FechaActual.getDate()-30);
  public minDate = moment(this.MesAnterior).format('YYYY-MM-DD');
  public maxdate = moment(this.minDate, 'YYYY-MM-DD').add(60, 'days').format('YYYY-MM-DD');
  constructor(private _liveAnnouncer: LiveAnnouncer,

  ) {
    super();




  }
  @ViewChild(MatSort) sort: MatSort;
  _seguimientoGeneralService = inject(SeguimientoGeneralService);
  _seguimientoService = inject(SeguimientoService);
  _catalogoService = inject(CatalogoService);


  blnBuscarBloqueado: boolean = true;
  blnLimpiarBloqueado: boolean = true;
  objUrl: any = {};
  usuario: any;
  id: any = 0;
  refNss = '';
  model: any = {};

  form = new FormGroup({});
  fields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [

        {
          className: "col-lg-3 col-md-6",
          key: 'folioMezcla',
          type: 'input',
          props: {
            label: 'Folio de mezcla',
            placeholder: 'Ingresa folio de la mezcla',
            maxLength: 20,
            pattern: /^([A-Za-z0-9]*)$/,
            attributes: {
              autocomplete: 'off',
            },
          },
          validation: {
            messages: {

              pattern: (error: any, field: FormlyFieldConfig) => `Sólo letras y números`,
            }


          },

        },

        {
          className: "col-lg-3 col-md-6",
          key: 'estatus',
          type: 'select',
          props: {
            label: 'Estatus mezcla',
            placeholder: 'Selecciona estatus',
            valueProp: 'id',
            labelProp: 'desEstatusMezcla',
            options: from(this._seguimientoGeneralService.getEstatusMezcla()),
          },



        },

        {
          className: "col-lg-3 col-md-6",
          key: 'tMezcla',
          type: 'select',
          props: {
            label: 'Tipo de mezcla',
            placeholder: 'Selecciona tipo de mezcla',
            valueProp: 'id',
            labelProp: 'desTipoMezcla',
            options: from(this._catalogoService.getTiposMezcla()),
          },

        },
        {
          className: "col-lg-3 col-md-6",
          key: 'rangoFechaAux',
          type: 'material-date',
          templateOptions: {
            label: 'Rango de fechas',
            range: true,
            minDate: this.minDate,
            maxDate: this.maxdate,
          },

        }
      ]
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup: [

        {
          className: "col-lg-3 col-md-6",
          key: 'nss',
          type: 'input-mask',
          props: {

            label: 'NSS',
            placeholder: 'Ingresa NSS',
            appInputMaskType: 'integer',
            maxLength: 10,

            attributes: {
              autocomplete: 'off',
            },
          },



        },

        {
          className: "col-lg-3 col-md-6",
          key: 'um',
          type: 'select',
          props: {

            label: 'Unidad Médica',
            placeholder: 'Selecciona unidad médica',


            valueProp: 'id',
            labelProp: 'desUnidadMedica',
          //  options: from(this._catalogoService.getUnidadesMedicasByCentral(this.id)),
          },
          hooks: {
            onInit: async (field) => {
              this.usuario = this._accountService.getUser();
              let id = this.usuario.cemetUsuarios[0].idCentralMezcla.id;
              this._catalogoService.getUnidadesMedicasByCentral(id)
                .then(
                  (data: any) => {
                    if (data) {
              //        console.log(data)
                      field.props.options = data;
                    
                    }
                  },
                  (_err) => { }
                );
            },
          },
        },
        {
          className: "col-lg-1 col-md-6",
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
          className: "col-lg-1 col-md-6 ancho",
          key: 'btn-buscar',
          type: 'button',
          props: {
            classBtn: 'boton btn-primary btnLeft',
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

  displayedColumns = ['folioSolicitud', 'folioMezcla', 'tipoMezcla', 'ultimaFecha', 'estatus', 'seguimiento']

  myData;
  tableDS: MatTableDataSource<any>;
  paginaActual: number = 1;


  collectionSize: number = 0;

  validaForm(): boolean {
    let res: boolean;
    if (this.model.folioMezcla != null && this.model.folioMezcla?.length > 0
      || this.model.folMezcla != null && this.model.folMezcla?.length > 0
      //|| this.model.folsol != null && this.model.folsol?.length > 0
      || this.model.nss != null && this.model.nss?.length > 0
      || this.model.fecha != null && this.model.fecha?.length > 0
      || this.model.refNss != null && this.model.refNss?.length > 0
      || this.model.estatus != null || this.model.tMezcla != null
      || this.model.rangoFechaAux?.endDate != null || this.model.rangoFechaAux?.startDate != null
      || this.model.rangoFechaAuxString?.startDate != null || this.model.rangoFechaAuxString?.endDate != null
      || this.model.um != null) {

      res = false;

    } else {

      res = true;

    }
    return res;
  }



  ngOnInit(): void {
    this.usuario = this._accountService.getUser();

    this.id = this.usuario.cemetUsuarios[0].idCentralMezcla.id;



    this.pageChanged(1);


  }
  tp: number = 0;

  filtros: any;
  totalElements = 0;
  pageSize = 0;
  pageChanged(event: any) {

    



    if (this.model.rangoFechaAuxString) {

      if (this.model.rangoFechaAuxString.startDate != null
        && this.model.rangoFechaAuxString.endDate != null
      ) { }
      this.model.fecha = this.model.rangoFechaAuxString?.startDate + '--' + this.model.rangoFechaAuxString?.endDate;

      delete this.model['rangoFechaAuxString'];
      delete this.model['rangoFechaAux'];
    }
    if (this.model.folioMezcla) {
      this.model.folMezcla = this.model.folioMezcla;
      delete this.model['folioMezcla'];
    }

    if (this.model.nss) {
      this.model.refNss = this.model.nss;
      delete this.model['nss'];
    }


    if (this.model.um) {
      this.model.idUni = this.model.um;

    }



    this.myData = [];


    this.model.v2='true';
    let req = {

      page: event - 1,
      size: this.ConfigTabla.NUM_ELEMENTOS_TABLA,

      filtros: this.model,
    }

    this._seguimientoGeneralService.getHistorialMezclas(req)
      .then(resp => {

        this.tp = resp.totalPages;
        if (resp.content?.length != 0) {
          this.collectionSize = resp.totalElements;// resp.content.length;
          this.myData = resp.content;
          this.pageSize = resp.numberOfElements;
          // this.fillEjemplo();
        
       
          this.tableDS = new MatTableDataSource(this.myData);
          this.tableDS.sort = this.sort;
        } else {
          this.pageSize = 0;
          this.myData = [];
          this.collectionSize = 0;
          this.tableDS = new MatTableDataSource(this.myData);
          this.sinResultados();
        }

      })
  }





  onVerDetalle(elemento) {
    let element: Mezcla = new Mezcla();
    element.fechaAplicaionDia = elemento.fechaAplicaionDia;
    element.folioMezcla = elemento.folioMezcla;
    element.folioSolicitud = elemento.folioSolicitud;
    element.idMezclaAplicDiaDosis = elemento.idMezclaAplicDiaDosis;
    element.refNss = elemento.refNss;
    element.estatus = elemento.estatus;
    element.idTipoMezcla = elemento.idTipoMezcla;


    if (element.idTipoMezcla == 3) {//antibiotico

      let data = { registro: element };

      const dialogRef = this._dialog.open(DetalleMezclaAntibioticoComponent, { disableClose: true, width: '99%', data });
      dialogRef.afterClosed();
    }
    if (elemento.idTipoMezcla == 1) {//citotoxico
      let data = { registro: element };
      const dialogRef = this._dialog.open(DetalleMezclaCitotoxicoComponent, { disableClose: true, width: '99%', data });
      dialogRef.afterClosed();
    }
    if (elemento.idTipoMezcla == 2) {//npt
      let data = { mezcla: element, registro: element, objUrl: this.objUrl };
      //const dialogRef = this._dialog.open(DetalleNptComponent, { disableClose: true, width: '99%', data });
      const dialogRef = this._dialog.open(DetalleMezclaNptComponent, { disableClose: true, width: '99%', data });
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

    this.blnBuscarBloqueado = true;
    this.blnLimpiarBloqueado = true;
    this.model.rangoFechaAux = null;
    this.model.rangoFechaAuxString = null;
    
    this.model = { ...{} }
    this.filtros = { ...{} }
    this.form.reset(this.model)
    this.form.reset(this.filtros)
    this.form.reset();
    console.log("tiene que impiar ", this.model);
    console.log("tiene que impiar ", this.filtros);
    this.pageChanged(1);
   //this.ngOnInit();
  }


 
  public sinResultados() {
    this._alertServices.error(this._Mensajes.MSG25);

  }

  lstRegistros = [];
  fillEjemplo() {
    this.lstRegistros =
      [
        {
          "nombre": "MANUEL EDUARDO DE GUGLIELMO DE GUGLIELMO",
          "fechaHora": "13/03/2024 01:27",
          "perfil": "Médico",
          "estatus": {
            "id": 1,
            "descripcion": "Solicitada"
          }
        },
        {
          "nombre": "MANUEL EDUARDO DE GUGLIELMO DE GUGLIELMO",
          "fechaHora": "13/03/2024 01:27",
          "perfil": "Médico",
          "estatus": {
            "id": 16,
            "descripcion": "Cancelada"
          }
        },
        {
          "nombre": "MANUEL EDUARDO DE GUGLIELMO DE GUGLIELMO",
          "fechaHora": "13/03/2024 01:27",
          "perfil": "Médico",
          "estatus": {
            "id": 3,
            "descripcion": "Aprobada"
          }
        },
        {
          "nombre": "MANUEL EDUARDO DE GUGLIELMO DE GUGLIELMO",
          "fechaHora": "13/03/2024 01:27",
          "perfil": "Médico",
          "estatus": {
            "id": EstatusMezcla.NO_APROBADA,
            "descripcion": "no aprobada"
          }
        },
        {
          "nombre": "MANUEL EDUARDO DE GUGLIELMO DE GUGLIELMO",
          "fechaHora": "13/03/2024 01:27",
          "perfil": "Médico",
          "estatus": {
            "id": 14,
            "descripcion": 'No Aprobada (Cancelada por sistema)'
          }
        },
        {
          "nombre": "MANUEL EDUARDO DE GUGLIELMO DE GUGLIELMO",
          "fechaHora": "13/03/2024 01:27",
          "perfil": "Médico",
          "estatus": {
            "id": 13,
            "descripcion": "Ratificada"
          }
        },
        {
          "nombre": "MANUEL EDUARDO DE GUGLIELMO DE GUGLIELMO",
          "fechaHora": "13/03/2024 01:27",
          "perfil": "Médico",
          "estatus": {
            "id": 4,
            "descripcion": "en preparacion"
          }
        },
        {
          "nombre": "MANUEL EDUARDO DE GUGLIELMO DE GUGLIELMO",
          "fechaHora": "13/03/2024 01:27",
          "perfil": "Médico",
          "estatus": {
            "id": 5,
            "descripcion": "preparada"
          }
        },
        {
          "nombre": "MANUEL EDUARDO DE GUGLIELMO DE GUGLIELMO",
          "fechaHora": "13/03/2024 01:27",
          "perfil": "Médico",
          "estatus": {
            "id": 6,
            "descripcion": "no aprobada por MA"
          }
        },




        {
          "nombre": "MANUEL EDUARDO DE GUGLIELMO DE GUGLIELMO",
          "fechaHora": "13/03/2024 01:27",
          "perfil": "Médico",
          "estatus": {
            "id": 7,
            "descripcion": "disponible"
          }
        },
        {
          "nombre": "MANUEL EDUARDO DE GUGLIELMO DE GUGLIELMO",
          "fechaHora": "13/03/2024 01:27",
          "perfil": "Médico",
          "estatus": {
            "id": 8,
            "descripcion": "en ruta"
          }
        },
        {
          "nombre": "MANUEL EDUARDO DE GUGLIELMO DE GUGLIELMO",
          "fechaHora": "13/03/2024 01:27",
          "perfil": "Médico",
          "estatus": {
            "id": 10,
            "descripcion": "rechazada por um "
          }
        },
        {
          "nombre": "MANUEL EDUARDO DE GUGLIELMO DE GUGLIELMO",
          "fechaHora": "13/03/2024 01:27",
          "perfil": "Médico",
          "estatus": {
            "id": 9,
            "descripcion": "recibida por  um"
          }
        },
        {
          "nombre": "MANUEL EDUARDO DE GUGLIELMO DE GUGLIELMO",
          "fechaHora": "13/03/2024 01:27",
          "perfil": "Médico",
          "estatus": {
            "id": 11,
            "descripcion": "aplicada"
          }
        },
        {
          "nombre": "MANUEL EDUARDO DE GUGLIELMO DE GUGLIELMO",
          "fechaHora": "13/03/2024 01:27",
          "perfil": "Médico",
          "estatus": {
            "id": 12,
            "descripcion": "no aplicada"
          }
        },




      ];
    this.myData = this.lstRegistros;
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
