import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatTableDataSource } from '@angular/material/table';
import { GeneralComponent } from '../../general/general.component';
import { HeaderDetalleMezclaComponent } from "../../../shared/layout/header-detalle-mezcla/header-detalle-mezcla.component";
import { Subject, from } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { DialogFormlyComponent } from 'src/app/shared/dialog-formly/dialog-formly.component';
import { SeguimientoService } from 'src/app/shared/services/seguimiento.service';
import { CatalogoService } from 'src/app/shared/services/catalogo.service';
import { DetalleAntibioticoComponent } from './detalle-antibiotico/detalle-antibiotico.component';
import { EstatusMezcla, Perfil, TipoMezcla, desPerfil, eventoBitacora } from 'src/app/shared/general.enum';
import { DetalleCitotoxicoComponent } from './detalle-citotoxico/detalle-citotoxico.component';
import { DetalleNptComponent } from './detalle-npt/detalle-npt.component';
import { NAV } from 'src/app/shared/config/global';
import * as moment from 'moment';
import { Sort } from '@angular/material/sort';
import { MezclasService } from 'src/app/shared/services/mezclas.service';
import { AuthService } from '../../login/services/auth.service';


@Component({
    selector: 'app-seguimiento',
    standalone: true,
    templateUrl: './seguimiento.component.html',
    styleUrls: ['./seguimiento.component.scss','../../../../styles-estatus.scss'],
    imports: [
        CommonModule,
        SharedModule,
        HeaderDetalleMezclaComponent
    ]
})
export class SeguimientoComponent extends GeneralComponent {

    constructor() {
        super();
        this.objUrl = this._sesionStorage.getLoginUrl();
        this.refNss = this.objUrl.PAC_NSS;
        this.model = { refNss: this.objUrl.PAC_NSS };
    }

    _seguimientoService = inject(SeguimientoService);
    _catalogoService = inject(CatalogoService);
    _mezclaService = inject(MezclasService);
    _authService = inject(AuthService);

    idUsuarioMedico;

    objUrl: any = {};
    maxLengthFolio: number = 20;
    refNss = '';
    model: any = {};
    form = new FormGroup({});
    fields: FormlyFieldConfig[] = [
        {
            fieldGroupClassName: 'row',
            fieldGroup: [
                {
                    key: 'refNss',
                    defaultValue: this.refNss,
                },
                {
                    key: 'valPerfil',
                    defaultValue: 'medico',
                },
                {
                    className: "col-lg-3 col-md-6",
                    key: 'rangoFechaAux',
                    type: 'material-date',
                    templateOptions: {
                        label: 'Rango de fecha',
                        range: true,
                    },

                },
                {
                    className: "col-lg-3 col-md-6",
                    key: 'estatus',
                    type: 'select',
                    props: {
                        label: 'Estatus',
                        placeholder: 'Selecciona el estatus',
                        valueProp: 'id',
                        labelProp: 'desEstatusMezcla',
                        options: from(this._catalogoService.getEstatusMezclaSeguimiento()),
                    },

                },
                {
                    className: "col-lg-3 col-md-6",
                    key: 'folioAux',
                    type: 'input-folio',
                    props: {
                        label: 'Folio',
                        placeholder: 'Ingresa el folio',
                        tipoFolioAuxDefault: '1',
                        radioObs: new Subject<any>(),
                    },
                    expressions: {
                        'props.maxLength': (field) => {
                            return field.model.tipoFolioAux == 1 ? 20 : 15;
                        },
                    },
                    hooks: {
                        afterViewInit: async (field) => {

                            field.props['radioObs'].subscribe(
                                (change) => {
                                    if (change == 1) {
                                        this.maxLengthFolio = 20;
                                    }
                                    if (change == 2) {
                                        this.maxLengthFolio = 15;

                                    }

                                }
                            )

                        },
                    }
                },
                {
                    className: "col-lg-3 col-md-6",
                    key: 'tMezcla',
                    type: 'select',
                    props: {
                        label: 'Tipo de mezcla',
                        placeholder: 'Selecciona el tipo de mezcla',
                        valueProp: 'id',
                        labelProp: 'desTipoMezcla',
                        options: from(this._catalogoService.getTipoMezcla()),
                    },

                },
            ]
        },



    ];

    displayedColumns = ['folioSolicitud', 'folioMezcla', 'tipoMezcla', 'ultimaFecha', 'estatus', 'seguimiento']

    myData;
    tableDS: MatTableDataSource<any>;
    paginaActual: number = 0;

