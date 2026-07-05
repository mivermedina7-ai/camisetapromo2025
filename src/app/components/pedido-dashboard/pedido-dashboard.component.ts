import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Pedido } from '../../models/pedido.model';

interface StatItem {
  label: string;
  value: number;
}

@Component({
  selector: 'app-pedido-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pedido-dashboard.component.html',
  styleUrl: './pedido-dashboard.component.css'
})
export class PedidoDashboardComponent {
  @Input() pedidos: Pedido[] | null = [];

  get total(): number {
    return this.items.length;
  }

  get porGenero(): StatItem[] {
    return this.contarPor('genero', 'Sin género');
  }

  get porTalla(): StatItem[] {
    return this.contarPor('talla', 'Sin talla');
  }

  private get items(): Pedido[] {
    return this.pedidos || [];
  }

  private contarPor(campo: keyof Pedido, fallback: string): StatItem[] {
    const map = new Map<string, number>();

    for (const pedido of this.items) {
      const label = String(pedido[campo] || fallback);
      map.set(label, (map.get(label) || 0) + 1);
    }

    return [...map.entries()]
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label));
  }
}
