import { JsonPipe, NgIf } from "@angular/common";
import { Component, Injectable, OnInit } from "@angular/core";
import { ReactiveFormsModule, FormControl } from "@angular/forms";
import { NgbTimeAdapter, NgbTimepickerModule, NgbTimeStruct } from "@ng-bootstrap/ng-bootstrap";
import { FieldType, FieldTypeConfig } from "@ngx-formly/core";



const pad = (i: number): string => (i < 10 ? `0${i}` : `${i}`);

@Injectable()
export class NgbTimeStringAdapter extends NgbTimeAdapter<string> {
	fromModel(value: string | null): NgbTimeStruct | null {
		if (!value) {
			return null;
		}
		const split = value.split(':');
		return {
			hour: parseInt(split[0], 10),
			minute: parseInt(split[1], 10),
			second: parseInt(split[2], 10),
		};
	}

	toModel(time: NgbTimeStruct | null): string | null {
		return time != null ? `${pad(time.hour)}:${pad(time.minute)}:${pad(time.second)}` : null;
	}
}

@Component({
    selector: 'formly-time-field',
    standalone: true,
	imports: [NgbTimepickerModule, ReactiveFormsModule, JsonPipe, NgIf],
    providers: [{ provide: NgbTimeAdapter, useClass: NgbTimeStringAdapter }],
    template:
     `
     <div >
     <ngb-timepicker [disabled]='true'  [class.is-invalid]="ctrl.errors" [required]="props.required"  [formControl]="ctrl"  ></ngb-timepicker>
     <div *ngIf="ctrl.errors" class="invalid-feedback" >
         <div *ngIf="ctrl.errors['required']">Campo obligatorio</div>
     </div>
 </div>
 <pre>Selected time: {{ctrl.value | json}}</pre>

     `,
    styles: [
    `


    `
    ]

})
export class TimeField extends FieldType<FieldTypeConfig> implements OnInit {
    ngOnInit(): void {

        if( this.formControl.value){
            console.log(this.formControl.value)
            this.ctrl.patchValue(this.formControl.value)
        }

        this.ctrl.valueChanges.subscribe(
            value => {
                console.log(value);
                this.formControl.patchValue(value);
            }
        );
    }

    ctrl = new FormControl<NgbTimeStruct | null>(null, (control: FormControl<NgbTimeStruct | null>) => {
		const value = control.value;

		if (!value) {
			return null;
		}

		return null;
	});


    cconstructor(){
       
    }

}