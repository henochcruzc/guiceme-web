import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { EstatusMezcla } from 'src/app/shared/general.enum';
import { ColoresEstatus } from 'src/app/shared/general.utils';
import { CatalogoService } from 'src/app/shared/services/catalogo.service';
import { SeguimientoService } from 'src/app/shared/services/seguimiento.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
    selector: 'app-detalle',
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        SharedModule
    ],
    templateUrl: './detalle-npt.component.html',
    styleUrls: ['./detalle-npt.component.scss','../../../../../styles-estatus.scss'],
})
export class DetalleNptComponent {

    _coloresEstatus = inject(ColoresEstatus);

    constructor(
        private dialogRef: MatDialogRef<DialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

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
                    this.detalleDiluyente = {...resp.detalleDiluyente}
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

                            
                            this.tabsNTP = this.replaceOrAppend(this.tabsNTP , compData, (a, b) => a.id === b.id);

                            // this.tabsNTP.push(compData)
                        }
                    }
                }
            }
        );

        this._seguimientoService.getProgreso({ progreso: this.data.mezcla.folioMezcla }).then(resp => {
            if (resp) {
                this.listProg = resp;
                
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




    closeDialog() {
        this.dialogRef.close(false);
    }
 
}
