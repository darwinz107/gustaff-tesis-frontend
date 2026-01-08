import type { FiltrarActaSalidaDto } from "../models/filtrarActaSalida";
import type { InfoPdfSalida } from "../models/InfoPdfSalida";

const route = "http://localhost:3000/";

  export const createActaSalidaApi = async(id:number,entregaId:number,observacion:string,recibe:number):Promise<{msj:string, validate:boolean}> => {
    try {
          const response:Response = await fetch(`${route}inventario/acta-salida/${id}`,{
           method:"POST",
            headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({entregaId,observacion,recibe})
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
      console.log(info);
          const response:Response = await fetch(`${route}inventario/acta-salida/sin-orden/crear`,{
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

    export const findRegistroSalidaById = async(id:number):Promise<InfoPdfSalida> => {
    
            const response:Response = await fetch(`${route}inventario/actas-salidas-by/${id}`,{
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

export const updateActaSalida = async (id: number, updateData: { entregaId?: number; observacion?: string; recibeSinSMId?: number; /*solicitanteId?: number;*/ descripcion?: string }): Promise<{ msj: string; validate: boolean }> => {
  try {
    console.log("updateData:", updateData); 
    const response: Response = await fetch(`${route}inventario/acta-salida/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updateData)
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("updateActaSalida error:", error);
    throw error;
  }
};

export const deleteActaSalida = async (id: number): Promise<{ msj: string; validate: boolean }> => {
  try {
    const response: Response = await fetch(`${route}inventario/acta-salida/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("deleteActaSalida error:", error);
    throw error;
  }
};