import { Header } from "./header.model";
import { MezclaEsteril } from "./mezcla.model";
import { Paginador } from "./paginador.model";
import { Progreso } from "./progreso.model";
import { SignosVitalesPermitidos } from "./signos-vitales.model";

export class MezclaEsterilRequest extends Paginador{
content: MezclaEsteril[];

}


export class DetalleAplicacionMezcla {
    header: any;
    registro: any;
    parametros: SignosVitalesPermitidos;
    idClaveAlta: number;
    idPersona: number;
    }

