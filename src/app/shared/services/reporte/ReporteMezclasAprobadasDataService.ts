import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';

import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import {  reporteMezclasAprobadasModel } from '../../models/reporte.mezclas.aprobadas.model';
import { AccountService } from 'src/app/modules/login/services/account.service';
import { GenericDialogService } from '../../dialog/genericDialog.service';
import { SessionStorageService } from 'src/app/modules/login/services/session-storage.service';
import { MezclasService } from '../mezclas.service';
import { AlertService } from '../../alert';
import { tablaMemoriaModel } from '../../models/tabla.memoria.model';


@Injectable({
  providedIn: 'root'
})

export class ReporteMezclasAprobadasDataService {
 

  public reporteMezclasAprobadasData: reporteMezclasAprobadasModel = null;


  mezclasAprobadasPreDataSource: MatTableDataSource<any>;


  public datosEncabezadoPdf: any

  ZISE_PAGE: number = 50;
  ANCHO = 754.5;
  dataMezclasAprobadasPre: any;

  nomReporte; 'ReporteMedicamentosAprobados';

  constructor(private accountService: AccountService, private activatedRoute: ActivatedRoute, private sessionStorageService: SessionStorageService, 
    private dialog: MatDialog, private dialogService: GenericDialogService, private spinner: NgxSpinnerService,
    private mezclaService: MezclasService, 
    private alertService: AlertService) {

    // this.expediente = this.sessionStorageService.getJsonValue(SessionStorageService.ASUNTO_KEY);

  }

  async getData() {
       this.reporteMezclasAprobadasData = new reporteMezclasAprobadasModel();
   
  //  await this.obtenerEncabezadoInfo();  
    await this.cargListaReportePreAprobadas();
    

    return of(this.reporteMezclasAprobadasData);
  }
  // expedientePadre:boolean=false;

/*
  async obtenerEncabezadoInfo() {
    //1081
    this.demandaService.getEncabezadoMemoriaTecnicaByCveAsunto(this.cveAsunto).toPromise().then(async (data: any) => {
      if (data) {
        //  this.expedientePadre= (data.acumulado != null ? (false) : (true))

        let dataAcumula;
        let etiqueta = ''
        if (data.acumulado == null && data.acumulados == null) {
          etiqueta = "Acumulados";
          dataAcumula = "SIN DATO";
        } else if (data.acumulado != null) {
          etiqueta = "Acumulador";
          dataAcumula = data.acumulado.join(", ");
        } else if (data.acumulados != null) {
          etiqueta = "Acumulados";
          dataAcumula = data.acumulados.join(", ");
        }

        const defaultstr = 'Sin información'
        const modelInfoAux = {
          expediente: '<b>Expediente:</b> ' + ((data.numExpediente.toString() + '').padStart(5, '0').slice(-5) + '/' + data.numAnioExpediente + '-' + data.idJunta.toString()),
          ooad: '<b>OOAD:</b> ' + (data.ooad),
          junta: '<b>Junta:</b> ' + (data.junta),
          accionReclamada: '<b>Acción reclamada:</b> ' + (data.accionReclamada ? data.accionReclamada : defaultstr),
          trascendencia: '<b>Trascendencia:</b> ' + (data.trascendecia ? data.trascendecia : defaultstr),
          importe: '<b>Importe estimado:</b> ' + (data.impEstimado ? this.curremcyPipe.transform(data.impEstimado) : defaultstr),
          fecPresentacion: '<b>Fecha de presentación:</b> ' + (data.fecPresentacion ? this.datePipe.transform(data.fecPresentacion, 'dd/MM/yyyy'): defaultstr),
          fecRecepcion: '<b>Fecha recepción:</b> ' + (data.fecRecepcion ? this.datePipe.transform(data.fecRecepcion, 'dd/MM/yyyy') : defaultstr),
          fecNotificacion: '<b>Fecha notificación:</b> ' + (data.fechaNotificacion ? this.datePipe.transform(data.fechaNotificacion, 'dd/MM/yyyy') : defaultstr),
          fecAsignacion: '<b>Fecha de asignación:</b> ' + (data.fecAsignacionAbogado ? this.datePipe.transform(data.fecAsignacionAbogado, 'dd/MM/yyyy') : defaultstr),
          representate: '<b>Representante del juicio:</b> ' + ((data.representanteJuicioNom ? data.representanteJuicioNom : '') + ' ' + (data.representanteJuicioAPaterno ? data.representanteJuicioAPaterno : '') + ' ' + (data.representanteJuicioAMaterno ? data.representanteJuicioAMaterno : '')),
          abogado: '<b>Abogado:</b> ' + ((data.abogadoRespNom ? data.abogadoRespNom : '') + ' ' + (data.abogadoRespAPaterno ? data.abogadoRespAPaterno : '') + ' ' + (data.abogadoRespAMaterno ? data.abogadoRespAMaterno : '')),
          conflictoInd: '<b>Conflicto individual de seg. social:</b> ' + (data.conflicto == true ? 'Si' : 'No'),
          acumulados: '<b>' +etiqueta +':</b> ' + (dataAcumula ?  dataAcumula : defaultstr),
          estadoProcesal: '<b>Estado procesal:</b> ' + (data.desEstadoProcesal ? data.desEstadoProcesal : defaultstr),
          oficio: '<b>Oficio(s):</b> ' + (data.numOficio ? data.numOficio : defaultstr),
          refNombreArchivoFs: '<b>Notificación de la demanda:</b> ' + (data?.refNombreArchivoFs ? data?.refNombreArchivoFs : defaultstr),//"prueba.pdf"

        }

        this.nomReporte = ((data.numExpediente.toString() + '').padStart(5, '0').slice(-5) + '/' + data.numAnioExpediente + '-' + data.idJunta.toString());
        let tablaEncabezado = new tablaMemoriaModel();


        tablaEncabezado.data = [
          [modelInfoAux.expediente, modelInfoAux.ooad, modelInfoAux.junta, modelInfoAux.accionReclamada],
          [modelInfoAux.trascendencia, modelInfoAux.importe, modelInfoAux.fecPresentacion, modelInfoAux.fecRecepcion],
          [modelInfoAux.fecNotificacion, modelInfoAux.fecAsignacion, modelInfoAux.representate, modelInfoAux.abogado],
          [modelInfoAux.conflictoInd, modelInfoAux.acumulados, modelInfoAux.estadoProcesal, modelInfoAux.oficio],
          [modelInfoAux.refNombreArchivoFs, '', '', '']
        ],

          
        tablaEncabezado.title = "Impresión Expediente";

        const anchoColumna = this.calculaAncho(4);
        tablaEncabezado.columnStyles = {
          0: {
            cellWidth: anchoColumna,
          },
          1: {
            cellWidth: anchoColumna,
          },
          2: {
            cellWidth: anchoColumna,
          },
          3: {
            cellWidth: anchoColumna,
          }
        };


        this.memoriaData.mapTablas.set(Memoria.ENCABEZADO, tablaEncabezado);

      }
    },
      async (_err) => {
        // console.log("error obtenerEncabezadoInfo", _err);
      }
    );
  }*/

