import { Injectable } from '@angular/core';

/**
 * @deprecated Reemplazado por `CloudinaryStorageService`.
 *
 * Firebase Storage requiere plan Blaze (con tarjeta), mientras que
 * Cloudinary nos da 25 GB gratis sin tarjeta. Este servicio queda
 * en el repo solo por referencia — no se inyecta en ningún lado.
 *
 * Pendiente: borrar este archivo después de validar que
 * CloudinaryStorageService funciona en producción.
 */
@Injectable({
  providedIn: 'root'
})
export class MediaStorageService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async subirImagenRecuerdo(_file: File): Promise<{ url: string; path: string }> {
    throw new Error('MediaStorageService está deprecado. Usa CloudinaryStorageService.');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  eliminarPorPath(_path: string): Promise<void> {
    return Promise.resolve();
  }
}
