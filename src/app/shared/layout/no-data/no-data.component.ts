import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-no-data',
    standalone: true,
    imports: [
        CommonModule,
    ],
    templateUrl: './no-data.component.html',
    styleUrls: ['./no-data.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoDataComponent { }
