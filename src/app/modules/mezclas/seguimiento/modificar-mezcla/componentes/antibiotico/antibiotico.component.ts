import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { GeneralComponent } from 'src/app/modules/general/general.component';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { Perfil } from 'src/app/shared/general.enum';
import { CatalogoService } from 'src/app/shared/services/catalogo.service';
import { MezclasService } from 'src/app/shared/services/mezclas.service';
import { SeguimientoService } from 'src/app/shared/services/seguimiento.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
    selector: 'app-antibiotico',
    standalone: true,
    imports: [
        CommonModule,
        SharedModule,
    ],
    templateUrl: './antibiotico.component.html',
    styleUrls: ['./antibiotico.component.scss'],

})
export class AntibioticoComponent extends GeneralComponent {


    constructor() {
        super();
        this.objUrl = this._sesionStorage.getLoginUrl();
       
    }

    @Input() mezclaAntibioticoSelect: any;
    @Input() modelTipoMezcla: any;
    elementoSeleccionado: any = this._sesionStorage.getJsonValue('elementoModificarSeguimiento');

    idUsuarioMedico;
    objUrl: any = {};

    _catalogoService = inject(CatalogoService);
    _seguimientoService = inject(SeguimientoService);
    _mezclasService = inject(MezclasService);
    componenteTotal: number;
    componenteExcluidos: any;
    minDate = moment(new Date()).format('YYYY-MM-DD');
    lsMedicamentos: any = [];
    listDiluyente: any;
    tabsMes = [];
    cadaLst: any;
    dosisTotales: number = 0;
    valorCada: any;
    modeloPersistir: any;
    /**
     * formulario tipo antibiotico 
     */
    modelAntibiotico: any = {};
    formAntibiotico = new FormGroup({});
    fieldsAntibiotico: FormlyFieldConfig[] = [
        {
            fieldGroupClassName: 'row',
            fieldGroup: [
                {
                    className: "col-lg-8 col-md-6",
                    key: 'medicamento',

                    type: 'select',
                    props: {
                        label: 'Medicamento',
                        placeholder: 'Selecciona un medicamento',
                        required: true,
                        valueProp: 'id',
                        labelProp: 'desCortaMedicamento',
                        options: [],

                    },
                    hooks: {
                        afterViewInit: async (field) => {

                            this._catalogoService.getMedicamentos()
                                .then(
                                    (data: any) => {
                                        if (data) {

                                            this.lsMedicamentos = data;
                                            field.props.options = data;
                                        } else
                                            this._alertServices.error("<strong>Error</strong> al obtener conceptos de Medicamentos");
                                    },
                                    (_err) => {
                                        this._alertServices.error("<strong>Error</strong> al obtener conceptos de Medicamentos");
                                    }
                                );

                        },

                        onInit: async (field) => {

                            const medicamento = field.form.get('medicamento');
                            if (medicamento != null) {
                                medicamento.valueChanges.subscribe((x) => {
                                    if (x != null && x != '') {
                                        let medicamentoObj = this.lsMedicamentos.find(e => e.id == x);
                                        if (medicamentoObj.refUnidadMinMedida != null) {
                                            field.form.get('unidadMedidaMedicamento').setValue(medicamentoObj.refUnidadMinMedida);
                                            let mensaje = 'El medicamento <b>' + medicamentoObj.desCortaMedicamento + '/' + (medicamentoObj.cveMedicamento == null ? '' : medicamentoObj.cveMedicamento + ' ') + medicamentoObj.refUnidadMinMedida + '</b> no está disponible actualmente para la mezcla solicitada'
                                            this._alertServices.warn(mensaje);

                                        }
                                    }
                                });

                            }

                        },
                    },
                },


                {
                    className: "col-lg-2 col-md-6",
                    key: 'dosisMedicamento',
                    type: 'decimal',
                    props: {
                        label: 'Dosis',
                        placeholder: 'Ingresar la dosis',
                        //appInputMaskType: 'integer',
                        required: true,
                        maxLength: 11,
                        numEnteros:8,
                        numDecimales:2,
                    },
                },
                {
                    className: "col-lg-2 col-md-6",
                    key: 'unidadMedidaMedicamento',
                    type: 'input',// 'input-mask',
                    props: {
                        label: 'Unidad de medida',
                        placeholder: '-------------',
                        disabled: true,
                        maxLength: 5
                    }, hooks: {
                        afterViewInit: async (field) => {
                            //field.formControl.setValue(this.lsMedicamentos.refUnidadMinMedida);
                        }
                    }
                },
            ]
        },
        {
            fieldGroupClassName: 'row',
            fieldGroup: [
                {
                    className: "col-lg-8 col-md-6",
                    key: 'diluyente',
                    type: 'select',

                    props: {
                        label: 'Diluyente',
                        required: true,
                        placeholder: 'Selecciona el diluyente',
                        valueProp: 'id',
                        labelProp: 'desCortaDiluyente',

                        options: [],
                    },
                    hooks: {
                        afterViewInit: async (field) => {
                            this._catalogoService.getDiluyentes()
                                .then(
                                    (data: any) => {
                                        if (data) {
                                            this.listDiluyente = data
                                            field.props.options = data;
                                        } else
                                            this._alertServices.error("<strong>Error</strong> al obtener conceptos de Diluyente");
                                    },
                                    (_err) => {
                                        this._alertServices.error("<strong>Error</strong> al obtener conceptos de Diluyente");
                                    }
                                );
                        },
                        onInit: async (field) => {

                            const medicamento = field.form.get('diluyente');
                            if (medicamento != null) {
                                medicamento.valueChanges.subscribe((x) => {
                                    if (x != null && x != '') {
                                        let diluyente = this.listDiluyente.find(e => e.id == x);
                                        if (diluyente.refUnidadMinMedida != null) {
                                            field.form.get('unidadMedidaDil').setValue(diluyente.refUnidadMinMedida);
                                        }
                                    }
                                });

                            }

                        },
                    },
                },
                {
                    className: "col-lg-2 col-md-6",
                    key: 'dosisDiluyente',
                    type: 'decimal',
                    props: {
                        label: 'Dosis',
                        placeholder: 'Ingresa la dosis',
                        required: true,
                        //appInputMaskType: 'integer',
                        maxLength: 11,
                        numEnteros:8,
                        numDecimales:2,
                    },
                },
                {
                    className: "col-lg-2 col-md-6",
                    key: 'unidadMedidaDiluyente',

                    type: 'input',
                    props: {
                        label: 'Unidad de medida',
                        placeholder: '-------------',
                        disabled: true,
                        maxLength: 5
                    },
                },


            ]
        },
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
                        required: true,
                        fechaObs: new Subject<any>(),
                        disabled: true,
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

                    }
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
                                        this.valorCada = x
                                        this.calculoDosis(this.valorCada)
                                        this.formAntibiotico.controls['numDosis'].setValue(this.dosisTotales);
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

                },



            ]
        },


    ]

    //panel viad administracion
    modelViaAdmin: any = {};
    formViaAdmin = new FormGroup({});
    fieldsViaAdmin: FormlyFieldConfig[] = [
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
                        options: [],
                        valueProp: 'id',
                        labelProp: 'desViaAdministracion',
                    },
                    hooks: {
                        onInit: async (field) => {
                            this._catalogoService.getViaAdmon(3)
                                .then(
                                    (data: any) => {
                                        if (data) {
                                            field.props.options = data;
                                        } else this._alertServices.error("<strong>Error</strong> al obtener conceptos de vía de administración");
                                    },
                                    (_err) => {
                                        this._alertServices.error("<strong>Error</strong> al obtener conceptos de vía de administración");
                                    }
                                );
                        }
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
                        options: [],
                        valueProp: 'id',
                        labelProp: 'desTiempoInfusion',
                    },
                    hooks: {
                        onInit: async (field) => {
                            this._catalogoService.getTiempoInfusion()
                                .then(
                                    (data: any) => {
                                        if (data) {
                                            field.props.options = data;
                                        } else this._alertServices.error("<strong>Error</strong> al obtener conceptos de vía de administración");
                                    },
                                    (_err) => {
                                        this._alertServices.error("<strong>Error</strong> al obtener conceptos de vía de administración");
                                    }
                                );
                        }
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

    active = 0;
    seleccionTodo: boolean = false;
    color: boolean = false;

    ngOnInit() {

        this._mezclasService.getUsuario(this.objUrl.medico_mat, this.objUrl.medico_nombre, this.objUrl.medico_apaterno, this.objUrl.medico_amaterno, this.objUrl.PAC_AMEDICO,Perfil.MEDICO).then(
            (respuesta) => {
                if (respuesta != null) {
                    this.idUsuarioMedico = respuesta.id;
                }
            }
        )

        this.modelAntibiotico = {
            medicamento: this.mezclaAntibioticoSelect?.medicamentos[0].idMedicamento,
            dosisMedicamento: this.mezclaAntibioticoSelect?.medicamentos[0].numDosisMedicamento,
            unidadMedidaMedicamento: this.mezclaAntibioticoSelect?.medicamentos[0].refUnidadMinMedida,
            diluyente: this.mezclaAntibioticoSelect?.diluyentes[0].idDiluyente,
            dosisDiluyente: this.mezclaAntibioticoSelect?.diluyentes[0].numDosisDiluyente,
            unidadMedidaDiluyente: this.mezclaAntibioticoSelect?.diluyentes[0].refUnidadMinMedida,
            // fecApl:,
            cada: this.mezclaAntibioticoSelect?.diluyentes[0].idAplicacionCada,
            numDosis: this.mezclaAntibioticoSelect?.diluyentes[0].totalDosis
        }

        this.valorCada = this.mezclaAntibioticoSelect?.diluyentes[0].idAplicacionCada;

        this.modelViaAdmin = {
            viaAdmon: this.mezclaAntibioticoSelect?.diluyentes[0].idViaAdministracion,
            unidadTiempo: this.mezclaAntibioticoSelect?.diluyentes[0].idTiempoInfusion,
            velocidadInfusion: this.mezclaAntibioticoSelect?.diluyentes[0].refVelInfusion
        }
        // buscar los datos de la mezcla y generar un item para ser modificado


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


    seleccionarTodo(event) {
        this.seleccionTodo = !this.seleccionTodo;
        for (let index = 0; index < this.tabsMes.length; index++) {
            let element = this.tabsMes[index];
            for (let j = 0; j < element.dias.length; j++) {
                let dia = element.dias[j];
                if(!dia.disabled){
                    dia.check = event;
                }

            }
        }
        this.calculoDosis(this.valorCada);
        this.formAntibiotico.controls['numDosis'].setValue(this.dosisTotales);
    }


    actualizarDia(event, item) {
        //console.log('data', event);
        //console.log('data', item);

        this.color = event;

        let elementMes = this.tabsMes.find((e) => e.nombreMes === item.nombreMes && e.nombreAnio == item.nombreAnio);
        let elementDia = elementMes.dias.find((e) => e.nombreMes === item.nombreMes && e.nombreAnio == item.nombreAnio && e.nombreDia == item.nombreDia);
        elementDia.check = event;
        //console.log(this.tipoMezcla)
        this.calculoDosis(this.valorCada)

        this.formAntibiotico.controls['numDosis'].setValue(this.dosisTotales);



        item.check = event; // Actualizar el estado del elemento individual

        // Actualizar el estado de selección de todos los elementos
        this.actualizarSeleccionTodo();

        //console.log("tabs", this.tabs);

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
                        dia.check = ele.indActivo? true:false;
                        dia.idMezclaAplicDia = ele.idMezclaAplicDia;
                                               
                    }

                    if(moment(dia.diaCompleto, 'YYYY-MM-DD').isSame(moment(this.elementoSeleccionado.fechaAplicaionDia, 'DD/MM/YYYY'), 'days')){
                        dia.actual = true;
                    }

                    //dia.disabled = moment(dia.diaCompleto, 'YYYY-MM-DD').isSameOrBefore(moment(moment().format('YYYY-MM-DD')).add(1, 'days'), 'days')
                });
            });
        })
        this.actualizarSeleccionTodo();
    }

    validaFormularios() {
         return !(this.formAntibiotico.valid && this.formViaAdmin.valid && (this.modelTipoMezcla.tipoMezcla != undefined) && (this.modelTipoMezcla.especialidad != undefined))
    }

    generaGuarda() {
        //crear mi modelo
        let lstMedicamentos = [];
        let lstFechasAplicacion = [];
        this.mezclaAntibioticoSelect;
        let numDosisMedicamento: number = parseFloat(this.modelAntibiotico.dosisMedicamento)

        let med = {
            idMezclaMedicDiluy: this.mezclaAntibioticoSelect.medicamentos[0].idMezclaMedicDiluy,// aun no terngo este dato
            idMedicamento: this.modelAntibiotico.medicamento,
            numDosisMedicamento: numDosisMedicamento
        }
        lstMedicamentos.push(med);

        this.tabsMes.forEach(el => {
            el.dias.forEach(dia => {
                if (dia.check) {
                    lstFechasAplicacion.push({ idMezclaAplicDia: dia.idMezclaAplicDia, fecAplicacionDia: dia.diaCompleto });
                }
            })
        });

        let modelMezcla = {
            idMezcla: this.elementoSeleccionado.idMezcla,
            lstMedicamentos: lstMedicamentos,
            lstFechasAplicacion: lstFechasAplicacion,
            fecInicioAplicacion: this.modelAntibiotico.fecApl.startDate,
            fecFinAplicacion: this.modelAntibiotico.fecApl.endDate,
            idAplicacionCada: this.modelAntibiotico.cada,
            lstIdDiluyente: [
                {
                    idMezclaMedicDiluy: this.mezclaAntibioticoSelect.diluyentes[0].idMezclaMedicDiluy,// dato que no se de donde se trae
                    idDiluyente: this.modelAntibiotico.diluyente,
                    numDosisDiluyente: Number(this.modelAntibiotico.dosisDiluyente)
                }
            ],
            numOsmolaridad: this.modelAntibiotico.osmolaridad,
            numNitrogeno: this.modelAntibiotico.nitrogeno,
            numProteinas: this.modelAntibiotico.proteinas,
            numKcalNoProteicas: this.modelAntibiotico.kcnoproteicas,
            numKcalTotales: this.modelAntibiotico.kctotales,
            numVolumenTotal: this.modelAntibiotico.volumenTotal,
            idViaAdministracion: this.modelViaAdmin.viaAdmon,
            idTiempoInfusion: this.modelViaAdmin.unidadTiempo,
            refVelInfusion: this.modelViaAdmin.velocidadInfusion
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

            //console.log(data)
            if (data) {
                
                this._router.navigate([this._nav.seguimiento])
                setTimeout(() => {
                    this._alertServices.success('<strong>La información</strong> de la mezcla se actualizó con éxito.');
                }, 700);
                
            }else if(data == null){
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
        );
    }

}
