import type { Area, AreasResponse } from "../../models/areas.dto";
import type { Bodega } from "../../models/bodegas";
import type { Cargo, Rol } from "../../models/cargos";
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
  console.log("crearUsuario in front", crearUser);  
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

export const crearNuevaMaquina = async (createMaquina: CreateMaquina): Promise<{ msj: string,validate:boolean }> => {
  console.log("crearNuevaMaquina in front", createMaquina);
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

export const getAllCategorias = async (): Promise<{ id:number,nombre: string }[]> => {
  const response: Response = await fetch(`${route}admin/categorias/all`, {
    method: "GET"
  });
  const data = await response.json();
  return data;
}

export const getAllRoles = async (): Promise<Rol[]> => {
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

export const getAllCargos = async (): Promise<Cargo[]> => {
  const response: Response = await fetch(`${route}admin/cargos/all`, {
    method: "GET"
  });
  const data = await response.json();
  return data;
}

export const getAllTiposTrabajo = async (): Promise<{id:number, tipo: string }[]> => {
  const response: Response = await fetch(`${route}admin/all/tipos-trabajo`, {
    method: "GET"
  });
  const data = await response.json();
  return data;
}

export const actualizarUsuario = async (id:number,infoActualizada: object): Promise<{ msj: string ,validate:boolean}> => {
  
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

export const deleteUser = async (id:number): Promise<{ msj:string,validate:boolean }> => {
  const response = await fetch(`${route}admin/user/${id}`, {
    method: "DELETE",
  });

  const data = await response.json();
  return data;
};


export const getAllInfoAreas = async (): Promise<Area[]> => {
 try {
  const response = await fetch(`${route}admin/info/areas`, {
    method: "GET",
  });
  const data = await response.json();
  return data;
  } catch (error) {
    console.error("Error al obtener la información de áreas:", error);
    return [];
  }
}

export const actualizarArea = async (id:number,area: string): Promise<{ msj: string ,validate:boolean}> => {
 try {
  const response: Response = await fetch(`${route}admin/area/edit/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({area})
  });
  const data = await response.json();
  return data;
  } catch (error) {
    console.error("Error al actualizar el área:", error);
    return { msj: "Error al actualizar el área", validate: false };
  }
}

export const eliminarArea = async (id:number): Promise<{ msj:string,validate:boolean }> => {
  const response = await fetch(`${route}admin/area/delete/${id}`, {
    method: "DELETE",
  });
  const data = await response.json();
  return data;
}

export const editarMaquina = async (id:number,area: string,maquina:string, imagen:string): Promise<{ msj: string ,validate:boolean}> => {
  try {
    const response: Response = await fetch(`${route}admin/maquina/edit/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({area,maquina})
    });
    const data = await response.json();
    return data;
    } catch (error) {
      console.error("Error al actualizar la máquina:", error);
      return { msj: "Error al actualizar la máquina", validate: false };
    }
}

export const eliminarMaquina = async (id:number): Promise<{ msj:string,validate:boolean }> => {
  const response = await fetch(`${route}admin/maquina/delete/${id}`, {
    method: "DELETE",
  });
  const data = await response.json();
  return data;
}

export const getAllInfoBodegas = async (): Promise<Bodega[]> => {
 try {
  const response = await fetch(`${route}admin/info/bodegas`, {
    method: "GET",
  });
  const data = await response.json();
  return data;
  } catch (error) {
    console.error("Error al obtener la información de bodegas:", error);
    return [];
  }
}

export const filtrarBodegas = async (filtros:any): Promise<Bodega[]> => {
 try {
  const response = await fetch(`${route}admin/filtrar/bodegas`, {
    method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(filtros)
    });
  const data = await response.json();
  return data;
  } catch (error) {
    console.error("Error al obtener la información de bodegas:", error);
    return [];
  }
}

export const actualizarBodega = async (id:number,bodega: string): Promise<{ msj: string ,validate:boolean}> => {
 try {
  console.log("Actualizar Bodega in front", id, bodega);
  const response: Response = await fetch(`${route}admin/bodega/edit/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({bodega})
  });
  const data = await response.json();
  return data;
  } catch (error) {
    console.error("Error al actualizar la bodega:", error);
    return { msj: "Error al actualizar la bodega", validate: false };
  }
}

export const eliminarBodega = async (id:number): Promise<{ msj:string,validate:boolean }> => {
  const response = await fetch(`${route}admin/bodega/delete/${id}`, {
    method: "DELETE",
  });
  const data = await response.json();
  return data;
}

export const actualizarSeccion = async (id:number,seccion: string, bodega:string): Promise<{ msj: string ,validate:boolean}> => {
  console.log("Actualizar Seccion in front", id, seccion, bodega);
  try {
    const response: Response = await fetch(`${route}admin/seccion/edit/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({seccion,bodega})
    });
    const data = await response.json();
    return data;
    } catch (error) {
      console.error("Error al actualizar la sección:", error);
      return { msj: "Error al actualizar la sección", validate: false };
    }
}
export const eliminarSeccion = async (id:number): Promise<{ msj:string,validate:boolean }> => {
  const response = await fetch(`${route}admin/seccion/delete/${id}`, {
    method: "DELETE",
  });
  const data = await response.json();
  return data;
}
export const actualizarPercha = async (id:number,percha: string, seccion:string): Promise<{ msj: string ,validate:boolean}> => {
  console.log("Actualizar Percha in front", id, percha, seccion);
  try {
    const response: Response = await fetch(`${route}admin/percha/edit/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({percha,seccion})
    });
    const data = await response.json();
    return data;
    }
      catch (error) {
      console.error("Error al actualizar la percha:", error);
      return { msj: "Error al actualizar la percha", validate: false };
    }
}
export const eliminarPercha = async (id:number): Promise<{ msj:string,validate:boolean }> => {
  const response = await fetch(`${route}admin/percha/delete/${id}`, {
    method: "DELETE",
  });
  const data = await response.json();
  return data;
}

export const editarCategoria = async (id:number,categoria: string): Promise<{ msj: string ,validate:boolean}> => {
  try {
    const response: Response = await fetch(`${route}admin/categoria/edit/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({categoria})
    });
    const data = await response.json();
    return data;
    } catch (error) {
      console.error("Error al actualizar la categoría:", error);
      return { msj: "Error al actualizar la categoría", validate: false };
    }
}

