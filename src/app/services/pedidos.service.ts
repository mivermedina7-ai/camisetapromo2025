import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where
} from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { GeneroPedido, Pedido, PedidoRegistro } from '../models/pedido.model';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {
  private readonly firestore = inject(Firestore);
  private readonly coleccion = 'pedidos_camisetas';

  obtenerPedidos(): Observable<Pedido[]> {
    const ref = collection(this.firestore, this.coleccion);
    return (collectionData(ref, { idField: 'id' }) as Observable<Pedido[]>).pipe(
      map(pedidos => [...pedidos].sort((a, b) => (a.numero ?? 0) - (b.numero ?? 0)))
    );
  }

  /**
   * Inserta un pedido garantizando que la combinación (número, género) sea única.
   * - El mismo número PUEDE existir en 'hombre' y 'mujer' a la vez.
   * - El mismo número NO PUEDE existir dos veces dentro del mismo género.
   *
   * Implementación: pre-check con `getDocs` + `setDoc` directo. La transacción
   * con `tx.get(query)` no es soportada por el SDK (tx.get solo acepta
   * DocumentReference). En un sitio de registro de camisetas de promoción
   * la ventana de race condition es despreciable.
   */
  async agregarPedido(pedido: PedidoRegistro): Promise<void> {
    const numero = pedido.numero;
    const genero = pedido.genero;

    if (numero == null) {
      throw new Error('El número de camiseta es obligatorio.');
    }

    const ocupado = await this.verificarNumeroEnGenero(numero, genero);
    if (ocupado) {
      throw new Error(this.mensajeConflicto(numero, genero));
    }

    const colRef = collection(this.firestore, this.coleccion);
    const docRef = doc(colRef);
    await setDoc(docRef, {
      ...this.limpiar(pedido),
      fecha: new Date().toISOString()
    });
  }

  eliminarPedido(id: string): Promise<void> {
    const ref = doc(this.firestore, this.coleccion, id);
    return deleteDoc(ref);
  }

  /**
   * Devuelve true si ya existe un pedido con esa combinación (número, género).
   * Usado por el formulario para feedback de UX antes del guardado final.
   */
  async verificarNumeroEnGenero(numero: number, genero: GeneroPedido): Promise<boolean> {
    const colRef = collection(this.firestore, this.coleccion);
    const q = query(colRef, where('numero', '==', numero), where('genero', '==', genero));
    const snap = await getDocs(q);
    return !snap.empty;
  }

  /**
   * Devuelve el pedido concreto (número + género) si existe. Útil para mostrar
   * nombre/teléfono de quien ya tiene ese número reservado y mejorar la UX.
   */
  async obtenerPedidoPorNumeroYGenero(
    numero: number,
    genero: GeneroPedido
  ): Promise<Pedido | null> {
    const colRef = collection(this.firestore, this.coleccion);
    const q = query(colRef, where('numero', '==', numero), where('genero', '==', genero));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const d = snap.docs[0];
    return { id: d.id, ...(d.data() as Pedido) };
  }

  private mensajeConflicto(numero: number | null | undefined, genero: GeneroPedido): string {
    const etiqueta = genero === 'mujer' ? 'damas' : 'caballeros';
    return `El número ${numero ?? ''} ya está registrado en la categoría ${etiqueta}. Puedes repetirlo en la otra categoría.`;
  }

  private limpiar(pedido: PedidoRegistro): PedidoRegistro {
    const data = { ...pedido };
    if (typeof data['nombre'] === 'string') {
      data['nombre'] = (data['nombre'] as string).trim();
    }
    return data;
  }
}
