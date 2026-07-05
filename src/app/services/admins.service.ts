import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  setDoc
} from '@angular/fire/firestore';
import { Observable, catchError, map, of } from 'rxjs';

import { Admin, AdminRegistro } from '../models/admin.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminsService {
  private readonly firestore = inject(Firestore);
  private readonly coleccion = 'admins';

  readonly founderEmails: string[] = [...environment.founderEmails];

  private normalizar(email: string): string {
    return email.trim().toLowerCase();
  }

  esFounder(email: string | null | undefined): boolean {
    if (!email) {
      return false;
    }
    return this.founderEmails.includes(this.normalizar(email));
  }

  obtenerAdmins(): Observable<Admin[]> {
    const ref = collection(this.firestore, this.coleccion);
    return (collectionData(ref, { idField: 'id' }) as Observable<Admin[]>).pipe(
      map(admins => {
        const seen = new Set<string>();
        const combinados: Admin[] = [];

        for (const email of this.founderEmails) {
          const id = this.normalizar(email);
          if (!seen.has(id)) {
            seen.add(id);
            combinados.push({
              id,
              email,
              role: 'founder',
              addedBy: 'sistema',
              addedAt: ''
            });
          }
        }

        for (const admin of admins) {
          const id = admin.email ? this.normalizar(admin.email) : admin.id;
          if (id && !seen.has(id)) {
            seen.add(id);
            combinados.push({ ...admin, id, email: this.normalizar(admin.email) });
          }
        }

        return combinados.sort((a, b) => a.email.localeCompare(b.email));
      }),
      catchError(() => of([]))
    );
  }

  async agregarAdmin(email: string, role: AdminRegistro['role'], addedBy: string): Promise<void> {
    const normalizado = this.normalizar(email);
    if (!normalizado || !normalizado.includes('@')) {
      throw new Error('Correo inválido.');
    }

    if (this.esFounder(normalizado)) {
      throw new Error('Este correo ya es fundador y no necesita re-registrarse.');
    }

    const ref = doc(this.firestore, this.coleccion, normalizado);
    const existente = await getDoc(ref);
    if (existente.exists()) {
      throw new Error('Ese correo ya tiene permisos de administrador.');
    }

    await setDoc(ref, {
      email: normalizado,
      role,
      addedBy: this.normalizar(addedBy),
      addedAt: new Date().toISOString(),
      creadoEn: serverTimestamp()
    });
  }

  async eliminarAdmin(email: string): Promise<void> {
    const normalizado = this.normalizar(email);
    if (this.esFounder(normalizado)) {
      throw new Error('Los fundadores no pueden ser removidos desde el panel.');
    }
    await deleteDoc(doc(this.firestore, this.coleccion, normalizado));
  }

  estaAutorizado(email: string | null | undefined, admins: Admin[]): boolean {
    if (!email) {
      return false;
    }
    const normalizado = this.normalizar(email);
    if (this.founderEmails.includes(normalizado)) {
      return true;
    }
    return admins.some(admin => this.normalizar(admin.email) === normalizado);
  }
}