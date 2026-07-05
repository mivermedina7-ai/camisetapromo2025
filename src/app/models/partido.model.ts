export type EstadoPartido = 'programado' | 'en_juego' | 'finalizado';
export type DisciplinaId = 'voley-mixto' | 'voley-femenino' | 'basket-mujer' | 'basket-varones' | 'futbol';

export interface Partido {
  id?: string;
  deporte: string;
  categoria: string;
  equipoA: string;
  equipoB: string;
  fecha: string;
  hora: string;
  lugar: string;
  estado: EstadoPartido;
  marcadorA?: number | null;
  marcadorB?: number | null;
  detalle?: string;
  creadoEn?: string;
}

export interface PartidoRegistro {
  deporte: string;
  categoria: string;
  equipoA: string;
  equipoB: string;
  fecha: string;
  hora: string;
  lugar: string;
  estado: EstadoPartido;
  marcadorA?: number | null;
  marcadorB?: number | null;
  detalle?: string;
}

export interface DisciplinaDeportiva {
  id: DisciplinaId;
  nombre: string;
  icono: string;
  detalle: string;
}

export interface InscripcionDeportiva {
  id?: string;
  nombre: string;
  disciplinas: DisciplinaId[];
  promocion: '2025';
  fecha: string;
}

export interface InscripcionDeportivaRegistro {
  nombre: string;
  disciplinas: DisciplinaId[];
}
