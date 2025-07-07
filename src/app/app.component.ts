import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SessionStorageService } from './modules/login/services/session-storage.service';

const DATA_MEZCLAS_AGREGADAS = 'mezclas-agregadas'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'guicntrlmzcl-web';
  previousUrl: string = null;
  currentUrl: string = null;

  
  constructor(
    private _sesionStorage: SessionStorageService
    ,private activatedRoute: ActivatedRoute) {


      this.activatedRoute.queryParams.subscribe(params => {
        
        if (params['token']) {
          this._sesionStorage.saveToken(params['token']);  
          let persona = {
              "nomNombreCompleto": params['medico_nombre']+' '+params['medico_apaterno']+' '+params['medico_amaterno'],
              "cemetUsuarios": [
                  {
                      "idPerfil": {
                          "desPerfil": params['enfermeria_perfil'] ? "Enfermería" : "Médico",
                      },
                      "idCentralMezcla": {
                        "id": 1,
                        "desCentralMezcla": params['unidad_ascripcion_med_desc']
                      }
                  }
              ],
              "cemetModuloPerfiles": [
                {
                    "idModulo": {
                        "id": 2,
                        "desModulo": "Solicitud de Mezclas",
                        "indActivo": false
                    },
                    "indActivo": true
                }
            ]
  
          }
          
          this._sesionStorage.saveUser(persona);
          this._sesionStorage.setLoginUrl(params);
          this._sesionStorage.saveModules(persona.cemetModuloPerfiles);
          this._sesionStorage.setActiveTab({id:2,index:1});
          this._sesionStorage.setDuplicadoSolicitudData(null);
          this._sesionStorage.setDataDuplicadoSolicitud(null);
          this._sesionStorage.setDataMezclasAgregadas(null);
          //localStorage.removeItem(DATA_MEZCLAS_AGREGADAS);
          this._sesionStorage.setModelTipoMezcla(null);
          
        }
        //console.log('get de url peths --> ', params)           
      });

   }

  ngOnInit() {

  }

}
