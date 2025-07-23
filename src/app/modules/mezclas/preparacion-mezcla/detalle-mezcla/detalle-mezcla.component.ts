import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { GeneralComponent } from 'src/app/modules/general/general.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { PreparacionService } from 'src/app/shared/services/preparacion.service';
import { Subject } from 'rxjs';
import * as moment from 'moment';
import { SeguimientoService } from 'src/app/shared/services/seguimiento.service';
import { DialogoImprimirComponent } from './dialog/dialogo-imprimir/dialogo-imprimir.component';
import { DialogoFinalizarComponent } from './dialog/dialogo-finalizar/dialogo-finalizar.component';

@Component({
  selector: 'app-detalle-mezcla',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule
  ],
  templateUrl: './detalle-mezcla.component.html',
  styleUrls: ['./detalle-mezcla.component.scss'],
})
export class DetalleMezclaComponent extends GeneralComponent {

  $obsModelSelect = new Subject<any>();
  $obsLoteSelect = new Subject<any>();
  $obsTipoAccion = new Subject<any>();

  nombrePaciente: any;
  _preparacionService = inject(PreparacionService);
  _seguimientoService = inject(SeguimientoService);
  mezclaSeleccionada = this._sesionStorage.getJsonValue('mezclaSeleccionada');
  tableDS: MatTableDataSource<any>;
  tableSolucionesBase: MatTableDataSource<any>;
  tableDS1: MatTableDataSource<any>;
  tableEnc: MatTableDataSource<any>;
  tableEnc1: MatTableDataSource<any>;
  collectionSize: number = 0;
  collectionSizeAsig: number = 0;
  displayedColumns = ['no', 'desCorta', 'dosis', 'unidadMedid', 'estatus']
  displayedColumns2 = ['no', 'desCorta1', 'dosis1', 'volumen', 'viales', 'ml', 'solucion', 'estatus1']
  displayedColumnsNPT = ['no', 'base', 'volumen', 'presentacion', 'estatus']
  displayedColumns1 = ['no', 'componente', 'dosis', 'volumen1', 'viales1', 'ml', 'solucion', 'estatus1']
  modelSelected: any = {};
  model: any = {};
  form = new FormGroup({});
  listaLotes: any = [];
  changeNoSave = false;
  tipoAccion = 1; // tipo de accion 1= finalizar 2 = imprimir
  folioMezcla = '';
  impresionDb = false;

