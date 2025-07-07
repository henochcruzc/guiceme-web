import { PrincipalLayoutComponent } from '../layout/principal-layout/principal-layout.component';
import { NAV } from './global';
import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: NAV.login,
    loadChildren: () =>
      import('../../modules/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: NAV.home,
    component: PrincipalLayoutComponent,
    //canMatch: [() => canMatch([])],
    children: [
      {
        path: '',
        loadComponent: () => import('../../modules/home/components/main/main.component').then((m) => m.MainComponent),
        outlet: 'contentido',
      },
    ],
  },
  {
    path: NAV.test,
    component: PrincipalLayoutComponent,
    //canMatch: [() => canMatch(['MANAGER'])],
    children: [
      {
        path: '',
        loadComponent: () => import('../../modules/mezclas/test/test.component').then((mod) => mod.TestComponent),
        outlet: 'contentido',
      },
    ],
  },
  {
    path: NAV.solicitud,
    component: PrincipalLayoutComponent,
    //canMatch: [() => canMatch(['Médico'])],
    children: [
      {
        path: '',
        
        loadComponent: () => import('../../modules/mezclas/solicitud/solicitud.component').then((mod) => mod.SolicitudComponent),
        outlet: 'contentido',
      },
    ],
  },
  {
    path: NAV.prescripcion,
    component: PrincipalLayoutComponent,
    //canMatch: [() => canMatch(['Médico'])],
    children: [     
      {
        path: '',        
       loadComponent: () => import('../../modules/mezclas/prescripcion/prescripcion.component').then((mod) => mod.PrescripcionComponent),
       outlet: 'contentido',
      },
    ],
  },
  {
    path: NAV.prescripcionDetalle,
    component: PrincipalLayoutComponent,
    //canMatch: [() => canMatch(['Médico'])],
    children: [     
      {
        path: '',        
        loadComponent: () => import('../../modules/mezclas/prescripcion/detalle/detalle.component').then((mod) => mod.DetalleComponent),
        outlet: 'contentido',
      },
    ],
  },
  {
    path: NAV.prescripcionDetalleNTP,
    component: PrincipalLayoutComponent,
    //canMatch: [() => canMatch(['Médico'])],
    children: [     
      {
        path: '',        
        loadComponent: () => import('../../modules/mezclas/prescripcion/detalle-pre-mezcla-ntp/detalle-pre-mezcla-ntp.component').then((mod) => mod.DetallePreMezclaNTPComponent),
        outlet: 'contentido',
      },
    ],
  },
  {
    path: NAV.seguimiento,
    component: PrincipalLayoutComponent,
    //canMatch: [() => canMatch(['Médico'])],
    children: [     
      {
        path: '',        
        loadComponent: () => import('../../modules/mezclas/seguimiento/seguimiento.component').then((mod) => mod.SeguimientoComponent),
        outlet: 'contentido',
      },
    ],
  },
  {
    path: NAV.modificacion,
    component: PrincipalLayoutComponent,
    //canMatch: [() => canMatch(['Médico'])],
    children: [     
      {
        path: '',        
        loadComponent: () => import('../../modules/mezclas/seguimiento/modificar-mezcla/modificar-mezcla.component').then((mod) => mod.ModificarMezclaComponent),
        outlet: 'contentido',
      },
    ],
  },
  {
    path: NAV.analistaCalidad,
    component: PrincipalLayoutComponent,
    //canMatch: [() => canMatch(['Médico'])],
    children: [     
      {
        path: '',        
        loadComponent: () => import('../../modules/mezclas/analista-calidad/analista-calidad.component').then((mod) => mod.AnalistaCalidadComponent),
        outlet: 'contentido',
      },
    ],
  },
  {
    path: NAV.registroMedicamento,
    component: PrincipalLayoutComponent,
    //canMatch: [() => canMatch(['Médico'])],
    children: [     
      {
        path: '',        
        loadComponent: () => import('../../modules/mezclas/registro-medicamento/registro-medicamento.component').then((mod) => mod.RegistroMedicamentoComponent),
        outlet: 'contentido',
      },
    ],
  },
  {
    path: NAV.asignacionMedicamentos,
    component: PrincipalLayoutComponent,
    //canMatch: [() => canMatch(['Médico'])],
    children: [     
      {
        path: '',        
        loadComponent: () => import('../../modules/mezclas/asignacion/asignacion-medicamentos/asignacion-medicamentos.component').then((mod) => mod.AsignacionMedicamentosComponent),
        outlet: 'contentido',
      },
    ],
  },
  {
    path: NAV.asignacionTurno,
    component: PrincipalLayoutComponent,
    //canMatch: [() => canMatch(['Médico'])],
    children: [     
      {
        path: '',        
        loadComponent: () => import('../../modules/mezclas/asignacion/asignacion-turno/asignacion-turno.component').then((mod) => mod.AsignacionTurnoComponent),
        outlet: 'contentido',
      },
    ],
  },
  {
    path: NAV.mezclasNoAprobadas,
    component: PrincipalLayoutComponent,
    //canMatch: [() => canMatch(['Médico'])],
    children: [     
      {
        path: '',        
        loadComponent: () => import('../../modules/mezclas/mezclas-no-aprobadas/mezclas-no-aprobadas.component').then((mod) => mod.MezclasNoAprobadasComponent),
        outlet: 'contentido',
      },
    ],
  },
  {
    path: NAV.seguimientoGeneral,
    component: PrincipalLayoutComponent,
    //canMatch: [() => canMatch(['Médico'])],
    children: [     
      {
        path: '',        
        loadComponent: () => import('../../modules/mezclas/seguimiento-general/seguimiento-general.component').then((mod) => mod.SeguimientoGeneralComponent),
        outlet: 'contentido',
      },
    ],
  },
  {
    path: NAV.aplicacionMezcla,
    component: PrincipalLayoutComponent,
    //canMatch: [() => canMatch(['Médico'])],
    children: [     
      {
        path: '',        
        loadComponent: () => import('../../modules/mezclas/aplicacion/aplicacion.component').then((mod) => mod.AplicacionComponent),
        outlet: 'contentido',
      },
    ],
  },  
  {
    path: NAV.acondicionamiento,
    component: PrincipalLayoutComponent,
    //canMatch: [() => canMatch(['Médico'])],
    children: [     
      {
        path: '',        
        loadComponent: () => import('../../modules/mezclas/acondicionamiento/acondicionamiento.component').then((mod) => mod.AcondicionamientoComponent),
        outlet: 'contentido',
      },
    ],
  },
  {
    path: NAV.ordenDistribucion,
    component: PrincipalLayoutComponent,
    //canMatch: [() => canMatch(['Médico'])],
    children: [     
      {
        path: '',        
        loadComponent: () => import('../../modules/mezclas/orden-distribucion/orden-distribucion.component').then((mod) => mod.OrdenDistribucionComponent),
        outlet: 'contentido',
      },
    ],
  },
  {
    path: NAV.aplicacionDetalleAntibiotico,
    component: PrincipalLayoutComponent,
    //canMatch: [() => canMatch(['Médico'])],
    children: [     
      {
        path: '',        
        loadComponent: () => import('../../modules/mezclas/aplicacion/detalle-esteril/antibiotico/antibiotico.component').then((mod) => mod.AntibioticoComponent),
        outlet: 'contentido',
      },
    ],
  },
  {
    path: NAV.aplicacionDetalleNPT,
    component: PrincipalLayoutComponent,
    //canMatch: [() => canMatch(['Médico'])],
    children: [     
      {
        path: '',        
        loadComponent: () => import('../../modules/mezclas/aplicacion/detalle-esteril/npt/npt.component').then((mod) => mod.NptComponent),
        outlet: 'contentido',
      },
    ],
  },
  {
    path: NAV.recepcionUM,
     component: PrincipalLayoutComponent,
    //canMatch: [() => canMatch(['Médico'])],
    children: [     
      {
        path: '',        
        loadComponent: () => import('../../modules/mezclas/recepcion-unidad-medica/recepcion-unidad-medica.component').then((mod) => mod.RecepcionUnidadMedicaComponent),
         outlet: 'contentido',
      },
    ],
  },
  {
  
    path: NAV.detalleAntiResolucion,
    component: PrincipalLayoutComponent,
    //canMatch: [() => canMatch(['Médico'])],
    children: [     
      {
        path: '',        
          loadComponent: () => import('../../modules/mezclas/analista-calidad/detalle-anti/detalle-anti.component').then((mod) => mod.DetalleAntiComponent),
        outlet: 'contentido',
      },
    ],
  },
  {
    path: NAV.detalleNPTResolucion,
    component: PrincipalLayoutComponent,
    //canMatch: [() => canMatch(['Médico'])],
    children: [     
      {
        path: '',        
        loadComponent: () => import('../../modules/mezclas/analista-calidad/detalle-npt/detalle-npt.component').then((mod) => mod.DetalleNPTComponent),
        outlet: 'contentido',
      },
    ],
  },
  {
    path: NAV.detalleCitotoxicoResolucion,
    component: PrincipalLayoutComponent,
    //canMatch: [() => canMatch(['Médico'])],
    children: [     
      {
        path: '',        
        loadComponent: () => import('../../modules/mezclas/analista-calidad/detalle-citotoxico/detalle-citotoxico.component').then((mod) => mod.DetalleCitotoxicoComponent),
        outlet: 'contentido',
      },
    ],
  },
  ,
  {
  
    path: NAV.detalleAntiAcondicionamiento,
    component: PrincipalLayoutComponent,
    //canMatch: [() => canMatch(['Médico'])],
    children: [     
      {
        path: '',        
          loadComponent: () => import('../../modules/mezclas/acondicionamiento/detalle-anti/detalle-anti.component').then((mod) => mod.DetalleAntiComponent),
        outlet: 'contentido',
      },
    ],
  },
  {
    path: NAV.detalleNPTAcondicionamiento,
    component: PrincipalLayoutComponent,
    //canMatch: [() => canMatch(['Médico'])],
    children: [     
      {
        path: '',        
        loadComponent: () => import('../../modules/mezclas/acondicionamiento/detalle-npt/detalle-npt.component').then((mod) => mod.DetalleNPTComponent),
        outlet: 'contentido',
      },
    ],
  },
  {
    path: NAV.detalleCitotoxicoAcondicionamiento,
    component: PrincipalLayoutComponent,
    //canMatch: [() => canMatch(['Médico'])],
    children: [     
      {
        path: '',        
        loadComponent: () => import('../../modules/mezclas/acondicionamiento/detalle-citotoxico/detalle-citotoxico.component').then((mod) => mod.DetalleCitotoxicoComponent),
        outlet: 'contentido',
      },
    ],
  },
  {
    path: NAV.reimpresionEtiquetas,
    component: PrincipalLayoutComponent,
    //canMatch: [() => canMatch(['Médico'])],
    children: [     
      {
        path: '',        
        loadComponent: () => import('../../modules/mezclas/reimpresion-etiquetas/reimpresion-etiquetas.component').then((mod) => mod.ReimpresionEtiquetasComponent),
        outlet: 'contentido',
      },
    ],
  },
  {
    path: NAV.preparacion,
    component: PrincipalLayoutComponent,
    //canMatch: [() => canMatch(['Médico'])],
    children: [     
      {
        path: '',        
        loadComponent: () => import('../../modules/mezclas/preparacion-mezcla/preparacion-mezcla.component').then((mod) => mod.PreparacionMezclaComponent),
        outlet: 'contentido',
      },
    ],
  },
  {
    path: NAV.detallePreparacion,
    component: PrincipalLayoutComponent,
    //canMatch: [() => canMatch(['Médico'])],
    children: [     
      {
        path: '',        
        loadComponent: () => import('../../modules/mezclas/preparacion-mezcla/detalle-mezcla/detalle-mezcla.component').then((mod) => mod.DetalleMezclaComponent),
        outlet: 'contentido',
      },
    ],
  },
  {
    path: NAV.duplicarSolicitud,
    component: PrincipalLayoutComponent,
    //canMatch: [() => canMatch(['Médico'])],
    children: [     
      {
        path: '',        
        loadComponent: () => import('../../modules/mezclas/solicitud/duplicar-mezcla/duplicar-mezcla.component').then((mod) => mod.DuplicarMezclaComponent),
        outlet: 'contentido',
      },
    ],
  },
  {
    path: NAV.editaFichaTecnica,
    component: PrincipalLayoutComponent,
    //canMatch: [() => canMatch(['Médico'])],
    children: [     
      {
        path: '',        
        loadComponent: () => import('../../modules/mezclas/edita-ficha-tecnica/edita-ficha-tecnica.component').then((mod) => mod.EditaFichaTecnicaComponent),
        outlet: 'contentido',
      },
    ],
  },
  // siempre al final 
  {
    path: NAV.noData,
    component: PrincipalLayoutComponent,
    //canMatch: [() => canMatch(['Administrador General'])],
    children: [
      {
        path: '',
        loadComponent: () => import('../../shared/layout/no-data/no-data.component').then((m) => m.NoDataComponent),
        outlet: 'contentido',
      },
    ],
  },
  { path: '',   redirectTo: NAV.login, pathMatch: 'full' },
  { path: '**', redirectTo: NAV.noData, pathMatch: 'full'}
];
