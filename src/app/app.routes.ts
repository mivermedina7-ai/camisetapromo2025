import { Routes } from '@angular/router';
import { AgendaPageComponent } from './pages/agenda/agenda.page';
import { AdminPageComponent } from './pages/admin/admin.page';
import { ComunidadPageComponent } from './pages/comunidad/comunidad.page';
import { HomePageComponent } from './pages/home/home.page';
import { PartidosPageComponent } from './pages/partidos/partidos.page';
import { RegistroPageComponent } from './pages/registro/registro.page';
import { TallasPageComponent } from './pages/tallas/tallas.page';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    title: 'Promocion 2025 IEE Jose Maria Arguedas'
  },
  {
    path: 'registro',
    component: RegistroPageComponent,
    title: 'Registro de camisetas'
  },
  {
    path: 'tallas',
    component: TallasPageComponent,
    title: 'Guia de tallas'
  },
  {
    path: 'comunidad',
    component: ComunidadPageComponent,
    title: 'Comunidad Promocion 2025'
  },
  {
    path: 'partidos',
    component: PartidosPageComponent,
    title: 'Deportes Promocion 2025'
  },
  {
    path: 'agenda',
    component: AgendaPageComponent,
    title: 'Agenda del reencuentro'
  },
  {
    path: 'admin',
    component: AdminPageComponent,
    title: 'Administracion'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
