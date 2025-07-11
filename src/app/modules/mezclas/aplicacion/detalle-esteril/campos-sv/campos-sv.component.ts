import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { GeneralComponent } from 'src/app/modules/general/general.component';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-campos-sv',
  templateUrl: './campos-sv.component.html',
  styleUrls: ['./campos-sv.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,


  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamposSvComponent extends GeneralComponent {
  @Input() model: any;
  @Input() blnCamposBloqueados: boolean;
  @Input() blnModoLectura: boolean;



  blnBloqueaCampos: boolean = true;
  form = new FormGroup({});
  fields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [



        {
          className: "col-lg-2 col-md-4 col-sm-6 mb-3",
          key: 'numPacTenArtSistolica',
          type: 'input-mask',
          props: {
            label: 'Tensión arterial sistólica',
            placeholder: 'Ingresa la TAS',
            appInputMaskType: 'integer',
            required: true,

            disabled: this.blnBloqueaCampos,
            maxLength: 3,
            //   pattern: /^([A-Za-z0-9]*)$/,
            attributes: {
              autocomplete: 'off',
            },
          },
          expressionProperties: {
            'props.disabled': () => {
              if (
                this.model
              ) {

                return true
              }
              return false
            },
          },

        },
        {
          className: "col-lg-2 col-md-4 col-sm-6 mb-3",
          key: 'numPacTenArtDiastolica',
          type: 'input-mask',
          props: {
            label: 'Tensión arterial diastólica',
            placeholder: 'Ingresa la TAD',
            appInputMaskType: 'integer',
            required: true,
            disabled: this.blnBloqueaCampos,
            maxLength: 3,
            attributes: {
              autocomplete: 'off',
            },
          },
          expressionProperties: {
            'props.disabled': (model: any) => {


              return this.blnBloqueaCampos;

            },
          },

        },
        {
          className: "col-lg-2 col-md-4 col-sm-6 mb-3",
          key: 'numPacFrecCardiaca',
          type: 'input-mask',
          props: {
            label: 'Frecuencia cardiaca',
            placeholder: 'Ingresa la FC',
            appInputMaskType: 'integer',
            disabled: this.blnBloqueaCampos,
            required: true,
            maxLength: 3,
            attributes: {
              autocomplete: 'off',
            },
          },
          /*   expressionProperties: {
              'props.disabled': (model: any) => {
                if (this.blnBloqueaCampos) {
                  return true
                } else {
                  return false
                }
  
              },
            }, */

        },

        {
          className: "col-lg-2 col-md-4 col-sm-6 mb-3",
          key: 'numPacFrecRespiratoria',
          type: 'input-mask',
          props: {
            label: 'Frecuencia respiratoria',
            placeholder: 'Ingresa la FR',
            appInputMaskType: 'integer',
            required: true,
            disabled: this.blnBloqueaCampos,
            maxLength: 3,
            attributes: {
              autocomplete: 'off',
            },
          },
          /* expressionProperties: {
            'props.disabled': (model: any) => {
              if (this.blnBloqueaCampos) {
                return true
              } else {
                return false
              }

            },
          }, */

        },
        {
          className: "col-lg-2 col-md-4 col-sm-6 mb-3",
          key: 'numPacTemperatura',
          type: 'numFloat',
          props: {
            label: 'Temperatura',
            placeholder: 'Ingresa la temperatura',
            disabled: this.blnBloqueaCampos,
            required: true,
            maxLength: 5,

            pattern: /^([0-9]{1,2}(.[0-9]{0,2})?)$/,
            attributes: {
              autocomplete: 'off',
            },
          },
          /*  expressionProperties: {
             'props.disabled': (model: any) => {
               if (this.blnBloqueaCampos) {
                 return true
               } else {
                 return false
               }
 
             },
           }, */
          validation: {
            messages: {

              pattern: (error: any, field: FormlyFieldConfig) => `Número decimal: 36.05`,
            }


          },
        },



      ]
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup: [

        {
          className: "col-lg-12 col-md-6",
          key: 'refPacObs',
          type: 'input',
          props: {

            label: 'Observaciones',
            placeholder: 'Ingresa la observación',
            appInputMaskType: 'integer',
            maxLength: 500,
            disabled: this.blnBloqueaCampos,
            attributes: {
              autocomplete: 'off',
            },
          },

          expressionProperties: {
            'props.disabled': (model: any) => {
              if (this.blnBloqueaCampos) {
                return true
              } else {
                return false
              }

            },
          },

        },
      ]
    }



  ];

  ngOnInit() {

  }
}
