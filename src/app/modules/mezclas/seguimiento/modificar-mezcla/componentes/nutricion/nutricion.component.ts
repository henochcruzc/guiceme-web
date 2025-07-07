import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { FormlyFieldConfig } from '@ngx-formly/core';
import * as moment from 'moment';
import { Subject, from } from 'rxjs';
import { GeneralComponent } from 'src/app/modules/general/general.component';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { Perfil } from 'src/app/shared/general.enum';
import { CatalogoService } from 'src/app/shared/services/catalogo.service';
import { MezclasService } from 'src/app/shared/services/mezclas.service';
import { SeguimientoService } from 'src/app/shared/services/seguimiento.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
    selector: 'app-nutricion',
    standalone: true,
    imports: [
        CommonModule,
        SharedModule
    ],
    templateUrl: './nutricion.component.html',
    styleUrls: ['./nutricion.component.scss'],
})
export class NutricionComponent extends GeneralComponent {

    constructor() {
        super();
        this.objUrl = this._sesionStorage.getLoginUrl();
    }


    @Input() mezclaNutricionSelect: any;
    @Input() modelTipoMezcla: any;
    elementoSeleccionado: any = this._sesionStorage.getJsonValue('elementoModificarSeguimiento');

    $obsMedicamentosSeleccionados = new Subject<any>();

    idUsuarioMedico;
    objUrl: any = {};

    _catalogoService = inject(CatalogoService);
    _seguimientoService = inject(SeguimientoService);
    _mezclasService = inject(MezclasService);
    lsComponentes = []; //listado de componentes
    lsMedicamentos: any = []; //listado de medicamentos para los componentes

    medicamentosSeleccionados: any = [];

    tabsNPT = [];//tabs de componentes
    componenteTotal: number = 0;
    btnAddDisabled: boolean;

    tabsMes = [];
    seleccionTodo: boolean = false;
    active = 0;
    valorCada: any;
    dosisTotales: number = 0;
    cadaLst: any;
    listDiluyente: any;
    modeloPersistir: any;

    displayedColumns: string[] = [
        'medicamento',
        'dosis',
        'unidadMedida',
        'rechazar'
    ];

