import React, { act, useEffect, useState, useRef } from 'react'
import type { InfoPdfEntrada } from '../models/infoPdfEntrada';
import { findAllRegistroEntrada, filtrarActasEntrada, findRegistroEntradaById, findProovedorByNombre, findProovedores, updateActaEntrada, deleteActaEntrada } from '../controller/actaEntrada-api';
import { solMaterialShort } from '../../orden-de-compra/controller/ordenCompraApi';

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

const dialog = useRef<HTMLDialogElement>(null);

const llenarActas = async() => {
      const res = await findAllRegistroEntrada();
      console.log(res);
      setactas(res || []);
    }

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
      const updateData: { factura?: string; provedorId?: number; solicitudCompraId?: number } = {};
      
      if(facturaEditada !== acta.factura) {
        updateData.factura = facturaEditada;
      }
      if(provedorIdEditada !== acta.proovedor?.id && provedorIdEditada !== undefined) {
        updateData.provedorId = provedorIdEditada;
      }
      if(solicitudCompraIdEditada !== acta.numSolicitudCompra?.id && solicitudCompraIdEditada !== undefined) {
        updateData.solicitudCompraId = solicitudCompraIdEditada;
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

      <div className="min-w-[70%] min-h-[60%] rounded-xl border border-gray-200 m-4 bg-white shadow-sm">
        <div className="bg-gray-100 w-full h-12 flex items-center justify-between rounded-t-lg border-b px-4">
          <p className="font-semibold text-gray-700">Listado de actas de entrada</p>
          <div className="flex items-center gap-2">
            <button className="btn btn-sm btn-ghost" onClick={() => llenarActas()}>Refrescar</button>
            <button className="btn btn-sm btn-ghost" onClick={limpiarFiltros}>Limpiar</button>
            <button className="btn btn-sm  btn-primary" onClick={aplicarFiltros}>Aplicar filtros</button>
          </div>
        </div>

        <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">N.Acta</label>
            <input className="input input-sm" value={filtroNumActa} onChange={(e)=>setFiltroNumActa(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Factura</label>
            <input className="input input-sm" value={filtroFactura} onChange={(e)=>setFiltroFactura(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Recibe</label>
            <input className="input input-sm" value={filtroRecibe} onChange={(e)=>setFiltroRecibe(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Proveedor</label>
            <input className="input input-sm" value={filtroProveedor} onChange={(e)=>setFiltroProveedor(e.target.value)} />
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
                    <th className="px-4 py-3">N.Acta de entrada</th>
                    <th className="px-4 py-3">Fecha de remisión</th>
                    <th className="px-4 py-3">Factura</th>
                    <th className="px-4 py-3">Recibe</th>
                    <th className="px-4 py-3">Destino</th>
                    <th className="px-4 py-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {actas.map((u, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{u.numActa}</td>
                      <td className="px-4 py-3">{u.fechaRemision ? u.fechaRemision.split("T")[0] : ""}</td>
                      <td className="px-4 py-3">{u.factura}</td>
                      <td className="px-4 py-3">{u.numSolicitudCompra?.numOrdenTrabajo?.userSolicitante?.name}</td>
                      <td className="px-4 py-3">{u.numSolicitudCompra?.Destino}</td>
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
            <div className="font-medium text-gray-700">Detalle de orden de materiales</div>
            <div onClick={() => { setventanaEmergente(!ventanaEmergente); }} className="cursor-pointer">❌</div>
          </div>

          <div className="w-full h-[76%] px-6 py-4 flex flex-col">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-500">N.Acta</p>
                <input type="text" disabled className="input w-full mt-1" value={acta?.numActa} />
              </div>

              <div>
                <p className="text-xs text-gray-500">Fecha de remision</p>
                <input type="date" disabled value={acta?.fechaRemision ? acta.fechaRemision.split("T")[0] : ""}/>
              </div>

               <div>
                <p className="text-xs text-gray-500">Factura</p>
                <input type="text" disabled={!habilitarEdicion}  className="input w-full mt-1" value={facturaEditada} onChange={(e)=>setfacturaEditada(e.target.value)} />
              </div>

              <div>
                <p className="text-xs text-gray-500">Proovedor</p>
                <select disabled={!habilitarEdicion} value={provedorIdEditada ?? 0} onChange={(e)=>setprovedorIdEditada(Number(e.target.value))} className="select w-full mt-1"
                  >
                  <option disabled>...</option>
                  {(proovedores ?? []).map((s) => <option key={s.id} value={s.id}>{s.nombreComercial}</option>)}
                </select>
              </div>

              <div>
                <p className="text-xs text-gray-500">N.Solicitud de material</p>
                <select disabled={!habilitarEdicion} className="select w-full mt-1" value={solicitudCompraIdEditada ?? 0} onChange={(e)=>setsolicitudCompraIdEditada(Number(e.target.value))}>
                  <option disabled>...</option>
                  {(solMateriales ?? []).map((o) => <option key={o.id} value={o.id}>{o.numOrden}</option>)}
                </select>
              </div>

           
            </div>

            <div className="overflow-auto mt-5">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Cantidad</th>
                    <th>Costo</th>
                    <th>Descuento</th>
                    <th>IVA</th>
                     <th>Subtotal</th>
                      <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(acta?.itemEntrada ?? []).map((is, idx) => (
                    <tr key={idx}>
                      <td>{is.item?.nombre ??""}</td>
                      <td>{is.cantidad}</td>
                      <td>{is.costo}</td>
                      <td>{is.descuento}</td>
                      <td>{is.iva ? "15%" : "0%"}</td>
                       <td>{is.subtotal}</td>
                        <td>{is.total}</td>
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
                <button className="btn" onClick={() => { sethabilitarEdicion(!habilitarEdicion); setfacturaEditada(acta?.factura ?? ""); setprovedorIdEditada(acta?.proovedor?.id); setsolicitudCompraIdEditada(acta?.numSolicitudCompra?.id); }}>Cancelar</button>
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
)};  
