import { Estatus } from "./estatus.model";

export class DetalleMezcla {
    cveFolioMezclaDosis: string;
    cveFolioSolicitudMezcla: string;
    desServicioEspecialidad: string;

    desTipoMezcla: string;
    idMezcla: number;
    idMezclaAplicDiaDosis: number;

    fechaAplicacion: string;

    idMezclaMedicDiluy: number;
    numTotalDosis: number;

    idSolicitudMezcla: number;
    numKcalNoProteicas: number;

    numKcalTotales: number;
    numNitrogeno: number;
    numOsmolaridad: number;
    numProteinas: number;
    numVolumenTotal: number;
    refCveCama: string;
    refCvePiso: string;
    refUnidadMedicaHosp: string;
    nomMedicoPrescribe: string;
    refMatricula:string;
    refCedulaProfesional:string;
}

export class Mezcla {
    idHistorico: number;
    folioSolicitud: string;
    folioMezcla: string;
    tipoMezcla: string;
    ultimaFecha: string;
    estatus: Estatus;
    idMezcla: number;
    idMezclaAplicDia: number;
    idMezclaAplicDiaDosis: number;
    idTipoMezcla: number;
    fechaAplicaionDia: string;
    refNss: string;


}



export class MezclaEsteril {
    idMezclaAplicDiaDosis: number;
    desTipoMezcla: string;
    fechaAplicacion: string;
    idAplicacionMezcla: number;
    idPaciente: number;
    desEstatusMezcla: string;
    idEstatus: number;
    folioSolicitudMezcla: string;
    aplicacion: string;
     
    folioMezclaDosis: string;
 
    
}

export class MezclaNoAplicadaRequest {
    idAplicacionMezcla: number;
    idMotivoNoAdminMezcla: number;
    refNoAdminObs: string;
    stpAplicacInicio?:String;
    indEnProceso? :number;
    stpAplicacTermino?:string;

    idReaccionAdversa:number;
    idAplicacReaccAdversa?:number;
    refAplicacReaccionObs?:string;
    cveUsuarioAlta?: number;
    idMezclaAplicDiaDosis?:number;
    idPaciente: number;
    idUsuarioResponsable: number;
}



