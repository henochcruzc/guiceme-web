import { Injectable } from '@angular/core';
import { BaseHttpClientService } from 'src/app/modules/login/services/baseHttpClient.service';
import { API } from '../config/endpoints';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PreparacionService extends BaseHttpClientService {
 


  busqueda(model) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("page",model.page);
    queryParams = queryParams.append("size",model.size);
    return this.postParam(`${API.preparacionMezcla.busqueda}`,model, queryParams);
  }

  detalleMezcla(idMezclaAplicDiaDosis) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("idMezclaAplicDiaDosis",idMezclaAplicDiaDosis);
    return this.get(`${API.preparacionMezcla.detalle}`, queryParams);
  }

  finalizar(modelo){
    return this.post(`${API.preparacionMezcla.finaliza}`, modelo);
  }

  getLote(idMedicamento,idMezclaAplicDiaDosis){
    let queryParams = new HttpParams();
    queryParams = queryParams.append("idMedicamento",idMedicamento);
    queryParams = queryParams.append("idMezclaAplicDiaDosis",idMezclaAplicDiaDosis);
    return this.get(`${API.preparacionMezcla.loteMed}`, queryParams);
  }

  guardaCaducidad(modeloCaducidad) {
    return this.post(`${API.preparacionMezcla.guardaCaducidad}`, modeloCaducidad);
  }

  burcarFicha(idMedicamento,idMarca){
    let queryParams = new HttpParams();
    queryParams = queryParams.append("idMedicamento",idMedicamento);
    queryParams = queryParams.append("idMarca",idMarca);
    return this.get(`${API.preparacionMezcla.fichaTecnica}`, queryParams);
  }

  getCodigoBarra(folioMezcla){
    let queryParams = new HttpParams();
    queryParams = queryParams.append("cveFolioMezclaDosis",folioMezcla);
    return this.get(`${API.preparacionMezcla.codigoBarras}`, queryParams);
  }

}
