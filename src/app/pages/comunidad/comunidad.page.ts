import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { combineLatest, map } from 'rxjs';
import { RecuerdoFormComponent } from '../../components/recuerdo-form/recuerdo-form.component';
import { RecuerdoGalleryComponent } from '../../components/recuerdo-gallery/recuerdo-gallery.component';
import { RecuerdosService } from '../../services/recuerdos.service';

@Component({
  selector: 'app-comunidad-page',
  standalone: true,
  imports: [CommonModule, RecuerdoFormComponent, RecuerdoGalleryComponent],
  templateUrl: './comunidad.page.html',
  styleUrl: './comunidad.page.css'
})
export class ComunidadPageComponent {
  private readonly recuerdosService = inject(RecuerdosService);

  readonly recuerdos$ = this.recuerdosService.obtenerAprobados();
  readonly comentarios$ = this.recuerdosService.obtenerComentariosPublicos();
  readonly resumen$ = combineLatest([this.recuerdos$, this.comentarios$]).pipe(
    map(([recuerdos, comentarios]) => ({
      recuerdos: recuerdos.length,
      destacados: recuerdos.filter(recuerdo => recuerdo.estado === 'destacado').length,
      comentarios: comentarios.length
    }))
  );
}
