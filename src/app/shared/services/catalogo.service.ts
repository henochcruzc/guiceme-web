import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseHttpClientService } from 'src/app/modules/login/services/baseHttpClient.service';
import { API } from '../config/endpoints';
import { filter, map } from 'rxjs';
import { EstatusMezcla } from '../general.enum';

@Injectable({
  providedIn: 'root'
})
export class CatalogoService extends BaseHttpClientService {
  constructor(private http: HttpClient) {
    super();
  }


  getUnidadesMedicasByCentral(idCentral) {
    /*let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    headers = headers.append('Authorization', 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIzMTEwOTM0MjUiLCJpYXQiOjE3MDE4ODc3NjYsImV4cCI6MTcwMTg5MTM2Nn0.I5f33HMYF4XuF0185Z0W44-K0nFlMTk_qdKhpIZaaeU');*/
    // return this.http.get<any[]>(`${API.catalogos.getUnidadesMedicas}?filter=idCenralMezcla/${idCentral}`,{headers});
    return this.get(`${API.catalogos.getUnidadesMedicas}?filter=idCentralMezcla/${idCentral}`, null);
  }
  getUnidadMedica(idUnidad) {
    /* let headers: HttpHeaders = new HttpHeaders();
     headers = headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
     headers = headers.append('Authorization', 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIzMTEwOTM0MjUiLCJpYXQiOjE3MDE4ODc3NjYsImV4cCI6MTcwMTg5MTM2Nn0.I5f33HMYF4XuF0185Z0W44-K0nFlMTk_qdKhpIZaaeU');
 */
    // return this.http.get<any[]>(`${API.catalogos.getUnidadesMedicas}?filter=idUnidadMedica/${idUnidad}`,{headers});
    return this.get(`${API.catalogos.getUnidadesMedicas}?filter=idUnidadMedica/${idUnidad}`, null);

  }

  // getServiciosEspecialidadByCategoria(idCategoria) {
  //   /* let headers: HttpHeaders = new HttpHeaders();
  //    headers = headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
  //    headers = headers.append('Authorization', 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIzMTEwOTM0MjUiLCJpYXQiOjE3MDE4ODc3NjYsImV4cCI6MTcwMTg5MTM2Nn0.I5f33HMYF4XuF0185Z0W44-K0nFlMTk_qdKhpIZaaeU');

  //      return this.http.get<any[]>(`${API.catalogos.getServiciosEspecialidadByCategoria}?filters=Categoria/${idCategoria}`,{headers});
  //   */
  //   return this.http.get<any[]>(`${API.catalogos.getServiciosEspecialidadByCategoria}?filters=Categoria/${idCategoria}`);
  getServiciosEspecialidadByCategoria(idCategoria) {
    /* let headers: HttpHeaders = new HttpHeaders();
     headers = headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
     headers = headers.append('Authorization', 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIzMTEwOTM0MjUiLCJpYXQiOjE3MDE4ODc3NjYsImV4cCI6MTcwMTg5MTM2Nn0.I5f33HMYF4XuF0185Z0W44-K0nFlMTk_qdKhpIZaaeU');
     
       return this.http.get<any[]>(`${API.catalogos.getServiciosEspecialidadByCategoria}?filters=Categoria/${idCategoria}`,{headers});
    */
    return this.get(`${API.catalogos.getServiciosEspecialidadByCategoria}?filter=categoria/` + idCategoria, null);
  }

  getUMF() {
    return this.http.get<any[]>(`${API.catalogos.getUMF}`);
  }


  getCentralMezcla() {
    return this.http.get<any[]>(`${API.catalogos.getCentralMezcla}`);
  }

  getPerfiles() {
    return this.http.get<any[]>(`${API.catalogos.getPerfiles}`);
  }


  getTipoMezcla() {
    return this.get(`${API.catalogos.getTipoMezcla}`);
  }


  getTiposMezcla() {

    return this.get(`${API.catalogos.getTipoMezcla}`, null);
  }
  getEspecialidades() {

    return this.get(`${API.catalogos.getServiciosEspecialidades}`, null);
  }

  getEspecialidad() {
    return this.http.get<any[]>(`${API.catalogos.getServiciosEspecialidades}`);
  }

  getMedicamentosFT() {
    return this.http.get<any[]>(`${API.catalogos.getMedicamentos}?filter=medFicha/true`);
  }

  getFabricanteByMed(idMedicamento) {
    return this.get(`${API.catalogos.getFabricanteByMed}/${idMedicamento}`);
  }

  getMedicamentos() {

    return this.get(`${API.catalogos.getMedicamentos}`);
  }

  getTipoComponente() {

    return this.get(`${API.catalogos.getTipoComponente}`);
  }

  getMedicamentosFiltro(tipoMezcla) {
    return this.get(`${API.catalogos.getMedicamentosFiltro}?filter=tipoMezcla/${tipoMezcla}`);
  }

  getDiluyentes() {

    return this.get(`${API.catalogos.getDiluyentes}`, null);
  }

  getIntervaloAdmon() {

    return this.get(`${API.catalogos.getIntervaloAdmon}`, null);
  }
  getDiagnosticos() {

    return this.get(`${API.catalogos.getDiagnosticos}`, null);
  }
  getViaAdmon(tipoMezcla) {
    return this.get(`${API.catalogos.getViaAdmon}?filter=TM/${tipoMezcla}`, null);
  }


  getTiempoInfusion() {
    return this.get(`${API.catalogos.getTiempoInfusion}?sort=id,asc`, null);
  }

  getEstatusSolicitud() {
    return this.http.get<any[]>(`${API.catalogos.getEstatusSolicitud}`);
  }

