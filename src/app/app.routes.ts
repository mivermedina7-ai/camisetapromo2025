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
    title: 'Promoción 2025 IEE José María Arguedas'
  },
  {
    path: 'registro',
    component: RegistroPageComponent,
    title: 'Registro de camisetas'
  },
  {
    path: 'tallas',
    component: TallasPageComponent,
    title: 'Guía de tallas'
  },
  {
    path: 'comunidad',
    component: ComunidadPageComponent,
    title: 'Comunidad Promoción 2025'
  },
  {
    path: 'partidos',
    component: PartidosPageComponent,
    title: 'Deportes Promoción 2025'
  },
  {
    path: 'agenda',
    component: AgendaPageComponent,
    title: 'Agenda del reencuentro'
  },
  {
    path: 'admin',
    component: AdminPageComponent,
    title: 'Administración'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
