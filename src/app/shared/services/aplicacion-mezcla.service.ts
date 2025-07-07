import { Injectable } from '@angular/core';
import { BaseHttpClientService } from 'src/app/modules/login/services/baseHttpClient.service';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { API } from '../config/endpoints';
import { MezclaEsterilRequest } from '../models/aplicacion-mezcla.model';

import { MezclaEsteril } from '../models/mezcla.model';
import { map } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AplicacionMezclaService extends BaseHttpClientService {
  constructor(private http: HttpClient) {
    super();
  }
  header = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
  });



  getHistorialMezclas(filtros) {
    let queryParams = new HttpParams();
    // const options = { params: new HttpParams({ fromObject: fil }) };
    queryParams = queryParams.append("", this.objToQueryParams(filtros));
    return this.get(`${API.aplicacionMezcla.historialMezclas}`, filtros);
  }

  
  getHistorialMezclas1(filtros) {
    return this.http.get<MezclaEsterilRequest>(`${API.aplicacionMezcla.historialMezclas}`, filtros).pipe(

      map((response: any) => {
        let lstMezclas = new Array<MezclaEsteril>();
        if(response){
          for(let registro of response.content){
            if(registro.idEstatus == 9   ){
              registro.desEstatusMezcla = 'Por aplicar';
            
                        
            }
            lstMezclas.push(registro);
          }
          
        }
        
        response.content = lstMezclas;
        return response;
      })    );
  }


  getSignosVitales(id: number) {

    return this.get(`${API.aplicacionMezcla.signosVitales}?idAplicacionMezcla=`+id, );
  }

  saveSignosVitales(model) {
    return this.post(`${API.aplicacionMezcla.signosVitales}`, model);
  }

  updateSignosVitales(model) {
    return this.put(`${API.aplicacionMezcla.signosVitales}`, model);
  }


  getTurno(hora: string) {
    return this.get(`${API.aplicacionMezcla.turno}?hora=`+hora);
  }



  iniciarAplicacion(model) {
    return this.post(`${API.aplicacionMezcla.iniciarAplicacion}`, model);
  }

  finalizarAplicacion(model) {
    return this.post(`${API.aplicacionMezcla.finalizarAplicacion}`, model);
  }

  noAplicar(model) {
    return this.post(`${API.aplicacionMezcla.noAplicar}`, model);
  }

}
