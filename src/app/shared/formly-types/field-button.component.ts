import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-button',
  template: `
    <div>
      <ng-container *ngIf="!props.disabled && !form.disabled">
      <button [disabled]="props.disabled" [type]="props.type" [ngClass]="'btn btn-' + props['btnType'] + ' ' + props['classBtn']" [id]="props['idBtn']"  (click)="onClick($event)">
      <i *ngIf="props['icon']" [ngClass]="'bi ' + props['icon']"></i>{{ props['text'] }}
      </button>
      </ng-container>
      <ng-container *ngIf="props.disabled || form.disabled">
      <button [disabled]="props.disabled  || form.disabled" [type]="props.type" [ngClass]="'btn btn-' + props['btnType'] + ' ' +props['classBtn']"  [id]="props['idBtn']" >
      <i *ngIf="props['icon']" [ngClass]="'bi ' + props['icon']"></i>{{ props['text'] }}
      </button>
      </ng-container>
    </div>
  `,
   styles: [
    `
 
    
    `
  ]
})
export class FormlyFieldButton  extends  FieldType{

  onClick($event: Event) {
    if (this.props['onClick']) {
      this.props['onClick']($event);
    }
  }
}
