
export interface SolicitudOrden{

    id:number;
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
    
    userSolicitante:UserSolicitante|null;
    
    userReceptor:UserReceptor|null;
    
    userTecnico:UserTecnico|null; 
    estado:string;
}

interface UserSolicitante {
  name: string;
  cargoId?: {
    name: string;
  };
}

interface UserReceptor {
  name: string;
  cargoId?: {
    name: string;
  };
}

interface UserTecnico {
  name: string;
  cargoId?: {
    name: string;
  };
}
