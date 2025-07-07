import { Injectable } from "@angular/core";
import { MatDialogConfig } from "@angular/material/dialog";

@Injectable({ providedIn: 'root' })
export class GenericDialogService {

    private dialogConfig = new MatDialogConfig();

    guardar(): MatDialogConfig {
        this.dialogConfig.restoreFocus = false;
        this.dialogConfig.autoFocus = false;
        this.dialogConfig.width = '678px';
        this.dialogConfig.data = {

            title: "Guardar",
            subtitle: "ss",
            message : "¿Está seguro de que desea guardar los cambios?",
            cancelTxtBtn: "Cancelar",
            confirmTxtBtn: "Aceptar",
        }
        return this.dialogConfig;
    }

    guardarGenerico(titulo, message): MatDialogConfig {
        this.dialogConfig.restoreFocus = false;
        this.dialogConfig.autoFocus = false;
        this.dialogConfig.width = '678px';
        this.dialogConfig.data = {

            title: titulo,
            subtitle: "ss",
            message : message,
            cancelTxtBtn: "Cancelar",
            confirmTxtBtn: "Aceptar",
        }
        return this.dialogConfig;
    }

    cancelar(): MatDialogConfig {
        this.dialogConfig.restoreFocus = false;
        this.dialogConfig.autoFocus = false;
        this.dialogConfig.width = '678px';
        this.dialogConfig.data = {

            title: "Cancelar",
            subtitle: "ss",
            message : "¿Está seguro de salir?, los datos no se guardaran en el sistema",
            cancelTxtBtn: "Cancelar",
            confirmTxtBtn: "Aceptar",
        }
        return this.dialogConfig;
    }

    eliminar(): MatDialogConfig {
        this.dialogConfig.restoreFocus = false;
        this.dialogConfig.autoFocus = false;
        this.dialogConfig.width = '678px';
        this.dialogConfig.data = {

            title: "Eliminar registro",
            subtitle: "ss",
            message : "¿Está seguro de eliminar el registro?",
            cancelTxtBtn: "Cancelar",
            confirmTxtBtn: "Aceptar",
        }
        return this.dialogConfig;
    }

    limpiarCampos(): MatDialogConfig {
        this.dialogConfig.restoreFocus = false;
        this.dialogConfig.autoFocus = false;
        this.dialogConfig.width = '678px';
        this.dialogConfig.data = {

            title: "Limpiar campos",
            subtitle: "ss",
            message : "¿Está seguro de que desea limpiar los campos?",
            cancelTxtBtn: "Cancelar",
            confirmTxtBtn: "Aceptar",
        }
        return this.dialogConfig;
    }

    cancelarSinMotRechazo(): MatDialogConfig {
        this.dialogConfig.restoreFocus = false;
        this.dialogConfig.autoFocus = false;
        this.dialogConfig.width = '678px';
        this.dialogConfig.data = {

            title: "Regresar sin motivo de rechazo",
            subtitle: "ss",
            message : "¿Está seguro de salir, los datos no se guardarán en sistema?",
            cancelTxtBtn: "Cancelar",
            confirmTxtBtn: "Aceptar",
        }
        return this.dialogConfig;
    }

    regresarSinGuardar(): MatDialogConfig {
        this.dialogConfig.restoreFocus = false;
        this.dialogConfig.autoFocus = false;
        this.dialogConfig.width = '678px';
        this.dialogConfig.data = {

            title: "Regresar sin guardar",
            subtitle: "ss",
            message : "¿Estás seguro de salir?, los datos no se guardarán en sistema.",
            cancelTxtBtn: "Cancelar",
            confirmTxtBtn: "Aceptar",
        }
        return this.dialogConfig;
    }

    elaborarUrgente(): MatDialogConfig {
        this.dialogConfig.restoreFocus = false;
        this.dialogConfig.autoFocus = false;
        this.dialogConfig.width = '678px';
        this.dialogConfig.data = {

            title: "Elaborar urgente",
            subtitle: "ss",
            message : "¿Elaborar urgente?",
            cancelTxtBtn: "Cancelar",
            confirmTxtBtn: "Aceptar",
        }
        return this.dialogConfig;
    }

    ressetPass(): MatDialogConfig {
        this.dialogConfig.restoreFocus = false;
        this.dialogConfig.autoFocus = false;
        this.dialogConfig.width = '678px';
        this.dialogConfig.data = {

            title: "Reestablecer contraseña",
            subtitle: "ss",
            message : "La contraseña se reestablecerá por el número de matrícula del usuario \n¿Está seguro de que desea guardar los cambios?",
            cancelTxtBtn: "Cancelar",
            confirmTxtBtn: "Aceptar",
        }
        return this.dialogConfig;
    }

