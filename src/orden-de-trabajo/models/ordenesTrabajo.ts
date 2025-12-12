export interface OrdenesTrabajo {
  id:number;
  NumOrden: string;
  fechaInicio: string;
  fechaFinal: string;
  HoraInicio: string;
  HoraFinal: string;
  Area: string;
  Codigo: string;
  Maquina: string;
  EspecificacionMaquina:string | null;
  Categoria: string;
  TipoTrabajo: string;
  DescripcionTrabajo: string | null;

  userSolicitante: {
    name: string;
  };

  userReceptor: {
    name: string;
  };

  userTecnico: {
    name: string;
  } | null;

  estadoTrabajo: {
    estado: string;
  };
}
