import { Injectable } from "@angular/core";
import { MatDialogConfig } from "@angular/material/dialog";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { AlertService } from "../alert";
import { CatalogoService } from "../services/catalogo.service";
import { from, of } from "rxjs";

@Injectable({ providedIn: 'root' })
export class GenericFormlyDialogService {

    private dialogConfig = new MatDialogConfig();
    
    constructor(
        private catalogService: CatalogoService,
        private alertServices: AlertService


    ) {


    }
    fieldsPrescripcionNoAprobar: FormlyFieldConfig[] = [
        {
            fieldGroupClassName: 'row',
            fieldGroup: [
                {
                    className: "col-6",
                    key: 'motivo',
                    type: 'select',
                    props: {
                        label: 'Motivo de rechazo',
                        valueProp: 'id',
                        required: true,
                        labelProp: 'desMotivoRechazo',
                        options: [],
                        placeholder: 'Selecciona un motivo'
                    },
                    hooks: {
                        onInit: async (field) => {

                            this.catalogService.getMotivoRechazo()
                                .subscribe(
                                    (data: any) => {
                                        if (data) {

                                            field.props.options = data;
                                        } else
                                            this.alertServices.error("<strong>Error</strong> al obtener conceptos de Motivos de Rechazo");
                                    },
                                    (_err) => {
                                        this.alertServices.error("<strong>Error</strong> al obtener conceptos de Motivos de Rechazo");
                                    }
                                );

                        },

                    },
                },
                {
                    className: "col-12",
                    key: 'observaciones',
                    type: 'textarea',
                    props: {
                        rows: 5,
                        label: 'Observaciones',
                        maxLength: 500,
                        required: true,
                    },
                },
            ]
        },
    ];

    fieldsGuardarResolucion: FormlyFieldConfig[] = [
        {
            fieldGroupClassName: 'row',
            fieldGroup: [
                {
                    className: "col-12",
                    key: 'idCausaAtribuible',
                    type: 'select',
                    props: {
                        label: 'Causa atribuible',
                        placeholder: 'Selecciona una causa',
                        valueProp: 'id',
                        required: true,
                        labelProp: 'desCausaAtribuible',
                        options: [],
                    },
                    hooks: {
                        onInit: async (field) => {

                            this.catalogService.getCausaAtribuible()
                                .subscribe(
                                    (data: any) => {
                                        if (data) {

                                            field.props.options = data;
                                        } else
                                            this.alertServices.error("<strong>Error</strong> al obtener conceptos de Motivos de Rechazo");
                                    },
                                    (_err) => {
                                        this.alertServices.error("<strong>Error</strong> al obtener conceptos de Motivos de Rechazo");
                                    }
                                );

                        },

                    },
                },                {
                    className: "col-12",
                    key: 'idMedidaCorrectiva',
                    type: 'select',
                    props: {
                        label: 'Medidas correctivas',
                        valueProp: 'id',
                        placeholder: 'Selecciona un componente',
                        required: true,
                        labelProp: 'desMedidaCorrectiva',
                        options: [],
                    },
                    hooks: {
                        onInit: async (field) => {

                            this.catalogService.getMedidaCorrectiva()
                                .subscribe(
                                    (data: any) => {
                                        if (data) {
                                            field.props.options = data;
                                        } else
                                            this.alertServices.error("<strong>Error</strong> al obtener conceptos de Motivos de Rechazo");
                                    },
                                    (_err) => {
                                        this.alertServices.error("<strong>Error</strong> al obtener conceptos de Motivos de Rechazo");
                                    }
                                );

                        },

                    },
                },
                {
                    className: "col-12",
                    key: 'refObsResolucInvest',
                    type: 'textarea',
                    props: {
                        rows: 5,
                        label: 'Observaciones',
                        maxLength: 500
                    },
                },
            ]
        },
    ];

