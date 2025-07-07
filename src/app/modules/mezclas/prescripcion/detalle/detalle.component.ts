import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { GeneralComponent } from 'src/app/modules/general/general.component';
import { HeaderDetalleMezclaComponent } from "../../../../shared/layout/header-detalle-mezcla/header-detalle-mezcla.component";
import { MatTableDataSource } from '@angular/material/table';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { MatDialog } from '@angular/material/dialog';
import { MezclasService } from 'src/app/shared/services/mezclas.service';
import { AuthService } from 'src/app/modules/login/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { DialogFormlyComponent } from 'src/app/shared/dialog-formly/dialog-formly.component';
import { DetalleProgresoComponent } from "../../detalle-progreso/detalle-progreso.component";
import { NAV } from 'src/app/shared/config/global';
import { SessionStorageService } from 'src/app/modules/login/services/session-storage.service';
import { Sort } from '@angular/material/sort';

@Component({
    selector: 'app-detalle',
    standalone: true,
    templateUrl: './detalle.component.html',
    styleUrls: ['./detalle.component.css'],
    imports: [
        CommonModule,
        SharedModule,
        HeaderDetalleMezclaComponent,
        DetalleProgresoComponent
    ]
})
export class DetalleComponent  extends GeneralComponent  {
    disabled: boolean = false
    usuario:any;
    idMezclaAplicDiaDosis:any;
    idMezcla:any;
    tipoMezcla:any;
    citotoxico:boolean=false;

    displayedColumns = ['medicamento', 'dosis', 'unidadMedida']
    myData;
    tableDS: MatTableDataSource<any>;

    myData1;
    tableDS1: MatTableDataSource<any>;
    
    cveFolioMezclaDosis:any; 
    cveFolioSolicitudMezcla:any;
    desDiagnosticoCie:any;
    desServicioEspecialidad:any;
    desTipoMezcla:any;
    idSolicitudMezcla:any;
    refCveCama:any;
    refCvePiso:any;
    refUnidadMedicaHosp:any;
    isRatificada: boolean;

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

