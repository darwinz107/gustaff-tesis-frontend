import type { FiltrarOrdenTrabajo } from "../models/filtrarOrdenTrabajo";
import type { LllenarDestino } from "../models/llenarDestino";

const route: string = "http://localhost:3000/"

export const filtrarOrdenTrabajo = async (filtrarOrdenTrabajo: FiltrarOrdenTrabajo): Promise<LllenarDestino[]> => {
  
  const response: Response = await fetch(`${route}orden-de-trabajo/filtrar/solicitud-orden`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(filtrarOrdenTrabajo)
  })
    const data = await response.json();
    return data;
};