import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { GeneralComponent } from 'src/app/modules/general/general.component';
import { DetalleDiluyente } from 'src/app/shared/models/diluyente.model';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-listado-diluyente',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule
  ],
  templateUrl: './listado-diluyente.component.html',
  styleUrls: ['./listado-diluyente.component.scss'],
  
})
export class ListadoDiluyenteComponent extends GeneralComponent {
  @Input() paramsDiluyente: DetalleDiluyente;
  @Input() paramsMezcla: any;
  @Input() showDiluyente: boolean = true;

  blnDatos: boolean = false;
  ngOnInit() {
    
    if (this.paramsDiluyente) {
      this.blnDatos = true;
    }
  }
}
