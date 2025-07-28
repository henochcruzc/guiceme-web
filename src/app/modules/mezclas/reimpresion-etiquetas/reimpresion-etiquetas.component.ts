import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HeaderDetalleMezclaComponent } from 'src/app/shared/layout/header-detalle-mezcla/header-detalle-mezcla.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DetalleProgresoComponent } from '../detalle-progreso/detalle-progreso.component';
import { FormGroup } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { CatalogoService } from 'src/app/shared/services/catalogo.service';
import { MezclasService } from 'src/app/shared/services/mezclas.service';
import { GeneralComponent } from '../../general/general.component';
import { AuthService } from '../../login/services/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { NoMedicamentoComponent } from "../../../shared/layout/no-medicamento/no-medicamento.component";
import { ConfigTabla } from 'src/app/shared/general.enum';
import { DialogFormlyComponent } from 'src/app/shared/dialog-formly/dialog-formly.component';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-reimpresion-etiquetas',
  templateUrl: './reimpresion-etiquetas.component.html',
  styleUrls: ['./reimpresion-etiquetas.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    DetalleProgresoComponent,
    HeaderDetalleMezclaComponent,
    NoMedicamentoComponent
  ]
})
export class ReimpresionEtiquetasComponent extends GeneralComponent {

  totalElements: number = 0;
  listMezclaCat: any;
  usuario = this._accountService.getUser();

  constructor(
    public authService: AuthService,
    public dialog: MatDialog,
    private mezclaService: MezclasService,
    private catalogService: CatalogoService,
    private adapter: DateAdapter<any>,
    public router: Router
  ) {
    super();
  }

  ngOnInit(){
    this.getDetalleList(0, this.ConfigTabla.NUM_ELEMENTOS_TABLA);
  }

  myData;
  tableDS: MatTableDataSource<any>;
  displayedColumns = ['folioMezcla', 'motivoReimpresion', 'desTipoMezcla', 'reimpresion']
  paginaActual: number = 1;

