import type { CrearArea } from "../../models/create-area";
import type { CreateBodega } from "../../models/create-bodega";
import type { CreateCargo } from "../../models/create-cargo";
import type { CrearCategoria } from "../../models/create-categoria";
import type { CreateMaquina } from "../../models/create-maquina";
import type { CreatePercha } from "../../models/create-percha";
import type { CreateSeccion } from "../../models/create-seccion";
import type { CreateTipoTrabajo } from "../../models/create-tipo-trabajo";
import type { CrearUser } from "../../models/create-user";

const route: string = "http://localhost:3000/"

export const crearUsuario = async (crearUser: CrearUser): Promise<{ msj: string ,validate:boolean}> => {
  
  const response: Response = await fetch(`${route}admin/create/user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(crearUser)
  });

  const data = await response.json();
  return data;
}


export const getAllAreas = async (): Promise<{ area: string }[]> => {
  const response: Response = await fetch(`${route}admin`, {
    method: "GET"
  });

  const data = await response.json();
  return data;
}

export const crearNuevaArea = async (crearArea: CrearArea): Promise<{ msj: string }> => {
  console.log("crearNuevaArea in front", crearArea);
  const response: Response = await fetch(`${route}admin/create/area`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(crearArea)
  });

  const data = await response.json();
  return data;
}

export const crearNuevaMaquina = async (createMaquina: CreateMaquina): Promise<{ msj: string }> => {
  const response: Response = await fetch(`${route}admin/create/maquina`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(createMaquina)
  }
  );

  const data = await response.json();
  return data;
}

export const crearCategoria = async (crearCategoria: CrearCategoria): Promise<{ msj: string }> => {

  const response: Response = await fetch(`${route}admin/create/categoria`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(crearCategoria)
  }
  );
  const data = await response.json();
  return data;
}

export const getAllCategorias = async (): Promise<{ nombre: string }[]> => {
  const response: Response = await fetch(`${route}admin/categorias/all`, {
    method: "GET"
  });
  const data = await response.json();
  return data;
}

export const getAllRoles = async (): Promise<{ id:number,rol: string}[]> => {
  const response: Response = await fetch(`${route}admin/roles/all`, {
    method: "GET"
  });
  const data = await response.json();
  return data;
}

export const logoutSession = async (): Promise<{ msj: string }> => {

  const response: Response = await fetch(`${route}logout/token`, {
    method: "GET",
    credentials: 'include'
  });

  const data = await response.json();
  return data;
}

export const newTipoTrabajo = async (createTipoTrabajo:CreateTipoTrabajo): Promise<{ msj: string }> => {

  const response:Response = await fetch(`${route}admin/create/tipoTrabajo`,{
   method:"POST",
   headers:{
    "Content-Type": "application/json"
   },
   body:JSON.stringify(createTipoTrabajo)
  });

  const data = await response.json();
  return data;
}

export const crearCargo = async (createCargo: CreateCargo): Promise<{ msj: string }> => {
  
  const response: Response = await fetch(`${route}admin/create/cargo`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(createCargo)
  });

  const data = await response.json();
  return data;
}

export const getAllCargos = async (): Promise<{ id:number,name: string}[]> => {
  const response: Response = await fetch(`${route}admin/cargos/all`, {
    method: "GET"
  });
  const data = await response.json();
  return data;
}


export const actualizarUsuario = async (id:number,infoActualizada: object): Promise<{ msj: string }> => {
  
  const response: Response = await fetch(`${route}admin/user/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(infoActualizada)
  });

  const data = await response.json();
  return data;
}

export const crearBodega = async (
  createBodega: CreateBodega
): Promise<{ ok: boolean; message: string }> => {

  const response: Response = await fetch(`${route}admin/bodega`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(createBodega)
  });

  const data = await response.json();
  return data;
};

export const crearSeccion = async (
  createSeccion: CreateSeccion
): Promise<{ ok: boolean; message: string }> => {

  const response: Response = await fetch(`${route}admin/seccion`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(createSeccion)
  });

  const data = await response.json();
  return data;
};

export const crearPercha = async (
  createPercha: CreatePercha
): Promise<{ ok: boolean; message: string }> => {

  const response: Response = await fetch(`${route}admin/percha`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(createPercha)
  });

  const data = await response.json();
  return data;
};

export const getAllSecciones = async (): Promise<{ id: number; seccion: string }[]> => {
  const response = await fetch(`${route}admin/secciones/all`, {
    method: "GET",
  });

  const data = await response.json();
  return data;
};

export const getAllBodegas = async (): Promise<{ id: number; bodega: string }[]> => {
  const response = await fetch(`${route}admin/bodegas`, {
    method: "GET",
  });

  const data = await response.json();
  return data;
};


