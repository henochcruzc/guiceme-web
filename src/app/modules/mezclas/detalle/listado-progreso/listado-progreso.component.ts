import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { GeneralComponent } from 'src/app/modules/general/general.component';
import { EstatusMezcla } from 'src/app/shared/general.enum';
import { Progreso } from 'src/app/shared/models/progreso.model';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-listado-progreso',
  templateUrl: './listado-progreso.component.html',
  styleUrls: ['./listado-progreso.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,

  ],
})
export class ListadoProgresoComponent extends GeneralComponent {
  @Input() paramsData: any;
  progreso: Progreso[];
  miProgreso=[];
  ngOnInit() {
    this.progreso = this.paramsData;
 //  this.fillProgreso();
//   this.progreso = this.miProgreso;
    //console.log("ListadoProgresoComponent: titulo", this.paramsData);

  }

  findClass(tipo) { //col estatus

    switch (tipo) {
      case EstatusMezcla.SOLICITADA: //Solicitada
        return 'green';
        break;
      case EstatusMezcla.CANCELADA://No aprobada
        return 'red';
        break;
      case EstatusMezcla.RATIFICADA://Aprobada
        return 'blue';
        break;
      case EstatusMezcla.APROBADA://Disponible
        return 'green';
        break;
        case EstatusMezcla.APROBADA_MESA_ATENCION://Disponible
        return 'green';
        break;
      case EstatusMezcla.NO_APROBADA://Aplicada
        return 'orange';
        break;
      case EstatusMezcla.EN_PREPARACION://No aplicada
        return 'blue';
        break;
      case EstatusMezcla.PREPARADA:
        return 'green';
        break;
      case EstatusMezcla.NO_APROBADA_MESA_ATENCION://cancelada
        return 'orange';
        break;
      case EstatusMezcla.DISPONIBLE://cancelada
        return 'blue';
        break;
      case EstatusMezcla.EN_RUTA://cancelada
        return 'blue';
        break;
      case EstatusMezcla.RECHAZADA_UNIDAD_MEDICA://cancelada
        return 'orange';
        break;
      case EstatusMezcla.RECIBIDA_UNIDAD_MEDICA://cancelada
        return 'blue';
        break;
      case EstatusMezcla.NO_APLICADA://cancelada
        return 'orange';
        break;
      case EstatusMezcla.APLICADA:
        return 'green';
        break;
        case EstatusMezcla.NO_APROBADA_CANCELADA_SISTEMA:
          return 'red';
          break;
          case EstatusMezcla.SUSPENDER:
            return 'orange';
            break;
      default:
        break;
    }


    return '';
  }



