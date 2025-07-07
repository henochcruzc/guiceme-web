
import { Injectable } from '@angular/core';
import { GrupoEdad } from './general.enum';
import { SignosVitales, SignosVitalesPermitidos } from './models/signos-vitales.model';



@Injectable({
  providedIn: 'root'
})
export class SignosVitalesHelper {



  private signosVitales: Array<SignosVitalesPermitidos> = [
    {
      grupoEdad: GrupoEdad.RECIEN_NACIDO,
      numPacTenArtSistolicaMin: 70,
      numPacTenArtSistolicaMax: 100,
      numPacTenArtDiastolicaMax: 70,
      numPacTenArtDiastolicaMin: 50,
      numPacFrecCardiacaMax: 160,
      numPacFrecCardiacaMin: 120,
      numPacFrecRespiratoriaMax: 45,
      numPacFrecRespiratoriaMin: 40,
      numPacTemperaturaMax: 38,
      numPacTemperaturaMin: 37.5,

      numPacTenArtSistolicaMinLong: 2,
      numPacTenArtSistolicaMaxLong: 3,
      numPacTenArtDiastolicaMaxLong: 2,
      numPacTenArtDiastolicaMinLong: 2,
      numPacFrecCardiacaMaxLong: 3,
      numPacFrecCardiacaMinLong: 3,
      numPacFrecRespiratoriaMaxLong: 2,
      numPacFrecRespiratoriaMinLong: 2,
      numPacTemperaturaMaxLong: 2,
      numPacTemperaturaMinLong: 5,

    },
    {
      grupoEdad: GrupoEdad.INFANTE,
      numPacTenArtSistolicaMin: 84,
      numPacTenArtSistolicaMax: 106,
      numPacTenArtDiastolicaMax: 70,
      numPacTenArtDiastolicaMin: 56,
      numPacFrecCardiacaMax: 130,
      numPacFrecCardiacaMin: 100,
      numPacFrecRespiratoriaMax: 30,
      numPacFrecRespiratoriaMin: 20,
      numPacTemperaturaMax: 37.8,
      numPacTemperaturaMin: 37.5,
      numPacTenArtSistolicaMinLong: 2,
      numPacTenArtSistolicaMaxLong: 3,
      numPacTenArtDiastolicaMaxLong: 2,
      numPacTenArtDiastolicaMinLong: 2,
      numPacFrecCardiacaMaxLong: 3,
      numPacFrecCardiacaMinLong: 3,
      numPacFrecRespiratoriaMaxLong: 2,
      numPacFrecRespiratoriaMinLong: 2,
      numPacTemperaturaMaxLong: 2,
      numPacTemperaturaMinLong: 5,
    },
    {
      grupoEdad: GrupoEdad.LACTANTE,
      numPacTenArtSistolicaMin: 98,
      numPacTenArtSistolicaMax: 106,
      numPacTenArtDiastolicaMax: 70,
      numPacTenArtDiastolicaMin: 58,
      numPacFrecCardiacaMax: 120,
      numPacFrecCardiacaMin: 100,
      numPacFrecRespiratoriaMax: 30,
      numPacFrecRespiratoriaMin: 20,
      numPacTemperaturaMax: 37.8,
      numPacTemperaturaMin: 37.5,
      numPacTenArtSistolicaMinLong: 2,
      numPacTenArtSistolicaMaxLong: 3,
      numPacTenArtDiastolicaMaxLong: 2,
      numPacTenArtDiastolicaMinLong: 2,
      numPacFrecCardiacaMaxLong: 3,
      numPacFrecCardiacaMinLong: 3,
      numPacFrecRespiratoriaMaxLong: 2,
      numPacFrecRespiratoriaMinLong: 2,
      numPacTemperaturaMaxLong: 4,
      numPacTemperaturaMinLong: 4,
    },
    {
      grupoEdad: GrupoEdad.PRESCOLAR,
      numPacTenArtSistolicaMin: 98,
      numPacTenArtSistolicaMax: 112,
      numPacTenArtDiastolicaMax: 70,
      numPacTenArtDiastolicaMin: 67,
      numPacFrecCardiacaMax: 120,
      numPacFrecCardiacaMin: 80,
      numPacFrecRespiratoriaMax: 30,
      numPacFrecRespiratoriaMin: 20,
      numPacTemperaturaMax: 37.8,
      numPacTemperaturaMin: 37.5,
      numPacTenArtSistolicaMinLong: 2,
      numPacTenArtSistolicaMaxLong: 3,
      numPacTenArtDiastolicaMaxLong: 2,
      numPacTenArtDiastolicaMinLong: 2,
      numPacFrecCardiacaMaxLong: 3,
      numPacFrecCardiacaMinLong: 3,
      numPacFrecRespiratoriaMaxLong: 2,
      numPacFrecRespiratoriaMinLong: 2,
      numPacTemperaturaMaxLong: 4,
      numPacTemperaturaMinLong: 4,
    },
    {
      grupoEdad: GrupoEdad.ESCOLAR,
      numPacTenArtSistolicaMin: 104,
      numPacTenArtSistolicaMax: 124,
      numPacTenArtDiastolicaMax: 86,
      numPacTenArtDiastolicaMin: 64,
      numPacFrecCardiacaMax: 100,
      numPacFrecCardiacaMin: 80,
      numPacFrecRespiratoriaMax: 20,
      numPacFrecRespiratoriaMin: 12,
      numPacTemperaturaMax: 37.5,
      numPacTemperaturaMin: 37,
      numPacTenArtSistolicaMinLong: 2,
      numPacTenArtSistolicaMaxLong: 3,
      numPacTenArtDiastolicaMaxLong: 2,
      numPacTenArtDiastolicaMinLong: 2,
      numPacFrecCardiacaMaxLong: 3,
      numPacFrecCardiacaMinLong: 3,
      numPacFrecRespiratoriaMaxLong: 2,
      numPacFrecRespiratoriaMinLong: 2,
      numPacTemperaturaMaxLong: 4,
      numPacTemperaturaMinLong: 4,
    },
    {
      grupoEdad: GrupoEdad.ADOLESCENTE,
      numPacTenArtSistolicaMin: 118,
      numPacTenArtSistolicaMax: 132,
      numPacTenArtDiastolicaMax: 82,
      numPacTenArtDiastolicaMin: 70,
      numPacFrecCardiacaMax: 80,
      numPacFrecCardiacaMin: 70,
      numPacFrecRespiratoriaMax: 20,
      numPacFrecRespiratoriaMin: 12,
      numPacTemperaturaMax: 37,
      numPacTemperaturaMin: 36,
      numPacTenArtSistolicaMinLong: 3,
      numPacTenArtSistolicaMaxLong: 3,
      numPacTenArtDiastolicaMaxLong: 2,
      numPacTenArtDiastolicaMinLong: 2,
      numPacFrecCardiacaMaxLong: 2,
      numPacFrecCardiacaMinLong: 2,
      numPacFrecRespiratoriaMaxLong: 2,
      numPacFrecRespiratoriaMinLong: 2,
      numPacTemperaturaMaxLong: 4,
      numPacTemperaturaMinLong: 2,
    },
    {
      grupoEdad: GrupoEdad.ADULTO,
      numPacTenArtSistolicaMin: 90,
      numPacTenArtSistolicaMax: 140,
      numPacTenArtDiastolicaMax: 90,
      numPacTenArtDiastolicaMin: 60,
      numPacFrecCardiacaMax: 99,
      numPacFrecCardiacaMin: 60,
      numPacFrecRespiratoriaMax: 20,
      numPacFrecRespiratoriaMin: 12,
      numPacTemperaturaMax: 37.2,
      numPacTemperaturaMin: 35.5,
      numPacTenArtSistolicaMinLong: 2,
      numPacTenArtSistolicaMaxLong: 3,
      numPacTenArtDiastolicaMaxLong: 2,
      numPacTenArtDiastolicaMinLong: 2,
      numPacFrecCardiacaMaxLong: 2,
      numPacFrecCardiacaMinLong: 2,
      numPacFrecRespiratoriaMaxLong: 2,
      numPacFrecRespiratoriaMinLong: 2,
      numPacTemperaturaMaxLong: 4,
      numPacTemperaturaMinLong: 4,
    },



  ];


