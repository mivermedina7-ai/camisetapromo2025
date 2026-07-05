import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DISCIPLINAS_DEPORTIVAS } from '../../constants/disciplinas';
import { PartidoListComponent } from '../../components/partido-list/partido-list.component';
import { DisciplinaId, InscripcionDeportiva } from '../../models/partido.model';
import { PartidosService } from '../../services/partidos.service';

@Component({
  selector: 'app-partidos-page',
  standalone: true,
  imports: [CommonModule, FormsModule, PartidoListComponent],
  templateUrl: './partidos.page.html',
  styleUrl: './partidos.page.css'
})
export class PartidosPageComponent {
  private readonly partidosService = inject(PartidosService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly disciplinas = DISCIPLINAS_DEPORTIVAS;
  readonly partidos$ = this.partidosService.obtenerPartidos();
  readonly inscripciones$ = this.partidosService.obtenerInscripcionesDeportivas();

  form = {
    nombre: '',
    disciplinas: [] as DisciplinaId[]
  };
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  estaSeleccionada(id: DisciplinaId): boolean {
    return this.form.disciplinas.includes(id);
  }

  toggleDisciplina(id: DisciplinaId): void {
    this.form.disciplinas = this.estaSeleccionada(id)
      ? this.form.disciplinas.filter(item => item !== id)
      : [...this.form.disciplinas, id];
  }

  inscritosPor(inscripciones: InscripcionDeportiva[] | null, id: DisciplinaId): InscripcionDeportiva[] {
    return (inscripciones || []).filter(inscripcion => inscripcion.disciplinas.includes(id));
  }

  async registrar(): Promise<void> {
    this.successMessage = '';
    this.errorMessage = '';

    if (!this.form.nombre.trim()) {
      this.errorMessage = 'Ingresa tu nombre.';
      return;
    }

    if (this.form.disciplinas.length === 0) {
      this.errorMessage = 'Elige al menos una disciplina.';
      return;
    }

    this.isLoading = true;

    try {
      await this.partidosService.registrarJugador({
        nombre: this.form.nombre,
        disciplinas: this.form.disciplinas
      });
      this.form = { nombre: '', disciplinas: [] };
      this.successMessage = 'Inscripcion deportiva guardada.';
    } catch (error: any) {
      this.errorMessage = error?.message || 'No se pudo guardar tu inscripcion.';
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }
}
