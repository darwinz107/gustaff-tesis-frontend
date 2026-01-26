import type { AsignarInfoEntrada } from "../../inventario/models/AsignarInfoEntrada";
import type { CreateActaEntradaDto } from "../models/create-entrada";
import type { CreateProovedor } from "../models/create-proovedor";
import type { FiltrarActaEntradaDto } from "../models/filtrarActaEntrada";
import type { InfoPdfEntrada } from "../models/infoPdfEntrada";

const route = import.meta.env.VITE_API_URL || "http://localhost:3000/";


        export const createActaEntrada = async (id:number,createActaEntradaDto:CreateActaEntradaDto): Promise<{msj:string, validate:boolean}> => {
  console.log(createActaEntradaDto);
  const response: Response = await fetch(`${route}inventario/acta-entrada/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(createActaEntradaDto)
  })
    const data = await response.json();
    return data;
};

  export const findAllRegistroEntrada = async():Promise<InfoPdfEntrada[]> => {
    
            const response:Response = await fetch(`${route}inventario/actas-entradas`,{
           method:"GET"
            });
            const data = await response.json();
            return data;
        }     

    export const findRegistroEntradaById = async(id:number):Promise<InfoPdfEntrada> => {
    
            const response:Response = await fetch(`${route}inventario/actas-entradas-by/${id}`,{
           method:"GET"
            });
            const data = await response.json();
            return data;
        }       

       export const actaDeEntradaByIdCompra = async(id:number):Promise<InfoPdfEntrada> => {
      
              const response:Response = await fetch(`${route}inventario/acta-entrada-by/${id}`,{
             method:"GET"
              });
              const data = await response.json();
              return data;
          }        

           export const findProovedorByNombre = async(nombre:string):Promise<{id:number,nombreComercial:string}[]> => {
    
            const response:Response = await fetch(`${route}inventario/proovedores`,{
           method:"POST",
            headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({nombre})
            });
            const data = await response.json();
            return data;
        } 

               export const findProovedores = async():Promise<{id:number,nombreComercial:string}[]> => {
    
            const response:Response = await fetch(`${route}inventario/proovedores`,{
           method:"GET",
            headers: {
      "Content-Type": "application/json"
    },
    
            });
            const data = await response.json();
            return data;
        }     

        export const createProovedor = async(createProovedor:CreateProovedor):Promise<{ok:boolean,message:string}> => {
    
            const response:Response = await fetch(`${route}inventario/crear-proovedor`,{
           method:"POST",
            headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(createProovedor)
            });
            const data = await response.json();
            return data;
        }    
        
          export const getSeccionesByBodega = async(bodegaId:number):Promise<{id:number,seccion:string}[]> => {
    
            const response:Response = await fetch(`${route}inventario/secciones/${bodegaId}`,{
           method:"GET"
            });
            const data = await response.json();
            return data;
        } 

           export const getPerchasBySeccion = async(seccionId:number):Promise<{id:number,percha:string}[]> => {
    
            const response:Response = await fetch(`${route}inventario/perchas/${seccionId}`,{
           method:"GET"
            });
            const data = await response.json();
            return data;
        } 

        export const filtrarActasEntrada = async (filtros: FiltrarActaEntradaDto): Promise<InfoPdfEntrada[]> => {
  try {
    const response: Response = await fetch(`${route}inventario/actas-entradas/filter`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(filtros)
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("filtrarActasEntrada error:", error);
    return [];
  }
};

        export const updateActaEntrada = async (id: number, updateData: { factura?: string; provedorId?: number; solicitudCompraId?: number; recibe?: number }): Promise<{ msj: string; validate: boolean }> => {
  try {
    const response: Response = await fetch(`${route}inventario/acta-entrada/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updateData)
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("updateActaEntrada error:", error);
    throw error;
  }
};

export const deleteActaEntrada = async (id: number): Promise<{ msj: string; validate: boolean }> => {
  try {
    const response: Response = await fetch(`${route}inventario/acta-entrada/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("deleteActaEntrada error:", error);
    throw error;
  }
};