import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { EstatusMezcla } from 'src/app/shared/general.enum';
import { ColoresEstatus } from 'src/app/shared/general.utils';
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
    templateUrl: './detalle-antibiotico.component.html',
    styleUrls: ['./detalle-antibiotico.component.scss','../../../../../styles-estatus.scss'],
})
export class DetalleAntibioticoComponent {
    constructor(
        private dialogRef: MatDialogRef<DialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        
    }

    _seguimientoService = inject(SeguimientoService);
    _coloresEstatus = inject(ColoresEstatus);
    model: any = {};
    modelDiluyente: any = {};
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


    listProg: [any];

    ngOnInit(): void {

        this._seguimientoService.getDetalleAntibiotico(this.data.mezcla.idMezclaAplicDiaDosis).then(
            resp => {
                this.model = { ...resp.detalleMezcla };
                if (resp.medicamentos) {
                    this.tableDS = new MatTableDataSource(resp.medicamentos);
                }
                if (resp.diluyentes) {
                    this.modelDiluyente = { ...resp.diluyentes[0] }
                }
            }
        );

        this._seguimientoService.getProgreso({ progreso: this.data.mezcla.folioMezcla }).then(resp => {
            if (resp) {
                this.listProg = resp;
                console.log(this.listProg)
            }
        });
    }


    shortTable(sort:Sort) {
        console.log("colName " + sort);
    
        const array = this.tableDS.data ;
        let des = sort.direction == 'desc';
        const sortedArray = this.sortArrayOfObjects(array, sort.active, des);    
        //let otherModel = {...this.modelo};
       // otherModel.content = sortedArray;
       // console.log(otherModel)
        this.tableDS = new MatTableDataSource(sortedArray);
    
    
      }

      sortArrayOfObjects = <T>(
        data: T[],
        keyToSort: keyof T,
        des: boolean,
      ) => {
        
    
        const compare = (objectA: T, objectB: T) => {
          const valueA = objectA[keyToSort]
          const valueB = objectB[keyToSort]
      
          if (valueA === valueB) {
            return 0
          }
      
          if (valueA > valueB) {
            return des === false ? 1 : -1
          } else {
            return des === false ? -1 : 1
          }
        }
      
        return data.slice().sort(compare)
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

   

    closeDialog() {
        this.dialogRef.close(false);
    }

    
   
}
