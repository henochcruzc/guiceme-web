import { Injectable } from "@angular/core";
import { EstatusMezcla } from "./general.enum";

@Injectable({ providedIn: 'root' })
export class ColoresEstatus {


    findClassColorClock(tipo) {
        switch (tipo) {

            case EstatusMezcla.NO_APROBADA:
                return 'orange';
            case EstatusMezcla.NO_APROBADA_CANCELADA_SISTEMA:
                return 'red';

            default:
                break;
        }


        return '';
    }

    findClassColorEstatus(tipo) {

        switch (tipo) {
            case EstatusMezcla.SOLICITADA:
                return 'green';
                break;
            case EstatusMezcla.NO_APROBADA:
                return 'orange';
                break;
            case EstatusMezcla.APROBADA:
                return 'green';
                break;
            case EstatusMezcla.EN_PREPARACION:
                return 'blue';
                break;
            case EstatusMezcla.PREPARADA:
                return 'green';
                break;
            case EstatusMezcla.NO_APROBADA_MESA_ATENCION:
                return 'orange';
                break;
            case EstatusMezcla.DISPONIBLE:
                return 'green';
                break;
            case EstatusMezcla.EN_RUTA:
                return 'blue';
                break;
            case EstatusMezcla.RECIBIDA_UNIDAD_MEDICA:
                return 'green';
                break;
            case EstatusMezcla.RECHAZADA_UNIDAD_MEDICA:
                return 'orange';
                break;
            case EstatusMezcla.APLICADA:
                return 'green';
                break;
            case EstatusMezcla.NO_APLICADA:
                return 'orange';
                break;
            case EstatusMezcla.RATIFICADA:
                return 'blue';
                break;
            case EstatusMezcla.NO_APROBADA_CANCELADA_SISTEMA:
                return 'red';
                break;
            case EstatusMezcla.SUSPENDER:
                return 'orange';
                break;
            case EstatusMezcla.CANCELADA:
                return 'red';
                break;
            case EstatusMezcla.APROBADA_MESA_ATENCION:
                return 'green';
                break;
            case EstatusMezcla.RESOLUCION_INVESTIGACION:
                return 'blue';
                break;
            case EstatusMezcla.EN_PROCESO:
                return 'blue';
                break;
            case EstatusMezcla.POR_APLICAR:
                return 'blue';
                break;

            default:
                break;
        }


        return '';
    }

