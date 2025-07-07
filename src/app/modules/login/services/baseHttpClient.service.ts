import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { lastValueFrom, throwError } from 'rxjs';
import { AlertService } from 'src/app/shared/alert';

@Injectable({
  providedIn: 'root'
})

export abstract class BaseHttpClientService {
  protected _http: HttpClient;
  protected _alertService:AlertService;

  constructor() {
    this._http = inject(HttpClient);
    this._alertService = inject(AlertService);
   }

   async post(url: string,data:any){    
    return await lastValueFrom(this._http.post<any>(url,data)).then(response => { console.log(response);   return response;}).catch(err => {this.handleError(err); return null;}).finally( () => console.log('finally post request'));
   }

   async postParam(url: string,data:any,params:any){    
    return await lastValueFrom(this._http.post<any>(url,data,{params: params})).then(response => { console.log(response);   return response;}).catch(err => {this.handleError(err); return null;}).finally( () => console.log('finally post request'));
   }

   async get(url: string,params?:any){  
    if(params){
      return await lastValueFrom(this._http.get<any>(url,{params:params})).then(response => { console.log(response);   return response;}).catch(err => {this.handleError(err); return null;}).finally( () => console.log('finally get request'));
    }  
    return await lastValueFrom(this._http.get<any>(url)).then(response => { console.log(response);   return response;}).catch(err => {this.handleError(err); return null;}).finally( () => console.log('finally get request'));
   }


   async put(url: string,data?:any){    
    return await lastValueFrom(this._http.put<any>(url,data)).then(response => { console.log(response);   return response;}).catch(err => {this.handleError(err); return null;}).finally( () => console.log('finally put request'));
   }

   async delete(url: string,data:any){    
    return await lastValueFrom(this._http.delete<any>(url,data)).then(response => { console.log(response);   return response;}).catch(err => {this.handleError(err); return null;}).finally( () => console.log('finally delete request'));
   }
  
  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      this._alertService.errorServer();
      console.error('Ha ocurrido un error:', error.error);
    } else {
      console.error(`El back regreso el código ${error.status},  mensaje: `, error.error);
      this._alertService.error( error.error);
    }  
  }


  protected objToQueryParams(o): string {
    return Object.keys(o).map(function (key) {
      if (!key.includes('Aux')) {
        return key + '/' + o[key];
      }
    }).filter(function (v) {
      return v;
    }).join('=');
  }
  

}
