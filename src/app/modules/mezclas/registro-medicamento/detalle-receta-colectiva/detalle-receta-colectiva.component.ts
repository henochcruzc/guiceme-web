import { CommonModule, formatDate } from '@angular/common';
import { AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { FormlyFieldConfig } from '@ngx-formly/core';
import * as moment from 'moment';
import { GeneralComponent } from 'src/app/modules/general/general.component';
import { TituloComponent } from 'src/app/shared/layout/frames/titulo/titulo.component';
import { CatalogoService } from 'src/app/shared/services/catalogo.service';
import { MezclasService } from 'src/app/shared/services/mezclas.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-detalle-receta-colectiva',
  standalone: true,
  templateUrl: './detalle-receta-colectiva.component.html',
  styleUrls: ['./detalle-receta-colectiva.component.css'],
  imports: [
    CommonModule,
    SharedModule,
    TituloComponent
  ]
})
export class DetalleRecetaColectivaComponent extends GeneralComponent implements OnInit, AfterViewInit {
  public minDate = moment(new Date()).format('YYYY-MM-DD');
  @Output() onSelected = new EventEmitter<any>();
  estadoMedicamento: any;
  listDiluyente: any;
  @Input() medicamentoDetails: any;
  nombreMedicamento: any;
  idMedicamento: any;
  idReceta: any;
  idRecColMedic: any;
  recetaColectiva: any;
  listConsMedic: any;
  lsFabricante: any;
  lsMarca: any;
  nvosLotes: any;
  nvosDiluyentes: any[];
  lsEliminadosLote: any;
  lsEliminadosDiluyentes: any[];
  usuario: any;
  fichaTecnicaDetalles: any;
  indGuardadoCompleto: boolean = true;
  numMedicamento: any;
  lstMedicamentos: any
  agregaDisabled: boolean = true
  listaSinDuplicados: any[];
  fechaRequired: boolean = true;
  btnAgregaLote: boolean = true;
  btnAgregaCantidadEnvase: boolean;
  existeFicha: any
  tipoPeriodoVal: any;


  constructor(private cd: ChangeDetectorRef,
    private catalogService: CatalogoService,
    private activatedRoute: ActivatedRoute,
    private mezclasService: MezclasService) {
    super();

  }


  antibioticosDataSource = new MatTableDataSource<any>([]);
  diluyentesDataSource = new MatTableDataSource<any>([]);

  antibioticosDisplayedColumns: string[] = [
    'lote',
    'fabricante',
    'marca',
    'numEnvase',
    'eliminar'
  ];

  diluyentesDisplayedColumns: string[] = [
    'Diluyente',
    'redFria',
    'perDilacion',
    'eliminar'
  ];
  medicamentosTotal: number = 0;
  totalEvases: number = 0;
  
  modelTipoMezcla: any = {};
  formTipoMezcla = new FormGroup({});
  fieldsTipoMezcla: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: "col-lg-4 col-md-6",
          key: 'tipoMezcla',
          type: 'input',
          props: {
            label: 'Receta colectiva',
            placeholder: 'Captura número de receta'
          },

        },
        {
          className: 'col-lg-2 col-md-6',
          //key:'rfc',
          type: 'button',
          props: {
            label: ' ',
            text: 'Consultar',

            onClick: (to, $event) => {

            },

          }

        },
      ]
    }
  ]

  modelFT: any = {};
  formFT = new FormGroup({});
  fieldsFT: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: "col-lg-3 col-md-6",
          key: 'Vehiculo',
          type: 'input',
          props: {
            label: 'Vehículo',
            required: true,
            placeholder: 'Ingresa vehículo',
          }

        },
        {
          className: "col-lg-3 col-md-6",
          key: 'Concentracion',
          type: 'input',
          props: {
            label: 'Concentración (mg/ml)',
            required: true,
            placeholder: 'Ingresa concentración',
            maxLength: 10,
          }

        },
        {
          className: "col-lg-3 col-md-6",
          key: 'vialAR',
          type: 'input',
          props: {
            label: 'Vial abierto/reconstituido',
            required: true,
            placeholder: 'Ingresa vial'
          }

        },
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
                      this.listConsMedic = data
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
    },
