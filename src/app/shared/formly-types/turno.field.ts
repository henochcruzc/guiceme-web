import { Component, OnInit } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
    selector: 'formly-field',
    template: `
<div class="espacio">
    
    <div class="texto {{getColor()}} borde" >{{getData()}}</div> 
  <!--   <div class="texto azul borde" >{{getData()}}</div>  -->
<!-- <div class="texto azul borde" >{{getData()}}</div>
<div class="texto verde borde" >{{getData()}}</div>    
    <div class="texto rojo borde" >{{getData()}}</div> -->
     <!-- [ngClass]="{'azul': turno == 'Matutino','verde':turno == 'Vespertirno', 'rojo':turno == 'Nocturno'"> -->
    
</div>
    
`,
    styles: [
        `
        .espacio{
            width: 150px !important;
        }

        .borde{
            padding:8px;
            border: solid 2px #F5F6F7;
            border-radius: 5px;
            text-align: center;
            max-width: 103px;
        }
            .texto{
        font-feature-settings: 'clig' off, 'liga' off;
        font-family: Montserrat;
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: 120%; 

    }

    .color{
        color: #1DD3EC;
    }

    .rojo{
  color:red;
}

.azul{
  color: #1DD3EC;
}

.verde{
  color:#00D494;
}
    
        `
    ]
})


export class turnoFieldText extends FieldType<FieldTypeConfig> implements OnInit {
    turno = '';

    ngOnInit(): void {
        if (this.formControl.value) {
            console.log(this.formControl.value)
            this.turno = this.formControl.value;

        }
    }

    getData() {
        this.turno = this.formControl.value;


        return this.turno;



    }

    getColor() {
        switch (this.turno.toLowerCase()) {
            case 'vespertino':
                return 'verde'
            case 'matutino':
                return 'azul'
            case 'nocturno':
                return 'rojo'

            default:
                return 'azul';
        }



    }
}
