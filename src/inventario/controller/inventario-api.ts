import type { CreateItemsSolicitados } from "../models/createItemsSolocitados";

const route = "http://localhost:3000/";

  export const filtrarInventario = async(item:string):Promise<{nombre:string}[]>=>{
        const response:Response = await fetch(`${route}inventario/filtrar`,{
         method:"POST",
         headers:{
         "Content-Type":"application/json"
         },
         body:JSON.stringify({item:item})
        });

        const data = await response.json();
        return data;
    }

   export const createItemsSolicitados = async(createItems:CreateItemsSolicitados):Promise<{msj:string}>=>{
        const response:Response = await fetch(`${route}inventario/items-solicitados`,{
         method:"POST",
         headers:{
         "Content-Type":"application/json"
         },
         body:JSON.stringify(createItems)
        });
        const data = await response.json();
        return data;
    }  