    fieldsRatificar: FormlyFieldConfig[] = [
        {
            fieldGroupClassName: 'row',
            fieldGroup: [
                {
                    className: "col-12",
                    key: 'obs',
                    type: 'textarea',
                    props: {
                        rows: 5,
                        label: 'Observaciones',
                        maxLength: 500,
                        required: true,
                    },

                },
            ]
        },
    ];
    fieldsCancelar: FormlyFieldConfig[] = [
        {
            fieldGroupClassName: 'row',
            fieldGroup: [
                {
                    className: "col-12",
                    key: 'idMotivoCancelacion',
                    type: 'select',
                    props: {
                        label: 'Motivo',
                        placeholder:'Selecciona una causa',
                        options: from(this.catalogService.getMotivoCancelacion()),
                        valueProp: 'id',
                        labelProp: 'desMotivoCancelacion',
                        required: true,
                    },
                },
                {
                    className: "col-12",
                    key: 'obs',
                    type: 'textarea',
                    props: {
                        rows: 5,
                        label: 'Observaciones',
                        required: true,
                        maxLength: 500
                    },
                },
            ]
        },
    ];

    fieldsNoAprobacionMA: FormlyFieldConfig[] = [
        {
            fieldGroupClassName: 'row',
            fieldGroup: [
                {
                    className: "col-8",
                    key: 'idmotivoRch',
                    type: 'select',
                    props: {
                        label: 'Motivo de rechazo',
                        placeholder: 'Selecciona motivo de rechazo',
                        valueProp: 'id',
                        required: true,
                        labelProp: 'desCausaAtribuible',
                        options: [],
                    },
                    hooks: {
                        onInit: async (field) => {

                            this.catalogService.getCausaAtribuible()
                                .subscribe(
                                    (data: any) => {
                                        if (data) {

                                            field.props.options = data;
                                        } else
                                            this.alertServices.error("<strong>Error</strong> al obtener conceptos de Motivos de Rechazo");
                                    },
                                    (_err) => {
                                        this.alertServices.error("<strong>Error</strong> al obtener conceptos de Motivos de Rechazo");
                                    }
                                );

                        },

                    },
                },
                {
                    className: "col-12",
                    key: 'refObsResolucInvest',
                    type: 'textarea',
                    props: {
                        rows: 5,
                        label: 'Observaciones',
                        maxLength: 500,
                        required:true
                    },
                },
            ]
        },
    ];

    
    fieldsReimpresion: FormlyFieldConfig[] = [
        {
            fieldGroupClassName: 'row',
            fieldGroup: [
                {
                    className: "col-8",
                    key: 'idmotivoReimp',
                    type: 'select',
                    props: {
                        label: 'Motivo de reimpresión',
                        placeholder: 'Selecciona un motivo de reimpresión',
                        valueProp: 'id',
                        required: true,
                        labelProp: 'desMotivoReimpresion',
                        options: [],
                    },
                    hooks: {
                        onInit: async (field) => {

                            this.catalogService.getMotivoReimpresion()
                                .then(
                                    (data: any) => {
                                        if (data) {

                                            field.props.options = data;
                                        } else
                                            this.alertServices.error("<strong>Error</strong> al obtener conceptos de Motivos de Reimpresión");
                                    },
                                    (_err) => {
                                        this.alertServices.error("<strong>Error</strong> al obtener conceptos de Motivos de Reimpresión");
                                    }
                                );

                        },

                    },
                },
                {
                    className: "col-md-4",
                    key: 'mat_radio',
                    type: 'mat-radio',
                    props: {
                        label: 'Número de impresiones',
                        required: true,
                        
                        options: [
                            { value: 1, label: 'Uno' , },
                            { value: 2, label: 'Dos' , },
                        ],
                    },
                },
                {
                    className: "col-12",
                    key: 'refObsResolucInvest',
                    type: 'textarea',
                    props: {
                        rows: 5,
                        label: 'Observaciones',
                        maxLength: 500,
                        required: true
                    },
                },
            ]
        },
    ];

