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
import { AsignacionLoteComponent } from '../asignacion-lote/asignacion-lote.component';
import { Sort } from '@angular/material/sort';
import { NoMedicamentoComponent } from 'src/app/shared/layout/no-medicamento/no-medicamento.component';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-asignacion-medicamentos',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    TituloComponent,
    AsignacionLoteComponent,
    NoMedicamentoComponent
  ],
  templateUrl: './asignacion-medicamentos.component.html',
  styleUrls: ['./asignacion-medicamentos.component.scss']
})
export class AsignacionMedicamentosComponent extends GeneralComponent {

  tableDS: MatTableDataSource<any>;
  collectionSize: number = 0;
  displayedColumns = ['no', 'desCorta', 'total']
  modelSelected: any = {};
  isConsulta: boolean = false
  nvosDiluyentes: any[];
  lotes = []
  lstMedicamentos: any
  listaSinDuplicados: any[];
  nvosLotes: any = [];
  lstMediSAI: any;
  lstId = [];
  medicamentosUpTotal: any = 0;
  btnAsigna: boolean = false
  fechas: any
  totalPiezas = 0
  usuario: any
  cantidadTotal: any = 0




  campanaSelected: any;
  $obsModelSelected = new Subject<any>();


  constructor(
    public authService: AuthService,
    public dialog: MatDialog,
    private mezclaService: MezclasService,
    private catalogService: CatalogoService

  ) {
    super();
    this.usuario = this._accountService.getUser();





  }

  diluyentesDataSource = new MatTableDataSource<any>([]);
  diluyentesDisplayedColumns: string[] = [
    'lote',
    'fecCaducidad',
    'piezas',
    'eliminar',
  ];

  totalEvases: number = 0;


