import { Injectable } from '@angular/core';
import { SessionStorageService } from './session-storage.service';

@Injectable({ providedIn: 'root' })
export class AccountService {

  constructor(
    public sStorage: SessionStorageService
    ) { }

    logout() {
      this.sStorage.clear();
    }

    getUser(){
      return this.sStorage.getUser();
    }

    getRol(){
      return {id:this.sStorage.getUser().cemetUsuarios[0].idPerfil.id,
        desPerfil:this.sStorage.getUser().cemetUsuarios[0].idPerfil.desPerfil}
    }

    getModulos(){
      return this.sStorage.getModules();
    }
}
