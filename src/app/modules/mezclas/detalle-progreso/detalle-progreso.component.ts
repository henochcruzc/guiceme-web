import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { TituloComponent } from 'src/app/shared/layout/frames/titulo/titulo.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { GeneralComponent } from '../../general/general.component';
import { Router } from '@angular/router';
import { SeguimientoService } from 'src/app/shared/services/seguimiento.service';
import { EstatusMezcla } from 'src/app/shared/general.enum';
import { DialogFormlyComponent } from 'src/app/shared/dialog-formly/dialog-formly.component';
import { CatalogoService } from 'src/app/shared/services/catalogo.service';
import { MezclasService } from 'src/app/shared/services/mezclas.service';
import { SessionStorageService } from '../../login/services/session-storage.service';

@Component({
  selector: 'app-detalle-progreso',
  templateUrl: './detalle-progreso.component.html',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    TituloComponent
  ],
  styleUrls: ['./detalle-progreso.component.css']
})
export class DetalleProgresoComponent extends GeneralComponent {
  reporteMezclasAprobadasData: any;
  //////////
  sessionStorageService = inject(SessionStorageService)
  dataResolucion = this.sessionStorageService.getDataResolucion();
  user = this.sessionStorageService.getUser();

  constructor(public router: Router,    
    private catalogService: CatalogoService,
    private mezclaService: MezclasService,) {
    super();
  }
  _seguimientoService = inject(SeguimientoService);

  ngOnInit(): void {
    console.log('dataResolucion ', this.dataResolucion)
    console.log('user ', this.user)
    this._seguimientoService.getProgreso({ progreso: this.dataResolucion.cveFolioMezclaDosis }).then(resp => {
      if (resp) {
          this.listProg = resp//.sort((a: any, b: any) => (a.estatus.id > b.estatus.id) ? 1 : -1).filter((data) => data.estatus.id ? true : false);
          console.log(this.listProg)
      }
  });
  }

  getFaltantes() {
    if (this.listProg) {
      if (4 - this.listProg.length < 0) {
        return 0
      }
      return 4 - this.listProg.length;
    }
    return 4;
  }

  listProg: [any];

  /////////

  salir() {
    this.router.navigate([this._nav.analistaCalidad]);
  }


  findClass(tipo) {

    switch (tipo) {
      case EstatusMezcla.SOLICITADA: //Solicitada
        return 'blue';
        break;
      case EstatusMezcla.NO_APROBADA://No aprobada
        return 'orange';
        break;
      case EstatusMezcla.APROBADA://Aprobada
        return 'blue';
        break;
      case EstatusMezcla.DISPONIBLE://Disponible
        return 'blue';
        break;
      case EstatusMezcla.APLICADA://Aplicada
        return 'green';
        break;
      case EstatusMezcla.NO_APLICADA://No aplicada
        return 'orange';
        break;
      case EstatusMezcla.CANCELADA://cancelada
        return 'red';
        break;
      case EstatusMezcla.NO_APROBADA_CANCELADA_SISTEMA://cancelada
        return 'red';
        break;
      case EstatusMezcla.RATIFICADA://cancelada
        return 'orange';
        break;

      default:
        break;
    }


    return '';
  }

  findClassSeguimiento(tipo) {


    if (tipo == EstatusMezcla.SOLICITADA) { // solicitada
      return 'blue'
    }
    if (tipo == EstatusMezcla.CANCELADA) { // cancelada
      return 'red'
    }
    if (tipo == EstatusMezcla.RATIFICADA) {
      return 'orange'
    }
    if (tipo == EstatusMezcla.APROBADA) { // no aprobada
      return 'orange'
    }
    if (tipo == EstatusMezcla.NO_APROBADA) { // no aprobada
      return 'orange'
    }
    if (tipo == EstatusMezcla.NO_APROBADA_CANCELADA_SISTEMA) { // no aprobada cancelada por sistema
      return 'red'
    }
    if (tipo == EstatusMezcla.DISPONIBLE) { // aprobada
      return 'blue'
    }
    if (tipo == EstatusMezcla.APLICADA) { // aplicada
      return 'green'
    }
    if (tipo == EstatusMezcla.NO_APLICADA) { // No aplicada
      return 'orange'
    }


    return 'blue';
  }

  dialogoResolucion(){

    /*let model = {
      "folioResolucion": "1203202400002",
      "desCentralMezcla": "UMF-UMAA 36 MESA DE OTAY",
      "folioInvestigacion": "wewewewew",
      "cveFolioMezclaDosis": "MO202403110002831301",
      "fechaResolucion": "12 de Marzo del 2024",
      "fechaInvestigacion": "11 de Noviembre del 2024",
      "desCausaAtribuible": "Mal manejo del producto durante trayecto",
      "refObsResolucInvest": "refObsResolucInvestrefObsResolucInvestrefObsResolucInvestrefObsResolucInvestrefObsResolucInvest",
      "desMedidaCorrectiva": "Capacitación de personal para aplicación del PNO(s) específicos"
  }

  this.downloadPDF(model);*/
    
    const dialogRef = this._dialog.open(
      DialogFormlyComponent,
      this._dialogFormlyService.guardarResolucion()
    );

    dialogRef.afterClosed().subscribe(
      async data => {
        //debugger
        if (data) {
          this.aprobarMezcla(data.idCausaAtribuible,data.idMedidaCorrectiva,data.refObsResolucInvest);
        }
      }
    );
}

aprobarMezcla(idCausaAtribuible, idMedidaCorrectiva, refObsResolucInvest) {
    let request =
    {
      "cveUsuarioAlta": this.user.cemetUsuarios[0].id,
      "idSolicitudMezcla": this.dataResolucion.idSolicitudMezcla,
      "idMezcla": this.dataResolucion.idMezcla,
      "idMezclaAplicDiaDosis": this.dataResolucion.idMezclaAplicDiaDosis,
      "idUsuarioResponsable": this.user.cemetUsuarios[0].id,
      "idCausaAtribuible": idCausaAtribuible,
      "idMedidaCorrectiva": idMedidaCorrectiva,
      "refObsResolucInvest": refObsResolucInvest,
      "idInspecCalidadMezcla": this.dataResolucion.idInspecCalidadMezcla,
    }
    this.mezclaService.guardarResolucion(request)
      .then(data => {
        if (data) {
          this._alertServices.success('Se guardó con éxito la resolución con <b>No de folio '+data.folioResolucion+' </b>  .');
          this.downloadPDF(data);
          setTimeout(() => this._router.navigate([this._nav.analistaCalidad]), 10000);
        } else

          this._alertServices.error("<strong>Error</strong> al guardar resolución.");
      });
  }

  async downloadPDF(model) {
    this._spinner.show();
    this._resolucionPDF.createResolucion(model).then((response) => { this._spinner.hide(); });
  }

}
