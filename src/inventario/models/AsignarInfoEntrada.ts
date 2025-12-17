export interface AsignarInfoEntrada {
    id: number;
    numOrden: string;
    numOrdenTrabajo: {
       
        NumOrden: string;
        
    };
   
    itemsSolicitados: {
        //id:number|null;
        nombre: string;
        cantidad:number;
        stockMin:number;
        costo: number| null;
        descuento:number;
        subtotal:number;
        total:number;
        bodegaId:number;
        seccionId:number;
        perchaId:number
        Observacion: string;
        iva:boolean;
    }[];
}