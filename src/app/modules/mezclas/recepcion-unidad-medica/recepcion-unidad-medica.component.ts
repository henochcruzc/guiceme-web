import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { GeneralComponent } from '../../general/general.component';
import { SelectionModel } from '@angular/cdk/collections';
import { AuthService } from '../../login/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { MezclasService } from 'src/app/shared/services/mezclas.service';
import { CatalogoService } from 'src/app/shared/services/catalogo.service';
import { reporteMezclasAprobadasModel } from 'src/app/shared/models/reporte.mezclas.aprobadas.model';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { DialogFormlyComponent } from 'src/app/shared/dialog-formly/dialog-formly.component';
import { timeStamp } from 'console';

@Component({
  selector: 'app-recepcion-unidad-medica',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
  ],
  templateUrl: './recepcion-unidad-medica.component.html',
  styleUrls: ['./recepcion-unidad-medica.component.scss']
})
export class RecepcionUnidadMedicaComponent extends GeneralComponent {
  hideFormly: boolean = true;
  radioColor: any = "mycolor";
  tablaProveedoresLst = [

  ];
  idsReporte: any;
  folioMezclaRechazadaLst = [

  ]
  mostrarBotonReporte: any;
  dataReporte: any;
  reseteoMatRadios: any;
  tituloPanel: any;

