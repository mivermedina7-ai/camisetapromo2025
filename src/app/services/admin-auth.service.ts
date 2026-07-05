import { Injectable, inject } from '@angular/core';
import { Auth, GoogleAuthProvider, User, authState, signInWithEmailAndPassword, signInWithPopup, signOut } from '@angular/fire/auth';
import { Observable, combineLatest, map } from 'rxjs';

import { environment } from '../../environments/environment';
import { AdminsService } from './admins.service';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {
  private readonly auth = inject(Auth);
  private readonly adminsService = inject(AdminsService);

  private readonly founderEmails = environment.founderEmails.map(email => email.toLowerCase());

  readonly user$: Observable<User | null> = authState(this.auth);

  readonly admins$ = this.adminsService.obtenerAdmins();

  readonly isAdmin$: Observable<boolean> = combineLatest([this.user$, this.admins$]).pipe(
    map(([user, admins]) => this.checkAdmin(user, admins))
  );

  isAdmin(user: User | null): boolean {
    return this.checkAdmin(user, []);
  }

  private checkAdmin(user: User | null, admins: { email: string }[]): boolean {
    if (!user?.email) {
      return false;
    }
    const email = user.email.toLowerCase();
    if (this.founderEmails.includes(email)) {
      return true;
    }
    return admins.some(admin => admin.email?.toLowerCase() === email);
  }

  async loginWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    await signInWithPopup(this.auth, provider);
  }

  async loginWithEmail(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(this.auth, email.trim(), password);
  }

  logout(): Promise<void> {
    return signOut(this.auth);
  }
}