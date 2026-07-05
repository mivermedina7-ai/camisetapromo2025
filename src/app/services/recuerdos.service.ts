import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, query, updateDoc, where } from '@angular/fire/firestore';
import { Observable, catchError, map, of } from 'rxjs';
import { ComentarioRecuerdo, ComentarioRecuerdoRegistro, Recuerdo, RecuerdoRegistro } from '../models/recuerdo.model';
import { censurarTexto } from '../utils/text-moderation.util';
import { CloudinaryStorageService } from './cloudinary-storage.service';

@Injectable({
  providedIn: 'root'
})
export class RecuerdosService {
  private readonly firestore = inject(Firestore);
  private readonly storage = inject(CloudinaryStorageService);
  private readonly coleccion = 'recuerdos_promocion';
  private readonly comentariosColeccion = 'comentarios_recuerdos';

  obtenerAprobados(): Observable<Recuerdo[]> {
    const ref = collection(this.firestore, this.coleccion);
    // Filtramos en el servidor: el visitante solo necesita ver aprobados/destacados,
    // y así las reglas de Firestore no se rompen al pedir la colección entera
    // (que incluiría 'pendiente', no legible para visitantes).
    const q = query(ref, where('estado', 'in', ['aprobado', 'destacado']));
    return (collectionData(q, { idField: 'id' }) as Observable<Recuerdo[]>).pipe(
      map(recuerdos => this.ordenarPorFecha(recuerdos)),
      catchError(err => {
        console.error('Error al cargar recuerdos públicos:', err);
        return of([]);
      })
    );
  }

  obtenerTodos(): Observable<Recuerdo[]> {
    const ref = collection(this.firestore, this.coleccion);
    return (collectionData(ref, { idField: 'id' }) as Observable<Recuerdo[]>).pipe(
      map(recuerdos => this.ordenarPorFecha(recuerdos)),
      catchError(err => {
        console.error('Error al cargar todos los recuerdos:', err);
        return of([]);
      })
    );
  }

  obtenerComentariosPublicos(): Observable<ComentarioRecuerdo[]> {
    const ref = collection(this.firestore, this.comentariosColeccion);
    const q = query(ref, where('estado', 'in', ['publicado', 'aprobado', 'pendiente']));
    return (collectionData(q, { idField: 'id' }) as Observable<ComentarioRecuerdo[]>).pipe(
      map(comentarios => this.ordenarComentarios(comentarios)),
      catchError(err => {
        console.error('Error al cargar comentarios publicos:', err);
        return of([]);
      })
    );
  }

  obtenerComentariosTodos(): Observable<ComentarioRecuerdo[]> {
    const ref = collection(this.firestore, this.comentariosColeccion);
    return (collectionData(ref, { idField: 'id' }) as Observable<ComentarioRecuerdo[]>).pipe(
      map(comentarios => this.ordenarComentarios(comentarios)),
      catchError(err => {
        console.error('Error al cargar comentarios:', err);
        return of([]);
      })
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
      promocion: '2025',
      mensaje: data.mensaje.trim(),
      imagenUrl,
      imagenPublicId,
      estado: 'pendiente',
      fecha: new Date().toISOString()
    });
  }

  async crearComentario(data: ComentarioRecuerdoRegistro): Promise<void> {
    const ref = collection(this.firestore, this.comentariosColeccion);
    const nombre = censurarTexto(data.nombre);
    const mensaje = censurarTexto(data.mensaje);

    await addDoc(ref, {
      recuerdoId: data.recuerdoId,
      parentId: data.parentId?.trim() || '',
      nombre: nombre.texto,
      mensaje: mensaje.texto,
      estado: 'publicado',
      censurado: nombre.censurado || mensaje.censurado,
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

  eliminarComentario(id: string): Promise<void> {
    return deleteDoc(doc(this.firestore, this.comentariosColeccion, id));
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

  private ordenarComentarios(comentarios: ComentarioRecuerdo[]): ComentarioRecuerdo[] {
    return [...comentarios].sort((a, b) => (a.fecha || '').localeCompare(b.fecha || ''));
  }
}
