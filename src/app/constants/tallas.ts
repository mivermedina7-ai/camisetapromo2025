import { GeneroPedido } from '../models/pedido.model';

export interface MedidaTalla {
  talla: string;
  pecho: string;
  cintura: string;
  largo: string;
}

export interface GrupoTallas {
  genero: GeneroPedido;
  etiqueta: string;
  notas: string;
  tallas: MedidaTalla[];
}

export const GENEROS: Array<{ valor: GeneroPedido; etiqueta: string }> = [
  { valor: 'hombre', etiqueta: 'Hombre' },
  { valor: 'mujer', etiqueta: 'Mujer' }
];

export const GUIA_TALLAS: GrupoTallas[] = [
  {
    genero: 'hombre',
    etiqueta: 'Hombres',
    notas: 'Medidas referenciales para camiseta de hombres.',
    tallas: [
      { talla: 'S', pecho: '92 - 96 cm', cintura: '78 - 84 cm', largo: '66 cm' },
      { talla: 'M', pecho: '97 - 102 cm', cintura: '85 - 90 cm', largo: '69 cm' },
      { talla: 'L', pecho: '103 - 108 cm', cintura: '91 - 98 cm', largo: '72 cm' },
      { talla: 'XL', pecho: '109 - 116 cm', cintura: '99 - 106 cm', largo: '75 cm' },
      { talla: 'XXL', pecho: '117 - 124 cm', cintura: '107 - 114 cm', largo: '78 cm' }
    ]
  },
  {
    genero: 'mujer',
    etiqueta: 'Mujeres',
    notas: 'Medidas referenciales para camiseta de mujeres.',
    tallas: [
      { talla: 'XS', pecho: '80 - 84 cm', cintura: '62 - 66 cm', largo: '58 cm' },
      { talla: 'S', pecho: '85 - 89 cm', cintura: '67 - 71 cm', largo: '60 cm' },
      { talla: 'M', pecho: '90 - 95 cm', cintura: '72 - 77 cm', largo: '62 cm' },
      { talla: 'L', pecho: '96 - 102 cm', cintura: '78 - 84 cm', largo: '64 cm' },
      { talla: 'XL', pecho: '103 - 110 cm', cintura: '85 - 92 cm', largo: '66 cm' },
      { talla: 'XXL', pecho: '111 - 118 cm', cintura: '93 - 100 cm', largo: '68 cm' }
    ]
  }
];
