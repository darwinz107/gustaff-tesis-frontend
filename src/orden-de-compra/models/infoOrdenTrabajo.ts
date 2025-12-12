
export interface InfoOrdenTrabajo{

    id:number;
    
    fechaInicio:string;
    
    fechaFinal:string;
    
    HoraInicio:string;
    
    HoraFinal:string;
    
    Area:string;
    
    Codigo:string;
    
    Maquina:string;
    
    EspecificacionMaquina:string|null;
    
    Categoria:string;
    
    TipoTrabajo:string;
    
    DescripcionTrabajo:string|null;
    
    userSolicitante:string;
    
    userReceptor:string;
    
    userTecnico:string|null; 
}