import { Component, OnInit, OnDestroy, inject, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FirebaseService } from './services/firebase.service';
import { Pedido } from './models/pedido.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  // Formulario
  nombre = '';
  numero: number | null = null;
  talla = '';

  // Lista
  pedidos: Pedido[] = [];

  // Admin
  isAdmin = false;
  showLoginModal = false;
  passwordInput = '';
  loginError = false;

  // Estados
  showSuccess = false;
  showError = false;
  errorMessage = '';
  isLoading = false;
  // Conexión
  connectionMessage = '';
  connectionOk: boolean | null = null;

  // Constante
  readonly ADMIN_PASSWORD = 'admin2026';

  private firebaseService = inject(FirebaseService);
  private ngZone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);
  private pedidosSub: Subscription | null = null;

  ngOnInit(): void {
    this.isAdmin = localStorage.getItem('adminLoggedIn') === 'true';

    // Mantener suscripción viva mientras el componente esté montado
    this.pedidosSub = this.firebaseService.obtenerPedidos().subscribe(pedidos => {
      this.ngZone.run(() => {
        this.pedidos = pedidos.sort((a, b) => (a.numero ?? 0) - (b.numero ?? 0));
        this.cdr.detectChanges();
      });
    });
  }

  ngOnDestroy(): void {
    if (this.pedidosSub) {
      this.pedidosSub.unsubscribe();
      this.pedidosSub = null;
    }
  }

  get pedidosOrdenados(): Pedido[] {
    return [...this.pedidos].sort((a, b) => (a.numero ?? 0) - (b.numero ?? 0));
  }

  get numerosUnicos(): number {
    return new Set(this.pedidos.map(p => p.numero)).size;
  }

  get tallasUnicas(): number {
    return new Set(this.pedidos.map(p => p.talla)).size;
  }

  toggleAdminModal(): void {
    if (this.isAdmin) {
      this.logout();
    } else {
      this.showLoginModal = true;
      this.passwordInput = '';
      this.loginError = false;
    }
  }

  closeLoginModal(): void {
    this.showLoginModal = false;
  }

  login(): void {
    if (this.passwordInput === this.ADMIN_PASSWORD) {
      localStorage.setItem('adminLoggedIn', 'true');
      this.isAdmin = true;
      this.showLoginModal = false;
      this.passwordInput = '';
      this.loginError = false;
    } else {
      this.loginError = true;
      this.passwordInput = '';
    }
  }

  logout(): void {
    localStorage.removeItem('adminLoggedIn');
    this.isAdmin = false;
  }

  resetForm(): void {
    this.nombre = '';
    this.numero = null;
    this.talla = '';
    this.isLoading = false;
    this.showSuccess = false;
    this.showError = false;
    this.errorMessage = '';
  }

  registrar(): void {
    if (!this.nombre || !this.numero || !this.talla) return;

    console.log('[registrar] Click en botón');
    this.isLoading = true;
    this.showSuccess = false;
    this.showError = false;
    this.cdr.detectChanges();

    // Backup: resetear isLoading después de 5 segundos SIEMPRE
    const backupTimer = setTimeout(() => {
      if (this.isLoading) {
        console.warn('[registrar] Backup timeout: forzando isLoading = false');
        this.ngZone.run(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        });
      }
    }, 5000);

    this.firebaseService.agregarPedido({
      nombre: this.nombre,
      numero: this.numero,
      talla: this.talla
    }).then(() => {
      console.log('[registrar] Éxito');
      clearTimeout(backupTimer);
      this.ngZone.run(() => {
        this.nombre = '';
        this.numero = null;
        this.talla = '';
        this.showSuccess = true;
        this.isLoading = false;
        this.cdr.detectChanges();
      });
      setTimeout(() => {
        this.ngZone.run(() => {
          this.showSuccess = false;
          this.cdr.detectChanges();
        });
      }, 3000);
    }).catch((error: any) => {
      console.error('[registrar] Error:', error);
      clearTimeout(backupTimer);
      this.ngZone.run(() => {
        this.errorMessage = error?.message || 'Error al registrar';
        this.showError = true;
        this.isLoading = false;
        this.cdr.detectChanges();
      });
      setTimeout(() => {
        this.ngZone.run(() => {
          this.showError = false;
          this.cdr.detectChanges();
        });
      }, 6000);
    });
  }

  eliminarPedido(id: string): void {
    if (!confirm('¿Eliminar este registro?')) return;
    this.firebaseService.eliminarPedido(id).catch((error: any) => {
      alert('Error al eliminar: ' + (error.message || 'Error'));
    });
  }

  exportarCSV(): void {
    if (this.pedidos.length === 0) {
      alert('No hay datos para exportar.');
      return;
    }

    const headers = ['Nombre', 'Número', 'Talla', 'Fecha'];
    const rows = this.pedidosOrdenados.map(p => [
      p.nombre,
      p.numero,
      p.talla,
      p.fecha ? new Date(p.fecha).toLocaleString('es-PE') : ''
    ]);

    let csv = headers.join(',') + '\n';
    rows.forEach(r => csv += r.map(cell => `"${cell}"`).join(',') + '\n');

    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pedido_camisetas_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  probarConexion(): void {
    this.connectionMessage = 'Probando conexión...';
    this.connectionOk = null;

    const testNumero = 9999;
    this.firebaseService.verificarNumeroExiste(testNumero).subscribe(existe => {
      if (existe) {
        this.connectionMessage = 'Conexión OK: la consulta a Firestore funcionó (registro de prueba ya existe).';
        this.connectionOk = true;
        setTimeout(() => this.connectionMessage = '', 4000);
        return;
      }

      this.firebaseService.agregarPedido({ nombre: 'PRUEBA_CONEXION', numero: testNumero, talla: 'M' })
        .then(() => {
          this.connectionMessage = 'Conexión OK: se creó un documento de prueba.';
          this.connectionOk = true;
          setTimeout(() => this.connectionMessage = '', 4000);
        })
        .catch((err: any) => {
          this.connectionMessage = 'Error al escribir en Firestore: ' + (err?.message || err);
          this.connectionOk = false;
        });
    }, err => {
      this.connectionMessage = 'Error al leer desde Firestore: ' + (err?.message || err);
      this.connectionOk = false;
    });
  }
}
