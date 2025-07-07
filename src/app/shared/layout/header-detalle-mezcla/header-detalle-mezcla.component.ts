import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { GeneralComponent } from 'src/app/modules/general/general.component';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';
import { debounceTime, throttleTime } from 'rxjs';

@Component({
    selector: 'app-header-detalle-mezcla',
    standalone: true,
    imports: [
        CommonModule,
        SharedModule
    ],
    templateUrl: './header-detalle-mezcla.component.html',
    styleUrls: ['./header-detalle-mezcla.component.scss'],
})
export class HeaderDetalleMezclaComponent extends GeneralComponent {

    @Input() headerData: any;

    constructor() {
        super();
        // register on window resize event
        fromEvent(window, "resize")
            .pipe(throttleTime(500), debounceTime(500))
            .subscribe(() => this.calcHeightD());
    }

    onAtras() {
        this._router.navigate([this.headerData.navAtras]);
    }

    @ViewChild('idDiagnostico')
    myIdentifier: ElementRef;

    heightD = 0;

    ngAfterViewInit() {
        this.calcHeightD();
    }

    calcHeightD() {       
        this.heightD = this.myIdentifier.nativeElement.offsetHeight;        
    }
}