    headerData = {
        uno: [
            {
                class: 'col-lg-3',
                titulo: 'Paciente',
                texto: '--'
            },
            {
                class: 'col-lg-7',
                titulo: 'Diagnóstico',
                isDiagnostico: true,
                texto: '--'
            },

            {
                class: 'col-lg-2',
                texto: 'Seguimiento de mezcla'
            },
        ],
        dos: [
            {
                class: 'col-lg-3',
                colorClass: 'yellow',
                iconName: 'yellow-h.svg',
                informacion: [
                    {
                        separador: false,
                        titulo: 'Edad',
                        texto: '',

                    },
                    {
                        separador: true,
                        titulo: 'Sexo',
                        texto: '',

                    }
                ]

            },
            {
                class: 'col-lg-6',
                colorClass: 'green',
                iconName: 'green-h.svg',
                informacion: [
                    {
                        separador: false,
                        titulo: 'NSS',
                        texto: '',
                    },
                    {
                        separador: true,
                        titulo: 'A. Médico',
                        texto: '',
                    },
                    {
                        separador: true,
                        titulo: 'U. de Adscripción',
                        texto: '--',
                    },
                ]

            },
            {
                class: 'col-lg-3',
                colorClass: 'blue',
                iconName: 'info-h.svg',
                informacion: [
                    {
                        separador: false,
                        titulo: 'CURP',
                        texto: '',
                    },

                ]

            },

        ]
    }
    collectionSize: number = 0;

    ngOnInit() {
        this._mezclaService.getUsuario(this.objUrl.medico_mat, this.objUrl.medico_nombre, this.objUrl.medico_apaterno, this.objUrl.medico_amaterno, this.objUrl.PAC_AMEDICO,Perfil.MEDICO).then(
            (respuesta) => {
                if (respuesta != null) {
                    this.idUsuarioMedico = respuesta.id;

                    //se integra evento bitacora en inicio de sesion 
                    let model ={
                        "idEvento": eventoBitacora.LOGIN_EXITOSO_PHEDS_SEGUIMIENTO,
                        "cveUsuario": respuesta.id,
                        "refNombreUsuario": this.objUrl.medico_nombre + ' ' + this.objUrl.medico_apaterno + ' ' + this.objUrl.medico_amaterno,
                        "refPerfilUsuario": desPerfil.MEDICO
                    }
                    this._authService.eventoBitacora(model)
                }
            }
        )

        let aux = { ...this.headerData };
        this._seguimientoService.getDatosPaciente(this.refNss).then(
            resp => {
                aux['uno'][0].texto = resp.nombrePaciente;
                aux['uno'][1].texto = resp.diagnostico;
                aux['dos'][0].informacion[0].texto = resp.edad;
                aux['dos'][0].informacion[1].texto = resp.sexo;
                aux['dos'][1].informacion[0].texto = resp.nss;
                aux['dos'][1].informacion[1].texto = resp.agregadoMedico;
                aux['dos'][1].informacion[2].texto = resp.desUnidadMedica;
                aux['dos'][2].informacion[0].texto = resp.curp;
                this.headerData = { ...aux }
            }
        )

        this.pageChanged(1);
    }

    pageChanged(event: any) {
        if (this.model.rangoFechaAux != undefined && this.model.rangoFechaAux.startDate != null && this.model.rangoFechaAux.endDate != null) {
            this.model.fecha = this.model.rangoFechaAuxString.startDate + '--' + this.model.rangoFechaAuxString.endDate;
        }
        if (this.model.tipoFolioAux == 1 && this.model.folioAux) {
            this.model.folMezcla = this.model.folioAux;
            delete this.model['folSol'];
        }
        if (this.model.tipoFolioAux == 2 && this.model.folioAux) {
            this.model.folSol = this.model.folioAux;
            delete this.model['folMezcla'];
        }

        let req = {
            page: event - 1,
            size: this.ConfigTabla.NUM_ELEMENTOS_TABLA,
            filtros: this.model,
        }

        this._seguimientoService.getHistorial(req).then(resp => {

            if (resp) {
                this.collectionSize = resp.totalElements;
                this.myData = resp.content;
                this.tableDS = new MatTableDataSource(this.myData);
            }

            if (this.collectionSize == 0) {
                this._alertServices.error('<strong>No se encontraron resultados</strong> con los criterios de búsqueda.');
            }
        })
    }



    onVerDetalle(elemento) {
        if (elemento.idTipoMezcla == 3) {
            let data = { mezcla: elemento, objUrl: this.objUrl, diagnostico: this.headerData['uno'][1].texto };
            const dialogRef = this._dialog.open(DetalleAntibioticoComponent, { disableClose: true, width: '99%', data });
            dialogRef.afterClosed();
        }
        if (elemento.idTipoMezcla == 1) {
            let data = { mezcla: elemento, objUrl: this.objUrl, diagnostico: this.headerData['uno'][1].texto };
            const dialogRef = this._dialog.open(DetalleCitotoxicoComponent, { disableClose: true, width: '99%', data });
            dialogRef.afterClosed();
        }
        if (elemento.idTipoMezcla == 2) {
            let data = { mezcla: elemento, objUrl: this.objUrl, diagnostico: this.headerData['uno'][1].texto };
            const dialogRef = this._dialog.open(DetalleNptComponent, { disableClose: true, width: '99%', data });
            dialogRef.afterClosed();
        }
    }

