import React, { useEffect, useState, useRef, act } from 'react'
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
  const [entrega, setentrega] = useState(0);

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
        setdestinoEditada(res.numSolicitudCompra?.numOrdenTrabajo.DescripcionTrabajo ?? res.descripcion ?? "");
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
      const updateData: { entregaId?: number; observacion?: string; recibeSinSMId?: number; /*solicitanteId?: number;*/ descripcion?: string } = {};
      
      if(observacionEditada !== acta.observacion) {
        updateData.observacion = observacionEditada;
      }
      if(entregaIdEditada !== acta.entrega?.id && entregaIdEditada !== undefined) {
        updateData.entregaId = entregaIdEditada;
      }
      console.log(acta.numSolicitudCompra);
      if(acta.numSolicitudCompra === undefined || acta.numSolicitudCompra === null && destinoEditada !== "") {
        updateData.descripcion = destinoEditada;
      }

      if(recibeSinSMIdEditada !== acta.recibeSinSM?.id && recibeSinSMIdEditada !== undefined) {
        updateData.recibeSinSMId = recibeSinSMIdEditada;
      }

    /*  if(solicitanteIdEditada !== acta.numSolicitudCompra?.numOrdenTrabajo?.userSolicitante?.id && solicitanteIdEditada !== undefined) {
        updateData.solicitanteId = solicitanteIdEditada;
      }*/


      console.log("Datos a actualizar:", updateData);
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
        <div className="fixed top-5 right-5 z-150">
          <div role="alert" className="alert alert-success shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>¡Operación realizada correctamente!</span>
          </div>
        </div>
      )}

      {showError && (
        <div className="fixed top-5 right-5 z-150">
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

      <div className="w-full h-full rounded-2xl border border-gray-200 bg-white shadow-lg">
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 w-full py-4 rounded-t-2xl border-b border-indigo-200 px-6">
          <h2 className="font-bold text-white text-lg">📤 Actas de Salida</h2>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-4 bg-gray-50 border-b border-gray-200">
          <div className="col-span-2 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600">Nº Acta</label>
              <input className="input input-sm input-bordered focus:input-primary rounded-lg" value={filtroNumActa} onChange={(e)=>setFiltroNumActa(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600">Recibe</label>
              <input className="input input-sm input-bordered focus:input-primary rounded-lg" value={filtroRecibe} onChange={(e)=>setFiltroRecibe(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600">Entrega</label>
              <input className="input input-sm input-bordered focus:input-primary rounded-lg" value={filtroEntrega} onChange={(e)=>setFiltroEntrega(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600">Descripción</label>
              <input className="input input-sm input-bordered focus:input-primary rounded-lg" value={filtroDestino} onChange={(e)=>setFiltroDestino(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600">Fecha</label>
              <input type="date" className="input input-sm input-bordered focus:input-primary rounded-lg" value={filtroFecha} onChange={(e)=>setFiltroFecha(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="px-6 py-3 flex items-center justify-end gap-2 bg-gray-50 border-b border-gray-200">
          <button className="btn btn-sm btn-ghost hover:btn-primary gap-2" onClick={() => llenarActas()}>🔄 Refrescar</button>
          <button className="btn btn-sm btn-ghost hover:btn-warning gap-2" onClick={limpiarFiltros}>✕ Limpiar</button>
          <button className="btn btn-sm btn-primary gap-2" onClick={aplicarFiltros}>✓ Aplicar</button>
        </div>

        <div className="px-6 pb-6 pt-4">
          <div className="overflow-hidden border border-gray-200 rounded-xl shadow-sm">
            <div className="max-h-[520px] overflow-auto">
              <table className="table w-full">
                <thead className="bg-gradient-to-r from-indigo-50 to-indigo-100 sticky top-0 z-20">
                  <tr className="text-sm text-left text-gray-700 font-semibold">
                    <th className="px-4 py-3">Nº Acta</th>
                    <th className="px-4 py-3">Fecha remisión</th>
                    <th className="px-4 py-3">Recibe</th>
                    <th className="px-4 py-3">Entrega</th>
                    <th className="px-4 py-3">Descripción</th>
                    <th className="px-4 py-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {actas.map((u, i) => (
                    <tr key={i} className="border-t border-gray-100 hover:bg-indigo-50 transition-colors">
                      <td className="px-4 py-3 font-semibold text-gray-800">{u.numActa}</td>
                      <td className="px-4 py-3 text-gray-700">{u.fechaRemision ? u.fechaRemision.split("T")[0] : ""}</td>
                      <td className="px-4 py-3 text-gray-700">{u.recibeSinSM?.name ?? "N/A"}</td>
                      <td className="px-4 py-3 text-gray-700">{u.entrega?.name ?? "N/A"}</td>
                      <td className="px-4 py-3 text-gray-700 text-sm">{u.numSolicitudCompra?.numOrdenTrabajo?.DescripcionTrabajo ?? u.descripcion ?? "N/A" }</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex gap-2 justify-center flex-wrap">
                          <button className="btn btn-sm btn-info btn-outline gap-1" onClick={()=>llenarActaById(u.id)}>👁️ Ver</button>
                          <button className="btn btn-sm btn-error btn-outline gap-1" onClick={() => {setacta(u); dialog.current?.showModal();}}>🗑️</button>
                          <button className="btn btn-sm btn-success btn-outline gap-1" onClick={()=>cargarPdf(u.id)}>📄</button>
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
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="relative border border-gray-300 w-11/12 max-w-6xl h-[85vh] rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 w-full py-4 px-6 flex justify-between items-center border-b border-indigo-200">
            <h2 className="font-bold text-white text-lg">📤 Detalles de Acta de Salida</h2>
            <button onClick={() => { setventanaEmergente(!ventanaEmergente); setacta(null); }} className="btn btn-circle btn-ghost btn-sm text-white hover:bg-indigo-700">✕</button>
          </div>

          {/* Content */}
          <div className="w-full flex-1 overflow-auto px-6 py-6 bg-gray-50">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6 bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Nº Acta</label>
                <input type="text" disabled className="input input-sm input-bordered rounded-lg bg-gray-100" value={acta?.numActa} />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Fecha de Remisión</label>
                <input type="date" disabled className="input input-sm input-bordered rounded-lg bg-gray-100" value={acta?.fechaRemision ? acta.fechaRemision.split("T")[0] : ""}/>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Observación</label>
                <input type="text" disabled={!habilitarEdicion} className="input input-sm input-bordered focus:input-primary rounded-lg" value={observacionEditada} onChange={(e)=>setobservacionEditada(e.target.value)} />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Descripción</label>
                <input type="text" disabled={acta.numSolicitudCompra ? true : !habilitarEdicion} className="input input-sm input-bordered focus:input-primary rounded-lg" value={acta.numSolicitudCompra?.numOrdenTrabajo.DescripcionTrabajo ?? destinoEditada?? ""} onChange={(e)=>setdestinoEditada(e.target.value)} />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Recibe</label>
                <select disabled={!habilitarEdicion} value={recibeSinSMIdEditada ?? 0} onChange={(e)=>setrecibeSinSMIdEditada(Number(e.target.value))} className="select select-sm select-bordered focus:select-primary rounded-lg">
                  <option value={0} disabled>Seleccionar...</option>
                  {(users ?? []).map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Entrega</label>
                <select disabled={!habilitarEdicion} value={entregaIdEditada ?? 0} onChange={(e)=>setentregaIdEditada(Number(e.target.value))} className="select select-sm select-bordered focus:select-primary rounded-lg">
                  <option value={0} disabled>Seleccionar...</option>
                  {(users ?? []).map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>

              {acta?.numSolicitudCompra && 
                (<>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Solicitante</label>
                    <input type="text" disabled className="input input-sm input-bordered rounded-lg bg-gray-100" value={acta?.numSolicitudCompra?.numOrdenTrabajo?.userSolicitante?.name ?? "N/A"} />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Nº Solicitud Material</label>
                    <input type="text" disabled className="input input-sm input-bordered rounded-lg bg-gray-100" value={acta?.numSolicitudCompra?.numOrden} />
                  </div>
                </>
                )
              }

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</label>
                <input type="text" disabled className="input input-sm input-bordered rounded-lg bg-gray-100" value={acta?.total ?? ""} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-sm font-bold text-gray-700 mb-4">📋 Detalles de Items</h3>
              <div className="overflow-x-auto">
                <table className="table w-full text-sm">
                  <thead className="bg-gradient-to-r from-indigo-50 to-indigo-100">
                    <tr className="text-xs font-semibold text-gray-700">
                      <th className="px-3 py-3">Item</th>
                      <th className="px-3 py-3 text-right">Cantidad</th>
                      <th className="px-3 py-3">Característica</th>
                      <th className="px-3 py-3">Observación</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(acta?.itemSalida ?? []).map((is, idx) => (
                      <tr key={idx} className="border-t border-gray-100 hover:bg-indigo-50 transition-colors">
                        <td className="px-3 py-3 font-medium text-gray-800">{is.inventario?.nombre ?? is.item}</td>
                        <td className="px-3 py-3 text-right text-gray-700">{is.cantidad}</td>
                        <td className="px-3 py-3 text-gray-700">{is.caracteristica ?? "N/A"}</td>
                        <td className="px-3 py-3 text-gray-700 text-xs">{is.Observacion ?? "N/A"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="w-full px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
            {habilitarEdicion ? (
              <>
                <button className="btn btn-primary gap-2" onClick={guardarCambios}>💾 Guardar Cambios</button>
                <button className="btn btn-ghost gap-2" onClick={() => { sethabilitarEdicion(!habilitarEdicion); setobservacionEditada(acta?.observacion ?? ""); setentregaIdEditada(acta?.entrega?.id); setrecibeSinSMIdEditada(acta?.recibeSinSM?.id); setsolicitanteIdEditada(acta?.numSolicitudCompra?.numOrdenTrabajo?.userSolicitante?.id); setdestinoEditada(acta?.destino ?? acta?.numSolicitudCompra?.Destino ?? ""); }}>↶ Cancelar</button>
              </>
            ) : (
              <>
                <button className="btn btn-warning gap-2" onClick={() => { sethabilitarEdicion(!habilitarEdicion); }}>✏️ Editar</button>
                <button className="btn btn-ghost gap-2" onClick={() => { setventanaEmergente(!ventanaEmergente); setacta(null); }}>Cerrar</button>
              </>
            )}
          </div>
        </div>
      </div>)}
    </>
  );
}
