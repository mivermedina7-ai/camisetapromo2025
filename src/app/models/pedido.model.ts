export type GeneroPedido = 'hombre' | 'mujer';

export interface Pedido {
  id?: string;
  nombre: string;
  numero: number | null;
  talla: string;
  genero?: GeneroPedido;
  fecha?: string;
}

export interface PedidoRegistro {
  nombre: string;
  numero: number | null;
  talla: string;
  genero: GeneroPedido;
}
