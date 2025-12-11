import type { AsignarInfoEntrada } from "../../inventario/models/AsignarInfoEntrada";
import type { CreateActaEntradaDto } from "../models/create-entrada";
import type { InfoPdfEntrada } from "../models/infoPdfEntrada";

const route = "http://localhost:3000/";


        export const createActaEntrada = async (id:number,createActaEntradaDto:CreateActaEntradaDto): Promise<{msj:string, validate:boolean}> => {
  
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

       export const actaDeEntradaByIdCompra = async(id:number):Promise<InfoPdfEntrada> => {
      
              const response:Response = await fetch(`${route}inventario/acta-entrada-by/${id}`,{
             method:"GET"
              });
              const data = await response.json();
              return data;
          }        