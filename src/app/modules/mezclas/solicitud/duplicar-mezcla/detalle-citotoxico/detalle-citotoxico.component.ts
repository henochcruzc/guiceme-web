import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { GeneralComponent } from 'src/app/modules/general/general.component';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { EstatusMezcla } from 'src/app/shared/general.enum';
import { HeaderDetalleMezclaComponent } from 'src/app/shared/layout/header-detalle-mezcla/header-detalle-mezcla.component';
import { SeguimientoService } from 'src/app/shared/services/seguimiento.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
    selector: 'app-detalle-citotoxico',
    templateUrl: './detalle-citotoxico.component.html',
    styleUrls: ['./detalle-citotoxico.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        SharedModule,
        HeaderDetalleMezclaComponent
    ]
})
export class DetalleCitotoxicoComponent extends GeneralComponent {
    constructor(
        private dialogRef: MatDialogRef<DialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        super()
    }

    _seguimientoService = inject(SeguimientoService);

    model: any = {};
    modelGeneralCitotoxico: any = {};
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


    displayedColumnsMed = ['desCortaMedicamento', 'numDosisMedicamento', 'refUnidadMinMedida']

    displayedColumnsDil = ['desCortaDiluyente', 'numDosisDiluyente', 'refUnidadMinMedida']


    tableDSMed: MatTableDataSource<any>;
    tableDSDil: MatTableDataSource<any>;

    listProg: [any];

    ngOnInit(): void {
        this._seguimientoService.getDetalleCitotoxico(this.data.mezcla.idMezclaAplicDiaDosis).then(
            resp => {
                this.model = { ...resp.detalleMezcla };
                this.modelGeneralCitotoxico = { ...resp.generalCitotoxico };
                if (resp.medicamentos) {
                    this.tableDSMed = new MatTableDataSource(resp.medicamentos);
                }
                if (resp.diluyentes) {
                    this.tableDSDil = new MatTableDataSource(resp.diluyentes);
                }

            }
        );

        this._seguimientoService.getProgreso({ progreso: this.data.mezcla.folioMezcla }).then(resp => {
            if (resp) {
                this.listProg = resp//.sort((a:any,b:any) => (a.estatus.id > b.estatus.id)? 1:-1).filter((data) => data.estatus.id ? true:false) ;
                console.log(this.listProg)
            }
        });
    }



    override get ConfigTabla() {
        return {
            NUM_ELEMENTOS_TABLA: 3,
            NUM_ELEMENTOS_PAGINADOR: 5
        };
    }

    findClass(tipo) {

        switch (tipo) {
            case EstatusMezcla.SOLICITADA: //Solicitada
                return 'blue';
                break;
            case EstatusMezcla.NO_APROBADA://No aprobada
                return 'orange';
                break;
            case EstatusMezcla.APROBADA://Aprobada
                return 'blue';
                break;
            case EstatusMezcla.DISPONIBLE://Disponible
                return 'blue';
                break;
            case EstatusMezcla.APLICADA://Aplicada
                return 'green';
                break;
            case EstatusMezcla.NO_APLICADA://No aplicada
                return 'orange';
                break;
            case EstatusMezcla.CANCELADA://cancelada
                return 'red';
                break;
            case EstatusMezcla.NO_APROBADA_CANCELADA_SISTEMA://cancelada
                return 'red';
                break;
            case EstatusMezcla.RATIFICADA://cancelada
                return 'orange';
                break;

            default:
                break;
        }


        return '';
    }


    getFaltantes() {
        if (this.listProg) {
            if (4 - this.listProg.length < 0) {
                return 0
            }
            return 4 - this.listProg.length;
        }
        return 4;
    }
    findClassSeguimiento(tipo) {


        if (tipo == EstatusMezcla.SOLICITADA) { // solicitada
            return 'blue'
        }
        if (tipo == EstatusMezcla.CANCELADA) { // cancelada
            return 'red'
        }
        if (tipo == EstatusMezcla.RATIFICADA) {
            return 'orange'
        }
        if (tipo == EstatusMezcla.APROBADA) { // no aprobada
            return 'blue'
        }
        if (tipo == EstatusMezcla.NO_APROBADA) { // no aprobada
            return 'orange'
        }
        if (tipo == EstatusMezcla.NO_APROBADA_CANCELADA_SISTEMA) { // no aprobada cancelada por sistema
            return 'red'
        }
        if (tipo == EstatusMezcla.DISPONIBLE) { // aprobada
            return 'blue'
        }
        if (tipo == EstatusMezcla.APLICADA) { // aplicada
            return 'green'
        }
        if (tipo == EstatusMezcla.NO_APLICADA) { // No aplicada
            return 'orange'
        }


        return 'blue';
    }

    closeDialog() {
        this.dialogRef.close(false);
    }

    shortTableDil(sort: Sort) {
        console.log("colName " + sort);

        const array = this.tableDSDil.data;
        let des = sort.direction == 'desc';
        const sortedArray = this.sortArrayOfObjects(array, sort.active, des);
        //let otherModel = {...this.modelo};
        // otherModel.content = sortedArray;
        // console.log(otherModel)
        this.tableDSDil = new MatTableDataSource(sortedArray);
    }

    shortTableMed(sort: Sort) {
        console.log("colName " + sort);

        const array = this.tableDSMed.data;
        let des = sort.direction == 'desc';
        const sortedArray = this.sortArrayOfObjects(array, sort.active, des);
        //let otherModel = {...this.modelo};
        // otherModel.content = sortedArray;
        // console.log(otherModel)
        this.tableDSMed = new MatTableDataSource(sortedArray);
    }
}

