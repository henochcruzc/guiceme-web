import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    selector: 'app-titulo',
    standalone: true,
    imports: [
        CommonModule,
    ],
    templateUrl: './titulo.component.html',
    styleUrls: ['./titulo.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TituloComponent {
    @Input() titulo: string;
    @Input() subTituloTxt: string;
    @Input() callbackFunctionRegresar: () => void;

    @Input() btnBack: boolean = false;

    @Input() subTitulo: boolean = false;

    onRegresar(){
        
        this.callbackFunctionRegresar();
        
    }
 }
