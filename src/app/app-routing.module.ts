import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { appRoutes } from './shared/config/routes';


@NgModule({
  imports: [RouterModule.forRoot(appRoutes,{ scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
