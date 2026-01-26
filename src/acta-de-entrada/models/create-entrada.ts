export interface CreateActaEntradaDto {
  proovedor: string;
  recibe:number;
  factura: string;
  total:number;
  itemsSolicitados: {
    id:number|null;
    nombre: string;
    cantidad: number;
    stockMin: number;
    costo: number;
    descuento: number;
    iva: boolean;
    subtotal: number;
    total: number;
    bodegaId: number;
    seccionId: number;
    perchaId: number;
    Observacion: string;
    
  }[];
}