    //cu12
    findClassColorCu12Seguimiento(tipo, columna) {

        //S

        if (columna == 1 && tipo == EstatusMezcla.SOLICITADA) { // solicitada
            return 'green'
        }
        if (columna == 1 && tipo == EstatusMezcla.CANCELADA) { // cancelada
            return 'red'
        }

        if ((columna == 2 || columna == 3 || columna == 4 || columna == 5 || columna == 6 || columna == 7) && (tipo == EstatusMezcla.SOLICITADA || tipo == EstatusMezcla.CANCELADA)) {
            return 'gray'
        }


        //MA 

        if (columna == 2 && tipo == EstatusMezcla.APROBADA) {
            return 'green'
        }
        if (columna == 2 && tipo == EstatusMezcla.NO_APROBADA) {
            return 'orange'
        }
        if (columna == 2 && tipo == EstatusMezcla.NO_APROBADA_CANCELADA_SISTEMA) {
            return 'red'
        }
        if (columna == 2 && tipo == EstatusMezcla.RATIFICADA) {
            return 'blue'
        }



        //RMA

        if ((columna == 3 || columna == 4 || columna == 5 || columna == 6 || columna == 7) && (tipo == EstatusMezcla.NO_APROBADA || tipo == EstatusMezcla.APROBADA || tipo == EstatusMezcla.RATIFICADA)) {
            return 'gray'
        }


        if (columna == 3 && tipo == EstatusMezcla.EN_PREPARACION) {
            return 'blue'
        }

        if (columna == 3 && tipo == EstatusMezcla.PREPARADA) {
            return 'green'
        }


        //MAP

        if ((columna == 4 || columna == 5 || columna == 6 || columna == 7) && (tipo == EstatusMezcla.EN_PREPARACION || tipo == EstatusMezcla.PREPARADA)) {
            return 'gray'
        }

        if (columna == 4 && tipo == EstatusMezcla.NO_APROBADA_MESA_ATENCION) {
            return 'orange'
        }

        if (columna == 4 && tipo == EstatusMezcla.DISPONIBLE) {
            return 'green'
        }

        if (columna == 4 && tipo == EstatusMezcla.APROBADA_MESA_ATENCION) {
            return 'green'
        }

        if ((columna == 5 || columna == 6 || columna == 7) && (tipo == EstatusMezcla.NO_APROBADA_MESA_ATENCION || tipo == EstatusMezcla.DISPONIBLE)) {
            return 'gray'
        }

        //RU

        if (columna == 5 && tipo == EstatusMezcla.EN_RUTA) {
            return 'blue'
        }
        if (columna == 6 && tipo == EstatusMezcla.RECHAZADA_UNIDAD_MEDICA) {
            return 'orange'
        }


        if (columna == 6 && tipo == EstatusMezcla.RECIBIDA_UNIDAD_MEDICA) {
            return 'green'
        }

        if (columna == 6 && (tipo == EstatusMezcla.RECHAZADA_UNIDAD_MEDICA || tipo == EstatusMezcla.RECIBIDA_UNIDAD_MEDICA)) {
            return 'gray'
        }

        //MAP

        if (columna == 7 && tipo == EstatusMezcla.APLICADA) {
            return 'green'
        }


        if (columna == 7 && tipo == EstatusMezcla.NO_APLICADA) {
            return 'orange'
        }

        //estatus sin borde puntos
        //MA
        if ((columna == 1 || columna == 2) && (tipo == EstatusMezcla.RATIFICADA)) {
            return 'blue no-border'
        }//ok

        if ((columna == 1 || columna == 2) && (tipo == EstatusMezcla.APROBADA || tipo == EstatusMezcla.NO_APROBADA || tipo == EstatusMezcla.NO_APROBADA_CANCELADA_SISTEMA)) {
            return 'green no-border'
        }//ok

        //EP
        if ((columna == 1 || columna == 2) && (tipo == EstatusMezcla.EN_PREPARACION)) {
            return 'blue no-border'
        }//ok

        if ((columna == 1 || columna == 2) && (tipo == EstatusMezcla.PREPARADA)) {
            return 'green no-border'
        }//ok

        //MD

        if ((columna == 1 || columna == 2 || columna == 3) && (tipo == EstatusMezcla.NO_APROBADA_MESA_ATENCION || tipo == EstatusMezcla.APROBADA_MESA_ATENCION)) {
            return 'green no-border'
        }//ok

        if ((columna == 1 || columna == 2 || columna == 3) && (tipo == EstatusMezcla.EN_RUTA)) {
            return 'blue no-border'
        }//ok

        if ((columna == 1 || columna == 2 || columna == 3) && (tipo == EstatusMezcla.DISPONIBLE)) {
            return 'green no-border'
        }//ok

        if ((columna == 1 || columna == 2 || columna == 3 || columna == 4) && (tipo == EstatusMezcla.EN_RUTA)) {
            return 'blue no-border'
        }//ok

        if ((columna == 1 || columna == 2 || columna == 3 || columna == 4 || columna == 5)
            && ( tipo == EstatusMezcla.RECIBIDA_UNIDAD_MEDICA)) {
            return 'green no-border'
        }//ok

        
        if ((columna == 1 || columna == 2 || columna == 3 || columna == 4 || columna == 5)
            && (tipo == EstatusMezcla.RECHAZADA_UNIDAD_MEDICA )) {
            return 'blue no-border'
        }//ok

        if ((columna == 1 || columna == 2 || columna == 3 || columna == 4 || columna == 5 || columna == 6)
            && (tipo == EstatusMezcla.NO_APLICADA || tipo == EstatusMezcla.APLICADA)) {
            return 'green no-border'
        }//ok


        return 'gray';



    }

    findClassColorCu12HrR(tipo, columna) {
        //MA
        if ((columna == 1) && (tipo == EstatusMezcla.APROBADA || tipo == EstatusMezcla.NO_APROBADA || tipo == EstatusMezcla.NO_APROBADA_CANCELADA_SISTEMA)) {
            return 'green'
        }//ok

        if ((columna == 1) && (tipo == EstatusMezcla.RATIFICADA)) {
            return 'blue'
        }//ok


        //PM

        if ((columna == 1 || columna == 2) && (tipo == EstatusMezcla.EN_PREPARACION)) {
            return 'blue'
        }//ok
        if ((columna == 1 || columna == 2) && (tipo == EstatusMezcla.PREPARADA)) {
            return 'green'
        }//ok

        //MD
        if ((columna == 1 || columna == 2 || columna == 3) && (tipo == EstatusMezcla.NO_APROBADA_MESA_ATENCION || tipo == EstatusMezcla.APROBADA_MESA_ATENCION)) {
            return 'green'
        }//ok

        if ((columna == 1 || columna == 2 || columna == 3) && (tipo == EstatusMezcla.DISPONIBLE )) {
            return 'green'
        }//ok

        if ((columna == 1 || columna == 2 || columna == 3) && (tipo == EstatusMezcla.EN_RUTA)) {
            return 'blue'
        }//ok

        //RU
        if ((columna == 1 || columna == 2 || columna == 3 || columna == 4) && (tipo == EstatusMezcla.EN_RUTA)) {
            return 'blue'
        }

        if ((columna == 1 || columna == 2 || columna == 3 || columna == 4 || columna == 5) && (tipo == EstatusMezcla.RECIBIDA_UNIDAD_MEDICA)) {
            return 'green'
        }

        if ((columna == 1 || columna == 2 || columna == 3 || columna == 4 || columna == 5) && (tipo == EstatusMezcla.RECHAZADA_UNIDAD_MEDICA )) {
            return 'blue'
        }

        //MAP
        if ((columna == 1 || columna == 2 || columna == 3 || columna == 4 || columna == 5 || columna == 6) && (tipo == EstatusMezcla.APLICADA || tipo == EstatusMezcla.NO_APLICADA)) {
            return 'green'
        }
        return 'gray';


    }

