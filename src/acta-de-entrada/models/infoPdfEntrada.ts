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
  itemEntrada: {
    item :{
      nombre:string;
    };
    cantidad: number;
    costo:number;
    descuento:number;
    iva:boolean;
    subtotal:number;
    total:number;
  }[];
  fechaRemision: string;
  total:number;
}