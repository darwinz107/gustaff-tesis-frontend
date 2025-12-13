export interface InfoPdfSalida {
  numActa: string;
  numSolicitudCompra: {
    id: number;
    numOrdenTrabajo: {
      id: number;
      userSolicitante: {
        id: number;
        name: string;
      };
    };
    Destino: string;
  };
  itemSalida: {
    item: string;
    cantidad: number;
    Observacion: string | null;
    inventario: {
                id: number;
                nombre:string ;
                costo:number;
            }
  }[];
  fechaRemision: string;
  entrega: {
    name:string;
  };
}
