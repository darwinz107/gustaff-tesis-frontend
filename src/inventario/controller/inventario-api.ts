import type { AsignarInfoEntrada } from "../models/AsignarInfoEntrada";
import type { CreateItemsSolicitados } from "../models/createItemsSolocitados";
import type { Inventarios } from "../models/inventarios";
import type { ItemsXagregar } from "../models/ItemsXagregar";
import type { Stock } from "../models/Stock";

const route = "http://localhost:3000/";

  export const filtrarInventario = async(item:string):Promise<Inventarios[]>=>{
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

   /*export const createItemsSolicitados = async(createItems:CreateItemsSolicitados):Promise<{msj:string}>=>{
        const response:Response = await fetch(`${route}inventario/items-solicitados`,{
         method:"POST",
         headers:{
         "Content-Type":"application/json"
         },
         body:JSON.stringify(createItems)
        });
        const data = await response.json();
        return data;
    }  */

    export const getInventario = async():Promise<Inventarios[]> => {
    
            const response:Response = await fetch(`${route}inventario`,{
           method:"GET"
            });
            const data = await response.json();
            return data;
        }

        export const evaluarStock = async (stock: Stock): Promise<ItemsXagregar[]> => {
  
  const response: Response = await fetch(`${route}inventario/evaluar-stock`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(stock)
  })
    const data = await response.json();
    return data;
};

  export const asignarInfoActaEntrada = async(id:number):Promise<AsignarInfoEntrada[]> => {
    
            const response:Response = await fetch(`${route}inventario/info-entrada/${id}`,{
           method:"GET"
            });
            const data = await response.json();
            return data;
        }