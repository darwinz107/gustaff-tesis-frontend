import type { Estado } from "../../../orden-de-compra/models/Estados";
import type { OrdenTrabajo } from "../../models/jornadasFases";
import type { OrdenesTrabajo } from "../../models/ordenesTrabajo";
import type { SolicitudOrden } from "../../models/solicitudOrden";

const route = import.meta.env.VITE_API_URL || "http://localhost:3000/";


export const areas = async ():Promise<{nombre:string}> => {
    const res = await fetch(`${route}admin`,{
        method: 'GET',
    });
    const data = await res.json();
    return data;
}

export const getAllCodByArea = async (area:string):Promise<{cod:string}[]> => {

    console.log("getAllCodByArea in front",area);
    const res = await fetch(`${route}admin/all/codigos`,{
        method: 'POST',
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({area})
    });
    const data = await res.json();
    return data;
}

export const getAllMaquinasByCod = async (cod:string):Promise<{nombre:string}[]> =>{
    const res = await fetch(`${route}admin/all/maquinas`,{
        method: 'POST',
        headers:{
            "Content-Type":"application/json"
},
        body:JSON.stringify({codigo:cod})            
});
    const data = await res.json();
    return data;
}


   export const getAllCategorias = async():Promise<{nombre:string}[]>=>{
      const response:Response = await fetch(`${route}admin/categorias/all`,{
        method:"GET"
      });
      const data = await response.json();
      return data;
    }

    export const getAllTipoTrabajo = async ():Promise<{tipo:string}[]> => {
         
        const response:Response = await fetch(`${route}admin/all/tipo-trabajo`,{
           method:"GET"
        });

        const data = await response.json();
        return data;
    }

    export const registerSolicitudOrden = async(solicitudOrden:SolicitudOrden):Promise<{msj:string,validate:boolean}>=>{
      try {
        console.log(solicitudOrden);
        const response:Response = await fetch(`${route}orden-de-trabajo/create/solicitud-orden`,{
         method:"POST",
         headers:{
         "Content-Type":"application/json"
         },
         body:JSON.stringify(solicitudOrden)
        });

        const data = await response.json();
        return data;
      } catch (error) {
        console.error(error);
      }  
    }

    
    export const getLastSolicitud = async(id:number|undefined):Promise<SolicitudOrden> => {

        const response:Response = await fetch(`${route}orden-de-trabajo/last/solicitud/${id}`,{
       method:"GET"
        });

        const data = await response.json();
        return data;
    }
    
    export const getAllOrdenesTrabajo = async():Promise<OrdenesTrabajo[]> => {

        const response:Response = await fetch(`${route}orden-de-trabajo/all-ordenes`,{
       method:"GET"
        });

        const data = await response.json();
        return data;
    }

    export const allOrdenTrabajoNumOrden = async():Promise<{NumOrden:string}[]> => {

        const response:Response = await fetch(`${route}orden-de-trabajo/all-ordenes-numOrden`,{
       method:"GET"
        });

        const data = await response.json();
        return data;
    }

    export const getOrdenTrabajoBySolicitante = async(solicitante:string):Promise<OrdenesTrabajo[]> => {

        try {
             const response:Response = await fetch(`${route}orden-de-trabajo/orden-by-solicitante`,{
         method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({solicitante})
        });
        const data = await response.json();
        return data; 
        } catch (error) {
            console.log('getOrdenTrabajoBySolicitante error: ',error);
        }
      
    }

    export const getOrdenTrabajoById = async(id:number):Promise<OrdenesTrabajo> => {

        const response:Response = await fetch(`${route}orden-de-trabajo/orden-by-id/${id}`,{
       method:"GET"
        });
        const data = await response.json();
        return data;
    }

    export const editarOrdenTrabajoApi = async(id:number,ordenTrabajo:SolicitudOrden):Promise<{msj:string,validate:boolean}>=>{
       try {
        const response:Response = await fetch(`${route}orden-de-trabajo/${id}`,{
         method:"PATCH",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(ordenTrabajo)
        });

        const data = await response.json();
       return data;
        

    } catch (error) {
        console.log("Error en editarOrdenTrabajoApi:", error);
        return { error: true, msj: "Error en la conexión con el servidor" };
    }
    }

    export const eliminarOrdenTrabajo = async(id:number, motivo:string):Promise<{msj:string}>=>{
   try {
        const response:Response = await fetch(`${route}orden-de-trabajo/${id}`,{
         method:"DELETE",
         headers: {
           "Content-Type": "application/json"
         },
         body: JSON.stringify({ motivo })
        });

        const data = await response.json();
       return data;
        

    } catch (error) {
        console.log("Error en eliminarOrdenTrabajo:", error);
        return { error: true, msj: "Error en la conexión con el servidor" };
    }
    }

     export const getEstados = async():Promise<Estado[]> => {

        const response:Response = await fetch(`${route}orden-de-trabajo/estados`,{
       method:"GET"
        });
        const data = await response.json();
        return data;
    }

    export const filtrarOrdenes = async (filtros: any): Promise<OrdenesTrabajo[]> => {
  try {
    const response: Response = await fetch(`${route}orden-de-trabajo/filter`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(filtros)
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('filtrarOrdenes error:', error);
  }};

  export const getFasesByOrdenTrabajo = async (id:number):Promise<{}[]> => {
  try{
    const response:Response = await fetch(`${route}orden-de-trabajo/fases-by-orden-trabajo/${id}`,{
    method:"GET"
    });
    const data = await response.json();
    return data;
} catch(error){
    console.log("getFasesByOrdenTrabajo error:",error);
    return [];

}
    }


      export const actualizarFases = async () => {
  try{
    const response:Response = await fetch(`${route}orden-de-trabajo/actualizar/fases`,{
    method:"GET"
    });
    
} catch(error){
    console.log("actualizarFases error:",error);
    return [];

}
    }

    export const getPromedioFasesByOrdenTrabajo = async (id:number):Promise<number> => {
  try{
    const response:Response = await fetch(`${route}orden-de-trabajo/promedio-tiempo-fases/${id}`,{
    method:"GET"
    });
    const data = await response.json();
    return data;
}
    catch(error){
    console.log("getPromedioFasesByOrdenTrabajo error:",error);
    return 0;
}
    }

    export const faseCompletada = async (id:number,descripcion:string):Promise<{msj:string}> => {
  try{
    const response:Response = await fetch(`${route}orden-de-trabajo/update-fase-completa/${id}`,{
    method:"PATCH",
    headers:{
        "Content-Type":"application/json"
    },
    body:JSON.stringify({descripcion})
    });
    const data = await response.json();
    return data;
}
    catch(error){
    console.log("faseCompletada error:",error);
    return {msj:"Error en la conexión con el servidor"};
}
    }
 
        export const getAllJornadas = async ():Promise<OrdenTrabajo[]> => {
  try{
    const response:Response = await fetch(`${route}orden-de-trabajo/all/jornadas`,{
    method:"GET"
    });
    const data = await response.json();
    return data;
}
    catch(error){
    console.log("getAllJornadas error:",error);
    return [];
}
    }

       export const filtrarFases = async (filtros: any): Promise<OrdenesTrabajo[]> => {
        
  try {
    const response: Response = await fetch(`${route}orden-de-trabajo/filter/fases`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(filtros)
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('filtrarFases error:', error);
  }};