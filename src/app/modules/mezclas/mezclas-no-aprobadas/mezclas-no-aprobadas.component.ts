import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TituloComponent } from 'src/app/shared/layout/frames/titulo/titulo.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { GeneralComponent } from '../../general/general.component';
import { AuthService } from '../../login/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { MezclasService } from 'src/app/shared/services/mezclas.service';
import { CatalogoService } from 'src/app/shared/services/catalogo.service';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { MatTableDataSource } from '@angular/material/table';
import { reporteMezclasAprobadasModel } from 'src/app/shared/models/reporte.mezclas.aprobadas.model';
import { SelectionModel } from '@angular/cdk/collections';
import * as moment from 'moment';
import { Sort } from '@angular/material/sort';


@Component({
  selector: 'app-mezclas-no-aprobadas',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    TituloComponent,
  ],
  templateUrl: './mezclas-no-aprobadas.component.html',
  styleUrls: ['./mezclas-no-aprobadas.component.scss']
})
export class MezclasNoAprobadasComponent extends GeneralComponent implements OnInit {

  constructor(
    public authService: AuthService,
    public dialog: MatDialog,
    private mezclaService: MezclasService,
    private catalogService: CatalogoService

  ) {
    super();

  }

  public minDate = moment(new Date()).format('YYYY-MM-DD');
  public maxdate = moment(this.minDate, 'YYYY-MM-DD').add(30, 'days').format('YYYY-MM-DD');

  ngOnInit(): void {
    this.getDetalleList(0, this.ConfigTabla.NUM_ELEMENTOS_TABLA, null);
  }

  reporteMezclasAprobadasData: any;
  model: any = {};
  form = new FormGroup({});
  fields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: "col-lg-3 col-md-3",
          key: 'folioMezcla',
          type: 'input',
          props: {
            label: 'Folio de mezcla',
            placeholder: 'Ingresa el folio de la mezcla',
            valueProp: 'id',
            labelProp: 'desTipoMezcla',
            options: [],
          },
        },
        {
          className: "col-lg-3 col-md-3",
          key: 'tipoMezcla',
          type: 'select',
          props: {
            label: 'Tipo de mezcla',
            placeholder: 'Selecciona un tipo de mezcla',
            valueProp: 'id',
            labelProp: 'desTipoMezcla',
            options: [],
          },
          hooks: {
            onInit: async (field) => {

              this.catalogService.getTiposMezcla()
                .then(
                  (data: any) => {
                    if (data) {
                      this.tipoMezcla = data
                      field.props.options = data;
                    } else
                      this._alertServices.error("<strong>Error</strong> al obtener conceptos de Tipos Mezcla");
                  },
                  (_err) => {
                    this._alertServices.error("<strong>Error</strong> al obtener conceptos de Tipos Mezcla");
                  }
                );

            },

          },

        },
        {
          className: "col-lg-3 col-md-3",
          key: 'fechaRechazo',
          type: 'material-date',
          props: {
            label: 'Fechas de rechazo',
            placeholder: 'Selecciona una fecha',
            minDate: this.minDate,
            maxDate: this.maxdate,
            range: true,
          },
        },
        {
          className: "col-lg-1 col-md-6",
          key: 'btn-limpiar',
          type: 'button',
          props: {
            classBtn: 'btn-alinear boton-width',
            btnType: 'danger',
            text: 'Limpiar',
            label: ' ',
            disabled: false,
            onClick: () => {
              this.limpiarCampos();
            },
          },
        },
        {
          className: 'col-lg-1 col-md-12',
          //key:'rfc',
          type: 'button',
          templateOptions: {
            label: ' ',
            text: 'Buscar ',
            onClick: (to, $event) => {
              //this.tipoMezclaDataSource= new MatTableDataSource<any>(MockData.mockTipoMezcla);
              this.buscarMezclas();

            },
            classBtn: 'btn btn-primary btn-sm btn-pro'
          }

        },

      ]
    },



  ];

  limpiarCampos() {
    //limpiamos los campos del formulario
    this.form.reset();
  }


  displayedColumns = ['folioMezcla', 'folioSolicitud', 'tipoMezcla', 'fechaAplicacion', 'check']
  myData;
  tableDS: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);
  tipoMezcla = [
    "Nutrición Parenteral",
    "Antibiótico",
    "Citotóxico"
  ]

  estatus = [
    "Solicitada",
    "No aprobada",
    "Asignada",
    "Aprobada",

  ]
  paginaActual: number = 1;


  pageChanged(event: any) {
    console.log(event)
    const startItem = (event - 1) * this.ConfigTabla.NUM_ELEMENTOS_TABLA;
    const endItem = event * this.ConfigTabla.NUM_ELEMENTOS_TABLA;
    console.log(startItem, endItem, this.myData.slice(startItem, endItem));
    this.tableDS = new MatTableDataSource(this.myData.slice(startItem, endItem));
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

  

  getDetalleList(page, size, idTipoMezcla) {

    const queryParams = {
      'page': page,
      'size': size,
      'idTipoMezcla': this.model.tipoMezcla == undefined? '' : this.model.tipoMezcla 
    }

    this.mezclaService.getTurnoCampanalst(queryParams)
      .subscribe(data => {


        if (data.content.length != 0) {
          this.myData = data.content;


          this.tableDS = new MatTableDataSource(this.myData.slice(page, size));



          //this.totalElements = data.nutricionHistoryList.totalElements
        } else {
          this.tableDS = null
          //this.totalElements = null
        }

      });

  }

  buscarMezclas() {
    if (this.model.tipoMezcla != null)
      this.getDetalleList(0, this.ConfigTabla.NUM_ELEMENTOS_TABLA,  this.model.tipoMezcla);

  }
  limpiar() {
    this.form.reset();
    this.getDetalleList(0, this.ConfigTabla.NUM_ELEMENTOS_TABLA, null);
  }


  async downloadPDF() {
    this._spinner.show();
    this.reporteMezclasAprobadasData = new reporteMezclasAprobadasModel();
    this._reporteMezclasAprobadas.create(null).then((response) => { this._spinner.hide(); });
  }

  selectedItem(event) {
    console.log('data', event);
  }

  shortTable(sort:Sort) {
    console.log("colName " + sort);

    const array = this.tableDS.data ;
    let des = sort.direction == 'desc';
    const sortedArray = this.sortArrayOfObjects(array, sort.active, des);    
    //let otherModel = {...this.modelo};
   // otherModel.content = sortedArray;
   // console.log(otherModel)
    this.tableDS = new MatTableDataSource(sortedArray);
  }
}