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

export const getAllMaquinasByCod = async (cod:string):Promise<{maquina:string}> =>{
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

    export const registerSolicitudOrden = async(solicitudOrden:SolicitudOrden):Promise<{msj:string}>=>{
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

    
    export const getLastSolicitud = async():Promise<{solicitudOrden:SolicitudOrden}> => {

        const response:Response = await fetch(`${route}orden-de-trabajo/last/solicitud`,{
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