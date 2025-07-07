import { ChangeDetectorRef, Component, ViewEncapsulation } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';
import { BehaviorSubject } from 'rxjs';
import { AlertService } from '../alert';
import { CatalogoService } from '../services/catalogo.service';

@Component({
  selector: 'formly-field',
  template: `
    <ng-select
      [items]="items$ | async"
      [multiple]="props['multiple']"
      [bindLabel]="labelProp"
      [bindValue]="valueProp"
      [placeholder]="to.placeholder"
      (change)="onChange($event)"
      [formlyAttributes]="field"
      [class.is-invalid]="showError"
      [appendTo]="'body'"
    >
<!--
    <ng-template *ngIf="selectedItems$.value.length > 0" ng-label-tmp let-item="item" let-item$="selectedItems$" let-index="index">
        <span class="options-selected">
          {{item[labelProp]}} {{index}}
        </span>
        <button type="button" (click)="removeSelectedItem(item)">Remove</button>
      </ng-template>-->

      <ng-template *ngIf="selectedItems$.value.length > 0">
        <div *ngFor="let selectedItem of selectedItems$.value">
         <span class="options-selected">{{ selectedItem[labelProp] }}</span>
         <button type="button" (click)="removeSelectedItem(selectedItem)">Remove</button>
        </div>
 
       
      </ng-template>

      <ng-template ng-option-tmp let-item="item" let-item$="item$" let-index="index">
        <div class="checkbox-label">
          <mat-checkbox
            class="checkboxFormulario"
            [disabled]="item.disabled"
            [checked]="item$.selected"
            [class.mat-mdc-checkbox-disabled]="true"
            [ngClass]="{ 'disabled-option': item.disabled }"
          ></mat-checkbox>
          <span>{{item[labelProp]}}</span>
        </div>
      </ng-template>
    </ng-select>
    
<!--
    <div *ngIf="selectedItems$.value.length > 0" class="selected-items-container">
      <div *ngFor="let selectedItem of selectedItems$.value" class="selected-item">
        <span>{{ selectedItem[labelProp] }}</span>
        <button type="button" (click)="removeSelectedItem(selectedItem)">Remove</button>
      </div>
    </div>-->
  `,
  styleUrls: ['./multi-select.field.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MultiselectField extends FieldType<FieldTypeConfig> {
  selectedItems$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  totalSelecionados: number = 0;
  items$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  selectedCount: any = 0;

  constructor(private cd: ChangeDetectorRef, private catalogService: CatalogoService, private alertService: AlertService) {
    super();
  }

  ngOnInit() {
 
    console.log("tipoMezcla", this.props['tipoMezcla']);
    let tipoMezcla = this.props['tipoMezcla'];
    this.catalogService.getRecomendacionEtiquetaV2().subscribe(
      (data: any) => {
        if (data) {

        let arrayInfo=new Array();
          for (let index = 0; index < data.length; index++) {
            const element = data[index];
            let newRow= {
              id: element.id,
              desRecomEtiquetaMezcla: element.desRecomEtiquetaMezcla,
              disabled: false,
            }
            if(tipoMezcla=="AntCito" && element.id!=17  &&  element.id!=18)
            arrayInfo.push(newRow);
            else if(tipoMezcla=="NTP" &&  element.id!=18)
            arrayInfo.push(newRow);
            
          }

          this.items$.next(arrayInfo);
        } else {
          this.alertService.error("<strong>Error</strong> al obtener conceptos de Recomendaciones");
        }
      },
      (_err) => {
        this.alertService.error("<strong>Error</strong> al obtener conceptos de Recomendaciones");
      }
    );
    this.formControl.setErrors(null);

    this.formControl.valueChanges.subscribe($event => {
      if (($event instanceof Array && $event.length == 0) || $event == null) {
        this.formControl.markAsTouched({ onlySelf: true });
        this.model[this.props['target']] = undefined;
        //this.formControl.setErrors({ 'required': true });
        this.formControl.setErrors(null);
      }
    });
  }

  get labelProp(): string {
    return this.props['labelProp'] || 'label';
  }

  get valueProp(): string {
    return this.props['valueProp'] || 'value';
  }

  onChange($event) {
    if (($event instanceof Array && $event.length == 0) || $event == null) {
      this.model[this.props['target']] = undefined;
      this.selectedCount = 0;
      this.selectedItems$.next([]);
      this.updateItemsDisabledState(this.selectedCount);
     // this.formControl.setErrors({ 'required': true });
      this.formControl.setErrors(null);
    } else {
      this.selectedCount = $event.length;
      this.model[this.props['target']] = $event;
      this.selectedItems$.next($event);

      this.updateItemsDisabledState(this.selectedCount);
     if( this.selectedCount<3)
     this.formControl.setErrors(null);//setErrors({ 'required': true });
     else if(this.selectedCount==3)
      this.formControl.setErrors(null);
    }
  }

  updateItemsDisabledState(selectedCount: number) {
    let items = this.items$.getValue();
    if (selectedCount >= 3) {
      items = items.map(item => ({
        ...item,
        disabled: !this.isItemSelected(item),
      }));
    } else {
      items = items.map(item => ({
        ...item,
        disabled: false,
      }));
    }
    this.items$.next(items);
    this.cd.detectChanges();
  }

  isItemSelected(item): boolean {
    return this.model[this.props['target']]?.some((selectedItem: any) => selectedItem.id === item.id);
  }

  removeSelectedItem(itemToRemove: any) {
debugger
   // const updatedSelectedItems = this.selectedItems$.value.filter(item => item.id !== itemToRemove.id);
    let  data= this.selectedItems$.value;
    const indiceAEliminar =  data.findIndex(item => item.id === itemToRemove.id);
    if (indiceAEliminar !== -1) {
      data.splice(indiceAEliminar, 1);
    }
    

    this.selectedItems$.next(data);
    this.model[this.props['target']] = data;
    this.selectedCount = data.length;
    this.updateItemsDisabledState(this.selectedCount);
    this.formControl.setValue(data , { emitEvent: false });  // Esto actualiza el estado del multiselect sin disparar el evento de cambio
    this.cd.detectChanges();  // Forzar la detección de cambios
  }
}
