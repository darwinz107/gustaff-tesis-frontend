
export interface UpdateItemSolicitadoDto {
  id: number;
  cantidad?: number;
  caracteristica?: string;
  Observacion?: string;
  item?: string;
}

export interface ActualizarOrdenMaterial {
  Autoriza: string;
  ordenTrabajoId: string;
  estadoCompra: string;
  itemsSolicitados?: UpdateItemSolicitadoDto[];
}