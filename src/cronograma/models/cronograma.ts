export interface Maquina {
  id: string;
  codigo: string;
  nombre: string;
  area: string;
}

export interface CeldaCronograma {
  maquinaId: string;
  mes: string;
  contenido: string; // MC, MP u otro valor
  estado?: string;
}

export interface CrearCronograma {
  areaId: string;
  maquinaId: string;
  codigoMaquina: string;
  nombreMaquina: string;
  fechaPlanificacion: string;
  tipoMantenimiento: string;
  periodo: string;
  descripcionTrabajo: string;
  tecnico1?: string;
  tecnico2?: string;
  repuestos?: RepuestoCronograma[];
}

export interface RepuestoCronograma {
  itemId: string;
  cantidad: number;
  observacion: string;
}

export interface CronogramaResponse {
  id: string;
  maquina: Maquina;
  fechaPlanificacion: string;
  tipoMantenimiento: string;
  periodo: string;
  descripcionTrabajo: string;
  estado: string;
  tecnico1?: string;
  tecnico2?: string;
  repuestos: RepuestoCronograma[];
  fechaCreacion: string;
}
