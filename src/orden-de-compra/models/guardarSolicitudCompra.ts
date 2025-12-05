
export interface GuardarSolicitudCompra {

    Autoriza:string;
    ordenTrabajoId:number;
    Destino:string;
    items: { 
        item: string;
        cantidad: number;
        caracteristica: string;
        Observacion: string;
    }[];
}