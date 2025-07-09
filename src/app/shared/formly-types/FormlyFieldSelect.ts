import { Component, ChangeDetectionStrategy, ViewChild, NgZone, Type, ViewContainerRef } from '@angular/core';
import { SelectControlValueAccessor } from '@angular/forms';
import { FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { FieldType, FormlyFieldProps } from '@ngx-formly/bootstrap/form-field';
import { take } from 'rxjs/operators';
import { FormlyFieldSelectProps } from '@ngx-formly/core/select';

interface SelectProps extends FormlyFieldProps, FormlyFieldSelectProps {
  multiple?: boolean;
  compareWith?: (o1: any, o2: any) => boolean;
}

export interface FormlySelectFieldConfig extends FormlyFieldConfig<SelectProps> {
  type: 'select' | Type<FormlyFieldSelect>;
}

@Component({
  selector: 'formly-field-select',
  template: `
    <ng-template #fieldTypeTemplate>
      <select 
        *ngIf="props.multiple; else singleSelect"
        class="form-control"
        multiple
        [formControl]="formControl"
        [compareWith]="props.compareWith"
        [class.is-invalid]="showError"
        [formlyAttributes]="field"
      >
        <ng-container *ngIf="props.options | formlySelectOptions : field | async as opts">
          <ng-container *ngFor="let opt of opts">
            <option *ngIf="!opt.group; else optgroup" [ngValue]="opt.value" [disabled]="opt.disabled">
              {{ strLargo(opt.label) }}
            </option>
            <ng-template #optgroup>
              <optgroup [label]="opt.label">
                <option *ngFor="let child of opt.group" [ngValue]="child.value" [disabled]="child.disabled">
                  {{ strLargo(opt.label) }}
                </option>
              </optgroup>
            </ng-template>
          </ng-container>
        </ng-container>
      </select>

      <ng-template #singleSelect>
      
      
        <select
          class="form-control"
          [formControl]="formControl"
          [compareWith]="props.compareWith"
          [class.is-invalid]="showError"
          [formlyAttributes]="field"
          
        >
        
          <option *ngIf="props.placeholder" [ngValue]="undefined">{{ props.placeholder }}</option>
          <ng-container *ngIf="props.options | formlySelectOptions : field | async as opts">
            <ng-container *ngFor="let opt of opts">
              <option class="" *ngIf="!opt.group; else optgroup" [ngValue]="opt.value" [disabled]="opt.disabled">
                {{ strLargo(opt.label) }}
              </option>
              <ng-template #optgroup>
                <optgroup [label]="opt.label">
                  <option style="width: fit-content;" *ngFor="let child of opt.group" [ngValue]="child.value" [disabled]="child.disabled">
                    {{ strLargo(opt.label) }}
                  </option>
                </optgroup>
              </ng-template>
            </ng-container>
          </ng-container>
        </select>
        
    
      </ng-template>
    </ng-template>
    `,

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldSelect extends FieldType<FieldTypeConfig<SelectProps>> {
  override defaultOptions = {
    props: {
      compareWith(o1: any, o2: any) {
        return o1 === o2;
      },
    },
  };


  widthTotal = 0;

  ngOnInit() {
    setTimeout(() => {
      let select = document.getElementById(this.id) as HTMLSelectElement;
      // console.log('select %%%%%%%%%%%%%%%%%%%%%%', this.id);
      // console.log('*******************', select.getBoundingClientRect());
      this.widthTotal = select.getBoundingClientRect().width;
    }, 200);
  }

  strLargo(opt: string) {

    const canvas = document.createElement('canvas');
    const contexto = canvas.getContext('2d');
    contexto.font = '14px Arial';
    const medida = contexto.measureText(opt);
    // return medida.width;
    // console.log(medida.width)
    // console.log(this.widthTotal)

    if (medida.width >= this.widthTotal) {
      var optionText = opt;
      var newOption = optionText.substring(0, 36);
      return newOption + '...';
    }
    return opt;


    // return opt;

  }
  // workaround for https://github.com/angular/angular/issues/10010
  /**
   * TODO: Check if this is still needed
   */
  @ViewChild(SelectControlValueAccessor) set selectAccessor(s: any) {
    if (!s) {
      return;
    }

    const writeValue = s.writeValue.bind(s);
    if (s._getOptionId(s.value) === null) {
      writeValue(s.value);
    }

    s.writeValue = (value: any) => {
      const id = s._idCounter;
      writeValue(value);
      if (value === null) {
        this.ngZone.onStable
          .asObservable()
          .pipe(take(1))
          .subscribe(() => {
            if (
              id !== s._idCounter &&
              s._getOptionId(value) === null &&
              s._elementRef.nativeElement.selectedIndex !== -1
            ) {
              writeValue(value);
            }
          });
      }
    };
  }

  constructor(private ngZone: NgZone, hostContainerRef: ViewContainerRef) {
    super(hostContainerRef);
  }


  getTooltipDescripcion(valor: number) {
    return 'metodo';
  }
}