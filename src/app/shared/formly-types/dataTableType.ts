// datatable.type.ts
import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-datatable',
  template: `
    <mat-table [dataSource]="tableDS" matSortActive="folioMezcla" 
                matSortDirection="asc" matSort (matSortChange)="onSortData($event)"
                class="table-responsive scroll-table w-100">
      <!-- Define your columns here -->
      <ng-container *ngFor="let column of props['columns']; let i = index;">
        <ng-container matColumnDef="{{column.key}}">
          <mat-header-cell *matHeaderCellDef mat-sort-header>{{ column.label }}</mat-header-cell>
          <mat-cell *matCellDef="let element" >{{ element[column.key] }}</mat-cell>
        </ng-container>
      </ng-container>

            <!-- Column for actions (e.g., delete button) -->
        <ng-container matColumnDef="actions">
        <mat-header-cell *matHeaderCellDef >Eliminar</mat-header-cell>
        <mat-cell *matCellDef="let element">
          <button class="btn" (click)="removeRow(element)">
            <img src="../../assets/images/rechazar.svg" class="image-secundario" style="cursor: pointer;" alt="Rechazar" title="rechazar" >
          </button>
        </mat-cell>
      </ng-container>

  <!-- Definir las filas y celdas -->
    <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
      <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>

</mat-table>

<div style="text-align: left; margin-top: 20px;">Total de mezclas por asignar {{this.tableDS?.data?.length}}</div>
  `,
})
export class FormlyFieldDataTable extends FieldType {
    dataSource: any;
    displayedColumns: any;
    tableDS: MatTableDataSource<any>;

    ngAfterViewInit(){

    }

    ngOnInit() {

      this.props['dataObs'].subscribe(data => {
        if (data) {
          this.dataSource = data;
          console.log('data en modal ', data)
          //this.displayedColumns = this.props['columns'].map(column => column.key).concat(['actions']);
          
          this.tableDS = new MatTableDataSource(this.dataSource)
          //this.props['dataObs'].next(this.dataSource);
        }
      })

      this.displayedColumns = this.props['columns'].map(column => column.key).concat(['actions']);
        //this.dataSource = this.props['dataSource'];

        //this.tableDS = new MatTableDataSource(this.props['dataSource']);
      }

      addRow() {
        this.dataSource.push({});
      }
    
      removeRow(row: any) {
        //const index = this.dataSource.findIndex(row);
        console.log('evento eliminar')
        const indiceAEliminar = this.dataSource.findIndex(objeto => objeto.folioMezcla === row.folioMezcla);
        if (indiceAEliminar > -1) {
          this.dataSource.splice(indiceAEliminar, 1);
          //this.dataSource = this.dataSource;
          //this.props['dataObs'].next(this.dataSource);
          this.tableDS = new MatTableDataSource(this.dataSource)
          this.props['dataObs'].next(this.dataSource);
        }

        console.log('dataSource despues de eliminar ', this.dataSource);
      }

      onSortData(event) {
        // Aquí puedes hacer una llamada HTTP al backend Java para obtener los datos ordenados
        const sortOrder = event.direction; // Obtener la dirección de ordenamiento (ascendente o descendente)
        const sort = event.active+','+event.direction; // Obtener la columna por la que se está ordenando
    
      }

}
