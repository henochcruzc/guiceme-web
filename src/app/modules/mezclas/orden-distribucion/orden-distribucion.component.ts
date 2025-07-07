import { CommonModule } from '@angular/common';
import { Component, NgZone, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { GeneralComponent } from '../../general/general.component';
import { SelectionModel } from '@angular/cdk/collections';
import { CatalogoService } from 'src/app/shared/services/catalogo.service';
import { MezclasService } from 'src/app/shared/services/mezclas.service';
import { Subject, from } from 'rxjs';
import { SessionStorageService } from '../../login/services/session-storage.service';
import { EstatusMezcla } from 'src/app/shared/general.enum';
import { NAV } from 'src/app/shared/config/global';
import { DialogFormlyComponent } from 'src/app/shared/dialog-formly/dialog-formly.component';
import { Sort } from '@angular/material/sort';
import { RESOURCES } from "src/app/shared/services/reporte/resources";
import { MatDialogConfig } from '@angular/material/dialog';
import { MezclaAsignadaOrdenComponent } from './mezcla-asignada/dialogo-proveedor.component';


@Component({
    selector: 'app-orden-distribucion',
    templateUrl: './orden-distribucion.component.html',
    standalone: true,
    styleUrls: ['./orden-distribucion.component.scss'],
    imports: [
        CommonModule,
        SharedModule,
    ]
})
export class OrdenDistribucionComponent extends GeneralComponent {
    
    sessionStorageService = inject(SessionStorageService)
    dataResolucion = this.sessionStorageService.getDataResolucion();
    user = this.sessionStorageService.getUser();
    id = this.user.cemetUsuarios[0].idCentralMezcla.id;
    dataReporte:any;
    data: any;
    idsReporte:any;
    tablaProveedoresLst=[];
    folioMezclaRechazadaLst=[];
    tablaAlmacenLst=[]
    tablaObservacionesLst=[]
    tablaOrdenEntregaLst=[]
    foliosPrueba=[];
    imageImss = RESOURCES.base64ILogoIMSS;
    proveedorSeleccionadas = new SelectionModel<any>(true, []);
    $obsEliminarElemento = new Subject<any>();

    observableData = new Subject<any>();//declaracion observable

    constructor(
        private mezclaService: MezclasService,
        private catalogService: CatalogoService,
        private ngZone: NgZone) {
        super();
    }

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
                        required: true,
                        valueProp: 'id',
                        labelProp: 'desTipoMezcla',
                        options: [],
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
                    className: "col-lg-3 col-md-4",
                    key: 'unidadMedica',
                    type: 'select',
                    props: {
                        label: 'Unidad médica',
                        placeholder: 'Seleccionar una unidad',
                        valueProp: 'id',
                        labelProp: 'desUnidadMedica',
                        options: [],//from(this.catalogService.getUnidadesMedicasByCentral(this.id)),
                        required: true
                    },
                    hooks: {
                        afterViewInit: async (field) => {
                            let id = 1;//Obtenerlo del session
                            this.catalogService.getUnidadesMedicasByCentral(this.id)
                                .then(
                                    (data: any) => {
                                        if (data) {
                                            //this.listMezclaCat = data
                                            //field.props.options = data;
                                            this.listUnidades = data.filter( fil => fil.centralMezcla.id === this.id)
                                            field.props.options = data.filter( fil => fil.centralMezcla.id === this.id)
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

                }, , {
                    className: "col-lg-1 col-md-6",
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
                                model.tipoMezcla && model.unidadMedica
                            ) {
                                return false
                            }
                            return true
                        },
                    },
                }, {
                    className: "col-lg-1 col-md-6",
                    key: 'btn-buscar',
                    type: 'button',
                    props: {
                        classBtn: 'btn-primary widthBtn boton',
                        text: 'Buscar',
                        label: ' ',
                        disabled: false,
                        onClick: () => {
                            //this.getDetalleList(0, this.ConfigTabla.NUM_ELEMENTOS_TABLA)
                            this.buscarMezclas();
                        },
                    },
                    expressionProperties: {
                        'props.disabled': (model: any) => {
                            if (
                                model.tipoMezcla && model.unidadMedica
                            ) {
                                return false
                            }
                            return true
                        },
                    },
                }





            ]
        },



    ];


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
                options: this.catalogService.getProveedor()
              },
            },
            /*{
              className: "col-lg-4 col-md-4",
              key: 'idProveedor',
              type: 'select',
              props: {
                label: 'Turno',
                placeholder: 'Selecciona un proveedor',
                required: true,
                valueProp: 'id',
                labelProp: 'desTurno',
                options: this.catalogService.getTurno()
              },
    
            }*/
          ]
        },
        {
          fieldGroupClassName: 'row',
          fieldGroup: [
            {
              className: 'ico-clipboard col-lg-4 col-md-4 section-label etiquetasFormlyIco',
              template: ' ',
            },
            {
              className: 'col-lg-4 col-md-4 section-label etiquetasFormly',
              template: ' Lista de mezclas',
            }
          ]
        },
        {
          fieldGroupClassName: 'row',
          fieldGroup: [
            {
              className: "col-lg-12 col-md-4",
              type: 'datatable',
              props: {
                label: 'Datos de la tabla',
                columns: [
                  { key: 'cveFolioMezclaDosis', label: 'Folios de mezcla' },
                  { key: 'desUnidadMedica', label: 'UM de aplicación'},
                  { key: 'fechaAplicacion', label: 'Fecha de aplicación' },
                ],
                dataObs: this.observableData
              },
              hooks: {
                onInit: field => {
                  this.model.dataTransfer;
                  field.props['dataObs'].subscribe( (value) => {
                    if (value){
                      //console.log('dentro de data ',field.props['dataObs'] )
                      this.model = {
                        ...this.model,
                        dataTransfer: value
                      }
                      }
                    });
                }//oninit 
              } 
            }
          ]
        }
      ];
   


    displayedColumns = ['cveFolioMezclaDosis', 'cveFolioSolicitudMezcla', 'desUnidadMedica', 'fechaAplicacion', 'estatusReimpresion', 'check']
    myData;
    tableDS: MatTableDataSource<any>;
    selection = new SelectionModel<any>(true, []);
    tipoMezcla = [
        "UMF-La raza",
    ]

    // estatus = [
    //     {
    //         descripcion: "En espera"
    //         , id: this.EstatusMezcla.EN_ESPERA
    //     },
    //     {
    //         descripcion: "Aprobada"
    //         , id: this.EstatusMezcla.APROBADA
    //     },
    //     {
    //         descripcion: "Rechazada"
    //         , id: this.EstatusMezcla.RECHAZADA_UNIDAD_MEDICA
    //     }
    //     ,
    //     {
    //         descripcion: " "
    //         , id: null
    //     }

    // ]

    idTipoMezcla = [
        1,
        2,
        3
    ]
    paginaActual: number = 1;
    totalElements: number = 0;
    listMezclaCat: any;
    listUnidades:any;


    ngOnInit(): void {
       this.init()
    }

    init () {
        this.$obsEliminarElemento.subscribe(dato => {
            if (dato != null) {
              this.toggleRow(dato);
            }
          });
    }

    buscarMezclas() {
        
        if (this.model.tipoMezcla != null && this.model.unidadMedica != null) {
            this.getDetalleList(0, 10, this.model.tipoMezcla,this.model.unidadMedica);
            //this.selection.clear();
            this.proveedorSeleccionadas.clear();
        }
            

    }

    pageSize = 0;
    getDetalleList(page, size, idTipoMezcla, idUnidadMedica) {

        this.mezclaService.getSolicitudesDistribucion(page, size, idTipoMezcla, idUnidadMedica)
            .then(data => {
                if (data.content.length != 0) {
                    this.myData = data.content;
                    this.pageSize = data.numberOfElements;
                    this.totalElements = data.totalElements;
                    //this.tableDS = new MatTableDataSource(this.myData.slice(0, this.ConfigTabla.NUM_ELEMENTOS_TABLA));
                    this.tableDS = new MatTableDataSource(data.content);
                    //this.seleccionadosPrevios(data.content)
                } else {
                    this.proveedorSeleccionadas.clear();
                    this.tableDS = null
                    this.totalElements = null
                    this.pageSize = 0
                    this._alertServices.error("<strong> No se encontraron resultados </strong> con los criterios de búsqueda.");
                }

            });
    }

    getDetalleListToggle(page, size, idTipoMezcla, idUnidadMedica) {

        this.mezclaService.getSolicitudesDistribucion(page, size, idTipoMezcla, idUnidadMedica)
            .then(data => {
                if (data.content.length != 0) {
                    this.myData = data.content;
                    this.pageSize = data.numberOfElements;
                    this.totalElements = data.totalElements;
                    //this.tableDS = new MatTableDataSource(this.myData.slice(0, this.ConfigTabla.NUM_ELEMENTOS_TABLA));
                    this.tableDS = new MatTableDataSource(data.content);
                    let finales = data.content.filter(fil => fil.estatusReimpresion.idEstatusReimpresion !== 2)
                    this.seleccionadosPrevios(finales)
                } else {
                    this.proveedorSeleccionadas.clear();
                    this.tableDS = null
                    this.totalElements = null
                    this.pageSize = 0
                    this._alertServices.error("<strong> No se encontraron resultados </strong> con los criterios de búsqueda.");
                }

            });
    }

    seleccionadosPrevios(items) {
        const itemsToAdd = items.filter((item) => {
            const foundItem = this.proveedorSeleccionadas.selected.find(
                (selectedItem) => selectedItem.idMezclaAplicDiaDosis === item.idMezclaAplicDiaDosis
            );
            if (!foundItem) return;
            this.proveedorSeleccionadas.deselect(foundItem);
            return item;
        });

        itemsToAdd.forEach((element) => {
            this.toggleRow(element);
        });
    }

    /*getUnidadbyCental () {
        this.catalogService.getUnidadesMedicasByCentral(this.id).then( data => {
            console.log('data central unidades',data);
            console.log('userss',this.user);
            //id = this.user.cemetUsuarios[0].idCentralMezcla.id;
            let finales = data.filter( fil => fil.centralMezcla.id === this.id)
            console.log('filtrado unidad medica',finales)

        })
    }*/

    pageChanged(event: any) {
        
        if(this.model.tipoMezcla != null && this.model.unidadMedica != null) {
            this.getDetalleListToggle(event-1,10,this.model.tipoMezcla,this.model.unidadMedica);
          }else{
            this.getDetalleListToggle(event-1,10,null,null);
          }
    }


    isAllSelected() {
        
        const numSelected = this.proveedorSeleccionadas.selected.length;
        let numRows = 0;
        this.tableDS.data.forEach(row => {
            //row.estatus.id
            
            //console.log('rowss',row)
            if (row.estatusReimpresion.idEstatusReimpresion != 2 || row.estatusReimpresion.idEstatusReimpresion == null) {
                numRows = numRows + 1;
                //console.log('entro',row)
            }
        });

        if (numSelected === numRows) {
            this.tableDS.data.forEach(row => {
                if (row.estatusReimpresion.idEstatusReimpresion != 2 || row.estatusReimpresion.idEstatusReimpresion == null) {
                    this.selection.select(row);
                }
            });
        }

        return numSelected === numRows;
    }

    masterToggle() { // es toggleAllRows
        
        if (this.isAllSelected()) {
            this.proveedorSeleccionadas.clear();
            return;
          }

          this.isAllSelected() ?
          this.proveedorSeleccionadas.clear() :
          this.tableDS.data.forEach(row => {
              if (row.estatusReimpresion.idEstatusReimpresion != 2 || row.estatusReimpresion.idEstatusReimpresion == null) {
                  //console.log(row);
                  this.proveedorSeleccionadas.select(row)
              }
          });

          this.proveedorSeleccionadas.clear();
          this.loadAllRowsServer();


          
    }

    loadAllRowsServer() {

        



        //console.log('totalelements', this.totalElements)
        this.mezclaService.getSolicitudesDistribucion(0, this.totalElements, this.model.tipoMezcla, this.model.unidadMedica)
            .then(data => {
                if (data.content.length != 0) {
                    let finales = data.content.filter(fil => fil.estatusReimpresion.idEstatusReimpresion !== 2)
                    this.proveedorSeleccionadas.select(...finales);
                    this.getDetalleListToggle(0, 10, this.model.tipoMezcla, this.model.unidadMedica);
                }
            })
    
      }

      toggleRow (row: any){
        this.proveedorSeleccionadas.toggle(row);
      }

    limpiarCampos() {
        //limpiamos los campos del formulario
        this.form.reset();
        //this.tableDS = null;
        //this.totalElements = null;
        
    }

    dialogoAsiganrPro() {
        let usuario = this._accountService.getUser();
        //console.log('sel ', this.proveedorSeleccionadas.selected.length);
        let dialogConfig = new MatDialogConfig();
        dialogConfig.restoreFocus = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = '900px';
        dialogConfig.disableClose = true;
        dialogConfig.data = {
          title: 'Asignar proveedor',
          subtitle: "",
          confirmTxtBtn: 'Asignar',
          idCentralMezcla:  this.id,
          tipoMezcla: this.model.tipoMezcla 
        }
    
    
        const dialogRef = this._dialog.open(
            MezclaAsignadaOrdenComponent,
          dialogConfig
        );
    
    
        dialogRef.componentInstance.dataTable = this.proveedorSeleccionadas.selected;
        dialogRef.componentInstance.$obsEliminarElemento = this.$obsEliminarElemento;
    
        dialogRef.afterClosed().subscribe(
          async data => {

            //console.log('data de modal',data)
    
            if (data[0]) {
              //console.log(data);
              //console.log('data proveedor ',data)
              this.asignarProveedor(data);
    
            }
    
            
          }
        );
      }

   

    

    lstRegistros: any[] = [];
    datosdelReporte: any[] = [];
    asignarProveedor(data) {
        this.lstRegistros = [];
        let num = data[3].length//data.dataTransfer.dataTransfer.length;
        let datos = data[3];
        
        for (let i = 0; i < num; i++) {
            let mezcla =
            {
                "idSolicitudMezcla": datos[i].idSolicitudMezcla,
                "idMezcla": datos[i].idMezcla,
                "idMezclaAplicDia": datos[i].idMezclaAplicDia,
                "idMezclaAplicDiaDosis": datos[i].idMezclaAplicDiaDosis,
                "idInspecCalidadMezcla": datos[i].idInspecCalidadMezcla
            }
            this.lstRegistros.push(mezcla);
        }

        let request = {
            "cveUsuarioAlta": this.user.cemetUsuarios[0].id,
            "idProveedorDistr": data[2].idProveedor,//data.idProveedor,
            "dosisProveedor": this.lstRegistros
        }

        //console.log('request_> enviado a asociar proveedor', request);

        this.mezclaService.guardarProveedor(request)
            .then(async data => {
                if (data) {
                    this.selection.clear();
                    this.observableData.next(null);
                    setTimeout(() => this._alertServices.success("El proveedor fue asignado con éxito"),3000);
                    
                    //console.log('data Para reporte',data)
                    this.datosdelReporte = data;
                    
                    let ids="";
                    //console.log('idantes',)
                    for (let index = 0; index < data.length; index++) {
                        let element = data[index].idMezclaAplicDiaDosis;
                        ids=ids+element+",";
                      }
                      //console.log('idas',ids)
                     this.getDetalleList(0, 10, this.model.tipoMezcla,this.model.unidadMedica);
                     this.proveedorSeleccionadas.clear();
                    
                    this.mezclaService.getDataReporteOrdenEntrega(ids)
                        .then(async data => {
                            //console.log('dataReporteaw', data);
                            if (data != null && data.length > 0) {
                                this.data = data;//asignar data
                                //******************************* */
                                this.folioMezclaRechazadaLst = [];
                                this.tablaProveedoresLst = [];
                                this.tablaOrdenEntregaLst = [];
                                this.tablaAlmacenLst = [];
                                this.tablaObservacionesLst = [];
                                this.dataReporte = {};
                                this.foliosPrueba = [];
                                //**************************** */
                                for (let index = 0; index < 3; index++) {
                                    const element = this.data[index];
                                    let row={
                                        id:index+1,
                                        folio:data[0].folioMezcla,
                                        descripcion:'',
                                        motivoRechazo:''
                                      }
                                      let rowProveedor={
                                        id:index+1,
                                        numContrato:data[0].numContratoProveedor,
                                        rfcProveedor:data[0].rfcProveedor,
                                        numProveedor:data[0].numProveedor,
                                        razonSocialProveedor:data[0].razonSocialProveedor,
                                        domicilioProveedor:data[0].domicilioProveedor
                                 
                                       };
                                       let rowOrdenEntrega={
                                         id:index+1,
                                         turno:data[0].turno,
                                         fechaExpedicion:data[0].fechaExpedicion,
                                         fechaEntrega:data[0].fechaEntrega,
                                       }
                                       let rowAlmacen={
                                         id:index+1,
                                         presupuestalRecoleccion:data[0].presupuestalRecoleccion,
                                         centralMezclaRecoleccion:data[0].centralMezclaRecoleccion,
                                         presupuestalEntrega:data[0].presupuestalEntrega,
                                         unidadMedicaEntrega:data[0].unidadMedicaEntrega,
                                         domicilioEntrega:data[0].domicilioEntrega, 
                                         domicilioRecolecion:data[0].domicilioRecolecion ////
                                 
                                       };
                                       let rowObservaciones={
                                         id:index+1,
                                         observaciones:'observacion'
                                       };
                                       this.folioMezclaRechazadaLst.push(row);
                                       this.tablaProveedoresLst.push(rowProveedor);
                                       this.tablaOrdenEntregaLst.push(rowOrdenEntrega);
                                       this.tablaAlmacenLst.push(rowAlmacen);
                                       this.tablaObservacionesLst.push(rowObservaciones);

                                }
                                let p = {};
                                
                                for (let i = 0; i < this.datosdelReporte.length; i++) {
                                    p = {
                                        id: 1,
                                        folio: data[i].folioMezcla,
                                        descripcion: data[i].desTipoMezcla,
                                        folioSolicitud: data[i].folioSolicitudMezcla

                                    }
                                    this.foliosPrueba.push(p);
                                }
                                this.dataReporte={
                                    numOrden:data[0].numeroOrden,//this.numOrden,
                                    tipoMezcla:data[0].desTipoMezcla,//tipoMezclaElement.desTipoMezcla,
                                    tablaProveedoresLst:this.tablaProveedoresLst,
                                    tablaOrdenEntregaLst:this.tablaOrdenEntregaLst,
                                    folioMezclaRechazadaLst:this.folioMezclaRechazadaLst,
                                    tablaAlmacenLst:this.tablaAlmacenLst,
                                    tablaObservacionesLst:'',//no va
                                    foliosPrueba: this.foliosPrueba
                                   }

                                this._reporteMezclasAprobadas.createRecepcionUMOrden(this.dataReporte).then((response) => {
                                    //console.log('responseReporte', response)
                                    this._spinner.hide();
                                });
                            } else {

                                this._alertServices.error("Error al obtener información de reporte.");

                            }
                        });

                   
                    //invocar el servico de la orden de entrega *************************************

                    
                } else{
                    this._alertServices.error("<strong>Error</strong> al asignar proveedor.");
                     //
                   
                }
                    
            });
    }

    findClass(tipo) {

        switch (tipo) {
            case 'En espera'://EstatusMezcla.EN_ESPERA://Disponible
                return 'blue';
                break;
            case 'Aprobada'://EstatusMezcla.APROBADA://cancelada
                return 'green';
                break;
            case 'Rechazada': //EstatusMezcla.RECHAZADA_UNIDAD_MEDICA://cancelada
                return 'red';
                break;
            default:
                break;
        }
    
    
        return '';
    }

    redirecciona(modelo: any) {

        let valor = {
            modelo: modelo,
            origen: NAV.ordenDistribucion
        }

        this._sesionStorage.setDataResolucion(valor);
        
        switch (modelo.idTipoMezcla) {
          case 1:
            this._router.navigate([NAV.detalleCitotoxicoAcondicionamiento]);
            break;
          case 2:
            this._router.navigate([NAV.detalleNPTAcondicionamiento]);
            break;
          case 3:
            this._router.navigate([NAV.detalleAntiAcondicionamiento]);
            break;
          default:
           console.log('no es tipo mezcla valido')
        }
      }

      shortTable(sort:Sort) {
        //console.log("colName " + sort);
    
        const array = this.tableDS.data ;
        let des = sort.direction == 'desc';
        const sortedArray = this.sortArrayOfObjects(array, sort.active, des);    
        //let otherModel = {...this.modelo};
       // otherModel.content = sortedArray;
       // console.log(otherModel)
        this.tableDS = new MatTableDataSource(sortedArray);
      }
    
}
