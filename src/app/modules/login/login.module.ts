import { NgModule } from '@angular/core';
import { LoginMainComponent } from './components/login-main/login-main.component';
import { CommonModule } from '@angular/common';

import { InformacionPrincipalComponent } from './components/informacion-principal/informacion-principal.component';
import { MainComponent } from './components/main/main.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { LoginRoutingModule } from './login-routing.module';
import { FormlyModule } from '@ngx-formly/core';
import { ActualizarComponent } from './components/actualizar/actualizar.component';
import { ActualizarMainComponent } from './components/actualizar-main/actualizar-main.component';

@NgModule({
  declarations: [
    MainComponent,
    LoginMainComponent,
    InformacionPrincipalComponent,
    ActualizarComponent,
    ActualizarMainComponent
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    SharedModule,
    FormlyModule.forChild({}),
    
  ],
  exports:[
    MainComponent,
    LoginMainComponent,
    InformacionPrincipalComponent
  ],
})
export class LoginModule { }
