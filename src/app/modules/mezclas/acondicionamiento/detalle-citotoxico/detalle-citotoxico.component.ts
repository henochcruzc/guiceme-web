import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { HeaderDetalleMezclaComponent } from 'src/app/shared/layout/header-detalle-mezcla/header-detalle-mezcla.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DetalleProgresoComponent } from '../../detalle-progreso/detalle-progreso.component';
import { FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { GeneralComponent } from 'src/app/modules/general/general.component';
import { SessionStorageService } from 'src/app/modules/login/services/session-storage.service';
import { NAV } from 'src/app/shared/config/global';
import { CatalogoService } from 'src/app/shared/services/catalogo.service';
import { SeguimientoService } from 'src/app/shared/services/seguimiento.service';
import { AprobarNoAprobarComponent } from "../aprobar-no-aprobar/aprobar-no-aprobar.component";
import { Sort } from '@angular/material/sort';

@Component({
    selector: 'app-detalle-citotoxico',
    templateUrl: './detalle-citotoxico.component.html',
    styleUrls: ['./detalle-citotoxico.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        SharedModule,
        DetalleProgresoComponent,
        HeaderDetalleMezclaComponent,
        AprobarNoAprobarComponent
    ]
})
export class DetalleCitotoxicoComponent extends GeneralComponent {
  role: any;

  constructor() {
      super();
      
  }

  sessionStorageService = inject(SessionStorageService)
  _seguimientoService = inject(SeguimientoService);
  _catalogoService = inject(CatalogoService);
  dataResolucion = this.sessionStorageService.getDataResolucion();
  user = this.sessionStorageService.getUser();

  headerData = {
    navAtras: this.dataResolucion.origen,
    uno: [
        {
            class: 'col-lg-2',
            titulo: 'Folio de mezcla',
            texto: ''
        },
        {
            class: 'col-lg-2',
            titulo: 'Folio de solicitud',
            texto: ''
        },
        {
            class: 'col-lg-6',
            titulo: 'Diagnóstico',
            isDiagnostico: true,
            texto: ''
          },

        {
            class: 'col-lg-2',
            texto: 'Detalle de la mezcla'
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
                    titulo: 'Especialidad',
                    texto: '',
                },
                /*{
                    separador: true,
                    titulo: 'A. Médico',
                    texto: '',
                },*/
                {
                    separador: true,
                    titulo: 'U.M. de Aplicación',
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
                    titulo: 'Piso',
                    texto: '',
                },
                {
                    separador: false,
                    titulo: 'Cama',
                    texto: '',
                  },

            ]

        },

    ]
}

 
  tableDSMed: MatTableDataSource<any>;
  tableDSDil: MatTableDataSource<any>;

  displayedColumnsMed = ['desCortaMedicamento', 'numDosisMedicamento', 'refUnidadMinMedida']

  displayedColumnsDil = ['desCortaDiluyente', 'numDosisDiluyente', 'refUnidadMinMedida']

  ngOnInit(): void {
    console.log('########## usuario ',this.user)
    this.role = this.user.cemetUsuarios[0].idPerfil.id;

    let aux = { ...this.headerData };
    this._seguimientoService.getDatosPaciente(this.dataResolucion.modelo.refNss).then(
        resp => {
            aux['dos'][0].informacion[0].texto = resp.edad;
            aux['dos'][0].informacion[1].texto = resp.sexo;
            aux['dos'][1].informacion[1].texto = resp.refUnidadMedicaHosp;
            aux['uno'][2].texto = resp.diagnostico;
        }
    )

    this._seguimientoService.getDetalleCitotoxico(this.dataResolucion.modelo.idMezclaAplicDiaDosis).then(
      resp => {
          this.model = { ...resp.detalleMezcla };
          this.modelGeneralCitotoxico = { ...resp.generalCitotoxico };

          aux['uno'][0].texto = resp.detalleMezcla.cveFolioMezclaDosis;
          aux['uno'][1].texto = resp.detalleMezcla.cveFolioSolicitudMezcla;;
          //aux['uno'][2].texto = resp.detalleMezcla.desDiagnosticoCie;
          aux['dos'][1].informacion[0].texto = resp.detalleMezcla.desServicioEspecialidad;
          aux['dos'][2].informacion[0].texto = resp.detalleMezcla.refNombrePiso;
          aux['dos'][2].informacion[1].texto = resp.detalleMezcla.refNombreCama;
          this.headerData = { ...aux }

          if (resp.medicamentos) {
              this.tableDSMed = new MatTableDataSource(resp.medicamentos);
          }
          if (resp.diluyentes) {
              this.tableDSDil = new MatTableDataSource(resp.diluyentes);
          }

      }
  );
  }

  model: any = {};
  modelGeneralCitotoxico: any = {};
  form = new FormGroup({});
  fields: FormlyFieldConfig[] = [
      {
          fieldGroupClassName: 'row',
          fieldGroup: [
              {
                  className: "col-lg-4 col-md-6",
                  key: 'cveFolioSolicitudMezcla',
                  type: 'text-inline',
                  props: {
                      label: 'Folio de solicitud'
                  }
              },
              {
                  className: "col-lg-4 col-md-6",
                  key: 'cveFolioMezclaDosis',
                  type: 'text-inline',
                  props: {
                      label: 'Folio mezcla',

                  },

              },
              {
                  className: "col-lg-4 col-md-6",
                  key: 'desTipoMezcla',
                  type: 'text-inline',
                  props: {
                      label: 'Tipo de mezcla',

                  },

              },

          ]
      },
      {
          fieldGroupClassName: 'row',
          fieldGroup: [
              {
                  className: "col-lg-4 col-md-6",
                  key: 'refUnidadMedicaHosp',
                  type: 'text-inline',
                  templateOptions: {
                      label: 'Unidad que prescribe',


                  },

              },
              {
                  className: "col-lg-4 col-md-6",
                  key: 'refUnidadMedicaHosp',
                  type: 'text-inline',
                  props: {
                      label: 'Unidad de solicitud',

                  },

              },

          ]
      },



  ];

      shortTableDil(sort:Sort) {
        console.log("colName " + sort);
    
        const array = this.tableDSDil.data ;
        let des = sort.direction == 'desc';
        const sortedArray = this.sortArrayOfObjects(array, sort.active, des);    
        //let otherModel = {...this.modelo};
       // otherModel.content = sortedArray;
       // console.log(otherModel)
        this.tableDSDil = new MatTableDataSource(sortedArray);
      }

      shortTableMed(sort:Sort) {
        console.log("colName " + sort);
    
        const array = this.tableDSMed.data ;
        let des = sort.direction == 'desc';
        const sortedArray = this.sortArrayOfObjects(array, sort.active, des);    
        //let otherModel = {...this.modelo};
       // otherModel.content = sortedArray;
       // console.log(otherModel)
        this.tableDSMed = new MatTableDataSource(sortedArray);
      }

}
