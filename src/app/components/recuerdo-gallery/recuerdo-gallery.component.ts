import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ComentarioRecuerdo, Recuerdo } from '../../models/recuerdo.model';
import { RecuerdosService } from '../../services/recuerdos.service';

interface CommentDraft {
  nombre: string;
  mensaje: string;
  abierto: boolean;
  loading: boolean;
  success: string;
  error: string;
}

@Component({
  selector: 'app-recuerdo-gallery',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recuerdo-gallery.component.html',
  styleUrl: './recuerdo-gallery.component.css'
})
export class RecuerdoGalleryComponent {
  @Input() recuerdos: Recuerdo[] | null = [];
  @Input() comentarios: ComentarioRecuerdo[] | null = [];
  @Input() admin = false;
  @Input() allowComments = false;
  @Output() aprobar = new EventEmitter<Recuerdo>();
  @Output() destacar = new EventEmitter<Recuerdo>();
  @Output() pendiente = new EventEmitter<Recuerdo>();
  @Output() eliminar = new EventEmitter<Recuerdo>();

  private readonly recuerdosService = inject(RecuerdosService);
  private readonly cdr = inject(ChangeDetectorRef);

  drafts: Record<string, CommentDraft> = {};

  get items(): Recuerdo[] {
    return this.recuerdos || [];
  }

  comentariosDe(recuerdo: Recuerdo): ComentarioRecuerdo[] {
    if (!recuerdo.id) {
      return [];
    }
    return (this.comentarios || []).filter(comentario => comentario.recuerdoId === recuerdo.id);
  }

  draftPara(recuerdo: Recuerdo): CommentDraft {
    const key = recuerdo.id || recuerdo.fecha;
    if (!this.drafts[key]) {
      this.drafts[key] = {
        nombre: '',
        mensaje: '',
        abierto: false,
        loading: false,
        success: '',
        error: ''
      };
    }
    return this.drafts[key];
  }

  toggleComentarios(recuerdo: Recuerdo): void {
    const draft = this.draftPara(recuerdo);
    draft.abierto = !draft.abierto;
  }

  async comentar(recuerdo: Recuerdo): Promise<void> {
    const draft = this.draftPara(recuerdo);
    draft.success = '';
    draft.error = '';

    if (!recuerdo.id) {
      draft.error = 'No se pudo ubicar este recuerdo.';
      return;
    }

    if (!draft.nombre.trim() || !draft.mensaje.trim()) {
      draft.error = 'Completa tu nombre y comentario.';
      return;
    }

    if (draft.mensaje.trim().length < 3) {
      draft.error = 'El comentario debe tener al menos 3 caracteres.';
      return;
    }

    draft.loading = true;

    try {
      await this.recuerdosService.crearComentario({
        recuerdoId: recuerdo.id,
        nombre: draft.nombre,
        mensaje: draft.mensaje
      });
      draft.mensaje = '';
      draft.success = 'Comentario enviado para revisión.';
    } catch (error: any) {
      draft.error = error?.message || 'No se pudo enviar el comentario.';
    } finally {
      draft.loading = false;
      this.cdr.detectChanges();
    }
  }
}
