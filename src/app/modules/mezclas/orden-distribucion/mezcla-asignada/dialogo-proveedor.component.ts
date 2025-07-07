import { CommonModule } from '@angular/common';
import { Component,Inject, inject  } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { AccountService } from 'src/app/modules/login/services/account.service';
import { CatalogoService } from 'src/app/shared/services/catalogo.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-mezcla-asignada-orden',
  standalone: true,
    imports: [
        CommonModule,
        SharedModule
    ],
  templateUrl: './dialogo-proveedor.component.html',
  styleUrls: ['./dialogo-proveedor.component.scss']
})
export class MezclaAsignadaOrdenComponent {

 constructor(
        private dialogRef: MatDialogRef<MezclaAsignadaOrdenComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.usuario = this._accountService.getUser();
    }

    _catalogService = inject(CatalogoService);
    _accountService = inject(AccountService)

    title: any;
    tableDS: MatTableDataSource<any>;
    displayedColumns = ['cveFolioMezclaDosis', 'desUnidadMedica', 'fechaAplicacion', 'accion'];
    dataTable: any;
    usuario: any = {};
    campanaSelected: any;
    $obsEliminarElemento:any;

    model: any = {};
    form = new FormGroup({});

    modelModal: any = {};
    fieldsModal: FormlyFieldConfig[] = [
        {
          fieldGroupClassName: 'row',
          fieldGroup: [
            {
              className: "col-lg-4 col-md-4",
              key: 'idProveedor',
              type: 'select',
              props: {
                label: 'Proveedor',
                placeholder: 'Selecciona un proveedor',
                required: true,
                valueProp: 'id',
                labelProp: 'refRazonSocialProvDistr',
                options: this._catalogService.getProveedor()
              },
            },
          ]
        },
      ];



  confirmDialog() {
    this.dialogRef.close([true, this.campanaSelected, this.model,this.dataTable]);
  }

  closeDialog() {
    this.dialogRef.close([false]);
  }

  ngOnInit() {
    this.updateDataSource();
  }
  updateDataSource() {
    console.log('dataTable',this.dataTable)
    console.log('tableDS',this.tableDS)
    this.tableDS = new MatTableDataSource(this.dataTable);
  }

  shortTable(sort: Sort) {
    console.log("colName " + sort);
    const array = this.tableDS.data;
    let des = sort.direction == 'desc';
    const sortedArray = this.sortArrayOfObjects(array, sort.active, des);
    this.tableDS = new MatTableDataSource(sortedArray);
  }

  sortArrayOfObjects = <T>(
    data: T[],
    keyToSort: keyof T,
    des: boolean,
) => {


    const compare = (objectA: T, objectB: T) => {
        const valueA = objectA[keyToSort]
        const valueB = objectB[keyToSort]

        if (valueA === valueB) {
            return 0
        }

        if (valueA > valueB) {
            return des === false ? 1 : -1
        } else {
            return des === false ? -1 : 1
        }
    }

    return data.slice().sort(compare)
}

eliminar(element,index) {
  console.log(element,index)
  this.dataTable.splice(index, 1);
  this.$obsEliminarElemento.next(element);
  this.updateDataSource();
}


}