  getsignosVitalesPermitidos() {
    return this.signosVitales;
  }



  public getParametrosSV(curp: string): SignosVitalesPermitidos {
    /*   curp = 'HEVS240327MMCRDNA6'; //recien nacido
       curp = 'HEVS240208MMCRDNA6'; //recien nacido 6 semanas
       //  curp = 'HEVS240121MMCRDNA6'; //infante
       //curp = 'HEVS230327MMCRDNA6'; //lactante
       //   curp = 'HEVS220327MMCRDNA6'; //precolar 2 años
       curp = 'HEVS180327MMCRDNA6'; //precolar 6 años
      
           curp = 'HEVS180326MMCRDNA6'; //escolar 6 años 1 dia
       curp = 'HEVS110327MMCRDNA6'; //escolar 13 años
       curp = 'HEVS110327MMCRDNA6'; //adolescente 13 años 1dia
       curp = 'HEVS080327MMCRDNA6'; //adolescente 16 años 
       curp = 'HEVS080326MMCRDNA6'; //adolescente 16 años 1 dia 
       */

    //console.log('CURP', curp);
    if (curp) {
      let fechaNciamiento = curp.substring(4, 10);
      let y = fechaNciamiento.substring(0, 2)
      let m = fechaNciamiento.substring(2, 4)
      let d = fechaNciamiento.substring(4, 6)
      let yy, mm, dd;
    //  console.log('fechaNciamiento: ', fechaNciamiento);
   //   console.log('y: ', y);
    //  console.log('m: ', m);
   //   console.log('d: ', d);
      if (parseInt(y) <= 40) {
        yy = this.returnInteger('20' + y);
      }
      if (parseInt(y) >= 40) {
        yy = this.returnInteger('19' + y);
      }
      mm = this.returnInteger(m);
      dd = this.returnInteger(d);
      let aux = yy + '-' + m + '-' + d;
      let fecha: Date = this.convertirDate(aux);
     // console.log('fecha: ', fecha);

      let timeDiff = Math.abs(Date.now() - <any>fecha);
      let anios = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
      let dias = 0;
      let semanas = 0;
      let horas = 0;
      dias = Math.floor((timeDiff / (1000 * 3600 * 24)));
      semanas = Math.floor((timeDiff / (1000 * 3600 * 24)) / 7);

      let yFloat = Math.round(((timeDiff / (1000 * 3600 * 24)) / 365)).toFixed(2);
      let grupoEdad = '';
      if (anios == 0) {

        if (dias >= 0 && (semanas <= 6 && dias <= 48)) {
          grupoEdad = GrupoEdad.RECIEN_NACIDO;
        }
        if (dias >= 49 && (semanas >= 7 && semanas <= 51)) {
          grupoEdad = GrupoEdad.INFANTE;
        }

      }

      if (semanas >= 52 && anios <= 2) {
        grupoEdad = GrupoEdad.LACTANTE;
      }

      if (semanas >= 104 && dias <= 2191) {
        grupoEdad = GrupoEdad.PRESCOLAR;
      }

      if ((dias >= 2192 && semanas <= 678) && anios <= 13) {
        grupoEdad = GrupoEdad.ESCOLAR;
      }
      if ((dias >= 4750 && semanas <= 834) && anios <= 16) {
        grupoEdad = GrupoEdad.ADOLESCENTE;
      }
      if (dias >= 5845 && semanas >= 835) {
        grupoEdad = GrupoEdad.ADULTO;
      }



    

    
      return this.RN76(grupoEdad);
    } else {

      return undefined;
    }

  }