  model: any = {};
  form = new FormGroup({});
  fields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: "col-md-3",
          key: 'folioMezcla',
          type: 'input',
          props: {
            label: 'Folio de la mezcla',
            placeholder: 'Ingresa un folio de mezcla',
            maxLength: 20,
          },
        },
        {
          className: "col-md-5",
          key: 'motivoReimpresion',
          type: 'select',
          props: {
            label: 'Motivo de reimpresión',
            placeholder: 'Selecciona un motivo de reimpresión',
            required: false,
            valueProp: 'id',
            labelProp: 'desMotivoReimpresion',
            options: [],
          },
          hooks: {
            afterViewInit: async (field) => {
              let id = 1;//Obtenerlo del session
              this.catalogService.getMotivoReimpresion()
                .then(
                  (data: any) => {
                    if (data) {
                      this.listMezclaCat = data
                      field.props.options = data;
                    } 
                  },
                  (_err) => {
                    //this._alertServices.error("<strong>Error</strong> al obtener conceptos de Tipos Mezcla");
                  }
                );
              const tipoMezcla = field.form.get('tipoMezcla');
            }
          },

        }, 
        {
          fieldGroupClassName: 'row',
          className: "col-md-4 col-lg-4",
          fieldGroup:
            [{
              className: "col-lg-5 col-md-6 col-xxl-3",
              key: 'btn-limpiar',
              type: 'button',
              props: {
                classBtn: 'btn-alinear widthBtn boton',
                btnType: 'danger',
                text: 'Limpiar',
                label: ' ',
                disabled: false,
                onClick: () => {
                  this.limpiarCampos();
                },
              },
              expressionProperties: {
                'props.disabled': (model: any) => {
                  if (
                    model.motivoReimpresion || model.folioMezcla
                  ) {
                    return false
                  }
                  return true
                },
              },
            }, 
            {
              className: "col-lg-4 col-md-6 col-xxl-3",
              key: 'btn-buscar',
              type: 'button',
              props: {
                classBtn: 'btn-primary widthBtn boton ',
                text: 'Buscar',
                label: ' ',
                disabled: false,
                onClick: () => {
                  this.getDetalleList(0, this.ConfigTabla.NUM_ELEMENTOS_TABLA)
                },
              },
              expressionProperties: {
                'props.disabled': (model: any) => {
                  if (
                    model.motivoReimpresion || model.folioMezcla
                  ) {
                    return false
                  }
                  return true
                },
              },
            },]
        },
      ]
    },
  ];


  limpiarCampos() {
    //limpiamos los campos del formulario
    this.form.reset();
    this.tableDS = null;
    this.totalElements = null;

    this.ngOnInit();
  }

  pageChanged(event: any) {
    this.getDetalleList(event + 1, this.ConfigTabla.NUM_ELEMENTOS_TABLA)
  }


  onSortData(event) {
    // Aquí puedes hacer una llamada HTTP al backend Java para obtener los datos ordenados
    const sortOrder = event.direction; // Obtener la dirección de ordenamiento (ascendente o descendente)
    const sort = event.active + ',' + event.direction; // Obtener la columna por la que se está ordenando

  }

  idTipoMezcla = [
    1,
    2,
    3
  ]

  tipoMezcla = [
    "Nutrición Parenteral",
    "Antibiótico",
    "Citotóxico"
  ]

  getDetalleList(page, size) {

    let folio = this.model.folioMezcla ? this.model.folioMezcla : '';
    let motivo = this.model.motivoReimpresion ? this.model.motivoReimpresion : '';

    this.mezclaService.getevalReimEtiqueta(page,size,folio,motivo)
    .then(data => {
      if (data) {
        this.totalElements = data.totalElements;
        this.tableDS = new MatTableDataSource(data.content);
      }else{
        this.totalElements = 0;
        this.tableDS = null;
        this._alertServices.error("<strong> No se encontraron resultados </strong> con los criterios de búsqueda.");
      }
    });

    

  }

  modelModal: any = {};
  formModal = new FormGroup({});
  fieldsModal: FormlyFieldConfig[] = [
    {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            className:"col-lg-4 col-md-6 alineacion",
            key: 'folioReimpresion',
            type: 'textBold',
            defaultValue:'FOLIO0240208000123',
            wrappers: ['form-field-figma'],
            props: {
              label: 'Folio de reimpresión'
            },
          },
          {
            className:"col-lg-4 col-md-6 alineacion",
            key: 'folioMezcla',
            type: 'textBold',
            defaultValue:'MN20240208000123',
            wrappers: ['form-field-figma'],
            props: {
              label: 'Folio de la mezcla'
            },
          },
          {
            className:"col-lg-4 col-md-6 alineacion",
            key: 'motivoReimpresion',
            type: 'textBold',
            defaultValue:'Error de impresión',
            wrappers: ['form-field-figma'],
            props: {
              label: 'Motivo de reimpresión'
            },
          },
        ]
    },
    {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            className: "col-md-3",
            key: 'indAprobReimpresion',
            type: 'mat-radio',
            wrappers: ['form-field-figma'],
            props: {
                label: '¿Aprueba reimpresión?',
                required: true,
                options: [
                    { value: false, label: 'Sí' },
                    { value: true, label: 'No' },
                ],
            },

            hooks: {

              onInit: async (field) => {
                  const observaciones = field.form.get('indAprobReimpresion');
                  if (observaciones != null) {
                    observaciones.valueChanges.subscribe((x) => {
                      console.log('valor de x ' , x)
                      if (!x) {
                        field.form.get('observaciones').setValue('')
                      } 
                    });
  
                }
  
              },
            },
        },
        ]
    },
    {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            className: "col-12",
            key: 'observaciones',
            type: 'textarea',
            wrappers: ['form-field-figma'],
            props: {
                rows: 5,
                label: 'Observaciones',
                maxLength: 500,
                required: true,
                placeholder: 'Ingresa una observación'
            },          
            expressionProperties: {
              'props.disabled': (model: any) => {
                if (
                  model.indAprobReimpresion
                ) {
                  return false
                }
                return true
              },
            },
        },
        ]
    }
];

  reimprimir(element) {

    this.modelModal = {
      ...this.modelModal,
      folioReimpresion: element.folioReimpresion,
      folioMezcla: element.folioMezcla,
      motivoReimpresion: element.motivoReimpresion,
      idMezclaAplicDiaDosis:  element.idMezAplicDiaDosis,
      idAprobadorReimpresion: this.usuario.cemetUsuarios[0].id,
    }

    
    const dialogRef = this._dialog.open(
        DialogFormlyComponent,
        this._dialogFormlyService.modalFormlyGenericoModelo('Reimpresión de etiqueta','Aceptar', this.fieldsModal, this.modelModal)
      );
  
      dialogRef.afterClosed().subscribe(
        async data => {
          //debugger
          if (data) {
            this.evalReimEtiqueta(data);
          }
        }
      );
  }

  evalReimEtiqueta(data){
    let request =
    {
      "idMezclaAplicDiaDosis": data.idMezclaAplicDiaDosis,
      "indAprobReimpresion": !data.indAprobReimpresion,
      "observaciones": data.observaciones ? data.observaciones  : '',
      "idAprobadorReimpresion": data.idAprobadorReimpresion,
    }
    
    this.mezclaService.evalReimEtiqueta(request)
      .then(data => {
        if (data) {
          
          if (data.indAprobReimpresion) {
            this._alertServices.success("<strong> Se aprobó la reimpresión </strong> de etiqueta con éxito.");
            setTimeout(() =>this.getDetalleList(0, this.ConfigTabla.NUM_ELEMENTOS_TABLA), 4000);
          }else{
            this._alertServices.success("<strong> No fue aprobada </strong> la reimpresión de etiqueta.");
            setTimeout(() =>this.getDetalleList(0, this.ConfigTabla.NUM_ELEMENTOS_TABLA), 4000);
          }
        } 
      });
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
