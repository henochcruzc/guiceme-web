import { CommonModule, formatDate } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { GeneralComponent } from 'src/app/modules/general/general.component';
import { DialogFormlyComponent } from 'src/app/shared/dialog-formly/dialog-formly.component';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { HeaderDetalleMezclaComponent } from 'src/app/shared/layout/header-detalle-mezcla/header-detalle-mezcla.component';
import { CatalogoService } from 'src/app/shared/services/catalogo.service';
import { MezclasService } from 'src/app/shared/services/mezclas.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { DetalleProgresoComponent } from "../../detalle-progreso/detalle-progreso.component";
import { NAV } from 'src/app/shared/config/global';
import { SessionStorageService } from 'src/app/modules/login/services/session-storage.service';

@Component({
    selector: 'app-detalle-pre-mezcla-ntp',
    standalone: true,
    templateUrl: './detalle-pre-mezcla-ntp.component.html',
    styleUrls: ['./detalle-pre-mezcla-ntp.component.scss'],
    imports: [
        CommonModule,
        SharedModule,
        HeaderDetalleMezclaComponent,
        DetalleProgresoComponent
    ]
})
export class DetallePreMezclaNTPComponent extends GeneralComponent implements OnInit{
 
    dataComponentes:any;
    cveFolioMezclaDosis:any; 
    cveFolioSolicitudMezcla:any;
    desDiagnosticoCie:any;
    desServicioEspecialidad:any;
    desTipoMezcla:any;
    idSolicitudMezcla:any;
    refCveCama:any;
    refCvePiso:any;
    refUnidadMedicaHosp:any;

  idMezclaAplicDiaDosis:any;
  usuario:any;

  sessionStorageService = inject(SessionStorageService)
  dataResolucion = this.sessionStorageService.getDataResolucion();
  user = this.sessionStorageService.getUser();

  headerData = {
    navAtras: NAV.prescripcion,
    uno: [
        {
            class: 'col-lg-2',
            titulo: 'Folio de mezcla',
            texto: ''
        },
        {
            class: 'col-lg-2',
            titulo: 'Folio de solicitud',
            texto: 'S20240214123456'
        },
        {
            class: 'col-lg-6',
            titulo: 'Diagnóstico',
            isDiagnostico: true,
            texto: ''
        },
        {
            class: 'col-lg-2',
            texto: 'Detalle de la mezcla'
        },
    ],
    dos: [
        {
            class: 'col-lg-3',
            colorClass: 'yellow',
            iconName: 'yellow-h.svg',
            informacion: [{
                separador: false,
                titulo: 'Tipo de mezcla',
                texto: 'Antibiótico',
            }]

        },
        {
            class: 'col-lg-6',
            colorClass: 'green',
            iconName: 'green-h.svg',
            informacion: [
                {
                    separador: false,
                    titulo: 'Especialidad',
                    texto: 'Neurología',
                },
                {
                    separador: true,
                    titulo: 'U. de Adscripción',
                    texto: '',
                },
            ]

        },
        {
            class: 'col-lg-3',
            colorClass: 'blue',
            iconName: 'blue-h.svg',
            informacion: [
                {
                    separador: false,
                    titulo: 'Piso',
                    texto: '10',
                },
                {
                    separador: false,
                    titulo: 'Cama',
                    texto: '307',
                },
            ]

        },

    ]
}
  mezclaDetails: any;
  viaAdminBackup: any;
  tiempoInfusionBackup: any;
  velocidadInfusionBackup: any;
  cadaBackup: any;
  numTotalDosisBackup: any;
  fechaAplBackup: any;
  diluyenteBackup: any;


  seleccionarTodos: boolean = false;

  seleccionarTodosBackup: boolean = false;
  disableComp: boolean = true;
  eliminarBtn: boolean = true;
  canceEdicion: boolean = false;
  editar: boolean = true;
  saveEdicion: boolean = false;
  disabledEliminar: boolean = false

