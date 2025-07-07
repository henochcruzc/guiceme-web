import { Component, inject } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { AccountService } from '../../services/account.service';
import { AlertService } from 'src/app/shared/alert';
import { Router } from '@angular/router';
import { NAV } from 'src/app/shared/config/global';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { Perfiles } from 'src/app/shared/general.enum';
import { AdComponentService } from 'src/app/modules/home/components/componentes.service';
import { SessionStorageService } from '../../services/session-storage.service';
import { AuthService } from '../../services/auth.service';
import { error } from 'console';
import { GenericDialogService } from 'src/app/shared/dialog/genericDialog.service';
import { GeneralComponent } from 'src/app/modules/general/general.component';
import { AppInjectorService } from 'src/app/shared/injector/app-injector.service';

export function fieldMatchValidator(control: AbstractControl) {
    const { password, passwordUpdate } = control.value;

    const passwordUpdateC = control.get('passwordUpdate');

    // avoid displaying the message error when values are empty
    if (!passwordUpdate || !password) {
        return null;
    }

    if (passwordUpdate === password) {
        return null;
    }
    return { 'numero': { message: `Las contraseñas no coinciden` } }
    //return { fieldMatch: { message: '' } };
}
@Component({
    selector: 'app-actualizar-main',
    templateUrl: './actualizar-main.component.html',
    styleUrls: ['./actualizar-main.component.css'],

})
export class ActualizarMainComponent extends GeneralComponent {

    constructor(public router: Router) { super() }

    _componentList = inject(AdComponentService).getComponents();
    _authService = inject(AuthService);

    model: any = {};
    form = new FormGroup({});
    fields: FormlyFieldConfig[] = [
        {
            validators: {
                validation: [
                    { name: 'fieldMatch', options: { errorPath: 'passwordUpdate' } },
                ],
            },
            fieldGroupClassName: 'row',
            fieldGroup: [
                {
                    key: 'idPersona',
                    defaultValue: this._accountService.getUser().id,
                },
                {
                    key: 'idUsuarioRecupBitacora',
                    //defaultValue: this._accountService.getUser().cemetUsuarioBitacoras[0].id,
                },
                /*{
                    className: "col-md-12",
                    key: 'password',
                    type: 'password',
                    props: {
                        type: 'password',
                        label: 'Contraseña actual',
                        placeholder: 'Ingresar contraseña',
                        required: true,

                    },
                },*/

                {
                    className: "col-md-12",
                    key: 'password',
                    type: 'password',
                    props: {
                        type: 'password',
                        label: 'Nueva contraseña',
                        placeholder: 'Ingresar contraseña',
                        required: true,

                    },
                },
                {
                    className: "col-md-12",
                    key: 'passwordUpdate',
                    type: 'password',
                    props: {
                        type: 'password',
                        label: 'Confirmar contraseña',
                        placeholder: 'Ingresar contraseña',
                        required: true,

                    },
                },
                {
                    className: 'col-md-12 ',
                    type: 'text',
                    props: {
                        label: '* Campos obligatorios',
                    },

                },
                /*{
                    className: 'col-md-12 alinear-btn',
                    type: 'button',
                    props: {
                        classBtn: 'btn-basic',
                        text: 'Confirmar',
                        onClick: () => {
                            this.doUpdate();
                        },
                    },
                    expressionProperties: {
                        'props.disabled': (model: any) => {
                            if (
                                model.password
                                && model.passwordUpdate
                                && this.form.valid
                            ) {
                                return false
                            }
                            return true
                        },
                    },
                },*/

            ]
        }
    ];

    doUpdate() {
        let model = {
            idPersona: this.model.idPersona,
            passwordUpdate: this.model.passwordUpdate
        }

        this._authService.actualizar(model).then(
            val => {
                if (val) {
                    this.router.navigate([this._nav.login]);
                    this._alertServices.success('Se ha actualizado la contraseña correctamente.');
                }
            }
        );

    }

    regresarLogin() {
        this.router.navigate([this._nav.login]);
    }

}
