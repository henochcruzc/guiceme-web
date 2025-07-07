import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Alert, AlertType } from './alert.model';

@Injectable({ providedIn: 'root' })
export class AlertService {
  private subject = new Subject<Alert>();
  private defaultId = 'default-alert';

  // enable subscribing to alerts observable
  onAlert(id = this.defaultId): Observable<Alert> {
    return this.subject.asObservable().pipe(filter(x => x && x.id === id));
  }

  success(message: string, options?: any) {
    this.alert(new Alert({ ...options, type: AlertType.Success, message }));
  }

  successSave(options?: any) {
    this.alert(new Alert({ ...options, type: AlertType.Success, message: 'Los datos se guardaron correctamente' }));
  }

  error(message: string, options?: any) {
    this.alert(new Alert({ ...options, type: AlertType.Error, message }));
  }

  errorRecepcion() {
    this.alert(new Alert({ type: AlertType.Error, message: '<strong>No se encontraron resultados</strong> con los criterios de búsqueda ingresados.' }));
  }

  errorSave() {
    this.alert(new Alert({ type: AlertType.Error, message: 'Los datos no se guardaron correctamente' }));
  }

  errorServer(options?: any) {
    this.alert(new Alert({ ...options, type: AlertType.Error, message: 'El sistema no está disponible intente más tarde.' }));
  }

  info(message: string, options?: any) {
    this.alert(new Alert({ ...options, type: AlertType.Info, message }));
  }

  warn(message: string, options?: any) {
    this.alert(new Alert({ ...options, type: AlertType.Warning, message }));
  }

  // main alert method
  alert(alert: Alert) {
    alert.id = alert.id || this.defaultId;
    this.subject.next(alert);
  }

  // clear alerts
  clear(id = this.defaultId) {
    this.subject.next(new Alert({ id }));
  }
  errorCamposObligatorios(options?: any) {
    this.alert(new Alert({ ...options, type: AlertType.Error, message: '<strong>Error</strong> No se ha registrado la información completa' }));
  }
}
