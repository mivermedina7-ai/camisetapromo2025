import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, updateDoc } from '@angular/fire/firestore';
import { Observable, catchError, map, of } from 'rxjs';
import { InscripcionDeportiva, InscripcionDeportivaRegistro, Partido, PartidoRegistro } from '../models/partido.model';

@Injectable({
  providedIn: 'root'
})
export class PartidosService {
  private readonly firestore = inject(Firestore);
  private readonly coleccion = 'partidos_reencuentro';
  private readonly inscripcionesColeccion = 'inscripciones_deportivas';

  obtenerPartidos(): Observable<Partido[]> {
    const ref = collection(this.firestore, this.coleccion);
    return (collectionData(ref, { idField: 'id' }) as Observable<Partido[]>).pipe(
      map(partidos => [...partidos].sort((a, b) => `${a.fecha} ${a.hora}`.localeCompare(`${b.fecha} ${b.hora}`))),
      catchError(() => of([]))
    );
  }

  obtenerInscripcionesDeportivas(): Observable<InscripcionDeportiva[]> {
    const ref = collection(this.firestore, this.inscripcionesColeccion);
    return (collectionData(ref, { idField: 'id' }) as Observable<InscripcionDeportiva[]>).pipe(
      map(inscripciones => [...inscripciones].sort((a, b) => a.nombre.localeCompare(b.nombre))),
      catchError(() => of([]))
    );
  }

  async crearPartido(partido: PartidoRegistro): Promise<void> {
    const ref = collection(this.firestore, this.coleccion);
    await addDoc(ref, {
      ...this.limpiar(partido),
      creadoEn: new Date().toISOString()
    });
  }

  actualizarPartido(id: string, partido: Partial<PartidoRegistro>): Promise<void> {
    return updateDoc(doc(this.firestore, this.coleccion, id), this.limpiar(partido));
  }

  eliminarPartido(id: string): Promise<void> {
    return deleteDoc(doc(this.firestore, this.coleccion, id));
  }

  async registrarJugador(data: InscripcionDeportivaRegistro): Promise<void> {
    const ref = collection(this.firestore, this.inscripcionesColeccion);
    await addDoc(ref, {
      nombre: data.nombre.trim(),
      disciplinas: data.disciplinas,
      promocion: '2025',
      fecha: new Date().toISOString()
    });
  }

  eliminarInscripcion(id: string): Promise<void> {
    return deleteDoc(doc(this.firestore, this.inscripcionesColeccion, id));
  }

  private limpiar<T extends Partial<PartidoRegistro>>(partido: T): T {
    const data = { ...partido };

    for (const key of ['deporte', 'categoria', 'equipoA', 'equipoB', 'lugar', 'detalle'] as const) {
      if (typeof data[key] === 'string') {
        data[key] = data[key].trim();
      }
    }

    return data;
  }
}