    //panel NTP
    modelNPT: any = {};
    formNPT = new FormGroup({});
    fieldsNPT: FormlyFieldConfig[] = [
        {
            fieldGroupClassName: 'row',
            fieldGroup: [
                {
                    className: "col-lg-2 col-md-6",
                    key: 'tipoComponente',
                    type: 'select',
                    props: {
                        label: 'Tipo de Componente',
                        placeholder: 'Selecciona un tipo',
                        required: true,
                        valueProp: 'id',
                        labelProp: 'desTipoComponente',
                        options: []
                    },
                    hooks: {
                        onInit: async (field) => {

                            this._catalogoService.getTipoComponente()
                                .then(
                                    (data: any) => {
                                        if (data) {
                                            this.lsComponentes = data;
                                            field.props.options = data;


                                        } else
                                            this._alertServices.error("<strong>Error</strong> al obtener conceptos de tipoComponente");
                                    },
                                    (_err) => {
                                        this._alertServices.error("<strong>Error</strong> al obtener conceptos de tipoComponente");
                                    }
                                );
                        }
                    },

                },
                {
                    className: "col-lg-4 col-md-6",
                    key: 'componente',

                    type: 'select',
                    props: {
                        label: 'Componente',
                        placeholder: 'Selecciona un componente',
                        required: true,
                        valueProp: 'id',
                        labelProp: 'desCortaMedicamento',
                        options: [],

                    },
                    hooks: {
                        afterViewInit: async (field) => {

                            const medicamento = field.form.get('tipoComponente');
                            if (medicamento != null) {
                                medicamento.valueChanges.subscribe((x) => {
                                    if (x != null && x != '') {
                                        let tipoComponente = this.lsComponentes.find(e => e.id == x);
                                        if (tipoComponente != null) {
                                            this._catalogoService.getMedicamentoByFilter(tipoComponente.id)
                                                .then(
                                                    (data: any) => {
                                                        if (data) {
                                                            this.lsMedicamentos = []
                                                            //console.log(this.componenteExcluidos)
                                                            // this.medicamentosSeleccionados.forEach(element => {
                                                            //     const idEliminar = data.findIndex(y => y.id === element.medicamento);
                                                            //     if (idEliminar != -1) {
                                                            //         data.splice(idEliminar, 1);
                                                            //     }
                                                            // });
                                                            this.lsMedicamentos = this.filtraMedicamentos(data);
                                                            //console.log('nueva lista filtrada ',this.lsMedicamentos);
                                                            field.props.options = this.lsMedicamentos;
                                                        } else
                                                            this._alertServices.error("<strong>Error</strong> al obtener conceptos de componente");
                                                    },
                                                    (_err) => {
                                                        this._alertServices.error("<strong>Error</strong> al obtener conceptos de componente");
                                                    }
                                                );
                                        }
                                    }
                                });
                            }

                            const componente = field.form.get('componente');
                            if (componente != null) {
                                componente.valueChanges.subscribe((x) => {
                                    //console.log("valor de this.lsMedicamentos  ",this.lsMedicamentos);
                                    if (x != null && x != '') {
                                        let componente = this.lsMedicamentos.find(e => e.id == x);
                                        if (componente != null) {
                                            field.form.get('unidadMedidaNpt').setValue(componente.refUnidadMinMedida);
                                        }
                                    }
                                });
                            }


                        }
                    },

                },

                {
                    className: "col-lg-2 col-md-6",
                    key: 'dosis',
                    type: 'decimal',
                    props: {
                        label: 'Volumen',
                        placeholder: 'Ingresa la dosis',
                        //appInputMaskType: 'integer',
                        maxLength: 11,//2
                        numEnteros:8,
                        numDecimales:2,
                        required: true,

                    },

                },
                {
                    className: "col-lg-2 col-md-6",
                    key: 'unidadMedidaNpt',
                    type: 'input',// 'input-mask',
                    props: {
                        label: 'Unidad de medida',
                        placeholder: '-------------',
                        disabled: true
                    },
                },
                {
                    className: 'col-lg-2 col-md-6',
                    key: 'btnAdd',
                    type: 'button',
                    props: {
                        label: ' ',
                        text: 'Agregar componente',
                        onClick: (to, $event, field) => {
                            this.agregarMedicamento();
                        },
                        classBtn: 'btn-ico estilo-btn',
                        btnType: 'outline-basic',
                        icon: 'agregar',
                    },

                },

            ]
        },



    ]

