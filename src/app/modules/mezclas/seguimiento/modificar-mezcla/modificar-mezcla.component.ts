import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { HeaderDetalleMezclaComponent } from "../../../../shared/layout/header-detalle-mezcla/header-detalle-mezcla.component";
import { NAV } from 'src/app/shared/config/global';
import { GeneralComponent } from 'src/app/modules/general/general.component';
import { CatalogoService } from 'src/app/shared/services/catalogo.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { SeguimientoService } from 'src/app/shared/services/seguimiento.service';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { AntibioticoComponent } from "./componentes/antibiotico/antibiotico.component";
import { NutricionComponent } from "./componentes/nutricion/nutricion.component";
import { TipoMezcla } from 'src/app/shared/general.enum';

@Component({
  selector: 'app-modificar-mezcla',
  standalone: true,
  templateUrl: './modificar-mezcla.component.html',
  styleUrls: ['./modificar-mezcla.component.scss'],
  imports: [
    CommonModule,
    SharedModule,
    HeaderDetalleMezclaComponent,
    AntibioticoComponent,
    NutricionComponent
  ]
})
export class ModificarMezclaComponent extends GeneralComponent {



  _seguimientoService = inject(SeguimientoService);
  _catalogoService = inject(CatalogoService)
  elementoSeleccionado: any = this._sesionStorage.getJsonValue('elementoModificarSeguimiento');
  mezclaAntibioticoSelect: any = this._sesionStorage.getJsonValue('mezclaAntibioticoSelect');
  mezclaNutricionSelect: any = this._sesionStorage.getJsonValue('mezclaNutricionSelect');

  headerData = {
    navAtras: NAV.seguimiento,
    uno: [
      {
        class: 'col-lg-3',
        titulo: 'Paciente',
        texto: ''
      },
      {
        class: 'col-lg-7',
        titulo: 'Diagnóstico',
        isDiagnostico: true,
        texto: ''
      },
      {
        class: 'col-lg-2',
        texto: 'Edición de mezcla'
      },
    ],
    dos: [
      {
        class: 'col-lg-3',
        colorClass: 'yellow',
        iconName: 'yellow-h.svg',
        informacion: [
          {
            separador: false,
            titulo: 'Edad',
            texto: '',

          },
          {
            separador: true,
            titulo: 'Sexo',
            texto: '',

          }
        ]

      },
      {
        class: 'col-lg-6',
        colorClass: 'green',
        iconName: 'green-h.svg',
        informacion: [
          {
            separador: false,
            titulo: 'NSS',
            texto: '',
          },
          {
            separador: true,
            titulo: 'A. Médico',
            texto: '',
          },
          {
            separador: true,
            titulo: 'U. de Adscripción',
            texto: '',
          },
        ]

      },
      {
        class: 'col-lg-3',
        colorClass: 'blue',
        iconName: 'info-h.svg',
        informacion: [
          {
            separador: false,
            titulo: 'CURP',
            texto: '',
          },

        ]

      },

    ]
  }