  dosisTotales: number = 0;
  cadaLst: any;

  public date = new Date();
  public today: string = formatDate(this.date, 'yyyy-MM-dd', 'en-US');
  fechasToAplDosis = [];
  meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  tabs = [];
  tabsBackup = [];
  tabsNTP = [];
  tabsNTPBackup = [];

  counterNTP = this.tabsNTP.length + 1;
  counter = this.tabs.length + 1;
  active;
  destipoMezcla: any;
  color: boolean = false;
  listMezclaCat: any;
  listDiluyente: any;
  ruta: any;
  fechas: any;
  role: any;
  isRatificada: boolean;
  obsRatificacion:any;
  onNavChangeNTP(changeEvent: NgbNavChangeEvent) {

  }

  lsMedicamentos: any = [];
  items = [];
  numMezclas: number = 0;
  antibioticosDisplayedColumns: string[] = [
    'medicamento',
    'dosis',
    'unidadMedida'
  ];
  medicamentosTotal: number = 0;
  antibioticosDataSource = new MatTableDataSource<any>([]);

  noMezcla: boolean = true;
  boton: boolean = true;
  tipoMezcla: any;
  idMezcla: any;
  valorCada: any;
  disabled: boolean = false



  constructor(
    private catalogService: CatalogoService,
    private mezclaService: MezclasService,
    private _Activatedroute: ActivatedRoute,
   ) {
    super();

  }
  ngOnInit(): void {
    console.log('modelo -----> ',this.dataResolucion.modelo)
    if (this.dataResolucion.modelo.idEstatusMezcla === 13) {
      this.isRatificada = true;
    }else{
      this.isRatificada = false;
    }

    this.usuario = this._accountService.getUser();
    this.noMezcla = false;
    this.disabled = true
    console.log('info del padre ', this.mezclaDetails);
    this.tabs = [];
    this.tabsNTP = [];

  this.idMezclaAplicDiaDosis=this.dataResolucion.modelo.idMezclaAplicDiaDosis; 
  this.idMezcla=this.dataResolucion.modelo.idMezcla; 
  this.tipoMezcla=this.dataResolucion.modelo.idTipoMezcla;

  this.getDetalleList(this.idMezclaAplicDiaDosis);

   
    let usuario = this._accountService.getUser();
    console.log('########## usuario ',usuario)
    this.role = usuario.cemetUsuarios[0].idPerfil.id;

    console.log('########## role ',this.role)

  }



  // NTP

  lsComponentes = []


  displayedColumns: string[] = [
    'medicamento',
    'dosis',
    'unidadMedida'
  ];

  formTipoMezcla = new FormGroup({});
  //panel NTP




  //panel de abajo
  modelAbajoNtp: any = {};
  formAbajoNtp = new FormGroup({});
  fieldsAbajoNtp: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: "col-lg-2 col-md-6",
          key: 'osmolaridad',