    fieldsRat: FormlyFieldConfig[] = [
        {
            fieldGroupClassName: 'row',
            fieldGroup: [
                {
                    className: "col-lg-3 col-md-6",
                    key: 'EstatusMezcla',
                    type: 'select',
                    props: {
                        label: 'Tipo de mezcla',
                        placeholder: 'Selecciona el tipo de mezcla',
                        valueProp: 'id',
                        labelProp: 'desEstatusMezcla',
                        options: [],
                    },
                },
            ]
        },
    ];

    resetForm() {
        this.model = { ...{ tipoFolioAux: 1, rangoFechaAux: undefined, refNss: this.refNss, valPerfil: 'medico' } }
        this.form.reset(this.model)
        this.pageChanged(1);
    }


    ratificar(model, elemento) {
        model.idHistorico = elemento.idHistorico;
        model.cveUsuario = this.idUsuarioMedico;
        console.log(model)
        this._seguimientoService.ratificar(model).then(
            resp => {
                if (resp) {
                    this._alertServices.success('<strong>La información</strong> de la mezcla se actualizó con éxito.');
                    this.pageChanged(this.paginaActual);
                }
                if (resp == null) {
                    this._alertServices.errorSave();
                }
            },
            error => {
                this._alertServices.errorSave();
            }
        )
    }

    cancelar(model, elemento) {
        model.idHistorico = elemento.idHistorico;
        model.cveUsuario = this.idUsuarioMedico;
        model.indCancelacionRatif = elemento.estatus.id == this.EstatusMezcla.NO_APROBADA ? 1 : undefined; 
        console.log(model)
        this._seguimientoService.cancelar(model).then(resp => {
            if (resp) {
                this._alertServices.success('<strong>La información</strong> de la mezcla se actualizó con éxito.');
                this.pageChanged(this.paginaActual);
            }
            if (resp == null) {
                this._alertServices.errorSave();
            }

        },
            error => {
                this._alertServices.errorSave();
            })
    }
    onAccion(tipo, elemento) {

        if (tipo == 1) {//editar
            this._sesionStorage.setJsonValue('elementoModificarSeguimiento', elemento);

            if (elemento.idTipoMezcla == TipoMezcla.ANTIBIOTICO) {
                this._seguimientoService.getDetalleAntibiotico(elemento.idMezclaAplicDiaDosis).then(
                    resp => {
                        if (resp) {

                            this._sesionStorage.setJsonValue('mezclaAntibioticoSelect', resp);
                            this._router.navigate([NAV.modificacion]);
                        }
                    }
                );
            } else if (elemento.idTipoMezcla == TipoMezcla.NUTRICION) {
                this._seguimientoService.getDetalleNpt(elemento.idMezclaAplicDiaDosis).then(
                    resp => {
                        if (resp) {

                            this._sesionStorage.setJsonValue('mezclaNutricionSelect', resp);
                            this._router.navigate([NAV.modificacion]);
                        }
                    }
                );
            }

        }
        if (tipo == 2) {//ratificar
            const dialogRef = this._dialog.open(DialogFormlyComponent, this._dialogFormlyService.ratificar());
            dialogRef.afterClosed().subscribe(model => {
                if (model) {
                    this.ratificar(model, elemento);
                }
            });
        }
        if (tipo == 3) {//cancelar
            const dialogRef = this._dialog.open(DialogFormlyComponent, this._dialogFormlyService.cancelar());
            dialogRef.afterClosed().subscribe(model => {

                if (model) {
                    this.cancelar(model, elemento);
                }

            });
        }
    }

    validaAcciones() {
        if ((
            this.form.valid)
            && (
                this.model.rangoFechaAux != undefined
                || this.model.estatus != undefined
                || (this.model.folioAux != undefined && this.model.folioAux != '')
                || this.model.tMezcla != undefined)
        ) {
            return false;
        }

        return true;
    }

    validaFecha(dia) {
        return (moment(dia, 'DD/MM/YYYY').isSameOrBefore(moment().add(1, 'days'), 'days'))
    }


    //validar con estatus no aprobada
    validarMenu(element) {

        if (element.estatus.id == EstatusMezcla.SOLICITADA) {
            return true;
        }

        if (element.estatus.id == EstatusMezcla.NO_APROBADA) {
            return true;
        }

        return false;
    }

