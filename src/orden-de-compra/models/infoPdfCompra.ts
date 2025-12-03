export interface InfoPdfCompra {
    id: number;
    numOrden: string;
    numOrdenTrabajo: {
        NumOrden: string;
        Area: string;
        Codigo: string;
        Maquina: string;
        DescripcionTrabajo: string | null;
        userSolicitante: {
            name: string;
        };
    };
    fechaRemision: string;
    Autoriza: string;
    Destino: string;
    itemSolicitados: {
        id: number;
        item: string;
        cantidad: number;
        caracteristica: string;
        Observacion: string;
        existencia:boolean
    }[];
    estadoCompra: {
        id: number;
        estado: string;
    };
}
