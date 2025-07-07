import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormlyModule,
    MatDialogModule,
    MatCheckboxModule
 
  ],
  templateUrl: './dialog-formly.component.html',
  styleUrls: ['./dialog-formly.component.scss'],
})
export class DialogFormlyComponent {
  atribuible:boolean=false; 

  constructor(
    private dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    this.fields = this.data.fields;
   
    
    if (this.data.model) {
      this.model = JSON.parse(JSON.stringify( this.data.model));
    }
  }

  ngAfterViewInit() {
    this.form.reset();
  }

  model: any = {};
  form = new FormGroup({});
  fields: FormlyFieldConfig[];


  closeDialog() {
    this.dialogRef.close(undefined);
  }

  confirmDialog() {

    if (this.data.model && this.form.valid) {

      this.model = {
        ...this.model,

        dataTransfer: this.data.model
      }
      this.dialogRef.close(this.model);
    
    
    }else if(this.form.valid){

       if (this.data.customTitle!=null){
         console.log("this.model",this.model);
         console.log("atribuible",  this.atribuible);
        let customData2 = {
         motivo: this.model.motivo,
         observaciones:this.model.observaciones,  
           atribuible:this.atribuible
         }
         this.dialogRef.close(customData2);
       }  else if (this.data.customFooter!=null){
         console.log("this.model",this.model);
         let customData=null;
         if(this.data.customFooter=="AntCito"){
          let idRec=new Array();
           if( this.model.recomendaciones==null)
           idRec.push(this.model.mat_radio);
           else{
            idRec.push(this.model.mat_radio);
           for (let index = 0; index < this.model.recomendaciones.length; index++) {
             const element = this.model.recomendaciones[index];
             if(element.id!=undefined)
             idRec.push(element.id);

           }
          }
           customData = {
                  recomendaciones:idRec,  
             
            }

         }else if(this.data.customFooter=="NTP"){
          let idRec=new Array();
          idRec.push(18);//se agrega mantener refrigeracion por defaut
          if(this.model.recomendaciones!=null){
          for (let index = 0; index < this.model.recomendaciones.length; index++) {
            const element = this.model.recomendaciones[index];
            if(element.id!=undefined)
            idRec.push(element.id);

          }
        }
          customData = {
                 recomendaciones:idRec,  
            
           }
         }
        
          this.dialogRef.close(customData);
      }
       else{
        this.dialogRef.close(this.model);
       }
      
      
    }



  }
  checkAtribuible(event){
    console.log("event",event);
    if(event) this.atribuible=true;
    else this.atribuible=false;

  }

 
}
