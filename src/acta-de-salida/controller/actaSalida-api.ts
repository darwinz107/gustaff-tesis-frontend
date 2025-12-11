import type { InfoPdfSalida } from "../models/InfoPdfSalida";

const route = "http://localhost:3000/";

  export const createActaSalidaApi = async(id:number):Promise<{msj:string, validate:boolean}> => {
    
            const response:Response = await fetch(`${route}inventario/acta-salida/${id}`,{
           method:"GET"
            });
            const data = await response.json();
            return data;
        }

  export const actaDeSalidaByIdCompra = async(id:number):Promise<InfoPdfSalida> => {
    
            const response:Response = await fetch(`${route}inventario/acta-salida-by/${id}`,{
           method:"GET"
            });
            const data = await response.json();
            return data;
        } 

        

    export const findAllRegistroSalida = async():Promise<InfoPdfSalida[]> => {
    
            const response:Response = await fetch(`${route}inventario/actas-salidas`,{
           method:"GET"
            });
            const data = await response.json();
            return data;
        }       