//SE MODIFICO Y  SE COMENTA POR MEJORA 2 Y 3
   /* {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: "col-lg-6 col-md-6",
          key: 'perValVial',
          type: 'input-mask',
          props: {
            label: 'Período de validez reconstituido ambiente',
            required: true,
            placeholder: 'Captura periodo ',
            appInputMaskType: 'integer'
          }

        },
        {
          className: "col-lg-6 col-md-6",
          key: 'perValVialAbierto',
          type: 'input-mask',
          templateOptions: {
            label: 'Período de validez reconstituido red fría',
            placeholder: 'Captura periodo  ',
            required: true,
            appInputMaskType: 'integer'
          },

        },
      ]
    }*/
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
            labelProp: 'desc',
            options: [{'id':1,'desc':'Ambiente'},
            {'id':2,'desc':'Red fría'},
            {'id':2,'desc':'Ambiente y Red fría'}
           
            ],
          
          },      
          hooks: {
           

            onInit: async (field) => {
           
                         const tipoPeriodoValidez = field.form.get('tipoPeriodoValidez');
                         if (tipoPeriodoValidez != null) {
                          tipoPeriodoValidez.valueChanges.subscribe((x) => {
                             if (x != null && x != '') {
                               this.tipoPeriodoVal=x;
                               
                             }
                           });
           
                         }
           
                       },
           
                     },
        
          

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
          type: 'input-mask',
          props: {
            label: 'Período de validez reconstituido ambiente (hrs.)',
            required: true,
            placeholder: 'Captura periodo ',
            appInputMaskType: 'integer'
          }

        },
        {
          className: "col-lg-6 col-md-6",
          key: 'temperaturaAmbiente',
          type: 'input-mask',
          templateOptions: {
            label: 'Temperatura de estabilidad ambiente (°C)',
            placeholder: 'Captura temperatura',
            required: true,
            appInputMaskType: 'integer'
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
          type: 'input-mask',
          templateOptions: {
            label: 'Período de validez reconstituido red fría',
            placeholder: 'Captura periodo  ',
            required: true,
            appInputMaskType: 'integer'
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
            appInputMaskType: 'integer'
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
          className: 'col-lg-2',
          //key:'rfc',
          type: 'button',
          props: {
            label: ' ',
            text: 'Agregar Diluyente',
            onClick: (to, $event) => {
              //this.tipoMezclaDataSource= new MatTableDataSource<any>(MockData.mockTipoMezcla);
              //this.buscarMezclas();
              this.agregarDiluyente();


            },
            classBtn: 'btn-ico estilo-btn',
            btnType: 'outline-basic',
            icon: 'agregar'

          },
          expressionProperties: {
            'props.disabled': (model: any) => {
              if (this.modelDil.diluyente != null && this.modelDil.perValRedFria != null && this.modelDil.perValAmbiente != null) {
                return false
              } else {
                return true
              }

            },
          },

        },


      ]
    },
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
          type: 'input-mask',
          props: {
            label: 'Período de validez diluido ambiente(hrs.)',
            //required: true,
            placeholder: 'Captura periodo ',
            appInputMaskType: 'integer'
          }

        },
        {
          className: "col-lg-4 col-md-6",
          key: 'perValRedFria',
          type: 'input-mask',
          props: {
            label: 'Período de validez diluido red fría(hrs.)',
            //required: true,
            placeholder: 'Captura periodo ',
            appInputMaskType: 'integer'
          }

        },
        
      ]
    },

  ]

  modelReceta: any = {};
  formReceta = new FormGroup({});
  fieldsReceta: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: "col-lg-5 col-md-6",
          key: 'fabricante',
          type: 'select',
          props: {
            label: 'Fabricante',
            required: true,
            placeholder: 'Selecciona fabricante',
            valueProp: 'id',
            labelProp: 'desFabricante',

            options: [],
          }
          , hooks: {
            onInit: async (field) => {

              this.catalogService.getFabricante()
                .then(
                  (data: any) => {
                    if (data) {
                      this.lsFabricante = data;
                      field.props.options = data;
                    } else
                      this._alertServices.error("<strong>Error</strong> al obtener conceptos de Fabricantes");
                  },
                  (_err) => {
                    this._alertServices.error("<strong>Error</strong> al obtener conceptos de Fabricantes");
                  }
                );
            },

          },

        },
        {
          className: "col-lg-5 col-md-6",
          key: 'marca',
          type: 'select',
          props: {
            label: 'Marca',
            required: true,
            placeholder: 'Captura marca',
            valueProp: 'id',
            labelProp: 'desMarca',
            options: []
          },
          hooks: {

            onInit: async (field) => {

              const fabricante = field.form.get('fabricante');
              const marca = field.form.get('marca');

              if (fabricante != null) {
                fabricante.valueChanges.subscribe(async (x) => {
                  if (x != null && x != '') {
                    console.log('cambio de emzcla ---> ', x)

                    await this.catalogService.getMarcaByFabricante(x)
                      .then(data => {

                        field.props.options = data;
                        this.lsMarca = data;



                      });

                    if (marca != null) {
                      //listener cuando cambia
                      marca.valueChanges.subscribe((y) => {
                        this.mezclasService.validaRecetaColectiva(this.medicamentoDetails.idMedicamento, x, y).then(data => {
                          console.log(data)
                          this.existeFicha = data
                          if (data == null) {
                            this.agregaDisabled = true
                          } else {
                            this.agregaDisabled = false
                          }
                        })

                      });
                    }
                  }
                });



              }

            },

            afterViewInit: async (field) => {

              const marca = field.form.get('marca');
              let reqCons = field.form.get('reqCons');
              if (marca != null) {
                marca.valueChanges.subscribe(async (x) => {
                  if (x != null && x != '') {
                    console.log('cambio de marca ---> ', x)

                    this.getDetalleFichaTecnica(x, this.modelReceta.fabricante, reqCons);


                  }
                });

              }

            },
          },

        },
        {
          className: "col-lg-2 col-md-6",
          key: 'numEnvases',
          type: 'input-mask',
          props: {
            label: 'N° de envases',
            required: true,
            placeholder: 'Captura envase',
            appInputMaskType: 'integer',
            maxLength: 2
          },
          hooks: {
            onInit: async (field) => {
              const numEnvases = field.form.get('numEnvases');
              if (numEnvases != null) {
                //listener cuando cambia
                let medicamentos
                let total
                this.mezclasService.getRecetaColectivaMedicamentos(this.recetaColectiva)
                  .then(data => {
                    console.log(data.lstMedicamentosSAI)
                    medicamentos = data.lstMedicamentosSAI
                  })
                numEnvases.valueChanges.subscribe((x) => {
                  for (let i = 0; i < medicamentos?.length; i++) {
                    if (medicamentos[i].desCorta == this.nombreMedicamento) {
                      console.log(this.nombreMedicamento)
                      if (this.totalEvases != 0) {
                        total = Number(this.totalEvases) + Number(x)
                        if (medicamentos[i].numEnv < Number(total)) {
                          console.log(total)
                          this._alertServices.warn('La cantidad ingresada en el campo envase más el total de cantidad ingresada en los registros previamente <br> ingresados sobrepasa la cantidad de medicamento obtenida en SAI.<br><strong> Favor de validar.<strong>')
                          this.btnAgregaLote = true
                          return
                        } else {
                          this.btnAgregaLote = false
                        }
                      } else if (medicamentos[i].numEnv < Number(x)) {
                        this._alertServices.warn('La cantidad ingresada en el campo envase es mayor la cantidad del medicamento obtenida de SAI. <br> <strong> Favor de validar.<strong>')
                        this.btnAgregaLote = true
                        return
                      } else {
                        this.btnAgregaLote = false
                      }


                    }

                  }

                });
              }
            },
          }

        },

      ]
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: "col-lg-2 col-md-6",
          key: 'lote',
          type: 'input',
          props: {
            label: 'Lote',
            required: true,
            placeholder: 'Captura lote',
          }

        },
        {
          className: "col-lg-3 col-md-6",
          key: 'fechaApl',
          type: 'material-date',
          templateOptions: {
            label: 'Caducidad del medicamento',
            range: false,
            placeholder: 'Seleccionar fecha',
            required: true,
            minDate: this.minDate,
          },

        },
        {
          className: "col-lg-2 col-md-6",
          key: 'conDiluyente',
          type: 'mat-radio',
          props: {
            label: '¿Cuenta con diluyente?',
            // required: true,
            options: [
              { value: false, label: 'No' },
              { value: true, label: 'Si' },
            ],
          },
          hooks: {
            onInit: async (field) => {
              const conDiluyente = field.form.get('conDiluyente');
              if (conDiluyente != null) {
                //listener cuando cambia
                conDiluyente.valueChanges.subscribe((x) => {

                  if (x == true) {
                    this.fechaRequired = false

                  } else {
                    this.fechaRequired = true
                    this.formReceta.controls['caducidadDiluyente'].setValue(null)
                  }

                });
              }
            },
          }

        },
        {
          className: "col-lg-3 col-md-6",
          key: 'caducidadDiluyente',
          type: 'material-date',
          props: {
            label: 'Caducidad del diluyente',
            range: false,
            placeholder: 'Seleccionar fecha',
            required: false,
            minDate: this.minDate
          },
          expressionProperties: {
            'templateOptions.disabled': (model: any) => {

              if (this.fechaRequired == true && !this.indGuardadoCompleto) {
                return true
              } else {
                return false
              }
            }
          }

        },
        {
          className: 'col-lg-2 col-md-6',
          //key:'rfc',
          type: 'button',
          props: {
            label: ' ',
            text: 'Agregar',
            onClick: (to, $event) => {
              if (this.formReceta.valid) {
                this.agregarMedicamento();
              } else {
                const formValidar = [this.formReceta];
                this.validaCamposFormulario(formValidar);
                this._alertServices.errorCamposObligatorios();
              }

            },
            classBtn: 'btn-ico estilo-btn',
            btnType: 'outline-basic',
            icon: 'agregar'

          },
          expressionProperties: {
            'props.disabled': (model: any) => {

              this.mezclasService.getRecetaColectivaMedicamentos(this.recetaColectiva)
                .then(data => {
                  console.log(data.lstMedicamentosSAI)

                  this.listaSinDuplicados = [...new Set(data.lstMedicamentosSAI.map(medicamento => medicamento.idMedicamento))].map(id => data.lstMedicamentosSAI.find(medicamento => medicamento.idMedicamento === id));

                  console.log(this.listaSinDuplicados);

                  data.lstMedicamentosSAI = this.listaSinDuplicados

                  this.lstMedicamentos = data.lstMedicamentosSAI

                  console.log(this.lstMedicamentos);

                  if (data) {
                    for (let i = 0; i < this.lstMedicamentos.length; i++) {
                      if (this.lstMedicamentos[i].idMedicamento == this.idMedicamento) {
                        if (this.totalEvases > this.lstMedicamentos[i].numEnv) {
                          this.btnAgregaCantidadEnvase = true
                        } else {
                          this.btnAgregaCantidadEnvase = false
                        }

                      }
                    }
                  }
                })

              



              if (this.formFT.touched == false) {
                if ((this.agregaDisabled || this.btnAgregaLote) && !this.btnAgregaCantidadEnvase ) {
                  return true
                }
              } else {
                return false
              }




            },
          }

        },
      ]
    }
  ]


  rechazarAnti(element) {

  }
  ngOnInit(): void {
    console.log(this.medicamentoDetails)
    this.estadoMedicamento = null;
    this.nvosLotes = [];
    this.nvosDiluyentes = [];
    this.lsEliminadosLote = [];
    this.lsEliminadosDiluyentes = [];
    this.nombreMedicamento = this.medicamentoDetails.nombreMedicamento;
    this.idMedicamento = this.medicamentoDetails.idMedicamento;
    this.idReceta = this.medicamentoDetails.idReceta;
    this.recetaColectiva = this.medicamentoDetails.recetaColectiva;
    this.idRecColMedic = this.medicamentoDetails.idRecColMedic;
    this.indGuardadoCompleto = this.medicamentoDetails.indGuardadoCompleto;
    this.numMedicamento = this.medicamentoDetails.numMedicamento;
    console.log("ind guardado", this.indGuardadoCompleto);

    this.mezclasService.getRecetaColectivaMedicamentos(this.recetaColectiva)
      .then(data => {
        console.log(data.lstMedicamentosSAI)

        this.listaSinDuplicados = [...new Set(data.lstMedicamentosSAI.map(medicamento => medicamento.idMedicamento))].map(id => data.lstMedicamentosSAI.find(medicamento => medicamento.idMedicamento === id));

        console.log(this.listaSinDuplicados);

        data.lstMedicamentosSAI = this.listaSinDuplicados

        this.lstMedicamentos = data.lstMedicamentosSAI

        console.log(this.lstMedicamentos);

        if (data) {
          for (let i = 0; i < this.lstMedicamentos.length; i++) {
            if (this.lstMedicamentos[i].idMedicamento == this.idMedicamento) {
              if (this.lstMedicamentos[i].fichaTecnica?.fichaTecnicaDetalles) {
                this.formFT.controls['Vehiculo'].setValue(this.lstMedicamentos[i].fichaTecnica.fichaTecnicaDetalles.refVehiculo)
                this.formFT.controls['Concentracion'].setValue(this.lstMedicamentos[i].fichaTecnica.fichaTecnicaDetalles.refConcentracion)
                this.formFT.controls['vialAR'].setValue(this.lstMedicamentos[i].fichaTecnica.fichaTecnicaDetalles.refVialAbiertoReconst)
                this.formFT.controls['reqCons'].setValue(this.lstMedicamentos[i].fichaTecnica.fichaTecnicaDetalles.idConservacionMed)
                this.formFT.controls['perValVial'].setValue(this.lstMedicamentos[i].fichaTecnica.fichaTecnicaDetalles.valVialAbiertoAmb)
                this.formFT.controls['perValVialAbierto'].setValue(this.lstMedicamentos[i].fichaTecnica.fichaTecnicaDetalles.valVialAbiertoFria)
                this.formFT.disable()
              }

              if (this.lstMedicamentos[i]?.fichaTecnica?.lstDiluyentes) {
                this.diluyentesDataSource = new MatTableDataSource<any>(this.lstMedicamentos[i].fichaTecnica.lstDiluyentes);

              }


              if (this.indGuardadoCompleto) {

                console.log(this.lstMedicamentos);


                this.estadoMedicamento = this.lstMedicamentos[i].loteFab.buenMalEstado == true ? "1" : "0"
                console.log(this.estadoMedicamento)
                this.formReceta.controls['fabricante'].setValue(this.lstMedicamentos[i].idLoteFabMed)
                this.formReceta.controls['marca'].setValue(this.lstMedicamentos[i].idLoteFabMed)
                this.formReceta.controls['numEnvases'].setValue(this.lstMedicamentos[i].loteFab.envase)
                this.formReceta.controls['lote'].setValue(this.lstMedicamentos[i].loteFab.lote)
                this.formReceta.controls['fechaApl'].setValue(this.lstMedicamentos[i].loteFab.fechaCaducidad)
                this.formReceta.controls['conDiluyente'].setValue(this.lstMedicamentos[i].loteFab.cuentaDiluyente)
                this.formReceta.controls['caducidadDiluyente'].setValue(this.lstMedicamentos[i].loteFab.fechaCadDiluyente)


                this.formReceta.controls['fabricante'].disable();
                this.formReceta.controls['marca'].disable();
                this.formReceta.controls['numEnvases'].disable();
                this.formReceta.controls['lote'].disable();
                this.formReceta.controls['fechaApl'].disable();
                this.formReceta.controls['conDiluyente'].disable();
                this.formReceta.controls['caducidadDiluyente'].disable();


                this.formFT.disable();

                this.formTipoMezcla.disable();
                this.formDil.disable();
              }

            }





          }
        }
      })




    this.usuario = this._accountService.getUser();
    if (this.idReceta != null && this.idReceta != undefined)
      this.getDetalleList(this.idMedicamento, this.idReceta)
    // console.log(receta)
  }


  
  ngAfterViewInit(): void {
    if (this.indGuardadoCompleto) {

      console.log(this.lstMedicamentos);


      this.formReceta.controls['fabricante'].setValue()
      this.formReceta.controls['marca'].setValue()
      this.formReceta.controls['numEnvases'].setValue()
      this.formReceta.controls['lote'].setValue()
      this.formReceta.controls['fechaApl'].setValue()
      this.formReceta.controls['conDiluyente'].setValue()
      this.formReceta.controls['caducidadDiluyente'].setValue()


      this.formReceta.controls['fabricante'].disable();
      this.formReceta.controls['marca'].disable();
      this.formReceta.controls['numEnvases'].disable();
      this.formReceta.controls['lote'].disable();
      this.formReceta.controls['fechaApl'].disable();
      this.formReceta.controls['conDiluyente'].disable();
      this.formReceta.controls['caducidadDiluyente'].disable();


      this.formFT.disable();

      this.formTipoMezcla.disable();
      this.formDil.disable();
    }
  }
  getDetalleList(idMedicamento, idReceta) {

    this.mezclasService.getRecetaColectivaLotes(idMedicamento, idReceta)
      .then(data => {
        console.log(data)


        if (data.length != 0) {

          this.antibioticosDataSource = new MatTableDataSource<any>(data);
          this.totalEvases = 0;
          for (let index = 0; index < this.antibioticosDataSource.data.length; index++) {
            const element = this.antibioticosDataSource.data[index];
            this.totalEvases = this.totalEvases + element.envase;
          }


        } else {
          this.antibioticosDataSource = new MatTableDataSource<any>([]);

        }

      });
  }
  getDetalleFichaTecnica(idMarca: any, idFabricante: any, recons) {
    this.mezclasService.validaRecetaColectiva(this.idMedicamento, idFabricante, idMarca)
      .then(data => {

        if (data != null && data.fichaTecnicaDetalles != null) {

          this.fichaTecnicaDetalles = data.fichaTecnicaDetalles;

          this.modelFT = {
            ...this.modelFT,
            Vehiculo: data.fichaTecnicaDetalles.refVehiculo,
            Concentracion: data.fichaTecnicaDetalles.refConcentracion,
            vialAR: data.fichaTecnicaDetalles.refVialAbiertoReconst,
            reqCons: data.fichaTecnicaDetalles.idConservacionMed,

            perValVial: data.fichaTecnicaDetalles.valVialAbiertoAmb,

            perValVialAbierto: data.fichaTecnicaDetalles.valVialAbiertoFria,


          }
          this.formFT.disable();
          //  recons.value= data.fichaTecnicaDetalles.idConservacionMed;






        } else {
          this.formFT.enable()
          this.formFT.reset()
        }
        if (data != null && data.lstDiluyentes != null && data.lstDiluyentes.length > 0) {

          this.diluyentesDataSource = new MatTableDataSource<any>(data.lstDiluyentes);


        }

      });

  }
  agregarDiluyente() {


    let diluyenteEle = this.listDiluyente.find(e => e.id == this.modelDil.diluyente);
    let newRow = {

      'desCortaDiluyente': diluyenteEle.desCortaDiluyente,
      'idDiluyente': diluyenteEle.id,
      'perValDilucionFria': this.modelDil.perValRedFria,
      'perValDilucionAmbiente': this.modelDil.perValAmbiente
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

    this.formDil.reset()



  }

  btnDisabled() {
    for (let i = 0; i < this.lstMedicamentos?.length; i++) {
      if (this.lstMedicamentos[i].idMedicamento == this.idMedicamento) {
        if (this.totalEvases < this.lstMedicamentos[i].numEnv) {
          return true
        } else {
          return false
        }
      }
    }

  }
  actualizar() {
    // if (this.fichaTecnicaDetalles == null && this.formFT.valid == false) {
    //   const formValidar = [this.formFT];
    //   this.validaCamposFormulario(formValidar);
    //   this._alertServices.errorCamposObligatorios();
    //   return;


    // } 

    if (this.estadoMedicamento == null) {
      this._alertServices.error("<strong>Error</strong> seleccione el estado del medicamento");
      return;
    }

    for (let i = 0; i < this.lstMedicamentos.length; i++) {
      if (this.lstMedicamentos[i].desCorta === this.nombreMedicamento) {
        if (this.totalEvases < this.lstMedicamentos[i].numEnv) {


        }
      }

    }
    // if (this.totalEvases < ) {

    // }


    let fichaTecnica;
    for (let i = 0; i < this.nvosLotes.length; i++) {
      if (this.fichaTecnicaDetalles != null) {
        this.nvosLotes[i].fichaTecnica = {
          id: this.fichaTecnicaDetalles.idFichaTecnica,
          lstDiluyente: this.nvosDiluyentes
        }

      } else {
        let reqConservacion = this.listConsMedic.find(e => e.id == this.modelFT.reqCons);
        this.listConsMedic.find
        this.nvosLotes[i].fichaTecnica.lstDiluyente = this.nvosDiluyentes
      }

    }


    console.log(this.nvosLotes)
    console.log(this.idReceta)
    console.log(this.recetaColectiva)
    let request = {


      "idRecetaColectiva": this.idReceta,
      "recFolColectiva": this.recetaColectiva ? this.recetaColectiva : null,

      //apartado de lista de medicamentos a agregar nuevos
      "lstMedicamentos": this.nvosLotes,
      // "fichaTecnica": fichaTecnica,

      //en caso de eliminar algun lote enviar la sigueinte lista con los elementos a eliminar 
      "lstDelLote": this.lsEliminadosLote,
      "cveUsuario": this.usuario.cemetUsuarios[0].id
    }
    console.log(request)

    this.mezclasService.actualizarMedicamentoRecetaColectiva(request)
      .then(data => {
        if (data) {

          this._alertServices.success('Se registro la receta Colectiva ');
          let medicamentoDetail = {
            operation: 'update',
            numMedicamento: this.numMedicamento
          };
          this.onSelected.emit(medicamentoDetail);

          // setTimeout(() =>  this._router.navigate([this._nav.prescripcion]), 1000);
        } else {

          this._alertServices.error("<strong>Error</strong> al guardar solicitud.");

        }

      });


  }

  agregarMedicamento() {


    let fabricanteEle = this.lsFabricante.find(e => e.id == this.modelReceta.fabricante);
    let marcaEle = this.lsMarca.find(e => e.id == this.modelReceta.marca);




    let newRow = {
      "buenMalEstado": this.estadoMedicamento == true ? 1 : 0,
      "idMedicamento": this.idMedicamento,
      "cveMedicamentoSai": "088.000.8888.01",  //pendiente          
      'idFabricante': fabricanteEle.id,
      'fabricante': fabricanteEle.desFabricante,
      'marca': marcaEle.desMarca,
      'idMarca': marcaEle.id,
      "numPresentacion": 5,//pendiente
      "fichaTecnica": {
        "idMedicamento": this.idMedicamento,
        "idFabricante": fabricanteEle.id,
        "idMarca": marcaEle.id,
        "vehiculo": this.modelFT.Vehiculo,
        "concentracion": this.modelFT.Concentracion,
        "viaAbierto": this.modelFT.vialAR,
        "reqConservacion": this.modelFT.reqCons,
        "idConservacionMed": this.modelFT.reqCons,
        "numValVialAbierRecRf": this.modelFT.perValVialAbierto,
        "numValVialAbierRecAmb": this.modelFT.perValVial,
        "lstDiluyente": this.nvosDiluyentes
      },

      'numEnvase': this.modelReceta.numEnvases,
      'lote': this.modelReceta.lote,
      "caducidadMed": formatDate(this.modelReceta.fechaApl, 'dd/MM/YYYY', 'en-US'),
      "tineDiluyente": this.modelReceta.conDiluyente == true ? 1 : 0, // si es 1 debe enviar caducidadDil
      "caducidadDil": this.modelReceta.conDiluyente == true ? formatDate(this.modelReceta.caducidadDiluyente, 'dd/MM/YYYY', 'en-US') : null,

      "cveUsuario": this.usuario.cemetUsuarios[0].id




    }
    let newRow2 = {
      "buenMalEstado": this.estadoMedicamento == true ? 1 : 0,
      "idMedicamento": this.idMedicamento,
      "cveMedicamentoSai": "088.000.8888.01",  //pendiente          
      'idFabricante': fabricanteEle.id,
      'idMarca': marcaEle.id,
      "numPresentacion": 5,//pendiente

      'numEnvase': this.modelReceta.numEnvases,
      'lote': this.modelReceta.lote,
      "caducidadMed": formatDate(this.modelReceta.fechaApl, 'dd/MM/YYYY', 'en-US'),
      "tineDiluyente": this.modelReceta.conDiluyente == true ? 1 : 0, // si es 1 debe enviar caducidadDil
      "caducidadDil": this.modelReceta.conDiluyente == true ? formatDate(this.modelReceta.caducidadDiluyente, 'dd/MM/YYYY', 'en-US') : null,
      "cveUsuario": this.usuario.cemetUsuarios[0].id




    }
    console.log(newRow);
    const newData = [...this.antibioticosDataSource.data];

    newData.push(newRow);
    this.nvosLotes.push(newRow);
    this.antibioticosDataSource.data = newData;
    this.totalEvases = this.totalEvases + Number(this.modelReceta.numEnvases);


    console.log(this.existeFicha)
    if (this.existeFicha == null) {
      this.formFT.reset()
    }
    this.formReceta.reset()



    console.log("datasource data", this.antibioticosDataSource.data);
    console.log("nuevos lotes data", this.nvosLotes);


  }
  eliminarLote(element) {
    //pendiente implementar el borrado
    console.log(element)

    let newData = [...this.antibioticosDataSource.data];
    console.log(newData)
    const index = newData.findIndex((e) => e.idLoteFabMedic === element.idLoteFabMedic);
    const elementDel = newData.find((e) => e.idLoteFabMedic === element.idLoteFabMedic);

    if (elementDel.idLoteFabMedic) {
      let e = {
        idLoteFabMedic: elementDel.idLoteFabMedic
      };
      this.lsEliminadosLote.push(e);

      this.formFT.reset()
      this.formFT.enable()


    }




    newData.splice(index, 1);
    this.antibioticosDataSource.data = newData;
    this.totalEvases = this.totalEvases - Number(elementDel.envase);
    this.nvosLotes = newData
    console.log("Eliminados Lote", this.lsEliminadosLote);
    console.log(this.nvosLotes);



  }
  eliminarDil(element) {
    //pendiente implementar el borrado

    let newData = [...this.diluyentesDataSource.data];
    const index = newData.findIndex((e) => e.idDiluyente === element.idDiluyente);
    const elementDel = newData.find((e) => e.idDiluyente === element.idDiluyente);

    let e = {
      id: elementDel.idDiluyente,
      indActivo: 0
    };
    this.nvosDiluyentes.push(e);

    newData.splice(index, 1);
    this.diluyentesDataSource.data = newData;

    console.log("Eliminados Lote", this.nvosDiluyentes);



  }

  shortTableAnti(sort: Sort) {
    console.log("colName " + sort);

    const array = this.antibioticosDataSource.data;
    let des = sort.direction == 'desc';
    const sortedArray = this.sortArrayOfObjects(array, sort.active, des);
    //let otherModel = {...this.modelo};
    // otherModel.content = sortedArray;
    // console.log(otherModel)
    this.antibioticosDataSource = new MatTableDataSource(sortedArray);
  }

  shortTableDil(sort: Sort) {
    console.log("colName " + sort);

    const array = this.diluyentesDataSource.data;
    let des = sort.direction == 'desc';
    const sortedArray = this.sortArrayOfObjects(array, sort.active, des);
    //let otherModel = {...this.modelo};
    // otherModel.content = sortedArray;
    // console.log(otherModel)
    this.diluyentesDataSource = new MatTableDataSource(sortedArray);
  }
}
