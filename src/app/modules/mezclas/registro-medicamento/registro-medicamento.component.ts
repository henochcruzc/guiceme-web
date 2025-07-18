import { CommonModule, formatDate } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { TituloComponent } from 'src/app/shared/layout/frames/titulo/titulo.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { GeneralComponent } from '../../general/general.component';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { CatalogoService } from 'src/app/shared/services/catalogo.service';
import { MezclasService } from 'src/app/shared/services/mezclas.service';
import { DetalleRecetaColectivaComponent } from "./detalle-receta-colectiva/detalle-receta-colectiva.component";
import { AuthService } from '../../login/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { Sort } from '@angular/material/sort';
import * as moment from 'moment';
import { EventEmitter } from 'stream';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-registro-medicamento',
  standalone: true,
  templateUrl: './registro-medicamento.component.html',
  styleUrls: ['./registro-medicamento.component.css'],

  imports: [
    CommonModule,
    SharedModule,
    TituloComponent,
    DetalleRecetaColectivaComponent
  ]
})
export class RegistroMedicamentoComponent extends GeneralComponent implements OnInit {

  selected = new FormControl(0);
  updated: boolean = false;
  leyendaGuardados: string = "";
  listDiluyente: any;
  index: number = 0;
  idReceta: any;
  usuario: any;
  indGuardadoCompleto: any;
  medicamentosUpTotal: any;
  labelTab: any
  listaSinDuplicados: any[];
  public minDate = moment(new Date()).format('YYYY-MM-DD');
  estadoMedicamento: any;
  @Input() medicamentoDetails: any;
  nombreMedicamento: any;
  idMedicamento: any;
  idRecColMedic: any;
  recetaColectiva: any;
  listConsMedic: any;
  lsFabricante: any;
  lsMarca: any;
  nvosLotes: any[] = new Array();
  nvosDiluyentes: any[];
  lsEliminadosLote: any;
  lsEliminadosDiluyentes: any[];
  fichaTecnicaDetalles: any;
  numMedicamento: any;
  lstMedicamentos: any
  agregaDisabled: boolean = true
  fechaRequired: boolean = true;
  btnAgregaLote: boolean = true;
  btnAgregaCantidadEnvase: boolean;
  existeFicha: any
  numeroEnv: any
  isGuardados: boolean = false
  ftValida: boolean
  btnActualizar: boolean = false
  isBotones: boolean = false
  isChange: boolean = false
  btnTexto = 'Guardar Información'
  opcionAgregar: boolean = false


  constructor(private cd: ChangeDetectorRef,
    private catalogService: CatalogoService,
    private activatedRoute: ActivatedRoute,
    private mezclasService: MezclasService) {
    super();

  }

  $obsCambioFormulario = new Subject<any>();
  ngOnInit(): void {
    this.tipoPeriodoVal = 0;
    this.usuario = this._accountService.getUser();


    this.formReceta.valueChanges.subscribe(x => {
      setTimeout(() => {
        this.$obsCambioFormulario.next('cambio form receta')
      }, 100);
    })

    this.formFT.valueChanges.subscribe(x => {
      setTimeout(() => {
        this.$obsCambioFormulario.next('cambio form receta')
      }, 100);
    })

    this.formAmbiente.valueChanges.subscribe(x => {
      setTimeout(() => {
        this.$obsCambioFormulario.next('cambio form receta')
      }, 100);
    })

    this.formRedFria.valueChanges.subscribe(x => {
      setTimeout(() => {
        this.$obsCambioFormulario.next('cambio form receta')
      }, 100);
    })

  }


  antibioticosDataSource = new MatTableDataSource<any>([]);
  diluyentesDataSource = new MatTableDataSource<any>([]);
  tipoPeriodoVal: any = 0;

  antibioticosDisplayedColumns: string[] = [
    'lote',
    'fabricante',
    'marca',
    'numEnvase',
    'eliminar'
  ];

  diluyentesDisplayedColumns: string[] = [
    'Diluyente',
    'perDilacion',
    'redFria',

    'eliminar'
  ];
  medicamentosTotal: number = 0;
  totalEvases: number = 0;
  tableDS = new MatTableDataSource<any>([]);
  collectionSize: number = 0;
  displayedColumns = ['no', 'desCorta', 'total',]
  modelSelected: any = {};
  isConsulta: boolean = false
  lotes = []
  medicamentoList = []


  modelTipoMezcla: any = {};
  formTipoMezcla = new FormGroup({});

