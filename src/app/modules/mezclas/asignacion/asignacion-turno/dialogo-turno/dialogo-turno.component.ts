import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { Subject, from } from 'rxjs';
import { AccountService } from 'src/app/modules/login/services/account.service';
import { MaterialModule } from 'src/app/shared/material.module';
import { CatalogoService } from 'src/app/shared/services/catalogo.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
    selector: 'app-dialogo-turno',
    standalone: true,
    imports: [
        CommonModule,
        SharedModule
    ],
    templateUrl: './dialogo-turno.component.html',
    styleUrls: ['./dialogo-turno.component.scss'],
})
export class DialogoTurnoComponent {
    constructor(
        private dialogRef: MatDialogRef<DialogoTurnoComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.usuario = this._accountService.getUser();
    }

    _catalogService = inject(CatalogoService);
    _accountService = inject(AccountService)

    title: any;
    tableDS: MatTableDataSource<any>;
    displayedColumns = ['cveFolioMezclaDosis', 'umAplicacion', 'fechaAplicacion', 'accion'];
    dataTable: any;
    usuario: any = {};
    campanaSelected: any;
    $obsEliminarElemento:any;

    model: any = {};
    form = new FormGroup({});

    fields: FormlyFieldConfig[] = [
        {
            fieldGroupClassName: 'row',
            fieldGroup: [
                {
                    className: "col-lg-4 col-md-4",
                    key: 'campana',
                    type: 'select',
                    props: {
                        label: 'Campana',
                        placeholder: 'Selecciona una campana',
                        required: true,
                        valueProp: 'idTemporal',
                        labelProp: 'desCampana',
                        options: [],
                        change: (field, $event) => {
                            field.props.options.forEach(e => {
                                if (e['idTemporal'] == field.formControl.value) {
                                    this.campanaSelected = e;
                                }
                            });
                        }
                    },
                    hooks: {
                        afterViewInit: async (field) => {
                            this._catalogService.getTurnoCampanaPr(this.data.idCentralMezcla, this.data.tipoMezcla)
                                .then(
                                    (data: any) => {
                                        if (data) {
                                            const nuevoArreglo = data.map((elemento, indice) => {
                                                return {
                                                    ...elemento,
                                                    idTemporal: indice + 1,
                                                };
                                            });

                                            console.log(nuevoArreglo);
                                            field.props.options = nuevoArreglo;
                                        }
                                    },

                                );
                        }

                    },
                },
                {
                    className: "col-lg-4 col-md-4",
                    key: 'turno',
                    type: 'select',
                    props: {
                        label: 'Turno',
                        placeholder: 'Selecciona un turno',
                        required: true,
                        valueProp: 'id',
                        labelProp: 'desTurno',
                        options: this._catalogService.getTurno()
                    },

                }
            ]
        },

    ];

    confirmDialog() {
        this.dialogRef.close([true,this.campanaSelected,this.model]);
    }

    closeDialog() {
        this.dialogRef.close([false]);
    }

    ngOnInit() {
        this.updateDataSource();
    }

    updateDataSource() {
        this.tableDS = new MatTableDataSource(this.dataTable);
    }

    shortTable(sort: Sort) {
        console.log("colName " + sort);
        const array = this.tableDS.data;
        let des = sort.direction == 'desc';
        const sortedArray = this.sortArrayOfObjects(array, sort.active, des);
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

    eliminar(element,index) {
        console.log(element,index)
        this.dataTable.splice(index, 1);
        this.$obsEliminarElemento.next(element);
        this.updateDataSource();
    }

}