          type: 'text2',
          props: {
            label: 'Osmolaridad (mOsmol/ml)',
            placeholder: '00',
            disabled: true,

          },
        },
        {
          className: "col-lg-2 col-md-6",
          key: 'nitrogeno',

          type: 'text2',
          props: {
            label: 'Nitrógeno (gr)',
            disabled: true,
            placeholder: '00',
          },
        },
        {
          className: "col-lg-2 col-md-6",
          key: 'proteinas',

          type: 'text2',
          props: {
            label: 'Proteínas (gr)',
            disabled: true,
            placeholder: '00',
          },
        },
        {
          className: "col-lg-2 col-md-6",
          key: 'kcnoproteicas',

          type: 'text2',
          props: {
            label: 'Kcal no proteicas (Kcal)',
            disabled: true,
            placeholder: '00',
          },
        },
        {
          className: "col-lg-2 col-md-6",
          key: 'kctotales',

          type: 'text2',
          props: {
            label: 'Kcal totales (gr)',
            disabled: true,
            placeholder: '00',
          },
        },
        {
          className: "col-lg-2 col-md-6",
          key: 'volumenTotal',

          type: 'text2',
          props: {
            label: 'Volumen total',
            disabled: true,
            placeholder: '00',
          },
        },


      ]

    },
   
  ]

  // modelAbajoNtp2: any = {};
  // formAbajoNtp2 = new FormGroup({});
  // fieldsAbajoNtp2: FormlyFieldConfig[] = [
  //    {
  //     fieldGroupClassName: 'row',
  //     fieldGroup: [
  //       {
  //         className: "col-lg-8 col-md-6",
  //         key: 'diluyente',
  //         type: 'text2',

  //         props: {
  //           label: 'Diluyente',
           
          

  //         },
      
  //       },
  //       {
  //         className: "col-lg-2 col-md-6",
  //         key: 'dosis',

  //         type: 'text2',
  //         props: {
  //           label: 'Dosis',
  //           placeholder: 'Ingresa la dosis',
  //           appInputMaskType: 'integer',
  //           maxLength: 6,

  //         },
  //         expressionProperties: {
  //           'props.disabled': (model: any) => {
  //             if (this.disabled) {
  //               return true
  //             } else {
  //               return false
  //             }

  //           },
  //         },
  //       },
  //       {
  //         className: "col-lg-2 col-md-6",
  //         key: 'unidadMedidaDil',

  //         type: 'text2',
  //         props: {
  //           label: 'Unidad de medida',
  //           placeholder: '-------------',
  //           disabled: true,
  //           maxLength: 5
  //         },
  //       },


  //     ]
  //   },
   
  // ]
  modelAbajoNtp3: any = {};
  formAbajoNtp3 = new FormGroup({});
  fieldsAbajoNtp3: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: 'col-lg-2 col-md-6',
          key: 'fecApl',
          type: 'text2',
          templateOptions: {
            label: 'Fecha de aplicación',          
                    
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
          key: 'cada',
          type: 'text2',

          props: {
            label: 'Cada',
          
           
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
          key: 'numDosis',

          type: 'text2',
          props: {
            label: 'Número total de dosis',
            placeholder: '-------------',
            disabled: true,
             maxLength: 2,
          },
          hooks: {




          }


        },
        {
          className: "col-lg-2 col-md-6",
          key: 'viaAdmon',
          type: 'text2',
          props: {
            label: 'Vía de administración',
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
          key: 'unidadTiempo',
          type: 'text2',
          props: {
            label: 'Tiempo de infusión',
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
          key: 'velocidadInfusion',
          type: 'text2',
          props: {
            label: 'Velocidad de infusión (ml/hrs)',
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
          //  validators: {
          //   validation: [alphaNumber],
          // },

        }



      ]
    },
  ]


  

  dialogo() {
    const dialogRef = this._dialog.open(
      DialogComponent,
      this._dialogService.cancelar()
    );

    dialogRef.afterClosed().subscribe(
      async data => {
        if (data == true) {

        }
      }
    );
  }


  cargarTablas(primeraVez: boolean) {


    console.log('cargando tables')
    if (primeraVez) {
      this.tabsNTP = [];
      for (let index = 0; index < this.mezclaDetails.componentes.length; index++) {
        const element = this.mezclaDetails.componentes[index];

        let aminoAcidosDataSource = new MatTableDataSource<any>(element.data?.data);
        let compData = {
          nombre: element.nombre,
          counter: element.counter,
          id: element.id,
          data: aminoAcidosDataSource,
          active: false,

          displayCols: this.displayedColumns,
        }

        this.tabsNTP.push(compData)

      }
      console.log("tabsNTP cargadas primera vez", this.tabsNTP);

    }
    console.log("tabsNTP cargadas primera vez", this.tabsNTP);
  


  }
 
  aprobarMezcla(){
    /*const dialogRef = this._dialog.open(
      DialogComponent,
      this._dialogService.estasSeguroDeseasAprobarMezcla()
    );*/

    //dialogRef.afterClosed().subscribe(
      //async data => {
          //debugger
        //if (data) {
              let request=
                  {
                      "idMezclaIdDiaDosis": this.idMezclaAplicDiaDosis,
                      "idUsuarioEvalPrep": this.usuario.cemetUsuarios[0].id,
                      "idMotivoRechazo": null,
                      "cveUsuarioAlta": this.usuario.cemetUsuarios[0].id
                    }
                  this.mezclaService.aprobarMezclaPrescripcion(request)
                  .then(data => {
                      if(data){
                        this._alertServices.success('Mezcla(s) con número '+this.cveFolioMezclaDosis+' aprobada(s).<br> Total de folios aprobados: ' + data.actualizados);
                        
                        setTimeout(() =>  this._router.navigate([this._nav.prescripcion]), 4000);
                      
                      }
                  });


               // }
             // }
           // );
      
     }

     async getDetalleList(idMezclaAplicDiaDosis) {

      await this.mezclaService.getDetalleMezclaNTPPre(idMezclaAplicDiaDosis)
        .then(data => {

          if(data.detalleMezcla!=null){
            //"idSolicitudMezcla": 402,
           // "idMezcla": 281,
            //"idMezclaAplicDiaDosis": 1981,
            
          

          this.cveFolioMezclaDosis=data.detalleMezcla.cveFolioMezclaDosis;
          this.cveFolioSolicitudMezcla=data.detalleMezcla.cveFolioSolicitudMezcla;
          this.desDiagnosticoCie=data.detalleMezcla.desDiagnosticoCie;
          this.desServicioEspecialidad=data.detalleMezcla.desServicioEspecialidad;
          this.desTipoMezcla=data.detalleMezcla.desTipoMezcla;
          this.idSolicitudMezcla=data.detalleMezcla.idSolicitudMezcla;
          this.refCveCama=data.detalleMezcla.refNombreCama;
          this.refCvePiso=data.detalleMezcla.refNombrePiso;
          this.refUnidadMedicaHosp=data.detalleMezcla.desUnidadMedica;
          this.obsRatificacion = data.detalleMezcla.refObsRatifica

          this.headerData= {
            navAtras: NAV.prescripcion,
            uno: [
                {
                    class: 'col-lg-2',
                    titulo: 'Folio de mezcla',
                    texto:  this.cveFolioMezclaDosis
                },
                {
                    class: 'col-lg-2',
                    titulo: 'Folio de solicitud',
                    texto: this.cveFolioSolicitudMezcla
                },
                {
                    class: 'col-lg-6',
                    titulo: 'Diagnóstico',
                    isDiagnostico: true,
                    texto: this.desDiagnosticoCie
                },
                {
                    class: 'col-lg-2',
                    texto: 'Detalle de la mezcla'
                },
            ],
            dos: [
                {
                    class: 'col-lg-3',
                    colorClass: 'yellow',
                    iconName: 'yellow-h.svg',
                    informacion: [{
                        separador: false,
                        titulo: 'Tipo de mezcla',
                        texto: this.desTipoMezcla
                    }]
    
                },
                {
                    class: 'col-lg-6',
                    colorClass: 'green',
                    iconName: 'green-h.svg',
                    informacion: [
                        {
                            separador: false,
                            titulo: 'Especialidad',
                            texto: this.desServicioEspecialidad,
                        },
                        {
                            separador: true,
                            titulo: 'U. de Adscripción',
                            texto: this.refUnidadMedicaHosp,
                        },
                    ]
    
                },
                {
                    class: 'col-lg-3',
                    colorClass: 'blue',
                    iconName: 'blue-h.svg',
                    informacion: [
                        {
                            separador: false,
                            titulo: 'Piso',
                            texto: this.refCvePiso,
                        },
                        {
                            separador: false,
                            titulo: 'Cama',
                            texto: this.refCveCama,
                        },
                    ]
    
                },
    
            ]
        }
          
          this.modelAbajoNtp = {
            ...this.modelAbajoNtp,
             
        
         
            osmolaridad:data.detalleMezcla.numOsmolaridad,
            nitrogeno: data.detalleMezcla.numNitrogeno,
            proteinas: data.detalleMezcla.numProteinas,
            kcnoproteicas:data.detalleMezcla.numKcalNoProteicas,
            kctotales:data.detalleMezcla.numKcalTotales,
            volumenTotal:data.detalleMezcla.numVolumenTotal,
         
        }
        }


if(data.detalleDiluyente!=null){
this.modelAbajoNtp3 = {
              ...this.modelAbajoNtp3,
           
          fecApl:data.detalleDiluyente.fechaAplicacion,
              cada: data.detalleDiluyente.desAplicacionCada,
              numDosis: data.detalleDiluyente.numTotalDosis,
              viaAdmon:data.detalleDiluyente.desViaAdministracion,
              unidadTiempo:data.detalleDiluyente.desTiempoInfusion,
              velocidadInfusion:data.detalleDiluyente.refVelInfusion,
           
          }

          
        //   this.modelAbajoNtp2 = {
        //     ...this.modelAbajoNtp2,
         
        //     diluyente:data.detalleDiluyente.desCortaDiluyente,
        //     dosis:data.detalleDiluyente.numDosisDiluyente,
        //     unidadMedidaDil:data.detalleDiluyente.refUnidadMinMedida,
            
        // }
        }
           

    
    
          this.dataComponentes = data.componentes
       
                   
        });

        this.catalogService.getTipoComponente()
        .then(
          (data: any) => {
            if (data) {
              ////debugger
              this.lsComponentes = data;
            
              let componentes=[];
              for (let index = 0; index <   this.lsComponentes.length; index++) {
                const element =   this.lsComponentes[index];
                let componente = this.dataComponentes.find(e => e.idComponente == element.id);
                let tabla;
                if(componente==null){
                  tabla={
                    nombre: element.desTipoComponente,
                    counter: 0,
                    id:element.id,
                    data: new MatTableDataSource<any>( []),
                    displayCols: this.displayedColumns
                  }
                }else{
                  tabla={
                    nombre: element.desTipoComponente,
                    counter: componente.data.length,
                    id:element.id,
                    data: new MatTableDataSource<any>(componente.data),
                    displayCols: this.displayedColumns
                  }
                }
                componentes.push(tabla);
              }
              this.mezclaDetails={
             
                componentes:componentes
              };
             
              this.cargarTablas(true);
    
    
            } 
          },
          (_err) => {
          //  this._alertServices.error("<strong>Error</strong> al obtener conceptos de tipoComponente");
          }
        );
      
    }
    dialogoRechazar(){
      //this.rechazarMezcla(1,"Observaciones de la solicitud");
      const dialogRef = this._dialog.open(
        DialogFormlyComponent,
        this._dialogFormlyService.noAprobarMezclaPrescricion()
      );
  
      dialogRef.afterClosed().subscribe(
        async data => {
          //debugger
          if (data !=null) {
            
            this.rechazarMezcla(data.motivo,data.observaciones);
          }
        }
      );
  }
  rechazarMezcla(idMotivo,obs){
      let request=
           {
               "idMezclaIdDiaDosis": this.idMezclaAplicDiaDosis,
               "idUsuarioEvalPrep": this.usuario.cemetUsuarios[0].id,
               "idMotivoRechazo": idMotivo,
               "cveUsuarioAlta": this.usuario.cemetUsuarios[0].id,
               "refObservaciones": obs
             }
           this.mezclaService.rechazarMezclaPrescripcion(request)
           .then(data => {
               if(data){
                
                   this._alertServices.success('Mezcla(s) con número '+this.cveFolioMezclaDosis+' rechazada(s). <br>Total de folios rechazados: '+data.actualizados                  );
                  setTimeout(() =>  this._router.navigate([this._nav.prescripcion]), 4000);
               }
           });
       }
}
