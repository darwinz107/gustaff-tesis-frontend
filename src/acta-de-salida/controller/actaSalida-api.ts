import type { FiltrarActaSalidaDto } from "../models/filtrarActaSalida";
import type { InfoPdfSalida } from "../models/InfoPdfSalida";

const route = "http://localhost:3000/";

  export const createActaSalidaApi = async(id:number,entregaId:number,observacion:string):Promise<{msj:string, validate:boolean}> => {
    try {
          const response:Response = await fetch(`${route}inventario/acta-salida/${id}`,{
           method:"POST",
            headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({entregaId,observacion})
            });
            const data = await response.json();
            return data;
        }

     catch (error) {
      console.error(error);
    }
  }  

  
  export const createActaSalidaSinOrdenApi = async(info:any):Promise<{msj:string, validate:boolean}| undefined> => {
    try {
          const response:Response = await fetch(`${route}inventario/acta-salida/sin-orden`,{
           method:"POST",
            headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(info)
            });
            const data = await response.json();
            return data;
        }

     catch (error) {
      console.error(error);
    }
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
        
     export const filtrarActasSalida = async (filtros: FiltrarActaSalidaDto): Promise<InfoPdfSalida[]> => {
  try {
    const response: Response = await fetch(`${route}inventario/actas-salidas/filter`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(filtros)
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("filtrarActasSalida error:", error);
    return [];
  }
};