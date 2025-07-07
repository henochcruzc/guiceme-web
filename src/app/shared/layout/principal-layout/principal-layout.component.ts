import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { UserIdleService } from 'angular-user-idle';
import { AccountService } from 'src/app/modules/login/services/account.service';
import { API } from '../../config/endpoints';
import { FooterComponent } from '../footer/footer.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { MatMenuModule } from '@angular/material/menu';
import { TabsComponent } from '../tabs/tabs.component';
import { SessionStorageService } from 'src/app/modules/login/services/session-storage.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AdComponentService } from 'src/app/modules/home/components/componentes.service';
import { NAV } from '../../config/global';
import { GeneralComponent } from 'src/app/modules/general/general.component';
import { DialogComponent } from '../../dialog/dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { MezclasService } from '../../services/mezclas.service';

@Component({
  selector: 'app-principal-layout',
  standalone: true,
    imports: [
        CommonModule,
        FooterComponent,
        RouterModule,
        HeaderComponent,
        MatMenuModule,
        TabsComponent,
        MatIconModule,
    ],
  templateUrl: './principal-layout.component.html',
  styleUrls: ['./principal-layout.component.scss'],
})
export class PrincipalLayoutComponent extends GeneralComponent {
  @ViewChild('tableModalSesion') tableModal: any;
  //_accountService = inject(AccountService);
  modulos: any;

  
  router = inject(Router);
  spinner = inject(NgxSpinnerService);
  componentList = inject(AdComponentService).getComponents();
  sessionStorageService = inject(SessionStorageService)
  activeTab = this.sessionStorageService.getActiveTab();

  loginUrl = this.sessionStorageService.getLoginUrl();
  cargaUrl: boolean = false;

  constructor(
    private userIdle: UserIdleService,
    private mezclasService: MezclasService,    
  ) {
    super();
  }

  name: string;
  role: string;
  ooad: any;
  
  ngOnInit() {
    let usuario = this._accountService.getUser();
    if(usuario == null){
      this.goToLogin();
    }
    //Start watching for user inactivity.
    this.userIdle.startWatching();
    // Start watching when user idle is starting.
    this.userIdle.onTimerStart().subscribe(() => this.openModal());
    // Start watch when time is up.
    this.userIdle.onTimeout().subscribe(() => this.salirSesion());

    //Inicio desde url
    // this.activatedRoute.queryParams.subscribe(params => {
    //   params['token']; 
    //   if (params['token'] != undefined) {
    //     this._sesionStorage.saveToken(params['token']);  
    //     let persona = {
    //         "nomNombreCompleto": params['medico_nombre']+' '+params['medico_apaterno']+' '+params['medico_amaterno'],
    //         "cemetUsuarios": [
    //             {
    //                 "idPerfil": {
    //                     "desPerfil": "Usuario",
    //                 }
    //             }
    //         ],
    //         "cemetModuloPerfiles": [
    //           {
    //               "idModulo": {
    //                   "id": 2,
    //                   "desModulo": "Solicitud de Mezclas CU02",
    //                   "indActivo": false
    //               },
    //               "indActivo": true
    //           }
    //       ]

    //     }
        
    //     this._sesionStorage.saveUser(persona);
    //     this._sesionStorage.setLoginUrl(params);
    //     this._sesionStorage.saveModules(persona.cemetModuloPerfiles);
    //   }
    //   console.log('get de url peths --> ', params)           
    // });

    
    
    
    console.log('##########',usuario)
    this.name = usuario.nomNombreCompleto;
    this.role = usuario.cemetUsuarios[0].idPerfil.desPerfil;
    this.ooad = this.loginUrl == null ? usuario.cemetUsuarios[0].idCentralMezcla.idDelegacion.desDelegacion : this.consultaOoad(this.loginUrl.unidad_cvepresup)//;

    this.modulos = this._accountService.getModulos().filter((mod) => mod.indActivo === true);

    console.log('modulos por sesion ',this.modulos);
    if (this.loginUrl) {
      this.cargaUrl = true
    }
  }

  consultaOoad(cvePresupuestal: any) {
    this.mezclasService.consultaDelegacion(cvePresupuestal).then(
      (data: any) => {
        if (data) {
          this.ooad = data.desDelegacion
        }
      }
    );

  }

  stop() {
    this.userIdle.stopTimer();
  }

  stopWatching() {
    this.userIdle.stopWatching();
  }

  startWatching() {
    this.userIdle.startWatching();
  }

  restart() {
    this.userIdle.resetTimer();
  }

  modalSalirSesion() {

    const inputs = document.querySelectorAll('.ng-dirty');
    let i = 0;
    inputs.forEach(input => {
      const valor = input;
      console.log('Valor del input:', valor);
      i++;
    });

    if (i > 0) {
      const dialogRef = this._dialog.open(
        DialogComponent,
        this._dialogService.modalGenerico('Cerrar sesión','¿Está seguro de cerrar sesión? <br> <b>Se perderá la información capturada.</b>',null,'Aceptar')
      );
  
      dialogRef.afterClosed().subscribe(
        async data => {
          if (data == true) {
              this.salirSesion();
          }
        }
      );
    }else{
      this.salirSesion();
    }

  }

  salirSesion() {
    this._accountService.logout();
    window.parent.location.href = API.login;
    this.stop();
    this.stopWatching();
  }

  closeStopModal() {
    this.tableModal.nativeElement.className = 'modal hide-modal';
    this.stop();
    this.stopWatching();
    this.restart();
    this.startWatching();
  }

  openModal() {
    this.tableModal.nativeElement.className = 'modal show-modal';
  }

  closeModal() {
    this.tableModal.nativeElement.className = 'modal hide-modal';
  }

  navegarB(item , index) {
    this.spinner.show();
    const componente = this.componentList.find((element) => element.id == item) || { url: NAV.noData, id: 0 ,orden:1};
    if (componente) {
        this.router.navigate([componente.url]);
        setTimeout(() => {
            this.spinner.hide();
        }, 2000);
        this.sessionStorageService.setActiveTab({id:componente.id,index:index});
    }
}

findClass(tipo, disabled) {
  
  if (disabled) {
      return tipo+'-disable'
  } else{
      return tipo
  }

}

@ViewChild("menuGral") public mainContentDiv: ElementRef;

}