  guardado: boolean = false;
  disabled: boolean = false;
  usuario: any;
  reporteMezclasAprobadasData: any;
  model: any = {};
  form = new FormGroup({});
  fields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: "col-lg-4 col-md-6",
          key: 'ordenEntrega',
          type: 'input',
          props: {
            label: 'Orden de entrega',
            placeholder: 'Ingresa una orden',
            required: true
          },
          hooks: {
            onInit: async (field) => {



            },

          },

        },
        {
          className: "col-lg-4 col-md-6",
          key: 'tipoMezcla',
          type: 'select',
          props: {
            label: 'Tipo de mezcla',
            placeholder: 'Selecciona un tipo de mezcla',
            required: false,
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
          className: 'col-lg-2 col-xxl-1 col-md-2 col-sm-3',
          key: 'limpiar',
          type: 'button',
          templateOptions: {
            label: ' ',
            disabled: true,
            text: 'Limpiar ',
            onClick: (to, $event) => {
              //this.tipoMezclaDataSource= new MatTableDataSource<any>(MockData.mockTipoMezcla);
              this.limpiar();

            },
            classBtn: 'btn btn-danger w-100'
          },
          expressionProperties: {
            'props.disabled': (model: any) => {
              if (
                model.ordenEntrega
              ) {
                return false
              }
              return true
            },
          },

        },
        {
          className: 'col-lg-2  col-xxl-1 col-md-2 col-sm-3',
          key: 'buscar',
          type: 'button',
          templateOptions: {
            label: ' ',
            text: 'Buscar ',
            disabled: true,
            onClick: (to, $event) => {
              //this.tipoMezclaDataSource= new MatTableDataSource<any>(MockData.mockTipoMezcla);
              this.buscarMezclas();

            },
            classBtn: 'btn btn-primary btn-sm btn-pro w-100'
          },
          expressionProperties: {
            'props.disabled': (model: any) => {
              if (
                model.ordenEntrega
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
  formTipoMezcla = new FormGroup({});
  modelAbajoNtp3: any = {};
  formAbajoNtp3 = new FormGroup({});
  fieldsAbajoNtp3: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: 'col-lg-2 col-md-6',
          key: 'folioOrden',
          type: 'textBold',
          templateOptions: {
            label: 'Folio de la orden',


          },
          hooks: {
            onInit: async (field) => {

              const folioOrden = field.form.get('folioOrden');
              if (folioOrden != null) {
                folioOrden.valueChanges.subscribe((x) => {
                  if (x != null && x != '') {
                    field.form.get('buscar').enable();
                    field.form.get('limpiar').enable();
                  }
                });

              }

            },

          },
          expressionProperties: {
            'props.disabled': (model: any) => {
              if (this.disabled) {
                return true
              } else {
                return false
              }

            },
          },
        },
        {
          className: "col-lg-3 col-md-6",
          key: 'tipoMezcla',
          type: 'textBold',

          props: {
            label: 'Tipo de  mezcla',


          },
          hooks: {

          },
          expressionProperties: {
            'props.disabled': (model: any) => {
              if (this.disabled) {
                return true
              } else {
                return false
              }

            },
          },
        },

        {
          className: "col-lg-3 col-md-6",
          key: 'proveedor',

          type: 'textBold',
          props: {
            label: 'Proveedor',
            placeholder: '-------------',
            disabled: true,
            maxLength: 2,
          },
          hooks: {




          }


        },
        {
          className: "col-lg-2 col-md-6",
          key: 'fechaSalidaOrden',
          type: 'textBold',
          props: {
            label: 'Fecha de salida de orden',
          },
          hooks: {

          },
          expressionProperties: {
            'props.disabled': (model: any) => {
              if (this.disabled) {
                return true
              } else {
                return false
              }

            },
          },
        },
        {
          className: "col-lg-2 col-md-6",
          key: 'responsableEntrega',
          type: 'textBold',
          props: {
            label: 'Responsable de entrega',
          },
          hooks: {

          },
          expressionProperties: {
            'props.disabled': (model: any) => {
              if (this.disabled) {
                return true
              } else {
                return false
              }

            },
          },
        },




      ]
    },
  ]
  displayedColumns2 = ['folioMezcla', 'folioSolicitud', 'tipoMezcla', 'nombrePaciente', 'fechaAplicacion', 'aprobar']//, 'check']
  displayedColumns = ['folioMezcla', 'folioSolicitud', 'tipoMezcla', 'nombrePaciente', 'fechaAplicacion', 'estatus']//, 'check']

  myData;
  tableDS: MatTableDataSource<any>;

  myData2;
  tableDS2: MatTableDataSource<any>;

  selection = new SelectionModel<any>(true, []);
  tipoMezcla: any;

  estatus = [
    "Solicitada",
    "No aprobada",
    "Asignada",
    "Aprobada",

  ]
  paginaActual: number = 1;
  totalElements: any;
  controlMezclas: any;
  mostrarConfirmar: boolean;
  detalle: any;
  data: any;
  tablaOrdenEntregaLst: any[];
  tablaAlmacenLst: any[];
  tablaObservacionesLst: any[];
  numOrden: any;
  tablaTiposMezcla: any[];


  ngOnInit(): void {


    this.controlMezclas = {
      items: [],
      lastPage: [],
      totalElementos: -1
    };

    this.totalElements = 0;
    this.mostrarBotonReporte = false;
    this.usuario = this._accountService.getUser();
    console.log("usuario", this.usuario)
    this.mostrarConfirmar = true;
    this.detalle = null;
    this.reseteoMatRadios = "SinElegir";
    this.tituloPanel = "Orden de entrega";



  }

  pageChanged(event: any) {
    /*console.log(event)
    const startItem = (event - 1) * this.ConfigTabla.NUM_ELEMENTOS_TABLA;
    const endItem = event * this.ConfigTabla.NUM_ELEMENTOS_TABLA;
    console.log(startItem, endItem, this.myData.slice(startItem, endItem));
    this.tableDS = new MatTableDataSource(this.myData.slice(startItem, endItem));*/
    if (this.model.ordenEntrega != null && this.model.tipoMezcla != null) {
      this.getDetalleList(event - 1, 10, this.model.tipoMezcla, this.model.ordenEntrega);
    } else if (this.model.ordenEntrega != null && this.model.tipoMezcla == null) {
      this.getDetalleList(event - 1, 10, null, this.model.ordenEntrega);
    }

  }

  pageChangedStatus(event: any) {
    /*console.log(event)
    const startItem = (event - 1) * this.ConfigTabla.NUM_ELEMENTOS_TABLA;
    const endItem = event * this.ConfigTabla.NUM_ELEMENTOS_TABLA;
    console.log(startItem, endItem, this.myData.slice(startItem, endItem));
    this.tableDS = new MatTableDataSource(this.myData.slice(startItem, endItem));*/
    if (this.model.ordenEntrega != null && this.model.tipoMezcla != null) {
      this.getDetalleMezclaEstatus(event - 1, 10, this.model.tipoMezcla, this.model.ordenEntrega);
    } else if (this.model.ordenEntrega != null && this.model.tipoMezcla == null) {
      this.getDetalleMezclaEstatus(event - 1, 10, null, this.model.ordenEntrega);
    }

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
    private catalogService: CatalogoService

  ) {
    super();

  }

  getDetalleMezclaEstatus(page, size, idTipoMezcla, ordenEntrega) {


    this.mezclaService.getOrdenStatusRecepcionUM(page, size, idTipoMezcla, ordenEntrega)
      .then(data => {
        //this.detalle=data.detalle;

        let tipoMezclaElement = this.tipoMezcla.find(e => e.id == this.model.tipoMezcla);
        let desc;
        if (tipoMezclaElement == null) desc = null;
        else desc = tipoMezclaElement.desTipoMezcla;

        if (data != null) {
          if (data.detalle != null) {
            //pendiente hacer los mapeos
            this.detalle = data.detalle;
            this.numOrden = data.detalle.folioOrden;
            this.modelAbajoNtp3 = {
              ...this.modelAbajoNtp3,
              folioOrden: this.detalle.folioOrden,
              tipoMezcla: this.detalle.tipoMezcla,
              proveedor: this.detalle.proveedor,
              fechaSalidaOrden: this.detalle.fechaSalidaOrden,
              responsableEntrega: this.detalle.responsableEntrega,
            }

          }
          console.log("rechazados por atribuible", data.idsRechazos);
          if ((data.idsRechazos.length > 0 && data.idsRechazos != null)) {
            this.idsReporte = data.idsRechazos;
            this.mostrarBotonReporte = true;
          }

          if (data != null && data.result != null && data.result.content != null && data.result.content.length != 0) {

            this.totalElements = data.result.totalElements;
            this.controlMezclas.totalElementos = data.result.totalElements;

            //tabla de solo status y reporte.
            this.myData = data.result.content;
            this.tableDS = new MatTableDataSource(this.myData);
            this.tituloPanel = "Reporte de entrega";
            let ids = "";

            /* let elementosRechazados=this.myData.filter(x => x.idAtribuibleProveedor==1);
           console.log("elementosRechazados",elementosRechazados);
           debugger;
           if(elementosRechazados!=null){
             for (let index = 0; index < elementosRechazados.length; index++) {
               const element = elementosRechazados[index];
               
               ids=ids+element.idMezclaAplicDiaDosis+",";
             }
             
             if( elementosRechazados.length>0) 
             this.idsReporte=ids.substring(0,ids.length-1);
             else this.idsReporte=null;
 
               console.log("ids reporte",this.idsReporte);
           }else{
             this.idsReporte=null;
             console.log("ids no hubo atribuibles a proveedor");
           }*/


            //  let totalRechazadasAtribuible= this.myData.filter(x => x.idAtribuibleProveedor==1).length;




          } else {
            this.tableDS = null
            this.totalElements = null
            this._alertServices.errorRecepcion()
          }
        } else {

          this.tableDS = null
          this.totalElements = null
          this._alertServices.errorRecepcion();

        }
      });
  }
  getDetalleList(page, size, idTipoMezcla, ordenEntrega) {

    //  this.mezclaService.getSolicitudesPre(page,size,null,null)
    this.mezclaService.getOrdenRecepcionUM(page, size, idTipoMezcla, ordenEntrega)
      .then(data => {
        //this.detalle=data.detalle;

        let tipoMezclaElement = this.tipoMezcla.find(e => e.id == this.model.tipoMezcla);
        let desc;
        if (tipoMezclaElement == null) desc = null;
        else desc = tipoMezclaElement.desTipoMezcla;
        if (data != null) {


          if (data.detalle != null) {
            //pendiente hacer los mapeos
            this.detalle = data.detalle;
            this.numOrden = data.detalle.folioOrden;
            this.modelAbajoNtp3 = {
              ...this.modelAbajoNtp3,
              folioOrden: this.detalle.folioOrden,
              tipoMezcla: this.detalle.tipoMezcla,
              proveedor: this.detalle.proveedor,
              fechaSalidaOrden: this.detalle.fechaSalidaOrden,
              responsableEntrega: this.detalle.responsableEntrega,
            }

          }

          if (data != null && data.result != null && data.result.content != null && data.result.content.length != 0) {

            this.totalElements = data.result.totalElements;
            this.controlMezclas.totalElementos = data.result.totalElements;
            console.log("totalElementos en control: ", this.controlMezclas.totalElementos);
            // flag para saber si esta guardado
            //  this.guardado=false;

            if (this.guardado == false) {// tabla de aprobar y rechazar
              // this.myData2= data.content;


              let pageAlreadyIn = false;
              for (let index = 0; index < data.result.content.length; index++) {
                const element = data.result.content[index];
                let item = {
                  cveFolioMezclaDosis: element.cveFolioMezclaDosis,
                  idRecepcionMezcla: element.idRecepcionMezcla,
                  idMezclaAplicDiaDosis: element.idMezclaAplicDiaDosis,
                  estatus: null,
                  indAprobado: false,
                  indRechazado: false,
                  desc: "",
                  motivo: "",
                  atribuible: false,
                  pagina: page,
                  cveFolioSolicitudMezcla: element.cveFolioSolicitudMezcla,
                  desTipoMezcla: element.desTipoMezcla,
                  nombrePaciente: element.nombrePaciente,
                  fecAplicacionDia: element.fecAplicacionDia,
                  reseteoFormGroup: "sinelegir",
                  disable: false,
                  disableAprobado: false,
                  disableRechazado: false,

                  idMezclaAplicDia: element.idMezclaAplicDia
                }
                let lookForPage = this.controlMezclas.lastPage.find(e => e == page);
                console.log("looking for page", page);
                console.log("looking result", lookForPage);

                if (lookForPage == null) {

                  let alreadyExistElement = this.controlMezclas.items.find(e => e.idMezclaAplicDiaDosis == item.idMezclaAplicDiaDosis);
                  //  if(alreadyExistElement==null)//pendietne arreglar el tema de duplicados.
                  this.controlMezclas.items.push(item);
                  if (alreadyExistElement != null) {
                    console.log("Se intento agregar un registro repetio", item);
                    //se resetea el conteo de datos por info repetida
                    //  this.totalElements=this.totalElements-1;
                    // this.controlMezclas.totalElementos= this.controlMezclas.totalElementos-1;

                  }


                } else {
                  pageAlreadyIn = true;
                  break;
                }


              }
              if (pageAlreadyIn == false) {//En caso no estar esa pagina
                let data = this.controlMezclas.items.filter(x => x.pagina == page);
                this.tableDS2 = new MatTableDataSource(data);
                this.controlMezclas.lastPage.push(page);

              } else {

                let data = this.controlMezclas.items.filter(x => x.pagina == page);
                this.tableDS2 = new MatTableDataSource(data);
              }


              console.log("elements control", this.controlMezclas);

            }/*else {//tabla de solo status y reporte.
          this.myData = data.content;
          this.tableDS = new MatTableDataSource(this.myData);
          this.tituloPanel="Reporte de entrega";
          
         let totalRechazadasAtribuible= this.myData.filter(x => x.atribuibleProovedor==true).length;
          if(totalRechazadasAtribuible>0){
            this.mostrarBotonReporte=true;
          }
         }*/



          } else {
            this.tableDS2 = null
            this.totalElements = null
            this._alertServices.error("<strong>No se encontraron resultados</strong> con los criterios de búsqueda ingresados.");
          }
        } else {
          this.tableDS2 = null
          this.totalElements = null
          this._alertServices.error("<strong>No se encontraron resultados</strong> con los criterios de búsqueda ingresados.");


        }
      });
  }
  buscarMezclas() {
    /*
    const dialogRef = this._dialog.open(
      DialogFormlyComponent,
      this._dialogFormlyService.noAprobarRecepcionUM("MA20240208000123")
    );
  
    dialogRef.afterClosed().subscribe(
      async data => {
        //debugger
        if (data !=null) {
          console.log("data",data);
        }
      });*/


    if (this.form.valid) {

      this.mostrarConfirmar = true;
      this.guardado = false;
      this.mostrarBotonReporte = false;

      this.controlMezclas = {
        items: [],
        lastPage: [],
        totalElementos: -1
      };



      this.getDetalleList(0, 10, this.model.tipoMezcla, this.model.ordenEntrega);

    } else {
      const formValidar = [this.form];
      this.validaCamposFormulario(formValidar);
      this._alertServices.errorCamposObligatorios();

    }
  }
  mostrarOrdenStatus() {


    if (this.form.valid) {

      this.controlMezclas = {
        items: [],
        lastPage: [],
        totalElementos: -1
      }

      this.getDetalleMezclaEstatus(0, 10, this.model.tipoMezcla, this.model.ordenEntrega);

    } else {
      const formValidar = [this.form];
      this.validaCamposFormulario(formValidar);
      this._alertServices.errorCamposObligatorios();

    }
  }
  limpiar() {
    this.form.reset();
    this.mostrarConfirmar = true;
    this.detalle = null;
    this.controlMezclas = null;
    this.tableDS2 = new MatTableDataSource([]);
    this.tableDS = new MatTableDataSource([]);

    this.controlMezclas = {
      items: [],
      lastPage: [],
      totalElementos: -1
    };

    this.totalElements = 0;
    this.mostrarBotonReporte = false;



  }


  async downloadPDF() {
    this._spinner.show();

    console.log('ids reporte:', this.idsReporte)

    await this.mezclaService.getDataReporteRecepcionUM(this.idsReporte)
      .then(async data => {

        if (data != null && data.length > 0) {
          this.data = data;


        } else {

          this._alertServices.error("<strong>No se encontraron resultados</strong> con los criterios de búsqueda ingresados.");

        }
      });


    this.folioMezclaRechazadaLst = [];
    this.tablaProveedoresLst = [];
    this.tablaOrdenEntregaLst = [];
    this.tablaAlmacenLst = [];
    this.tablaObservacionesLst = [];
    this.tablaTiposMezcla = [];

    /*this.data=[
      {
          numContratoProveedor: "500003",
          rfcProveedor: "RFC123456789",
          numProveedor: "000003",
          razonSocialProveedor: "Proveedor de Distribución 3",
          domicilioProveedor: "Domicilio Conocido 3",
          numContrato: "500003",
          numeroOrden: "3OD25032024002",
          fechaExpedicion: null,
          fechaEntrega: null,
          turno: null,
          presupuestalRecoleccion: null,
          centralMezclaRecoleccion: "UMF-UMAA 36 MESA DE OTAY",
          presupuestalEntrega: "020201082151",
          unidadMedicaEntrega: "HGS No. 6 TECATE ",
          domicilioEntrega: null,
          folioMezcla: "MA202403240000032503",
          motivoRechazo: null,
          descripcion: "SIN DATO",
          domicilioRecolecion: null,
          observacionesRechazo: null,
          desTipoMezcla: "Antibiótico"
      }
  ]*/
    if (this.data != null) {


      // this.numOrden=null;
      let tipoMezclaElement: "";
      for (let index = 0; index < this.data.length; index++) {
        const element = this.data[index];

        if (index == 0) tipoMezclaElement = element.desTipoMezcla;

        let row = {

          id: index + 1,
          folio: element.folioMezcla,
          descripcion: element.descripcion,//pendiente
          motivoRechazo: element.motivoRechazo//'pendiente'

        }
        let rowProveedor = {
          id: index + 1,
          numContrato: element.numContrato,//'pendiente',
          rfcProveedor: element.rfcProveedor,
          numProveedor: element.numProveedor,
          razonSocialProveedor: element.razonSocialProveedor,
          domicilioProveedor: element.domicilioProveedor

        };
        let rowOrdenEntrega = {
          id: index + 1,
          turno: element.turno,//'pendiente',
          fechaExpedicion: element.fechaExpedicion,
          fechaEntrega: element.fechaEntrega,
        }
        let rowAlmacen = {
          id: index + 1,
          presupuestalRecoleccion: element.presupuestalRecoleccion,//'pendiente',
          centralMezclaRecoleccion: element.centralMezclaRecoleccion,
          presupuestalEntrega: element.presupuestalEntrega,
          unidadMedicaEntrega: element.unidadMedicaEntrega,
          domicilioEntrega: element.domicilioEntrega, //'pendiente',
          domicilioRecolecion: element.domicilioRecolecion// 'pendiente'

        };
        let rowObservaciones = {
          id: index + 1,
          observaciones: element.observaciones//'pendiente'
        };
        this.folioMezclaRechazadaLst.push(row);
        this.tablaProveedoresLst.push(rowProveedor);
        this.tablaOrdenEntregaLst.push(rowOrdenEntrega);
        this.tablaAlmacenLst.push(rowAlmacen);
        this.tablaObservacionesLst.push(rowObservaciones);
      }
      this.dataReporte = {
        numOrden: this.numOrden,
        tipoMezcla: tipoMezclaElement,
        tablaProveedoresLst: this.tablaProveedoresLst,
        tablaOrdenEntregaLst: this.tablaOrdenEntregaLst,
        folioMezclaRechazadaLst: this.folioMezclaRechazadaLst,
        tablaAlmacenLst: this.tablaAlmacenLst,
        tablaObservacionesLst: this.tablaObservacionesLst

      }

      this._reporteMezclasAprobadas.createRecepcionUM(this.dataReporte).then((response) => { this._spinner.hide(); });
    } else
      this._alertServices.error("<strong>Error</strong> sin datos para reporte.");

  }

  generarReporte(data) {

  }
  selectItem(row: any, operacion) {
    // this.selection.toggle(row);
    //this.selection.select(row)
    // this.selectedItem = row;
    console.log('select item', row);
    console.log('operacion', operacion);
    if (operacion == "rechazar") {
      const dialogRef = this._dialog.open(
        DialogFormlyComponent,
        this._dialogFormlyService.noAprobarRecepcionUM(row.cveFolioMezclaDosis)
      );

      dialogRef.afterClosed().subscribe(
        async data => {
          //debugger
          if (data != null) {

            //  this.rechazarMezcla(data.motivo,data.observaciones);
            let element = this.controlMezclas.items.find(e => e.idMezclaAplicDiaDosis == row.idMezclaAplicDiaDosis);
            console.log('elemento a rechazar', element);
            element.indRechazado = true;
            element.indAprobado = false;
            element.estatus = "Rechazado";
            element.desc = data.observaciones;
            element.motivo = data.motivo;
            element.atribuible = data.atribuible;
            element.reseteoFormGroup = "Rechazado";
            element.disableAprobado = true;



            //Conteo de pendientes   
            let totalElemStatus = this.controlMezclas.items.filter(x => x.estatus != null).length;
            if (this.totalElements == totalElemStatus)
              this.mostrarConfirmar = false;
            else this.mostrarConfirmar = true;

            console.log("control Items", this.controlMezclas);

            this._alertServices.success("La mezcla se rechazo con éxito. ");

            return;

          } else {
            let element = this.controlMezclas.items.find(e => e.idMezclaAplicDiaDosis == row.idMezclaAplicDiaDosis);
            console.log('elemento a resetear', element);


            element.indRechazado = false;
            element.indAprobado = false;
            element.disableAprobado = false,
              element.disableRechazado = false,
              element.estatus = null;
            element.reseteoFormGroup = "SinElegir";
            //Conteo de pendientes   
            let totalElemStatus = this.controlMezclas.items.filter(x => x.estatus != null).length;
            if (this.totalElements == totalElemStatus)
              this.mostrarConfirmar = false;
            else this.mostrarConfirmar = true;
            console.log("control Items", this.controlMezclas);

            return;


          }
        }
      );

    } else {
      //aprobar

      let element = this.controlMezclas.items.find(e => e.idMezclaAplicDiaDosis == row.idMezclaAplicDiaDosis);

      console.log('elemento aprobar', element);
      // debugger;
      if (element.indRechazado) {
        console.log("intento de aprobar algo ya rechazado", element);


        element.indRechazado = true;
        element.indAprobado = false;
        element.estatus = "Rechazado";



        return;
      }
      element.indRechazado = false;
      element.indAprobado = true;
      element.estatus = "Aprobado";
      element.reseteoFormGroup = "Aprobado";
      element.disable = true;
      element.disableRechazado = false;


      element.desc = null;
      element.motivo = null;
      element.atribuible = null;

      //verificamos cuantos faltan por aprobar o rechazar

      let totalElemStatus = this.controlMezclas.items.filter(x => x.estatus != null).length;
      if (this.totalElements == totalElemStatus)
        this.mostrarConfirmar = false;
      else this.mostrarConfirmar = true;

      console.log("control Items", this.controlMezclas);

    }


  }
  radioLabel(row?: any): string {
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
  confirmarOrden() {

    let totalElemStatus = this.controlMezclas.items.filter(x => x.estatus != null).length;
    let arrayMezclasFinales = [];
    if (this.controlMezclas.totalElementos == totalElemStatus) {

      for (let index = 0; index < this.controlMezclas.items.length; index++) {
        const element = this.controlMezclas.items[index];
        let rowMezcla =
        {
          idRecepcionMezcla: element.idMezclaAplicDiaDosis,
          indAprobado: element.indAprobado,
          indRechazado: element.indRechazado,
          atribuibleProovedor: element.atribuible == true ? true : false,
          idMotivo: element.indRechazado == true ? element.motivo : null,
          observaciones: element.indRechazado == true ? element.desc : null

        }
        arrayMezclasFinales.push(rowMezcla);

      }

      let request = {
        usuarioAlta: this.usuario.cemetUsuarios[0].id,
        confirmarOrden: arrayMezclasFinales,
        ordenEntrega: this.numOrden//pendiente
      }
      debugger

      this.mezclaService.confirmarOrdenUM(request)
        .then(data => {


          if (data) {

            this._alertServices.success("La orden de entrega se guardó <strong>con Número de folio " + this.model.ordenEntrega + "</strong>");

            this.guardado = true;
            this.mostrarConfirmar = true;
            this.tableDS2 = null

            this.mostrarOrdenStatus();

          } else {

            this._alertServices.error("<strong>Error</strong> Error al confirmar Orden.");
          }

        });


    }

  }
}
