import { CommonModule } from '@angular/common';
import { Inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { timeStamp } from 'console';
import { from } from 'rxjs';
import { GeneralComponent } from 'src/app/modules/general/general.component';
import { NAV } from 'src/app/shared/config/global';
import { MezclaNoAplicadaRequest } from 'src/app/shared/models/mezcla.model';
import { AplicacionMezclaService } from 'src/app/shared/services/aplicacion-mezcla.service';
import { CatalogoService } from 'src/app/shared/services/catalogo.service';
import { SeguimientoService } from 'src/app/shared/services/seguimiento.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-no-aplicada',
  templateUrl: './no-aplicada.component.html',
  styleUrls: ['./no-aplicada.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    SharedModule
  ]
})


export class NoAplicadaComponent extends GeneralComponent implements OnInit {
  idAplicacionMezcla: number;
  model: any = {};
  titulo: string = 'Mezcla no aplicada';
  lstReacciones = [];
  blnBloquearSelect: boolean = true;
  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<NoAplicadaComponent>,
    @Inject(MAT_DIALOG_DATA) data: MezclaNoAplicadaRequest,
    private _seguimientoService: SeguimientoService,
    private _accionService: AplicacionMezclaService,
    private _catalogoService: CatalogoService,

  ) {
    super();
    //this.getLstReacciones();
    console.log("recibe esta info ", data);
    this.model = data;
  }

  form = new FormGroup({});
  fields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [


        {
          className: "col-12",
          key: 'idMotivoNoAdminMezcla',
          type: 'select',
          props: {
            label: 'Motivo',
            required: true,
            placeholder: 'Selecciona un motivo',
            valueProp: 'id',
            labelProp: 'desMotivoNoAdminMezcla',
            options: from(this._catalogoService.getMotivoNoAdminMezcla()),
          },
        },
      ]
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: "col-12",
          key: 'refNoAdminObs',
          type: 'textarea',
          props: {
            rows: 5,
            label: 'Observaciones',
            placeholder: 'Ingresa una observación',
            maxLength: 500,
            required: true
          },

        }
      ]
    }
  ];

  formProceso = new FormGroup({});
  fieldsProceso: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [

        {
          className: "col-md-5 pull-left",
          key: 'idAplicacReaccAdversa' ,
          type: 'mat-radio-left',
          props: {
            label: '¿Reacción adversa a la mezcla?',
            required: true,

            options: [
              { value: 1, label: 'Sí', },
              { value: 2, label: 'No', },
            ],
            valueProp: 'value',
          },
          hooks: {
            onInit: (field) => {
              
              console.log('field', field)

            }
          },
          expressionProperties: {
            'props.options[0].disabled': (model: any) => {
              //console.log('valor model1', model)
              return model.bloquearUno
            },
            'props.options[1].disabled': (model: any) => {
              //console.log('valor model2', model)
              return model.bloquearDos
            }

          }
        },
        {
          className: "col-7",
          key: 'idReaccionAdversa',
          type: 'select',
          props: {
            label: 'Reacciones adversas',
            required: true,
            placeholder: 'Selecciona un motivo',
            valueProp: 'id',
            labelProp: 'desReaccionAdversa',


            options: from(this._catalogoService.getReaccionesAdversas()),

          },
          expressionProperties: {
            'props.disabled': (model: any) => {
              if ((
                this.model.idAplicacReaccAdversa == 2 || this.model.idAplicacReaccAdversa == undefined)
               
            ) {
                return true;
            }
      
            return false;
            },
        },
        },
      ]
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: "col-12",
          key: 'refAplicacReaccionObs',
          type: 'textarea',
          props: {
            rows: 5,
            label: 'Observaciones',
            placeholder: 'Ingresa una observación',
            maxLength: 500,
            required: true
          },

        }
      ]
    }
  ];


  blnBtnAceptarBloqueado: boolean = true;
  ngDoCheck() {
    if (this.model.indEnProceso == 0 || !this.model.indEnProceso) {
      if (this.model.idMotivoNoAdminMezcla != null
        && this.model.refNoAdminObs) {
        this.blnBtnAceptarBloqueado = false;
      } else {
        this.blnBtnAceptarBloqueado = true;
      }
    }

    if (this.model.indEnProceso == 1) {

      if (this.model.idAplicacReaccAdversa == 1) {
        this.blnBloquearSelect = false;


        if (this.model.idReaccionAdversa != null
          && this.model.idAplicacReaccAdversa
          && this.model.refAplicacReaccionObs
        ) {
          this.blnBtnAceptarBloqueado = false;
        } else {
          this.blnBtnAceptarBloqueado = true;
        }



      } else {
        this.blnBloquearSelect = true;


        if (this.model.refAplicacReaccionObs
        ) {
          this.blnBtnAceptarBloqueado = false;
        } else {
          this.blnBtnAceptarBloqueado = true;
        }
      }


    }



  }

  ngOnInit() {
    
    console.log("init: ", this.model)
    if (this.model.indEnProceso == 1) {
      this.model.idAplicacReaccAdversa;
      this.titulo = 'Aplicación suspendida';
    }
    if (this.model.indEnProceso == 0) {
      this.titulo = 'Mezcla no aplicada';
    }
  }


  public btnAceptar() {
    let dato: MezclaNoAplicadaRequest = new MezclaNoAplicadaRequest();
    dato.idAplicacionMezcla = this.model.idAplicacionMezcla;
    dato.cveUsuarioAlta = this.model.cveUsuarioAlta;
    dato.idUsuarioResponsable = this.model.idUsuarioResponsable;
    if (this.model.indEnProceso == 1) {

    
      dato.idAplicacReaccAdversa = this.model.idAplicacReaccAdversa;
    
      dato.refAplicacReaccionObs = this.model.refAplicacReaccionObs;
      if(dato.idAplicacReaccAdversa == 1){
        dato.idReaccionAdversa = this.model.idReaccionAdversa;
      }
    } else {
      

      dato.idMotivoNoAdminMezcla = this.model.idMotivoNoAdminMezcla;
      dato.refNoAdminObs = this.model.refNoAdminObs;
      dato.idMezclaAplicDiaDosis = this.model.idMezclaAplicDiaDosis;
      dato.idPaciente = this.model.idPaciente;
      
      
      if (!this.model.stpAplicacInicio
        && !this.model.stpAplicacTermino
      ) {
        delete this.model['stpAplicacInicio'];
        delete this.model['stpAplicacTermino'];
        delete this.model['stpAplicacInicio'];
        delete this.model['indEnProceso'];
      }
    }
    console.log("guardar no aplica ",dato);
    this.noAplicar(dato);
  }


  private noAplicar(model: any) {


    console.log("datos", model);
    this._accionService.noAplicar(model).then(
      resp => {
        console.log("_accionService.noAplic ", resp);
        this.closeDialog();
        this.irPrincipal();
      
        setTimeout(() => {
          if (this.model.indEnProceso == 1) {
            this._alertServices.success(this._Mensajes.MSG43);
          }else{
            this._alertServices.success(this._Mensajes.MSG44);
          }
          
      
        }, 1000);



      }
    );
  }




  public closeDialog() {
    this.dialogRef.close(false);
  }

  private irPrincipal() {
    this.router.navigateByUrl(NAV.aplicacionMezcla);
  }
}
