import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, deleteDoc, doc, query, where } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL, deleteObject } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { Pedido } from '../models/pedido.model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private firestore = inject(Firestore);
  private storage = inject(Storage);
  private readonly COLECCION = 'pedidos_camisetas';

  // ============ FIRESTORE - PEDIDOS ============
  
  obtenerPedidos(): Observable<Pedido[]> {
    const ref = collection(this.firestore, this.COLECCION);
    return collectionData(ref, { idField: 'id' }) as Observable<Pedido[]>;
  }

  async agregarPedido(pedido: Omit<Pedido, 'id'>): Promise<void> {
    const ref = collection(this.firestore, this.COLECCION);
    await addDoc(ref, {
      ...pedido,
      fecha: new Date().toISOString()
    });
  }

  async eliminarPedido(id: string): Promise<void> {
    const ref = doc(this.firestore, this.COLECCION, id);
    await deleteDoc(ref);
  }

  verificarNumeroExiste(numero: number): Observable<boolean> {
    const ref = collection(this.firestore, this.COLECCION);
    const q = query(ref, where('numero', '==', numero));
    return new Observable(subscriber => {
      collectionData(q).subscribe(docs => {
        subscriber.next(docs.length > 0);
        subscriber.complete();
      });
    });
  }

  // ============ STORAGE - SUBIR ARCHIVOS ============

  /**
   * Sube un archivo a Firebase Storage
   * @param file Archivo a subir
   * @param path Ruta donde guardar el archivo (ej: 'disenos/mi-imagen.jpg')
   * @returns URL de descarga del archivo
   */
  async subirArchivo(file: File, path: string): Promise<string> {
    const storageRef = ref(this.storage, path);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
  }

  /**
   * Sube una imagen y retorna la URL (utilidad para diseños de camisetas)
   */
  async subirImagenDiseno(file: File, nombreArchivo: string): Promise<string> {
    const timestamp = Date.now();
    const path = `disenos/${timestamp}_${nombreArchivo}`;
    return this.subirArchivo(file, path);
  }

  /**
   * Elimina un archivo de Storage
   * @param url URL del archivo a eliminar
   */
  async eliminarArchivo(url: string): Promise<void> {
    const storageRef = ref(this.storage, url);
    await deleteObject(storageRef);
  }
}