  fields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: "col-lg-8 col-md-12",
          key: 'loteDiluy',
          type: 'input',
          props: {
            label: 'Lote',
            placeholder: 'Captura lote',
            required: true,

            maxLength: 30,
          },
          expressions: {
            hide: (model: any) => {
              if (
                this.modelSelected.tipo == 0
              ) {
                return false
              }
              return true
            },
            'props.disabled': (field: FormlyFieldConfig) => {
              if (this.tipoAccion == 2) {
                return true;
              }
              return false;
            },
          },
        },
        // {
        //   className: "col-lg-4 col-md-6",
        //   key: 'caducidadDiluy',
        //   type: 'material-date',
        //   templateOptions: {
        //     label: 'Caducidad del medicamento',
        //     required: true,
        //     placeholder:'Selecciona fecha'
        //   },
        //   expressions: {
        //     hide: (model: any) => {
        //       if (
        //         this.modelSelected.tipo == 0
        //       ) {
        //         return false
        //       }
        //       return true
        //     },

        //     'props.disabled': (field: FormlyFieldConfig) => {
        //       if (this.tipoAccion == 2) {
        //         return true;
        //       }
        //       return false;
        //     },
        //   },
        // },
        {
          className: "col-lg-8 col-md-12",
          key: 'loteMed',
          type: 'select',
          props: {
            label: 'Lote',
            placeholder: 'Selecciona lote',
            required: true,
            valueProp: 'idLoteFabricMedic',
            labelProp: 'refLote',
            options: [],
            change: (field, $event) => {
              field.props.options.forEach(e => {
                if (!field.formControl.value) {
                  this.$obsLoteSelect.next(null);
                  this.modelSelected.loteFabric = undefined;
                  this.modelSelected.desFabricante = undefined;
                  this.modelSelected.desMarca = undefined;
                }
                else if (e['idLoteFabricMedic'] == field.formControl.value) {
                  this.$obsLoteSelect.next(e);

                  this.modelSelected.loteFabric = e;
                  this.modelSelected.desFabricante = e['desFabricante'];
                  this.modelSelected.desMarca = e['desMarca'];
                }
              });

              // this.$obsLoteSelect.next(field.formControl.value); 
            }
          },
          hooks: {
            onInit: (field) => {
              this.$obsModelSelect.subscribe(
                async resp => {
                  if (resp != null && resp.tipo == 1) {

                    if (this.tipoAccion == 2) {
                      field.props.options = [resp.loteFabric]
                    } else {
                      this._preparacionService.getLote(resp.idMedicamento, resp.idMezclaAplicDiaDosis).then(data => {
                        if (data != null) {
                          this.listaLotes = data;
                          field.props.options = data;
                        } else {
                          this.listaLotes = [];
                          field.props.options = this.listaLotes;
                        }


                      });
                    }



                  }
                }
              );
            },

          },
          expressions: {
            hide: (model: any) => {
              if (
                this.modelSelected.tipo == 1
              ) {
                return false
              }
              return true
            },
            'props.disabled': (field: FormlyFieldConfig) => {
              if (this.tipoAccion == 2) {
                return true;
              }
              return false;
            },
          },
        },
        // {
        //   className: "col-lg-4 col-md-6",
        //   key: 'caducidadMed',
        //   type: 'select',
        //   props: {
        //     label: 'Caducidad del medicamento',
        //     placeholder: 'Selecciona fecha',
        //     required: true,
        //     valueProp: 'idLoteFabricMedic',
        //     labelProp: 'fecCaducidadMedicString',
        //     options: []
        //   },
        //   hooks: {
        //     onInit: (field) => {

        //       this.$obsModelSelect.subscribe(
        //         async resp => {
        //           if (resp != null && resp.tipo == 1) {
        //             field.props.options = [resp.loteFabric]
        //           }
        //         }
        //       );


        //       this.$obsLoteSelect.subscribe(
        //         async resp => {
        //           if (resp != null) {
        //             resp.fecCaducidadMedicString = moment(resp.fecCaducidadMedic, 'YYYY-MM-DD').format('DD/MM/YYYY');
        //             field.props.options = [resp];
        //             field.formControl.patchValue(resp.idLoteFabricMedic);
        //           } else {
        //             field.formControl.patchValue(undefined);
        //           }
        //         }
        //       );
        //     }
        //   },
        //   expressions: {
        //     hide: (model: any) => {
        //       if (
        //         this.modelSelected.tipo == 1
        //       ) {
        //         return false
        //       }
        //       return true
        //     },
        //     'props.disabled': (field: FormlyFieldConfig) => {
        //       if (this.tipoAccion == 2) {
        //         return true;
        //       }
        //       return false;
        //     },
        //   },
        // },
        // {
        //   className: 'col-lg-4 col-md-6',
        //   key: 'btnAdd',
        //   type: 'button',
        //   props: {
        //     label: ' ',
        //     text: 'Asignar',
        //     onClick: (to, $event, field) => {
        //       if (this.form.valid) {
        //         this.onAsignar();

        //       }
        //     },
        //     classBtn: 'btn-ico estilo-btn',
        //     btnType: 'outline-basic',
        //     icon: 'agregar',
        //   },
        //   hooks: {
        //     afterViewInit: (field) => {
        //       this.$obsTipoAccion.subscribe(
        //         async resp => {
        //           if (resp == 2) {
        //             field.props.disabled = true;
        //           }
        //         }
        //       );
        //     }
        //   },
        //   expressions: {
        //     'props.disabled': (field: FormlyFieldConfig) => {

        //       return this.desabilitaBtn(field);
        //     },
        //   },
        // },

      ]
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        // {
        //   className: "col-lg-4 col-md-6",
        //   key: 'loteDiluy',
        //   type: 'input',
        //   props: {
        //     label: 'Lote',
        //     placeholder: 'Captura lote',
        //     required: true,

        //     maxLength: 30,
        //   },
        //   expressions: {
        //     hide: (model: any) => {
        //       if (
        //         this.modelSelected.tipo == 0
        //       ) {
        //         return false
        //       }
        //       return true
        //     },
        //     'props.disabled': (field: FormlyFieldConfig) => {
        //       if (this.tipoAccion == 2) {
        //         return true;
        //       }
        //       return false;
        //     },
        //   },
        // },
        {
          className: "col-lg-8 col-md-12",
          key: 'caducidadDiluy',
          type: 'material-date',
          templateOptions: {
            label: 'Caducidad del medicamento',
            required: true,
            placeholder: 'Selecciona fecha'
          },
          expressions: {
            hide: (model: any) => {
              if (
                this.modelSelected.tipo == 0
              ) {
                return false
              }
              return true
            },

            'props.disabled': (field: FormlyFieldConfig) => {
              if (this.tipoAccion == 2) {
                return true;
              }
              return false;
            },
          },
        },
        // {
        //   className: "col-lg-4 col-md-6",
        //   key: 'loteMed',
        //   type: 'select',
        //   props: {
        //     label: 'Lote',
        //     placeholder: 'Selecciona lote',
        //     required: true,
        //     valueProp: 'idLoteFabricMedic',
        //     labelProp: 'refLote',
        //     options: [],
        //     change: (field, $event) => {
        //       field.props.options.forEach(e => {
        //         if(!field.formControl.value){
        //           this.$obsLoteSelect.next(null);
        //           this.modelSelected.loteFabric = undefined;
        //           this.modelSelected.desFabricante = undefined;
        //           this.modelSelected.desMarca =undefined;
        //         }
        //        else if (e['idLoteFabricMedic'] == field.formControl.value) {
        //           this.$obsLoteSelect.next(e);

        //           this.modelSelected.loteFabric = e;
        //           this.modelSelected.desFabricante = e['desFabricante'];
        //           this.modelSelected.desMarca = e['desMarca'];
        //         }
        //       });

        //       // this.$obsLoteSelect.next(field.formControl.value); 
        //     }
        //   },
        //   hooks: {
        //     onInit: (field) => {
        //       this.$obsModelSelect.subscribe(
        //         async resp => {
        //           if (resp != null && resp.tipo == 1) {

        //             if (this.tipoAccion == 2) {
        //               field.props.options = [resp.loteFabric]
        //             } else {
        //               this._preparacionService.getLote(resp.idMedicamento,resp.idMezclaAplicDiaDosis).then(data => {
        //                 if (data != null) {
        //                   this.listaLotes = data;
        //                   field.props.options = data;
        //                 } else {
        //                   this.listaLotes = [];
        //                   field.props.options = this.listaLotes;
        //                 }


        //               });
        //             }



        //           }
        //         }
        //       );
        //     },

        //   },
        //   expressions: {
        //     hide: (model: any) => {
        //       if (
        //         this.modelSelected.tipo == 1
        //       ) {
        //         return false
        //       }
        //       return true
        //     },
        //     'props.disabled': (field: FormlyFieldConfig) => {
        //       if (this.tipoAccion == 2) {
        //         return true;
        //       }
        //       return false;
        //     },
        //   },
        // },
        {
          className: "col-lg-8 col-md-12",
          key: 'caducidadMed',
          type: 'select',
          props: {
            label: 'Caducidad del medicamento',
            placeholder: 'Selecciona fecha',
            required: true,
            valueProp: 'idLoteFabricMedic',
            labelProp: 'fecCaducidadMedicString',
            options: []
          },
          hooks: {
            onInit: (field) => {

              this.$obsModelSelect.subscribe(
                async resp => {
                  if (resp != null && resp.tipo == 1) {
                    field.props.options = [resp.loteFabric]
                  }
                }
              );


              this.$obsLoteSelect.subscribe(
                async resp => {
                  if (resp != null) {
                    resp.fecCaducidadMedicString = moment(resp.fecCaducidadMedic, 'YYYY-MM-DD').format('DD/MM/YYYY');
                    field.props.options = [resp];
                    field.formControl.patchValue(resp.idLoteFabricMedic);
                  } else {
                    field.formControl.patchValue(undefined);
                  }
                }
              );
            }
          },
          expressions: {
            hide: (model: any) => {
              if (
                this.modelSelected.tipo == 1
              ) {
                return false
              }
              return true
            },
            'props.disabled': (field: FormlyFieldConfig) => {
              if (this.tipoAccion == 2) {
                return true;
              }
              return false;
            },
          },
        },
        {
          className: 'col-lg-4 col-md-12',
          key: 'btnAdd',
          type: 'button',
          props: {
            label: ' ',
            text: 'Asignar',
            onClick: (to, $event, field) => {
              if (this.form.valid) {
                this.onAsignar();

              }
            },
            classBtn: 'btn-ico estilo-btn',
            btnType: 'outline-basic',
            icon: 'agregar',
          },
          hooks: {
            afterViewInit: (field) => {
              this.$obsTipoAccion.subscribe(
                async resp => {
                  if (resp == 2) {
                    field.props.disabled = true;
                  }
                }
              );
            }
          },
          expressions: {
            'props.disabled': (field: FormlyFieldConfig) => {

              return this.desabilitaBtn(field);
            },
          },
        },

      ]
    }
  ]


  desabilitaBtn(field) {

    if (this.tipoAccion == 2) {
      return true;
    }

    if (field.model.tipo == 0) {
      if (field.model.loteDiluy == undefined || field.model.loteDiluy == '') {
        return true;
      }
      if (field.model.caducidadDiluy == undefined) {
        return true;
      }
    }

    if (field.model.tipo == 1) {
      if (field.model.loteMed == undefined) {
        return true;
      }
      if (field.model.caducidadMed == undefined) {
        return true;
      }

    }
    return false;
  }
  //auxiliares
  myData: any;
  myDataNpt: any;
  mydataSb: any;
  volumenComNTP: any;
  volumenCom: any;
  volumenComAnti: any;
  conteo: any;

  //auxiliares
  ngOnInit() {

    console.log(this.mezclaSeleccionada)
    this._seguimientoService.getDatosPaciente(this.mezclaSeleccionada.nss).then(
      resp => {
        this.nombrePaciente = resp.nombrePaciente;
      }
    )

    this.form.valueChanges.subscribe(res => {

      if (this.model.tipo == 0) {
        if (this.model.loteDiluy != undefined || this.model.caducidadDiluy != undefined) {
          this.changeNoSave = true;
        }
      }

      if (this.model.tipo == 1) {
        if (this.model.loteMed != undefined || this.model.caducidadMed != undefined) {
          this.changeNoSave = true;
        }
      }


    })

    this._preparacionService.detalleMezcla(this.mezclaSeleccionada.idMezclaAplicDiaDosis).then(
      resp => {
        if (resp != null) {
          for (let i = 0; i < resp.length; i++) {

            let numMed = i + 1;
            resp[i].numero = numMed


          }
          console.log(resp)
          this.mydataSb = resp.filter(sb => sb.idTipoComponente == 4 || sb.tipo == 0);
          this.volumenComNTP = this.mydataSb.reduce((acumulador, item) => acumulador + item.numDosisMedicamento, 0);
          this.volumenComAnti = this.mydataSb.reduce((acumulador, item) => acumulador + Number(item.numDosisDiluyente), 0);
          this.myData = resp.sort((a, b) => (a.tipo < b.tipo ? -1 : 0));
          this.myData = resp.filter(com => com.idTipoComponente != 4 && com.tipo != 0);
          this.volumenCom = this.myData.reduce((acumulador, item) => acumulador + item.numDosisMedicamento, 0);
          console.log(this.mydataSb)
          console.log(this.mydataSb)



          for (let i = 0; i < this.myData.length; i++) {
            this.myData[i].divViales = this.myData[i].numDosisMedicamento / this.myData[i].numPiezasPresentacion
            this.myData[i].ml = this.myData[i].numDosisMedicamento / this.myData[i].numConcentracion
            this.myData[i].solucion = (this.volumenComNTP ? this.volumenComNTP : this.volumenComAnti) - this.myData[i].ml

            this.myData[i].divViales = this.myData[i].divViales.toFixed(2)
            this.myData[i].ml = this.myData[i].ml.toFixed(2)
            this.myData[i].solucion = this.myData[i].solucion.toFixed(2)

          }

          console.log(this.myData)



          this.myData.forEach((element, index) => {
            element.no = index + 1;
            element.asignado = 0;
          });

          let encabezados = [{
            'solucionBase': 'Solución base',
            'volumen': 'Volumen',
            'presentacion': 'Presentación',
            'estatus': 'Estatus',

          }]

          let encabezadosComponentes = [{
            'componentes': 'Componentes',
            'dosis': 'Dosis',
            'volumen': 'Volumen',
            'viales': 'Viales',
            'ml': 'ml',
            'solucion': 'Solucion',
            'estatus': 'Estatus',

          }]

          this.tableDS = new MatTableDataSource(this.mydataSb);
          this.tableDS1 = new MatTableDataSource(this.myData);
          this.tableEnc = new MatTableDataSource(encabezados);
          this.tableEnc1 = new MatTableDataSource(encabezadosComponentes);

          this.collectionSize = resp.length;
          this.highlight(this.myData[0]);


        }
      }
    )

    // this.highlight(this.myData[0]);
  }


  get conteoAsignados() {
    this.collectionSizeAsig = 0
    if (this.tableDS?.data) {
      this.tableDS.data.forEach(element => {
        if (element.asignado == 1) {// no asignado
          this.collectionSizeAsig++;
        }
      });
    }



    if (this.tableDS1?.data) {
      this.tableDS1.data.forEach(element => {
        if (element.asignado == 1) {// no asignado
          this.collectionSizeAsig++;
        }
      });
    }



    return this.collectionSizeAsig;
  }

  highlight(row) {
    this.$obsModelSelect.next(row);
    this.modelSelected = row;
    this.model = { ...this.modelSelected }
    this.form.reset(this.model);
  }

  onAtras() {

    if (this.changeNoSave && this.impresionDb == false) {
      const dialogRef = this._dialog.open(
        DialogComponent,
        this._dialogService.regresarPreparacionAdmin()
      );
      dialogRef.afterClosed().subscribe(
        async result => {
          if (result) {
            this._router.navigate([this._nav.preparacion]);
          }
        }
      );
    } else {
      this._router.navigate([this._nav.preparacion]);
    }


  }

  onAsignar() {

    if (this.modelSelected.tipo == 1) {
      this._preparacionService.burcarFicha(this.modelSelected.idMedicamento, this.modelSelected.loteFabric.idMarca).then(resp => {
        this.modelSelected.asignado = 1;
        this.modelSelected.loteDiluy = this.model.loteDiluy;
        this.modelSelected.loteMed = this.model.loteMed;
        this.modelSelected.caducidadDiluy = this.model.caducidadDiluy;
        this.modelSelected.caducidadMed = this.model.caducidadMed;






        if (resp != null) {
          this.modelSelected.numValVialAbierRecAmb = resp[0].numValVialAbierRecAmb;
          this.modelSelected.numValVialAbierRecRef = resp[0].numValVialAbierRecRf;
        } else {
          this.modelSelected.numValVialAbierRecAmb = Number.MAX_VALUE;
          this.modelSelected.numValVialAbierRecRef = Number.MAX_VALUE;
        }


        this.replaceOrAppend(this.myData, this.model, (a, b) => a.no === b.no);
        this.tableDS = new MatTableDataSource(this.mydataSb);
        this.tableDS1 = new MatTableDataSource(this.myData);
      })

    } else {

      this.modelSelected.asignado = 1;
      this.modelSelected.loteDiluy = this.model.loteDiluy;
      this.modelSelected.loteMed = this.model.loteMed;
      this.modelSelected.caducidadDiluy = this.model.caducidadDiluy;
      this.modelSelected.caducidadMed = this.model.caducidadMed;

      this.replaceOrAppend(this.myData, this.model, (a, b) => a.no === b.no);
      this.tableDS = new MatTableDataSource(this.myData);
      this.tableDS = new MatTableDataSource(this.mydataSb);
    }





  }

  replaceOrAppend(arr, val, compFn) {
    const res = [...arr];
    const i = arr.findIndex(v => compFn(v, val));
    if (i === -1) res.push(val);
    else res.splice(i, 1, val);
    return res;
  }

  desCorta(elemento) {
    if (elemento.tipo == 0) {//diluyente
      return elemento.desCortaDiluyente
    }
    if (elemento.tipo == 1) {//medicamento
      return elemento.desCortaMedicamento
    }
  }

  numDosis(elemento) {
    if (elemento.tipo == 0) {//diluyente
      return elemento.numDosisDiluyente
    }
    if (elemento.tipo == 1) {//medicamento
      return elemento.numDosisMedicamento
    }
  }

  unidadMedida(elemento, pos) {

    let strUnidad = '';
    if (elemento.tipo == 0) {//diluyente
      strUnidad = elemento.refUnidadMinMedidaDiluy
    }
    if (elemento.tipo == 1) {//medicamento
      strUnidad = elemento.refUnidadMinMedidaMedi
    }

    const words = strUnidad.split(' ');

    return words[pos];

  }


  validaAsignaciones() {

    let deshabilitado = false;

    if (this.tableDS?.data) {
      this.tableDS.data.forEach(element => {

        if (element.asignado == 0) {// no asignado
          deshabilitado = true;
        }

      });

    }


    if (this.tableDS1?.data) {
      this.tableDS1.data.forEach(element => {

        if (element.asignado == 0) {// no asignado
          deshabilitado = true;
        }

      });

    }




    return deshabilitado;
  }

  onAsignarTodo() {
    // this._spinner.show();
    setTimeout(() => {
      this._alertServices.success('Se han agregado los medicamentos exitosamente.');
      this.termine();
      // this._spinner.hide();
    }, 100);



  }

  onAtrasFinalizar(){

    setTimeout(() => {
      this._alertServices.success('Se finaliza la preparación exitosamente.');
      setTimeout(() => {
         this.onAtras();
      }, 500);
      
    }, 250);

  }

  onFinlaiza(modeloCaducidad) {
    let datosMezclas = [];

    if (this.tableDS?.data) {
      this.tableDS.data.forEach(element => {
        if (element.asignado == 1 && element.tipo == 0) {// asignado diluyente
          datosMezclas.push({
            idMezclaAplicDiaDosis: element.idMezclaAplicDiaDosis,
            idMezclaMedicDiluy: element.idMezclaMedicDiluy,
            refLoteFabricDiluy: element.loteDiluy,
            fecCaducidadDiluy: element.caducidadDiluy,
          });
        }
        if (element.asignado == 1 && element.tipo == 1) {// asignado medicamento
          datosMezclas.push({
            idMezclaAplicDiaDosis: element.idMezclaAplicDiaDosis,
            idMezclaMedicDiluy: element.idMezclaMedicDiluy,
            idLoteFabricacion: element.loteMed,
          });
        }
      });
    }


    if (this.tableDS1?.data) {
      this.tableDS1.data.forEach(element => {
        if (element.asignado == 1 && element.tipo == 0) {// asignado diluyente
          datosMezclas.push({
            idMezclaAplicDiaDosis: element.idMezclaAplicDiaDosis,
            idMezclaMedicDiluy: element.idMezclaMedicDiluy,
            refLoteFabricDiluy: element.loteDiluy,
            fecCaducidadDiluy: element.caducidadDiluy,
          });
        }
        if (element.asignado == 1 && element.tipo == 1) {// asignado medicamento
          datosMezclas.push({
            idMezclaAplicDiaDosis: element.idMezclaAplicDiaDosis,
            idMezclaMedicDiluy: element.idMezclaMedicDiluy,
            idLoteFabricacion: element.loteMed,
          });
        }
      });
    }


    let modelRequest = {
      idUsuarioPreparador: this._accountService.getUser().cemetUsuarios[0].id,
      datosMezclas: datosMezclas,
      refUsrPreparacion: this._accountService.getUser().nomNombreCompleto,
    }

    console.log(modelRequest);

    this._spinner.show('manual');
    this._preparacionService.finalizar(modelRequest).then(
      resp => {

        if (resp != null) {

          setTimeout(() => {
            this._preparacionService.guardaCaducidad(modeloCaducidad).then(
              resp => {
                if (resp != null) {
                  console.log(resp)
                  this.impresionDb = resp;
                  this._spinner.hide('manual');
                }
              }
            )
          }, 3000);

          this.folioMezcla = this.mezclaSeleccionada.cveFolioMezcla;
        }
      }
    )
  }

  findMin(arr, arg) {

    if (arr.length > 0) {
      let min = arr[0][arg];

      if (!min) {
        return this.randomInt;
      }
      for (let i = 1, len = arr.length; i < len; i++) {
        let v = arr[i][arg];
        min = (v < min) ? v : min;
      }

      return min;
    }

    return 0;


  }

  onImprimir() {

    if (!this.impresionDb) {

      // //calcular caducidad de la dosis preparada

      // let arrayMed = this.tableDS?.data.filter(e => (e.tipo == 1));
      // // let arrayMedRef = this.tableDS?.data.filter(e => (e.tipo == 1 && e.numValVialAbierRecRf > 0));
      // let arrayDiluy = this.tableDS?.data.filter(e => (e.tipo == 0));
      // // let arrayDiluyRef =this.tableDS?.data.filter(e => (e.tipo == 0 && e.numValDiluyRf > 0));

      // let minAmbienteMed = this.findMin(arrayMed, 'numValVialAbierRecAmb');
      // let minRefMed = this.findMin(arrayMed, 'numValVialAbierRecRf');

      // let minAmbienteDil = this.findMin(arrayDiluy, 'numValDiluyAmb');
      // let minRefDil = this.findMin(arrayDiluy, 'numValDiluyRf');

      // const timeNow = moment(new Date);

      // let minAmb = Math.min(minAmbienteMed, minAmbienteDil);
      // let minRef = Math.min(minRefMed, minRefDil)


      // let cadAmb = timeNow.add(minAmb, "h").format("YYYY-MM-DD HH:mm:ss");
      // let cadRef = timeNow.add(minRef, "h").format("YYYY-MM-DD HH:mm:ss");

      // console.log('##############################  ==========================> cadAmb: ', cadAmb, '    cadRef: ', cadRef ) ;

      let modeloCaducidad = {
        idMezclaAplicDiaDosis: this.mezclaSeleccionada.idMezclaAplicDiaDosis,
        cveUsuarioModifica: this._accountService.getUser().cemetUsuarios[0].id,
        idUsuarioPreparador: this._accountService.getUser().cemetUsuarios[0].id,
        refUsrPreparacion: this._accountService.getUser().nomNombreCompleto
      }


      // llamar  servicio para actualizacion de fecha de caducidad de la dosis que se prepraro 

      this.onFinlaiza(modeloCaducidad);


    }

    let base = 'data:image/png;base64,';

    this._preparacionService.getCodigoBarra(this.mezclaSeleccionada.cveFolioMezclaDosis).then(resp => {
      //console.log('resp',resp)

      if (resp != null) {
        base = base + resp.codigoBarraBytes;
        //console.log('base',base)
      }

      const dialogRef = this._dialog.open(
        DialogoImprimirComponent,
        this._dialogService.imprimirPreparacion(this.mezclaSeleccionada.cveFolioMezclaDosis, base)
      );

      dialogRef.afterClosed().subscribe(
        async result => {

        }
      );


    })//


  }

  calcNumDosis(elemento) {
    var splitted = elemento.desAplicacionCada.split(" ");
    return (24 / +splitted[0])
  }

  override ngOnDestroy() {
    this.$obsModelSelect.unsubscribe();
    this.$obsLoteSelect.unsubscribe();
    this.$obsTipoAccion.unsubscribe();
  }

  termine() {
    this.form.disable({ onlySelf: false, emitEvent: true })
    this.tipoAccion = 2
    this.$obsTipoAccion.next(this.tipoAccion);
  }

}
