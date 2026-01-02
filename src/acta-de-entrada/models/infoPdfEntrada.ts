export interface InfoPdfEntrada {
  id:number;
  numActa: string;
  factura:string;
  proovedor:{
    id:number;
    nombre:string;
  };
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