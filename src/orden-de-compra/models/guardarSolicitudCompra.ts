
export interface GuardarSolicitudCompra {

    Autoriza:string;
    ordenTrabajoId:number;
    items: { 
        item: string;
        cantidad: number;
        caracteristica: string;
        Observacion: string;
    }[];
}