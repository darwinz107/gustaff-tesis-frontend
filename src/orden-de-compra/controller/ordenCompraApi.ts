import type { ItemsXagregar } from "../../inventario/models/ItemsXagregar";
import type { Stock } from "../../inventario/models/Stock";
import type { DetallesPrevioCompra } from "../models/DetallesPrevioCompra";
import type { FiltrarOrdenTrabajo } from "../models/filtrarOrdenTrabajo";
import type { GuardarSolicitudCompra } from "../models/guardarSolicitudCompra";
import type { InfoOrdenTrabajo } from "../models/infoOrdenTrabajo";
import type { InfoPdfCompra } from "../models/infoPdfCompra";
import type { LllenarDestino } from "../models/llenarDestino";

const route: string = "http://localhost:3000/"

export const filtrarOrdenTrabajo = async (filtrarOrdenTrabajo: FiltrarOrdenTrabajo): Promise<LllenarDestino[]> => {
  
  const response: Response = await fetch(`${route}orden-de-trabajo/filtrar/solicitud-orden`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(filtrarOrdenTrabajo)
  })
    const data = await response.json();
    return data;
};

export const getAllOrdenesTrabajoSinUso = async (): Promise<LllenarDestino[]> => {
  
  const response: Response = await fetch(`${route}orden-de-trabajo/all-ordenes-sin-uso`, {
    method: "GET",
   
  });
    const data = await response.json();
    return data;
};

export const crearOrdenCompra = async (guardarSolicitudCompra: GuardarSolicitudCompra):Promise<{msj:string,validate:boolean}> => {
  
  const response: Response = await fetch(`${route}solicitud-de-compra`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(guardarSolicitudCompra)
  });
    const data = await response.json();
    return data;
};

export const findAllSolicitudesCompra = async (): Promise<DetallesPrevioCompra[]> => {
  const response: Response = await fetch(`${route}solicitud-de-compra/solicitudes-de-compra`, {
    method: "GET"
  });

  const data = await response.json();
  return data;
}


export const ordenCompraById = async (id:number): Promise<InfoPdfCompra> => {
  const response: Response = await fetch(`${route}solicitud-de-compra/solicitud-compra/${id}`, {
    method: "GET"
  });
  const data = await response.json();
  return data;
}

 export const editarSolicitudMaterial = async(id:number,actualizarSolMaterial:GuardarSolicitudCompra):Promise<{msj:string}>=>{
       try {
        const response:Response = await fetch(`${route}solicitud-de-compra/${id}`,{
         method:"PATCH",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(actualizarSolMaterial)
        });

        const data = await response.json();
       return data;
        

    } catch (error) {
        console.log("Error en editarOrdenTrabajoApi:", error);
        return { error: true, msj: "Error en la conexión con el servidor" };
    }
    }

  export const eliminarSolMaterial = async(id:number):Promise<{msj:string}>=>{
    try {
         const response:Response = await fetch(`${route}solicitud-de-compra/${id}`,{
          method:"DELETE"
         });
 
         const data = await response.json();
        return data;
         
 
     } catch (error) {
         console.log("Error en eliminarSolMaterial:", error);
        
     }
     }   