  model1: any = {};
  form1 = new FormGroup({});
  fields1: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: "col-lg-6 col-md-6",
          key: 'campana',
          type: 'select',
          props: {
            label: 'Campana',
            placeholder: 'Selecciona campana',
            required: true,
            valueProp: 'idTemporal',
            labelProp: 'desCampana',
            options: [],
            change: (field, $event) => {
              field.props.options.forEach(e => {
                if (e['idTemporal'] == field.formControl.value) {
                  this.campanaSelected = e;
                }
              });
            }
          },
          hooks: {
            onInit: async (field) => {
              this.catalogService.getTurnoCampanaPr(this.usuario.cemetUsuarios[0].idCentralMezcla.id)
                .then(
                  (dataTurnoCampana: any) => {
                    if (dataTurnoCampana) {
                      const nuevoArreglo = dataTurnoCampana.map((elemento, indice) => {
                        return {
                          ...elemento,
                          idTemporal: indice + 1,
                        };
                      });
                      field.props.options = nuevoArreglo;
                    }
                  },

                );
            }

          },

        },
        {
          className: "col-lg-6 col-md-6",
          key: 'turno',
          type: 'select',
          props: {
            label: 'Turno',
            placeholder: 'Selecciona turno',
            required: true,
            valueProp: 'id',
            labelProp: 'desTurno',
            options: this.catalogService.getTurno(),
          },

        },

      ]
    },



  ];



  model: any = {};
  form = new FormGroup({});
  fields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: "col-lg-3 col-md-6",
          key: 'lote',
          type: 'select',
          props: {
            label: 'Lote',
            placeholder: 'Captura lote',
            required: true,
            options: [],
            valueProp: 'lotes',
            labelProp: 'lotes'
          },
          hooks: {
            afterViewInit: async (field) => {


              this.$obsModelSelected.subscribe(async modeloSeleccionado => {
                if (modeloSeleccionado != null) {
                  await this.catalogService.getLote(modeloSeleccionado.idMedicamento).subscribe(dataRespoLote => {
                    console.log(dataRespoLote)
                    field.props.options = dataRespoLote
                  })
                }
              })
            },
          }
        },
        {
          className: "col-lg-3 col-md-6",
          key: 'caducidad',
          type: 'select',
          templateOptions: {
            label: 'Fecha(s) de caducidad',
            placeholder: 'Selecciona fecha',
            required: true,
            options: [],
            labelProp: 'fechaCaducidad',
            valueProp: 'idLoteFabMedic'
          },
          hooks: {
            afterViewInit: async (field) => {
              field.props.options = []
              const lote = field.form.get('lote');
              if (lote != undefined) {

                lote.valueChanges.subscribe((x) => {
                  console.log(x)
                  this.form.controls['caducidad'].patchValue(null)
                  if (x == undefined || x != null) {
                    this.mezclaService.getfechasCad(x).subscribe(data => {
                      console.log(data)
                      this.fechas = data
                      for (let i = 0; i < data.length; i++) {
                        if (data[i].fechaCaducidad) {
                          data[i].fechaCaducidad = formatDate(data[i].fechaCaducidad, 'dd/MM/YYYY', 'en-US')
                          field.props.options = data
                        } else {
                          field.formControl.patchValue(null)
                          field.props.options = []
                        }
                      }

                    })
                  } else {
                    field.formControl.patchValue(null)
                    field.props.options = []
                  }
                });
              }

            },
          }

        },
        {
          className: "col-lg-3 col-md-6",
          key: 'piezas',
          type: 'input',
          templateOptions: {
            label: 'Piezas',
            required: true,
            placeholder: 'Captura n° piezas',

          },

        },
        {
          className: 'col-lg-3 col-md-6',
          type: 'button',
          props: {
            label: ' ',
            text: 'Agregar',
            disabled: true,
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
              console.log(this.form.valid)
              if (this.form.valid == false) {
                return true
              } else {
                return false

              }


            },
          },
        },

      ]
    }
  ]

  myData: any;

  ngOnInit() {
    console.log(this.diluyentesDataSource.data)
    console.log(this.usuario)


  }

  async buscaMedicamento(turno, campana) {
    this.medicamentosUpTotal = 0;

    this.isConsulta = false
    this.tableDS = new MatTableDataSource<any>([]);


    console.log(this.campanaSelected);

    this.mezclaService.getTurnoCampanaConsulta(this.usuario.cemetUsuarios[0].idCentralMezcla.id, this.model1.turno, this.campanaSelected.id, this.campanaSelected.desCampana).then(data => {
      console.log(data)
      console.log(data.lstMedicamentosSAI)



      this.lstMediSAI = data.lstMedicamentosSAI
      const sumasNumdosis = {};
      let arraySuma = []
      this.lstMediSAI.forEach(medicamento => {
        const { idMedicamento, numdosis } = medicamento;
        if (sumasNumdosis.hasOwnProperty(idMedicamento)) {
          // Sumar la numdosis actual al valor existente
          sumasNumdosis[idMedicamento] += numdosis;
        } else {
          sumasNumdosis[idMedicamento] = numdosis;
        }
      });

      const resultado = Object.keys(sumasNumdosis).map(idMedicamento => ({
        idMedicamento: parseInt(idMedicamento),
        numdosis: sumasNumdosis[idMedicamento]
      }));

      console.log(resultado);


      console.log(this.lstMediSAI)

      const miCarritoSinDuplicados = data.lstMedicamentosSAI.reduce((acumulador, valorActual) => {
        const elementoYaExiste = acumulador.find(elemento => elemento.idMedicamento === valorActual.idMedicamento);
        console.log(elementoYaExiste)
        if (elementoYaExiste) {
          return acumulador.map((elemento) => {
            if (elemento.idMedicamento === valorActual.idMedicamento) {
              console.log(elemento, valorActual)
              return {
                ...elemento,

                numDosisTotal: arraySuma
              }
            }
            return elemento;
          });
        }
        return [...acumulador, valorActual];
      }, []);

      for (let i = 0; i < resultado.length; i++) {
        for (let j = 0; j < miCarritoSinDuplicados.length; j++) {
          if (resultado[i].idMedicamento == miCarritoSinDuplicados[j].idMedicamento) {
            miCarritoSinDuplicados[j].numDosisTotal = resultado[i].numdosis
          }
        }
      }


      for (let index = 0; index < miCarritoSinDuplicados.length; index++) {

        let numMed = index + 1;
        miCarritoSinDuplicados[index].num = numMed
        const element = miCarritoSinDuplicados[index];
        if (element.indAsignado == 1) {
          this.medicamentosUpTotal++;

        }


      }

      console.log(miCarritoSinDuplicados);


      this.myData = miCarritoSinDuplicados
      this.tableDS = new MatTableDataSource(this.myData);
      this.collectionSize = this.myData.length
    })

  }

  highlight(row) {
    this.totalEvases = 0
    this.diluyentesDataSource = new MatTableDataSource<any>([]);
    this.lotes = []
    this.lstId = [];
    this.isConsulta = true
    console.log(row)
    this.modelSelected = row;
    this.model = { ...this.modelSelected }

    setTimeout(() => {
      this.$obsModelSelected.next(this.modelSelected);
    }, 500);


    console.log(this.model1.campana, row.idMedicamento)
    this.mezclaService.lotesMedicamento(row.idMedicamento, this.usuario.cemetUsuarios[0].idCentralMezcla.id, this.model1.turno, this.campanaSelected.id, this.campanaSelected.desCampana).then(data => {
      console.log(data)
      if (data.length > 0) {
        this.diluyentesDataSource = new MatTableDataSource(data);

        for (let i = 0; i < data.length; i++) {
          this.totalEvases = this.totalEvases + data[i].numPieza


        }


      } else {
        this.form.enable()
        this.btnAsigna = false
      }



    })


  }

  onAtras() {
    this._router.navigate([this._nav.preparacion]);
  }

  resetForm() {
    this.tableDS = new MatTableDataSource([]);
    this.collectionSize = 0
    this.isConsulta = false
    this.model = { ...{} }
    this.form1.reset(this.model)

  }

  validaFiltros() {
    return this.form1.invalid;
  }

  onAsignar() {
    console.log(this.lotes)
    console.log(this.fechas)
    let fecha
    for (let i = 0; i < this.fechas.length; i++) {
      if (this.fechas[i].idLoteFabMedic == this.model.caducidad) {
        fecha = this.fechas[i].fechaCaducidad
      }

    }

    let model = {
      lote: this.model.lote,
      idLoteFabMedic: this.model.caducidad,
      numPiezas: this.model.piezas,
      fecTemp: fecha
    }

    this.diluyentesDataSource.data.push(model)
    this.nvosLotes.push(model)

    console.log(this.lotes)
    for (let i = 0; i < this.nvosLotes.length; i++) {
      this.nvosLotes[i].idTemp = i + 1
      this.nvosLotes[i].idTurnoCampana = this.model1.campana
      this.nvosLotes[i].idMedicamento = this.modelSelected.idMedicamento

    }
    console.log(this.lotes)

    this.totalEvases = this.totalEvases + Number(model.numPiezas)




    this.diluyentesDataSource = new MatTableDataSource(this.diluyentesDataSource.data);

    this.form.reset()

  }



  guardar() {
    let usuario = this._accountService.getUser();
    let arrayDosis = []

    for (let i = 0; i < this.lstMediSAI.length; i++) {
      if (this.lstMediSAI[i].idMedicamento == this.modelSelected.idMedicamento) {
        this.lstId.push(this.lstMediSAI[i].idMezclaMedicDiluy)
        arrayDosis.push(this.lstMediSAI[i].idMezclaAplicDiaDosi)
      }

    }
    console.log(arrayDosis)
    console.log(this.lotes)
    console.log(this.nvosLotes)

    if (this.nvosLotes.length > 0) {
      for (let i = 0; i < this.nvosLotes.length; i++) {
        this.lotes.push(this.nvosLotes[i])

      }
    }

    
    let modelSave = {
      "lstLotes": this.lotes,
      "lstMedAsignados": this.lstId,
      "lstDiaDosisAsigTC": arrayDosis,
      "cveUsuario": usuario.id,
      "refNomCampana": this.campanaSelected.desCampana,
      "idCentralMezcla": this.usuario.cemetUsuarios[0].idCentralMezcla.id,
      "idTurno": this.model1.turno,
      "idCampana": this.campanaSelected.id

    }

    console.log(modelSave)

    
    this.mezclaService.saveLotes(modelSave).then(data => {
      console.log(data)
      if (data) {
        this.isConsulta = false
        this.tableDS = new MatTableDataSource<any>([]);
        this._alertServices.success('La <strong>información se guardó</strong> correctamente.')
        this.buscaMedicamento(this.model.turno, this.model.campana)
        this.lotes = []
        this.nvosLotes = []

      }
    })


  }

  disabled() {
    if (this.tableDS?.data?.length) {
      for (let index = 0; index < this.tableDS.data.length; index++) {
        if (!this.tableDS.data[index].indAsignado || this.tableDS.data[index].indAsignado != 0) {
          return true
        } else {
          return false
        }

      }

    } else {
      return true
    }

  }

  registrar() {
    let usuario = this._accountService.getUser();

    console.log(this.myData)
    let arrayDosis = []
    for (let i = 0; i < this.lstMediSAI.length; i++) {
      arrayDosis.push(this.lstMediSAI[i].idMezclaAplicDiaDosi)

    }
    console.log(arrayDosis)



    let model = {
      "lstDiaDosisAsigTC": arrayDosis,
      "cveUsuario": usuario.id
    }
    console.log(model)

    this.mezclaService.saveMezclas(model).then(data => {
      if (data) {
        console.log(data)
        this.isConsulta = false
        this.medicamentosUpTotal = 0
        this._alertServices.success('El <strong>lote se asignó al medicamento</strong> con éxito.')
        this.tableDS = new MatTableDataSource<any>([]);


      }
    })

  }


  shortTableDil(sort: Sort) {
    console.log("colName " + sort);

    const array = this.diluyentesDataSource.data;
    let des = sort.direction == 'desc';
    const sortedArray = this.sortArrayOfObjects(array, sort.active, des);
    this.diluyentesDataSource = new MatTableDataSource(sortedArray);
  }

  eliminarDil(element) {

    console.log(this.totalEvases)
    console.log(element)
    let piezas = Number(element.numPieza ? element.numPieza : element.numPiezas)
    this.totalEvases = this.totalEvases - piezas
    console.log(this.totalEvases)


    console.log(element)

    let newData = [...this.diluyentesDataSource.data];
    console.log(newData)
    if (element.idTemp) {
      const index = newData.findIndex((e) => e.idTemp === element.idTemp);
      const index1 = this.nvosLotes.findIndex((e) => e.idTemp === element.idTemp);
      newData.splice(index, 1);
      this.nvosLotes.splice(index1, 1);
    }

    if (element.idCentMedTurCam) {
      const index1 = newData.findIndex((e) => e.idCentMedTurCam === element.idCentMedTurCam);
      newData.splice(index1, 1);
    }

    // const elementDel = newData.find((e) => e.idTemp === element.idTemp);
    console.log(newData)
    console.log("Eliminados Lote", this.diluyentesDataSource);


    this.diluyentesDataSource.data = newData;

    // this.lotes = newData;
    console.log("Eliminados Lote", this.nvosLotes);





    if (element.idCentMedTurCam) {
      let modelElimi = {
        "idCentMedTurCam": element.idCentMedTurCam,
        "indActivo": 0
      }
      this.lotes.push(modelElimi)
    }

    console.log("Eliminados Lote", this.lotes);



  }

}