    //panel de abajo
    modelAbajoNpt: any;
    formAbajoNpt = new FormGroup({});
    fieldsAbajoNpt: FormlyFieldConfig[] = [
        {
            fieldGroupClassName: 'row',
            fieldGroup: [
                {
                    className: "col-lg-2 col-md-6",
                    key: 'osmolaridad',
                    type: 'input-mask',
                    props: {
                        label: 'Osmolaridad (mOsmol/ml)',
                        placeholder: '00',
                        appInputMaskType: 'integer',
                        maxLength: 5,
                    },
                },
                {
                    className: "col-lg-2 col-md-6",
                    key: 'nitrogeno',
                    type: 'input-mask',
                    props: {
                        label: 'Nitrógeno (gr)',
                        appInputMaskType: 'integer',
                        maxLength: 5,
                        placeholder: '00',
                    },
                },
                {
                    className: "col-lg-2 col-md-6",
                    key: 'proteinas',
                    type: 'input-mask',
                    props: {
                        label: 'Proteínas (gr)',
                        appInputMaskType: 'integer',
                        maxLength: 5,
                        placeholder: '00',
                    },
                },
                {
                    className: "col-lg-2 col-md-6",
                    key: 'kcnoproteicas',
                    type: 'input-mask',
                    props: {
                        label: 'Kcal no proteicas (Kcal)',
                        appInputMaskType: 'integer',
                        maxLength: 5,
                        placeholder: '00',
                    },
                },
                {
                    className: "col-lg-2 col-md-6",
                    key: 'kctotales',
                    type: 'input-mask',
                    props: {
                        label: 'Kcal totales (Kcal)',
                        appInputMaskType: 'integer',
                        maxLength: 5,
                        placeholder: '00',
                    },
                },
                {
                    className: "col-lg-2 col-md-6",
                    key: 'volumenTotal',
                    type: 'input-mask',
                    props: {
                        label: 'Volumen total (ml)',
                        appInputMaskType: 'integer',
                        maxLength: 5,
                        placeholder: '00',
                    },
                },


            ]

        },
        // {
        //     fieldGroupClassName: 'row',
        //     fieldGroup: [
        //         {
        //             className: "col-lg-8 col-md-6",
        //             key: 'diluyente',
        //             type: 'select',

        //             props: {
        //                 label: 'Diluyente',
        //                 required: true,
        //                 placeholder: 'Selecciona el diluyente',
        //                 valueProp: 'id',
        //                 labelProp: 'desCortaDiluyente',

        //                 options: [],
        //             },
        //             hooks: {
        //                 afterViewInit: async (field) => {
        //                     this._catalogoService.getDiluyentes()
        //                         .then(
        //                             (data: any) => {
        //                                 if (data) {
        //                                     this.listDiluyente = data
        //                                     field.props.options = data;
        //                                 } else
        //                                     this._alertServices.error("<strong>Error</strong> al obtener conceptos de Diluyente");
        //                             },
        //                             (_err) => {
        //                                 this._alertServices.error("<strong>Error</strong> al obtener conceptos de Diluyente");
        //                             }
        //                         );
        //                 },
        //                 onInit: async (field) => {

        //                     const medicamento = field.form.get('diluyente');
        //                     if (medicamento != null) {
        //                         medicamento.valueChanges.subscribe((x) => {
        //                             if (x != null && x != '') {
        //                                 let diluyente = this.listDiluyente.find(e => e.id == x);
        //                                 if (diluyente.refUnidadMinMedida != null) {
        //                                     field.form.get('unidadMedidaDil').setValue(diluyente.refUnidadMinMedida);
        //                                 }
        //                             }
        //                         });

        //                     }

        //                 },
        //             },

        //         },
        //         {
        //             className: "col-lg-2 col-md-6",
        //             key: 'dosis',

        //             type: 'input-mask',
        //             props: {
        //                 label: 'Dosis',
        //                 placeholder: 'Ingresa la dosis',
        //                 appInputMaskType: 'integer',
        //                 maxLength: 6,
        //                 required: true,
        //             },

        //         },
        //         {
        //             className: "col-lg-2 col-md-6",
        //             key: 'unidadMedidaDil',

        //             type: 'input',
        //             props: {
        //                 label: 'Unidad de medida',
        //                 placeholder: '-------------',
        //                 disabled: true,
        //                 maxLength: 5
        //             },
        //         },


        //     ]
        // },
        {
            fieldGroupClassName: 'row',
            fieldGroup: [
                {
                    className: 'col-lg-4 col-md-6',
                    key: 'fecApl',
                    type: 'material-date',
                    templateOptions: {
                        label: 'Fechas de aplicación',
                        range: true,
                        placeholder: 'Seleccionar fecha y hora',
                        disabled: true,
                        fechaObs: new Subject<any>(),
                    },
                    hooks: {
                        afterViewInit: async (field) => {
                            this._seguimientoService.getDetalleDias(this._sesionStorage.getJsonValue('elementoModificarSeguimiento').idMezcla).then(
                                resp => {
                                    if (resp) {
                                        if (resp.length > 0) {
                                            let fecha = {
                                                startDate: moment(resp[0].fecInicioAplicacion, 'DD-MM-YYYY').format("YYYY-MM-DD"),
                                                endDate: moment(resp[0].fecFinAplicacion, 'DD-MM-YYYY').format("YYYY-MM-DD"),
                                            }
                                            field.props['fechaObs'].next(fecha);
                                            setTimeout(() => {
                                                this.actualizarSeleccion(resp);
                                            }, 600);


                                        }

                                    }
                                }
                            )
                        },
                        onInit: async (field) => {
                            const fecApl = field.form.get('fecApl');
                            if (fecApl != null) {
                                //listener cuando cambia
                                fecApl.valueChanges.subscribe((x) => {
                                    this.tabsMes = this.getTabsMesDias(x);
                                });
                            }
                        }
                    },

                },
                {
                    className: "col-lg-2 col-md-6",
                    key: 'cada',
                    type: 'select',

                    props: {
                        label: 'Cada',
                        required: true,
                        placeholder: 'Selecciona el periodo',
                        valueProp: 'id',
                        labelProp: 'desAplicacionCada',
                        options: [],
                    },
                    hooks: {
                        onInit: async (field) => {
                            this._catalogoService.getAplicacionCada()
                                .then(
                                    (data: any) => {
                                        if (data) {
                                            field.props.options = data;
                                            this.cadaLst = data;
                                        } else
                                            this._alertServices.error("<strong>Error</strong> al obtener conceptos de Diluyente");
                                    },
                                    (_err) => {
                                        this._alertServices.error("<strong>Error</strong> al obtener conceptos de Diluyente");
                                    }
                                );
                            const cada = field.form.get('cada');
                            this.dosisTotales = 0;

                            if (cada != null) {
                                //listener cuando cambia
                                cada.valueChanges.subscribe((x) => {
                                    if (x != null && x != '') {
                                        //se comento esta pendiente por cicla los llamados
                                        this.valorCada = x
                                        this.calculoDosis(this.valorCada)
                                        this.formAbajoNpt.controls['numDosis'].setValue(this.dosisTotales);

                                    }

                                });
                            }
                        }
                    },

                },

                {
                    className: "col-lg-2 col-md-6",
                    key: 'numDosis',

                    type: 'input-mask',
                    props: {
                        label: 'Número total de dosis',
                        placeholder: '-------------',
                        disabled: true,
                        appInputMaskType: 'integer',
                        maxLength: 2,
                    },
                    hooks: {

                        onInit: async (field) => {
                            const cada = field.form.get('cada');
                            this.dosisTotales = 0;

                            if (cada != null) {
                                //listener cuando cambia
                                cada.valueChanges.subscribe((x) => {
                                    if (x != null && x != '') {
                                        this.valorCada = x
                                        this.calculoDosis(this.valorCada)
                                        field.formControl.setValue(this.dosisTotales);
                                    }
                                });
                            }
                        }
                    }
                },
            ]
        },
    ]



