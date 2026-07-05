import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, query, updateDoc, where } from '@angular/fire/firestore';
import { Observable, catchError, map, of } from 'rxjs';
import { Recuerdo, RecuerdoRegistro } from '../models/recuerdo.model';
import { CloudinaryStorageService } from './cloudinary-storage.service';

@Injectable({
  providedIn: 'root'
})
export class RecuerdosService {
  private readonly firestore = inject(Firestore);
  private readonly storage = inject(CloudinaryStorageService);
  private readonly coleccion = 'recuerdos_promocion';

  obtenerAprobados(): Observable<Recuerdo[]> {
    const ref = collection(this.firestore, this.coleccion);
    return (collectionData(ref, { idField: 'id' }) as Observable<Recuerdo[]>).pipe(
      map(recuerdos => this.ordenarPorFecha(recuerdos.filter(recuerdo => recuerdo.estado === 'aprobado' || recuerdo.estado === 'destacado'))),
      catchError(() => of([]))
    );
  }

  obtenerTodos(): Observable<Recuerdo[]> {
    const ref = collection(this.firestore, this.coleccion);
    return (collectionData(ref, { idField: 'id' }) as Observable<Recuerdo[]>).pipe(
      map(recuerdos => this.ordenarPorFecha(recuerdos)),
      catchError(() => of([]))
    );
  }

  async crearRecuerdo(data: RecuerdoRegistro, file?: File | null): Promise<void> {
    let imagenUrl = '';
    let imagenPublicId = '';

    if (file) {
      const uploaded = await this.storage.subirImagenRecuerdo(file);
      imagenUrl = uploaded.url;
      imagenPublicId = uploaded.publicId;
    }

    const ref = collection(this.firestore, this.coleccion);
    await addDoc(ref, {
      nombre: data.nombre.trim(),
      promocion: data.promocion?.trim() || '',
      mensaje: data.mensaje.trim(),
      imagenUrl,
      imagenPublicId,
      estado: 'pendiente',
      fecha: new Date().toISOString()
    });
  }

  aprobarRecuerdo(id: string): Promise<void> {
    return updateDoc(doc(this.firestore, this.coleccion, id), { estado: 'aprobado' });
  }

  marcarPendiente(id: string): Promise<void> {
    return updateDoc(doc(this.firestore, this.coleccion, id), { estado: 'pendiente' });
  }

  destacarRecuerdo(id: string): Promise<void> {
    return updateDoc(doc(this.firestore, this.coleccion, id), { estado: 'destacado' });
  }

  async eliminarRecuerdo(recuerdo: Recuerdo): Promise<void> {
    if (recuerdo.imagenPublicId) {
      await this.storage.eliminarPorPublicId(recuerdo.imagenPublicId).catch(() => undefined);
    }

    if (recuerdo.id) {
      await deleteDoc(doc(this.firestore, this.coleccion, recuerdo.id));
    }
  }

  private ordenarPorFecha(recuerdos: Recuerdo[]): Recuerdo[] {
    return [...recuerdos].sort((a, b) => (b.fecha || '').localeCompare(a.fecha || ''));
  }
}