    findClassColorCu12HrL(tipo, columna) {
        //MA
        if ((columna == 1 || columna == 2) && (tipo == EstatusMezcla.RATIFICADA)) {
            return 'blue'
        }//ok

        if ((columna == 1 || columna == 2) && (tipo == EstatusMezcla.APROBADA || tipo == EstatusMezcla.NO_APROBADA || tipo == EstatusMezcla.NO_APROBADA_CANCELADA_SISTEMA)) {
            return 'green'
        }//ok


        //EP
        if ((columna == 1 || columna == 2 || columna == 3) && (tipo == EstatusMezcla.EN_PREPARACION)) {
            return 'blue'
        }//ok

        if ((columna == 1 || columna == 2 || columna == 3) && (tipo == EstatusMezcla.PREPARADA)) {
            return 'green'
        }//ok

        //MD
        if ((columna == 1 || columna == 2 || columna == 3 || columna == 4) && (tipo == EstatusMezcla.NO_APROBADA_MESA_ATENCION || tipo == EstatusMezcla.APROBADA_MESA_ATENCION)) {
            return 'green'
        }//ok

        if ((columna == 1 || columna == 2 || columna == 3 || columna == 4) && (tipo == EstatusMezcla.DISPONIBLE )) {
            return 'green'
        }//ok

        if ((columna == 1 || columna == 2 || columna == 3 || columna == 4) && ( tipo == EstatusMezcla.EN_RUTA)) {
            return 'blue'
        }//ok

        //RU
        if ((columna == 1 || columna == 2 || columna == 3 || columna == 4 || columna == 5) && (tipo == EstatusMezcla.EN_RUTA)) {
            return 'blue'
        }//ok

        if ((columna == 1 || columna == 2 || columna == 3 || columna == 4 || columna == 5 || columna == 6) && ( tipo == EstatusMezcla.RECIBIDA_UNIDAD_MEDICA)) {
            return 'green'
        }//ok

        if ((columna == 1 || columna == 2 || columna == 3 || columna == 4 || columna == 5 || columna == 6) && (tipo == EstatusMezcla.RECHAZADA_UNIDAD_MEDICA )) {
            return 'blue'
        }//ok

        //MAP
        if ((columna == 1 || columna == 2 || columna == 3 || columna == 4 || columna == 5 || columna == 6 || columna == 7) && (tipo == EstatusMezcla.NO_APLICADA || tipo == EstatusMezcla.APLICADA)) {
            return 'green'
        }//ok

        return 'gray';

    }


