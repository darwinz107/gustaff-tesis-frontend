
export interface SolicitudOrden{

    NumOrden:string;
    
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
    
    userSolicitante:string|object;
    
    userReceptor:string|object;
    
    userTecnico:string|null; 
}