    nuevaSolicitud(): MatDialogConfig {
        this.dialogConfig.restoreFocus = false;
        this.dialogConfig.autoFocus = false;
        this.dialogConfig.width = '678px';
        this.dialogConfig.data = {

            title: "Nueva solicitud",
            subtitle: "ss",
            message : "¿Nueva solicitud?",
            cancelTxtBtn: "Cancelar",
            confirmTxtBtn: "Aceptar",
        }
        return this.dialogConfig;
    }

    modalGenerico(title, message, txtBtnCancelar, txtBtnAceptar): MatDialogConfig {
        this.dialogConfig.restoreFocus = false;
        this.dialogConfig.autoFocus = false;
        this.dialogConfig.width = '678px';
        this.dialogConfig.data = {

            title: title,
            subtitle: "ss",
            message : message,
            cancelTxtBtn: txtBtnCancelar,
            confirmTxtBtn: txtBtnAceptar,
        }
        return this.dialogConfig;
    }

    finalizarAplicacion(title,message): MatDialogConfig {
        this.dialogConfig.restoreFocus = false;
        this.dialogConfig.autoFocus = false;
        this.dialogConfig.panelClass = 'mypanel-class';
        this.dialogConfig.width = '592px';
        this.dialogConfig.width = '216px';
        this.dialogConfig.data = {

            title: title,
            subtitle: "",
            message : message,
            cancelTxtBtn:null,
            confirmTxtBtn: "Aceptar",
        }
        return this.dialogConfig;
    }

    disposicionFinal(): MatDialogConfig {
        this.dialogConfig.restoreFocus = false;
        this.dialogConfig.autoFocus = false;
        this.dialogConfig.width = '678px';
        this.dialogConfig.data = {

            title: "Disposición final del producto",
            subtitle: "",
            message : "¿Está seguro que desea guardar los cambios?",
            cancelTxtBtn: "Cancelar",
            confirmTxtBtn: "Aceptar",
        }
        return this.dialogConfig;
    }

    redispensar(): MatDialogConfig {
        this.dialogConfig.restoreFocus = false;
        this.dialogConfig.autoFocus = false;
        this.dialogConfig.width = '678px';
        this.dialogConfig.data = {
            title: "Redispensar",
            subtitle: "",
            message : "¿Está seguro que desea guardar los cambios?",
            cancelTxtBtn: "Cancelar",
            confirmTxtBtn: "Aceptar",
        }
        return this.dialogConfig;
    }

    rechazarRedispensacion(): MatDialogConfig {
        this.dialogConfig.restoreFocus = false;
        this.dialogConfig.autoFocus = false;
        this.dialogConfig.width = '678px';
        this.dialogConfig.data = {

            title: "Eliminar",
            subtitle: "",
            message : "¿Está seguro que desea cancelar la redispensación?",
            cancelTxtBtn: "Cancelar",
            confirmTxtBtn: "Aceptar",
        }
        return this.dialogConfig;
    }


    imprimiendo(): MatDialogConfig {
        this.dialogConfig.restoreFocus = false;
        this.dialogConfig.autoFocus = false;
        this.dialogConfig.width = '678px';
        this.dialogConfig.data = {
            title: "Imprimiendo",
            subtitle: "",
            message : "Imprimiendo....",
            hideBtns: true,
        }
        return this.dialogConfig;
    }

    reImpresion(): MatDialogConfig {
        this.dialogConfig.restoreFocus = false;
        this.dialogConfig.autoFocus = false;
        this.dialogConfig.width = '678px';
        this.dialogConfig.data = {
            title: "Reimpresión de etiqueta",
            subtitle: "",
            message : "¿Está seguro de que desea reimprimir la etiqueta?",
            cancelTxtBtn: "Cancelar",
            confirmTxtBtn: "Aceptar",
        }
        return this.dialogConfig;
    }

