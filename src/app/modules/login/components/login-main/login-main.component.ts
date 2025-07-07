import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormGroup } from '@angular/forms';
import { GeneralComponent } from 'src/app/modules/general/general.component';
import { AuthService } from '../../services/auth.service';
import { Perfiles, eventoBitacora } from 'src/app/shared/general.enum';
import { AdComponentService } from 'src/app/modules/home/components/componentes.service';
import { NAV } from 'src/app/shared/config/global';

@Component({
  selector: 'app-login-main',
  templateUrl: './login-main.component.html',
  styleUrls: ['./login-main.component.scss']
})
export class LoginMainComponent extends GeneralComponent implements OnInit, OnDestroy {

  eFirmaToken: any;
  private componentList = inject(AdComponentService).getComponents();
  constructor(public router: Router,
    public authService: AuthService
  ) {
    super();
  }

  ngOnInit() {
    this._accountService.logout();
  }

  //Login
  model: any = {};
  form = new FormGroup({});
  fields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: "col-md-12",
          key: 'refMatricula',
          type: 'input-mask',
          props: {
            required: true,
            label: 'Usuario',
            placeholder: "Ingresar matrícula",
            maxLength: 9,
            appInputMaskType: 'integer',
          },
        },

        {
          className: "col-md-12",
          key: 'password',
          type: 'password',
          props: {
            type: 'password',
            label: 'Contraseña',
            placeholder: 'Ingresar contraseña',
            required: true,
            maxLength: 20
          },
        },
        {
          className: 'col-md-12 ',
          type: 'text',
          props: {
            label: '* Campos obligatorios',
          },

        },
        // {
        //   key: 'captcha',
        //   className: 'col-md-12',
        //   type: 'captcha',
        //   props: {
        //     label: '',
        //     required: true
        //   }
        // },

        // {
        //   className: 'col-md-12 d-flex justify-content-end',
        //   type: 'button',
        //   props: {
        //     classBtn: '',
        //     text: 'Ingresar',
        //     onClick: () => {
        //       this.doLogin();
        //     },
        //   },
        //   expressionProperties: {
        //     'props.disabled': (model: any) => {
        //       if (
        //         model.refMatricula
        //         && model.password
        //         && this.form.valid
        //         //&& model.captcha
        //       ) {
        //         return false
        //       }
        //       return true
        //     },
        //   },
        // },

      ]
    }
  ]

  disableLogin() {
    if (
      this.model.refMatricula
      && this.model.password
      && this.form.valid
      //&& model.captcha
    ) {
      return false
    }
    return true
  }

  doLogin() {
    this.authService.login(this.model)
      .then(data => {
        if (data) {
          this._sesionStorage.saveToken(data.token);
          this._sesionStorage.saveUser(data.persona);
          this._sesionStorage.saveModules(data.persona.cemetUsuarios[0].idPerfil.cemetModuloPerfiles);

          //se integra evento bitacora en inicio de sesion 
          let model ={
            "idEvento":eventoBitacora.USUARIO_LOGUEADO_EXITOSAMENTE,
            "cveUsuario":data.persona.cemetUsuarios[0].id,
            "refNombreUsuario":data.persona.nomNombreCompleto,
            "refPerfilUsuario":data.persona.cemetUsuarios[0].idPerfil.desPerfil
          }
          this.authService.eventoBitacora(model)

          this.navegar();
        }
      },(_err) => {
        this._alertServices.error("El sistema no está disponible intente más tarde.");
      });
  }


  

  navegar() {

    if (this._accountService.getUser().indPrimerAcceso != null && this._accountService.getUser().indPrimerAcceso === 1) {
      this.router.navigate([this._nav.login+'/'+this._nav.actualizar]);
    } else {
       //if (this._accountService.getRol().id == Perfiles.ADMINISTRADOIR_GENERAL) {
        const modulos = this._accountService.getModulos().filter((mod) => mod.indActivo === true);

        const componente = this.componentList.find((element) => element.id == modulos[0].idModulo.id) || { url: NAV.noData, id: 0 };
        if (componente) {
          this.router.navigate([componente.url]);
          this._sesionStorage.setActiveTab({ id: componente.id, left: 0, index: 0 });
        }

         //} else {
         //  this.router.navigate([this._nav.solicitud]);
        // }
    }
  }

}