export const eliminarCategoria = async (id:number): Promise<{ msj:string,validate:boolean }> => {
  const response = await fetch(`${route}admin/categoria/delete/${id}`, {
    method: "DELETE",
  });
  const data = await response.json();
  return data;
}

export const editarTipoTrabajo = async (id:number,tipo: string): Promise<{ msj: string ,validate:boolean}> => {
  try {
    const response: Response = await fetch(`${route}admin/tipo-trabajo/edit/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({tipo})
    });
    const data = await response.json();
    return data;
    }
      catch (error) {
      console.error("Error al actualizar el tipo de trabajo:", error);
      return { msj: "Error al actualizar el tipo de trabajo", validate: false };
    }
}

export const eliminarTipoTrabajo = async (id:number): Promise<{ msj:string,validate:boolean }> => {
  const response = await fetch(`${route}admin/tipo-trabajo/delete/${id}`, {
    method: "DELETE",
  });
  const data = await response.json();
  return data;
}

export const editarCargo = async (id:number,cargo: string, rol:number): Promise<{ msj: string ,validate:boolean}> => {
  try {
    const response: Response = await fetch(`${route}admin/cargo/edit/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({cargo,rol})
    });
    const data = await response.json();
    return data;
    }
      catch (error) {
      console.error("Error al actualizar el cargo:", error);
      return { msj: "Error al actualizar el cargo", validate: false };
    }
}
export const eliminarCargo = async (id:number): Promise<{ msj:string,validate:boolean }> => {
  const response = await fetch(`${route}admin/cargo/delete/${id}`, {
    method: "DELETE",
  });
  const data = await response.json();
  return data;
}

