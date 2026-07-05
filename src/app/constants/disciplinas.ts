import { DisciplinaDeportiva } from '../models/partido.model';

export const DISCIPLINAS_DEPORTIVAS: DisciplinaDeportiva[] = [
  {
    id: 'voley-mixto',
    nombre: 'Voley Mixto',
    icono: 'fa-volleyball',
    detalle: 'Equipo mixto para integracion de la promocion.'
  },
  {
    id: 'voley-femenino',
    nombre: 'Voley Femenino',
    icono: 'fa-volleyball',
    detalle: 'Inscripcion para companeras que quieran jugar voley.'
  },
  {
    id: 'basket-mujer',
    nombre: 'Basket Mujer',
    icono: 'fa-basketball',
    detalle: 'Equipo femenino de basket para el reencuentro.'
  },
  {
    id: 'basket-varones',
    nombre: 'Basket Varones',
    icono: 'fa-basketball',
    detalle: 'Equipo masculino de basket para el reencuentro.'
  },
  {
    id: 'futbol',
    nombre: 'Futbol',
    icono: 'fa-futbol',
    detalle: 'Inscripcion abierta para el equipo de futbol.'
  }
];
