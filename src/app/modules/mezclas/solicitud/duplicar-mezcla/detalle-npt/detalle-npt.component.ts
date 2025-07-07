import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { GeneralComponent } from 'src/app/modules/general/general.component';
import { NAV } from 'src/app/shared/config/global';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { EstatusMezcla } from 'src/app/shared/general.enum';
import { HeaderDetalleMezclaComponent } from 'src/app/shared/layout/header-detalle-mezcla/header-detalle-mezcla.component';
import { CatalogoService } from 'src/app/shared/services/catalogo.service';
import { SeguimientoService } from 'src/app/shared/services/seguimiento.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
    selector: 'app-detalle-npt',
    templateUrl: './detalle-npt.component.html',
    styleUrls: ['./detalle-npt.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        SharedModule,
        HeaderDetalleMezclaComponent
    ]
})
export class DetalleNptComponent extends GeneralComponent {

    constructor(
        private dialogRef: MatDialogRef<DialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { super() }

    _catalogoService = inject(CatalogoService);
    _seguimientoService = inject(SeguimientoService);

    detalleMezcla: any;
    detalleDiluyente: any;
    lsComponentes: any;

    listProg = [];
    model: any = {};
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
    tabsNTP = [];

    displayedColumns: string[] = [
        'medicamento',
        'dosis',
        'unidadMedida'
    ];

    ngOnInit(): void {

        const indice = this.data.dataSolicitudes.findIndex(x => x.idMezclaAplicDiaDosis === this.data.mezcla.idMezclaAplicDiaDosis);
        if (indice === 0) this.disablePrevius = true;
        if (indice === this.data.dataSolicitudes.length - 1) this.disableNext = true;

        this._catalogoService.getTipoComponente()
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

        this._seguimientoService.getDetalleNpt(this.data.mezcla.idMezclaAplicDiaDosis).then(
            resp => {

                if (resp) {
                    this.model = { ...resp.detalleMezcla };
                    this.detalleDiluyente = { ...resp.detalleDiluyente }
                    this.detalleMezcla = resp.detalleMezcla;

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
                    }
                }
            }
        );

        this._seguimientoService.getProgreso({ progreso: this.data.mezcla.folioMezcla }).then(resp => {
            if (resp) {
                this.listProg = resp//.sort((a: any, b: any) => (a.estatus.id > b.estatus.id) ? 1 : -1).filter((data) => data.estatus.id ? true : false);

            }
        });


    }


    replaceOrAppend(arr, val, compFn) {
        const res = [...arr];
        const i = arr.findIndex(v => compFn(v, val));
        if (i === -1) res.push(val);
        else res.splice(i, 1, val);
        return res;
    };

    getFaltantes() {
        if (this.listProg) {
            if (4 - this.listProg.length < 0) {
                return 0
            }
            return 4 - this.listProg.length;
        }
        return 4;
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

    //////// detalle npt //////
    disablePrevius: boolean;
    disableNext: boolean;

    closeDialog() {
        this.dialogRef.close(false);
    }

    previusDetalle() {
        const indice = this.data.dataSolicitudes.findIndex(x => x.idMezclaAplicDiaDosis === this.data.mezcla.idMezclaAplicDiaDosis);
        console.log(indice);

        if (indice >= 0 && indice < this.data.dataSolicitudes.length) {
            const dato = this.data.dataSolicitudes[indice - 1];
            console.log("Dato en el índice", indice, ":", dato);
            this.data.mezcla = dato;
            this.ngOnInit()
            if (indice === 1) {
                this.disablePrevius = true
            } else {
                this.disablePrevius = false;
            }
        } else {
            console.log("No hay más detalles anteriores");
            this.disablePrevius = true
        }
    }

    nextDetalle() {
        const indice = this.data.dataSolicitudes.findIndex(x => x.idMezclaAplicDiaDosis === this.data.mezcla.idMezclaAplicDiaDosis);
        console.log(indice);

        if (indice >= 0 && indice < this.data.dataSolicitudes.length - 1) {
            const dato = this.data.dataSolicitudes[indice + 1];
            console.log("Dato en el índice", indice, ":", dato);
            this.data.mezcla = dato;
            this.ngOnInit()
            if (indice === this.data.dataSolicitudes.length - 2) {
                this.disableNext = true
            } else {
                this.disableNext = false;
            }
        } else {
            console.log("No hay más detalles anteriores");
            this.disableNext = true
        }
    }

    redireccionDuplicar() {
        this._sesionStorage.setDuplicadoSolicitudData(this.data.mezcla);
        this.dialogRef.close(false);
        this._router.navigate([NAV.solicitud]);
    }

}
