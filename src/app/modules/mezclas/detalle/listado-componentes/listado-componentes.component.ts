import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, ViewChild } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { GeneralComponent } from 'src/app/modules/general/general.component';
import { CatalogoService } from 'src/app/shared/services/catalogo.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { ListadoMedicamentosComponent } from '../listado-medicamentos/listado-medicamentos.component';

@Component({
  selector: 'app-listado-componentes',
  templateUrl: './listado-componentes.component.html',
  styleUrls: ['./listado-componentes.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    MatTableModule, MatSortModule

  ],
  
})
export class ListadoComponentesComponent extends GeneralComponent {
  @Input() data: any;
  @ViewChild('tSort', { static: true }) sort: MatSort;
  //@ViewChild(MatSort) sort: MatSort;

  _catalogoService = inject(CatalogoService);
  blnDatos: boolean = false;
  tabsNTP = [];
  tableDS: MatTableDataSource<any>;
  displayedColumns = ['medicamento', 'dosis', 'unidadMedida']
  lsComponentes: any;
  lstMedicamentos: any;
  blnTituloMedicamentos: boolean;

  ngOnInit() {
    this.lsComponentes = this.data.lstComponentesTabs;
    this.getTipoComponente();
    
    //this.fill();
    
    this.blnTituloMedicamentos = this.data.blnTitulo;
    this.tableDS = new MatTableDataSource(this.lsComponentes);
    


    for (let tab of this.lsComponentes) {
      tab.tableDS = new MatTableDataSource(tab.data);
      tab.tableDS.sort = this.sort;

    }



  }

  blnMostrar: boolean = false;


  private getMedicamentos(idComponente): [] {
    let lstMedicamentos: any = [];
    for (let componente of this.lsComponentes) {



      if (componente.idComponente == idComponente) {
        lstMedicamentos = componente.data;

      }

    }
    return lstMedicamentos;
  }
  lst = [];
  private getTipoComponente() {
    this._catalogoService.getTipoComponente()
      .then(
        (data: any) => {
          if (data) {
            this.lst = data;
            const compareFn = (a, b) => (a.id < b.id ? -1 : 0);
            let sortArray = data.sort(compareFn);
            for (let index = 0; index < sortArray.length; index++) {
              const element = sortArray[index];
       
              let lstMEd = this.getMedicamentos(element.id);
            
              let compData = {
                nombre: element.desTipoComponente,//sortArray[index].desTipoComponente,
                counter: 0,
                idComponente: element.id,//sortArray[index].id,
                data : new MatTableDataSource(lstMEd),
                length: lstMEd.length,
                active: false,

              }

              compData.data.sort = this.sort;



              this.tabsNTP.push(compData)
            }
            this.lsComponentes = this.tabsNTP;
          //  console.log("tabsNTP: ", this.tabsNTP);
            //this.reasignarMedicamentos();
          }

        },

      );
  }




  a = [];
  fill() {
    this.a = [
      {
        "idComponente": 4,
        "nombre": "Agua",
        "data": [
          {
            "idMezclaMedicDiliy": 846,
            "idComponente": 4,
            "idMedicamento": 157,
            "medicamento": "ketorolaco",
            "dosis": 33,
            "unidadMedida": "mililitros"
          },
          {
            "idMezclaMedicDiliy": 848,
            "idComponente": 4,
            "idMedicamento": 157,
            "medicamento": "LCT",
            "dosis": 39,
            "unidadMedida": "FAJsss"
          },
          {
            "idMezclaMedicDiliy": 845,
            "idComponente": 4,
            "idMedicamento": 157,
            "medicamento": "asasLCT",
            "dosis": 33,
            "unidadMedida": "FAJ"
          },
          {
            "idMezclaMedicDiliy": 847,
            "idComponente": 4,
            "idMedicamento": 157,
            "medicamento": "LCT",
            "dosis": 33,
            "unidadMedida": "FAJ"
          }
        ]
      },
      {
        "idComponente": 4,
        "nombre": "Lípidos",
        "data": [
          {
            "idMezclaMedicDiliy": 846,
            "idComponente": 4,
            "idMedicamento": 157,
            "medicamento": "LCT",
            "dosis": 33,
            "unidadMedida": "FAJ"
          },
          {
            "idMezclaMedicDiliy": 848,
            "idComponente": 4,
            "idMedicamento": 157,
            "medicamento": "LCT",
            "dosis": 33,
            "unidadMedida": "FAJ"
          },
          {
            "idMezclaMedicDiliy": 845,
            "idComponente": 4,
            "idMedicamento": 157,
            "medicamento": "LCT",
            "dosis": 33,
            "unidadMedida": "FAJ"
          },
          {
            "idMezclaMedicDiliy": 847,
            "idComponente": 4,
            "idMedicamento": 157,
            "medicamento": "LCT",
            "dosis": 33,
            "unidadMedida": "FAJ"
          }
        ]
      },
      {
        "idComponente": 4,
        "nombre": "Lípidos",
        "data": [
          {
            "idMezclaMedicDiliy": 846,
            "idComponente": 4,
            "idMedicamento": 157,
            "medicamento": "LCT",
            "dosis": 33,
            "unidadMedida": "FAJ"
          },
          {
            "idMezclaMedicDiliy": 848,
            "idComponente": 4,
            "idMedicamento": 157,
            "medicamento": "LCT",
            "dosis": 33,
            "unidadMedida": "FAJ"
          },
          {
            "idMezclaMedicDiliy": 845,
            "idComponente": 4,
            "idMedicamento": 157,
            "medicamento": "LCT",
            "dosis": 33,
            "unidadMedida": "FAJ"
          },
          {
            "idMezclaMedicDiliy": 847,
            "idComponente": 4,
            "idMedicamento": 157,
            "medicamento": "LCT",
            "dosis": 33,
            "unidadMedida": "FAJ"
          }
        ]
      },
      {
        "idComponente": 4,
        "nombre": "Lípidos",
        "data": [
          {
            "idMezclaMedicDiliy": 846,
            "idComponente": 4,
            "idMedicamento": 157,
            "medicamento": "LCT",
            "dosis": 33,
            "unidadMedida": "FAJ"
          },
          {
            "idMezclaMedicDiliy": 848,
            "idComponente": 4,
            "idMedicamento": 157,
            "medicamento": "LCT",
            "dosis": 33,
            "unidadMedida": "FAJ"
          },
          {
            "idMezclaMedicDiliy": 845,
            "idComponente": 4,
            "idMedicamento": 157,
            "medicamento": "LCT",
            "dosis": 33,
            "unidadMedida": "FAJ"
          },
          {
            "idMezclaMedicDiliy": 847,
            "idComponente": 4,
            "idMedicamento": 157,
            "medicamento": "LCT",
            "dosis": 33,
            "unidadMedida": "FAJ"
          }
        ]
      }
    ]
  }

}
