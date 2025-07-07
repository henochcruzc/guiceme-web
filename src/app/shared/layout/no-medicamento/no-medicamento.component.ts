import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    selector: 'app-no-medicamento',
    standalone: true,
    imports: [
        CommonModule,
    ],
    templateUrl: './no-medicamento.component.html',
    styleUrls: ['./no-medicamento.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoMedicamentoComponent { 

    @Input() class: string = 'no-med';
}
