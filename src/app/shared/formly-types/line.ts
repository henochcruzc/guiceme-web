import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
    selector: 'formly-field',
    template: `
<div class="posicion"><div class="line-Blue "></div></div>
   
    
    `,
    styles: [
        `.posicion{
            margin-top:57px;
            margin-left: 6px;
        }
    
        `
    ]
})
export class lineType extends FieldType {


}
