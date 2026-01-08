export interface InfoPdfSalida {
  id: number;
  numActa: string;
  fechaRemision: string;
  observacion?: string | null;
  descripcion?:string | null;

  
  numSolicitudCompra?: {
    id: number;
   numOrden: string;
    numOrdenTrabajo: {
      id: number;
      DescripcionTrabajo: string;
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
     id: number;
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
