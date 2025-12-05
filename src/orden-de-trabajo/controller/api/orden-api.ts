import type { Estado } from "../../../orden-de-compra/models/Estados";
import type { OrdenesTrabajo } from "../../models/ordenesTrabajo";
import type { SolicitudOrden } from "../../models/solicitudOrden";

const route = "http://localhost:3000/";


export const areas = async ():Promise<{nombre:string}> => {
    const res = await fetch(`${route}admin`,{
        method: 'GET',
    });
    const data = await res.json();
    return data;
}

export const getAllCodByArea = async (area:string):Promise<{cod:string}> => {

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

export const getAllMaquinasByCod = async (cod:string):Promise<{nombre:string}> =>{
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
        const response:Response = await fetch(`${route}orden-de-trabajo/create/solicitud-orden`,{
         method:"POST",
         headers:{
         "Content-Type":"application/json"
         },
         body:JSON.stringify(solicitudOrden)
        });

        const data = await response.json();
        return data;
    }

    
    export const getLastSolicitud = async(id:number):Promise<{solicitudOrden:SolicitudOrden}> => {

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

    export const getOrdenTrabajoBySolicitante = async(solicitante:string):Promise<OrdenesTrabajo[]> => {

        const response:Response = await fetch(`${route}orden-de-trabajo/orden-by-solicitante`,{
         method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({solicitante})
        });
        const data = await response.json();
        return data;
    }

    export const getOrdenTrabajoById = async(id:number):Promise<OrdenesTrabajo> => {

        const response:Response = await fetch(`${route}orden-de-trabajo/orden-by-id/${id}`,{
       method:"GET"
        });
        const data = await response.json();
        return data;
    }

    export const editarOrdenTrabajoApi = async(id:number,ordenTrabajo:SolicitudOrden):Promise<{msj:string}>=>{
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

    export const eliminarOrdenTrabajo = async(id:number):Promise<{msj:string}>=>{
   try {
        const response:Response = await fetch(`${route}orden-de-trabajo/${id}`,{
         method:"DELETE"
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