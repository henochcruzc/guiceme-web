import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { GeneralComponent } from '../../general/general.component';
import { SelectionModel } from '@angular/cdk/collections';
import { DateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { CatalogoService } from 'src/app/shared/services/catalogo.service';
import { MezclasService } from 'src/app/shared/services/mezclas.service';
import { AuthService } from '../../login/services/auth.service';
import { EstatusMezcla, EstatusReimpresion } from 'src/app/shared/general.enum';
import { NAV } from 'src/app/shared/config/global';
import { Router } from '@angular/router';
import { Sort } from '@angular/material/sort';

@Component({
    selector: 'app-acondicionamiento',
    templateUrl: './acondicionamiento.component.html',
    standalone: true,
    styleUrls: ['./acondicionamiento.component.scss'],
    imports: [
        CommonModule,
        SharedModule,
    ]
})
export class AcondicionamientoComponent extends GeneralComponent {
    totalElements: number = 0;

    constructor(
        public authService: AuthService,
        public dialog: MatDialog,
        private mezclaService: MezclasService,
        private catalogService: CatalogoService,
        private adapter: DateAdapter<any>,
        public router: Router
    ) {
        super();
    }

    collectionSize: number = 0;

    model: any = {};
    form = new FormGroup({});
    fields: FormlyFieldConfig[] = [
        {
            fieldGroupClassName: 'row',
            fieldGroup: [

                {
                    className: "col-lg-3 col-md-6",
                    key: 'tipoMezcla',
                    type: 'select',
                    props: {
                        label: 'Tipo de mezcla',
                        placeholder: 'Selecciona un tipo de mezcla',
                        required: false,
                        valueProp: 'id',
                        labelProp: 'desTipoMezcla',
                        options: [],
                    },
                    hooks: {
                        afterViewInit: async (field) => {
                            let id = 1;//Obtenerlo del session
                            this.catalogService.getTiposMezcla()
                                .then(
                                    (data: any) => {
                                        if (data) {
                                            this.listMezclaCat = data
                                            field.props.options = data;
                                        } else
                                            this._alertServices.error("<strong>Error</strong> al obtener conceptos de Tipos Mezcla");
                                    },
                                    (_err) => {
                                        this._alertServices.error("<strong>Error</strong> al obtener conceptos de Tipos Mezcla");
                                    }
                                );
                            const tipoMezcla = field.form.get('tipoMezcla');
                        }
                    },

                },
                {
                    className: "col-lg-3 col-md-6",
                    key: 'folioMezcla',
                    type: 'input',
                    props: {
                        label: 'Folio de la mezcla',
                        placeholder: 'Ingresa folio de mezcla',
                        maxLength: 26,
                    },
                },
                {
                    className: "col-lg-2 col-md-3 col-xs-6",
                    key: 'btn-limpiar',
                    type: 'button',
                    props: {
                        classBtn: 'btn-alinear widthBtn boton',
                        btnType: 'danger',
                        text: 'Limpiar',
                        label: ' ',
                        disabled: false,
                        onClick: () => {
                            this.limpiarCampos();
                        },
                    },
                    expressionProperties: {
                        'props.disabled': (model: any) => {
                            if (
                                model.tipoMezcla || model.folioMezcla
                            ) {
                                return false
                            }
                            return true
                        },
                    },
                }, {
                    className: "col-lg-2 col-md-3 col-xs-6",
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
                            this.buscarMezclas();
                        },
                    },
                    expressionProperties: {
                        'props.disabled': (model: any) => {
                            if (
                                model.tipoMezcla || model.folioMezcla
                            ) {
                                return false
                            }
                            return true
                        },
                    },
                }
            ]
        },



    ];

    buscarMezclas() {

        if (this.model.tipoMezcla != null || this.model.folioMezcla != null) {
            this.getDetalleList(0, 10, this.model.tipoMezcla, this.model.folioMezcla);
        }

        /*if (this.model.tipoMezcla != null) 
            this.getDetalleList(0, 10, this.model.tipoMezcla);*/

    }



    displayedColumns = ['cveFolioMezclaDosis', 'cveFolioSolicitudMezcla','componentes','desTipoMezcla', 'fechaAplicacion', 'estatusDosis']
    myData;
    tableDS: MatTableDataSource<any>;
    selection = new SelectionModel<any>(true, []);
    /*tipoMezcla = [
        "Nutrición Parenteral",
        "Antibiótico",
        "Citotóxico"
    ]

    idTipoMezcla = [
        1,
        2,
        3
    ]

    estatus = [
        {
            descripcion: "Disponible"
            , id: this.EstatusMezcla.DISPONIBLE
        },
        {
            descripcion: "Preparada"
            , id: this.EstatusMezcla.PREPARADA
        },
        {
            descripcion: "Aprobada MA"
            , id: this.EstatusMezcla.APROBADA_MESA_ATENCION
        }

    ]*/
    paginaActual: number = 1;
    listMezclaCat: any;


    ngOnInit(): void {

        this.getDetalleList(0, 10, null, null);

    }
    pageSize = 0;
    getDetalleList(page, size, idTipoMezcla, folioMezcla) {
        this.mezclaService.getSolicitudesAcondicionamiento(page, size, idTipoMezcla, folioMezcla)
            .then(data => {
                if (data.content.length != 0) {

                    //console.log('listado------',data)
                    this.myData = data.content;
                    //this.tableDS = new MatTableDataSource(this.myData);
                    //this.totalElements = data.totalElements;
                    this.collectionSize = data.totalElements;
                    this.pageSize = data.numberOfElements;
                    this.totalElements = data.totalElements;// this.ConfigTabla.NUM_ELEMENTOS_TABLA;
                    this.tableDS = new MatTableDataSource(this.myData.slice(0, this.ConfigTabla.NUM_ELEMENTOS_TABLA));
                } else {
                    this.tableDS = null;
                    this.totalElements = null;
                    this.collectionSize = 0;
                    this.pageSize = 0;
                    this._alertServices.error("<strong> No se encontraron resultados </strong> con los criterios de búsqueda.");
                }

            });
    }

    pageChanged(event: any) {
        //console.log(event)


        if (this.model.tipoMezcla != null) {
            this.getDetalleList(event - 1, 10, this.model.tipoMezcla, null);
        } else {
            this.getDetalleList(event - 1, 10, null, null);
        }
    }


    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.tableDS.data.length;
        return numSelected === numRows;
    }

    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.tableDS.data.forEach(row => this.selection.select(row));
    }


    limpiarCampos() {
        //limpiamos los campos del formulario
        this.form.reset();
        //this.tableDS = null;
        //this.totalElements = null;
    }

    redirecciona(modelo: any) {

        let valor = {
            modelo: modelo,
            origen: NAV.acondicionamiento
        }
        this._sesionStorage.setDataResolucion(valor);

        switch (modelo.idTipoMezcla) {
            case 1:
                this.router.navigate([NAV.detalleCitotoxicoAcondicionamiento]);
                break;
            case 2:
                this.router.navigate([NAV.detalleNPTAcondicionamiento]);
                break;
            case 3:
                this.router.navigate([NAV.detalleAntiAcondicionamiento]);
                break;
            default:
                console.log('no es tipo mezcla valido')
        }
    }


    findClass(element) {

        //console.info('tipo',tipo);
        var estatus = element.estatusDosis.idEstatusMezcla;
        if (element.idEstatusReimpresion != undefined && element.idEstatusReimpresion != null && element.idEstatusReimpresion === 4) {
            estatus = EstatusReimpresion.APROBADA_MESA_ATENCION;
        }



        switch (estatus) {
            case EstatusMezcla.DISPONIBLE://Disponible
                return 'blue';
                break;
            case EstatusReimpresion.APROBADA_MESA_ATENCION://cancelada
                return 'green';
                break;
            case EstatusMezcla.PREPARADA://cancelada
                return 'blue-light';
                break;
            default:
                break;
        }


        return '';
    }

    shortTable(sort: Sort) {
        //console.log("colName " + sort);

        const array = this.tableDS.data;
        let des = sort.direction == 'desc';
        const sortedArray = this.sortArrayOfObjects(array, sort.active, des);
        //let otherModel = {...this.modelo};
        // otherModel.content = sortedArray;
        // console.log(otherModel)
        this.tableDS = new MatTableDataSource(sortedArray);
    }


}
