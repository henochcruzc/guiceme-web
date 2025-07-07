import { CommonModule } from '@angular/common';
import { Component, ViewChild, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { GeneralComponent } from 'src/app/modules/general/general.component';
import { TituloComponent } from 'src/app/shared/layout/frames/titulo/titulo.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SelectionModel } from '@angular/cdk/collections';
import { DetalleAntibioticoComponent } from '../../seguimiento/detalle-antibiotico/detalle-antibiotico.component';
import { MatSort, Sort } from '@angular/material/sort';
import { HttpParams } from '@angular/common/http';
import { MezclasService } from 'src/app/shared/services/mezclas.service';
import { CatalogoService } from 'src/app/shared/services/catalogo.service';
import { Subject, from } from 'rxjs';
import { MatDialogConfig } from '@angular/material/dialog';
import { DialogoTurnoComponent } from './dialogo-turno/dialogo-turno.component';
import { NoMedicamentoComponent } from 'src/app/shared/layout/no-medicamento/no-medicamento.component';

@Component({
  selector: 'app-asignacion-turno',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    TituloComponent,
    NoMedicamentoComponent
  ],
  templateUrl: './asignacion-turno.component.html',
  styleUrls: ['./asignacion-turno.component.scss']
})
export class AsignacionTurnoComponent extends GeneralComponent {

  constructor() {
    super();
    this.usuario = this._accountService.getUser();
  }

  _mezclaService = inject(MezclasService);
  _catalogService = inject(CatalogoService);

  $obsEliminarElemento = new Subject<any>();

  totalElements: any;
  usuario: any;
  idTipoMezclaSelecionado: any
  paginaActual: number = 1;

  tableDS: MatTableDataSource<any>;
  mezclasSeleccionadas = new SelectionModel<any>(true, []);
  displayedColumns = ['cveFolioMezclaDosis', 'cveFolioSolicitudMezcla', 'desTipoMezcla', 'fechaAplicacion', 'check']
  @ViewChild('tSort', { static: true }) sort: MatSort;




