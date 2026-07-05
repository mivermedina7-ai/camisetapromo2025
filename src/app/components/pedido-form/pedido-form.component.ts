import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CORTES_CAMISETA, GENEROS, GUIA_TALLAS, MedidaTalla } from '../../constants/tallas';
import { CorteCamiseta, GeneroPedido, PedidoRegistro } from '../../models/pedido.model';
import { PedidosService } from '../../services/pedidos.service';

@Component({
  selector: 'app-pedido-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pedido-form.component.html',
  styleUrl: './pedido-form.component.css'
})
export class PedidoFormComponent {
  @Output() pedidoCreado = new EventEmitter<void>();

  private readonly pedidosService = inject(PedidosService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly generos = GENEROS;
  readonly cortes = CORTES_CAMISETA;

  form: PedidoRegistro = this.crearFormulario();
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  get tallasDisponibles(): MedidaTalla[] {
    return GUIA_TALLAS.find(grupo => grupo.genero === this.form.genero)?.tallas || [];
  }

  get medidaSeleccionada(): MedidaTalla | undefined {
    return this.tallasDisponibles.find(item => item.talla === this.form.talla);
  }

  seleccionarGenero(genero: GeneroPedido): void {
    this.form.genero = genero;
    this.form.talla = this.tallasDisponibles[0]?.talla || '';
  }

  seleccionarCorte(corte: CorteCamiseta): void {
    this.form.corte = corte;
  }

  async registrar(): Promise<void> {
    this.successMessage = '';
    this.errorMessage = '';

    if (!this.form.nombre.trim() || !this.form.numero || !this.form.talla) {
      this.errorMessage = 'Completa nombre, número y talla.';
      return;
    }

    if (this.form.numero < 1 || this.form.numero > 99) {
      this.errorMessage = 'El número de camiseta debe estar entre 1 y 99.';
      return;
    }

    this.isLoading = true;

    try {
      const numeroOcupadoEnGenero = await this.withTimeout(
        this.pedidosService.verificarNumeroEnGenero(this.form.numero, this.form.genero),
        'La conexión está tardando demasiado al validar el número.'
      );

      if (numeroOcupadoEnGenero) {
        const etiqueta = this.form.genero === 'mujer' ? 'damas' : 'caballeros';
        const existente = await this.withTimeout(
          this.pedidosService.obtenerPedidoPorNumeroYGenero(this.form.numero, this.form.genero),
          'La conexión está tardando demasiado al consultar el registro existente.'
        );
        const suNombre = existente?.nombre?.trim();
        this.errorMessage = suNombre
          ? `El número ${this.form.numero} ya está registrado en ${etiqueta} por ${suNombre}. Puedes repetirlo en la otra categoría.`
          : `El número ${this.form.numero} ya está registrado en ${etiqueta}. Puedes repetirlo en la otra categoría.`;
        return;
      }

      await this.withTimeout(
        this.pedidosService.agregarPedido(this.form),
        'La conexión está tardando demasiado al guardar el registro.'
      );
      this.successMessage = 'Registro guardado correctamente.';
      this.form = this.crearFormulario();
      this.pedidoCreado.emit();
    } catch (error: any) {
      this.errorMessage = error?.message || 'No se pudo guardar el registro.';
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  private crearFormulario(): PedidoRegistro {
    return {
      nombre: '',
      numero: null,
      genero: 'hombre',
      corte: 'clasico',
      talla: 'M',
      telefono: '',
      notas: ''
    };
  }

  private withTimeout<T>(promise: Promise<T>, message: string): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(message)), 15000);
      promise
        .then(value => resolve(value))
        .catch(error => reject(error))
        .finally(() => clearTimeout(timer));
    });
  }
}
