import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { GeneralComponent } from 'src/app/modules/general/general.component';
import { SessionStorageService } from 'src/app/modules/login/services/session-storage.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { DetalleProgresoComponent } from "../../detalle-progreso/detalle-progreso.component";
import { HeaderDetalleMezclaComponent } from "../../../../shared/layout/header-detalle-mezcla/header-detalle-mezcla.component";
import { CatalogoService } from 'src/app/shared/services/catalogo.service';
import { SeguimientoService } from 'src/app/shared/services/seguimiento.service';
import { FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { NAV } from 'src/app/shared/config/global';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-detalle-npt',
  templateUrl: './detalle-npt.component.html',
  standalone: true,
  styleUrls: ['./detalle-npt.component.scss'],
  imports: [
    CommonModule,
    SharedModule,
    DetalleProgresoComponent,
    HeaderDetalleMezclaComponent
  ]
})
export class DetalleNPTComponent extends GeneralComponent {
  role: any;
  lsComponentes: any;
  componentesTotales: any = 0;

  constructor() {
    super();

  }

  headerData = {
    navAtras: NAV.analistaCalidad,
    uno: [
      {
        class: 'col-lg-3',
        titulo: 'Nombre del paciente',
        texto: ''
      },
      {
          class: 'col-lg-7',
          titulo: 'Folio de la mezcla',
          texto: ''
      },
      {
        class: 'col-lg-2',
        texto: ''
      },

      {
        class: 'col-lg-2',
        texto: ''
      },
      {
          class: 'col-lg-2',
          texto: ''
      },
      {
          class: 'col-lg-2',
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
            titulo: 'CURP',
            texto: '',
          },

        ]

      },

    ]
  }

  model: any = {};
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

  tabsNTP = [];

  displayedColumns: string[] = [
    'medicamento',
    'dosis',
    'unidadMedida'
  ];

  sessionStorageService = inject(SessionStorageService)
  _seguimientoService = inject(SeguimientoService);
  _catalogoService = inject(CatalogoService);
  dataResolucion = this.sessionStorageService.getDataResolucion();
  user = this.sessionStorageService.getUser();

  detalleMezcla: any;
  detalleDiluyente: any;

  ngOnInit(): void {
    console.log('########## usuario ', this.user)
    this.role = this.user.cemetUsuarios[0].idPerfil.id;

    let aux = { ...this.headerData };
    this._seguimientoService.getDatosPaciente(this.dataResolucion.refNss).then(
      resp => {
        aux['uno'][0].texto = resp.nombrePaciente;
        aux['uno'][1].texto = this.dataResolucion.cveFolioMezclaDosis;
        aux['dos'][0].informacion[0].texto = resp.edad;
        aux['dos'][0].informacion[1].texto = resp.sexo;
        aux['dos'][1].informacion[0].texto = resp.nss;
        aux['dos'][1].informacion[1].texto = resp.agregadoMedico;
        aux['dos'][1].informacion[2].texto = resp.refUnidadMedicaHosp;
        aux['dos'][2].informacion[0].texto = resp.curp;
        this.headerData = { ...aux }
      }
    )

    this._catalogoService.getTipoComponente()
    .then(
      (data: any) => {
        if (data) {
          this.lsComponentes = data;
          const compareFn = (a, b) => (a.id < b.id ? -1 : 0);
          let sortArray = data.sort(compareFn);
          for (let index = 0; index < sortArray.length; index++) {
            const element = sortArray[index];
            let dataSource = new MatTableDataSource<any>([]);
            let compData = {
                nombre: sortArray[index].desTipoComponente,
                counter: 0,
                id: sortArray[index].id,
                data: dataSource,
                active: false,
                displayCols: this.displayedColumns,
                original: null
            }
            this.tabsNTP.push(compData)
        }
          console.log(data)
        } 
     },
      
    );

    this._seguimientoService.getDetalleNpt(this.dataResolucion.idMezclaAplicDiaDosis).then(
        resp => {
           
            if (resp) {
                this.model = { ...resp.detalleMezcla };
                this.detalleDiluyente = {...resp.detalleDiluyente}
                this.detalleMezcla = resp.detalleMezcla;
                
                if (resp.componentes) {
                    const compareFn = (a, b) => (a.idComponente < b.idComponente ? -1 : 0);
                    let sortArray = resp.componentes.sort(compareFn);
                    //this.tabsNTP = [];
                    for (let index = 0; index < sortArray.length; index++) {
                      this.componentesTotales = this.componentesTotales + 1; 
                        const element = sortArray[index];
                        let dataSource = new MatTableDataSource<any>(sortArray[index].data);
                        let compData = {
                            nombre: sortArray[index].nombre,
                            counter: sortArray[index].data.length,
                            id: sortArray[index].idComponente,
                            data: dataSource,
                            active: false,
                            displayCols: this.displayedColumns,
                            original: sortArray[index]
                        }

                        
                        this.tabsNTP = this.replaceOrAppend(this.tabsNTP , compData, (a, b) => a.id === b.id);

                        // this.tabsNTP.push(compData)
                    }
                }
            }
        }
    );
  }

  replaceOrAppend(arr, val, compFn) {
    const res = [...arr];
    const i = arr.findIndex(v => compFn(v, val));
    if (i === -1) res.push(val);
    else res.splice(i, 1, val);
    return res;
  };

  shortTable(sort:Sort, tab) {
    console.log("colName " + sort);

    const array = tab.data ;
    let des = sort.direction == 'desc';
    const sortedArray = this.sortArrayOfObjects(array, sort.active, des);    
    //let otherModel = {...this.modelo};
   // otherModel.content = sortedArray;
   // console.log(otherModel)
   tab.data = new MatTableDataSource(sortedArray);
  }

}
