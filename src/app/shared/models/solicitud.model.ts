export class solicitud{
    unidadMedicaRequest?:UnidadMedicaRequest;
    pacienteRequest?:PacienteRequest;
    hospitalizacionRequest?:HospitalizacionRequest;
    tapNutriRequest?:TapNutriRequest;
    tapAntibioticoRequest?:TapAntibioticoRequest;
    cveUsuario?:number;
}
  
 export class UnidadMedicaRequest{
            idUnidadMedicaPrescribe?:number;
            idUnidadMedicaAdministra?:number;
            idCentralMezclaElabora?:number;
            idServicioEspecialidad?: number;
        }
  export class PacienteRequest{
            idPaciente?:number;
            nomNombre?:string;
            nomPaterno?:string;
            nomMaterno?:string;
            refPeso?:string;
            refTalla?:string;
            refSuperfCorporal?:string;
            fecNacimiento?:string;
            refCurp?:string;
            refNss?:string;
            idDiagnosticoCie?:number;
        }


   export class HospitalizacionRequest{
            idEspecialidad?:number;
            refNoCama?:number;
            refPiso?:number;
            idTipoMezclaEsteril?:number;
            fecAdmonMezclaEsteril?:string;
    
        }
   export class TapNutriRequest{
    lstNutriParenteralRequest: Array<LstNutriParenteralRequest> = [];
    fechaHoraAdmin?:string;
    tiempoAdministracion?:string;
    }
    export  class LstNutriParenteralRequest
    {
        idMedicamento?:number;
        cveMedicamento?:string;
        numDosisMedicamento?:number;
        idDiluyente?:number;
        numDiluyente?:number;
        refOsmolaridad?:string;
        numKilocalorias?:number;
        refNitrogeno?:string;

    }
    export class TapAntibioticoRequest{
        
        lstAntibioticoRequest: Array<LstAntibioticoRequest> = [];
        fechaHoraAdmin?:string;
        tiempoAdministracion?:string;
        idViaAdministracion ?:string;
    }

export class LstAntibioticoRequest{
    idMedicamento?:number;
   numDosisMedicamento?:number;  
}
    
      


