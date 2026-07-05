import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EstadoPartido, PartidoRegistro } from '../../models/partido.model';
import { PartidosService } from '../../services/partidos.service';

@Component({
  selector: 'app-partido-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './partido-form.component.html',
  styleUrl: './partido-form.component.css'
})
export class PartidoFormComponent {
  @Output() partidoCreado = new EventEmitter<void>();

  private readonly partidosService = inject(PartidosService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly estados: EstadoPartido[] = ['programado', 'en_juego', 'finalizado'];
  form: PartidoRegistro = this.crearFormulario();
  isLoading = false;
  message = '';
  error = '';

  async guardar(): Promise<void> {
    this.message = '';
    this.error = '';

    if (!this.form.deporte.trim() || !this.form.equipoA.trim() || !this.form.equipoB.trim() || !this.form.fecha || !this.form.hora) {
      this.error = 'Completa deporte, equipos, fecha y hora.';
      return;
    }

    this.isLoading = true;

    try {
      await this.partidosService.crearPartido(this.form);
      this.form = this.crearFormulario();
      this.message = 'Partido agregado al cronograma.';
      this.partidoCreado.emit();
    } catch (error: any) {
      this.error = error?.message || 'No se pudo guardar el partido.';
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  private crearFormulario(): PartidoRegistro {
    return {
      deporte: 'Fútbol',
      categoria: 'Promoción 2025',
      equipoA: '',
      equipoB: '',
      fecha: '',
      hora: '',
      lugar: 'Patio deportivo del colegio',
      estado: 'programado',
      marcadorA: null,
      marcadorB: null,
      detalle: ''
    };
  }
}
