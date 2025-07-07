import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { NAV } from 'src/app/shared/config/global';
import { ActualizarComponent } from '../../modules/login/components/actualizar/actualizar.component';
import { canMatch } from 'src/app/shared/interceptor/auth-guard-fn';


const routes: Routes = [
  { path: '', component: MainComponent },
  { path: NAV.actualizar, canMatch: [() => canMatch([])],component: ActualizarComponent }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule {}
