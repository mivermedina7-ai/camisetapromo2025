export type EstadoRecuerdo = 'pendiente' | 'aprobado' | 'destacado';

export interface Recuerdo {
  id?: string;
  nombre: string;
  promocion?: string;
  mensaje: string;
  imagenUrl?: string;
  /**
   * Public ID en Cloudinary (reemplaza al antiguo `imagenPath` de
   * Firebase Storage). Opcional por si quedan recuerdos viejos en
   * la BD con la clave antigua — la galería los ignora.
   */
  imagenPublicId?: string;
  /** @deprecated Solo presente en recuerdos anteriores a la migración a Cloudinary. */
  imagenPath?: string;
  estado: EstadoRecuerdo;
  fecha: string;
}

export interface RecuerdoRegistro {
  nombre: string;
  promocion?: string;
  mensaje: string;
}
