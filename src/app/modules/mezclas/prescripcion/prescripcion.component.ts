import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { GeneralComponent } from '../../general/general.component';
import { AuthService } from '../../login/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { MezclasService } from 'src/app/shared/services/mezclas.service';
import { CatalogoService } from 'src/app/shared/services/catalogo.service';
import { reporteMezclasAprobadasModel } from 'src/app/shared/models/reporte.mezclas.aprobadas.model';
import { debug } from 'console';
import { ReporteMezclasAprobadasDataService } from 'src/app/shared/services/reporte/ReporteMezclasAprobadasDataService';
import { Router } from '@angular/router';
import { NAV } from 'src/app/shared/config/global';
import { MatSort, Sort } from '@angular/material/sort';

@Component({
    selector: 'app-prescripcion',
    standalone: true,
    imports: [
        CommonModule,
        SharedModule,
    ],
    templateUrl: './prescripcion.component.html',
    styleUrls: ['./prescripcion.component.css'],
})
export class PrescripcionComponent extends GeneralComponent {
   disabled: boolean=true;
    usuario:any;
    reporteMezclasAprobadasData :any;
    model: any = {};
    form = new FormGroup({});
    fields: FormlyFieldConfig[] = [
        {
            fieldGroupClassName: 'row',
            fieldGroup: [
                {
                    className: "col-lg-4 col-md-4",
                    key: 'tipoMezcla',
                    type: 'select',
                    props: {
                        label: 'Tipo de mezcla',
                        placeholder: 'Selecciona un tipo de mezcla',
                        //required: true,
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
                    className: "col-lg-4 col-md-4",
                    key: 'estatus',
                    type: 'select',
                    props: {
                        label: 'Estatus',
                        placeholder: 'Seleccionar un estatus',
                        valueProp: 'id',
                        labelProp: 'desEstatusMezcla',
                        options: [],
                        change:(field, $event) => {
                          //debugger
                          let tipoMezcla = field.form.get('tipoMezcla').value;
                          if(tipoMezcla!=null){
                            field.form.get('buscar').enable();
                            field.form.get('limpiar').enable();
                          }
                         
                        }

                    },
                    hooks: {
                        onInit: async (field) => {
                         
                          this.catalogService.getEstatusMezcla()
                            .subscribe(
                              (data: any) => {
                                if (data) {
                                 
                                  let solicitada=data.find(e => e.desEstatusMezcla == "Solicitada");
                                  let ratificada=data.find(e => e.desEstatusMezcla == "Ratificada");
                                  let  combodata=[];
                                  combodata.push(solicitada);
                                  combodata.push(ratificada);
 
                                  this.estatus = combodata


                                  field.props.options = combodata;
                                } else
                                  this._alertServices.error("<strong>Error</strong> al obtener conceptos de Estatus de Mezcla");
                              },
                              (_err) => {
                                this._alertServices.error("<strong>Error</strong> al obtener conceptos de Estatus de Mezcla");
                              }
                            );
                        
                        },
                     
                       
                      },

                },
                {
                    className: 'col-lg-1 col-md-6',
                    key:'limpiar',
                    type: 'button',
                    templateOptions: {
                      label: ' ',
                      text: 'Limpiar ',
                      disabled:true,
                      onClick: (to, $event) => {
                        //this.tipoMezclaDataSource= new MatTableDataSource<any>(MockData.mockTipoMezcla);

                        this.limpiar();
          
                      },
                      classBtn: 'btn btn-danger'
                    },
                    expressionProperties: {
                        'props.disabled': (model: any) => {
                            if (
                                model.tipoMezcla || model.estatus
                            ) {
                                return false
                            }
                            return true
                        },
                    },
          
                  },
                {
                    className: 'col-lg-1 col-md-6',
                    key:'buscar',
                    type: 'button',
                    templateOptions: {
                      label: ' ',
                      text: 'Buscar ',
                      
                      onClick: (to, $event) => {
                        //this.tipoMezclaDataSource= new MatTableDataSource<any>(MockData.mockTipoMezcla);
                        this.buscarMezclas();
          
                      },
                      classBtn: 'btn btn-primary btn-sm btn-pro'
                    },
                    expressionProperties: {
                        'props.disabled': (model: any) => {
                            if (
                              model.tipoMezcla || model.estatus
                            ) {
                                return false
                            }
                            return true
                        },
                    },
                   
          
                  },





            ]
        },



    ];


    displayedColumns = ['cveFolioMezclaDosis', 'cveFolioSolicitudMezcla', 'desTipoMezcla', 'desEstatusMezcla', 'fechaAplicacion']//, 'check']
    myData;
    @ViewChild('tSort', { static: true }) sort: MatSort;
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
  totalElements: any;
  showReporteAprobadas: boolean;
  solAprobada: boolean;



    ngOnInit(): void {
      //this.disabled=true;
/*
        this.myData = [...Array(500).keys()].map((index) => ({
            folioMezcla: "MA20240208000" + Math.floor(Math.random() * 150) + 1,
            folioSolicitud: "S2024021412" + Math.floor(Math.random() * 7150) + 1,
            tipoMezcla: this.tipoMezcla[Math.floor(Math.random() * 3)],
            estatus: this.estatus[Math.floor(Math.random() * 4)],
            fechaAplicacion: '15/02/2024',

        }))*/
        this.usuario = this._accountService.getUser();
        console.log("usuario",this.usuario)
        //this.existsReporteAprobadas();
        this.getDetalleList(0,10,this.model.estatus,this.model.tipoMezcla);

        this.validaDescargaPdf();
        

        
     
    }

   async existsReporteAprobadas(){
    (await this.reporteMezclasAService.getData()).toPromise().then(
      data => {
        console.log("checando si hay aprobadas");
        if(data!=null)
        this.showReporteAprobadas=true;
        else
        this.showReporteAprobadas=false;

      }
  );
   }
    pageChanged(event: any) {
        /*console.log(event)
        const startItem = (event - 1) * this.ConfigTabla.NUM_ELEMENTOS_TABLA;
        const endItem = event * this.ConfigTabla.NUM_ELEMENTOS_TABLA;
        console.log(startItem, endItem, this.myData.slice(startItem, endItem));
        this.tableDS = new MatTableDataSource(this.myData.slice(startItem, endItem));*/
        this.getDetalleList(event-1,10,this.model.estatus,this.model.tipoMezcla);
        
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
        private catalogService:CatalogoService,
        private reporteMezclasAService: ReporteMezclasAprobadasDataService,
        public router: Router
       
      ) {
        super();
    
      }

      getDetalleList(page, size, idStatusMezcla,idTipoMezcla) {

        this.mezclaService.getSolicitudesPre(page,size,idStatusMezcla,idTipoMezcla)
          .then(data => {
            if (data.content.length != 0 ) {
              this.myData = data.content;
              this.tableDS = new MatTableDataSource(this.myData);
              this.totalElements = data.totalElements
            }else{
              this.tableDS = null
              this.totalElements = null
              this._alertServices.error("<strong>Error</strong> No se encontraron resultados con los criterios de búsqueda ingresados.");
            }
            
          }); 

      }
      
      buscarMezclas(){

        this.paginaActual = 1
        this.pageChanged(1);
        //this.getDetalleList(0,10,this.model.estatus,this.model.tipoMezcla);

      }
      limpiar(){
          this.form.reset();
          this.pageChanged(1);
      }

      
  async downloadPDF() {
    this._spinner.show();
    this.reporteMezclasAprobadasData = new reporteMezclasAprobadasModel();
    this._reporteMezclasAprobadas.create(this.usuario).then((response) => { 
      this.solAprobada = true;
      this._spinner.hide(); 
    });
  }

  redirecciona(modelo: any) {

    let valor = {
        modelo: modelo,
        origen: NAV.prescripcion
    }
    this._sesionStorage.setDataResolucion(valor);
    
    switch (modelo.idTipoMezcla) {
      case 1:
        this.router.navigate([NAV.prescripcionDetalle]);
        break;
      case 2:
        this.router.navigate([NAV.prescripcionDetalleNTP]);
        break;
      case 3:
        this.router.navigate([NAV.prescripcionDetalle]);
        break;
      default:
       console.log('no es tipo mezcla valido')
    }
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

  validaDescargaPdf() {
    //valida que exista una  solcitud pre aprobada para mostrar
    this.mezclaService.getSolicitudesPre(0, 10000, 3, null)
      .then(data => {
        if (data.content.length != 0) {
          const index = data.content.findIndex(element2 => element2.indReporte == null);
          if (index !== -1) {
            this.solAprobada = false;
          } else {
            this.solAprobada = true;
          }
        } else {
          this.solAprobada = true
        }

      });
  }
}
