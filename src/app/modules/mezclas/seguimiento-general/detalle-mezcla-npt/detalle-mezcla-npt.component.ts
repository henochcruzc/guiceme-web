import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { SeguimientoGeneralService } from 'src/app/shared/services/seguimiento-general.service';
import { SeguimientoService } from 'src/app/shared/services/seguimiento.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormGroup } from '@angular/forms';
import { EstatusMezcla } from 'src/app/shared/general.enum';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { MatTableDataSource } from '@angular/material/table';
import { Progreso } from 'src/app/shared/models/progreso.model';
import { Componente } from 'src/app/shared/models/componente.model';
import { DetalleDiluyente } from 'src/app/shared/models/diluyente.model';
import { DetalleMezcla } from 'src/app/shared/models/mezcla.model';
import { ListadoComponentesComponent } from '../../detalle/listado-componentes/listado-componentes.component';
import { ListadoProgresoComponent } from '../../detalle/listado-progreso/listado-progreso.component';
import * as moment from 'moment';

@Component({
  selector: 'app-detalle-mezcla-npt',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    SharedModule,
    MatTabsModule,
    ListadoComponentesComponent,
    ListadoProgresoComponent
  ],
  templateUrl: './detalle-mezcla-npt.component.html',
  styleUrls: ['./detalle-mezcla-npt.component.scss']
})
export class DetalleMezclaNptComponent {
  constructor(
    private dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
  _seguimientoService = inject(SeguimientoService);
  _seguimientoGeneralService = inject(SeguimientoGeneralService);
  miProgreso: any;
  modelDataComponente: any = {};
  model: any = {};
  tableDS: MatTableDataSource<any>;
  form = new FormGroup({});
  lstComponentesTabs: Array<Componente>; // new Array(20).fill(0).map((_, index) => `Tab ${index}`);
  diluyente: DetalleDiluyente;
  mezcla: DetalleMezcla;
  fields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: "col-lg-4 col-md-6",
          key: 'cveFolioSolicitudMezcla',
          type: 'text-inline',
          props: {
            label: 'Folio de solicitud'
          }
        },
        {
          className: "col-lg-4 col-md-6",
          key: 'cveFolioMezclaDosis',
          type: 'text-inline',
          props: {
            label: 'Folio mezcla',
          },
        },
        {
          className: "col-lg-4 col-md-6",
          key: 'desTipoMezcla',
          type: 'text-inline',
          props: {
            label: 'Tipo de mezcla',
          },
        },
      ]
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: "col-lg-6 col-md-6",
          key: 'desUnidadMedica',
          type: 'text-inline',
          templateOptions: {
            label: 'Unidad de adscripción',
          },
        },
        {
          className: "col-lg-6 col-md-6",
          key: 'desUnidadMedicaAplica',
          type: 'text-inline',
          props: {
            label: 'Unidad de solicitud',
          },
        },
      ]
    },
  ];
  tabsNTP = [];

  displayedColumns: string[] = [
    'componentes',
    'dosis',
    'unidadMedida'
  ];

  progreso: Progreso[];
  medicamentos = [];
  detalleComponente: any;
  ngOnInit(): void {
    this.lstComponentesTabs = new Array<Componente>();
    this._seguimientoService.getDetalleNpt(this.data.registro.idMezclaAplicDiaDosis).then(
      resp => {


        this.model = { ...resp.detalleMezcla };
        if (resp.detalleMezcla) {
          this.mezcla = resp.detalleMezcla;
        }
        if (resp.detalleDiluyente) {
          this.diluyente = resp.detalleDiluyente;
        }
        if (resp.componentes) {


          this.tabsNTP = [];
          this.detalleComponente = {};
          this.detalleComponente.lstComponentesTabs = resp.componentes;




        }

      }
    );

    this._seguimientoGeneralService.getProgreso(this.data.registro.folioMezcla).then(resp => {
      //  this.progreso = resp;
      let lstprogreso = new Array<any>();
      if (resp) {
        for (let registro of resp) {
          let fecha = moment(registro.fechaHora, 'DD/MM/YYYY HH:mm:ss.SSS').format('DD/MM/YYYY HH:mm');
          registro.fechaHora = fecha;
          lstprogreso.push(registro);
        }
        this.progreso = lstprogreso;
        //console.log("progreso: ", this.progreso);
      }
    });
  }


  findClass(tipo) { //col estatus

    switch (tipo) {
      case EstatusMezcla.SOLICITADA: //Solicitada
        return 'green';
        break;
      case EstatusMezcla.CANCELADA://No aprobada
        return 'red';
        break;
      case EstatusMezcla.RATIFICADA://Aprobada
        return 'blue';
        break;
      case EstatusMezcla.APROBADA://Disponible
        return 'green';
        break;
      case EstatusMezcla.NO_APROBADA://Aplicada
        return 'orange';
        break;
      case EstatusMezcla.EN_PREPARACION://No aplicada
        return 'blue';
        break;
      case EstatusMezcla.PREPARADA:
        return 'green';
        break;
      case EstatusMezcla.NO_APROBADA_MESA_ATENCION://cancelada
        return 'orange';
        break;
      case EstatusMezcla.DISPONIBLE://cancelada
        return 'blue';
        break;
      case EstatusMezcla.EN_RUTA://cancelada
        return 'blue';
        break;
      case EstatusMezcla.RECHAZADA_UNIDAD_MEDICA://cancelada
        return 'orange';
        break;
      case EstatusMezcla.RECIBIDA_UNIDAD_MEDICA://cancelada
        return 'blue';
        break;
      case EstatusMezcla.NO_APLICADA://cancelada
        return 'orange';
        break;
      case EstatusMezcla.APLICADA:
        return 'green';
        break;

      default:
        break;
    }


    return '';
  }



  findClassSeguimiento(tipo, columna) {



    if (columna == 1 && tipo == EstatusMezcla.SOLICITADA) { // solicitada
      return 'green'
    }
    if (columna == 1 && tipo == EstatusMezcla.CANCELADA) { // cancelada
      return 'red'
    }




    //MA estatus final
    if (columna == 1 && tipo == EstatusMezcla.RATIFICADA) {
      return 'blue'
    }

    if (columna == 1 && tipo == EstatusMezcla.APROBADA) {
      return 'green'
    }
    if (columna == 1 && tipo == EstatusMezcla.NO_APROBADA) {
      return 'orange'
    }



    //EP

    if (columna == 1 && tipo == EstatusMezcla.EN_PREPARACION) {
      return 'blue'
    }

    if (columna == 1 && tipo == EstatusMezcla.PREPARADA) {
      return 'green'
    }


    //MD

    if (columna == 1 && tipo == EstatusMezcla.NO_APROBADA_MESA_ATENCION) {
      return 'orange'
    }


    if (columna == 1 && tipo == EstatusMezcla.DISPONIBLE) {
      return 'blue'
    }

    if (columna == 1 && tipo == EstatusMezcla.EN_RUTA) {
      return 'blue'
    }


    //RU

    if (columna == 1 && tipo == EstatusMezcla.RECHAZADA_UNIDAD_MEDICA) {
      return 'orange'
    }


    if (columna == 1 && tipo == EstatusMezcla.RECIBIDA_UNIDAD_MEDICA) {
      return 'blue'
    }



    //MAP

    if (columna == 1 && tipo == EstatusMezcla.APLICADA) {
      return 'green'
    }


    if (columna == 1 && tipo == EstatusMezcla.NO_APLICADA) {
      return 'orange'
    }

    //estatus sin borde puntos
    //MA
    if ((columna == 1 || columna == 2) && (tipo == EstatusMezcla.RATIFICADA)) {
      return 'blue no-border'
    }//ok

    if ((columna == 1 || columna == 2) && (tipo == EstatusMezcla.APROBADA || tipo == EstatusMezcla.NO_APROBADA)) {
      return 'green no-border'
    }//ok

    //EP
    if ((columna == 1 || columna == 2) && (tipo == EstatusMezcla.EN_PREPARACION)) {
      return 'blue no-border'
    }//ok

    if ((columna == 1 || columna == 2) && (tipo == EstatusMezcla.PREPARADA)) {
      return 'green no-border'
    }//ok

    //MD

    if ((columna == 1 || columna == 2 || columna == 3) && (tipo == EstatusMezcla.NO_APROBADA_MESA_ATENCION)) {
      return 'green no-border'
    }//ok

    if ((columna == 1 || columna == 2 || columna == 3) && (tipo == EstatusMezcla.DISPONIBLE || tipo == EstatusMezcla.EN_RUTA)) {
      return 'blue no-border'
    }//ok

    if ((columna == 1 || columna == 2 || columna == 3 || columna == 4)
      && (tipo == EstatusMezcla.RECHAZADA_UNIDAD_MEDICA || tipo == EstatusMezcla.RECIBIDA_UNIDAD_MEDICA)) {
      return 'blue no-border'
    }//ok

    if ((columna == 1 || columna == 2 || columna == 3 || columna == 4 || columna == 5)
      && (tipo == EstatusMezcla.NO_APLICADA || tipo == EstatusMezcla.APLICADA)) {
      return 'green no-border'
    }//ok


    return 'gray';



  }


  closeDialog() {
    this.dialogRef.close(false);
  }



}
