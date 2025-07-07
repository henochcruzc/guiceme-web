import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable()
export class LoadingInterceptorHelper implements HttpInterceptor {
  private count = 0;
  private excludeService: Array<string> = [
    '/v1/endPointSinLoading',// end point sin carga

    '/v1/preparadorMezcla/finalizarPreparacion',// finalizar cu7

    '/v1/preparadorMezcla/imprimir',// imprimir cu7

  ];
  
  constructor(private spinner: NgxSpinnerService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.isServiceExcluded(request.url) === false) {
      this.count++;
      this.spinner.show();
      return next.handle(request).pipe(
        finalize(() => {
          this.count--;
          if (this.count === 0) {
            setTimeout(() => {
              this.spinner.hide();
            }, 1000);
          }
        })
      );
    } else {
      return next.handle(request);
    }
  }

  private isServiceExcluded(url: string): boolean {
    const found = this.excludeService.filter((service) => {
      if (url.includes(service)) {
        return service;
      }
    });
    return found.length > 0;
  }

}
