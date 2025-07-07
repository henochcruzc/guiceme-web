import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { API } from 'src/app/shared/config/endpoints';
import { BaseHttpClientService } from './baseHttpClient.service';
import { MockData } from './mockdata';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService extends BaseHttpClientService {
 getNotificaciones(indicadorLeida){
    return this.get(`${API.consultas.notificaciones}?leida=${indicadorLeida}`);
   
  }
}
