export interface DetallesPrevioCompra {
    id: number;
    numOrden: string;
    fechaRemision: string;
    Autoriza: string;
   
    numOrdenTrabajo: {
        id:number;
           NumOrden: string;
           DescripcionTrabajo:string| null;
        Area: string;
        Codigo: string;
        Maquina: string;
            userSolicitante: {
                name: string;
            }
        }
    estadoCompra: {
        id: number;
        estado: string;
    };
}
