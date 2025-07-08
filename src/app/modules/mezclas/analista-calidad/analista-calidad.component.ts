import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralComponent } from '../../general/general.component';
import { AuthService } from '../../login/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { MezclasService } from 'src/app/shared/services/mezclas.service';
import { CatalogoService } from 'src/app/shared/services/catalogo.service';
import { HttpParams } from '@angular/common/http';
import { DateAdapter } from '@angular/material/core';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { NAV } from 'src/app/shared/config/global';

@Component({
  selector: 'app-analista-calidad',
  standalone: true,
  templateUrl: './analista-calidad.component.html',
  styleUrls: ['./analista-calidad.component.scss'],
  imports: [
    CommonModule,
    SharedModule,
  ]
})
export class AnalistaCalidadComponent extends GeneralComponent implements OnInit{

  paginaActual: number = 1;
  //public minDate = moment(new Date()).format('YYYY-MM-DD');
  //public maxdate = moment(this.minDate, 'YYYY-MM-DD').add(30, 'days').format('YYYY-MM-DD');

  model: any = {};
  form = new FormGroup({});
  fields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: "col-lg-3 col-md-6",
          key: 'cveFolioMezclaDosis',
          type: 'input',
          props: {
            label: 'Folio de mezcla',
            placeholder: 'Ingresa el folio de la mezcla',
            //required: true,
          },

        },
        {
          className: "col-lg-3 col-md-6",
          key: 'tipoMezcla',
          type: 'select',
          props: {
            label: 'Tipo de mezcla',
            placeholder: 'Selecciona un tipo de mezcla',
            options: [],
            valueProp: 'id',
            labelProp: 'desTipoMezcla',
          },
          hooks: {
            afterViewInit: async (field) => {
              let id = 1;//Obtenerlo del session
              this.catalogService.getTiposMezcla()
                .then(
                  (data: any) => {
                    if (data) {
                      this.listMezclaCat = data
                      field.props.options = data;
                    } else
                      this._alertServices.error("<strong>Error</strong> al obtener conceptos de Tipos Mezcla");
                  },
                  (_err) => {
                    this._alertServices.error("<strong>Error</strong> al obtener conceptos de Tipos Mezcla");
                  }
                );
              const tipoMezcla = field.form.get('tipoMezcla');
            }
          },
        },
        {
          className: 'col-lg-3 col-md-6',
          key: 'fecRch',
          type: 'material-date',
          templateOptions: {
            label: 'Fechas de rechazo',
            range: true,
            placeholder: 'Seleccione una fecha',
            numDias: 29
            //required: true,
            //minDate: this.minDate,
          },
          hooks: {

          }
        },{
          fieldGroupClassName: 'row',
          className: "col-lg-3 col-md-6",
          fieldGroup:
            [{
              className: "col-6",
              key: 'btn-limpiar',
              type: 'button',
              props: {
                classBtn: 'btn-alinear boton-width btn-danger w-100',
                btnType: 'danger',
                text: 'Limpiar',
                label: ' ',
                disabled: false,
                onClick: () => {
                  this.limpiarCampos();
                },
              },
              expressionProperties: {
                'props.disabled': () => {
                  return this.validaForm();
                },
            },
            },
            {
              className: "col-6",
              key: 'btn-buscar',
              type: 'button',
              props: {
                classBtn: 'btn btn-primary btn-sm btn-pro w-100',
                text: 'Buscar',
                label: ' ',
                disabled: false,
                onClick: () => {
                  this.getDetalleList(0, this.ConfigTabla.NUM_ELEMENTOS_TABLA)
                },
              },
              expressionProperties: {
                'props.disabled': () => {
                  return this.validaForm();
                },
            },
            }]
        },
      ]
    },



  ];

  displayedColumns = ['cveFolioMezclaDosis', 'cveFolioSolicitudMezcla', 'desTipoMezcla', 'desMotivoRechazo', 'fechaRechazo', 'responsableRechazo']
  myData;
  tableDS: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);
  tipoMezcla = [
    "Nutrición Parenteral",
    "Antibiótico",
    "Citotóxico"
  ]
  listMezclaCat: any;
  totalElements: any = 0;
  page: any;
  size: any;

  ngOnInit(): void {

    this.getDetalleList(0, this.ConfigTabla.NUM_ELEMENTOS_TABLA);
    //console.log(this.minDate, '   ', this.maxdate)
  }

  validaForm(): boolean {
    let res: boolean;

   if (this.model.cveFolioMezclaDosis != null && this.model.cveFolioMezclaDosis?.length > 0
      || this.model.fecRch?.endDate != null || this.model.fecRch?.startDate != null
      || this.model.tipoMezcla != null) {

      res = false;
    } else {

      res = true;
    }

    return res;
  }

  pageChanged(event: any) {
    this.getDetalleList(event -1, this.ConfigTabla.NUM_ELEMENTOS_TABLA);
  }


  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.tableDS.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.tableDS.data.forEach(row => this.selection.select(row));
  }

  constructor(
    public authService: AuthService,
    public dialog: MatDialog,
    private mezclaService: MezclasService,
    private catalogService: CatalogoService,
    private adapter: DateAdapter<any>,
    public router: Router,
  ) {
    super();
  }

  getDetalleList(page, size) {
    let sort = 'fechaRechazo,desc'

    this.page = page;
    this.size = size;
    
    const queryParams = {
      'page': this.page,
      'size': this.size,
      'idTipoMezcla': this.model.tipoMezcla == undefined ? '' : this.model.tipoMezcla ,
      'cveFolioMezclaDosis': this.model.cveFolioMezclaDosis == undefined ? '' : this.model.cveFolioMezclaDosis,
      'fechaInicio': this.model.fecRch == undefined || this.model.fecRch== null ? '' :  moment(this.model.fecRch.startDate).format('DD/MM/YYYY'),
      'fechaFin':  this.model.fecRch == undefined   || this.model.fecRch== null ? '' : moment(this.model.fecRch.endDate).format('DD/MM/YYYY'),
      'sort': sort,
    }

    this.mezclaService.getSolicitudesResolucion(queryParams).subscribe(data => {
      console.log(data);

      this.myData = data.content
      if (this.myData.length != 0) {

        this.tableDS = new MatTableDataSource(this.myData);

        this.totalElements = data.totalElements
      } else {
        this.tableDS = null
        this.totalElements = null
        this._alertServices.error('<b>No se encontraron resultados</b> con los criterios de búsqueda.');
      }

    });

  }

  limpiarCampos() {
    //limpiamos los campos del formulario
    this.model = {};
    this.form.reset();
    this.form.controls['fecRch'].value='';
    this.model.fecRch=null;
    //this.form.reset({ fecRch: undefined })
    this.tableDS = null;
    this.totalElements = null;

    this.ngOnInit();
  }


  ngAfterViewInit() {

  }

  redirecciona(modelo: any) {
    
    this._sesionStorage.setDataResolucion(modelo);
    
    switch (modelo.idTipoMezcla) {
      case 1:
        this.router.navigate([NAV.detalleCitotoxicoResolucion]);
        break;
      case 2:
        this.router.navigate([NAV.detalleNPTResolucion]);
        break;
      case 3:
        this.router.navigate([NAV.detalleAntiResolucion]);
        break;
      default:
       console.log('no es tipo mezcla valido')
    }

  }
  

  onSortData(event) {
    // Aquí puedes hacer una llamada HTTP al backend Java para obtener los datos ordenados
    const sortOrder = event.direction; // Obtener la dirección de ordenamiento (ascendente o descendente)
    const sort = event.active+','+event.direction; // Obtener la columna por la que se está ordenando

    this.model.tipoMezcla

    const queryParams = {
      'page': this.page,
      'size': this.size,
      'idTipoMezcla': this.model.tipoMezcla == undefined ? '' : this.model.tipoMezcla ,
      'cveFolioMezclaDosis': this.model.cveFolioMezclaDosis == undefined ? '' : this.model.cveFolioMezclaDosis,
      'fechaInicio': this.model.fecRch == undefined ? '' :  moment(this.model.fecRch.startDate).format('DD/MM/YYYY'),
      'fechaFin':  this.model.fecRch == undefined ? '' : moment(this.model.fecRch.endDate).format('DD/MM/YYYY'),
      'sort':  sort//'id,desc'
    }

    this.mezclaService.getSolicitudesResolucion(queryParams).subscribe(data => {
      console.log(data);

      this.myData = data.content
      if (this.myData.length != 0) {

        this.tableDS = new MatTableDataSource(this.myData);

        this.totalElements = data.totalElements
      } else {
        this.tableDS = null
        this.totalElements = null
        this._alertServices.error('<b>No se encontraron resultados</b> con los criterios de búsqueda.');
      }

    });
  }

}
