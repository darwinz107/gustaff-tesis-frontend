export interface DetallesPrevioCompra {
    id: number;
    numOrden: string;
    fechaRemision: string;
    Autoriza: string;
    Destino: string;
    numOrdenTrabajo: {
           NumOrden: string;
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