  findClassSeguimiento(tipo, columna) {



    if (columna == 1 && tipo == EstatusMezcla.SOLICITADA) { // solicitada
      return 'green'
    }
    if (columna == 1 && tipo == EstatusMezcla.CANCELADA) { // cancelada
      return 'red'
    }

    if (columna == 1 && tipo == EstatusMezcla.NO_APROBADA_CANCELADA_SISTEMA) { // cancelada
      return 'red'
    }

    if (columna == 1 && tipo == EstatusMezcla.SUSPENDER) { // cancelada
      return 'orange'
    }


    //MA estatus final
    if (columna == 1 && tipo == EstatusMezcla.RATIFICADA) {
      return 'blue'
    }

    if (columna == 1 && tipo == EstatusMezcla.APROBADA) {
      return 'green'
    }
    if (columna == 1 && tipo == EstatusMezcla.APROBADA_MESA_ATENCION) {
      return 'green'
    }
    if (columna == 1 && tipo == EstatusMezcla.NO_APROBADA) {
      return 'orange'
    }

 

    //EP

    if (columna == 1 && tipo == EstatusMezcla.EN_PREPARACION) {
      return 'blue'
    }

    if (columna == 1 && tipo == EstatusMezcla.PREPARADA) {
      return 'green'
    }


    //MD

    if (columna == 1 && tipo == EstatusMezcla.NO_APROBADA_MESA_ATENCION) {
      return 'orange'
    }


    if (columna == 1 && tipo == EstatusMezcla.DISPONIBLE) {
      return 'blue'
    }

    if (columna == 1 && tipo == EstatusMezcla.EN_RUTA) {
      return 'blue'
    }


    //RU

    if (columna == 1 && tipo == EstatusMezcla.RECHAZADA_UNIDAD_MEDICA) {
      return 'orange'
    }


    if (columna == 1 && tipo == EstatusMezcla.RECIBIDA_UNIDAD_MEDICA) {
      return 'blue'
    }



    //MAP

    if (columna == 1 && tipo == EstatusMezcla.APLICADA) {
      return 'green'
    }


    if (columna == 1 && tipo == EstatusMezcla.NO_APLICADA) {
      return 'orange'
    }

    //estatus sin borde puntos
    //MA
    if ((columna == 1 || columna == 2) && (tipo == EstatusMezcla.RATIFICADA)) {
      return 'blue no-border'
    }//ok

    if ((columna == 1 || columna == 2) && (tipo == EstatusMezcla.APROBADA || tipo == EstatusMezcla.NO_APROBADA)) {
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

    if ((columna == 1 || columna == 2 || columna == 3) && (tipo == EstatusMezcla.NO_APROBADA_MESA_ATENCION)) {
      return 'green no-border'
    }//ok

    if ((columna == 1 || columna == 2 || columna == 3) && (tipo == EstatusMezcla.DISPONIBLE || tipo == EstatusMezcla.EN_RUTA)) {
      return 'blue no-border'
    }//ok

    if ((columna == 1 || columna == 2 || columna == 3 || columna == 4)
      && (tipo == EstatusMezcla.RECHAZADA_UNIDAD_MEDICA || tipo == EstatusMezcla.RECIBIDA_UNIDAD_MEDICA)) {
      return 'blue no-border'
    }//ok

    if ((columna == 1 || columna == 2 || columna == 3 || columna == 4 || columna == 5)
      && (tipo == EstatusMezcla.NO_APLICADA || tipo == EstatusMezcla.APLICADA)) {
      return 'green no-border'
    }//ok


    return 'gray';



  }

  fillProgreso() {
    this.miProgreso = [
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
          "id": 2,
          "descripcion": "No aprobada"
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
          "id": 4,
          "descripcion": "En preparación"
        }
      },
      {
        "nombre": "MANUEL EDUARDO DE GUGLIELMO DE GUGLIELMO",
        "fechaHora": "13/03/2024 01:27",
        "perfil": "Médico",
        "estatus": {
          "id": 5,
          "descripcion": "Preparada"
        }
      },
      {
        "nombre": "MANUEL EDUARDO DE GUGLIELMO DE GUGLIELMO",
        "fechaHora": "13/03/2024 01:27",
        "perfil": "Médico",
        "estatus": {
          "id": 6,
          "descripcion": "No aprobada MA"
        }
      },
      {
        "nombre": "MANUEL EDUARDO DE GUGLIELMO DE GUGLIELMO",
        "fechaHora": "13/03/2024 01:27",
        "perfil": "Médico",
        "estatus": {
          "id": 7,
          "descripcion": "Disponible"
        }
      },
      {
        "nombre": "MANUEL EDUARDO DE GUGLIELMO DE GUGLIELMO",
        "fechaHora": "13/03/2024 01:27",
        "perfil": "Médico",
        "estatus": {
          "id": 8,
          "descripcion": "En ruta"
        }
      },
      {
        "nombre": "MANUEL EDUARDO DE GUGLIELMO DE GUGLIELMO",
        "fechaHora": "13/03/2024 01:27",
        "perfil": "Médico",
        "estatus": {
          "id": 9,
          "descripcion": "Recibida por UM"
        }
      },
      {
        "nombre": "MANUEL EDUARDO DE GUGLIELMO DE GUGLIELMO",
        "fechaHora": "13/03/2024 01:27",
        "perfil": "Médico",
        "estatus": {
          "id": 10,
          "descripcion": "Rechazada por UM"
        }
      },
      {
        "nombre": "MANUEL EDUARDO DE GUGLIELMO DE GUGLIELMO",
        "fechaHora": "13/03/2024 01:27",
        "perfil": "Médico",
        "estatus": {
          "id": 11,
          "descripcion": "Aplicada"
        }
      },
      {
        "nombre": "MANUEL EDUARDO DE GUGLIELMO DE GUGLIELMO",
        "fechaHora": "13/03/2024 01:27",
        "perfil": "Médico",
        "estatus": {
          "id": 12,
          "descripcion": "No aplicada"
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
          "id": 14,
          "descripcion": "No Aprobada (Cancelada por sistema)"
        }
      },
      {
        "nombre": "MANUEL EDUARDO DE GUGLIELMO DE GUGLIELMO",
        "fechaHora": "13/03/2024 01:27",
        "perfil": "Médico",
        "estatus": {
          "id": 15,
          "descripcion": "Suspender"
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
          "id": 17,
          "descripcion": "Aprobada MA"
        }
      }
   
    ];

   
  }
  
}
