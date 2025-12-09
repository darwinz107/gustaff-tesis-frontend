export interface AsignarInfoEntrada {
    id: number;
    numOrden: string;
    numOrdenTrabajo: {
       
        NumOrden: string;
        
    };
   
    itemsSolicitados: {
        
        nombre: string;
        cantidad:number;
        stockMin:number;
        costo: number| null;
        descuento:number;
        subtotal:number;
        total:number;
        bodega:string;
        seccion:string;
        percha:string
        Observacion: string;
        iva:boolean;
    }[];
}