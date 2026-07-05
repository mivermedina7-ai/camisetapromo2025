import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';

interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  bytes: number;
  format: string;
}

export interface SubidaRecuerdo {
  url: string;
  publicId: string;
}

/**
 * Servicio que sube imágenes de recuerdos a Cloudinary usando
 * upload presets unsigned. Reemplaza al antiguo MediaStorageService
 * que dependía de Firebase Storage (requería plan Blaze).
 *
 * Cloudinary free tier: 25 GB almacenamiento + 25 GB bandwidth/mes
 * sin necesidad de tarjeta ni upgrade.
 *
 * Para eliminar imágenes después hay que hacerlo desde el dashboard
 * de Cloudinary o con una Cloud Function (la API Secret no puede
 * vivir en el cliente). Para esta primera versión dejamos la
 * eliminación como noop en el cliente — el admin puede limpiar
 * manualmente desde el dashboard si se acumula basura.
 */
@Injectable({
  providedIn: 'root'
})
export class CloudinaryStorageService {
  private readonly cloudName = environment.cloudinary.cloudName;
  private readonly uploadPreset = environment.cloudinary.uploadPreset;
  private readonly folder = environment.cloudinary.folder;

  async subirImagenRecuerdo(file: File): Promise<SubidaRecuerdo> {
    const safeName = file.name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9._-]/g, '-')
      .toLowerCase()
      .replace(/\.[^.]+$/, '');

    const publicId = `${Date.now()}-${safeName}`;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);
    formData.append('folder', this.folder);
    formData.append('public_id', publicId);

    const endpoint = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;

    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      throw new Error(
        `Cloudinary rechazó la imagen (${response.status}): ${errorBody || response.statusText}`
      );
    }

    const data: CloudinaryUploadResponse = await response.json();
    return {
      url: data.secure_url,
      publicId: data.public_id
    };
  }

  /**
   * Noop por ahora. La eliminación segura de Cloudinary requiere
   * el API Secret, que no debe estar en el cliente. Si el admin
   * quiere borrar imágenes masivamente, se hace desde el dashboard
   * de Cloudinary (Media Library → carpeta recuerdos → delete).
   *
   * Cuando crezca el tráfico podemos meter una Cloud Function
   * que use el API Secret y exponga un endpoint seguro.
   */
  eliminarPorPublicId(_publicId: string): Promise<void> {
    return Promise.resolve();
  }
}