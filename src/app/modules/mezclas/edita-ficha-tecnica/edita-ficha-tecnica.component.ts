import { CommonModule, formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { GeneralComponent } from 'src/app/modules/general/general.component';
import { AuthService } from 'src/app/modules/login/services/auth.service';
import { TituloComponent } from 'src/app/shared/layout/frames/titulo/titulo.component';
import { CatalogoService } from 'src/app/shared/services/catalogo.service';
import { MezclasService } from 'src/app/shared/services/mezclas.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { Sort } from '@angular/material/sort';
import { NoMedicamentoComponent } from 'src/app/shared/layout/no-medicamento/no-medicamento.component';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-edita-ficha-tecnica',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    TituloComponent,
    NoMedicamentoComponent
  ],
  templateUrl: './edita-ficha-tecnica.component.html',
  styleUrls: ['./edita-ficha-tecnica.component.scss']
})
export class EditaFichaTecnicaComponent extends GeneralComponent {

  tableDS: MatTableDataSource<any>;
  collectionSize: number = 0;
  displayedColumns = ['no', 'desCorta']
  modelSelected: any = {};
  isConsulta: boolean = false
  nvosDiluyentes = [];
  lotes = []
  lstMedicamentos: any
  listaSinDuplicados: any[];
  nvosLotes: any[];
  lstMediSAI: any;
  lstId = [];
  medicamentosUpTotal: any;
  btnAsigna: boolean = false
  fechas: any
  myData: any;
  listDiluyente: any;
  fichaTecnica: any;
  $obsCambio = new Subject<any>();
  btnActualiza: boolean = false
  actualizado: boolean;

  diluyentesDataSource = new MatTableDataSource<any>([]);
  diluyentesDisplayedColumns: string[] = [
    'Diluyente',
    'perDilacion',
    'redFria',
    'eliminar'
  ];
  tipoPeriodoVal: any=0;




  constructor(
    public authService: AuthService,
    public dialog: MatDialog,
    private mezclaService: MezclasService,
    private catalogService: CatalogoService

  ) {
    super();

  }

  ngAfterViewInit() {
    this.actualizado = false
  }









