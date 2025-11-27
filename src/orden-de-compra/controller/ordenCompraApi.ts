import type { DetallesPrevioCompra } from "../models/DetallesPrevioCompra";
import type { FiltrarOrdenTrabajo } from "../models/filtrarOrdenTrabajo";
import type { GuardarSolicitudCompra } from "../models/guardarSolicitudCompra";
import type { InfoOrdenTrabajo } from "../models/infoOrdenTrabajo";
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

export const crearOrdenCompra = async (guardarSolicitudCompra: GuardarSolicitudCompra):Promise<{msj:string}> => {
  
  const response: Response = await fetch(`${route}solicitud-de-compra`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(guardarSolicitudCompra)
  });
    const data = await response.json();
    return data;
};

export const findAllSolicitudesCompra = async (): Promise<DetallesPrevioCompra[]> => {
  const response: Response = await fetch(`${route}solicitud-de-compra/solicitudes-de-compra`, {
    method: "GET"
  });

  const data = await response.json();
  return data;
}

export const ordenCompraById = async (id:number): Promise<InfoOrdenTrabajo> => {
  const response: Response = await fetch(`${route}solicitud-de-compra/solicitud-compra/${id}`, {
    method: "GET"
  });
  const data = await response.json();
  return data;
}