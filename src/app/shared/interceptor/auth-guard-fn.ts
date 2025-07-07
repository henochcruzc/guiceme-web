import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import { AccountService } from "src/app/modules/login/services/account.service";
import { NAV } from "../config/global";


@Injectable({ providedIn: 'root' })
export class PermissionsService {
    accountService = inject(AccountService)
    isAllowed(permissions: Permission[]) {
        const user = this.accountService.getUser();
       
        if (!user) {
            return inject(Router).parseUrl(NAV.login);
        }

        const rol = this.accountService.getRol();


        if (permissions.length > 0 && !permissions.includes(rol.desPerfil)) {
            return inject(Router).parseUrl(NAV.login);
        }

        return true;
    }
}

export type Permission = 'Administrador General' | 'USER' | 'Médico' ;

export const canMatch = (permissions?: Permission[], permissionService = inject(PermissionsService)) =>   permissionService.isAllowed(permissions);