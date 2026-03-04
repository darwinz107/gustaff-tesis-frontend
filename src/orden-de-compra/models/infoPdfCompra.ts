export interface InfoPdfCompra {
    id: number;
    numOrden: string;
    numOrdenTrabajo: {
        id:number;
        NumOrden: string;
        Area: string;
        Codigo: string;
        Maquina: string;
        DescripcionTrabajo: string | null;
        userSolicitante: {
            name: string;
            cargoId?: {
                name: string;
            };
        };
    };
    fechaRemision: string;
    Autoriza: string;
    usuarioAutoriza?: {
        id: number;
        cargoId?: {
            name: string;
        };
    };
   
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
