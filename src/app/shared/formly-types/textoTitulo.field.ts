import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
    selector: 'formly-textoTitulo',
    template: `
    <div *ngIf="props['tituloSize']==null" class="componente">
        <label class="label-form">
        {{to.label}} 
    </label>

    </div>
    <div *ngIf="props['tituloSize']!=null" class="componente2">
        <label class="label-form">
        {{to.label}} 
    </label>

    </div>
 `,
    styles: [
    `
        .componente{
            position:relative;
            width: 100%; 
            font-size: 20px !important;
            font-weight: 700 !important;
            
        }
        .componente2{
            position:relative;
            width: 100%; 
            font-size: 12px !important;
            font-weight: 700 !important;
            
        }
        .label-form {
            padding: 15px 0 15px 0;
        }

    `
    ]

})
export class TextoTitulo extends FieldType { }