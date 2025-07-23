import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
const USER_MODULES = 'auth-modules';
const ACTIVE_TAB = 'active-tab';
const USER_URL = 'usuario_url';
const DATA_RESOLUCION = 'data_resolucion';
const DATA_DUPLICAR_SOLICITUD = 'duplicado_solicitud';
const DUPLICAR_SOLICITUD_DATA = 'duplicar_solicitud_data';
const DATA_MEZCLAS_AGREGADAS = 'mezclas-agregadas';
const MODEL_TIPO_MEZCLA =  'modelo_tipo_mezcla';
const PREP_MEZ_TURNO_CAMPANA = 'prep_mez_turno_campana'; 


@Injectable({
  providedIn: 'root',
})
export class SessionStorageService {

  constructor(private storageService: StorageService) { }

  setJsonValue(key: string, value: any) {
    this.storageService.saveData(key, JSON.stringify(value));
  }

  getJsonValue(key: string) {
    return JSON.parse(this.storageService.getData(key));
  }

  clear() {
    return this.storageService.clearData();
  }

  saveToken(token: any) {
    this.storageService.removeData(TOKEN_KEY);
    this.storageService.saveData(TOKEN_KEY, JSON.stringify(token));
  }

  getToken(): any {
    return JSON.parse(this.storageService.getData(TOKEN_KEY));
  }

  saveUser(user: any) {
    this.storageService.removeData(USER_KEY);
    this.storageService.saveData(USER_KEY, JSON.stringify(user));
  }

  getUser():any {
    return JSON.parse(this.storageService.getData(USER_KEY));
  }

  saveModules(modules: any) {
    this.storageService.removeData(USER_MODULES);
    this.storageService.saveData(USER_MODULES, JSON.stringify(modules));
  }

  getModules():any {
    return JSON.parse(this.storageService.getData(USER_MODULES));
  }

  setActiveTab(idTab: any) {
    this.storageService.removeData(ACTIVE_TAB);
    this.storageService.saveData(ACTIVE_TAB, JSON.stringify(idTab));
  }

  getActiveTab():any {
    return JSON.parse(this.storageService.getData(ACTIVE_TAB));
  }

  setLoginUrl(model: any) {
    this.storageService.removeData(USER_URL);
    this.storageService.saveData(USER_URL, JSON.stringify(model));
  }

  getLoginUrl():any {
    return JSON.parse(this.storageService.getData(USER_URL));
  }

  setDataResolucion(model: any) {
    this.storageService.removeData(DATA_RESOLUCION);
    this.storageService.saveData(DATA_RESOLUCION, JSON.stringify(model));
  }

  getDataResolucion():any {
    return JSON.parse(this.storageService.getData(DATA_RESOLUCION));
  }
  
  setDataDuplicadoSolicitud(model: any) {
    this.storageService.removeData(DATA_DUPLICAR_SOLICITUD);
    this.storageService.saveData(DATA_DUPLICAR_SOLICITUD, JSON.stringify(model));
  }

  getDataDuplicadoSolicitud():any {
    return JSON.parse(this.storageService.getData(DATA_DUPLICAR_SOLICITUD));
  }

  setDuplicadoSolicitudData(model: any) {
    this.storageService.removeData(DUPLICAR_SOLICITUD_DATA);
    this.storageService.saveData(DUPLICAR_SOLICITUD_DATA, JSON.stringify(model));
  }

  getDuplicadoSolicitudData():any {
    return JSON.parse(this.storageService.getData(DUPLICAR_SOLICITUD_DATA));
  }

  setDataMezclasAgregadas(model: any) {
    this.storageService.removeData(DATA_MEZCLAS_AGREGADAS);
    this.storageService.saveData(DATA_MEZCLAS_AGREGADAS, JSON.stringify(model));
  }

  getDataMezclasAgregadas():any {
    return JSON.parse(this.storageService.getData(DATA_MEZCLAS_AGREGADAS));
  }

  setModelTipoMezcla(model: any) {
    this.storageService.removeData(MODEL_TIPO_MEZCLA);
    this.storageService.saveData(MODEL_TIPO_MEZCLA, JSON.stringify(model));
  }

  getModelTipoMezcla():any {
    return JSON.parse(this.storageService.getData(MODEL_TIPO_MEZCLA));
  }


   setModelTurnoCampana(model: any) {
    this.storageService.removeData(PREP_MEZ_TURNO_CAMPANA);
    this.storageService.saveData(PREP_MEZ_TURNO_CAMPANA, JSON.stringify(model));
  }

  getModelTurnoCampana():any {
    return JSON.parse(this.storageService.getData(PREP_MEZ_TURNO_CAMPANA));
  }


  


}
