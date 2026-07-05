import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ComentarioRecuerdo, Recuerdo } from '../../models/recuerdo.model';
import { RecuerdosService } from '../../services/recuerdos.service';
import { censurarTexto } from '../../utils/text-moderation.util';

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

  comentariosRaizDe(recuerdo: Recuerdo): ComentarioRecuerdo[] {
    return this.comentariosDe(recuerdo).filter(comentario => !comentario.parentId);
  }

  respuestasDe(comentario: ComentarioRecuerdo): ComentarioRecuerdo[] {
    if (!comentario.id) {
      return [];
    }

    return (this.comentarios || []).filter(respuesta => respuesta.parentId === comentario.id);
  }

  textoSeguro(texto: string): string {
    return censurarTexto(texto).texto;
  }

  draftPara(recuerdo: Recuerdo, parentId = ''): CommentDraft {
    const key = `${recuerdo.id || recuerdo.fecha}:${parentId || 'raiz'}`;
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

  toggleRespuesta(recuerdo: Recuerdo, comentario: ComentarioRecuerdo): void {
    if (!comentario.id) {
      return;
    }

    const draft = this.draftPara(recuerdo, comentario.id);
    draft.abierto = !draft.abierto;
  }

  async comentar(recuerdo: Recuerdo, parentId = ''): Promise<void> {
    const draft = this.draftPara(recuerdo, parentId);
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
        parentId,
        nombre: draft.nombre,
        mensaje: draft.mensaje
      });
      draft.mensaje = '';
      draft.success = parentId ? 'Respuesta publicada.' : 'Comentario publicado.';
    } catch (error: any) {
      draft.error = error?.message || 'No se pudo enviar el comentario.';
    } finally {
      draft.loading = false;
      this.cdr.detectChanges();
    }
  }
}
