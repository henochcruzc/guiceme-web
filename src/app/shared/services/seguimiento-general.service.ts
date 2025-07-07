import { Injectable } from '@angular/core';
import { BaseHttpClientService } from 'src/app/modules/login/services/baseHttpClient.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API } from '../config/endpoints';
import { map } from 'rxjs';
import { Estatus } from '../models/estatus.model';
import { EstatusMezcla } from '../general.enum';
@Injectable({
  providedIn: 'root'
})
export class SeguimientoGeneralService extends BaseHttpClientService {
  constructor(private http: HttpClient) {
    super();
  }


  getHistorialMezclas(filtros) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("sort",'fecUltimoCambio,desc');
    queryParams = queryParams.append("page",filtros.page);
    queryParams = queryParams.append("size",filtros.size);
    
  //  if(filtros.filtros.length != undefined){
      queryParams = queryParams.append("filter",this.objToQueryParams(filtros.filtros));
  // }
    
    //queryParams = queryParams.append("filter",filtros.filtros);
    return this.get(`${API.seguimiento.historialMezclas}`,queryParams);
   
      return this.get(`${API.seguimientoGeneral.historialMezclas}`, queryParams);  
   
    
  }



  getProgreso(idFolioMezcla) {
    let queryParams = new HttpParams();
    //queryParams = queryParams.append("filter",this.objToQueryParams(filtro));
    //  return this.get(`${API.seguimiento.historialMezclas}`,queryParams);
    return this.get(`${API.seguimiento.historialMezclas}?filter=progreso/${idFolioMezcla}=v2/true`, null);

  }

  getEstatusMezcla() {
    return this.http.get<Estatus[]>(`${API.catalogos.getEstatusMezcla}`).pipe(

      map((response: Estatus[]) => {
        let lstEstatusMezclas = new Array<Estatus>();
        if(response){
          for(let estatus of response){//RN082
            if(estatus.id == 11
            || estatus.id == 3
            || estatus.id == 16
            || estatus.id == 7
            || estatus.id == 4
            || estatus.id == 8
            || estatus.id == 12
            || estatus.id == 2
            || estatus.id == 6
            || estatus.id == 5
            || estatus.id == 13
            || estatus.id == 9
            || estatus.id == 10
            || estatus.id == 1
            || estatus.id == 14

            ){
              lstEstatusMezclas.push(estatus);
            }
          }
          
        }
        
        
        return lstEstatusMezclas;
      })
    );
  }



}