  model: any = {};
  form = new FormGroup({});
  fields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: "col-lg-6 col-md-6",
          key: 'tipoMezcla',
          type: 'select',
          props: {
            label: 'Tipo de mezcla',
            placeholder: 'Selecciona un tipo de mezcla',
            required: true,
            valueProp: 'id',
            labelProp: 'desTipoMezcla',
            options: from(this._catalogService.getTiposMezcla()),
          },
        },
        {
          fieldGroupClassName: 'row',
          className: "col-md-3",
          fieldGroup:
            [{
              className: "col-lg-4 col-md-6",
              key: 'btn-limpiar',
              type: 'button',
              props: {
                classBtn: 'btn-alinear boton-width btn-danger',
                btnType: 'danger',
                text: 'Limpiar',
                label: ' ',
                disabled: false,
                onClick: () => {
                  this.limpiar();
                },
              },
              expressionProperties: {
                'props.disabled': () => {
                  return this.form.invalid
                },
              },
            },
            {
              className: "col-lg-4 col-md-6",
              key: 'btn-buscar',
              type: 'button',
              props: {
                classBtn: 'btn btn-primary btn-sm btn-pro',
                text: 'Buscar',
                label: ' ',
                disabled: false,
                onClick: () => {
                  this.buscarMezclas();
                },
              },
              expressionProperties: {
                'props.disabled': () => {
                  return this.form.invalid
                },
              },
            }]
        },

      ]
    },



  ];

  ngOnInit() {
    this.$obsEliminarElemento.subscribe(dato => {
      if (dato != null) {
        this.toggleRow(dato);
      }
    });
  }

  pageChanged(event: any) {
    this.getDetalleList(event);
  }


  asignaCampana() {
    const dialogRef = this._dialog.open(DetalleAntibioticoComponent, { disableClose: true, width: '99%' });
    dialogRef.afterClosed();
  }


  getDetalleList(page) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('page', page - 1);
    queryParams = queryParams.append('size', this.ConfigTabla.NUM_ELEMENTOS_TABLA);
    queryParams = queryParams.append('idTipoMezcla', this.idTipoMezclaSelecionado);
    this._mezclaService.getTurnoCampanalst(queryParams)
      .subscribe(data => {
        if (data.content.length != 0) {
          this.tableDS = new MatTableDataSource(data.content);
          this.totalElements = data.totalElements
          this.seleccionadosPrevios(data.content)
        } else {
          this.mezclasSeleccionadas.clear();
          this.tableDS = null
          this.totalElements = null
        }
      });
  }

  buscarMezclas() {
    this.mezclasSeleccionadas.clear();
    this.paginaActual = 1;
    this.idTipoMezclaSelecionado = this.model.tipoMezcla;
    this.getDetalleList(1);
  }

  limpiar() {
    this.paginaActual = 1;
    this.idTipoMezclaSelecionado = undefined;
    this.mezclasSeleccionadas.clear();
    this.tableDS = new MatTableDataSource([]);
    this.totalElements = 0;
    this.model = { ...{} };
    this.form.reset(this.model);
  }

  shortTable(sort:Sort) {
    console.log("colName " + sort);
    console.log(this.tableDS.data);

    const array = this.tableDS.data ;
    let des = sort.direction == 'desc';
    const sortedArray = this.sortArrayOfObjects(array, sort.active, des);    
    //let otherModel = {...this.modelo};
   // otherModel.content = sortedArray;
   // console.log(otherModel)
    this.tableDS = new MatTableDataSource(sortedArray);
  }




  dialogoAsiganrPro() {
    let usuario = this._accountService.getUser();
    console.log('los seleccionados son --> ', this.mezclasSeleccionadas.selected.length);
    // console.log(this.modelModal)
    // console.log(this.fieldsModal)
    // this.modelModal = {
    //   dataTransfer: this.mezclasSeleccionadas.selected,
    //   tipoMezcla: this.model.tipoMezcla
    // }
    let dialogConfig = new MatDialogConfig();
    dialogConfig.restoreFocus = false;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '900px';
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      title: 'Asignar campana',
      subtitle: "",
      //   cancelTxtBtn: "Cancelar",
      confirmTxtBtn: 'Asignar',
      idCentralMezcla: this.usuario.cemetUsuarios[0].idCentralMezcla.id,
      tipoMezcla: this.idTipoMezclaSelecionado
    }


    const dialogRef = this._dialog.open(
      DialogoTurnoComponent,
      dialogConfig
    );


    dialogRef.componentInstance.dataTable = this.mezclasSeleccionadas.selected;
    dialogRef.componentInstance.$obsEliminarElemento = this.$obsEliminarElemento;

    dialogRef.afterClosed().subscribe(
      async data => {

        if (data[0]) {
          console.log(data);

          let model = {
            "idCentralMezcla": usuario.cemetUsuarios[0].idCentralMezcla.id,
            "idTurno": data[2].turno,
            "idCampana": data[1].id,
            "idTipoMezcla": this.idTipoMezclaSelecionado,
            "refNomCampana": data[1].desCampana,
            "idTurnoCampana":data[1].id,
            "lstMezclas": this.mezclasSeleccionadas.selected.map(s => ({idAplicaDia:s.idMezclaAplicDiaDosis})),
            "cveUsuario": usuario.id
          }
          console.log(model)

          this._mezclaService.asigMezclas(model).then(data => {
            if (data) {
              this._alertServices.success('Las <strong>mezclas</strong> se asignaron con éxito.')
              this.buscarMezclas();
            
            }
          })

        }
      }
    );
  }





  seleccionadosPrevios(items) {
    const itemsToAdd = items.filter((item) => {
      const foundItem = this.mezclasSeleccionadas.selected.find(
        (selectedItem) => selectedItem.idMezclaAplicDiaDosis === item.idMezclaAplicDiaDosis
      );
      if (!foundItem) return;
      this.mezclasSeleccionadas.deselect(foundItem);
      return item;
    });

    itemsToAdd.forEach((element) => {
      this.toggleRow(element);
    });
  }


  toggleRow(row: any) {
    this.mezclasSeleccionadas.toggle(row);
  }


  /** Selección de todos los estatus */
  isAllSelected() {
    const numSelected = this.mezclasSeleccionadas.selected.length;
    const numRows = this.totalElements;
    return numSelected === numRows;
  }

  /** Seleciona todas las filas si no están todas seleccionadas de lo contrario limpia la selección*/
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.mezclasSeleccionadas.clear();
      return;
    }
    this.mezclasSeleccionadas.clear();
    this.loadAllRowsServer();
  }

  loadAllRowsServer() {

    let queryParams = new HttpParams();
    queryParams = queryParams.append('page', 0);
    queryParams = queryParams.append('size', this.totalElements);

    if (this.idTipoMezclaSelecionado) {
      queryParams = queryParams.append('idTipoMezcla', this.idTipoMezclaSelecionado);
    }

    this._mezclaService.getTurnoCampanalst(queryParams)
      .subscribe(data => {
        if (data.content.length != 0) {
          this.mezclasSeleccionadas.select(...data.content);
          this.getDetalleList(1);
        }
      });

  }

}



