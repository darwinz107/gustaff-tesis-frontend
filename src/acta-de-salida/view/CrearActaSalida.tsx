import { useEffect, useState } from "react"
import { BuscarOrdenCompra } from "./BuscarOrdenCompra";
import type { InfoPdfCompra } from "../../orden-de-compra/models/infoPdfCompra";
import { getAllSolicitudes, ordenCompraById } from "../../orden-de-compra/controller/ordenCompraApi";
import { getUsers } from "../../user/controller/api/user-api";
import type { Users } from "../../admin/models/users";
import { createActaSalidaApi } from "../controller/actaSalida-api";
import type { BuscarSolMaterial } from "../../orden-de-compra/models/buscarSolMaterial";


export const CrearActaSalida = () => {
  //const [sinOrden, setsinOrden] = useState(false);
  const [conOrden, setconOrden] = useState(true);
  const [ventanaBuscarOrdenTrabajo, setventanaBuscarOrdenTrabajo] = useState(false);
  const [ventanaEmergente, setventanaEmergente] = useState(false);
  const [solicitudMaterial, setsolicitudMaterial] = useState<InfoPdfCompra>({itemSolicitados:[]});
  const [users, setusers] = useState<Users[]>([]);
  const [entrega, setentrega] = useState(0);
  const [observacion, setobservacion] = useState("");
  const [actaSalida, setactaSalida] = useState(false);
  //const [idSolMaterial, setidSolMaterial] = useState<number>(0);
  const [ordenes, setordenes] = useState<BuscarSolMaterial[]>([]);

 const cargarInfoSolMaterial = async(id:number) =>{
        const res = await ordenCompraById(id);
        console.log(res);
        setsolicitudMaterial(res);
        
    }

   const generarActaSalida = async () => {

  if (solicitudMaterial.id == null) {
    alert("Debe llenar la informacion necesaria antes de generar una acta de salida!");
    return;
  }

  try {
    const res = await createActaSalidaApi(
      solicitudMaterial.id,
      entrega,
      observacion
    );

    console.log(res);

    if (res?.validate) {
      alert(res.msj);
      window.open(`/pdf-salida/${solicitudMaterial.id}`, "_blank");

      setsolicitudMaterial({
        id: null,
        numOrden: "",
        numOrdenTrabajo: {
          Area: "",
          userSolicitante: { name: "" },
          Maquina: "",
          Codigo: ""
        },
        Destino: "",
        itemSolicitados: []
      });

      setentrega(0);
      setobservacion("");
    } else {
      console.warn("Respuesta inválida:", res);
    }

  } catch (error) {
    console.error("Error generando acta de salida:", error);
  }
};


    useEffect(() => {
       const getAllUsers = async () => {
             const res = await getUsers();
             setusers(res);
           } ;
         getAllUsers(); 

    const metodoSolicitudesMaterialesSalidas = async() =>{
    
    const res = await getAllSolicitudes();
    setordenes(res);
   }
   metodoSolicitudesMaterialesSalidas();
    }, []);
    

  

  return (
  <>
    <div className="w-full h-full p-6 space-y-6">

      
      <div className="w-full flex items-center justify-center">
        <button
          className="btn btn-primary"
          disabled={!conOrden}
          onClick={() => { setactaSalida(true); setventanaBuscarOrdenTrabajo(!ventanaBuscarOrdenTrabajo); }}
        >
          Asignar solicitud de material
        </button>
      </div>

     
      <div className="w-full bg-base-100 rounded-2xl shadow p-5">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-3">
          Información de orden de material
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-3">
            <label className="text-sm text-gray-600">Solicitante</label>
            <input type="text" className="input input-bordered w-full" value={solicitudMaterial?.numOrdenTrabajo?.userSolicitante?.name} disabled />

            <label className="text-sm text-gray-600 mt-2">Área</label>
            <input type="text" className="input input-bordered w-full" value={solicitudMaterial?.numOrdenTrabajo?.Area} disabled />

            <label className="text-sm text-gray-600 mt-2">Destino</label>
            <input type="text" className="input input-bordered w-full" value={solicitudMaterial?.Destino} disabled />
          </div>

          <div className="space-y-3">
            <label className="text-sm text-gray-600">Entrega</label>
            <select value={entrega} className="select select-bordered w-full" disabled={!conOrden} onChange={(e) => setentrega(e.target.value)}>
              <option value={0} disabled>...</option>
              {users.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>

            <label className="text-sm text-gray-600 mt-2">Código</label>
            <input type="text" className="input input-bordered w-full" value={solicitudMaterial?.numOrdenTrabajo?.Codigo} disabled />

            <label className="text-sm text-gray-600 mt-2">Observación</label>
            <input type="text" className="input input-bordered w-full" disabled={!conOrden} onChange={(e) => setobservacion(e.target.value)} />
          </div>

          <div className="space-y-3">
            <label className="text-sm text-gray-600">Recibe</label>
            <input type="text" className="input input-bordered w-full" value={solicitudMaterial?.numOrdenTrabajo?.userSolicitante?.name} disabled />

            <label className="text-sm text-gray-600 mt-2">Máquina</label>
            <input type="text" className="input input-bordered w-full" value={solicitudMaterial?.numOrdenTrabajo?.Maquina} disabled />

            <label className="text-sm text-gray-600 mt-2">N.Orden</label>
            <input type="text" className="input input-bordered w-full" value={solicitudMaterial?.numOrden} disabled />
          </div>
        </div>
      </div>

    
      <div className="w-full bg-base-100 rounded-2xl shadow p-5">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-3">Agregar ítems</h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          <div className="md:col-span-4">
            <label className="text-sm text-gray-600">Cantidad</label>
            <input disabled={conOrden} type="text" className="input input-bordered w-full" />
          </div>

          <div className="md:col-span-5">
            <label className="text-sm text-gray-600">Item</label>
            <div className="relative">
              <input
                disabled={conOrden}
                type="text"
                className="input input-bordered w-full pr-10"
              />
              <button
                disabled={conOrden}
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-ghost btn-sm"
                onClick={() => setventanaEmergente(!ventanaEmergente)}
                aria-label="buscar item">
                {conOrden ? '' : '🔎'}
              </button>
            </div>
          </div>

          <div className="md:col-span-3">
            <label className="text-sm text-gray-600">Destino</label>
            <input disabled={conOrden} type="text" className="input input-bordered w-full" />
          </div>

          <div className="md:col-span-12">
            <label className="text-sm text-gray-600 mt-2">Observación</label>
            <input disabled={conOrden} type="text" className="input input-bordered w-full" />
          </div>

          <div className="md:col-span-12 flex gap-3 mt-3">
            {conOrden ? (
              <button className="btn btn-outline" onClick={() => { setconOrden(!conOrden); setsolicitudMaterial({ numOrden: "", numOrdenTrabajo: { Area: "", userSolicitante: { name: "" }, Maquina: "", Codigo: "" }, Destino: "", itemSolicitados: [] }); setentrega(0); }}>
                Activar
              </button>
            ) : (
              <>
                <button className="btn btn-primary">Agregar a compras</button>
                <button className="btn" onClick={() => setconOrden(!conOrden)}>Cancelar</button>
              </>
            )}
          </div>
        </div>
      </div>

      
      <div className="w-full bg-base-100 rounded-2xl shadow p-5">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-3">Salidas</h2>

        <div className="overflow-auto max-h-72">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Cantidad</th>
                <th>Item</th>
                <th>Característica</th>
                <th>Observación</th>
                {conOrden ? null : <th>Acciones</th>}
              </tr>
            </thead>

            <tbody>
              {conOrden ? (
                solicitudMaterial?.itemSolicitados?.map((u, i) =>
                  u.existencia ? (
                    <tr key={i}>
                      <td>{u.cantidad}</td>
                      <td>{u.item}</td>
                      <td>{u.caracteristica}</td>
                      <td>{u.Observacion ?? "N/A"}</td>
                    </tr>
                  ) : null
                )
              ) : (
                solicitudMaterial?.itemSolicitados?.map((u, i) => (
                  <tr key={i}>
                    <td>{u.cantidad}</td>
                    <td>{u.item}</td>
                    <td>{u.caracteristica}</td>
                    <td>{u.Observacion}</td>
                    <td>
                      <button className="btn btn-ghost btn-xs">Eliminar</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      
      <div className="flex justify-center">
        <button className="btn btn-success" onClick={generarActaSalida}>Generar acta de salida</button>
      </div>

      
      <div className={`fixed inset-0 z-40 flex items-center justify-center transition-opacity duration-300 ${ventanaBuscarOrdenTrabajo ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <div className="bg-white w-11/12 md:w-4/5 h-4/5 rounded-lg shadow-lg overflow-hidden border">
          <BuscarOrdenCompra ordenes={ordenes} setidSolMaterial={cargarInfoSolMaterial} setventanaBuscarOrdenTrabajo={setventanaBuscarOrdenTrabajo} ventanaBuscarOrdenTrabajo={ventanaBuscarOrdenTrabajo} />
        </div>
      </div>

      
      <div className={`fixed inset-0 z-40 flex items-center justify-center transition-opacity duration-300 ${ventanaEmergente ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <div className="bg-white w-11/12 md:w-2/5 h-3/5 rounded-lg shadow-lg border">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="font-medium">Listado de ítems</div>
            <button className="btn btn-ghost btn-sm" onClick={() => { setventanaEmergente(!ventanaEmergente); }}>❌</button>
          </div>

          <div className="p-4 flex flex-col h-[70%]">
            <div className="flex justify-end mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm">Buscar:</span>
                <input className="input input-bordered input-sm" type="text" />
              </div>
            </div>

            <div className="overflow-auto border rounded">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Stock</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  
                </tbody>
              </table>
            </div>

            <div className="mt-3 flex justify-end gap-2">
              <button className="btn">Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
);

}