    filtraMedicamentos(lstMed) {
        return lstMed.filter(
            function (e) {
                return this.indexOf(e.id) < 0;
            },
            this.medicamentosSeleccionados
        );
    }



    //panel viad administracion
    modelViaAdminNpt: any = {};
    formViaAdminNpt = new FormGroup({});
    fieldsViaAdminNpt: FormlyFieldConfig[] = [
        {
            fieldGroupClassName: 'row',
            fieldGroup: [
                {
                    className: "col-lg-4 col-md-6",
                    key: 'viaAdmon',
                    type: 'select',
                    props: {
                        label: 'Vía de administración',
                        placeholder: 'Selecciona la vía de administración',
                        required: true,
                        options: from(this._catalogoService.getViaAdmon(2)),
                        valueProp: 'id',
                        labelProp: 'desViaAdministracion',
                    },
                },
                {
                    className: "col-md-2",
                    key: 'unidadTiempo',
                    type: 'select',
                    props: {
                        label: 'Tiempo de infusión',
                        placeholder: 'Selecciona el tiempo',
                        required: true,
                        options: from(this._catalogoService.getTiempoInfusion()),
                        valueProp: 'id',
                        labelProp: 'desTiempoInfusion',
                    },
                },
                {
                    className: "col-lg-2 col-md-6",
                    key: 'velocidadInfusion',
                    type: 'input',
                    props: {
                        label: 'Velocidad de infusión (ml/hrs.)',
                        placeholder: 'Ingresa la velocidad',
                        required: true,
                        maxLength: 15
                    },
                }
            ]
        },

    ]

    obtenerComponentes() {
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
                            this.tabsNPT.push(compData)
                        }