  public returnInteger(numero: string): number {
    let integer = 0;
   
    if (numero.substring(0) == '0') {
      integer = parseInt(numero.substring(1));

    } else {
      integer = parseInt(numero);
    }
    //   console.log('entero convertido: ', integer);

    return integer;
  }

  public convertirDate(fechaInicio: string) {
    let periodo = fechaInicio.split(' ');
    let fecha = periodo[0];
    let year = fecha.substring(0, 4);
    let month = fecha.substring(5, 7);
    let day = fecha.substring(8, 10);
 
    let inicio = new Date(this.returnInteger(year), this.returnInteger(month) - 1, this.returnInteger(day));
    //console.log('covnersion fecha iicio', inicio);


    return inicio;
  }

  public convertirDateAplic(fechaInicio: string) {
    let periodo = fechaInicio.split(' ');
    let fecha = periodo[0];
    let year = fecha.substring(0, 4);
    let month = fecha.substring(4, 6);
    let day = fecha.substring(6, 8);

    let inicio = new Date(this.returnInteger(year), this.returnInteger(month) - 1, this.returnInteger(day));
   // console.log('convertirDateAplic fecha iicio', inicio);


    return inicio;
  }

  public convertirDateMonthNext(fechaInicio: string) {
    let periodo = fechaInicio.split(' ');
    let fecha = periodo[0];
    let year = fecha.substring(0, 4);
    let month = fecha.substring(4, 6);
    let day = fecha.substring(6, 8);
   
    let inicio = new Date(this.returnInteger(year), this.returnInteger(month) , this.returnInteger(day));
   // console.log('convertirDateMonthNext fecha iicio', inicio);


    return inicio;
  }


  public RN76(grupoEdad: string): SignosVitalesPermitidos { //rangos de edad y valores permitidos
    let signo: SignosVitalesPermitidos = new SignosVitalesPermitidos();
    let lstValores = this.getsignosVitalesPermitidos();
    signo = lstValores.find(x => x.grupoEdad == grupoEdad);
  //  console.log("valores permitidos: ", signo);
    return signo;
  }
}
