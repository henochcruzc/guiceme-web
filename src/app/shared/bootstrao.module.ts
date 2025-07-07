import { NgModule } from '@angular/core';
import { NgbNavModule, NgbPaginationModule, NgbTooltipConfig, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [],
  imports: [

    NgbPaginationModule,
    NgbNavModule, 
    NgbTooltipModule

  ], 
  exports: [
    NgbPaginationModule,
    NgbNavModule,
    NgbTooltipModule
  ],
})
export class BootstrapModule { }