    validaAccionEditar(element) {

        if (element.estatus.id == EstatusMezcla.SOLICITADA && (element.idTipoMezcla == TipoMezcla.ANTIBIOTICO || element.idTipoMezcla == TipoMezcla.NUTRICION)) {
            return true;
        }

        return false;
    }

    validaAccionRatificar(element) {
        if (element.estatus.id == EstatusMezcla.NO_APROBADA) {
            return true;
        }
        return false;
    }

    validaAccionCancelar(element) {
        if ((element.idTipoMezcla == TipoMezcla.ANTIBIOTICO || element.idTipoMezcla == TipoMezcla.NUTRICION) && (element.estatus.id == EstatusMezcla.SOLICITADA || element.estatus.id == EstatusMezcla.NO_APROBADA)) {
            return true;
        }
        return false;
    }

    shortTable(sort: Sort) {
        console.log("colName " + sort);
        const array = this.tableDS.data;
        let des = sort.direction == 'desc';
        const sortedArray = this.sortArrayOfObjects(array, sort.active, des);
        this.tableDS = new MatTableDataSource(sortedArray);
    }


    fillEjemplo() {
        return [
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
                "id": 16,
                "descripcion": "Cancelada"
              }
            },
            {
              "nombre": "MANUEL EDUARDO DE GUGLIELMO DE GUGLIELMO",
              "fechaHora": "13/03/2024 01:27",
              "perfil": "Médico",
              "estatus": {
                "id": 3,
                "descripcion": "Aprobada"
              }
            },
            {
              "nombre": "MANUEL EDUARDO DE GUGLIELMO DE GUGLIELMO",
              "fechaHora": "13/03/2024 01:27",
              "perfil": "Médico",
              "estatus": {
                "id": EstatusMezcla.NO_APROBADA,
                "descripcion": "no aprobada"
              }
            },
            {
              "nombre": "MANUEL EDUARDO DE GUGLIELMO DE GUGLIELMO",
              "fechaHora": "13/03/2024 01:27",
              "perfil": "Médico",
              "estatus": {
                "id": 14,
                "descripcion": 'No Aprobada (Cancelada por sistema)'
              }
            },
            {
              "nombre": "MANUEL EDUARDO DE GUGLIELMO DE GUGLIELMO",
              "fechaHora": "13/03/2024 01:27",
              "perfil": "Médico",
              "estatus": {
                "id": 13,
                "descripcion": "Ratificada"
              }
            },
            {
              "nombre": "MANUEL EDUARDO DE GUGLIELMO DE GUGLIELMO",
              "fechaHora": "13/03/2024 01:27",
              "perfil": "Médico",
              "estatus": {
                "id": 4,
                "descripcion": "en preparacion"
              }
            },
            {
              "nombre": "MANUEL EDUARDO DE GUGLIELMO DE GUGLIELMO",
              "fechaHora": "13/03/2024 01:27",
              "perfil": "Médico",
              "estatus": {
                "id": 5,
                "descripcion": "preparada"
              }
            },
            {
              "nombre": "MANUEL EDUARDO DE GUGLIELMO DE GUGLIELMO",
              "fechaHora": "13/03/2024 01:27",
              "perfil": "Médico",
              "estatus": {
                "id": 6,
                "descripcion": "no aprobada por MA"
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
            },
            {
              "nombre": "MANUEL EDUARDO DE GUGLIELMO DE GUGLIELMO",
              "fechaHora": "13/03/2024 01:27",
              "perfil": "Médico",
              "estatus": {
                "id": 8,
                "descripcion": "en ruta"
              }
            },
            {
              "nombre": "MANUEL EDUARDO DE GUGLIELMO DE GUGLIELMO",
              "fechaHora": "13/03/2024 01:27",
              "perfil": "Médico",
              "estatus": {
                "id": 10,
                "descripcion": "rechazada por um "
              }
            },
            {
              "nombre": "MANUEL EDUARDO DE GUGLIELMO DE GUGLIELMO",
              "fechaHora": "13/03/2024 01:27",
              "perfil": "Médico",
              "estatus": {
                "id": 9,
                "descripcion": "recibida por  um"
              }
            },
            {
              "nombre": "MANUEL EDUARDO DE GUGLIELMO DE GUGLIELMO",
              "fechaHora": "13/03/2024 01:27",
              "perfil": "Médico",
              "estatus": {
                "id": 11,
                "descripcion": "aplicada"
              }
            },
            {
              "nombre": "MANUEL EDUARDO DE GUGLIELMO DE GUGLIELMO",
              "fechaHora": "13/03/2024 01:27",
              "perfil": "Médico",
              "estatus": {
                "id": 12,
                "descripcion": "no aplicada"
              }
            },
    
    
    
    
          ];
      }
    

}