  fieldsTipoMezcla: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: "col-lg-4 col-md-6",
          key: 'numReceta',
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
              this.buscaMedicamento()
            },
            classBtn: 'btn btn-primary btn-sm btn-pro'
          },
          expressionProperties: {
            'props.disabled': (model: any) => {
              if (
                model.numReceta
              ) {
                return false
              }
              return true
            },
          },

        },
      ]
    }
  ]

  async buscaMedicamento() {

    this.opcionAgregar = false
    this.isConsulta = false


    if (this.medicamentoList != null && this.medicamentoList.length > 0) {

      const dialogRef = this._dialog.open(
        DialogComponent,
        await this._dialogService.deseasConsultarOtraRecetaColectiva()
      );


      dialogRef.afterClosed().subscribe(
        async data => {

          if (data) {
            this.isBotones = false
            this.isGuardados = false
            this.antibioticosDataSource = new MatTableDataSource<any>([]);
            this.diluyentesDataSource = new MatTableDataSource<any>([]);
            this.totalEvases = 0
            this.formReceta.reset()
            this.formDil.reset()
            this.formFT.reset()
            this.formAmbiente.reset()
            this.formRedFria.reset()
            this.modelSelected.idMedicamento = null
            this.isGuardados = true
            this.lstMedicamentos = []
            await this.getDetalleList(this.modelTipoMezcla.numReceta);

            if (this.indGuardadoCompleto) {

              setTimeout(() => {
                this._alertServices.info('Los medicamentos de la receta colectiva <strong> ' + this.modelTipoMezcla.numReceta + '</strong> ya han sido registrados.');

              }, 2000);
            }
          }
        }
      );

    } else {
      await this.getDetalleList(this.modelTipoMezcla.numReceta);


      if (this.indGuardadoCompleto) {

        setTimeout(() => {
          this._alertServices.info('Los medicamentos de la receta colectiva <strong> ' + this.modelTipoMezcla.numReceta + '</strong> ya han sido registrados.');

        }, 2000);


      }
      this.isGuardados = true
    }

  }

  async getDetalleList(receta) {

    this.tableDS = new MatTableDataSource([]);

    await this.mezclasService.getRecetaColectivaMedicamentos(receta)
      .then(data => {
        if (data.existeReceta == false) {
          this._alertServices.error("El número de receta colectiva <strong>no existe</strong>");
          this.isBotones = false
          this.antibioticosDataSource = new MatTableDataSource<any>([]);
          this.diluyentesDataSource = new MatTableDataSource<any>([]);
          this.totalEvases = 0
          this.formReceta.reset()
          this.formDil.reset()

          this.isGuardados = true
          this.medicamentoList = [];
          return;
        }

        this.indGuardadoCompleto = data.indGuardadoParcial
        if (this.indGuardadoCompleto == true) {
          this.isBotones = true
        }
        this.listaSinDuplicados = [...new Set(data.lstMedicamentosSAI.map(medicamento => medicamento.idMedicamento))].map(id => data.lstMedicamentosSAI.find(medicamento => medicamento.idMedicamento === id));
        data.lstMedicamentosSAI = this.listaSinDuplicados
        this.myData = data.lstMedicamentosSAI
        this.tableDS = new MatTableDataSource(this.myData);
        this.collectionSize = this.myData.length
        this.idReceta = data.idReceta;
        this.indGuardadoCompleto = data.indGuardadoParcial;
        this.medicamentoList = [];
        if (data.lstMedicamentosSAI != null && data.lstMedicamentosSAI.length > 0) {
          this.medicamentosUpTotal = 0;
          let alertConfirm = false;
          for (let index = 0; index < data.lstMedicamentosSAI.length; index++) {
            const element = data.lstMedicamentosSAI[index];
            let numMed = index + 1;
            if (element.idRecColMedic != undefined && element.idLoteFabMed != undefined) {
              this.medicamentosUpTotal++;
            }
            if (element.idRecColMedic != undefined && element.idLoteFabMed != undefined && alertConfirm == false && !this.indGuardadoCompleto) {
              alertConfirm = true;
              if (data == false) {
                this.medicamentoList = [];
                return;
              }
            }
            let medicamento = {
              desCorta: element.desCorta,
              num: numMed,
              cantidad: element.medida,
              unidadMedida: element.unidadMedida,
              cantidadEnv: element.numEnv,
              value: {
                nombreMedicamento: element.desCorta,
                idMedicamento: element.idMedicamento,
                idReceta: this.idReceta,
                recetaColectiva: this.modelTipoMezcla.numReceta,
                idRecColMedic: element.idRecColMedic == undefined ? null : element.idRecColMedic,
                idLoteFabMed: element.idLoteFabMed == undefined ? null : element.idLoteFabMed,
                indGuardadoCompleto: this.indGuardadoCompleto,
                numMedicamento: numMed,
              }
            }
            this.medicamentoList.push(medicamento);
            for (let i = 0; i < this.medicamentoList.length; i++) {
              this.labelTab = this.medicamentoList[i].desCorta + ' ' + this.medicamentoList[i].cantidad + ' ' + this.medicamentoList[i].unidadMedida + '    ' + 'Cantidad' + ' ' + this.medicamentoList[i].cantidadEnv
            }
          }
        } else {
          this._alertServices.error("El número de receta colectiva <strong>no existe</strong>");
        }

      });
  }

  modelFT: any = {};

  formFT = new FormGroup({});
  fieldsFT: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [

        {
          className: "col-lg-6 col-xl-3 col-md-6",
          key: 'dosisMedicV',
          type: 'decimal',
          props: {
            label: 'Dosis de medicamento (mg)',
            required: true,
            placeholder: 'Ingresa vehículo',
            numEnteros: 5,
            numDecimales: 1,

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
                  //  field.props.max = 99999.9;
                  // field.props.min = 0;
                  if (x != null && x != '' && Number(field.form.controls['volumenReconsV'].value) > 0) {
                    let result = "" + Number(x) / Number(field.form.controls['volumenReconsV'].value);
                    let decimal = Number(result).toFixed(1)
                    field.form.get('Concentracion').setValue(decimal);

                  }
                });

              }

            },

          },

        },
        {
          className: "col-lg-6 col-xl-3 col-md-6",
          key: 'volumenReconsV',
          type: 'decimal',
          props: {
            label: 'Volumen de reconstitución (ml)',
            required: true,
            placeholder: 'Ingresa vehículo',
            numEnteros: 4,
            numDecimales: 1,

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
                  if (x != null && x != '' && field.form.controls['dosisMedicV'].value != null) {

                    if (Number(x) <= 0) {
                      field.form.get('volumenReconsV').setValue(null);

                    } else {
                      let result = "" + Number(field.form.controls['dosisMedicV'].value) / Number(x);
                      let decimal = Number(result).toFixed(1)
                      console.log(result)
                      console.log(decimal)
                      field.form.get('Concentracion').setValue(decimal);
                    }



                  }
                });

              }

            },

          },


        },
        {
          className: "col-xl-3 col-md-6",
          key: 'Concentracion',
          type: 'decimal',
          props: {
            label: 'Concentración (mg/ml)',
            required: true,
            disabled: true,
            placeholder: 'Ingresa concentración',
            numEnteros: 5,
            numDecimales: 1,
            // pattern: /^([0-9]?[0-9]?[0-9]?[0-9]?[0-9][.][0-9]?)$/,
            attributes: {
              autocomplete: 'off',
            },

          },


        },

        {
          className: "col-xl-3 col-md-6",
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
    {
      fieldGroupClassName: 'row',
      fieldGroup: [

        {
          fieldGroupClassName: 'row',
          fieldGroup: [
            {
              className: "col-xl-6 col-md-6",
              key: 'tipoPeriodoValidez',
              type: 'select',
              props: {
                label: 'Tipo de período de validez',
                required: true,
                placeholder: 'Selecciona tipo de período',
                valueProp: 'id',
                labelProp: 'desTipoPeriodoValidez',
                options: []


              },
              hooks: {


                onInit: async (field) => {


                  this.catalogService.getFichaTecnicaTipoPeriodoValidez()
                    .then(
                      (data: any) => {
                        if (data) {
                          field.props.options = data;
                          this.fieldsAmbiente[0].hide = true;
                          this.fieldsRedFria[0].hide = true;
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
                        this.tipoPeriodoVal = x;
                        this.modelFT.tipoPeriodoValidez = x;

                        console.log("seleccionado periodo validez", x);
                        if (x == 1) {
                          this.fieldsAmbiente[0].hide = false;
                          this.fieldsRedFria[0].hide = true;

                        } else if (x == 2) {
                          this.fieldsAmbiente[0].hide = true;
                          this.fieldsRedFria[0].hide = false;
                        } else if (x == 3) {
                          this.fieldsAmbiente[0].hide = false;
                          this.fieldsRedFria[0].hide = false;
                        } else {
                          this.fieldsAmbiente[0].hide = true;
                          this.fieldsRedFria[0].hide = true;
                        }

                      }
                      else {
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
  formAmbiente = new FormGroup({});
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
                  } else field.form.get('temperaturaAmbiente').disable();


                })
              }
            }
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
            appInputMaskType: 'integer',
            pattern: /^([0-9][0-9]?)$/,
            maxLength: 2,
            disabled: true,
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
  formRedFria = new FormGroup({});
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
                  } else field.form.get('temperaturaRedFria').disable();


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
          className: "col-xl-4 col-md-6",
          key: 'diluyente',
          type: 'select',

          props: {
            label: 'Diluyente',
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
          className: "col-xl-4 col-md-6",
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
          className: "col-xl-4 col-md-6",
          key: 'perValRedFria',
          type: 'input-mask-reloj',
          props: {
            label: 'Período de validez diluido red fría (hrs.)',
            placeholder: 'Captura periodo ',
            appInputMaskType: 'integer',
            maxLength: 2,
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
          className: "col-xl-5 col-lg-6 col-md-6 ",
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
          className: "col-lg-6 col-xl-4 col-md-6",
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
              const btnAgregar = field.form.get('btnAgregar');

              if (fabricante != null) {
                fabricante.valueChanges.subscribe(async (x) => {
                  if (x != null && x != '') {

                    await this.catalogService.getMarcaByFabricante(x)
                      .then(data => {

                        field.props.options = data;
                        this.lsMarca = data;
                      });
                    if (marca != null) {
                      marca.valueChanges.subscribe((y) => {
                        if (this.modelSelected.idMedicamento && x && y) {


                          this.mezclasService.validaRecetaColectiva(this.modelSelected.idMedicamento, x, y).then(data => {

                            this.existeFicha = data
                            if (data == null) {
                              this.agregaDisabled = true
                              btnAgregar.disable()
                            } else {
                              this.agregaDisabled = false
                            }
                          })
                        }

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
                    if (!this.indGuardadoCompleto) {
                      this.getDetalleFichaTecnica(x, this.modelReceta.fabricante, reqCons);

                    }



                  }
                });

              }

            },
          },

        },
        {
          className: "col-lg-6 col-xl-3 col-md-6",
          key: 'numEnvases',
          type: 'input-mask',
          props: {
            label: 'N° de piezas',
            required: true,
            placeholder: 'Captura piezas',
            appInputMaskType: 'integer',
            maxLength: 4
          },
          hooks: {
            onInit: async (field) => {
              const numEnvases = field.form.get('numEnvases');
              if (numEnvases != null && this.isChange == true) {
                let medicamentos = []
                let total = 0
                await this.mezclasService.getRecetaColectivaMedicamentos(this.recetaColectiva)
                  .then(data => {
                    medicamentos = data.lstMedicamentosSAI
                  })
                numEnvases.valueChanges.subscribe((x) => {
                  if (x || x != null) {
                    for (let i = 0; i < medicamentos?.length; i++) {
                      if (medicamentos[i].idMedicamento == this.modelSelected.idMedicamento) {
                        if (this.totalEvases != 0 && !this.indGuardadoCompleto) {
                          total = Number(this.totalEvases) + Number(x)
                          if (this.modelSelected.numEnvSAI < Number(total)) {
                            this._alertServices.warn('La cantidad ingresada en el campo piezas más el total de cantidad ingresada en los registros previamente <br> ingresados sobrepasa la cantidad de medicamento obtenida en SAI.<br><strong> Favor de validar.<strong>')
                            this.btnAgregaLote = true
                            return
                          } else {
                            this.btnAgregaLote = false
                          }
                        } else if (this.modelSelected.numEnvSAI < Number(x)) {
                          this._alertServices.warn('La cantidad ingresada en el campo piezas es mayor la cantidad del medicamento obtenida de SAI. <br> <strong> Favor de validar.<strong>')
                          this.btnAgregaLote = true
                          return
                        } else {
                          this.btnAgregaLote = false
                        }


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
          className: " col-lg-6 col-xl-2 col-md-6",
          key: 'lote',
          type: 'input',
          props: {
            label: 'Lote',
            required: true,
            placeholder: 'Captura lote',
            maxLength: 30
          }

        },
        {
          className: "col-lg-6 col-xl-3 col-md-6",
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
          className: "col-lg-6 col-xl-2 col-md-6",
          key: 'conDiluyente',
          type: 'mat-radio',
          props: {
            label: '¿Cuenta con diluyente?',
            required: true,
            options: [
              { value: false, label: 'No' },
              { value: true, label: 'Si' },
            ],
          },
          hooks: {
            onInit: async (field) => {
              const conDiluyente = field.form.get('conDiluyente');
              if (conDiluyente != null) {
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
          className: "col-lg-6 col-xl-3 col-md-6",
          key: 'caducidadDiluyente',
          type: 'material-date',
          props: {
            label: 'Caducidad del diluyente',
            placeholder: 'Seleccionar fecha',
            required: false,
            minDate: this.minDate,
            disabled: true

          },
          hooks: {
            onInit: async (field) => {
              const conDiluyente = field.form.get('conDiluyente');
              if (conDiluyente != null) {
                conDiluyente.valueChanges.subscribe((x) => {

                  if (x == true) {
                    field.props.disabled = false

                  } else {
                    field.props.disabled = true
                  }

                });
              }
            },
          },
          expressions: {
            // 'props.disabled': (model: any) => {

            //   if (this.fechaRequired == true) {
            //     return true
            //   } else {
            //     return false
            //   }
            // },

            'props.required': 'model.conDiluyente'


          }

        },
        {
          className: ' col-lg-6 col-xl-2 col-md-6',
          key: 'btnAgregar',
          type: 'button',
          props: {
            label: ' ',
            text: 'Agregar',
            disabled: true,
            onClick: (to, $event) => {
              this.agregarMedicamento();
            },
            classBtn: 'btn-ico estilo-btn',
            btnType: 'outline-basic',
            icon: 'agregar'

          },
          hooks: {
            onInit: async (field) => {

              this.$obsCambioFormulario.subscribe(data => {
                field.props.disabled = this.btnAddLote();
              })


            },
          },
        },
      ]
    }
  ]

  btnAddLote() {

    let numero = Number(this.modelReceta.numEnvases)
    let suma = this.totalEvases + Number(this.modelReceta.numEnvases)
    // se incopora validacion de periodo de validez
    if (this.formReceta.valid && (this.formFT.valid
      && ((this.tipoPeriodoVal == 1 && this.formAmbiente.valid)
        || (this.tipoPeriodoVal == 2 && this.formRedFria.valid)
        || (this.tipoPeriodoVal == 3 && this.formAmbiente.valid && this.formRedFria.valid))  || this.opcionAgregar == true)
    ) {

      if (this.estadoMedicamento != null && (numero <= this.modelSelected.numEnvSAI && suma <= this.modelSelected.numEnvSAI)) {
        return false
      }
    }
    return true
  }

  cambioEstadoMed() {
    this.$obsCambioFormulario.next('cambio el estado')
  }




  agregarMedicamento() {

    console.log(this.modelReceta)

    let fabricanteEle = this.lsFabricante.find(e => e.id == this.modelReceta.fabricante);
    let marcaEle = this.lsMarca.find(e => e.id == this.modelReceta.marca);




    let newRow = {
      "buenMalEstado": this.estadoMedicamento == "true" ? 1 : 0,
      "idMedicamento": this.idMedicamento,
      "cveMedicamentoSai": this.modelSelected.cveMedicamentoSai,  //pendiente          
      'idFabricante': fabricanteEle.id,
      'fabricante': fabricanteEle.desFabricante,
      'marca': marcaEle.desMarca,
      'idMarca': marcaEle.id,
      "numPresentacion": this.modelSelected.numEnv,
      "fichaTecnica": {
        "idMedicamento": this.idMedicamento,
        "idFabricante": fabricanteEle.id,
        "idMarca": marcaEle.id,
        // "vehiculo": this.modelFT.Vehiculo,//se quito por mejora 2
        "concentracion": this.modelFT.Concentracion,
        //"viaAbierto": this.modelFT.vialAR,//se quti por mejora 2
        "reqConservacion": this.modelFT.reqCons,
        "idConservacionMed": this.modelFT.reqCons,
        "numValVialAbierRecRf": this.modelRedFria.perValVialAbierto,//se ajusto por mejora2
        "numValVialAbierRecAmb": this.modelAmbiente.perValVial,//se ajusto por mejora2
        //se agregan campos por mejora 2
        "numTemperaturaEstbAmb": this.modelAmbiente.temperaturaAmbiente == null ? 0 : this.modelAmbiente.temperaturaAmbiente,
        "numTemperaturaEstbRf": this.modelRedFria.temperaturaRedFria == null ? 0 : this.modelRedFria.temperaturaRedFria,
        "idTipoPeriodoValidez": this.modelFT.tipoPeriodoValidez,
        "numDosisMedicamento": this.modelFT.dosisMedicV,
        "numVolumenReconstitucion": this.modelFT.volumenReconsV,
        // fin de campos nuevos mejora 2
        "lstDiluyente": this.nvosDiluyentes
      },

      'numEnvase': this.modelReceta.numEnvases,
      'lote': this.modelReceta.lote,
      "caducidadMed": this.modelReceta.fechaAplString ? formatDate(this.modelReceta.fechaAplString, 'dd/MM/YYYY', 'en-US') : null,
      "tineDiluyente": this.modelReceta.conDiluyente == true ? 1 : 0, // si es 1 debe enviar caducidadDil
      "caducidadDil": this.modelReceta.conDiluyente == true ? formatDate(this.modelReceta.caducidadDiluyenteString, 'dd/MM/YYYY', 'en-US') : null,
      "cveUsuario": this.usuario.cemetUsuarios[0].id




    }

    console.log(newRow)


    // if (newRow.caducidadMed != null || newRow.caducidadDil != null) {
    //   newRow.caducidadMed = newRow.caducidadMed ? formatDate(newRow.caducidadMed, 'dd/MM/YYYY', 'en-US') : null
    //   newRow.caducidadDil = newRow.caducidadDil != null ? formatDate(newRow.caducidadDil, 'dd/MM/YYYY', 'en-US') : null
    // }

    const newData = [...this.antibioticosDataSource.data];

    newData.push(newRow);
    this.nvosLotes.push(newRow);
    console.log(this.nvosLotes)

    // for (let i = 0; i < this.nvosLotes.length; i++) {


    // if (this.nvosLotes[i].tineDiluyente == false) {
    //   this.nvosLotes[i].caducidadDil = null


    // }

    // if (this.nvosLotes[i].caducidadMed != null || this.nvosLotes[i].caducidadDil != null) {
    //   this.nvosLotes[i].caducidadMed = this.nvosLotes[i].caducidadMed ? formatDate(this.nvosLotes[i].caducidadMed, 'dd/MM/YYYY', 'en-US') : null
    //   this.nvosLotes[i].caducidadDil = this.nvosLotes[i].caducidadDil != null ? formatDate(this.nvosLotes[i].caducidadDil, 'dd/MM/YYYY', 'en-US') : null

    // }



    // }
    console.log(this.nvosLotes)
    this.antibioticosDataSource.data = newData;
    this.totalEvases = this.totalEvases + Number(this.modelReceta.numEnvases);



    if (this.totalEvases == this.modelSelected.numEnv && this.existeFicha || this.totalEvases != this.modelSelected.numEnv && this.existeFicha) {
      this.formFT.disable()
    }
    if (this.totalEvases != this.modelSelected.numEnv && !this.existeFicha) {
      this.formFT.enable()
      this.formFT.get('Concentracion').disable();
    }
    if (this.totalEvases == this.modelSelected.numEnv && !this.existeFicha) {
      this.formFT.enable()
      this.formFT.get('Concentracion').disable();

    }
    this.formReceta.reset()
    this.estadoMedicamento = null





  }

  agregaDiluyenteDis() {
    if (this.modelDil.diluyente != null && this.modelDil.perValRedFria != null && this.modelDil.perValAmbiente != null) {
      return false
    } else {
      return true
    }

  }

  eliminarLote(element) {

    let newData = [...this.antibioticosDataSource.data];

    const index = newData.findIndex((e) => e.idLoteFabMedic === element.idLoteFabMedic);
    const elementDel = newData.find((e) => e.idLoteFabMedic === element.idLoteFabMedic);

    const index1 = this.nvosLotes.findIndex((e) => e.idLoteFabMedic === element.idLoteFabMedic);
    const elementDel1 = this.nvosLotes.find((e) => e.idLoteFabMedic === element.idLoteFabMedic);



    if (elementDel.idLoteFabMedic) {
      let e = {
        idLoteFabMedic: elementDel.idLoteFabMedic
      };
      this.lsEliminadosLote.push(e);
      console.log(this.lsEliminadosLote)
      console.log(this.nvosLotes)


    }




    newData.splice(index, 1);
    this.nvosLotes.splice(index1, 1)

    this.antibioticosDataSource.data = newData;
    if (this.antibioticosDataSource.data.length > 0) {
      this.totalEvases = this.totalEvases - Number(elementDel.numEnvase ? elementDel.numEnvase : elementDel.envase);

    } else {
      this.totalEvases = 0
    }

    console.log(this.nvosLotes)

  }

  getDetalleFichaTecnica(idMarca: any, idFabricante: any, recons) {
    if (this.idMedicamento && idFabricante && idMarca) {
      this.mezclasService.validaRecetaColectiva(this.idMedicamento, idFabricante, idMarca)
        .then(data => {

          if (data != null && data.fichaTecnicaDetalles != null) {

            this.fichaTecnicaDetalles = data.fichaTecnicaDetalles;

            this.formFT.controls['dosisMedicV'].setValue(this.fichaTecnicaDetalles.numDosisMedicamento)
            this.formFT.controls['volumenReconsV'].setValue(this.fichaTecnicaDetalles.numVolumenReconstitucion)
            this.formFT.controls['tipoPeriodoValidez'].setValue(this.fichaTecnicaDetalles.idTipoPeriodoValidez)
            this.formFT.controls['Concentracion'].setValue(this.fichaTecnicaDetalles.refConcentracion)
            this.formFT.controls['reqCons'].setValue(this.fichaTecnicaDetalles.idConservacionMed)

            // this.modelFT = {
            //   ...this.modelFT,
            //   dosisMedicV: this.fichaTecnicaDetalles.numDosisMedicamento,
            //   volumenReconsV: this.fichaTecnicaDetalles.numVolumenReconstitucion,
            //   tipoPeriodoValidez: this.fichaTecnicaDetalles.idTipoPeriodoValidez,
            //   Concentracion: this.fichaTecnicaDetalles.refConcentracion,
            //   reqCons: this.fichaTecnicaDetalles.idConservacionMed,



            // }
            if (this.tipoPeriodoVal == 1 || this.tipoPeriodoVal == 3) {
              this.formAmbiente.controls['perValVial'].setValue(this.fichaTecnicaDetalles.valVialAbiertoAmb)
              this.formAmbiente.controls['temperaturaAmbiente'].setValue(this.fichaTecnicaDetalles.numTemperaturaEstbAmb)
            }


            // this.modelAmbiente = {
            //   ...this.modelAmbiente,
            //   perValVial: this.fichaTecnicaDetalles.valVialAbiertoAmb,
            //   temperaturaAmbiente: this.fichaTecnicaDetalles.numTemperaturaEstbAmb,
            // }

            if (this.tipoPeriodoVal == 2 || this.tipoPeriodoVal == 3) {
              this.formRedFria.controls['perValVialAbierto'].setValue(this.fichaTecnicaDetalles?.valVialAbiertoFria)
              this.formRedFria.controls['temperaturaRedFria'].setValue(this.fichaTecnicaDetalles?.numTemperaturaEstbRf)
            }


            // this.modelRedFria = {
            //   ...this.modelAmbiente,
            //   perValVialAbierto: this.fichaTecnicaDetalles.valVialAbiertoFria,
            //   temperaturaRedFria: this.fichaTecnicaDetalles.numTemperaturaEstbRf,
            // }

            this.tipoPeriodoVal = this.fichaTecnicaDetalles.idTipoPeriodoValidez;



            // this.tipoPeriodoVal=3;//para pruebas
            if (this.tipoPeriodoVal == 1) {
              this.formAmbiente.disable();
              // this.formAmbiente?.controls['temperaturaAmbiente']?.disable()
              this.fieldsRedFria[0].hide = true;
            } else if (this.tipoPeriodoVal == 2) {
              this.formRedFria.disable()
              // this.formRedFria.controls['perValVialAbierto'].disable();
              // this.formRedFria.controls['temperaturaRedFria'].disable();
              this.fieldsAmbiente[0].hide = true;
            } else if (this.tipoPeriodoVal == 3) {
              this.formAmbiente.disable();
              this.formRedFria.disable()

              // this.formRedFria.controls['perValVialAbierto'].disable();
              // this.formRedFria.controls['temperaturaRedFria'].disable();
              // this.formAmbiente.controls['perValVial'].disable();
              // this.formAmbiente.controls['temperaturaAmbiente'].disable();

            }



            /* se comenta por mejora 2
                        this.formFT.controls['Vehiculo'].setValue(this.fichaTecnicaDetalles.refVehiculo)
                        this.formFT.controls['Concentracion'].setValue(this.fichaTecnicaDetalles.refConcentracion)
                        this.formFT.controls['vialAR'].setValue(this.fichaTecnicaDetalles.refVialAbiertoReconst)
                        this.formFT.controls['reqCons'].setValue(this.fichaTecnicaDetalles.idConservacionMed)
                       this.formFT.controls['perValVial'].setValue(this.fichaTecnicaDetalles.valVialAbiertoAmb)
                        this.formFT.controls['perValVialAbierto'].setValue(this.fichaTecnicaDetalles.valVialAbiertoFria)*/
            this.formFT.disable();
            this.formAmbiente.disable()
            this.formRedFria.disable()
            this.opcionAgregar = true
            //  recons.value= data.fichaTecnicaDetalles.idConservacionMed;





          } else {
            this.formFT.enable()
            this.formAmbiente.enable()
            this.formRedFria.enable()
            this.formFT.get('Concentracion').disable();

            this.formFT.reset()
            this.modelFT = { ...{} }
            this.fichaTecnicaDetalles = null
            this.opcionAgregar = false




          }
          if (data != null && data.lstDiluyentes != null && data.lstDiluyentes.length > 0) {

            this.diluyentesDataSource = new MatTableDataSource<any>(data.lstDiluyentes);


          }

        });

    }


  }

  async actualizar() {

    console.log(this.nvosLotes)

    for (let i = 0; i < this.nvosLotes.length; i++) {
      if (this.fichaTecnicaDetalles != null) {
        this.nvosLotes[i].fichaTecnica = {
          id: this.fichaTecnicaDetalles.idFichaTecnica,
          lstDiluyente: this.nvosDiluyentes
        }

      } else {
        if (this.nvosDiluyentes != null && this.nvosDiluyentes.length > 0) {
          this.nvosLotes[i].fichaTecnica.lstDiluyente = this.nvosDiluyentes
        }
      }

      if (this.nvosLotes[i].caducidadMed == null) {
        console.log(this.nvosLotes)
        return
      }

    }




    let request = {
      "idRecetaColectiva": this.idReceta,
      "recFolColectiva": this.recetaColectiva ? this.recetaColectiva : null,
      "lstMedicamentos": this.nvosLotes,
      "lstDelLote": this.lsEliminadosLote,
      "cveUsuario": this.usuario.cemetUsuarios[0].id
    }

    console.log(request)




    this.mezclasService.actualizarMedicamentoRecetaColectiva(request)
      .then(async data => {
        if (data) {
          this.tableDS = new MatTableDataSource([]);
          // this.totalEvases = 0
          this._alertServices.success('La <strong>información complementaria</strong> se guardo con éxito. ');
          this.isConsulta = true
          await this.getDetalleList(this.modelTipoMezcla.numReceta)
          await this.mezclasService.getRecetaColectivaMedicamentos(this.modelTipoMezcla.numReceta)
            .then(async result => {
              console.log(result)
              if (result) {
                await this.getDetalleList1(this.modelSelected.idMedicamento, result.idReceta)
              }
            })
          this.formFT.disable()
          this.formAmbiente.disable()
          this.formRedFria.disable()
          this.formDil.reset()
          this.btnTexto = 'Actualizar información'
          this.nvosLotes = []
          this.lsEliminadosLote = []






          // setTimeout(() =>  this._router.navigate([this._nav.prescripcion]), 1000);
        } else {

          this._alertServices.error("<strong>Error</strong> al guardar solicitud.");
          this.nvosLotes = []

        }

      });


  }

  btnDisabled() {

    if (this.totalEvases < this.modelSelected.numEnvSAI) {
      return true
    } else {
      return false
    }
    return true

  }

  shortTableAnti(sort: Sort) {

    const array = this.antibioticosDataSource.data;
    let des = sort.direction == 'desc';
    const sortedArray = this.sortArrayOfObjects(array, sort.active, des);
    //let otherModel = {...this.modelo};
    // otherModel.content = sortedArray;
    // console.log(otherModel)
    this.antibioticosDataSource = new MatTableDataSource(sortedArray);
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

    const newData = [...this.diluyentesDataSource.data];
    newData.push(newRow);
    this.nvosDiluyentes.push(newRow2);
    this.diluyentesDataSource.data = newData;

    this.formDil.reset()



  }





  buscaMedicamento1() {

    this.mezclasService.getRecetaColectivaMedicamentos(1).then(data => {

      this.myData = data.lstMedicamentosSAI
      this.tableDS = new MatTableDataSource(this.myData);
      this.collectionSize = this.myData.length
    })


    if (this.medicamentoList != null && this.medicamentoList.length > 0) {

      const dialogRef = this._dialog.open(
        DialogComponent,
        this._dialogService.deseasConsultarOtraRecetaColectiva()
      );

      dialogRef.afterClosed().subscribe(
        async data => {

          if (data) {
            this.tableDS = new MatTableDataSource([]);
            this.totalEvases = 0
            this.formReceta.reset()
            this.formDil.reset()
            this.antibioticosDataSource = new MatTableDataSource<any>([]);
            this.diluyentesDataSource = new MatTableDataSource<any>([]);


            this.getDetalleList(this.modelTipoMezcla.numReceta);


          }
        }
      );

    } else
      this.getDetalleList(this.modelTipoMezcla.numReceta);

  }

  validarRecetaColectivaSAI(numReceta: any) {//pendiente implementar el llamado a SAI para verificar si existe.
    if (numReceta == null)
      return false;
    else return true;

  }
  registrarReceta() {


    let receta = {
      "regTotal": true,
      "recFolColectiva": this.modelTipoMezcla.numReceta,
      "idRecetaColectiva": this.idReceta,
      "cveUsuario": this.usuario.cemetUsuarios[0].id
    }
    this.mezclasService.registrarRecetaCollectiva(receta)
      .then(data => {


        if (data) {
          this._alertServices.success("La <strong>información complementaria</strong> se guardo con éxito.");
          this.medicamentoList = [];
          this.formTipoMezcla.reset();
          this.isConsulta = false
          this.diluyentesDataSource = new MatTableDataSource<any>([]);
          this.tableDS = new MatTableDataSource<any>([]);
          this.totalEvases = 0
          this.isGuardados = false





        } else {

          this._alertServices.error("<strong>Error</strong> No se encontraron resultados con los criterios de búsqueda ingresados.");
        }

      });






  }
  onEditMedicamento(medicamentoDetail) {
    if (medicamentoDetail.operation == "update") {
      console.log("reloading...");
      this.getDetalleList(this.modelTipoMezcla.numReceta);
      let position = Number(medicamentoDetail.numMedicamento) - 1;
      setTimeout(() => { this.selected.setValue(position) }, 0);
    }

  }





  model: any = {};
  form = new FormGroup({});
  fields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: "col-lg-3 col-md-6",
          key: 'lote',
          type: 'input-mask',
          props: {
            label: 'Lote',
            placeholder: 'Captura lote',
            required: true,
            appInputMaskType: 'integer',
            maxLength: 2,
          },
        },
        {
          className: "col-lg-3 col-md-6",
          key: 'caducidad',
          type: 'select',
          templateOptions: {
            label: 'Fecha(s) de caducidad',
            required: true,
            options: this.mezclasService.getfechasCad(1),
            labelProp: 'fechaCaducidad',
            valueProp: 'idLoteFabMedic'
          },

        },
        {
          className: "col-lg-3 col-md-6",
          key: 'piezas',
          type: 'input',
          templateOptions: {
            label: 'Piezas',
            required: true,
          },

        },
        {
          className: 'col-lg-3 col-md-6',
          key: 'btnAdd',
          type: 'button',
          props: {
            label: ' ',
            text: 'Agregar',
            onClick: (to, $event, field) => {

              if (this.form.valid) {
                this.onAsignar();

              }
            },
            classBtn: 'btn-ico estilo-btn',
            btnType: 'outline-basic',
            icon: 'agregar',
          },
          expressionProperties: {
            'props.disabled': () => {
              return this.form.invalid

            },
          },
        },

      ]
    }
  ]
  myData: any;
  async highlight(row) {
    this.isChange = true

    if (this.isChange == true) {
      this.formFT.enable()
      this.formReceta.enable()
      this.formAmbiente.enable()
      this.formRedFria.enable()
      this.formDil.enable()
      this.diluyentesDataSource = new MatTableDataSource<any>([]);
      this.antibioticosDataSource = new MatTableDataSource<any>([]);
      this.totalEvases = 0;
      this.lstMedicamentos = []
      this.opcionAgregar = false

    }


    console.log(row)
    console.log(this.medicamentoList)
    for (let i = 0; i < this.medicamentoList.length; i++) {
      if (this.medicamentoList[i].value.idMedicamento == row.idMedicamento) {
        this.indGuardadoCompleto = this.medicamentoList[i].value.indGuardadoCompleto ? this.medicamentoList[i].value.indGuardadoCompleto : null
        if (this.indGuardadoCompleto == true) {

        }
      }

    }

    console.log(this.indGuardadoCompleto)
    if (row.idRecColMedic == undefined && row.idLoteFabMed == undefined) {
      this.btnTexto = 'Guardar información'

    } else {
      this.btnTexto = 'Actualizar información'
    }




    if ((this.formReceta.touched || this.formDil.touched || this.formFT.touched || this.diluyentesDataSource.data.length > 0 || this.antibioticosDataSource.data.length > 0) && (this.isConsulta == true) && ((!this.modelSelected.idRecColMedic && !this.modelSelected.idLoteFabMed) || (this.modelSelected.idRecColMedic && this.modelSelected.idLoteFabMed)) && (this.indGuardadoCompleto == null)) {

      const dialogRef = this._dialog.open(
        DialogComponent,
        this._dialogService.deseasCambiarMedicamentoRecetaColectiva()
      );

      dialogRef.afterClosed().subscribe(
        async data => {

          if (data) {
            this.modelFT = { ...{} }
            this.getDetalleList(this.modelTipoMezcla.numReceta);
            this.isConsulta = true
            console.log(row)
            this.modelSelected = row;
            this.model = { ...this.modelSelected }
            this.form.reset(this.model);
            this.formReceta.reset()
            this.formDil.reset()
            this.formFT.reset()
            this.formAmbiente.reset()
            this.formRedFria.reset()
            console.log(this.modelSelected)
            this.estadoMedicamento = null;
            this.nvosLotes = [];
            this.nvosDiluyentes = [];
            this.lsEliminadosLote = [];
            this.lsEliminadosDiluyentes = [];
            this.nombreMedicamento = this.modelSelected.desCorta;
            this.idMedicamento = this.modelSelected.idMedicamento;
            this.idReceta = this.modelSelected.idReceta ? this.modelSelected.idReceta : null;
            this.recetaColectiva = this.modelTipoMezcla.numReceta;
            this.idRecColMedic = this.modelSelected.idRecColMedic;
            this.indGuardadoCompleto = this.modelSelected.indGuardadoCompleto;
            this.numMedicamento = this.modelSelected.numMedicamento;
            console.log("ind guardado", this.indGuardadoCompleto);
            //this.formFT?.controls['Concentracion'].disable();




            this.mezclasService.getRecetaColectivaMedicamentos(this.recetaColectiva)
              .then(data => {
                console.log(data.lstMedicamentosSAI)

                this.indGuardadoCompleto = data.indGuardadoParcial

                this.listaSinDuplicados = [...new Set(data.lstMedicamentosSAI.map(medicamento => medicamento.idMedicamento))].map(id => data.lstMedicamentosSAI.find(medicamento => medicamento.idMedicamento === id));

                console.log(this.listaSinDuplicados);

                data.lstMedicamentosSAI = this.listaSinDuplicados

                this.lstMedicamentos = data.lstMedicamentosSAI



                console.log(this.lstMedicamentos);

                if (data) {
                  if (row.idRecColMedic != null && row.idLoteFabMed != null) {
                    for (let i = 0; i < this.lstMedicamentos.length; i++) {
                      if (this.lstMedicamentos[i].idMedicamento == this.idMedicamento) {

                        this.numeroEnv = this.lstMedicamentos[i].numEnvSAI


                        this.usuario = this._accountService.getUser();
                        if (this.idReceta != null && this.idReceta != undefined) {
                          this.getDetalleList1(this.idMedicamento, this.idReceta)
                        }

                        if (this.lstMedicamentos[i].fichaTecnica?.fichaTecnicaDetalles) {

                           this.opcionAgregar=true;//se agrega por regla de claus

                          this.modelFT = {
                            ...this.modelFT,
                            dosisMedicV: this.lstMedicamentos[i].fichaTecnica.fichaTecnicaDetalles.numDosisMedicamento,
                            volumenReconsV: this.lstMedicamentos[i].fichaTecnica.fichaTecnicaDetalles.numVolumenReconstitucion,
                            tipoPeriodoValidez: this.lstMedicamentos[i].fichaTecnica.fichaTecnicaDetalles.idTipoPeriodoValidez,
                            Concentracion: this.lstMedicamentos[i].fichaTecnica.fichaTecnicaDetalles.refConcentracion,
                            reqCons: this.lstMedicamentos[i].fichaTecnica.fichaTecnicaDetalles.idConservacionMed,

                          }

                          this.modelAmbiente = {
                            ...this.modelAmbiente,
                            perValVial: this.lstMedicamentos[i].fichaTecnica.fichaTecnicaDetalles.valVialAbiertoAmb,
                            temperaturaAmbiente: this.lstMedicamentos[i].fichaTecnica.fichaTecnicaDetalles.numTemperaturaEstbAmb,

                          }
                          this.modelRedFria = {
                            ...this.modelAmbiente,
                            perValVialAbierto: this.lstMedicamentos[i].fichaTecnica.fichaTecnicaDetalles.valVialAbiertoFria,
                            temperaturaRedFria: this.lstMedicamentos[i].fichaTecnica.fichaTecnicaDetalles.numTemperaturaEstbRf,

                          }

                          this.tipoPeriodoVal = this.lstMedicamentos[i].fichaTecnica.fichaTecnicaDetalles.idTipoPeriodoValidez;



                          if (this.tipoPeriodoVal == 1) {
                            this.formAmbiente.disable();
                            this.fieldsRedFria[0].hide = true;
                            this.fieldsAmbiente[0].hide = false;
                          } else if (this.tipoPeriodoVal == 2) {

                            this.formRedFria.disable();
                            this.fieldsAmbiente[0].hide = true;
                            this.fieldsRedFria[0].hide = false;
                          } else if (this.tipoPeriodoVal == 3) {

                            this.fieldsAmbiente[0].hide = false;
                            this.fieldsRedFria[0].hide = false;
                            this.formRedFria.disable();
                            this.formAmbiente.disable();

                          }

                          /*  por MEJORA 2 SE COMENTA 
                            this.formFT.controls['Vehiculo'].setValue(this.lstMedicamentos[i].fichaTecnica.fichaTecnicaDetalles.refVehiculo)
                            this.formFT.controls['Concentracion'].setValue(this.lstMedicamentos[i].fichaTecnica.fichaTecnicaDetalles.refConcentracion)
                            this.formFT.controls['vialAR'].setValue(this.lstMedicamentos[i].fichaTecnica.fichaTecnicaDetalles.refVialAbiertoReconst)
                            this.formFT.controls['reqCons'].setValue(this.lstMedicamentos[i].fichaTecnica.fichaTecnicaDetalles.idConservacionMed)
                           
                           
                            this.formFT.controls['perValVial'].setValue(this.lstMedicamentos[i].fichaTecnica.fichaTecnicaDetalles.valVialAbiertoAmb)
                            this.formFT.controls['perValVialAbierto'].setValue(this.lstMedicamentos[i].fichaTecnica.fichaTecnicaDetalles.valVialAbiertoFria)
                            */
                          this.formFT.disable()

                          if (this.indGuardadoCompleto == true) {
                            this.formFT.disable()

                          }
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

                          if (this.lstMedicamentos[i].fichaTecnica?.fichaTecnicaDetalles) {
                            /* se comenta por mejora 2
                            this.formFT.controls['Vehiculo'].setValue(this.lstMedicamentos[i].fichaTecnica.fichaTecnicaDetalles.refVehiculo)
                            this.formFT.controls['Concentracion'].setValue(this.lstMedicamentos[i].fichaTecnica.fichaTecnicaDetalles.refConcentracion)
                            this.formFT.controls['vialAR'].setValue(this.lstMedicamentos[i].fichaTecnica.fichaTecnicaDetalles.refVialAbiertoReconst)
                            this.formFT.controls['reqCons'].setValue(this.lstMedicamentos[i].fichaTecnica.fichaTecnicaDetalles.idConservacionMed)
                            this.formFT.controls['perValVial'].setValue(this.lstMedicamentos[i].fichaTecnica.fichaTecnicaDetalles.valVialAbiertoAmb)
                            this.formFT.controls['perValVialAbierto'].setValue(this.lstMedicamentos[i].fichaTecnica.fichaTecnicaDetalles.valVialAbiertoFria)
                            
                            */

                            this.modelFT = {
                              ...this.modelFT,
                              dosisMedicV: this.lstMedicamentos[i].fichaTecnica.fichaTecnicaDetalles.numDosisMedicamento,
                              volumenReconsV: this.lstMedicamentos[i].fichaTecnica.fichaTecnicaDetalles.numVolumenReconstitucion,
                              tipoPeriodoValidez: this.lstMedicamentos[i].fichaTecnica.fichaTecnicaDetalles.idTipoPeriodoValidez,
                              Concentracion: this.lstMedicamentos[i].fichaTecnica.fichaTecnicaDetalles.refConcentracion,
                              reqCons: this.lstMedicamentos[i].fichaTecnica.fichaTecnicaDetalles.idConservacionMed,

                            }


                            this.modelAmbiente = {
                              ...this.modelAmbiente,
                              perValVial: this.lstMedicamentos[i].fichaTecnica.fichaTecnicaDetalles.valVialAbiertoAmb,
                              temperaturaAmbiente: this.lstMedicamentos[i].fichaTecnica.fichaTecnicaDetalles.numTemperaturaEstbAmb,

                            }
                            this.modelRedFria = {
                              ...this.modelAmbiente,
                              perValVialAbierto: this.lstMedicamentos[i].fichaTecnica.fichaTecnicaDetalles.valVialAbiertoFria,
                              temperaturaRedFria: this.lstMedicamentos[i].fichaTecnica.fichaTecnicaDetalles.numTemperaturaEstbRf,

                            }

                            this.tipoPeriodoVal = this.lstMedicamentos[i].fichaTecnica.fichaTecnicaDetalles.idTipoPeriodoValidez;

                            if (this.tipoPeriodoVal == 1) {
                              this.formAmbiente.disable();
                              this.fieldsRedFria[0].hide = true;
                              this.fieldsAmbiente[0].hide = false;
                            } else if (this.tipoPeriodoVal == 2) {

                              this.formRedFria.disable();
                              this.fieldsAmbiente[0].hide = true;
                              this.fieldsRedFria[0].hide = false;
                            } else if (this.tipoPeriodoVal == 3) {

                              this.fieldsAmbiente[0].hide = false;
                              this.fieldsRedFria[0].hide = false;
                              this.formRedFria.disable();
                              this.formAmbiente.disable();

                            }




                            if (this.indGuardadoCompleto == true) {
                              this.formFT.disable();
                            }
                          }
                          this.formFT.disable();
                          this.formDil.disable();
                        }

                      }





                    }
                  }

                }
              })





          } 
        }
      );



    } else {

      this.getDetalleList(this.modelTipoMezcla.numReceta);
      this.isConsulta = true
      console.log(row)
      this.modelSelected = row;
      this.form.reset(this.model);
      this.formReceta.reset()
      this.formDil.reset()
      this.formFT.reset()
      this.formAmbiente.reset()
      this.formRedFria.reset()
      this.formFT?.controls['Concentracion']?.disable();



      console.log(this.modelSelected)
      this.estadoMedicamento = null;
      this.nvosLotes = [];
      this.nvosDiluyentes = [];
      this.lsEliminadosLote = [];
      this.lsEliminadosDiluyentes = [];
      this.nombreMedicamento = this.modelSelected.desCorta;
      this.idMedicamento = this.modelSelected.idMedicamento;
      this.idReceta = this.modelSelected.idReceta ? this.modelSelected.idReceta : null;
      this.recetaColectiva = this.modelTipoMezcla.numReceta;
      this.idRecColMedic = this.modelSelected.idRecColMedic;
      this.indGuardadoCompleto = this.modelSelected.indGuardadoCompleto;
      this.numMedicamento = this.modelSelected.numMedicamento;
      console.log("ind guardado", this.indGuardadoCompleto);


      this.mezclasService.getRecetaColectivaMedicamentos(this.recetaColectiva)
        .then(data => {
          this.indGuardadoCompleto = data.indGuardadoParcial
          console.log(data.lstMedicamentosSAI)

          this.listaSinDuplicados = [...new Set(data.lstMedicamentosSAI.map(medicamento => medicamento.idMedicamento))].map(id => data.lstMedicamentosSAI.find(medicamento => medicamento.idMedicamento === id));

          console.log(this.listaSinDuplicados);

          data.lstMedicamentosSAI = this.listaSinDuplicados

          this.lstMedicamentos = data.lstMedicamentosSAI

          console.log(this.lstMedicamentos);

          if (data) {
            if (row.idRecColMedic != null && row.idLoteFabMed != null) {
              for (let i = 0; i < this.lstMedicamentos.length; i++) {
                if (this.lstMedicamentos[i].idMedicamento == this.idMedicamento) {
                  this.numeroEnv = this.lstMedicamentos[i].numEnvSAI
                  this.usuario = this._accountService.getUser();
                  if (this.idReceta != null && this.idReceta != undefined) {
                    this.getDetalleList1(this.idMedicamento, this.idReceta)
                  }

                  if (this.lstMedicamentos[i].fichaTecnica?.fichaTecnicaDetalles) {
                    console.log(this.modelSelected)



                    this.modelFT = {
                      ...this.modelFT,
                      dosisMedicV: this.modelSelected.fichaTecnica.fichaTecnicaDetalles.numDosisMedicamento,
                      volumenReconsV: this.modelSelected.fichaTecnica.fichaTecnicaDetalles.numVolumenReconstitucion,
                      tipoPeriodoValidez: this.modelSelected.fichaTecnica.fichaTecnicaDetalles.idTipoPeriodoValidez,
                      Concentracion: this.modelSelected.fichaTecnica.fichaTecnicaDetalles.refConcentracion,
                      reqCons: this.modelSelected.fichaTecnica.fichaTecnicaDetalles.idConservacionMed,

                    }

                    this.modelAmbiente = {
                      ...this.modelAmbiente,
                      perValVial: this.modelSelected.fichaTecnica.fichaTecnicaDetalles.valVialAbiertoAmb,
                      temperaturaAmbiente: this.modelSelected.fichaTecnica.fichaTecnicaDetalles.numTemperaturaEstbAmb,

                    }
                    this.modelRedFria = {
                      ...this.modelAmbiente,
                      perValVialAbierto: this.modelSelected.fichaTecnica.fichaTecnicaDetalles.valVialAbiertoFria,
                      temperaturaRedFria: this.modelSelected.fichaTecnica.fichaTecnicaDetalles.numTemperaturaEstbRf,

                    }
                    this.tipoPeriodoVal = this.modelSelected.fichaTecnica.fichaTecnicaDetalles.idTipoPeriodoValidez;



                    // this.tipoPeriodoVal=3;//para pruebas
                    if (this.tipoPeriodoVal == 1) {
                      // this.formAmbiente.disable();
                      this.fieldsRedFria[0].hide = true;
                      this.fieldsAmbiente[0].hide = false;
                    } else if (this.tipoPeriodoVal == 2) {

                      // this.formRedFria.disable();
                      this.fieldsAmbiente[0].hide = true;
                      this.fieldsRedFria[0].hide = false;
                    } else if (this.tipoPeriodoVal == 3) {

                      this.fieldsAmbiente[0].hide = false;
                      this.fieldsRedFria[0].hide = false;
                      // this.formRedFria.disable();
                      // this.formAmbiente.disable();

                    }



                    this.formFT.disable()
                    this.formAmbiente.disable()
                    this.formRedFria.disable()



                    if (this.indGuardadoCompleto == true) {
                      this.formFT.disable()

                    }
                  }

                  if (this.lstMedicamentos[i]?.fichaTecnica?.lstDiluyentes) {
                    this.diluyentesDataSource = new MatTableDataSource<any>(this.lstMedicamentos[i].fichaTecnica.lstDiluyentes);

                  }


                  if (this.indGuardadoCompleto) {

                    console.log(this.lstMedicamentos);


                    this.estadoMedicamento = this.lstMedicamentos[i].loteFab.buenMalEstado == true ? "true" : "false"
                    console.log(this.estadoMedicamento)
                    this.formReceta.controls['fabricante'].setValue(this.lstMedicamentos[i].loteFab.idFabricante)
                    this.formReceta.controls['marca'].setValue(this.lstMedicamentos[i].loteFab.idMarca)
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
                    this.formDil.disable();

                  }
                }
              }
            }
          }
        })




      this.usuario = this._accountService.getUser();
      if (this.idReceta != null && this.idReceta != undefined)
        this.getDetalleList1(this.idMedicamento, this.idReceta)
    }
  }

  getDetalleList1(idMedicamento, idReceta) {

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

  onAtras() {
    this._router.navigate([this._nav.preparacion]);
  }

  onAsignar() {
    console.log(this.lotes)


    let model = {
      lote: this.model.lote,
      caducidad: this.model.caducidad,
      piezas: this.model.piezas
    }
    this.lotes.push(model)

    this.diluyentesDataSource = new MatTableDataSource(this.lotes);
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

}