                        this.cargarComponentesMezcla();
                    }
                },
            );
    }

    cargarComponentesMezcla() {
        if (this.mezclaNutricionSelect.componentes) {
            const compareFn = (a, b) => (a.idComponente < b.idComponente ? -1 : 0);
            let sortArray = this.mezclaNutricionSelect.componentes.sort(compareFn);
            //this.tabsNTP = [];
            for (let index = 0; index < sortArray.length; index++) {
                const element = sortArray[index];
                console.log('####################################  ', sortArray[index].data)
                //guardar los id de medicamento que ya existen asigando 
                element.data.forEach(
                    e => {
                        this.medicamentosSeleccionados.push(e.idMedicamento)
                    }
                )
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

                this.tabsNPT = this.replaceOrAppend(this.tabsNPT, compData, (a, b) => a.id === b.id);
            }

            this.contarComponenteTotalNumero();

            this.medicamentosSeleccionados = [...new Set(this.medicamentosSeleccionados)];
            console.log('****************************************************************', this.medicamentosSeleccionados)
        }
    }

    replaceOrAppend(arr, val, compFn) {
        const res = [...arr];
        const i = arr.findIndex(v => compFn(v, val));
        if (i === -1) res.push(val);
        else res.splice(i, 1, val);
        return res;
    };

    ngOnInit() {

        this._mezclasService.getUsuario(this.objUrl.medico_mat, this.objUrl.medico_nombre, this.objUrl.medico_apaterno, this.objUrl.medico_amaterno, this.objUrl.PAC_AMEDICO,Perfil.MEDICO).then(
            (respuesta) => {
                if (respuesta != null) {
                    this.idUsuarioMedico = respuesta.id;
                }
            }
        )

        this.obtenerComponentes();
        //console.log('info del padre ', this.mezclaDetails);
        this.tabsMes = [];
        let auxM = {
            osmolaridad: this?.mezclaNutricionSelect?.detalleMezcla?.numOsmolaridad,
            nitrogeno: this?.mezclaNutricionSelect?.detalleMezcla?.numNitrogeno,
            proteinas: this?.mezclaNutricionSelect?.detalleMezcla?.numProteinas,
            kcnoproteicas: this?.mezclaNutricionSelect?.detalleMezcla?.numKcalNoProteicas,
            kctotales: this?.mezclaNutricionSelect?.detalleMezcla?.numKcalTotales,
            volumenTotal: this?.mezclaNutricionSelect?.detalleMezcla?.numVolumenTotal,
            diluyente: this?.mezclaNutricionSelect?.detalleDiluyente?.idDiluyente,
            dosis: this?.mezclaNutricionSelect?.detalleDiluyente?.numDosisDiluyente,
            unidadMedidaDil: this?.mezclaNutricionSelect?.detalleDiluyente?.refUnidadMinMedida,
            // fecApl : this?.mezclaNutricionSelect?.detalleDiluyente?.idDiluyente,
            cada: this?.mezclaNutricionSelect?.detalleDiluyente?.idAplicacionCada,
            numDosis: this?.mezclaNutricionSelect?.detalleDiluyente?.numTotalDosis,
        }

        this.valorCada = this?.mezclaNutricionSelect?.detalleDiluyente?.idAplicacionCada;

        this.modelAbajoNpt = { ...auxM }
        this.modelViaAdminNpt.viaAdmon = this?.mezclaNutricionSelect?.detalleDiluyente?.idViaAdministracion;
        this.modelViaAdminNpt.velocidadInfusion = this?.mezclaNutricionSelect?.detalleDiluyente?.refVelInfusion;
        this.modelViaAdminNpt.unidadTiempo = this?.mezclaNutricionSelect?.detalleDiluyente?.idTiempoInfusion;


    }

    contarComponenteTotalNumero() {

        this.componenteTotal = 0;
        this.tabsNPT.forEach(element => {
            this.componenteTotal = this.componenteTotal + element.counter;
        });

    }

    agregarMedicamento() {

        if (this.formNPT.valid) {

            let itemComponent = this.lsMedicamentos.find(e => e.id == this.modelNPT.componente);

        
            let newRow = {
                'idMedicamento': itemComponent.id,
                'medicamento': itemComponent.desCortaMedicamento,
                //'cveMedicamento': this.model2.cveMedicamento,
                'dosis': this.modelNPT.dosis,
                'unidadMedida': itemComponent.refUnidadMinMedida

            }
            //console.log(newRow);

            let tabElement = this.tabsNPT.find(e => e.id == this.modelNPT.tipoComponente);
            const newData = [...tabElement.data.data];
            newData.push(newRow);
            tabElement.data.data = newData;
            tabElement.counter = tabElement.data.data.length;


            if (this.componenteTotal >= 50) {
                this.btnAddDisabled = true

            } else {
                this.btnAddDisabled = false
            }

            this.modificarListadoMedicamento(this.modelNPT.componente,1);




        } else {

            const formValidar = [this.formNPT];
            this.validaCamposFormulario(formValidar);
            this._alertServices.errorCamposObligatorios();
        }

        this.contarComponenteTotalNumero();

    }

    modificarListadoMedicamento(idMed, tipo) {

        if (tipo == 1) {// agregar el medicamento usado
            this.medicamentosSeleccionados.push(idMed);
        }
        if (tipo == 2) {// regresa el medicamento a listado disponible
            const index = this.medicamentosSeleccionados.indexOf(idMed, 0);
            if (index > -1) {
                this.medicamentosSeleccionados.splice(index, 1);
            }
        }

        this.formNPT.reset();
        // this.$obsMedicamentosSeleccionados.next(this.medicamentosSeleccionados);
    }

    rechazarNtp(element, tabId) {

        const dialogRef = this._dialog.open(
            DialogComponent,
            this._dialogService.modalGenerico('Eliminar componente', '¿Deseas eliminar este componente de la mezcla?', null, 'Eliminar componente')
        );

        dialogRef.afterClosed().subscribe(
            async data => {
                if (data == true) {
                    let tabElement = this.tabsNPT.find(e => e.id == tabId);

                    

                    const index = tabElement.data.data.findIndex((e) => e.idMedicamento === element.idMedicamento);
                    tabElement.data.data.splice(index, 1);

                    tabElement.data = new MatTableDataSource<any>(tabElement.data.data);
                    tabElement.counter = tabElement.data.data.length;

                    this.contarComponenteTotalNumero();
                    this.modificarListadoMedicamento(element.idMedicamento,2)
                }
            }
        );

    }

    seleccionarTodo(event) {

        this.seleccionTodo = !this.seleccionTodo;

        for (let index = 0; index < this.tabsMes.length; index++) {
            let element = this.tabsMes[index];
            for (let j = 0; j < element.dias.length; j++) {
                let dia = element.dias[j];
                if (!dia.disabled) {
                    dia.check = event;
                }
            }

        }
        this.calculoDosis(this.valorCada);
        this.formAbajoNpt.controls['numDosis'].setValue(this.dosisTotales);

    }


    actualizarDia(event, item) {
        //console.log('data', event);
        //console.log('data', item);
        let elementMes = this.tabsMes.find((e) => e.nombreMes === item.nombreMes && e.nombreAnio == item.nombreAnio);
        let elementDia = elementMes.dias.find((e) => e.nombreMes === item.nombreMes && e.nombreAnio == item.nombreAnio && e.nombreDia == item.nombreDia);
        elementDia.check = event;
        //console.log(this.tipoMezcla)
        this.calculoDosis(this.valorCada)
        this.formAbajoNpt.controls['numDosis'].setValue(this.dosisTotales);

        this.actualizarSeleccionTodo();
        //console.log("tabs", this.tabs);
    }

    calculoDosis(element) {

        const cadaVal = this.cadaLst.find((e) => e.id === element);
        if (cadaVal != null) {
            let hrs = Number(cadaVal.desAplicacionCada.split(" ", 1));
            //console.log("cada >", hrs);
            this.dosisTotales = 0;
            for (let index = 0; index < this.tabsMes.length; index++) {
                const element = this.tabsMes[index];
                for (let j = 0; j < element.dias.length; j++) {
                    const dias = element.dias[j];
                    if (dias.check == true) {
                        this.dosisTotales = this.dosisTotales + 24 / hrs;

                    }
                }
            }
        }
    }

    actualizarSeleccionTodo(): void {
        let todosSeleccionados = true;

        this.tabsMes.forEach(tab => {
            tab.dias.forEach(dia => {
                if (!dia.check) {
                    todosSeleccionados = false;
                    return; // Salir del bucle interno tan pronto como se encuentre un día no seleccionado
                }
            });
            if (!todosSeleccionados) {
                return; // Salir del bucle externo tan pronto como se encuentre un día no seleccionado
            }
        });

        this.seleccionTodo = todosSeleccionados;
    }


    actualizarSeleccion(resp: any) {
        resp.forEach(ele => {

            this.tabsMes.forEach(tab => {
                tab.dias.forEach(dia => {

                    if (moment(dia.diaCompleto, 'YYYY-MM-DD').isSame(moment(ele.fecAplicacionDia, 'DD-MM-YYYY'), 'days')) {
                        // console.log(ele)
                        dia.check = true;
                        dia.idMezclaAplicDia = ele.idMezclaAplicDia;
                    }

                    if (moment(dia.diaCompleto, 'YYYY-MM-DD').isSame(moment(this.elementoSeleccionado.fechaAplicaionDia, 'DD/MM/YYYY'), 'days')) {
                        dia.actual = true;
                    }

                    //dia.disabled = moment(dia.diaCompleto, 'YYYY-MM-DD').isSameOrBefore(moment().add(1, 'days'), 'days')
                });
            });

        })
        this.actualizarSeleccionTodo();
    }


    validaFormularios() {
        return !(this.formAbajoNpt.valid && this.formViaAdminNpt.valid && (this.modelTipoMezcla.tipoMezcla != undefined) && (this.modelTipoMezcla.especialidad != undefined))
    }

    generaGuarda() {
        //crear mi modelo
        let lstMedicamentos = [];
        let lstFechasAplicacion = [];

        this.tabsNPT.forEach(
            ele => {
                ele.data.data.forEach(e => {
                    let med = {
                        idMezclaMedicDiluy: e.idMezclaMedicDiluy,// aun no terngo este dato
                        idMedicamento: e.idMedicamento,
                        numDosisMedicamento: e.dosis
                    }
                    lstMedicamentos.push(med);
                })
            }
        );

        this.tabsMes.forEach(el => {
            el.dias.forEach(dia => {
                if (dia.check) {
                    lstFechasAplicacion.push({ idMezclaAplicDia: dia.idMezclaAplicDia, fecAplicacionDia: dia.diaCompleto });
                }

            })

        })


        let lstIdDiluyenteAux = undefined ;      
      
        // if(this.modelTipoMezcla.tipoMezcla == this.TipoMezcla.ANTIBIOTICO){
        //   lstIdDiluyenteAux = [
        //     {
        //         idMezclaMedicDiluy: this.mezclaNutricionSelect.detalleDiluyente.idMezclaMedicDiluy,// dato que no se de donde se trae
        //         idDiluyente: this.modelAbajoNpt.diluyente,
        //         numDosisDiluyente: this.modelAbajoNpt.dosis
        //     }
        //   ]
        // }
        

        let modelMezcla = {
            idMezcla: this.elementoSeleccionado.idMezcla,
            lstMedicamentos: lstMedicamentos,
            lstFechasAplicacion: lstFechasAplicacion,
            fecInicioAplicacion: this.modelAbajoNpt.fecApl.startDate,
            fecFinAplicacion: this.modelAbajoNpt.fecApl.endDate,
            idAplicacionCada: this.modelAbajoNpt.cada,
            lstIdDiluyente: lstIdDiluyenteAux,
            numOsmolaridad: this.modelAbajoNpt.osmolaridad,
            numNitrogeno: this.modelAbajoNpt.nitrogeno,
            numProteinas: this.modelAbajoNpt.proteinas,
            numKcalNoProteicas: this.modelAbajoNpt.kcnoproteicas,
            numKcalTotales: this.modelAbajoNpt.kctotales,
            numVolumenTotal: this.modelAbajoNpt.volumenTotal,
            idViaAdministracion: this.modelViaAdminNpt.viaAdmon,
            idTiempoInfusion: this.modelViaAdminNpt.unidadTiempo,
            refVelInfusion: this.modelViaAdminNpt.velocidadInfusion
        }

        let lstMezclaRequest = [
            modelMezcla
        ];

        this.modeloPersistir = {
            cveUsuario: this.idUsuarioMedico, // validar de donde se saca el dato 
            idEspecialidad: this.modelTipoMezcla.especialidad,
            timSolicitudMezcla: 3, // validar de donde viene el dato 
            cveSistemaExterno: 'SISTEMAPHEDS', // validar el hardcode
            idTipoMezcla: this.modelTipoMezcla.tipoMezcla,
            lstMezclaRequest: lstMezclaRequest,
        }

        console.log(this.modeloPersistir);
        this._mezclasService.updateSolicitud(this.modeloPersistir).then(data => {

            if (data) {

                this._router.navigate([this._nav.seguimiento])
                setTimeout(() => {
                    this._alertServices.success('<strong>La información</strong> de la mezcla se actualizó con éxito.');
                }, 700);

            } else if (data == null) {
                this._alertServices.errorSave();
            }

        },
            (_err) => {
                this._alertServices.errorSave();
            }
        );
    }
    onActualizar() {



        const dialogGuardarCasmbios = this._dialog.open(
            DialogComponent,
            this._dialogService.guardarEdicionMezcla(this.elementoSeleccionado.folioMezcla)
        );

        dialogGuardarCasmbios.afterClosed().subscribe(
            async data => {
                if (data) {
                    this.generaGuarda();
                }
            }
        )




    }


}