    fieldsRechazoRecepcionUM: FormlyFieldConfig[] = [
        {
            fieldGroupClassName: 'row',
            fieldGroup: [
                {
                    className: "col-12",
                    key: 'motivo',
                    type: 'select',
                    props: {
                        label: 'Motivo',
                        valueProp: 'id',
                        required: true,
                        labelProp: 'desMotivoRechazo',
                        options: [],
                        placeholder: 'Selecciona un motivo'
                    },
                    hooks: {
                        onInit: async (field) => {

                            this.catalogService.getMotivoRechazoRecepcionUM()
                                .subscribe(
                                    (data: any) => {
                                        if (data) {

                                            field.props.options = data;
                                        } else
                                            this.alertServices.error("<strong>Error</strong> al obtener conceptos de Motivos de Rechazo");
                                    },
                                    (_err) => {
                                        this.alertServices.error("<strong>Error</strong> al obtener conceptos de Motivos de Rechazo");
                                    }
                                );

                        },

                    },
                },
                {
                    className: "col-12",
                    key: 'observaciones',
                    type: 'textarea',
                    props: {
                        rows: 5,
                        label: 'Observaciones',
                        maxLength: 500,
                        required: true,
                       
                    },
                    hooks:{
                    onInit: async (field) => {
/*
                        const observaciones = field.form.get('observaciones');
                        if (observaciones != null) {
                            observaciones.valueChanges.subscribe((x) => {
                                console.log("data",x);
                                console.log("fin data");
                            
                                if(/\r?\n|\r/g.test(x)==true ){
                                    let newstr = x.replace(/\r?\n|\r/g,""); 
                                    field.form.get('observaciones').setValue(newstr);
                                }
                             
                               
                            
                          });
          
                        }*/
          
                      },
                    }
                },
            
            ]
        },
    ];

    fieldsImprimirEtiquetaAntCito: FormlyFieldConfig[] = [
        {
            fieldGroupClassName: 'row',
            fieldGroup: [
            
                {
                    className: "col-md-12 d-flex justify-content-start",
                    key: 'mat_radio',
                    type: 'mat-radio-left',
                    props: {
                      
                        label: '¿La mezcla necesita ser refrigerada?',
                        required: true,
                        
                        options: [
                            { value: 17, label: 'No, no refrigerar una vez preparada' , },
                            { value: 18, label: 'Sí, Mantener en refrigeración hasta su administración' , },
                        ],
                    },
                },
                
                {
                    className: 'col-md-12',
                    key: 'recomendaciones',
                    type: 'multi-select',
                    templateOptions: {
                      multiple: true,
                      label: 'Recomendaciones',
                      placeholder: 'Selecciona recomendaciones',
                      valueProp: 'id',
                      required: false,
                      labelProp: 'desRecomEtiquetaMezcla',
                      opciones: [],
                      tipoMezcla:'AntCito',

                    
                      target:'recomendaciones'
                    },/*
                    hooks: {
                        onInit: async (field) => {

                            this.catalogService.getRecomendacionEtiqueta()
                                .then(
                                    (data: any) => {
                                        if (data) {
 
                                           field.templateOptions['opciones'] = data;
                                        } else
                                            this.alertServices.error("<strong>Error</strong> al obtener conceptos de Recomendaciones");
                                    },
                                    (_err) => {
                                        this.alertServices.error("<strong>Error</strong> al obtener conceptos de Recomendaciones");
                                    }
                                );

                        },

                    },*/
                  },
               
            ]
        },
    ];
    fieldsImprimirEtiquetaNTP: FormlyFieldConfig[] = [
        {
            fieldGroupClassName: 'row',
            fieldGroup: [
            
                {
                    className: "col-md-12 d-flex justify-content-start",
                    key: 'mantenerRefri',
                    type: 'textoTitulo',
                    props: {
                        tituloSize:'12',
                        label: 'Mantener en refrigeración hasta su administración',
                     
                    },
                },
                
                {
                    className: 'col-md-12',
                    key: 'recomendaciones',
                    type: 'multi-select',
                    templateOptions: {
                      multiple: true,
                      label: 'Recomendaciones',
                      placeholder: 'Selecciona recomendaciones',
                      valueProp: 'id',
                      required: false,
                      labelProp: 'desRecomEtiquetaMezcla',
                      opciones: [],
                      tipoMezcla:'NTP',

                    
                      target:'recomendaciones'
                    },/*
                    hooks: {
                        onInit: async (field) => {

                            this.catalogService.getRecomendacionEtiqueta()
                                .then(
                                    (data: any) => {
                                        if (data) {
 
                                           field.templateOptions['opciones'] = data;
                                        } else
                                            this.alertServices.error("<strong>Error</strong> al obtener conceptos de Recomendaciones");
                                    },
                                    (_err) => {
                                        this.alertServices.error("<strong>Error</strong> al obtener conceptos de Recomendaciones");
                                    }
                                );

                        },

                    },*/
                  },
               
            ]
        },
    ];
    ratificar(): MatDialogConfig {
        this.dialogConfig.restoreFocus = false;
        this.dialogConfig.autoFocus = false;
        this.dialogConfig.width = '678px';
        this.dialogConfig.disableClose = true;
        this.dialogConfig.data = {
            title: "Ratificar mezcla",
            subtitle: "ss",
            // cancelTxtBtn: "Salir",
            confirmTxtBtn: "Ratificar",
            fields: this.fieldsRatificar,
        }
        return this.dialogConfig;
    }

