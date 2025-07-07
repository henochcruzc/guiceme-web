import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseHttpClientService } from 'src/app/modules/login/services/baseHttpClient.service';
import { API } from '../config/endpoints';

@Injectable({
  providedIn: 'root'
})
export class MezclasService extends BaseHttpClientService {
  constructor(private http: HttpClient) {
    super();
  }


  getUsuario(refMatricula,nomNombre,nomPaterno,nomMaterno,refCedulaProfesional, idPerfil?:number){
    let queryParams = new HttpParams();
    queryParams = queryParams.append("refMatricula",refMatricula);
    queryParams = queryParams.append("nomNombre",nomNombre);
    queryParams = queryParams.append("nomPaterno",nomPaterno);
    queryParams = queryParams.append("nomMaterno",nomMaterno);
    queryParams = queryParams.append("refCedulaProfesional",refCedulaProfesional);
    if(idPerfil){
      queryParams = queryParams.append("idPerfil",idPerfil);
    }
    
    return this.get(`${API.consultas.usuarioPheds}`, queryParams);
  }

  saveSolicitud(model) {
    return this.post(`${API.consultas.saveSolicitud}`, model);
  }

  getSolicitudesPre(page, size, idEstatusMezcla, idTipoMezcla) {

    let liga1 = idEstatusMezcla ? '&idEstatusMezcla='+idEstatusMezcla+'' : '';
    let liga2 = idTipoMezcla ? '&idTipoMezcla='+idTipoMezcla+'': '';
    
      return this.get(`${API.consultas.getSolicitudesPre}?page=${page}&size=${size}`+liga1+liga2);

  }

  getDetalleMezclaPre(idMezclaAplicDiaDosis) {

    //    return this.get(`${API.consultas.getDetalleMezclaPre}?idMezclaAplicDiaDosis=${idMezclaAplicDiaDosis}&idMezcla=${idMezcla}`);
    return this.get(`${API.consultas.getDetalleMezclaPre}?idMezclaAplicDiaDosis=${idMezclaAplicDiaDosis}`);

  }
  aprobarMezclaPrescripcion(model) {
    return this.post(`${API.consultas.aprobarMezclaPre}`, model);
  }
  rechazarMezclaPrescripcion(model) {
    return this.post(`${API.consultas.rechazarMezclaPre}`, model);
  }

  getDetalleMezclaNTPPre(idMezclaAplicDiaDosis) {
    return this.get(`${API.consultas.getDetalleMezclaPreNtp}?idMezclaAplicDiaDosis=${idMezclaAplicDiaDosis}`);

  }

  getSolicitudesResolucion(queryParams) {
    const options = { params: new HttpParams({ fromObject: queryParams }) };
    //return this.get(`${API.consultas.getSolicitudesResolucion}?`, { params: options});
    return this.http.get<any>(`${API.consultas.getSolicitudesResolucion}?`, options);
  }
  getReporteAprobadasPre() {
    return this.get(`${API.consultas.getReporteAprobadasPre}`);
  }
  getDetalleMezclaCitoPre(idMezclaAplicDiaDosis) {
    return this.get(`${API.consultas.getDetalleMezclaPreCitotoxico}?idMezclaAplicDiaDosis=${idMezclaAplicDiaDosis}`);
  }
  validaTipoMezclaFlag(data: any) {
    return this.post(`${API.consultas.getValidaTipoMezclaFlag}`, data);
  }


  getTurnoCampanalst(queryParams) {

    return this.http.get<any>(`${API.consultas.getTurnoCampana}?`, { params: queryParams });
  }

  getRecetaColectivaMedicamentos(receta) {
    return this.get(`${API.consultas.getRecetaColectivaMedicamentos}?filter=recColectiva/${receta}`);
  }


  getRecetaColectivaLotes(idMedicamento, idReceta) {
    return this.get(`${API.consultas.getRecetaColectivaMedicamentos}?filter=detMedi/true=idMedicamento/${idMedicamento}=idReceta/${idReceta}`);
  }

