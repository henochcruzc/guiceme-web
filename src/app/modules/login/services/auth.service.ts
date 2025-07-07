import { Injectable } from '@angular/core';
import { API } from 'src/app/shared/config/endpoints';
import { BaseHttpClientService } from './baseHttpClient.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseHttpClientService{

  login(data: any){
    return this.post(`${API.seguridad.oauth}`,data);
  }

  actualizar(data: any){
    return this.put(`${API.seguridad.oauth}`,data);
  }

  eventoBitacora(data: any){
    return this.post(`${API.seguridad.eventoBitacora}`,data);
  }

  
}
