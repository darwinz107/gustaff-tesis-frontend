export interface InfoPdfSalida {
  id: number;
  numActa: string;
  fechaRemision: string;
  destino:string;

  
  numSolicitudCompra?: {
    id: number;
    Destino: string;
    numOrdenTrabajo: {
      id: number;
      userSolicitante: {
        id: number;
        name: string;
      };
    };
  };

  
  recibeSinSM?: {
    id: number;
    name: string;
  };

  entrega: {
    name: string;
  };

  itemSalida: {
    item: string;
    cantidad: number;
    Observacion?: string | null;
    caracteristica?: string;
    inventario: {
      id: number;
      nombre: string;
      costo: number;
    };
  }[];
}