  calculaAncho(n) {
    return Math.floor(this.ANCHO / (n));
  }


  async cargListaReportePreAprobadas() {

    await this.mezclaService
      .getReporteAprobadasPre()
      .then(
        (data: any) => {

          this.dataMezclasAprobadasPre = data.reporte
        
          this.reporteMezclasAprobadasData.reponsableSanitario={
            nombreUsusario:data.nombreUsusario,
            puestoUsuario:data.puestoUsuario
          };
          
          if (this.dataMezclasAprobadasPre != undefined && this.dataMezclasAprobadasPre.length > 0) {

            // console.log('data de bitacora ', data);

            this.mezclasAprobadasPreDataSource = new MatTableDataSource(
              this.dataMezclasAprobadasPre
            );

            let tabla = new tablaMemoriaModel();


            tabla.data = this.mezclasAprobadasPreDataSource.data.map(object => [object.consecutivo, object.nombreMedicamento, object.cantidad, object.unidadMedida,object.totalEmbases])
            tabla.header = [['No.', 'Nombre del medicamento', 'Cantidad', 'Unidad de medida','Total de piezas']]
            tabla.title = "";

            const anchoColumna = this.calculaAncho(tabla.header[0].length);
            tabla.columnStyles = {
              0: {
                cellWidth: anchoColumna,
              },
              1: {
                cellWidth: anchoColumna,
              },
              2: {
                cellWidth: anchoColumna,
              },
              3: {
                cellWidth: anchoColumna,
              },
              4: {
                cellWidth: anchoColumna,
              }
            };


            this.reporteMezclasAprobadasData.mapTablas.set(1, tabla);
            

          } else {
            this.mezclasAprobadasPreDataSource= new MatTableDataSource([]);
          }


        },
        (_err) => {
          this.mezclasAprobadasPreDataSource = new MatTableDataSource([]);
        }
      );
  }
  async cargListaReporteRecepcionUM() {

    await this.mezclaService
      .getReporteAprobadasPre()
      .then(
        (data: any) => {

          this.dataMezclasAprobadasPre = data
          if (this.dataMezclasAprobadasPre != undefined && this.dataMezclasAprobadasPre.length > 0) {

            // console.log('data de bitacora ', data);

            this.mezclasAprobadasPreDataSource = new MatTableDataSource(
              this.dataMezclasAprobadasPre
            );

            let tabla = new tablaMemoriaModel();


            tabla.data = this.mezclasAprobadasPreDataSource.data.map(object => [object.consecutivo, object.nombreMedicamento, object.cantidad, object.unidadMedida,object.totalEmbases])
            tabla.header = [['No.', 'Nombre del medicamento', 'Cantidad', 'Unidad de medida','Total de envases']]
            tabla.title = "";

            const anchoColumna = this.calculaAncho(tabla.header[0].length);
            tabla.columnStyles = {
              0: {
                cellWidth: anchoColumna,
              },
              1: {
                cellWidth: anchoColumna,
              },
              2: {
                cellWidth: anchoColumna,
              },
              3: {
                cellWidth: anchoColumna,
              },
              4: {
                cellWidth: anchoColumna,
              }
            };


            this.reporteMezclasAprobadasData.mapTablas.set(1, tabla);

          } else {
            this.mezclasAprobadasPreDataSource= new MatTableDataSource([]);
          }


        },
        (_err) => {
          this.mezclasAprobadasPreDataSource = new MatTableDataSource([]);
        }
      );
  }



}