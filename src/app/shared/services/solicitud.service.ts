import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseHttpClientService } from 'src/app/modules/login/services/baseHttpClient.service';
import { API } from '../config/endpoints';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService extends BaseHttpClientService {
  constructor(private http: HttpClient) {
    super();
  }


}