  getUnidadesMedicasByIdCentral(idCentral) {
    return this.http.get<any[]>(`${API.catalogos.getUnidadesMedicas}?filter=idCentralMezcla/${idCentral}`);
  }

  getMotivoRechazo() {
    return this.http.get<any[]>(`${API.catalogos.getMotivoRechazo}/searchFilters?filter=idPerfil/4`);
  }

  getFabricante() {
    return this.get(`${API.catalogos.getfabricante}`);
  }

  getFabricanteFT() {
    return this.http.get<any[]>(`${API.catalogos.getfabricante}`);
  }

  getByRemision(remision) {
    return this.get(`${API.catalogos.getByRemision}/${remision}`);
  }

  getConservacionMedica() {
    return this.http.get<any[]>(`${API.catalogos.getConservacionMedica}`);
  }

  getDiluyente() {
    return this.http.get<any[]>(`${API.catalogos.getDiluyente}`);
  }
  //?filter=valTurno/true=idCentralMezcla/1
  getTurnoCampanas(idCentral) {
    return this.get(`${API.catalogos.getTurnoCampanas}?filter=valTurno/true=idCentralMezcla/${idCentral}`, null);
  }

  getMedicamentoByFilter(idTipoComponente) {
    return this.get(`${API.catalogos.getComponente}?filter=idTipoComponente/${idTipoComponente}`, null);
  }

  getAplicacionCada() {
    return this.get(`${API.catalogos.getAplicacionCada}`, null);
  }
  getEstatusMezcla() {
    return this.http.get<any[]>(`${API.catalogos.getEstatusMezcla}`);
  }

  getReaccionesAdversas() {
    return this.get(`${API.catalogos.getReaccionesAdversas}`,null);
  }

  searchQuery = [
    EstatusMezcla.SOLICITADA,
    EstatusMezcla.NO_APROBADA,
    EstatusMezcla.APROBADA,
    EstatusMezcla.DISPONIBLE,
    EstatusMezcla.APLICADA,
    EstatusMezcla.NO_APLICADA,
    EstatusMezcla.RATIFICADA,
    EstatusMezcla.NO_APROBADA_CANCELADA_SISTEMA,
    EstatusMezcla.CANCELADA,
    EstatusMezcla.RECHAZADA_UNIDAD_MEDICA,
  EstatusMezcla.NO_APROBADA_MESA_ATENCION]
  getEstatusMezclaSeguimiento() {
    return this.http.get<any[]>(`${API.catalogos.getEstatusMezcla}`).pipe(
      map((data) => data.filter(x => this.searchQuery.includes(x.id)))
    );
  }

  getMotivoCancelacion() {
    return this.get(`${API.catalogos.getMotivoCancelacion}`);
  }
  getMarcaByFabricante(idFabricante) {
    return this.get(`${API.catalogos.getMarcaByFabricante}?filter=idFab/${idFabricante}`);
  }

  getMarcaByFabricanteFT(idMedicamento,idFabricante) {
    return this.get(`${API.catalogos.getMarcaByFabricanteFT}=idMedicamento/${idMedicamento}=idFabricante/${idFabricante}`);
  }

  getConservacionMedic() {
    return this.get(`${API.catalogos.getConservacionMedic}`);
  }

  getCausaAtribuible() {
    return this.http.get<any[]>(`${API.catalogos.getCausaAtribuible}`);
  }

  getMedidaCorrectiva() {
    return this.http.get<any[]>(`${API.catalogos.getMedidaCorrectiva}`);
  }

  getTurno() {
    return this.http.get<any[]>(`${API.catalogos.getTurno}`);
  }

  getTurnoCampana(idCentralMezcla, tipoMezcla?) {
    return this.get(`${API.catalogos.getTurnoCampana}?filter=valCam/false=idCentralMezcla/${idCentralMezcla}`);
  }

  getTurnoCampanaPr(idCentralMezcla, tipoMezcla?) {

    let idCentralMezclaF = idCentralMezcla ? '=idCentralMezcla/'+idCentralMezcla+'' : '';
    let tipoMezclaF = tipoMezcla ? '=tipoMezcla/'+tipoMezcla+'': '';
    return this.get(`${API.catalogos.getTurnoCampana}?filter=valCam/false`+ idCentralMezclaF + tipoMezclaF);
  }

  

  getLote(idMedicamento) {
    return this.http.get<any[]>(`${API.catalogos.getLotes}=idMedicamento/${idMedicamento}`);
  }
  getMotivoRechazoRecepcionUM() {
    return this.http.get<any[]>(`${API.catalogos.getMotivoRechazo}/searchFilters?filter=idPerfil/12`);
  }
  getProveedor() {
    //return this.get(`${API.catalogos.getProveedorDistribucion}`, null);
    return this.http.get<any[]>(`${API.catalogos.getProveedorDistribucion}`);
  }

  getMotivoReimpresion() {

    return this.get(`${API.catalogos.getMotivoReimpresion}`, null);
    
  }


  getTurnoCampanaPreparacion(req) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("filter",this.objToQueryParams(req));
    return this.get(`${API.catalogos.getTurnoCampana}`,queryParams);
  }

  getMotivoNoAdminMezcla() {

    return this.get(`${API.catalogos.getMotivoNoAdminMezcla}`, null);
    
  }
  getFichaTecnicaTipoPeriodoValidez(){
    return this.get(`${API.catalogos.getFichaTecnicaTipoPeriodoValidez}`, null);
  }


  getRecomendacionEtiqueta(){
   
    return this.get(`${API.catalogos.getRecomendacionEtiqueta}`, null);
  }
  getRecomendacionEtiquetaV2(){
    
    return this.http.get<any[]>(`${API.catalogos.getRecomendacionEtiqueta}`);
  }
}