    //cu4
    findClassColorCu4Seguimiento(tipo, columna) {

        //S

        if (columna == 1 && tipo == EstatusMezcla.SOLICITADA) { // solicitada
            return 'green'
        }
        if (columna == 1 && tipo == EstatusMezcla.CANCELADA) { // cancelada
            return 'red'
        }

        //MA

        if ((columna == 2 || columna == 3 || columna == 4) && (tipo == EstatusMezcla.SOLICITADA || tipo == EstatusMezcla.CANCELADA)) {
            return 'gray'
        }

        if (columna == 2 && tipo == EstatusMezcla.APROBADA) {
            return 'green'
        }

        if (columna == 2 && tipo == EstatusMezcla.NO_APROBADA) {
            return 'orange'
        }
        if (columna == 2 && tipo == EstatusMezcla.NO_APROBADA_CANCELADA_SISTEMA) {
            return 'red'
        }
        if (columna == 2 && tipo == EstatusMezcla.RATIFICADA) {
            return 'blue'
        }
        if (columna == 2 && tipo == EstatusMezcla.CANCELADA) {
            return 'red'
        }

    
        //RMA

        if (columna == 3 && tipo == EstatusMezcla.NO_APROBADA_MESA_ATENCION) {
            return 'orange'
        }

        if (columna == 3 && tipo == EstatusMezcla.DISPONIBLE) {
            return 'green'
        }

        if (columna == 3 && tipo == EstatusMezcla.RECHAZADA_UNIDAD_MEDICA) {
            return 'orange'
        }

        //MAP

        if ((columna == 4) && (tipo == EstatusMezcla.NO_APROBADA_MESA_ATENCION || tipo == EstatusMezcla.DISPONIBLE)) {
            return 'gray'
        }

        if ((columna == 4) && (tipo == EstatusMezcla.APROBADA || tipo == EstatusMezcla.NO_APROBADA || tipo == EstatusMezcla.NO_APROBADA_CANCELADA_SISTEMA || tipo == EstatusMezcla.RATIFICADA || tipo == EstatusMezcla.CANCELADA)) {
            return 'gray'
        }

        //MAP

        if (columna == 4 && tipo == EstatusMezcla.NO_APLICADA) {
            return 'orange'
        }


        if (columna == 4 && tipo == EstatusMezcla.APLICADA) {
            return 'green'
        }





        //estatus sin borde puntos 
        //
        if ((columna == 1 || columna == 2) && (tipo == EstatusMezcla.DISPONIBLE)) {
            return 'green no-border'
        }

        if ((columna == 1 || columna == 2) && (tipo == EstatusMezcla.NO_APROBADA_MESA_ATENCION)) {
            return 'green no-border'
        }


        if ((columna == 1 || columna == 2) && (tipo == EstatusMezcla.APROBADA)) {
            return 'green no-border'
        }

        if ((columna == 1 || columna == 2) && (tipo == EstatusMezcla.NO_APROBADA)) {
            return 'green no-border'
        }

        if ((columna == 1 || columna == 2) && (tipo == EstatusMezcla.NO_APROBADA_CANCELADA_SISTEMA)) {
            return 'green no-border'
        }

        if ((columna == 1 || columna == 2) && (tipo == EstatusMezcla.RATIFICADA)) {
            return 'blue no-border'
        }

        if ((columna == 1 || columna == 2 || columna == 3)
            && (tipo == EstatusMezcla.NO_APLICADA || tipo == EstatusMezcla.APLICADA)) {
            return 'green no-border'
        }

        if ((columna == 1 || columna == 2) && (tipo == EstatusMezcla.RECHAZADA_UNIDAD_MEDICA )) {
            return 'blue no-border'
        }


        return 'gray';



    }

    findClassColorCu4HrR(tipo, columna) {


        if ((columna == 1 || columna == 2) && (tipo == EstatusMezcla.NO_APROBADA_MESA_ATENCION || tipo == EstatusMezcla.DISPONIBLE)) {
            return 'green'
        }

        if ((columna == 1) && (tipo == EstatusMezcla.NO_APROBADA_CANCELADA_SISTEMA || tipo == EstatusMezcla.NO_APROBADA || tipo == EstatusMezcla.APROBADA)) {
            return 'green'
        }

        if ((columna == 1) && (tipo == EstatusMezcla.RATIFICADA)) {
            return 'blue'
        }

        if ((columna == 1 || columna == 2 || columna == 3 || columna == 4) && (tipo == EstatusMezcla.NO_APLICADA || tipo == EstatusMezcla.APLICADA)) {
            return 'green'
        }//ok

        if ((columna == 1 || columna == 2 ) && (tipo == EstatusMezcla.RECHAZADA_UNIDAD_MEDICA)) {
            return 'blue'
        }

        return 'gray';


    }

    findClassColorCu4HrL(tipo, columna) {

        if ((columna == 1 || columna == 2 || columna == 3) && (tipo == EstatusMezcla.NO_APROBADA_MESA_ATENCION || tipo == EstatusMezcla.DISPONIBLE)) {
            return 'green'
        }

        if ((columna == 1 || columna == 2) && (tipo == EstatusMezcla.APROBADA || tipo == EstatusMezcla.NO_APROBADA || tipo == EstatusMezcla.NO_APROBADA_CANCELADA_SISTEMA)) {
            return 'green'
        }

        if ((columna == 1 || columna == 2) && (tipo == EstatusMezcla.RATIFICADA)) {
            return 'blue'
        }

        if ((columna == 1 || columna == 2 || columna == 3 || columna == 4) && (tipo == EstatusMezcla.NO_APLICADA || tipo == EstatusMezcla.APLICADA)) {
            return 'green'
        }

        if ((columna == 1 || columna == 2 || columna == 3) && (tipo == EstatusMezcla.RECHAZADA_UNIDAD_MEDICA)) {
            return 'blue'
        }

        return 'gray';

    }
}
