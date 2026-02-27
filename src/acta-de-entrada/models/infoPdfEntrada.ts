export interface InfoPdfEntrada {
  id:number;
  numActa: string;
  factura:string;
  recibe:recibe;
  proovedor:{
    id:number;
    nombre:string;
    nombreComercial:string;
  };
  numSolicitudCompra: {
    id: number;
    numOrden: string;
    numOrdenTrabajo: {
      id: number;
      NumOrden:string;
      DescripcionTrabajo:string| null;
      userSolicitante: {
        id: number;
        name: string;
      };
    };
   
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

interface recibe{
  id:number;
  name:string;
}