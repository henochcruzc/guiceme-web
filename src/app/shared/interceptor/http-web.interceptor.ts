import { Injectable } from "@angular/core";
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { SessionStorageService } from "src/app/modules/login/services/session-storage.service";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Router } from "@angular/router";
import { NAV } from "../config/global";



@Injectable({
  providedIn: 'root'
})
export class HttpWebInterceptor implements HttpInterceptor {

  constructor(private router: Router, private sessionStorage: SessionStorageService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //valida si es el login lo deja pasar 
    if (request.url.endsWith("/signin")) {
      return next.handle(request);
    }

    //valida el token que si exista y el tiempo de vida del mismo  
    const jwtHelper = new JwtHelperService();
    var token = this.sessionStorage.getToken();    
    const ex = token ? jwtHelper.isTokenExpired(token) : true;    
    if (ex) { //Expiro el tiempo regresa a login
      this.router.navigate([NAV.login]);
    }

    // setea el header a cada peticion y token
    request = request.clone({ headers: this.obtenerHeaders(request) });
    
    //Deja realizar la peticcion http
     //return next.handle(request);

    return next.handle(request).pipe(
      catchError((error) => {
        if(HttpErrorResponse  instanceof error){
          console.log('error in intercept HttpWebInterceptor')
          console.error(error);
          return of(null);
        }        
        // return throwError(error.message);
      })
    )

  }

  private obtenerHeaders(request: HttpRequest<any>) {
    const token = this.sessionStorage.getToken();

    //header por default
    let headers = new HttpHeaders()
    headers = headers.set('Access-Control-Allow-Origin', '*');
    headers = headers.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,DELETE,PUT');

    //token
    if (token != null) {
      headers = headers.set('authorization', `Bearer ${ token }`);
    }

    return headers;
  }

}
