export interface Maquina {
  id: number;
  nombre: string;
}

export interface Codigo {
  id: number;
  cod: string;
  maquina: Maquina[];
}

export interface Area {
  id: number;
  nombre: string;
  codigo: Codigo[];
}

export type AreasResponse = Area[];