  modelDetalleMezcla: any;
  modelTipoMezcla: any = {};
  formTipoMezcla = new FormGroup({});
  fieldsTipoMezcla: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: "col-lg-4 col-md-6",
          key: 'tipoMezcla',
          type: 'select',
          props: {
            label: 'Tipo de mezcla estéril',
            required: true,
            options: [{ id: this.elementoSeleccionado.idTipoMezcla, desTipoMezcla: this.elementoSeleccionado.tipoMezcla }],
            valueProp: 'id',
            labelProp: 'desTipoMezcla',

          },
        },
        {
          className: "col-lg-8 col-md-6",
          key: 'especialidad',
          type: 'select',
          props: {
            label: 'Especialidad',
            placeholder: 'Selecciona la especialidad',
            options: this._catalogoService.getEspecialidad(),
            valueProp: 'id',
            labelProp: 'desServicioEspecialidad',
            required: true,
          },
        },
        {
          className: "col-lg-2 col-md-6",
          key: 'piso',
          type: 'input-mask',
          props: {
            label: 'Piso',
            placeholder: 'Ingresar el piso',
            required: false,
            appInputMaskType: 'integer',
            maxLength: 2,
            disabled: true
          },
        },
        {
          className: "col-lg-2 col-md-6",
          key: 'numCama',
          type: 'input-mask',
          props: {
            label: 'Cama',
            placeholder: 'Ingresar la cama',
            required: false,
            appInputMaskType: 'integer',
            maxLength: 4,
            disabled: true
          },
        },
        {
          className: "col-lg-2 col-md-6",
          key: 'refPeso',
          type: 'input-mask',

          props: {
            label: 'Peso (kg.)',
            placeholder: '000.0',
            required: true,
            maxLength: 5,
            disabled: true
          },
        },
        {
          className: "col-lg-2 col-md-6",
          key: 'refTalla',
          type: 'input-mask',

          props: {
            label: 'Estatura (m.)',
            placeholder: '0.00',
            required: true,
            maxLength: 4,
            disabled: true
          },
        },
        {
          className: "col-lg-2 col-md-6",
          key: 'refSuperfCorporal',
          type: 'numFloat',

          props: {
            label: 'IMC (kg/m²)',
            placeholder: '----',
            required: true,
            appInputMaskType: 'integer',
            disabled: true
          },
          hooks: {
            
          },
        }
      ]
    }
  ]

  ngOnInit() {
    let aux = { ...this.headerData };
    this._seguimientoService.getDatosPaciente(this._sesionStorage.getLoginUrl().PAC_NSS).then(
      resp => {
        aux['uno'][0].texto = resp.nombrePaciente;
        aux['uno'][1].texto = resp.diagnostico;
        aux['dos'][0].informacion[0].texto = resp.edad;
        aux['dos'][0].informacion[1].texto = resp.sexo;
        aux['dos'][1].informacion[0].texto = resp.nss;
        aux['dos'][1].informacion[1].texto = resp.agregadoMedico;
        aux['dos'][1].informacion[2].texto = resp.desUnidadMedica;
        aux['dos'][2].informacion[0].texto = resp.curp;
        this.headerData = { ...aux }

        this.modelTipoMezcla = { ...this.modelTipoMezcla,          
          refPeso: resp.refPeso,
          refTalla: resp.refTalla,
          refSuperfCorporal: resp.refSuperfCorporal
        }
      }
    )

    if (this.elementoSeleccionado.idTipoMezcla == TipoMezcla.ANTIBIOTICO) {

      this.modelDetalleMezcla = { ...this.mezclaAntibioticoSelect.detalleMezcla };
      this.llenarDetalleMezcla();



    } else if (this.elementoSeleccionado.idTipoMezcla == TipoMezcla.NUTRICION) {

      this.modelDetalleMezcla = { ...this.mezclaNutricionSelect.detalleMezcla };
      this.llenarDetalleMezcla();

    }
  }

  llenarDetalleMezcla() {
    this.modelTipoMezcla = {
      tipoMezcla: this.elementoSeleccionado.idTipoMezcla,
      especialidad: this.modelDetalleMezcla.idServicioEspecialidad,
      piso: this.modelDetalleMezcla.refNombrePiso,
      numCama: this.modelDetalleMezcla.refNombreCama,
      refPeso: this.modelDetalleMezcla.refPeso,
      refTalla: this.modelDetalleMezcla.refTalla,
      refSuperfCorporal: this.modelDetalleMezcla.refSuperfCorporal
    }
  }
  override ngOnDestroy() {
    this._sesionStorage.setJsonValue('elementoModificarSeguimiento', null);
    this._sesionStorage.setJsonValue('mezclaAntibioticoSelect', null);
    this._sesionStorage.setJsonValue('mezclaNutricionSelect', null);


  }

}
