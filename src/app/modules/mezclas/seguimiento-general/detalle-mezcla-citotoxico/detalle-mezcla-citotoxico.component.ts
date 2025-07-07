import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { FormlyFieldConfig } from '@ngx-formly/core';
import * as moment from 'moment';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { EstatusMezcla } from 'src/app/shared/general.enum';
import { Componente } from 'src/app/shared/models/componente.model';
import { DetalleDiluyente } from 'src/app/shared/models/diluyente.model';
import { DetalleMezcla } from 'src/app/shared/models/mezcla.model';
import { Progreso } from 'src/app/shared/models/progreso.model';
import { SeguimientoGeneralService } from 'src/app/shared/services/seguimiento-general.service';
import { SeguimientoService } from 'src/app/shared/services/seguimiento.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { ListadoDiluyenteComponent } from '../../detalle/listado-diluyente/listado-diluyente.component';
import { ListadoMedicamentosComponent } from '../../detalle/listado-medicamentos/listado-medicamentos.component';
import { ListadoProgresoComponent } from '../../detalle/listado-progreso/listado-progreso.component';

@Component({
    selector: 'app-detalle-mezcla-citotoxico',
    templateUrl: './detalle-mezcla-citotoxico.component.html',
    styleUrls: ['./detalle-mezcla-citotoxico.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        SharedModule,
        MatTabsModule,
        ListadoMedicamentosComponent,
        ListadoDiluyenteComponent,
        ListadoProgresoComponent
    ],
})
export class DetalleMezclaCitotoxicoComponent {
    constructor(
        private dialogRef: MatDialogRef<DialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    _seguimientoService = inject(SeguimientoService);
    _seguimientoGeneralService = inject(SeguimientoGeneralService);

    model: any = {};
    modelDiluyente: DetalleDiluyente;
    form = new FormGroup({});
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


    displayedColumns = ['desCortaMedicamento', 'numDosisMedicamento', 'refUnidadMinMedida']

    tableDS: MatTableDataSource<any>;
    collectionSize: number = 1;
    paginaActual: number = 1;

    progreso: Progreso[];
    detalleCitotoxico: any;
    detalleMezcla: any;
    blnTituloMedicamentos: boolean;
    ngOnInit(): void {

        this._seguimientoService.getDetalleCitotoxico(this.data.registro.idMezclaAplicDiaDosis).then(
            resp => {
                this.detalleCitotoxico = resp;
                this.blnTituloMedicamentos = true;

                this.model = { ...resp.detalleMezcla };
                if (resp.medicamentos) {
                    this.tableDS = new MatTableDataSource(resp.medicamentos);
                }
                if (resp.diluyentes) {
                    this.modelDiluyente = { ...resp.diluyentes[0] }
                }
                if (resp.detalleMezcla) {
                    this.detalleMezcla = resp.detalleMezcla;
                }

                if (resp.generalCitotoxico) {
                    this.modelDiluyente.fechaAplicacion = resp.generalCitotoxico.fechaAplicacion;
                    this.modelDiluyente.desAplicacionCada = resp.generalCitotoxico.desAplicacionCada;
                    this.modelDiluyente.totalDosis = resp.generalCitotoxico.totalDosis;
                    this.modelDiluyente.desViaAdministracion = resp.generalCitotoxico.desViaAdministracion;
                    this.modelDiluyente.desTiempoInfusion = resp.generalCitotoxico.desTiempoInfusion;
                    this.modelDiluyente.refVelInfusion = resp.generalCitotoxico.refVelInfusion;

                }
            }
        );



        this._seguimientoGeneralService.getProgreso(this.data.registro.folioMezcla).then(resp => {

        
            // this.fillProgreso();
            // this.progreso = this.miProgreso;
            let lstprogreso = new Array<any>();
            if(resp){
                for(let registro of resp){           
                  let fecha = moment(registro.fechaHora,'DD/MM/YYYY HH:mm:ss.SSS').format('DD/MM/YYYY HH:mm');
                  registro.fechaHora = fecha;
                  lstprogreso.push(registro);
                }
                this.progreso = lstprogreso;
                
              }
        });
    }
    miProgreso: any;
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
    fillProgreso() {
        this.miProgreso = [
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
                    "id": 2,
                    "descripcion": "no aprobada"
                }
            },
            {
                "nombre": "MANUEL EDUARDO DE GUGLIELMO DE GUGLIELMO",
                "fechaHora": "13/03/2024 01:27",
                "perfil": "Médico",
                "estatus": {
                    "id": 16,
                    "descripcion": "cancelada"
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
            }
        ]
    }

}