  model1: any = {};
  form1 = new FormGroup({});
  fields1: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: "col-lg-4 col-md-6",
          key: 'medicamento',
          type: 'select',
          props: {
            label: 'Medicamento',
            placeholder: 'Ingresa un medicamento',
            required: true,
            valueProp: 'id',
            labelProp: 'desCorta',
            options: this.catalogService.getMedicamentosFT(),
          },

        },
        {
          className: "col-lg-4 col-md-6",
          key: 'fabricante',
          type: 'select',
          props: {
            label: 'Fabricante',
            placeholder: 'Ingresa un fabricante',
            required: true,
            valueProp: 'id',
            labelProp: 'desFabricante',
            options: this.catalogService.getFabricanteFT(),
            disabled: true
          },
          hooks: {
            onInit: async (field) => {
              const medicamento = field.form.get('medicamento');
              if (medicamento != null) {
                medicamento.valueChanges.subscribe((x) => {
                  if (x != null) {
                    this.catalogService.getFabricanteByMed(x).then(data => {
                      if (data) {
                        field.props.options = data
                      }


                    })
                    field.props.disabled = false

                  } else {
                    field.props.disabled = true
                  }

                });
              }
            },
          }

        },
        {
          className: "col-lg-4 col-md-6",
          key: 'marca',
          type: 'select',
          props: {
            label: 'Marca',
            placeholder: 'Ingresa una marca',
            required: true,
            valueProp: 'id',
            labelProp: 'desMarca',
            options: [],
            disabled: true
          },
          hooks: {
            onInit: async (field) => {
              const fabricante = field.form.get('fabricante');
              if (fabricante != null) {
                fabricante.valueChanges.subscribe((x) => {
                  if (x != null) {
                    field.props.disabled = false
                    this.catalogService.getMarcaByFabricanteFT(this.model1.medicamento, x).then(data => {
                      field.props.options = data
                    })

                  } else {
                    field.props.disabled = true
                  }

                });
              }
            },
          }

        },


        // },

      ]
    },



  ];



  model: any = {};
  form = new FormGroup({});
  fields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        /* se comenta por mejora 2
        {
          className: "col-lg-3 col-md-6",
          key: 'Vehiculo',
          type: 'input',
          props: {
            label: 'Vehículo',
            required: true,
            placeholder: 'Ingresa vehículo',
            maxLength: 15,
          }

        },*/
        {
          className: "col-lg-3 col-md-6",
          key: 'dosisMedicV',
          type: 'decimal',
          props: {
            label: 'Dosis de medicamento (mg)',
            required: true,
            placeholder: 'Ingresa vehículo',
         //   maxLength: 7,
            numEnteros:5,
            numDecimales:1,           
            attributes: {
              autocomplete: 'off',
            },
          },
          hooks: {
               
    
            onInit: async (field) => {
           
                         const dosisMedicV = field.form.get('dosisMedicV');
                          const concentracion = field.form.get('Concentracion');

                         if (dosisMedicV != null) {
                          dosisMedicV.valueChanges.subscribe((x) => {
                     //       field.props.max = 99999.9;
                       //     field.props.min = 0;
                          
                             if (x != null && x != '' && Number(field.form.controls['volumenReconsV'].value)>0 ) {

                              let result=""+Number(x)/Number(field.form.controls['volumenReconsV'].value);
                              field.form.get('Concentracion').setValue(result.substring(0,7));
                         
                               
                             }
                           });
           
                         }
           
                       },
           
                 },/*
                 validation: {
                  messages: {
                    pattern: (error: any, field: FormlyFieldConfig) => `Número decimal: 99999.9`,
                    max: (error: any, field: FormlyFieldConfig) => this._Mensajes.MSG41,
                    min: (error: any, field: FormlyFieldConfig) => this._Mensajes.MSG41,
                  }
      
      
                },*/
        },
        {
          className: "col-lg-3 col-md-6",
          key: 'volumenReconsV',
          type: 'decimal',
          props: {
            label: 'Volumen de reconstitución (ml)',
            required: true,
            placeholder: 'Ingresa vehículo',
            numEnteros:4,
            numDecimales:1,
            //maxLength: 6,
            //pattern: /^([0-9]?[0-9]?[0-9]?[0-9][.][0-9]?)$/,
            attributes: {
              autocomplete: 'off',
            },
          },
           hooks: {
               
    
            onInit: async (field) => {
           
                         const volumenReconsV = field.form.get('volumenReconsV');
                       
                         const concentracion = field.form.get('Concentracion');

                         if (volumenReconsV != null) {
                          volumenReconsV.valueChanges.subscribe((x) => {
                            
                           // field.props.max = 9999.9;
                            //field.props.min = 0;
                             if (x != null && x != '' && field.form.controls['dosisMedicV'].value!=null) {

                              if(Number(x)<=0){
                                field.form.get('volumenReconsV').setValue(null);
                               
                              }else{
                                let result=""+Number(field.form.controls['dosisMedicV'].value)/Number(x);
                                field.form.get('Concentracion').setValue(result.substring(0,7));
                              }

                            
                               
                             }
                           });
           
                         }
           
                       },
           
                 },/*
                 validation: {
                  messages: {
                    pattern: (error: any, field: FormlyFieldConfig) => `Número decimal: 9999.9`,
                    max: (error: any, field: FormlyFieldConfig) => this._Mensajes.MSG41,
                    min: (error: any, field: FormlyFieldConfig) => this._Mensajes.MSG41,
                  }
      
      
                },*/
        },
        {
          className: "col-lg-3 col-md-6",
          key: 'Concentracion',
          type: 'decimal',
          props: {
            label: 'Concentración (mg/ml)',
            required: true,
            disabled:true,
            placeholder: 'Ingresa concentración',
            numEnteros:5,
            numDecimales:1,
           // pattern: /^([0-9]?[0-9]?[0-9]?[0-9]?[0-9][.][0-9]?)$/,
            attributes: {
              autocomplete: 'off',
            },
            maxLength: 7,
          } ,
     
        },/* Se quita por mejora 2
        {
          className: "col-lg-3 col-md-6",
          key: 'vialAR',
          type: 'input',
          props: {
            label: 'Vial abierto/reconstituido',
            required: true,
            placeholder: 'Ingresa vial',
            maxLength: 30,
          }

        },*/
        {
          className: "col-lg-3 col-md-6",
          key: 'reqCons',
          type: 'select',
          props: {
            label: 'Requisito de conservación',
            required: true,
            placeholder: 'Selecciona un requisito',

            valueProp: 'id',
            labelProp: 'desConservacionMedic',
            options: []
          },
          hooks: {
            afterViewInit: async (field) => {
              this.catalogService.getConservacionMedic()
                .then(
                  (data: any) => {
                    if (data) {
                      field.props.options = data;
                    } else
                      this._alertServices.error("<strong>Error</strong> al obtener conceptos de conservación");
                  },
                  (_err) => {
                    this._alertServices.error("<strong>Error</strong> al obtener conceptos de conservación");
                  }
                );
            },
          }


        },
      ]
    },/*Se quitan por mejora 2
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: "col-lg-6 col-md-6",
          key: 'perValVial',
          type: 'input-mask',
          props: {
            label: 'Periodo de validez del vial abierto/reconstituido ambiente',
            required: true,
            placeholder: 'Captura periodo ',
            appInputMaskType: 'integer',
            maxLength: 2,
          }

        },
        {
          className: "col-lg-6 col-md-6",
          key: 'perValVialAbierto',
          type: 'input-mask',
          templateOptions: {
            label: 'Periodo de validez del vial abierto/reconstituido o red fría',
            placeholder: 'Captura periodo  ',
            required: true,
            appInputMaskType: 'integer',
            maxLength: 2,
          },


        },

      ]
    }*/
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        //se comenta mejora 2 y 3 lo cambia todo.
        /*{
          className: "col-lg-6 col-md-6",
          key: 'perValVial',
          type: 'input-mask',
          props: {
            label: 'Periodo de validez del vial abierto/reconstituido ambiente',
            required: true,
            placeholder: 'Captura periodo ',
            appInputMaskType: 'integer',
            maxLength: 2,
          }

        },
        {
          className: "col-lg-6 col-md-6",
          key: 'perValVialAbierto',
          type: 'input-mask',
          templateOptions: {
            label: 'Periodo de validez del vial abierto/reconstituido o red fría',
            placeholder: 'Captura periodo  ',
            required: true,
            appInputMaskType: 'integer',
            maxLength: 2,
          },
          hooks: {
            onInit: async (field) => {

            },
          }

        },*/
        {
          fieldGroupClassName: 'row',
          fieldGroup: [
            {
              className: "col-lg-6 col-md-6",
              key: 'tipoPeriodoValidez',
              type: 'select',
              props: {
                label: 'Tipo de período de validez',
                required: true,
                placeholder: 'Selecciona tipo de período',
                valueProp: 'id',
                labelProp: 'desTipoPeriodoValidez',
                options:[]
              
              
              },      
              hooks: {
               
    
                onInit: async (field) => {
               

                  this.catalogService.getFichaTecnicaTipoPeriodoValidez()
                  .then(
                    (data: any) => {
                      if (data) {
                                               field.props.options = data;
                      } else
                        this._alertServices.error("<strong>Error</strong> al obtener conceptos de Periodo de Validez");
                    },
                    (_err) => {
                      this._alertServices.error("<strong>Error</strong> al obtener conceptos de Periodo de Validez");
                    }
                  );

                             const tipoPeriodoValidez = field.form.get('tipoPeriodoValidez');
                            
                             if (tipoPeriodoValidez != null) {
                              tipoPeriodoValidez.valueChanges.subscribe((x) => {
                                 if (x != null && x != '') {
                                   this.tipoPeriodoVal=x;
                                   this.model.tipoPeriodoValidez=x;
                               
                                   console.log("seleccionado periodo validez",x);
                                   if(x==1){
                                    this.fieldsAmbiente[0].hide = false;
                                    this.fieldsRedFria[0].hide = true;
                                   }else if(x==2){
                                    this.fieldsAmbiente[0].hide = true;
                                    this.fieldsRedFria[0].hide = false;
                                   }else if(x==3){
                                    this.fieldsAmbiente[0].hide = false;
                                    this.fieldsRedFria[0].hide = false;
                                   }else{
                                    this.fieldsAmbiente[0].hide = true;
                                    this.fieldsRedFria[0].hide = true;
                                   }
                                
                                 
                                 }else{
                                  this.fieldsAmbiente[0].hide = true;
                                  this.fieldsRedFria[0].hide = true;
                                 }
                               });
               
                             }
               
                           },
               
                         },
            
              
    
            },
           
          ]
        },
     
      ]
    }
  ]

  modelAmbiente: any = {};
  formAmbiente=new FormGroup({});
  fieldsAmbiente: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: "col-lg-6 col-md-6",
          key: 'perValVial',
          type: 'input-mask-reloj',
          props: {
            label: 'Período de validez reconstituido ambiente (hrs.)',
            required: true,
            placeholder: 'Captura periodo ',
            appInputMaskType: 'integer',
            maxLength: 2,
          },
          hooks: {
            onInit: field => {
              const campo = field.form.get('perValVial');
              if (campo != null) {
                campo.valueChanges.subscribe(x => {
                  if (x != null && x != '') {
                    
                    
                        field.form.get('temperaturaAmbiente').enable();
                  }else field.form.get('temperaturaAmbiente').disable();
                  
                  
                })
              }
            }
          },

        },
        {
          className: "col-lg-6 col-md-6",
          key: 'temperaturaAmbiente',
          type: 'input-mask',
          
          templateOptions: {
            label: 'Temperatura de estabilidad ambiente (°C)',
            placeholder: 'Captura temperatura',
            required: true,
            appInputMaskType: 'integer',
            pattern: /^([0-9][0-9]?)$/,
            maxLength: 2,
            disabled:true,
            
          },
          hooks: {
            onInit: field => {
              const campo = field.form.get('temperaturaAmbiente');
              if (campo != null) {
                campo.valueChanges.subscribe(x => {
              
                    field.props.max = 25;
                    field.props.min = 1;
                  
                })
              }
            }
          },
          validation: {
            messages: {
              pattern: (error: any, field: FormlyFieldConfig) => `Número entero: 1 a 25`,
              max: (error: any, field: FormlyFieldConfig) => this._Mensajes.MSG41,
              min: (error: any, field: FormlyFieldConfig) => this._Mensajes.MSG41,
            }


          },
      

        },
      ]
    }

  ]

  modelRedFria: any = {};
  formRedFria=new FormGroup({});
  fieldsRedFria: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: "col-lg-6 col-md-6",
          key: 'perValVialAbierto',
          type: 'input-mask-reloj',
          templateOptions: {
            label: 'Período de validez reconstituido red fría(hrs.)',
            placeholder: 'Captura periodo  ',
            required: true,
            appInputMaskType: 'integer',
            maxLength: 2,
           
          },
          hooks: {
            onInit: field => {
              const campo = field.form.get('perValVialAbierto');
              if (campo != null) {
                campo.valueChanges.subscribe(x => {
                  if (x != null && x != '') {
                    
                    
                        field.form.get('temperaturaRedFria').enable();
                  }else field.form.get('temperaturaRedFria').disable();
                  
                  
                })
              }
            }
          },

        },
        {
          className: "col-lg-6 col-md-6",
          key: 'temperaturaRedFria',
          type: 'input-mask',
          templateOptions: {
            label: 'Temperatura de estabilidad red fría (°C)',
            placeholder: 'Captura temperatura',
            required: true,
            appInputMaskType: 'integer',
            maxLength: 1,
            pattern: /^([0-9][0-9]?)$/,
          },
          hooks: {
            onInit: field => {
              const campo = field.form.get('temperaturaRedFria');
              if (campo != null) {
                campo.valueChanges.subscribe(x => {
              
                    field.props.max = 8;
                    field.props.min = 2;
                  
                })
              }
            }
          },
          validation: {
            messages: {
              pattern: (error: any, field: FormlyFieldConfig) => `Número entero: 2 a 8`,
              max: (error: any, field: FormlyFieldConfig) => this._Mensajes.MSG41,
              min: (error: any, field: FormlyFieldConfig) => this._Mensajes.MSG41,
            }


          },

        },
      ]
    }

  ]

  modelDil: any = {};
  formDil = new FormGroup({});
  fieldsDil: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: "col-lg-4 col-md-6",
          key: 'diluyente',
          type: 'select',

          props: {
            label: 'Diluyente',
            // required: true,
            placeholder: 'Selecciona un diluyente',
            valueProp: 'id',
            labelProp: 'desCortaDiluyente',

            options: [],
          },
          hooks: {
            afterViewInit: async (field) => {
              this.catalogService.getDiluyentes()
                .then(
                  (data: any) => {
                    if (data) {
                      this.listDiluyente = data
                      field.props.options = data;
                    } else
                      this._alertServices.error("<strong>Error</strong> al obtener conceptos de Diluyente");
                  },
                  (_err) => {
                    this._alertServices.error("<strong>Error</strong> al obtener conceptos de Diluyente");
                  }
                );
            }

          },
        },
        {
          className: "col-lg-4 col-md-6",
          key: 'perValAmbiente',
          type: 'input-mask-reloj',
          props: {
            label: 'Período de validez diluido ambiente (hrs.)',
            //required: true,
            placeholder: 'Captura periodo ',
            appInputMaskType: 'integer',
            maxLength: 2,
          }

        },
        {
          className: "col-lg-4 col-md-6",
          key: 'perValRedFria',
          type: 'input-mask-reloj',
          props: {
            label: 'Período de validez diluido red fría (hrs.)',
            //required: true,
            placeholder: 'Captura periodo ',
            appInputMaskType: 'integer',
            maxLength: 2,
          }

        },
     
      ]
    },

  ]
  //auxiliares

  //auxiliares
  ngOnInit() {
  }

  agregaDiluyenteDis() {
    if (this.modelDil.diluyente != null && this.modelDil.perValRedFria != null && this.modelDil.perValAmbiente != null) {
      return false
    } else {
      return true
    }

  }

  async buscaMedicamento() {

    if (this.collectionSize != null && this.collectionSize > 0) {

      const dialogRef = this._dialog.open(
        DialogComponent,
        await this._dialogService.deseasConsultarFT()
      );


      dialogRef.afterClosed().subscribe(
        async data => {
          this.nvosDiluyentes = []
          this.btnActualiza = false
          this.formDil.reset()
          this.form.reset()
          this.formRedFria.reset()
          this.formAmbiente.reset()
          this.diluyentesDataSource = new MatTableDataSource([])

          if (data) {
            this.isConsulta = false
            this.tableDS = new MatTableDataSource([])
            this.catalogService.getMedicamentosFT().subscribe(data => {
              if (data) {
                this.lstMedicamentos = data
                let arrayMed = []
                for (let i = 0; i < this.lstMedicamentos.length; i++) {
                  if (this.lstMedicamentos[i].id == this.model1.medicamento) {
                    arrayMed.push(this.lstMedicamentos[i])
                    this.myData = arrayMed
                    this.tableDS = new MatTableDataSource(this.myData)
                    this.collectionSize = this.myData.length

                  }

                }

              }
            })

          }
        })
    } else {
      this.nvosDiluyentes = []
      this.btnActualiza = false
      this.formDil.reset()
      this.form.reset()
      this.formAmbiente.reset()
      this.formRedFria.reset()
      this.diluyentesDataSource = new MatTableDataSource([])
      this.isConsulta = false
      this.tableDS = new MatTableDataSource([])
      this.catalogService.getMedicamentosFT().subscribe(data => {
        if (data) {
          this.lstMedicamentos = data
          let arrayMed = []
          for (let i = 0; i < this.lstMedicamentos.length; i++) {
            if (this.lstMedicamentos[i].id == this.model1.medicamento) {
              arrayMed.push(this.lstMedicamentos[i])
              this.myData = arrayMed
              this.tableDS = new MatTableDataSource(this.myData)
              this.collectionSize = this.myData.length

            }

          }

        }
      })
    }


  }

  agregarDiluyente() {



    let diluyenteEle = this.listDiluyente.find(e => e.id == this.modelDil.diluyente);
    console.log(diluyenteEle)
    let newRow = {

      'desCortaDiluyente': diluyenteEle.desCortaDiluyente,
      'idDiluyente': diluyenteEle.id,
      'numValDilucionRfria': this.modelDil.perValRedFria,
      'numValDilucionAmb': this.modelDil.perValAmbiente
    }
    let newRow2 = {
      "idDiluyente": diluyenteEle.id,
      "numValDilucionRfria": this.modelDil.perValRedFria,
      "numValDilucionAmb": this.modelDil.perValAmbiente
    }

    console.log(newRow);
    const newData = [...this.diluyentesDataSource.data];
    newData.push(newRow);
    this.nvosDiluyentes.push(newRow2);
    this.diluyentesDataSource.data = newData;

    console.log(" this.nvosDiluyentes", this.nvosDiluyentes);
    console.log("datasource data", this.diluyentesDataSource.data);

    this.btnActualiza = true
    this.actualizado = false

    this.formDil.reset()



  }

  async highlight(row?) {
    console.log(row)
    this.modelSelected = row
    this.isConsulta = true

    await this.mezclaService.validaRecetaColectiva(this.model1.medicamento, this.model1.fabricante, this.model1.marca).then(data => {
      console.log(data)
      this.fichaTecnica = data
      if (data) {
//Se quitaron por Mejora 2
        // this.form.controls['Vehiculo'].setValue(this.fichaTecnica?.fichaTecnicaDetalles?.refVehiculo)
       // this.form.controls['vialAR'].setValue(this.fichaTecnica?.fichaTecnicaDetalles?.refVialAbiertoReconst)
      //  this.form.controls['perValVial'].setValue(this.fichaTecnica?.fichaTecnicaDetalles?.valVialAbiertoAmb)
       // this.form.controls['perValVialAbierto'].setValue(this.fichaTecnica?.fichaTecnicaDetalles?.valVialAbiertoFria)

      
    
       this.form.controls['dosisMedicV'].setValue(this.fichaTecnica?.fichaTecnicaDetalles?.numDosisMedicamento)
       this.form.controls['volumenReconsV'].setValue(this.fichaTecnica?.fichaTecnicaDetalles?.numVolumenReconstitucion)
  
       this.form.controls['Concentracion'].setValue(this.fichaTecnica?.fichaTecnicaDetalles?.refConcentracion)
         this.form.controls['reqCons'].setValue(this.fichaTecnica?.fichaTecnicaDetalles?.idConservacionMed)
         this.form.controls['tipoPeriodoValidez'].setValue(this.fichaTecnica?.fichaTecnicaDetalles?.idTipoPeriodoValidez)
  
         this.modelAmbiente = {
          ...this.modelAmbiente,
          perValVial: this.fichaTecnica?.fichaTecnicaDetalles?.valVialAbiertoAmb,
          temperaturaAmbiente: this.fichaTecnica?.fichaTecnicaDetalles?.numTemperaturaEstbAmb,
              
        }
        this.modelRedFria = {
          ...this.modelAmbiente,
          perValVialAbierto:this.fichaTecnica?.fichaTecnicaDetalles?.valVialAbiertoFria,
          temperaturaRedFria: this.fichaTecnica?.fichaTecnicaDetalles?.numTemperaturaEstbRf,

        }
        
        this.tipoPeriodoVal=this.fichaTecnica?.fichaTecnicaDetalles?.idTipoPeriodoValidez;
     
        
       
        if(this.tipoPeriodoVal==1){
         // this.formAmbiente.disable();
          this.fieldsRedFria[0].hide = true;
          this.fieldsAmbiente[0].hide = false;
          }else if(this.tipoPeriodoVal==2){
         
          //this.formRedFria.disable();
          this.fieldsAmbiente[0].hide = true;
          this.fieldsRedFria[0].hide = false;
          }else if(this.tipoPeriodoVal==3){
         
            this.fieldsAmbiente[0].hide = false;
            this.fieldsRedFria[0].hide = false;
           // this.formRedFria.disable();
           // this.formAmbiente.disable();
        
            }
  


        for (let i = 0; i < data?.lstDiluyentes?.length; i++) {
          data.lstDiluyentes[i].numValDilucionAmb = data.lstDiluyentes[i].perValDilucionAmbiente
          data.lstDiluyentes[i].numValDilucionRfria = data.lstDiluyentes[i].perValDilucionFria

          delete data.lstDiluyentes[i].perValDilucionAmbiente
          delete data.lstDiluyentes[i].perValDilucionFria



        }
        this.diluyentesDataSource = new MatTableDataSource(data.lstDiluyentes)
      }
    })
  }

  onAtras() {
    this._router.navigate([this._nav.preparacion]);
  }

  resetForm() {
    this.model = { ...{} }
    this.form1.reset(this.model)
  }

  validaFiltros() {
    return this.form1.invalid;
  }

  btnDisabled() {
    if ((this.form.touched || this.btnActualiza == true) && this.actualizado == false && this.form.valid && ( (this.tipoPeriodoVal==1 &&  this.formAmbiente.valid) || (this.tipoPeriodoVal==2 &&  this.formRedFria.valid) || ((this.tipoPeriodoVal==3 &&  this.formAmbiente.valid && this.formRedFria.valid))  )) {
      return false
    } else {
      return true
    }

  }

  guardar() {

    this.isConsulta = false
    this.diluyentesDataSource = new MatTableDataSource<any>([]);
    this._alertServices.success('El <strong>lote se asignó al medicamento</strong> con éxito.')

  }


  async registrar() {
    console.log(this.modelSelected)
    let usuario = this._accountService.getUser();

    console.log(this.diluyentesDataSource.data)


    let model = {
      "id": this.fichaTecnica.fichaTecnicaDetalles.idFichaTecnica,
     // "vehiculo": this.model.Vehiculo, //se quita por mejora 2
      "concentracion": this.model.Concentracion,
      //"viaAbierto": this.model.vialAR,// se quita por mejora 2
      "idConservacionMed": this.model.reqCons,
      "numValVialAbierRecRf": this.modelRedFria.perValVialAbierto,
      "numValVialAbierRecAmb": this.modelAmbiente.perValVial,
      "lstDiluyente": this.nvosDiluyentes,
      "upFic": true,
      "cveUsuario": usuario.id,
      "numTemperaturaEstbAmb": this.modelAmbiente.temperaturaAmbiente,//pendientes mapeear
      "numTemperaturaEstbRf":this.modelRedFria.temperaturaRedFria,//pendiente mapear
      "idTipoPeriodoValidez": this.model.tipoPeriodoValidez,//pendiente mapear
      "numDosisMedicamento": this.model.dosisMedicV,
      "numVolumenReconstitucion": this.model.volumenReconsV
    }
    console.log(model)

    this.mezclaService.updateFT(model).then(async data => {
      if (data) {
        this._alertServices.success('Actualización de información exitosa.')
        this.btnActualiza = false
        this.actualizado = true
        this.form.markAsUntouched()
        this.nvosDiluyentes = []
        // this.isConsulta = false

        await this.mezclaService.validaRecetaColectiva(this.model1.medicamento, this.model1.fabricante, this.model1.marca).then(data => {
          console.log(data)
          this.fichaTecnica = data
          if (data) {
            this.actualizado = false
            //se comentan por mejora 2
            //this.form.controls['Vehiculo'].setValue(this.fichaTecnica?.fichaTecnicaDetalles?.refVehiculo)
            //this.form.controls['vialAR'].setValue(this.fichaTecnica?.fichaTecnicaDetalles?.refVialAbiertoReconst)
           // this.form.controls['perValVial'].setValue(this.fichaTecnica?.fichaTecnicaDetalles?.valVialAbiertoAmb)
           // this.form.controls['perValVialAbierto'].setValue(this.fichaTecnica?.fichaTecnicaDetalles?.valVialAbiertoFria)

            this.form.controls['dosisMedicV'].setValue(this.fichaTecnica?.fichaTecnicaDetalles?.numDosisMedicamento)
            this.form.controls['volumenReconsV'].setValue(this.fichaTecnica?.fichaTecnicaDetalles?.numVolumenReconstitucion)

            this.form.controls['Concentracion'].setValue(this.fichaTecnica?.fichaTecnicaDetalles?.refConcentracion)
            this.form.controls['reqCons'].setValue(this.fichaTecnica?.fichaTecnicaDetalles?.idConservacionMed)
           
            this.formAmbiente.controls['perValVial'].setValue(this.fichaTecnica?.fichaTecnicaDetalles?.valVialAbiertoAmb)
            this.formAmbiente.controls['temperaturaAmbiente'].setValue(this.fichaTecnica?.fichaTecnicaDetalles?.numTemperaturaEstbAmb)
           
            this.formRedFria.controls['perValVialAbierto'].setValue(this.fichaTecnica?.fichaTecnicaDetalles?.valVialAbiertoFria)
            this.formRedFria.controls['temperaturaRedFria'].setValue(this.fichaTecnica?.fichaTecnicaDetalles?.numTemperaturaEstbRf)
           

            for (let i = 0; i < data?.lstDiluyentes?.length; i++) {
              data.lstDiluyentes[i].numValDilucionAmb = data.lstDiluyentes[i].perValDilucionAmbiente
              data.lstDiluyentes[i].numValDilucionRfria = data.lstDiluyentes[i].perValDilucionFria

              delete data.lstDiluyentes[i].perValDilucionAmbiente
              delete data.lstDiluyentes[i].perValDilucionFria



            }
            this.diluyentesDataSource = new MatTableDataSource(data.lstDiluyentes)
          }
        })

      }
    })

  }



  replaceOrAppend(arr, val, compFn) {
    const res = [...arr];
    const i = arr.findIndex(v => compFn(v, val));
    if (i === -1) res.push(val);
    else res.splice(i, 1, val);
    return res;
  };

  shortTableDil(sort: Sort) {
    console.log("colName " + sort);

    const array = this.diluyentesDataSource.data;
    let des = sort.direction == 'desc';
    const sortedArray = this.sortArrayOfObjects(array, sort.active, des);
    this.diluyentesDataSource = new MatTableDataSource(sortedArray);
  }

  eliminarDil(element) {
    this.actualizado = false
    this.btnActualiza = true
    console.log(element)
    let newData = [...this.diluyentesDataSource.data];
    console.log(newData)
    const index = newData.findIndex((e) => e.idDiluyente === element.idDiluyente);
    newData.splice(index, 1);
    console.log(newData)


    let modelElimi = {
      "id": element.idDiluyente,
      "indActivo": 0
    }
    this.nvosDiluyentes.push(modelElimi)
    this.diluyentesDataSource.data = newData;
    this.lotes = newData

    console.log("Eliminados Lote", this.nvosDiluyentes);



  }

}
