import { CommonModule } from '@angular/common';
import { ThisReceiver } from '@angular/compiler';
import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { GeneralComponent } from 'src/app/modules/general/general.component';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-listado-medicamentos',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    MatTableModule, MatSortModule
  ],
  templateUrl: './listado-medicamentos.component.html',
  styleUrls: ['./listado-medicamentos.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListadoMedicamentosComponent extends GeneralComponent {
  @Input() paramsData: any;
  @Input() paramsTitulo: boolean;
  @ViewChild('tSort', { static: true }) sort: MatSort;
  tableDS: MatTableDataSource<any>;
  displayedColumns = ['desCortaMedicamento', 'numDosisMedicamento', 'refUnidadMinMedida']
  blnTitulo: boolean;
  ngOnInit() {

    this.blnTitulo = this.paramsTitulo;
    this.tableDS = new MatTableDataSource(this.paramsData.medicamentos);
   // this.fillListMEd();
   // this.tableDS = new MatTableDataSource(this.lst);

    

    // console.log("Medicamentos: titulo",this.blnTitulo);
    //  console.log("Medicamentos: lst",this.paramsData);
    this.tableDS.sort = this.sort;
  }

  shortTable(sort:Sort) {
    

    const array = this.tableDS.data ;
    let des = sort.direction == 'desc';
    const sortedArray = this.sortArrayOfObjects(array, sort.active, des);    
    //let otherModel = {...this.modelo};
   // otherModel.content = sortedArray;
   // console.log(otherModel)
    this.tableDS = new MatTableDataSource(sortedArray);
  }
lst =[]
  fillListMEd(){
   this.lst =  [
      {
          "idMezclaMedicDiluy": 2,
          "idMedicamento": 1,
          "desCortaMedicamento": "CLOROXIDO FOLINICO",
          "refUnidadMinMedida": "ml",
          "numDosisMedicamento": "7"
      },
      {
        "idMezclaMedicDiluy": 3,
        "idMedicamento": 1,
        "desCortaMedicamento": "ACIDO FOLINICO",
        "refUnidadMinMedida": "mg",
        "numDosisMedicamento": "5"
    }
  ]
  }
}