  validaRecetaColectiva(idMedicamento, idFabricante, idMarca) {
    return this.get(`${API.consultas.validaRecetaColectiva}?filter=valFicha/true=idMedicamento/${idMedicamento}=idMarca/${idMarca}=idFabricante/${idFabricante}`);
  }

  actualizarMedicamentoRecetaColectiva(model) {
    return this.post(`${API.consultas.actualizarMedicamentoRecetaColectiva}`, model);
  }



  registrarRecetaCollectiva(model) {
    return this.post(`${API.consultas.registrarRecetaCollectiva}`, model);
  }

  guardarResolucion(model) {
    return this.post(`${API.consultas.guardarResolucion}`, model);
  }

  updateSolicitud(model) {
    return this.put(`${API.consultas.saveSolicitud}`, model);
  }

  updateFT(model) {
    return this.put(`${API.consultas.updateFT}`, model);
  }

  validaFichaTEcnica(){
    
  }
  getOrdenRecepcionUM(page,size,idTipoMezcla,cveFolioOrdenEntrega){
    let cveFolioOrdenEntregaTrim=cveFolioOrdenEntrega.trim();
    if(idTipoMezcla==null)
    return this.get(`${API.consultas.getOrdenRecepcionUM}?sort=idMezclaAplicDia,desc&cveFolioOrdenEntrega=${cveFolioOrdenEntregaTrim}&size=${size}&page=${page}`);
    else
    return this.get(`${API.consultas.getOrdenRecepcionUM}?idTipoMezcla=${idTipoMezcla}&sort=idMezclaAplicDia,desc&cveFolioOrdenEntrega=${cveFolioOrdenEntregaTrim}&size=${size}&page=${page}`);
    
  }
  

  getLstMedicamentosLotes(idTurnoCampana){
    return this.get(`${API.consultas.getlstMedicamentosTotal}?filter=lisMedTot/true=idTurnoCampana/${idTurnoCampana}`);
  }

  getTurnoCampanaConsulta(idCentralMezcla, idTurno,idCampana, refNomCampana:string) {
    return this.get(`${API.consultas.getlstMedicamentosTotal}?filter=lisMedTot/true=idCentralMezcla/${idCentralMezcla}=idTurno/${idTurno}=idCampana/${idCampana}=refNomCampana/${refNomCampana}`);
  }

  getSolicitudesAcondicionamiento(page, size, idTipoMezcla, folioMezcla) {
    if(idTipoMezcla == null && folioMezcla == null){ 
      return this.get(`${API.consultas.getSolicitudesAcond}?page=${page}&size=${size}`);
    }else if(idTipoMezcla != null && folioMezcla == null){ 
      return this.get(`${API.consultas.getSolicitudesAcond}?page=${page}&size=${size}&idTipoMezcla=${idTipoMezcla}`);
    }else if(idTipoMezcla != null && folioMezcla != null){
      return this.get(`${API.consultas.getSolicitudesAcond}?page=${page}&size=${size}&idTipoMezcla=${idTipoMezcla}&cveFolioMezclaDosis=${folioMezcla}`);
    }else if(idTipoMezcla == null && folioMezcla != null){
      return this.get(`${API.consultas.getSolicitudesAcond}?page=${page}&size=${size}&cveFolioMezclaDosis=${folioMezcla}`);
    }

  }

  getSolicitudesDistribucion(page, size, idTipoMezcla, idUnidadMedica) {
    if(idTipoMezcla == null && idUnidadMedica ==null)
      return this.get(`${API.consultas.getSolicitudesDistribucion}?page=${page}&size=${size}`);
    else
      return this.get(`${API.consultas.getSolicitudesDistribucion}?page=${page}&size=${size}&idTipoMezcla=${idTipoMezcla}&idUnidadMedica=${idUnidadMedica}`);

  }
  guardarProveedor (model) {
    return this.post(`${API.consultas.getAsignarProveedor}`, model);
  }

