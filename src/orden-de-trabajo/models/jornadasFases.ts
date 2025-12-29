
export interface OrdenTrabajo{
    id:number;
    NumOrden:string;
    jornadas:Jornadas[]
}

export interface Jornadas{
id:number;
fecha:string;
fases:Fases[]
}

export interface Fases{
    id: number;
    hora: string;
    completo: boolean;
    descripcion: string | null;
    agotado: boolean;
}