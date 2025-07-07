import { Injectable, Type, inject } from '@angular/core';
import { SolicitudComponent } from '../../mezclas/solicitud/solicitud.component';
import { NoDataComponent } from 'src/app/shared/layout/no-data/no-data.component';
import { NAV } from 'src/app/shared/config/global';
import { SeguimientoComponent } from '../../mezclas/seguimiento/seguimiento.component';
import { PrescripcionComponent } from '../../mezclas/prescripcion/prescripcion.component';
import { AnalistaCalidadComponent } from '../../mezclas/analista-calidad/analista-calidad.component';
import { RegistroMedicamentoComponent } from '../../mezclas/registro-medicamento/registro-medicamento.component';
import { AsignacionTurnoComponent } from '../../mezclas/asignacion/asignacion-turno/asignacion-turno.component';
import { AsignacionMedicamentosComponent } from '../../mezclas/asignacion/asignacion-medicamentos/asignacion-medicamentos.component';
import { MezclasNoAprobadasComponent } from '../../mezclas/mezclas-no-aprobadas/mezclas-no-aprobadas.component';
import { SeguimientoGeneralComponent } from '../../mezclas/seguimiento-general/seguimiento-general.component';
import { AplicacionComponent } from '../../mezclas/aplicacion/aplicacion.component';
import { AcondicionamientoComponent } from '../../mezclas/acondicionamiento/acondicionamiento.component';
import { OrdenDistribucionComponent } from '../../mezclas/orden-distribucion/orden-distribucion.component';
import { ReimpresionEtiquetasComponent } from '../../mezclas/reimpresion-etiquetas/reimpresion-etiquetas.component';
import { RecepcionUnidadMedicaComponent } from '../../mezclas/recepcion-unidad-medica/recepcion-unidad-medica.component';
import { PreparacionMezclaComponent } from '../../mezclas/preparacion-mezcla/preparacion-mezcla.component';
import { EditaFichaTecnicaComponent } from '../../mezclas/edita-ficha-tecnica/edita-ficha-tecnica.component';


@Injectable({ providedIn: 'root' })
export class AdComponentService {
    getComponents() {
        return [
            {
                orden:1,
                id:1,
                url:NAV.solicitud,
                component: SolicitudComponent,
                //inputs: { name: 'Dr. IQ', bio: 'Smart as they come' },
            },            
            {
                orden:2,
                id:2,
                url:NAV.solicitud,//CU02
                component: SolicitudComponent,
                //inputs: { name: 'Dr. IQ', bio: 'Smart as they come' },
            },            
            {
                orden:3,
                id:4,
                url:NAV.seguimiento,//CU04
                component: SeguimientoComponent
                //inputs: { name: 'Dr. IQ', bio: 'Smart as they come' },
            },            
            {
                orden:4,
                id:5,
                url:NAV.prescripcion,//CU05
                component: PrescripcionComponent
                //inputs: { name: 'Dr. IQ', bio: 'Smart as they come' },
            },            
            {
                orden:5,
                id:14,
                url:NAV.analistaCalidad,//CU09
                component: AnalistaCalidadComponent
                //inputs: { name: 'Dr. IQ', bio: 'Smart as they come' },
            },
            {
                orden:6,
                id:6,
                url:NAV.registroMedicamento,//CU09
                component: RegistroMedicamentoComponent
                //inputs: { name: 'Dr. IQ', bio: 'Smart as they come' },
            },
            {
                orden:7,
                id:7,
                url:NAV.asignacionTurno,//CU06
                component: AsignacionTurnoComponent
                //inputs: { name: 'Dr. IQ', bio: 'Smart as they come' },
            },
            {
                orden:8,
                id:8,
                url:NAV.asignacionMedicamentos,//CU06
                component: AsignacionMedicamentosComponent
                //inputs: { name: 'Dr. IQ', bio: 'Smart as they come' },
            },
            {
                orden:9,
                id:18,
                url:NAV.seguimientoGeneral,//CU12
                component: SeguimientoGeneralComponent
                //inputs: { name: 'Dr. IQ', bio: 'Smart as they come' },
            },
            {
               // orden:9,
                //id:9,
                //url:NAV.mezclasNoAprobadas,//CU09
                //component: MezclasNoAprobadasComponent
                //inputs: { name: 'Dr. IQ', bio: 'Smart as they come' },
            },
            {
                 orden:10,
                 id:19,
                 url:NAV.aplicacionMezcla,//CU13
                 component: AplicacionComponent, 
                 //inputs: { name: 'Dr. IQ', bio: 'Smart as they come' },
             },
             {
                orden:11,
                id:12,
                url:NAV.acondicionamiento,//CU13
                component: AcondicionamientoComponent, 
                //inputs: { name: 'Dr. IQ', bio: 'Smart as they come' },
            },
            {
                orden:12,
                id:13,
                url:NAV.ordenDistribucion,//CU13
                component: OrdenDistribucionComponent, 
                //inputs: { name: 'Dr. IQ', bio: 'Smart as they come' },
            },
            {
                orden:13,
                id:15,
                url:NAV.reimpresionEtiquetas,//CU10
                component: ReimpresionEtiquetasComponent, 
                //inputs: { name: 'Dr. IQ', bio: 'Smart as they come' },
            },            
            {
                orden:14,
                id:17,
                url:NAV.recepcionUM,//CU10
                component: RecepcionUnidadMedicaComponent, 
                //inputs: { name: 'Dr. IQ', bio: 'Smart as they come' },
            },            
            {
                orden:14,
                id:9,
                url:NAV.preparacion,//CU10
                component: PreparacionMezclaComponent, 
                //inputs: { name: 'Dr. IQ', bio: 'Smart as they come' },
            },
            {
                orden:15,
                id:16,
                url:NAV.editaFichaTecnica,//CU14
                component: EditaFichaTecnicaComponent, 
                //inputs: { name: 'Dr. IQ', bio: 'Smart as they come' },
            },


        ] as {orden:number, id:number, url:string,component: Type<any>, inputs: Record<string, unknown> }[];
    }
}
