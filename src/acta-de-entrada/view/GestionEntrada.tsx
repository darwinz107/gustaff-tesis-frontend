import React, { act, useEffect, useState, useRef } from 'react'
import type { InfoPdfEntrada } from '../models/infoPdfEntrada';
import { findAllRegistroEntrada, filtrarActasEntrada, findRegistroEntradaById, findProovedorByNombre, findProovedores, updateActaEntrada, deleteActaEntrada } from '../controller/actaEntrada-api';
import { solMaterialShort } from '../../orden-de-compra/controller/ordenCompraApi';
import type { Users } from '../../admin/models/users';
import { getUsers } from '../../user/controller/api/user-api';

export const GestionEntrada = () => {
  const [actas, setactas] = useState<InfoPdfEntrada[]>([]);
  const [acta, setacta] = useState<InfoPdfEntrada|null>(null);
  const [filtroNumActa, setFiltroNumActa] = useState("");
  const [filtroFactura, setFiltroFactura] = useState("");
  const [filtroRecibe, setFiltroRecibe] = useState("");
  const [filtroProveedor, setFiltroProveedor] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");
  const [ventanaEmergente, setventanaEmergente] = useState(false);
  const [solMateriales, setsolMateriales] = useState<{id:number, numOrden:string}[]>([]);
  const [habilitarEdicion, sethabilitarEdicion] = useState(false);
   const [proovedores, setproovedores] = useState<{id:number,nombreComercial:string}[]>([]);
   const [facturaEditada, setfacturaEditada] = useState("");
   const [provedorIdEditada, setprovedorIdEditada] = useState<number|undefined>();
   const [solicitudCompraIdEditada, setsolicitudCompraIdEditada] = useState<number|undefined>();
   const [showSuccess, setshowSuccess] = useState(false);
   const [showError, setshowError] = useState(false);
   const [mensajeError, setmensajeError] = useState("");
   const [users, setusers] = useState<Users[]>([]);
   const [recibe, setrecibe] = useState(0);

const dialog = useRef<HTMLDialogElement>(null);

const llenarActas = async() => {
      const res = await findAllRegistroEntrada();
      console.log(res);
      setactas(res || []);
    }

       const getAllUsers = async () => {
                   const res = await getUsers();
                   console.log(res);
                   setusers(res);
                 } ;

 const solicitudesMaterial = async()=>{
     const res = await solMaterialShort();
    // console.log(res);
     setsolMateriales(res);
 }  
 
    const metodoExecProovedores = async()=>{
     const res = await findProovedores();
     setproovedores(res);
     
   }

  useEffect(() => {
    
    llenarActas();
    solicitudesMaterial();
    metodoExecProovedores();
    getAllUsers();
  }, []);

  const aplicarFiltros = async () => {
    const filtros = {
      numActa: filtroNumActa || undefined,
      factura: filtroFactura || undefined,
      recibe: filtroRecibe || undefined,
      proveedor: filtroProveedor || undefined,
      fechaRemision: filtroFecha || undefined
    };
    const res = await filtrarActasEntrada(filtros as any);
    setactas(res || []);
  }

  const limpiarFiltros = async () => {
    setFiltroNumActa("");
    setFiltroFactura("");
    setFiltroRecibe("");
    setFiltroProveedor("");
    setFiltroFecha("");
    const res = await findAllRegistroEntrada();
    setactas(res || []);
  }

  const cargarPdf = async(id:number) => {
    window.open(`/pdf-entrada/${id}`,"_blank");
  }

  const llenarActaById = async(id:number)=>{
       
    const res = await findRegistroEntradaById(id);
    console.log(res);
    if(res){
      setacta(res);
       setrecibe(res.recibe?res.recibe.id :0);
      setfacturaEditada(res.factura);
      setprovedorIdEditada(res.proovedor?.id);
      setsolicitudCompraIdEditada(res.numSolicitudCompra?.id);
      setventanaEmergente(true);
    }else{
      setmensajeError("Fallo al cargar la acta de entrada");
      setshowError(true);
      setTimeout(() => setshowError(false), 3000);
    }
    
  }

  const guardarCambios = async() => {
    if(!acta) return;
    try {
      const updateData: { factura?: string; provedorId?: number; solicitudCompraId?: number; recibe:number } = {};
      
      if(facturaEditada !== acta.factura) {
        updateData.factura = facturaEditada;
      }
      if(provedorIdEditada !== acta.proovedor?.id && provedorIdEditada !== undefined) {
        updateData.provedorId = provedorIdEditada;
      }
      if(solicitudCompraIdEditada !== acta.numSolicitudCompra?.id && solicitudCompraIdEditada !== undefined) {
        updateData.solicitudCompraId = solicitudCompraIdEditada;
      }

      if(recibe !== acta.recibe.id && recibe !== 0) {
        updateData.recibe = recibe;
      }

      const res = await updateActaEntrada(acta.id, updateData);
      if(res.validate) {
        setshowSuccess(true);
        setTimeout(() => {
          setshowSuccess(false);
          sethabilitarEdicion(false);
          llenarActas();
          setventanaEmergente(false);
          setacta(null);
          setrecibe(0);
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
      const res = await deleteActaEntrada(acta.id);
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
        <div className="fixed top-5 right-5 z-100">
          <div role="alert" className="alert alert-success shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>¡Acta actualizada correctamente!</span>
          </div>
        </div>
      )}

      {showError && (
        <div className="fixed top-5 right-5 z-100">
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
          <p className="py-4">¿Está seguro que desea eliminar esta acta de entrada? Esta acción no se puede deshacer.</p>
          <div className="modal-action">
            <form method="dialog" className="flex gap-2">
              <button className="btn btn-error" onClick={eliminarActa}>Eliminar</button>
              <button className="btn">Cancelar</button>
            </form>
          </div>
        </div>
      </dialog>

      <div className="w-full h-full rounded-2xl border border-gray-200 bg-white shadow-lg">
        <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 w-full py-4 rounded-t-2xl border-b border-cyan-200 px-6">
          <h2 className="font-bold text-white text-lg">📥 Actas de Entrada</h2>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-4 bg-gray-50 border-b border-gray-200">
          <div className="col-span-2 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600">Nº Acta</label>
              <input className="input input-sm input-bordered focus:input-primary rounded-lg" value={filtroNumActa} onChange={(e)=>setFiltroNumActa(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600">Factura</label>
              <input className="input input-sm input-bordered focus:input-primary rounded-lg" value={filtroFactura} onChange={(e)=>setFiltroFactura(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600">Recibe</label>
              <input className="input input-sm input-bordered focus:input-primary rounded-lg" value={filtroRecibe} onChange={(e)=>setFiltroRecibe(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600">Proveedor</label>
              <input className="input input-sm input-bordered focus:input-primary rounded-lg" value={filtroProveedor} onChange={(e)=>setFiltroProveedor(e.target.value)} />
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
                <thead className="bg-gradient-to-r from-cyan-50 to-cyan-100 sticky top-0 z-20">
                  <tr className="text-sm text-left text-gray-700 font-semibold">
                    <th className="px-4 py-3">Nº Acta</th>
                    <th className="px-4 py-3">Fecha remisión</th>
                    <th className="px-4 py-3">Factura</th>
                    <th className="px-4 py-3">Proveedor</th>
                    <th className="px-4 py-3">Descripción</th>
                    <th className="px-4 py-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {actas.map((u, i) => (
                    <tr key={i} className="border-t border-gray-100 hover:bg-cyan-50 transition-colors">
                      <td className="px-4 py-3 font-semibold text-gray-800">{u.numActa}</td>
                      <td className="px-4 py-3 text-gray-700">{u.fechaRemision ? u.fechaRemision.split("T")[0] : ""}</td>
                      <td className="px-4 py-3 text-gray-700">{u.factura}</td>
                      <td className="px-4 py-3 text-gray-700">{u.proovedor?.nombreComercial ?? "N/A"}</td>
                      <td className="px-4 py-3 text-gray-700 text-sm">{u.numSolicitudCompra?.numOrdenTrabajo?.DescripcionTrabajo ?? "N/A"}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex gap-2 justify-center flex-wrap">
                          <button className="btn btn-sm btn-info btn-outline gap-1 tooltip" data-tip="Ver detalles" onClick={()=>llenarActaById(u.id)}>👁️</button>
                          <button className="btn btn-sm btn-error btn-outline gap-1 tooltip" data-tip="Eliminar" onClick={() => {setacta(u); dialog.current?.showModal();}}>🗑️</button>
                          <button className="btn btn-sm btn-success btn-outline gap-1 tooltip" data-tip="Descargar PDF" onClick={()=>cargarPdf(u.id)}>📄</button>
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
          <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 w-full py-4 px-6 flex justify-between items-center border-b border-cyan-200">
            <h2 className="font-bold text-white text-lg">📥 Detalles de Acta de Entrada</h2>
            <button onClick={() => { setventanaEmergente(!ventanaEmergente); }} className="btn btn-circle btn-ghost btn-sm text-white hover:bg-cyan-700">✕</button>
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
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Factura</label>
                <input type="text" disabled={!habilitarEdicion} className="input input-sm input-bordered focus:input-primary rounded-lg" value={facturaEditada} onChange={(e)=>setfacturaEditada(e.target.value)} />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Proveedor</label>
                <select disabled={!habilitarEdicion} value={provedorIdEditada ?? 0} onChange={(e)=>setprovedorIdEditada(Number(e.target.value))} className="select select-sm select-bordered focus:select-primary rounded-lg">
                  <option disabled value={0}>Seleccionar...</option>
                  {(proovedores ?? []).map((s) => <option key={s.id} value={s.id}>{s.nombreComercial}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Recibe</label>
                <select disabled={!habilitarEdicion} value={recibe ?? 0} onChange={(e)=>setrecibe(Number(e.target.value))} className="select select-sm select-bordered focus:select-primary rounded-lg">
                  <option value={0} disabled>Seleccionar...</option>
                  {(users ?? []).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Nº Solicitud Material</label>
                <select disabled={!habilitarEdicion} className="select select-sm select-bordered focus:select-primary rounded-lg" value={solicitudCompraIdEditada ?? 0} onChange={(e)=>setsolicitudCompraIdEditada(Number(e.target.value))}>
                  <option value={0} disabled>Seleccionar...</option>
                  {(solMateriales ?? []).map((o) => <option key={o.id} value={o.id}>{o.numOrden}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Descripción</label>
                <input type="text" disabled className="input input-sm input-bordered rounded-lg bg-gray-100" value={acta?.numSolicitudCompra?.numOrdenTrabajo?.DescripcionTrabajo ?? "N/A"} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-sm font-bold text-gray-700 mb-4">📋 Detalles de Items</h3>
              <div className="overflow-x-auto">
                <table className="table w-full text-sm">
                  <thead className="bg-gradient-to-r from-cyan-50 to-cyan-100">
                    <tr className="text-xs font-semibold text-gray-700">
                      <th className="px-3 py-3">Item</th>
                      <th className="px-3 py-3 text-right">Cantidad</th>
                      <th className="px-3 py-3 text-right">Costo</th>
                      <th className="px-3 py-3 text-right">Descuento</th>
                      <th className="px-3 py-3 text-center">IVA</th>
                      <th className="px-3 py-3 text-right">Subtotal</th>
                      <th className="px-3 py-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(acta?.itemEntrada ?? []).map((is, idx) => (
                      <tr key={idx} className="border-t border-gray-100 hover:bg-cyan-50 transition-colors">
                        <td className="px-3 py-3 font-medium text-gray-800">{is.item?.nombre ?? "N/A"}</td>
                        <td className="px-3 py-3 text-right text-gray-700">{is.cantidad}</td>
                        <td className="px-3 py-3 text-right text-gray-700">{is.costo?.toLocaleString()}</td>
                        <td className="px-3 py-3 text-right text-gray-700">{is.descuento?.toLocaleString()}</td>
                        <td className="px-3 py-3 text-center"><span className="badge badge-sm badge-primary">{is.iva ? "15%" : "0%"}</span></td>
                        <td className="px-3 py-3 text-right text-gray-700">{is.subtotal?.toLocaleString()}</td>
                        <td className="px-3 py-3 text-right font-semibold text-cyan-600">{is.total?.toLocaleString()}</td>
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
                <button className="btn btn-ghost gap-2" onClick={() => { sethabilitarEdicion(!habilitarEdicion); setfacturaEditada(acta?.factura ?? ""); setprovedorIdEditada(acta?.proovedor?.id); setsolicitudCompraIdEditada(acta?.numSolicitudCompra?.id); setrecibe(acta.recibe.id); }}>↶ Cancelar</button>
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
)};  
