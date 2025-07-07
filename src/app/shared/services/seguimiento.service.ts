import { Injectable } from '@angular/core';
import { BaseHttpClientService } from 'src/app/modules/login/services/baseHttpClient.service';
import { API } from '../config/endpoints';
import { HttpParams } from '@angular/common/http';
import { lastValueFrom, map } from 'rxjs';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class SeguimientoService extends BaseHttpClientService {

  getDatosPaciente(nss) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("nss",nss);
    return this.get(`${API.seguimiento.datosPaciente}`,queryParams);
  }

  getHistorial(req){
    let queryParams = new HttpParams();
    // queryParams = queryParams.append("sort",req.sort);
    queryParams = queryParams.append("page",req.page);
    queryParams = queryParams.append("size",req.size);
    queryParams = queryParams.append("filter",this.objToQueryParams(req.filtros));
    queryParams = queryParams.append("sort",'fecUltimoCambio,desc');
    return this.get(`${API.seguimiento.historialMezclas}`,queryParams);
  }

  getDetalleAntibiotico(idMezcla){
    let queryParams = new HttpParams();
    queryParams = queryParams.append("idMezclaAplicDiaDosis",idMezcla);
    return this.get(`${API.consultas.getDetalleMezclaPre}`,queryParams);
  }

  getDetalleCitotoxico(idMezcla){
    let queryParams = new HttpParams();
    queryParams = queryParams.append("idMezclaAplicDiaDosis",idMezcla);
    return this.get(`${API.consultas.getDetalleCitotoxico}`,queryParams);
  }

  getDetalleNpt(idMezcla){
    let queryParams = new HttpParams();
    queryParams = queryParams.append("idMezclaAplicDiaDosis",idMezcla);
    return this.get(`${API.consultas.getDetalleNpt}`,queryParams);
  }


  async getProgreso(filtro){
    let queryParams = new HttpParams();
    queryParams = queryParams.append("filter",this.objToQueryParams(filtro));
    

    return await lastValueFrom(this._http.get<any>(`${API.seguimiento.historialMezclas}`,{params:queryParams}).pipe(

      // return this.get(`${API.seguimiento.historialMezclas}`,queryParams).pipe(
  
        map((response: any) => {
          let lstprogreso = new Array<any>();
          if(response){
            for(let registro of response){           
              let fecha = moment(registro.fechaHora,'DD/MM/YYYY HH:mm:ss.SSS').format('DD/MM/YYYY HH:mm');
              registro.fechaHora = fecha;
              lstprogreso.push(registro);
            }
            
          }
          
          response = lstprogreso;
          return response;
        })    
        ))
    ;

  }

  cancelar(model){
    return this.post(`${API.seguimiento.cancelar}`,model);
  }

  ratificar(model){
    return this.post(`${API.seguimiento.ratificar}`,model);
  }
  
  getDetalleDias(idMezcla){
    let queryParams = new HttpParams();
    queryParams = queryParams.append("idMezcla",idMezcla);
    return this.get(`${API.seguimiento.detalleDias}`,queryParams);
  }
}
