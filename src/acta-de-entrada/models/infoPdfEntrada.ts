export interface InfoPdfEntrada {
  numActa: string;
  factura:string;
  proovedor:string;
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