import { DisciplinaDeportiva } from '../models/partido.model';

export const DISCIPLINAS_DEPORTIVAS: DisciplinaDeportiva[] = [
  {
    id: 'voley-mixto',
    nombre: 'Vóley Mixto',
    icono: 'fa-volleyball',
    detalle: 'Equipo mixto para integración de la promoción.'
  },
  {
    id: 'voley-femenino',
    nombre: 'Vóley Femenino',
    icono: 'fa-volleyball',
    detalle: 'Inscripción para compañeras que quieran jugar vóley.'
  },
  {
    id: 'basket-mujer',
    nombre: 'Básquet Mujer',
    icono: 'fa-basketball',
    detalle: 'Equipo femenino de basket para el reencuentro.'
  },
  {
    id: 'basket-varones',
    nombre: 'Básquet Varones',
    icono: 'fa-basketball',
    detalle: 'Equipo masculino de basket para el reencuentro.'
  },
  {
    id: 'futbol',
    nombre: 'Fútbol',
    icono: 'fa-futbol',
    detalle: 'Inscripción abierta para el equipo de fútbol.'
  }
];
