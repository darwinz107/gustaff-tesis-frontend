import React, { useEffect, useState, useRef } from 'react'
import type { InfoPdfSalida } from '../models/InfoPdfSalida';
import { findAllRegistroSalida, filtrarActasSalida, findRegistroSalidaById, updateActaSalida, deleteActaSalida } from '../controller/actaSalida-api';
import { getUsers } from '../../user/controller/api/user-api';

export const GestionSalida = () => {
  const [actas, setactas] = useState<InfoPdfSalida[]>([]);
  const [acta, setacta] = useState<InfoPdfSalida|null>(null);
  const [filtroNumActa, setFiltroNumActa] = useState("");
  const [filtroRecibe, setFiltroRecibe] = useState("");
  const [filtroEntrega, setFiltroEntrega] = useState("");
  const [filtroDestino, setFiltroDestino] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");
  const [ventanaEmergente, setventanaEmergente] = useState(false);
  const [showSuccess, setshowSuccess] = useState(false);
  const [showError, setshowError] = useState(false);
  const [mensajeError, setmensajeError] = useState("");
  const [habilitarEdicion, sethabilitarEdicion] = useState(false);
  const [users, setusers] = useState<{id:number, name:string}[]>([]);
  const [observacionEditada, setobservacionEditada] = useState("");
  const [entregaIdEditada, setentregaIdEditada] = useState<number|undefined>();
  const [recibeSinSMIdEditada, setrecibeSinSMIdEditada] = useState<number|undefined>();
  const [solicitanteIdEditada, setsolicitanteIdEditada] = useState<number|undefined>();
  const [destinoEditada, setdestinoEditada] = useState("");

  const dialog = useRef<HTMLDialogElement>(null);

 const llenarActas = async() => {
      const res = await findAllRegistroSalida();
      console.log(res);
      setactas(res || []);
    }

  useEffect(() => {
   
    llenarActas();
    const getAllUsers = async () => {
      const res = await getUsers();
      setusers(res);
    };
    getAllUsers();
  }, []);

  const aplicarFiltros = async () => {
    const filtros = {
      numActa: filtroNumActa || undefined,
      fechaRemision: filtroFecha || undefined,
      recibe: filtroRecibe || undefined,
      entrega: filtroEntrega || undefined,
      destino: filtroDestino || undefined
    };
    const res = await filtrarActasSalida(filtros as any);
    setactas(res || []);
  }

  const limpiarFiltros = async () => {
    setFiltroNumActa("");
    setFiltroRecibe("");
    setFiltroEntrega("");
    setFiltroDestino("");
    setFiltroFecha("");
    const res = await findAllRegistroSalida();
    setactas(res || []);
  }

  const cargarPdf = async(id:number) => {
    console.log(id);
    window.open(`/pdf-salida/${id}`,"_blank");
  }

  const llenarActaById = async(id:number)=>{
    try {
      const res = await findRegistroSalidaById(id);
      console.log(res);
      if(res){
        setacta(res);
        setobservacionEditada(res.observacion ?? "");
        setentregaIdEditada(res.entrega?.id);
        setrecibeSinSMIdEditada(res.recibeSinSM?.id);
        setsolicitanteIdEditada(res.numSolicitudCompra?.numOrdenTrabajo?.userSolicitante?.id);
        setdestinoEditada(res.destino ?? res.numSolicitudCompra?.Destino ?? "");
        setventanaEmergente(true);
      }else{
        setmensajeError("Fallo al cargar la acta de salida");
        setshowError(true);
        setTimeout(() => setshowError(false), 3000);
      }
    } catch (error) {
      console.error("Error al cargar acta:", error);
      setmensajeError("Error al cargar la acta de salida");
      setshowError(true);
      setTimeout(() => setshowError(false), 3000);
    }
  }

  const guardarCambios = async() => {
    if(!acta) return;
    try {
      const updateData: { entregaId?: number; observacion?: string; recibeSinSMId?: number; solicitanteId?: number; destino?: string } = {};
      
      if(observacionEditada !== acta.observacion) {
        updateData.observacion = observacionEditada;
      }
      if(entregaIdEditada !== acta.entrega?.id && entregaIdEditada !== undefined) {
        updateData.entregaId = entregaIdEditada;
      }
      if(destinoEditada !== (acta.destino ?? acta.numSolicitudCompra?.Destino)) {
        updateData.destino = destinoEditada;
      }

      if(acta.numSolicitudCompra) {
        if(solicitanteIdEditada !== acta.numSolicitudCompra?.numOrdenTrabajo?.userSolicitante?.id && solicitanteIdEditada !== undefined) {
          updateData.solicitanteId = solicitanteIdEditada;
        }
      } else {
        if(recibeSinSMIdEditada !== acta.recibeSinSM?.id && recibeSinSMIdEditada !== undefined) {
          updateData.recibeSinSMId = recibeSinSMIdEditada;
        }
      }

      const res = await updateActaSalida(acta.id, updateData);
      if(res.validate) {
        setshowSuccess(true);
        setTimeout(() => {
          setshowSuccess(false);
          sethabilitarEdicion(false);
          llenarActas();
          setventanaEmergente(false);
          setacta(null);
        }, 1000);
      } else {
        setmensajeError("Error: " + res.msj);
        setshowError(true);
        setTimeout(() => setshowError(false), 3000);
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
      setmensajeError("Error al actualizar la acta");
      setshowError(true);
      setTimeout(() => setshowError(false), 3000);
    }
  }

  const eliminarActa = async() => {
    if(!acta) return;
    try {
      const res = await deleteActaSalida(acta.id);
      if(res.validate) {
        setshowSuccess(true);
        setTimeout(() => {
          setshowSuccess(false);
          llenarActas();
          setventanaEmergente(false);
          setacta(null);
        }, 1000);
      } else {
        setmensajeError("Error: " + res.msj);
        setshowError(true);
        setTimeout(() => setshowError(false), 3000);
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
      setmensajeError("Error al eliminar la acta");
      setshowError(true);
      setTimeout(() => setshowError(false), 3000);
    }
  }

  return (
    <>
      {showSuccess && (
        <div className="fixed top-5 right-5 z-50">
          <div role="alert" className="alert alert-success shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>¡Operación realizada correctamente!</span>
          </div>
        </div>
      )}

      {showError && (
        <div className="fixed top-5 right-5 z-50">
          <div role="alert" className="alert alert-error shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{mensajeError}</span>
          </div>
        </div>
      )}

      <dialog ref={dialog} id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">¡Advertencia!</h3>
          <p className="py-4">¿Está seguro que desea eliminar esta acta de salida? Esta acción no se puede deshacer.</p>
          <div className="modal-action">
            <form method="dialog" className="flex gap-2">
              <button className="btn btn-error" onClick={eliminarActa}>Eliminar</button>
              <button className="btn">Cancelar</button>
            </form>
          </div>
        </div>
      </dialog>

      <div className="min-w-[70%] min-h-[60%] rounded-xl border border-gray-200 m-4 bg-white shadow-sm">
        <div className="bg-gray-100 w-full h-12 flex items-center justify-between rounded-t-lg border-b px-4">
          <p className="font-semibold text-gray-700">Listado de actas de salida</p>
          <div className="flex items-center gap-2">
            <button className="btn btn-sm btn-ghost" onClick={() => llenarActas()}>Refrescar</button>
            <button className="btn btn-sm btn-ghost" onClick={limpiarFiltros}>Limpiar</button>
            <button className="btn btn-sm btn-primary" onClick={aplicarFiltros}>Aplicar filtros</button>
          </div>
        </div>

        <div className="p-4 grid grid-cols-1 lg:grid-cols-5 gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">N.Acta</label>
            <input className="input input-sm" value={filtroNumActa} onChange={(e)=>setFiltroNumActa(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Recibe</label>
            <input className="input input-sm" value={filtroRecibe} onChange={(e)=>setFiltroRecibe(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Entrega</label>
            <input className="input input-sm" value={filtroEntrega} onChange={(e)=>setFiltroEntrega(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Destino</label>
            <input className="input input-sm" value={filtroDestino} onChange={(e)=>setFiltroDestino(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Fecha</label>
            <input type="date" className="input input-sm" value={filtroFecha} onChange={(e)=>setFiltroFecha(e.target.value)} />
          </div>
        </div>

        <div className="overflow-x-auto p-5">
          <div className="overflow-hidden border rounded-lg">
            <div className="max-h-[520px] overflow-auto">
              <table className="table w-full">
                <thead className="bg-white sticky top-0">
                  <tr className="text-sm text-left text-gray-600">
                    <th className="px-4 py-3">N.Acta de salida</th>
                    <th className="px-4 py-3">Fecha de remisión</th>
                    <th className="px-4 py-3">Recibe</th>
                    <th className="px-4 py-3">Entrega</th>
                    <th className="px-4 py-3">Destino</th>
                    <th className="px-4 py-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {actas.map((u, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{u.numActa}</td>
                      <td className="px-4 py-3">{u.fechaRemision ? u.fechaRemision.split("T")[0] : ""}</td>
                      <td className="px-4 py-3">{u.numSolicitudCompra?.numOrdenTrabajo?.userSolicitante?.name ?? u.recibeSinSM?.name}</td>
                      <td className="px-4 py-3">{u.entrega?.name ?? ""}</td>
                      <td className="px-4 py-3">{u.destino ?? "" }</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex gap-2 justify-center">
                          <button className="btn btn-ghost btn-xs" onClick={()=>llenarActaById(u.id)}>Ver detalles</button>
                          <button className="btn btn-ghost btn-xs" onClick={() => {setacta(u); dialog.current?.showModal();}}>Eliminar</button>
                          <button className="btn btn-ghost btn-xs" onClick={()=>cargarPdf(u.id)}>Ver PDF</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {actas.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center text-sm text-gray-500 py-8">No hay actas</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {acta && (
       <div className={`z-50 fixed inset-0 flex items-center justify-center transition-opacity duration-300 ${ventanaEmergente ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative border border-gray-300 w-11/12 max-w-6xl h-[85vh] rounded-md bg-white shadow-lg overflow-auto">
          <div className="w-full h-[12%] flex justify-between p-5 border-b">
            <div className="font-medium text-gray-700">Detalle de acta de salida</div>
            <div onClick={() => { setventanaEmergente(!ventanaEmergente); setacta(null); }} className="cursor-pointer">❌</div>
          </div>

          <div className="w-full h-[76%] px-6 py-4 flex flex-col">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-500">N.Acta</p>
                <input type="text" disabled className="input w-full mt-1" value={acta?.numActa} />
              </div>

              <div>
                <p className="text-xs text-gray-500">Fecha de remisión</p>
                <input type="date" disabled value={acta?.fechaRemision ? acta.fechaRemision.split("T")[0] : ""}/>
              </div>

              <div>
                <p className="text-xs text-gray-500">Observación</p>
                <input type="text" disabled={!habilitarEdicion} className="input w-full mt-1" value={observacionEditada} onChange={(e)=>setobservacionEditada(e.target.value)} />
              </div>

              {acta?.numSolicitudCompra ? (
                <>
                  <div>
                    <p className="text-xs text-gray-500">Solicitante</p>
                    <select disabled={!habilitarEdicion} value={solicitanteIdEditada ?? 0} onChange={(e)=>setsolicitanteIdEditada(Number(e.target.value))} className="select w-full mt-1">
                      <option disabled>...</option>
                      {(users ?? []).map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                    </select>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">N.Solicitud de material</p>
                    <input type="text" disabled className="input w-full mt-1" value={acta?.numSolicitudCompra?.numOrden ?? ""} />
                  </div>
                  <div>
                <p className="text-xs text-gray-500">Destino</p>
                <input type="text" disabled={!habilitarEdicion} className="input w-full mt-1" value={destinoEditada} onChange={(e)=>setdestinoEditada(e.target.value)} />
              </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-xs text-gray-500">Recibe</p>
                    <select disabled={!habilitarEdicion} value={recibeSinSMIdEditada ?? 0} onChange={(e)=>setrecibeSinSMIdEditada(Number(e.target.value))} className="select w-full mt-1">
                      <option disabled>...</option>
                      {(users ?? []).map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                    </select>
                  </div>
                  <div>
                <p className="text-xs text-gray-500">Destino</p>
                <input type="text" disabled={!habilitarEdicion} className="input w-full mt-1" value={destinoEditada} onChange={(e)=>setdestinoEditada(e.target.value)} />
              </div>
                </>
              )}

              <div>
                <p className="text-xs text-gray-500">Entrega</p>
                <input type="text" disabled className="input w-full mt-1" value={acta?.entrega?.name ?? ""} />
              </div>

              

              <div>
                <p className="text-xs text-gray-500">Total</p>
                <input type="text" disabled className="input w-full mt-1" value={acta?.total ?? ""} />
              </div>
            </div>

            <div className="overflow-auto mt-5">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Cantidad</th>
                    
                    <th>Característica</th>
                    <th>Observación</th>
                  </tr>
                </thead>
                <tbody>
                  {(acta?.itemSalida ?? []).map((is, idx) => (
                    <tr key={idx}>
                      <td>{is.inventario?.nombre ?? is.item}</td>
                      <td>{is.cantidad}</td>
                      
                      <td>{is.caracteristica ?? ""}</td>
                      <td>{is.Observacion ?? ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

          <div className="w-full h-[12%] flex justify-between items-center px-6 border-t">
            {habilitarEdicion ? (
              <>
                <button className="btn btn-primary" onClick={guardarCambios}>Hecho</button>
                <button className="btn" onClick={() => { sethabilitarEdicion(!habilitarEdicion); setobservacionEditada(acta?.observacion ?? ""); setentregaIdEditada(acta?.entrega?.id); setrecibeSinSMIdEditada(acta?.recibeSinSM?.id); setsolicitanteIdEditada(acta?.numSolicitudCompra?.numOrdenTrabajo?.userSolicitante?.id); setdestinoEditada(acta?.destino ?? acta?.numSolicitudCompra?.Destino ?? ""); }}>Cancelar</button>
              </>
            ) : (
              <>
                <button className="btn" onClick={() => { sethabilitarEdicion(!habilitarEdicion); }}>Editar</button>
                <button className="btn btn-ghost" onClick={() => { setventanaEmergente(!ventanaEmergente); setacta(null); }}>Cerrar</button>
              </>
            )}
          </div>
        </div>
      </div>)}
    </>
  );
}