    model: any = { };
    form = new FormGroup({});
    fields: FormlyFieldConfig[] = [
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            className: "col-lg-6 col-md-8",
            key: 'diluyente',
            type: 'text2',
            props: {
              label: ' Diluyente'
            }
          },
          {
            className: "col-lg-3 col-md-2",
            key: 'dosis',
            type: 'text2',
            props: {
              label: ' Dosis'
            }
          },
          {
            className: "col-lg-3 col-md-2",
            key: 'unidadMedida',
            type: 'text2',
            props: {
              label: ' Unidad de medida'
            }
          },
  
        ]
      },
    ];

    modelAbajoNtp4: any = {};
    formAbajoNtp4 = new FormGroup({});
    fieldsAbajoNtp4: FormlyFieldConfig[] = [
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            className: "col-lg-2 col-md-2",
            key: 'fechaAplicacion',
            type: 'text2',
            props: {
              label: ' Fecha de aplicación'
            }
          },
          {
            className: "col-lg-2 col-md-2",
            key: 'cada',
            type: 'text2',
            props: {
              label: ' Cada'
            }
          },
          {
            className: "col-lg-2 col-md-2",
            key: 'numTotalDosis',
            type: 'text2',
            props: {
              label: ' Número total de dosis'
            }
          },
          {
            className: "col-lg-2 col-md-2",
            key: 'viaAdministracion',
            type: 'text2',
            props: {
              label: ' Vía de administración'
            }
          },
          {
            className: "col-lg-2 col-md-2",
            key: 'tiempoInfusion',
            type: 'text2',
            props: {
              label: ' Tiempo de infusión'
            }
          },
          {
            className: "col-lg-2 col-md-2",
            key: 'velocidadInfusion',
            type: 'text2',
            props: {
              label: 'Velocidad de infusión (ml/hrs)'
            }
          },
        ]
      }
  
    ];

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
          className: "col-lg-3 col-md-6",
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
          className: "col-lg-3 col-md-6",
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
      


      ]
    },
  ]
  role: any;
  obsRatificacion: any;
    constructor(
        public authService: AuthService,
        public dialog: MatDialog,
        private mezclaService: MezclasService,
        private _Activatedroute: ActivatedRoute,

       
      ) {
        super();
    
      }

    ngOnInit(): void {
    
        this.usuario = this._accountService.getUser();

        console.log('modelo -----> ',this.dataResolucion.modelo)

        if (this.dataResolucion.modelo.idEstatusMezcla === 13) {
          this.isRatificada = true;
        }else{
          this.isRatificada = false;
        }

          this.idMezclaAplicDiaDosis=this.dataResolucion.modelo.idMezclaAplicDiaDosis; 
          this.idMezcla=this.dataResolucion.modelo.idMezcla; 
          this.tipoMezcla=this.dataResolucion.modelo.idTipoMezcla;
          if(this.tipoMezcla==1)this.citotoxico=true;

          if(this.citotoxico==true)
          this.getDetalleListCitotoxico(this.idMezclaAplicDiaDosis);
          else
          this.getDetalleList(this.idMezclaAplicDiaDosis);

          console.log("tipo mezcla", this.tipoMezcla);
        
          let usuario = this._accountService.getUser();
          console.log('########## usuario ',usuario)
          this.role = usuario.cemetUsuarios[0].idPerfil.id;

          console.log('########## role ',this.role)

/*

        this.myData = [...Array(4).keys()].map((index) => ({
            medicamento: "Aciclovir / hipromelosa 5mg envase con gotero integral con 15ml.",
            dosis: Math.floor(Math.random() * 100),
            unidadMedida: "miligramos",
            

        }))*/


      

     //   this.tableDS = new MatTableDataSource(this.myData.slice(0, this.ConfigTabla.NUM_ELEMENTOS_TABLA));

    }

    getDetalleList(idMezclaAplicDiaDosis) {

        this.mezclaService.getDetalleMezclaPre(idMezclaAplicDiaDosis)
          .then(data => {
            console.log(data)

            this.cveFolioMezclaDosis=data.detalleMezcla.cveFolioMezclaDosis;
            this.cveFolioSolicitudMezcla=data.detalleMezcla.cveFolioSolicitudMezcla;
            this.desDiagnosticoCie=data.detalleMezcla.desDiagnosticoCie;
            this.desServicioEspecialidad=data.detalleMezcla.desServicioEspecialidad;
            if(this.citotoxico==true)
            this.desTipoMezcla="Citotóxico";
            else
            this.desTipoMezcla=data.detalleMezcla.desTipoMezcla;

            this.idSolicitudMezcla=data.detalleMezcla.idSolicitudMezcla;
            this.refCveCama=data.detalleMezcla.refNombreCama;
            this.refCvePiso=data.detalleMezcla.refNombrePiso;
            this.refUnidadMedicaHosp=data.detalleMezcla.desUnidadMedica;
            this.obsRatificacion = data.detalleMezcla.refObsRatifica

            this.model = {
                ...this.model,
             
                diluyente:data.diluyentes[0].desCortaDiluyente,
                dosis:data.diluyentes[0].numDosisDiluyente,
                unidadMedida:data.diluyentes[0].refUnidadMinMedida,
                fechaAplicacion:data.diluyentes[0].fechaAplicacion,
                cada: data.diluyentes[0].desAplicacionCada,
                numTotalDosis: data.diluyentes[0].totalDosis,
                viaAdministracion:data.diluyentes[0].desViaAdministracion,
                tiempoInfusion:data.diluyentes[0].desTiempoInfusion,
                velocidadInfusion:data.diluyentes[0].rsefVelInfusion,
            }

            this.modelAbajoNtp4 = {
              ...this.modelAbajoNtp4,
           
              fechaAplicacion:data.diluyentes[0].fechaAplicacion,
              cada: data.diluyentes[0].desAplicacionCada,
              numTotalDosis: data.diluyentes[0].totalDosis,
              viaAdministracion:data.diluyentes[0].desViaAdministracion,
              tiempoInfusion:data.diluyentes[0].desTiempoInfusion,
              velocidadInfusion:data.diluyentes[0].refVelInfusion,
          }


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
           
            this.myData = data.medicamentos
            if(this.citotoxico){
                this.myData1= data.diluyentes;
                if (this.myData1.length != 0 )             
                    this.tableDS1 = new MatTableDataSource(this.myData1);
                  else
                    this.tableDS1 = null
                   
            }
            if (this.myData.length != 0 ) {
             
              this.tableDS = new MatTableDataSource(this.myData);

              //this.totalElements = data.nutricionHistoryList.totalElements
            }else{
              this.tableDS = null
              //this.totalElements = null
            }
            
          });
      }
    getDetalleListCitotoxico(idMezclaAplicDiaDosis) {

        this.mezclaService.getDetalleMezclaCitoPre(idMezclaAplicDiaDosis)
          .then(data => {

            this.cveFolioMezclaDosis=data.detalleMezcla.cveFolioMezclaDosis;
            this.cveFolioSolicitudMezcla=data.detalleMezcla.cveFolioSolicitudMezcla;
            this.desDiagnosticoCie=data.detalleMezcla.desDiagnosticoCie;
            this.desServicioEspecialidad=data.detalleMezcla.desServicioEspecialidad;
            this.desTipoMezcla=data.detalleMezcla.desTipoMezcla;
            this.idSolicitudMezcla=data.detalleMezcla.idSolicitudMezcla;
            this.refCveCama=data.detalleMezcla.refNombreCama;
            this.refCvePiso=data.detalleMezcla.refNombrePiso;
            this.refUnidadMedicaHosp=data.detalleMezcla.desUnidadMedica;

            this.modelAbajoNtp3 = {
                ...this.modelAbajoNtp3,
             
                fecApl:data.generalCitotoxico.fechaAplicacion,
                cada:data.generalCitotoxico.desAplicacionCada,
                numDosis:data.generalCitotoxico.totalDosis,
                viaAdmon:data.generalCitotoxico.desViaAdministracion,
                unidadTiempo: data.generalCitotoxico.desTiempoInfusion,
            }


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
           
            this.myData = data.medicamentos
            if(this.citotoxico){
                this.myData1= data.diluyentes;
                if (this.myData1.length != 0 )             
                    this.tableDS1 = new MatTableDataSource(this.myData1);
                  else
                    this.tableDS1 = null
                   
            }
            if (this.myData.length != 0 ) {
             
              this.tableDS = new MatTableDataSource(this.myData);

              //this.totalElements = data.nutricionHistoryList.totalElements
            }else{
              this.tableDS = null
              //this.totalElements = null
            }
            
          });
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
                .then(async data => {
                    if(data){

                      this._alertServices.success('Mezcla(s) con número '+this.cveFolioMezclaDosis+' aprobada(s).<br> Total de folios aprobados: ' + data.actualizados);
                        
                      // setTimeout(() =>  this._router.navigate([this._nav.prescripcion]), 4000);

                      // this._alertServices.success('La mezcla <b>'+this.cveFolioMezclaDosis+'</b> fue aprobada.');
                  
                      setTimeout(() =>  this._router.navigate([this._nav.prescripcion]), 4000);

                    }
                });


          //}
        //}
      //);
    }
    
    dialogoRechazar(){


      /*const dialogRef1 = this._dialog.open(
        DialogComponent,
        this._dialogService.estasSeguroDeseasNoAprobarMezcla()
      );*/

      //dialogRef1.afterClosed().subscribe(
        //async data => {
            //debugger
          //if (data) {
            const dialogRef = this._dialog.open(
              DialogFormlyComponent,
              this._dialogFormlyService.noAprobarMezclaPrescricion()
            );
        
            dialogRef.afterClosed().subscribe(
              async data => {
                  //debugger
                if (data!=null) {
                  this.rechazarMezcla(data.motivo,data.observaciones);
                }
              }
            );
  
          //}
        //}
      //);
     


        
       
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
                  
                    //this._alertServices.success('La mezcla <strong>'+this.cveFolioMezclaDosis+'</strong> no fue aprobada.');
                    this._alertServices.success('Mezcla(s) con número '+this.cveFolioMezclaDosis+' rechazada(s). <br>Total de folios rechazados: '+data.actualizados                  );
                    setTimeout(() =>  this._router.navigate([this._nav.prescripcion]), 4000);
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

        shortTable1(sort:Sort) {
          console.log("colName " + sort);
      
          const array = this.tableDS1.data ;
          let des = sort.direction == 'desc';
          const sortedArray = this.sortArrayOfObjects(array, sort.active, des);    
          //let otherModel = {...this.modelo};
         // otherModel.content = sortedArray;
         // console.log(otherModel)
          this.tableDS1 = new MatTableDataSource(sortedArray);
        }

 }
