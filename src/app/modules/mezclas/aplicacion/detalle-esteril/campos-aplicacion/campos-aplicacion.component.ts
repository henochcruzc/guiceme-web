import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { GeneralComponent } from 'src/app/modules/general/general.component';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-campos-aplicacion',
  templateUrl: './campos-aplicacion.component.html',
  styleUrls: ['./campos-aplicacion.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,


  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamposAplicacionComponent extends GeneralComponent {
  @Input() model: any;
  @Input() blnCamposBloqueados: any;
  @Input() blnEstatusNoAplicada: boolean;
  @Input() blnLectura: boolean;
  @Input() idEstatus: number;


  formAplicacion = new FormGroup({});
  fieldsAplicacion: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [


        {
          className: "col-lg-3 col-md-5",
          key: 'fechaInicio',
          type: 'material-date',
          templateOptions: {
            label: 'Fecha y hora de inicio',
            range: false,
            placeholder: 'Selecciona una fecha y hora',
            required: true,
            disabled: true
          },
        },
        {
          className: "col-lg-1 col-md-2",

          type: 'lineaAzul',

        },
        {
          className: "col-lg-3 col-md-5",
          key: 'fechaFin',
          type: 'material-date',
          templateOptions: {
            label: 'Fecha y hora de término',
            range: false,
            placeholder: 'Selecciona una fecha y hora',
            required: false,
            disabled: true
          },
        },

      ]
    }

  ];

  miModelo: any;
  blnAplicada = false;
  blnNoAplicada = false;
  ngOnInit() {
    this.miModelo = this.model;


    switch (this.idEstatus) {
      case 11://aplicada
        this.blnAplicada = true;
        break;

      case 12://no aplicada
        this.blnNoAplicada = true;
        break;

      default:
        break;
    }
  }
}
