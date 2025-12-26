export interface Percha {
  id: number;
  percha: string;
}

export interface Seccion {
  id: number;
  seccion: string;
  percha: Percha[];
}

export interface Bodega {
  id: number;
  bodega: string;
  seccion: Seccion[];
}

