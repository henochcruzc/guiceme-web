import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
    selector: 'formly-text',
    template: `
    <div class="componente">
        <label class="label-form">
        {{to.label}} 
    </label>
    <div class="pa" ><p *ngIf="to['link']">&nbsp;<a [href]="to['link']" target="_blank">Ingresa aquí</a></p></div></div>
 `,
    styles: [
        `
        .componente{
            
  position:relative;
	        width: 100%; 
        }
    .label-form {
    
    padding: 15px 0 15px 0;
    
    }

    .a{    }
    .componente .label-form{
        display:inline-block;
    }

    .componente .pa{
        display:inline-block;
    }
    `
    ]

})
export class TextField extends FieldType { }