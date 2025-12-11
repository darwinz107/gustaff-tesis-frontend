import type { AsignarInfoEntrada } from "../../inventario/models/AsignarInfoEntrada";
import type { CreateActaEntradaDto } from "../models/create-entrada";

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