    cancelar(): MatDialogConfig {
        this.dialogConfig.restoreFocus = false;
        this.dialogConfig.autoFocus = false;
        this.dialogConfig.width = '678px';
        this.dialogConfig.disableClose = true;
        this.dialogConfig.data = {
            title: "Cancelar mezcla",
            subtitle: "ss",
            //cancelTxtBtn: "Salir",
            confirmTxtBtn: "Cancelar mezcla",
            fields: this.fieldsCancelar,
        }
        return this.dialogConfig;
    }
    noAprobarMezclaPrescricion(): MatDialogConfig {
        this.dialogConfig.restoreFocus = false;
        this.dialogConfig.autoFocus = false;
        this.dialogConfig.width = '678px';
        this.dialogConfig.disableClose = true;
        this.dialogConfig.data = {
            title: "Prescripción no aprobada",
            subtitle: "",
         //   cancelTxtBtn: "Cancelar",
            confirmTxtBtn: "Aceptar",
            fields: this.fieldsPrescripcionNoAprobar,
        }
        return this.dialogConfig;
    }

    guardarResolucion(): MatDialogConfig {
        this.dialogConfig.restoreFocus = false;
        this.dialogConfig.autoFocus = false;
        this.dialogConfig.width = '678px';
        this.dialogConfig.disableClose = true;
        this.dialogConfig.data = {
            title: "Resolución de investigación ",
            subtitle: "",
         //   cancelTxtBtn: "Cancelar",
            confirmTxtBtn: "Generar reporte",
            fields: this.fieldsGuardarResolucion,
        }
        return this.dialogConfig;
    }

    modalFormlyGenerico(title,confirmTxtBtn,fieldsGuardarResolucion): MatDialogConfig {
        this.dialogConfig.restoreFocus = false;
        this.dialogConfig.autoFocus = false;
        this.dialogConfig.width = '900px';
        this.dialogConfig.disableClose = true;
        this.dialogConfig.data = {
            title: title,
            subtitle: "",
         //   cancelTxtBtn: "Cancelar",
            confirmTxtBtn: confirmTxtBtn,
            fields: fieldsGuardarResolucion,
        }
        return this.dialogConfig;
    }