    envioExcitosoSolicitud(titulo,message,btnDisable): MatDialogConfig {
        this.dialogConfig.restoreFocus = false;
        this.dialogConfig.autoFocus = false;
        this.dialogConfig.width = '678px';
        this.dialogConfig.data = {
            title: titulo,
            subtitle: "",
            message : message,
        }
        return this.dialogConfig;
    }
    estasSeguroDeseasAprobarMezcla(): MatDialogConfig {
        this.dialogConfig.restoreFocus = false;
        this.dialogConfig.autoFocus = false;
        this.dialogConfig.width = '678px';
        this.dialogConfig.data = {

            title: "Aprobar mezcla",
           // subtitle: "ss",
            message : "¿Estás seguro de que deseas aprobar la mezcla?",
           // cancelTxtBtn: "Cancelar",
            confirmTxtBtn: "Aceptar",
        }
        return this.dialogConfig;
    }
    estasSeguroDeseasNoAprobarMezcla(): MatDialogConfig {
        this.dialogConfig.restoreFocus = false;
        this.dialogConfig.autoFocus = false;
        this.dialogConfig.width = '678px';
        this.dialogConfig.data = {

            title: "Aprobar mezcla",
             subtitle: "Esta acción no se podrá deshacer",
            message : "¿Estás seguro de no aprobar la mezcla?",
           // cancelTxtBtn: "Cancelar",
            confirmTxtBtn: "Aceptar",
        }
        return this.dialogConfig;
    }
    estasSeguroDeseasRegistrarRecetaColectiva(): MatDialogConfig {
        this.dialogConfig.restoreFocus = false;
        this.dialogConfig.autoFocus = false;
        this.dialogConfig.width = '678px';
        this.dialogConfig.data = {

            title: "Registrar Receta Colectiva",
           // subtitle: "ss",
            message : "¿Está seguro de querer registrar la receta colectiva?",
           // cancelTxtBtn: "Cancelar",
            confirmTxtBtn: "Aceptar",
        }
        return this.dialogConfig;
    }
    deseasConsultarOtraRecetaColectiva(): MatDialogConfig {
        this.dialogConfig.restoreFocus = false;
        this.dialogConfig.autoFocus = false;
        this.dialogConfig.width = '678px';
        this.dialogConfig.data = {

            title: "Nueva Consulta",
           subtitle: "",
            message : "¿Deseas consultar otro número de receta? <br> <strong> La información previamente ingresada se perderá.</strong>",
           // cancelTxtBtn: "Cancelar",
            confirmTxtBtn: "Aceptar",
        }
        return this.dialogConfig;
    }

    deseasConsultarFT(): MatDialogConfig {
        this.dialogConfig.restoreFocus = false;
        this.dialogConfig.autoFocus = false;
        this.dialogConfig.width = '678px';
        this.dialogConfig.data = {

            title: "Aviso",
           subtitle: "",
            message : "¿Desea consultar otro medicamento? <br> <strong> La información previamente ingresada se perderá.</strong>",
           // cancelTxtBtn: "Cancelar",
            confirmTxtBtn: "Aceptar",
        }
        return this.dialogConfig;
    }

    deseasModificarRecetaColectiva(): MatDialogConfig {
        this.dialogConfig.restoreFocus = false;
        this.dialogConfig.autoFocus = false;
        this.dialogConfig.width = '678px';
        this.dialogConfig.data = {

            title: "Receta colectiva",
          
            message : "¿Deseas modificar la receta colectiva?",
           // cancelTxtBtn: "Cancelar",
            confirmTxtBtn: "Modificar receta",
        }
        return this.dialogConfig;
    }

    deseasCambiarMedicamentoRecetaColectiva(): MatDialogConfig {
        this.dialogConfig.restoreFocus = false;
        this.dialogConfig.autoFocus = false;
        this.dialogConfig.width = '678px';
        this.dialogConfig.data = {

            title: "Receta colectiva",
          
            message : "¿Está seguro de querer cambiar de medicamento?",
           // cancelTxtBtn: "Cancelar",
            confirmTxtBtn: "Modificar medicamento",
        }
        return this.dialogConfig;
    }

    guardarEdicionMezcla(folioMezcla): MatDialogConfig {
        this.dialogConfig.restoreFocus = false;
        this.dialogConfig.autoFocus = false;
        this.dialogConfig.width = '678px';
        this.dialogConfig.data = {

            title: "Guardar cambios",
          
            message : "¿Deseas guardar los cambios realizados en la mezcla <strong>" + folioMezcla + "</strong> ?",
           // cancelTxtBtn: "Cancelar",
            confirmTxtBtn: "Guardar edición",
        }
        return this.dialogConfig;
    }

    imprimirPreparacion(folioMezcla, codigoBarras):MatDialogConfig{
        this.dialogConfig.restoreFocus = false;
        this.dialogConfig.autoFocus = false;
        this.dialogConfig.disableClose = true;
        this.dialogConfig.width = '384px';
        this.dialogConfig.height = '236px';
        this.dialogConfig.data = {
            title: "Folio de mezcla",          
            message :  folioMezcla ,
            codigo : codigoBarras, 
            hideBtns: true,            
        }
        return this.dialogConfig;
    }

    finalizarPreparacion():MatDialogConfig{
        this.dialogConfig.restoreFocus = false;
        this.dialogConfig.autoFocus = false;
        this.dialogConfig.disableClose = true;
        this.dialogConfig.width = '592px';
        this.dialogConfig.height = 'auto';
        this.dialogConfig.data = {
            title: "Finalizar preparación",          
            message : "¿Deseas finalizar la preparación?",
            confirmTxtBtn: "Finalizar",
        }
        return this.dialogConfig;
    }

    regresarPreparacionAdmin(): MatDialogConfig {
        this.dialogConfig.restoreFocus = false;
        this.dialogConfig.autoFocus = false;
        this.dialogConfig.width = '678px';
        this.dialogConfig.data = {
            title: "Nueva consulta",          
            message : "¿Deseas regresar a la pantalla anterior? <br> <strong>La información previamente ingresada se perderá.</strong>",
            confirmTxtBtn: "Aceptar",
        }
        return this.dialogConfig;
    }

}