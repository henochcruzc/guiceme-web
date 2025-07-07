import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { GeneralComponent } from '../../general/general.component';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { MatTableDataSource } from '@angular/material/table';
import { CatalogoService } from 'src/app/shared/services/catalogo.service';
import { NoMedicamentoComponent } from "../../../shared/layout/no-medicamento/no-medicamento.component";
import { Sort } from '@angular/material/sort';
import { PreparacionService } from 'src/app/shared/services/preparacion.service';

@Component({
    selector: 'app-preparacion-mezcla',
    standalone: true,
    templateUrl: './preparacion-mezcla.component.html',
    styleUrls: ['./preparacion-mezcla.component.scss'],
    imports: [
        CommonModule,
        SharedModule,
        NoMedicamentoComponent
    ]
})
export class PreparacionMezclaComponent extends GeneralComponent {


    _catalogoService = inject(CatalogoService)
    _preparacionService = inject(PreparacionService);

    displayedColumns = ['cveFolioMezcla', 'cveFolioSolicitud', 'desTipoMezcla', 'fechaAplicacion', 'preparar']

    collectionSize: number = 0;
    paginaActual: number = 1;
    tableDS: MatTableDataSource<any>;
    model: any = {};
    form = new FormGroup({});
    fields: FormlyFieldConfig[] = [
        {
            fieldGroupClassName: 'row',
            fieldGroup: [
                {
                    className: "col-lg-6 col-md-6",
                    key: 'idTurno',
                    type: 'select',
                    templateOptions: {
                        label: 'Turno',
                        placeholder: 'Selecciona un turno',
                        valueProp: 'id',
                        labelProp: 'desTurno',
                        options: this._catalogoService.getTurno(),
                        required: true,
                        change: (field, $event) => {
                            field.form.get('refNombreCampana').reset()
                        },

                    },

                },
                {
                    className: "col-lg-6 col-md-6",
                    key: 'refNombreCampana',
                    type: 'select',
                    props: {
                        label: 'Campana',
                        placeholder: 'Selecciona una campana',
                        valueProp: 'refNombreCampana',
                        labelProp: 'refNombreCampana',
                        options: [],
                        required: true
                    },
                    hooks: {
                        onInit: (field) => {
                            const idTurno = field.form.get('idTurno');
                            if (idTurno != null) {
                                idTurno.valueChanges.subscribe(async x => {
                                    if(x != null){
                                        await this._catalogoService.getTurnoCampanaPreparacion({ valCam: true, idCentralMezcla: this._accountService.getUser().cemetUsuarios[0].idCentralMezcla.id, idTurno: x }).then(resp => {
                                            const compareFn = (a, b) => (a.refNombreCampana < b.refNombreCampana ? -1 : 0);
                                            
                                            field.props.options =  resp.sort(compareFn);
                                        })
                                        
                                        
                                    }else{
                                        field.props.options = [];
                                    }
                                })
                            }
                        }
                    }

                },

            ]
        },
    ];

    //auxiliares
    myData: any;
    ngOnInit() {

    }

    shortTable(sort: Sort) {
        console.log("colName " + sort);
        const array = this.tableDS.data;
        let des = sort.direction == 'desc';
        const sortedArray = this.sortArrayOfObjects(array, sort.active, des);
        this.tableDS = new MatTableDataSource(sortedArray);
    }

    validaFiltros() {
        return this.form.invalid;
    }

    async pageChanged(page) {
        this.model.page = page - 1;
        this.model.size = this.ConfigTabla.NUM_ELEMENTOS_TABLA
        this.model.idCentralMezcla = this._accountService.getUser().cemetUsuarios[0].idCentralMezcla.id
        this._preparacionService.busqueda(this.model).then(
            resp => {
                if (resp != null && resp.totalElements > 0) {
                    this.tableDS = new MatTableDataSource(resp.content);
                    this.collectionSize = resp.totalElements;
                } else {
                    this.tableDS = new MatTableDataSource([]);
                    this.collectionSize = 0;
                    this._alertServices.error("<strong> No se encontraron resultados </strong> con los criterios de búsqueda.");

                }
            }
        )
    }

    resetForm() {
        this.model = { ...{} }
        this.form.reset(this.model)
    }

    onPreparar(elemento) {
        this._sesionStorage.setJsonValue('mezclaSeleccionada', elemento);
        this._router.navigate([this._nav.detallePreparacion]);
    }
}
