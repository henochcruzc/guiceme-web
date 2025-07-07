import { CommonModule, formatDate } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { GeneralComponent } from 'src/app/modules/general/general.component';
import { TituloComponent } from 'src/app/shared/layout/frames/titulo/titulo.component';
import { CatalogoService } from 'src/app/shared/services/catalogo.service';
import { MezclasService } from 'src/app/shared/services/mezclas.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-asignacion-lote',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    TituloComponent,
  ],
  templateUrl: './asignacion-lote.component.html',
  styleUrls: ['./asignacion-lote.component.scss']
})
export class AsignacionLoteComponent extends GeneralComponent implements OnInit, AfterViewInit {

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
  indGuardadoCompleto: any;

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
    'fechas',
    'piezas',
    'eliminar'
  ];
  medicamentosTotal: number = 0;
  totalEvases: number = 0;

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
    console.log("ind guardado", this.indGuardadoCompleto);



    this.usuario = this._accountService.getUser();
    if (this.idReceta != null)
      this.getDetalleList(this.idMedicamento, this.idReceta);

  }
  ngAfterViewInit(): void {
    if (this.indGuardadoCompleto) {
      this.formReceta.controls['fabricante'].disable();
      this.formReceta.controls['marca'].disable();
      this.formReceta.controls['numEnvases'].disable();
      this.formReceta.controls['lote'].disable();
      this.formReceta.controls['fechaApl'].disable();
      this.formReceta.controls['conDiluyente'].disable();
      this.formReceta.controls['caducidadDiluyente'].disable();


    }
  }
  getDetalleList(idMedicamento, idReceta) {

    this.mezclasService.getRecetaColectivaLotes(idMedicamento, idReceta)
      .then(data => {


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

          //  recons.value= data.fichaTecnicaDetalles.idConservacionMed;






        }
        if (data != null && data.lstDiluyentes != null && data.lstDiluyentes.length > 0) {

          this.diluyentesDataSource = new MatTableDataSource<any>(data.lstDiluyentes);


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

      'envase': this.modelReceta.numEnvases,
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
    this.nvosLotes.push(newRow2);
    this.antibioticosDataSource.data = newData;
    this.totalEvases = this.totalEvases + Number(this.modelReceta.numEnvases);

    console.log("datasource data", this.antibioticosDataSource.data);
    console.log("nuevos lotes data", this.nvosLotes);


  }
  eliminarLote(element) {
    //pendiente implementar el borrado

    let newData = [...this.antibioticosDataSource.data];
    const index = newData.findIndex((e) => e.idLoteFabMedic === element.idLoteFabMedic);
    const elementDel = newData.find((e) => e.idLoteFabMedic === element.idLoteFabMedic);

    let e = {
      idLoteFabMedic: elementDel.idLoteFabMedic
    };
    this.lsEliminadosLote.push(e);

    newData.splice(index, 1);
    this.antibioticosDataSource.data = newData;
    this.totalEvases = this.totalEvases - Number(elementDel.envase);
    console.log("Eliminados Lote", this.lsEliminadosLote);



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
  shortTable(sort: Sort) {
    console.log("colName " + sort);

    const array = this.antibioticosDataSource.data;
    let des = sort.direction == 'desc';
    const sortedArray = this.sortArrayOfObjects(array, sort.active, des);
    //let otherModel = {...this.modelo};
    // otherModel.content = sortedArray;
    // console.log(otherModel)
    this.antibioticosDataSource = new MatTableDataSource(sortedArray);
  }


  modelReceta: any = {};
  formReceta = new FormGroup({});
  fieldsReceta: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: "col-lg-3 col-md-6",
          key: 'lote',
          type: 'select',
          props: {
            label: 'Lote',
            required: true,
            placeholder: 'Captura lote',
            options: this.catalogService.getLote(100)
          }

        },
        {
          className: "col-lg-3 col-md-6",
          key: 'fechaApl',
          type: 'material-date',
          templateOptions: {
            label: 'Fecha(s) de caducidad*',
            range: false,
            placeholder: 'Seleccionar fecha y hora',
            required: true
          },

        },
        {
          className: "col-lg-3 col-md-6",
          key: 'piezas',
          type: 'input',
          templateOptions: {
            label: 'Piezas',
            range: false,
            placeholder: 'Capturar n° piezas',
            required: true
          },

        },
        {
          className: 'col-lg-3 col-md-6',
          //key:'rfc',
          type: 'button',
          props: {
            label: ' ',
            text: 'Agregar',
            onClick: (to, $event) => {
              //this.tipoMezclaDataSource= new MatTableDataSource<any>(MockData.mockTipoMezcla);
              //this.buscarMezclas();
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

          }

        },
      ]
    }
  ]


}
