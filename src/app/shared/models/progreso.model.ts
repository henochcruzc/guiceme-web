import { Estatus } from "./estatus.model";
import { Prescripcion } from "./prescripciom.model";

export class Progreso{
    estatus: Estatus;
  fechaHora: string;
  nombre: string;
  perfil: string;
  validPrescrip:Prescripcion;
}