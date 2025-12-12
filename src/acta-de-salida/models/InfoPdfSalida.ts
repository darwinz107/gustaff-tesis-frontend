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
  }[];
  fechaRemision: string;
  entrega: string | null;
}
