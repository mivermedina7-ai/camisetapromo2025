import { Injectable } from '@angular/core';
import { Pedido } from '../models/pedido.model';

@Injectable({
  providedIn: 'root'
})
export class CsvExportService {
  exportarPedidos(pedidos: Pedido[]): void {
    const headers = ['Nombre', 'Genero', 'Talla', 'Numero camiseta', 'Fecha'];
    const rows = pedidos.map(pedido => [
      pedido.nombre,
      pedido.genero || '',
      pedido.talla,
      pedido.numero ?? '',
      pedido.fecha ? new Date(pedido.fecha).toLocaleString('es-PE') : ''
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pedidos-promocion-2025-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }
}