    modalFormlyGenericoModelo(title,confirmTxtBtn,fieldsGuardarResolucion, model): MatDialogConfig {
        this.dialogConfig.restoreFocus = false;
        this.dialogConfig.autoFocus = false;
        this.dialogConfig.width = '900px';
        this.dialogConfig.disableClose = true;
        this.dialogConfig.data = {
            title: title,
            subtitle: "",
         //   cancelTxtBtn: "Cancelar",
            confirmTxtBtn: confirmTxtBtn,
            fields: fieldsGuardarResolucion,
            model: model
        }
        return this.dialogConfig;
    }

    guardarReimpresion(title,confirmTxtBtn,fieldsGuardarResolucion, model): MatDialogConfig {
        this.dialogConfig.restoreFocus = false;
        this.dialogConfig.autoFocus = false;
        this.dialogConfig.width = '678px';
        this.dialogConfig.disableClose = true;
        this.dialogConfig.data = {
            title:title,
            subtitle: "",
         //   cancelTxtBtn: "Cancelar",
            confirmTxtBtn: confirmTxtBtn,
            fields: fieldsGuardarResolucion,
            model: model
        }
        
        return this.dialogConfig;
    }

    guardarNoAprobarMA(): MatDialogConfig {
        this.dialogConfig.restoreFocus = false;
        this.dialogConfig.autoFocus = false;
        this.dialogConfig.width = '678px';
        this.dialogConfig.disableClose = true;
        this.dialogConfig.data = {
            title: "Mezcla no aprobada",
            subtitle: "",
         //   cancelTxtBtn: "Cancelar",
            confirmTxtBtn: "Aceptar",
            fields: this.fieldsNoAprobacionMA,
        }
        return this.dialogConfig;
    }

    

    noAprobarRecepcionUM(folio): MatDialogConfig {
        this.dialogConfig.restoreFocus = false;
        this.dialogConfig.autoFocus = false;
        this.dialogConfig.width = '750px';
        this.dialogConfig.disableClose = true;
        this.dialogConfig.data = {
            title: "Rechazo por unidad médica",
           customTitle: "Folio de la mezcla: ",
            subtitle: "Esta acción no se puede deshacer",
            folio:folio,
            atribuible:false,
         //   cancelTxtBtn: "Cancelar",
            confirmTxtBtn: "Rechazar mezcla",
            fields: this.fieldsRechazoRecepcionUM,
        }
        return this.dialogConfig;
    }

    imprimirEtiquetaAntCito(folio): MatDialogConfig {
        this.dialogConfig.restoreFocus = false;
        this.dialogConfig.autoFocus = false;
        this.dialogConfig.width = '850px';
      
        this.dialogConfig.panelClass="my-dialog";
        this.dialogConfig.disableClose = true;
     
        this.dialogConfig.data = {
            title: "Recomendaciones de mezcla",
          // customTitle: "Folio de la mezcla: ",
            customFooter:'AntCito',
            subtitle: " ¿Deseas imprimir la mezcla con folio "+folio+"?",
            folio:folio,
            //atribuible:false,
         //   cancelTxtBtn: "Cancelar",
            confirmTxtBtn: "Imprimir",
            fields: this.fieldsImprimirEtiquetaAntCito,
        }
        return this.dialogConfig;
    }
    imprimirEtiquetaNTP(folio): MatDialogConfig {
        this.dialogConfig.restoreFocus = false;
        this.dialogConfig.autoFocus = false;
        this.dialogConfig.width = '850px';
      
        this.dialogConfig.panelClass="my-dialog";
        this.dialogConfig.disableClose = true;
     
        this.dialogConfig.data = {
            title: "Recomendaciones de mezcla",
          // customTitle: "Folio de la mezcla: ",
            customFooter:'NTP',
            subtitle: " ¿Deseas imprimir la mezcla con folio "+folio+"?",
            folio:folio,
            //atribuible:false,
         //   cancelTxtBtn: "Cancelar",
            confirmTxtBtn: "Imprimir",
            fields: this.fieldsImprimirEtiquetaNTP,
        }
        return this.dialogConfig;
    }

}