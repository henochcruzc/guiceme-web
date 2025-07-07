import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { TituloComponent } from "src/app/shared/layout/frames/titulo/titulo.component";
import { SharedModule } from "src/app/shared/shared.module";
import { DetalleMezclaComponent } from "../detalle-mezcla/detalle-mezcla.component";


@Component({
  selector: 'app-datos-paciente', 
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    TituloComponent,
    DetalleMezclaComponent,
  ],
  templateUrl: './datos-paciente.component.html',
  styleUrls: ['./datos-paciente.component.scss']
})
export class DatosPacienteComponent {

  @Input() nomPaciente: string;
  @Input() diagnostico: string;
  @Input() edad: string;
  @Input() sexo: string;
  @Input() nss: string;
  @Input() aMedico: string;
  @Input() adscripcion: string;
  @Input() curp: string;

  ngOnInit(): void {
    //this.nomPaciente = (this.nomPaciente == null || this.nomPaciente == undefined) ? '' : this.nomPaciente
  }
}