  obtenerEtiqueta (model) {
    return this.post(`${API.consultas.imprimeEtiqueta}`, model);
  }

  aprobarPreparada(model) {
    return this.post(`${API.consultas.preAprobarPreparada}`, model);
  }

  obtenerOrdenEntrega (model) {
    return this.post(`${API.consultas.imprimeOrden}`, model);
  }

  noAprobarMezcla (model) {
    return this.post(`${API.consultas.noAprobarMezcla}`, model);
    
  }

  cerrarMezcla (model) {
    return this.post(`${API.consultas.validaCerrarMezcla}`, model);
  }
  solicitarReimpresion (model) {
    return this.post(`${API.consultas.validaReimpresion}`, model);
  }

  
  getevalReimEtiqueta(page, size, folioMezcla, motivoReimpresion) {
    let liga1 = folioMezcla ? '&folioMezcla='+folioMezcla+'' : '';
    let liga2 = motivoReimpresion ? '&motivoReimpresion='+motivoReimpresion+'': '';

    return this.get(`${API.consultas.getevalReimEtiqueta}?page=${page}&size=${size}`+liga1+liga2);

  }

  getfechasCad(idLote){
    return this.http.get<any>(`${API.consultas.getFechasCad}?filter=refLote/${idLote}`);
  }


   getDataReporteRecepcionUM(idMezclas){
    return this.get(`${API.reportes.getDataReporteRecepcionUM}?idMezclaAplicDiaDosis=${idMezclas}`);
   }
   getDataReporteOrdenEntrega(idMezclas){
    return this.get(`${API.reportes.getDataReporteOrdenEntrega}?idMezclaAplicDiaDosis=${idMezclas}`);
   }
   confirmarOrdenUM (model) {
    return this.post(`${API.consultas.confirmarOrdenUM}`, model);
  }
  getOrdenStatusRecepcionUM(page,size,idTipoMezcla,cveFolioOrdenEntrega){
 
  
    if(idTipoMezcla==null)                                
        return this.get(`${API.consultas.getOrdenStatusRecepcionUM}?sort=idMezclaAplicDia,desc&cveFolioOrdenEntrega=${cveFolioOrdenEntrega}&size=${size}&page=${page}`);
    else
    return this.get(`${API.consultas.getOrdenStatusRecepcionUM}?idTipoMezcla=${idTipoMezcla}&sort=idMezclaAplicDia,desc&cveFolioOrdenEntrega=${cveFolioOrdenEntrega}&size=${size}&page=${page}`);
  } 
  getValidadNumReimpresion(idMezclaAplicDiaDosis){
    return this.get(`${API.consultas.getValidaNumReimpresion}?idMezclaAplicDiaDosis=${idMezclaAplicDiaDosis}`);
  }

  evalReimEtiqueta(model) {
    return this.post(`${API.consultas.evalReimEtiqueta}`, model);
  }

  saveLotes (model) {
    return this.post(`${API.consultas.saveLotes}`, model);
  }

  asigMezclas (model) {
    return this.post(`${API.consultas.asignacionMezcla}`, model);
  }

  lotesMedicamento(idMedicamento, idCentralMezcla, idTurno, idCampana, refNomCampana){
    return this.get(`${API.consultas.consultaLotesMed}idMedicamento/${idMedicamento}=idCentralMezcla/${idCentralMezcla}=idTurno/${idTurno}=idCampana/${idCampana}=refNomCampana/${refNomCampana}`);
  }

  saveMezclas (model) {
    return this.put(`${API.consultas.saveLotes}`, model);
  }

  consultaMedicamentoSAI(idMedicamento){
    return this.get(`${API.consultas.consultaMedicamentoSAI}?idMedicamento=${idMedicamento}`);
  }

  consultaDelegacion(cvePresupuestal){
    return this.get(`${API.consultas.consultaDelegacion}?cvePresupuestal=${cvePresupuestal}`);
  }
}

