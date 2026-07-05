import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RecuerdoRegistro } from '../../models/recuerdo.model';
import { RecuerdosService } from '../../services/recuerdos.service';

@Component({
  selector: 'app-recuerdo-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recuerdo-form.component.html',
  styleUrl: './recuerdo-form.component.css'
})
export class RecuerdoFormComponent {
  @Output() recuerdoEnviado = new EventEmitter<void>();

  private readonly recuerdosService = inject(RecuerdosService);
  private readonly cdr = inject(ChangeDetectorRef);

  form: RecuerdoRegistro = {
    nombre: '',
    mensaje: ''
  };
  file: File | null = null;
  previewUrl = '';
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  seleccionarArchivo(event: Event): void {
    const input = event.target as HTMLInputElement;
    const selected = input.files?.[0] || null;
    this.errorMessage = '';

    if (!selected) {
      this.file = null;
      this.previewUrl = '';
      return;
    }

    if (!selected.type.startsWith('image/')) {
      this.errorMessage = 'Solo se aceptan imágenes.';
      input.value = '';
      return;
    }

    if (selected.size > 5 * 1024 * 1024) {
      this.errorMessage = 'La imagen debe pesar menos de 5 MB.';
      input.value = '';
      return;
    }

    this.file = selected;
    this.previewUrl = URL.createObjectURL(selected);
  }

  async enviar(): Promise<void> {
    this.successMessage = '';
    this.errorMessage = '';

    if (!this.form.nombre.trim() || !this.form.mensaje.trim()) {
      this.errorMessage = 'Completa tu nombre y mensaje.';
      return;
    }

    this.isLoading = true;

    try {
      await this.recuerdosService.crearRecuerdo(this.form, this.file);
      this.form = { nombre: '', mensaje: '' };
      this.file = null;
      this.previewUrl = '';
      this.successMessage = 'Recuerdo enviado para revisión.';
      this.recuerdoEnviado.emit();
    } catch (error: any) {
      this.errorMessage = error?.message || 'No se pudo enviar el recuerdo.';
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }
}
