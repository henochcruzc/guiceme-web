import { Component, inject, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { NAV } from '../../shared/config/global';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { API } from '../../shared/config/endpoints';


import { NgxSpinnerService } from 'ngx-spinner';
import { AccountService } from '../login/services/account.service';
import { AlertService } from 'src/app/shared/alert';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { SessionStorageService } from '../login/services/session-storage.service';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { SideBarComponent } from 'src/app/shared/sidebar/sideBar.component';
import { CommonModule } from '@angular/common';
import { ConfigTabla, EstatusMezcla, TipoMezcla } from 'src/app/shared/general.enum';
import * as moment from 'moment';
import {  ReporteMezclasAprobada } from 'src/app/shared/services/reporte/reporteMezclasAprobada.service'; 
import { GenericDialogService } from 'src/app/shared/dialog/genericDialog.service';
import { GenericFormlyDialogService } from 'src/app/shared/dialog-formly/genericFormlyDialog.service';
import { resolucionPDF } from 'src/app/shared/services/reporte/ResolucionMezclaPDF.service';
import { Mensajes } from 'src/app/shared/config/mensajes';
import { ColoresEstatus } from 'src/app/shared/general.utils';

@Component({
  selector: 'app-general',
  standalone: true,
  imports: [
    CommonModule,
    SideBarComponent
  ],
  template: '',
})
export class GeneralComponent implements OnDestroy {
  @ViewChild('tableModalSalir') tableModalSalir: any;

  protected _sesionStorage: SessionStorageService;
  protected _accountService: AccountService;
  protected _ruta: ActivatedRoute;
  protected _alertServices: AlertService;
  protected _spinner: NgxSpinnerService;
  protected _router: Router;
  protected _dialog: MatDialog;
  protected _dialogService: GenericDialogService;
  protected _dialogFormlyService: GenericFormlyDialogService;
  protected _offcanvasService: NgbOffcanvas;
  
  protected _reporteMezclasAprobadas: ReporteMezclasAprobada;
  protected _resolucionPDF: resolucionPDF;

  protected _Mensajes : Mensajes;

  protected _coloresEstatus :  ColoresEstatus;

  _nav = NAV;

  subscripcion: Subscription;

  constructor() {
    this._sesionStorage = inject(SessionStorageService);
    this._accountService = inject(AccountService);
    this._ruta = inject(ActivatedRoute);
    this._alertServices = inject(AlertService);
    this._spinner = inject(NgxSpinnerService);
    this._dialog = inject(MatDialog);
    this._router = inject(Router);
    this._dialogService = inject(GenericDialogService);
    this._dialogFormlyService = inject(GenericFormlyDialogService);
    this._offcanvasService = inject(NgbOffcanvas);
    this._reporteMezclasAprobadas = inject(ReporteMezclasAprobada);
    this._resolucionPDF = inject(resolucionPDF);
    this._Mensajes = inject(Mensajes);
    this._coloresEstatus = inject(ColoresEstatus);

    history.pushState(null, '', location.href);
    this.subscripcion = fromEvent(window, 'popstate').subscribe((_) => {
      history.pushState(null, '', location.href);
    });

    this._ruta.queryParams.subscribe((params) => {
      if (params) {
        setTimeout(() => {
          this._router.navigate([], {
            relativeTo: this._ruta,
            queryParams: null,
            queryParamsHandling: '',
          });
        }, 1000);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscripcion?.unsubscribe();
  }

  validaCamposFormulario(formGroups: FormGroup[]) {
    formGroups.forEach((formulario) => {
      Object.keys(formulario.controls).forEach((field) => {
        const control = formulario.get(field);
        if (control instanceof FormControl) {
          control.markAsTouched({ onlySelf: true });
        } else if (control instanceof FormGroup) {
          this.validaCamposFormulario([control]);
        } else if (control instanceof FormArray) {
          control.controls.forEach((element) => {
            if (element instanceof FormControl) {
              element.markAsTouched({ onlySelf: true });
            } else if (element instanceof FormGroup) {
              this.validaCamposFormulario([element]);
            }
          });
        }
      });
    });
  }

  irAHome() {
    this._router.navigate([NAV.home]);
  }

  navegarA(route: string, parametro?: any) {
    this._router.navigate([route], {
      skipLocationChange: true,
      queryParams: parametro,
    });
  }

  openModalSalir() {
    this.tableModalSalir.nativeElement.className = 'modal show-modal';
  }

  closeModalSalir() {
    this.tableModalSalir.nativeElement.className = 'modal hide-modal';
  }

  goToHome(page?: any) {
    window.parent.location.href = NAV.home;
  }

  goToLogin() {
    this._accountService.logout();
    window.parent.location.href = API.login;
  }

  abrirModal(Component: any, data: any): Observable<any> {
    const dialogRef = this._dialog.open(Component, { width: '496px', data });
    return dialogRef.afterClosed();
  }

  /**
   *
   * @param mensaje Mensaje que muestra el dialogo
   * @param pregunta Pregunta para realizar la acción
   * @param labelOk Etiqueta del botón de acción
   * @param labelCerrar Etiqueta del botón de cancelar
   * @returns Observable con la respuesta del Dialogo
   */
  abrirDialog(
    mensaje: string,
    pregunta: string,
    labelOk?: string,
    labelCerrar?: string
  ): Observable<any> {
    let data = {
      mensaje: mensaje,
      pregunta: pregunta,
      labelOk: labelOk ? labelOk : 'Aceptar',
      labelCerrar: labelCerrar ? labelCerrar : 'Cancelar',
      noAceptar: false
    };

    return this.abrirModal(DialogComponent, data);
  }

  abrirDialogUnicoBoton(
    mensaje: string,
    pregunta: string,
    labelOk?: string,
    labelCerrar?: string): Observable<any> {
    let data = {
      mensaje: mensaje,
      pregunta: pregunta,
      labelOk: labelOk ? labelOk : 'Aceptar',
      labelCerrar: labelCerrar ? labelCerrar : 'Cancelar',
      noAceptar: true
    };
    return this.abrirModal(DialogComponent, data);
  }

  scrollTo(idElement: any) {
    setTimeout(() => {
      var element = document.getElementById(idElement);
      if (element)
        element.scrollIntoView({ block: "end", behavior: "smooth" });
    }, 500);
  }

  protected getCountTextArea(textAreaMaxLength, totalRestantes): string {
    return `${(totalRestantes)}/${(textAreaMaxLength)}`;
  }

  abrirOffCanvas(tituloOffCanvas?: string, fieldsOffCanvas?: any, dialogConfigConfirmOffCanvas?: MatDialogConfig, dialogConfigCloseOffCanvas?: MatDialogConfig) {

    const offCanvasRef = this._offcanvasService.open(SideBarComponent, { position: 'end', backdrop: 'static', keyboard: false });
    offCanvasRef.componentInstance.tituloOffCanvas = tituloOffCanvas;
    offCanvasRef.componentInstance.fieldsOffCanvas = fieldsOffCanvas;
    if (dialogConfigConfirmOffCanvas) {
      offCanvasRef.componentInstance.dialogConfigConfirmOffCanvas = dialogConfigConfirmOffCanvas;
    }
    if (dialogConfigCloseOffCanvas) {
      offCanvasRef.componentInstance.dialogConfigCloseOffCanvas = dialogConfigCloseOffCanvas;
    }
    return offCanvasRef.result;
  }

  get ConfigTabla() {
    return ConfigTabla;
  }

  get EstatusMezcla() {
    return EstatusMezcla;
  }

  get TipoMezcla() {
    return TipoMezcla;
  }

  get uuid() {
    return 'xxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  get randomInt() {
    let min = 0.1, max = 18;
    return Math.floor(Math.random() * (max - min + 1));
  }

  calcularEdad(dateString) {

    if(!dateString) {
      return 'SIN INFORMACIÓN';
    }

    //let dateString: string = "2021-09-01";
    let fechaNacimiento: Date = new Date(dateString);
    //console.log(fechaNacimiento);

    const fechaActual = new Date();
    let edad = fechaActual.getFullYear() - fechaNacimiento.getFullYear();

    const mesActual = fechaActual.getMonth();
    const mesNacimiento = fechaNacimiento.getMonth();

    if (mesNacimiento > mesActual || (mesNacimiento === mesActual && fechaNacimiento.getDate() > fechaActual.getDate())) {
      edad--;
    }

    return (edad == 0 ? '0' : edad)
  }

  cambiaFormatoFecha(dateString) {
    let date: Date = moment(dateString, 'YYYY-MM-DD').toDate();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    let formattedDate = day + '/' + month + '/' + year;
    return formattedDate;
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }



  getTabsMesDias(x) {
    let tabsMes = [];
    if (x != null && x != '') {
      if (x.startDate != null && x.endDate != null) {
        let startDate = moment(x.startDate, 'YYYY-MM-DD');
        let endDate = moment(x.endDate, 'YYYY-MM-DD');
        let days = [];
        var betweenMonths = [];
        tabsMes = [];
        var date = startDate.clone().startOf('month');
        while (date < endDate.clone().endOf('month')) {
          betweenMonths.push(date.format('YYYY-MM'));
          date.add(1, 'month');
        }
        // console.log('########### betweenMonths: ', betweenMonths)
        while (startDate.isSameOrBefore(endDate, 'days')) {
          days.push(startDate.clone().format('YYYY-MM-DD'))
          startDate.add(1, 'days');
        }
        // console.log('########### days: ', days)
        betweenMonths.forEach(el => {
          let dias = days.filter(item => moment(item, 'YYYY-MM-DD').isSame(el, 'month'));
          let arrayDays = []
          // console.log(' %%%%%%%%%%%%%%%%%%%%%%%% diasssss ', dias)
          dias.forEach(el => {
            arrayDays.push({
              nombreDia: moment(el, 'YYYY-MM-DD').format('DD'),
              nombreAnio: moment(el, 'YYYY-MM-DD').format('YYYY'),
              nombreMes: moment(el, 'YYYY-MM').locale('es').format('MMMM'),
              numMes : moment(el, 'YYYY-MM').format('MM'),
              diaCompleto:  moment(el, 'YYYY-MM-DD').format('YYYY-MM-DD'),
              check: false
            });
          });
          // console.log('########### mes: ', el, moment(el, 'YYYY-MM').locale('es').format('MMMM'))
          let mesData = {
            nombreMes: moment(el, 'YYYY-MM').locale('es').format('MMMM'),
            nombreAnio: moment(el, 'YYYY-MM').format('YYYY'),
            dias: arrayDays,
          }

          tabsMes.push(mesData)

        })
      }

    }
    return tabsMes;

  }

  sortArrayOfObjects = <T>(
    data: T[],
    keyToSort: keyof T,
    des: boolean,
  ) => {
    

    const compare = (objectA: T, objectB: T) => {
      const valueA = objectA[keyToSort]
      const valueB = objectB[keyToSort]
  
      if (valueA === valueB) {
        return 0
      }
  
      if (valueA > valueB) {
        return des === false ? 1 : -1
      } else {
        return des === false ? -1 : 1
      }
    }
  
    return data.slice().sort(compare)
  }
  
}
