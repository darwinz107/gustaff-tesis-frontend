import React, { useEffect, useRef, useState } from 'react'
import type { Inventarios } from '../models/inventarios';
import { getInventario, filtrarInventarioAdvanced, updateInventario, deleteInventario } from '../controller/inventario-api';
import { getAllBodegas} from '../../admin/controller/api/admin-api';
import { getPerchasBySeccion, getSeccionesByBodega } from '../../acta-de-entrada/controller/actaEntrada-api';
import { ConvertToBase64 } from '../../acta-de-entrada/controller/ConvertToBase64';

export const GestionInventario = () => {
  const [items, setItems] = useState<Inventarios[]>([]);
  const [item, setitem] = useState<Inventarios | null>(null);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroBodega, setFiltroBodega] = useState<string>("");
  const [filtroStockMin, setFiltroStockMin] = useState<number | "">("");
  const [filtroStockMax, setFiltroStockMax] = useState<number | "">("");
  const [filtroActivo, setFiltroActivo] = useState<string>("");
  const [ventanaEmergente, setventanaEmergente] = useState(false);
  const [habilitarEdicion, sethabilitarEdicion] = useState(true);
  const [bodegas, setBodegas] = useState<{id:number,bodega:string}[]>([]);
  const [secciones, setSecciones] = useState<{id:number,seccion:string}[]>([]);
  const [perchas, setPerchas] = useState<{id:number,percha:string}[]>([]);
  const [bodegaSeleccionada, setBodegaSeleccionada] = useState<string>("");
  const [seccionSeleccionada, setSeccionSeleccionada] = useState<string>("");
  const [perchaSeleccionada, setperchaSeleccionada] = useState("")
  const [nuevaImagen, setnuevaImagen] = useState<File | null>(null);
  // Estados para edición
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [stock, setStock] = useState<number>(0);
  const [costo, setCosto] = useState(0);
  const [stockMin, setStockMin] = useState<number>(0);
  const [estado, setEstado] = useState<boolean>(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const [imagenEditada, setimagenEditada] = useState<string|File|null>(null);
  const refImg = useRef<HTMLInputElement | null>(null);
  const dialogEliminarRef = useRef<HTMLDialogElement>(null);
  const [idAEliminar, setidAEliminar] = useState<number | null>(null);
  const [mensajeAlerta, setmensajeAlerta] = useState("");
  const [tipoAlerta, settipoAlerta] = useState<"success" | "error" | null>(null);

const load = async () => {
      const res = await getInventario();
      
      setItems(res || []);
    }

  const metodoEliminarInventario = async (id: number) => {
    const res = await deleteInventario(id);
    if (res.validate) {
      setmensajeAlerta(res.msj);
      settipoAlerta("success");
      await load();
    } else {
      setmensajeAlerta(res.msj || "Error al eliminar el inventario");
      settipoAlerta("error");
    }
    setTimeout(() => {
      settipoAlerta(null);
    }, 4000);
  };

  const abrirDialogoEliminar = (id: number) => {
    setidAEliminar(id);
    dialogEliminarRef.current?.showModal();
  };

  const cerrarDialogoEliminar = () => {
    dialogEliminarRef.current?.close();
    setidAEliminar(null);
  };

  useEffect(() => {
    
    load();
  }, []);

  // Cargar datos del item cuando se abre el modal
  useEffect(() => {
    console.log("Item seleccionado:", item);  
    if (ventanaEmergente && item) {
      setNombre(item.nombre);
      setDescripcion("");
      setStock(item.stock);
      setCosto(item.costo);
      setStockMin(item.stockMin);
      setEstado(item.estado);
    }
  }, [ventanaEmergente, item]);

  // Cargar bodegas, secciones y perchas cuando se abre el modal
  useEffect(() => {
    if (ventanaEmergente && item) {
      const cargarTodo = async () => {
        try {
          // Cargar bodegas
          const bodegasRes = await getAllBodegas();
          setBodegas(bodegasRes);
          
          let bodegaId = "";
          if (item.bodega) {
            bodegaId = item.bodega.id.toString();
            setBodegaSeleccionada(bodegaId);
          } else {
            setSeccionSeleccionada("");
            setSecciones([]);
            setPerchas([]);
            return;
          }

          // Cargar secciones basado en la bodega del item
          const seccionesRes = await getSeccionesByBodega(Number(bodegaId));
          setSecciones(seccionesRes);

          let seccionId = "";
          if (item?.seccion) {
            seccionId = item.seccion.id.toString();
            setSeccionSeleccionada(seccionId);
          } else {
            setSeccionSeleccionada("");
            setPerchas([]);
            return;
          }

          // Cargar perchas basado en la sección del item
          const perchasRes = await getPerchasBySeccion(Number(seccionId));
          setPerchas(perchasRes);

          let perchaId = "";
          if (item?.percha) {
            perchaId = item.percha.id.toString();
            setperchaSeleccionada(perchaId);
          } else {
            setperchaSeleccionada("");
            return;
          }

        } catch (error) {
          console.error("Error cargando datos:", error);
        }
      };
      cargarTodo();
      console.log(item);
      setimagenEditada(item.imagen || null);
    }
  }, [ventanaEmergente, item]);

  // Cargar secciones cuando cambia la bodega seleccionada manualmente
 /* useEffect(() => {
    if (bodegaSeleccionada && ventanaEmergente && item) {
      const cargarSecciones = async () => {
        try {
          const res = await getSeccionesByBodega(Number(bodegaSeleccionada));
          setSecciones(res);
         // setSeccionSeleccionada("");
          setPerchas([]);
        } catch (error) {
          console.error("Error cargando secciones:", error);
        }
      };
      cargarSecciones();
    }
  }, [bodegaSeleccionada, ventanaEmergente, item]);

  // Cargar perchas cuando cambia la sección seleccionada manualmente
  useEffect(() => {
    if (seccionSeleccionada && ventanaEmergente && bodegaSeleccionada) {
      const cargarPerchas = async () => {
        try {
          const res = await getPerchasBySeccion(Number(seccionSeleccionada));
          setPerchas(res);
        } catch (error) {
          console.error("Error cargando perchas:", error);
        }
      };
      cargarPerchas();
    }
  }, [seccionSeleccionada, ventanaEmergente, bodegaSeleccionada]);*/

  const aplicarFiltros = async () => {
    const filtros: any = {};
    if (filtroNombre.trim() !== "") filtros.nombre = filtroNombre;
    if (filtroBodega.trim() !== "") filtros.bodega = filtroBodega;
    if (filtroStockMin !== "") filtros.stockMin = Number(filtroStockMin);
    if (filtroStockMax !== "") filtros.stockMax = Number(filtroStockMax);
    if (filtroActivo === "true") filtros.activo = true;
    if (filtroActivo === "false") filtros.activo = false;
    const res = await filtrarInventarioAdvanced(filtros);
    setItems(res || []);
  }

  const limpiarFiltros = async () => {
    setFiltroNombre("");
    setFiltroBodega("");
    setFiltroStockMin("");
    setFiltroStockMax("");
    setFiltroActivo("");
    const res = await getInventario();
    setItems(res || []);
  }

  const guardarCambios = async () => {
    if (!item) return;
    
    
    console.log(stock);
    try {
      const updateData = {
        nombre,
        descripcion,
        stock: Number(stock),
        costo: Number(costo),
        stockMin: Number(stockMin),
        estado,
        bodegaId: Number(bodegaSeleccionada),
        seccionId: Number(seccionSeleccionada),
        perchaId: item.percha ? Number(item.percha.id) : undefined,
        imagen: imagenEditada ? await ConvertToBase64(imagenEditada) : item.imagen
      };

      const res = await updateInventario(item.id, updateData);

      if (res.validate) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        sethabilitarEdicion(true);
        setventanaEmergente(false);
        load();
      } else {
        setMensajeError(res.msj || "Error al actualizar el inventario");
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
      }
    } catch (error) {
      console.error(error);
      setMensajeError("Error al actualizar el inventario");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  }

  return (
    <>
      {showSuccess && (
        <div className="fixed top-5 right-5 z-110">
          <div role="alert" className="alert alert-success shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Inventario actualizado exitosamente!</span>
          </div>
        </div>
      )}

      {showError && (
        <div className="fixed top-5 right-5 z-110">
          <div role="alert" className="alert alert-error shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{mensajeError}</span>
          </div>
        </div>
      )}

      <div className="w-full h-full rounded-2xl border border-gray-200 bg-white shadow-lg">
        <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 w-full py-4 rounded-t-2xl border-b border-cyan-200 px-6">
          <h2 className="font-bold text-white text-lg">📦 Gestión de Inventario</h2>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-4 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600">Nombre</label>
            <input className="input input-sm input-bordered focus:input-primary rounded-lg" value={filtroNombre} onChange={(e) => setFiltroNombre(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600">Bodega</label>
            <input className="input input-sm input-bordered focus:input-primary rounded-lg" value={filtroBodega} onChange={(e) => setFiltroBodega(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600">Stock Mín</label>
            <input type="number" className="input input-sm input-bordered focus:input-primary rounded-lg" value={filtroStockMin} onChange={(e) => setFiltroStockMin(e.target.value === "" ? "" : Number(e.target.value))} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600">Stock Máx</label>
            <input type="number" className="input input-sm input-bordered focus:input-primary rounded-lg" value={filtroStockMax} onChange={(e) => setFiltroStockMax(e.target.value === "" ? "" : Number(e.target.value))} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600">Estado</label>
            <select className="select select-sm select-bordered focus:select-primary rounded-lg" value={filtroActivo} onChange={(e) => setFiltroActivo(e.target.value)}>
              <option value="">Todos</option>
              <option value="true">ACTIVO</option>
              <option value="false">INACTIVO</option>
            </select>
          </div>
        </div>

        <div className="px-6 py-3 flex items-center justify-end gap-2 bg-gray-50 border-b border-gray-200">
          <button className="btn btn-sm btn-ghost hover:btn-primary gap-2" onClick={() => load()}>🔄 Refrescar</button>
          <button className="btn btn-sm btn-ghost hover:btn-warning gap-2" onClick={limpiarFiltros}>✕ Limpiar</button>
          <button className="btn btn-sm btn-primary gap-2" onClick={aplicarFiltros}>✓ Aplicar</button>
        </div>

        <div className="px-6 pb-6 pt-4">
          <div className="overflow-hidden border border-gray-200 rounded-xl shadow-sm">
            <div className="max-h-[520px] overflow-auto">
              <table className="table w-full">
                <thead className="bg-gradient-to-r from-cyan-50 to-cyan-100 sticky top-0 z-20">
                  <tr className="text-sm text-left text-gray-700 font-semibold">
                    <th className="px-4 py-3">Nombre</th>
                    <th className="px-4 py-3">Stock</th>
                    <th className="px-4 py-3">Costo</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3">Bodega</th>
                    <th className="px-4 py-3">Imagen</th>
                    <th className="px-4 py-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((u, i) => (
                    <tr key={u.id ?? i} className="border-t border-gray-100 hover:bg-cyan-50 transition-colors ">
                      <td className="px-4 py-3 font-semibold text-gray-800">{u?.nombre}</td>
                      <td className="px-4 py-3 text-gray-700">{u?.stock}</td>
                      <td className="px-4 py-3 text-gray-700">{u?.costo?.toLocaleString()}</td>
                      <td className="px-4 py-3"><span className={`badge ${u?.estado ? 'badge-success' : 'badge-error'} badge-sm`}>{u?.estado ? "ACTIVO" : "INACTIVO"}</span></td>
                      <td className="px-4 py-3 text-gray-700">{u?.bodega?.bodega}</td>
                      <td className="flex justify-center py-3">
                    {u.imagen ? (
                      <img src={u.imagen} alt="Imagen del item" className="w-12 h-12 object-cover rounded-lg border border-gray-200 " />
                    ) : (
                      <span className="text-gray-500 text-sm">N/A</span>
                    )}
                  </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex gap-2 justify-center flex-wrap">
                          <button className="btn btn-sm btn-info btn-outline gap-1 tooltip" data-tip="Ver detalles" onClick={()=>{setventanaEmergente(true); setitem(u);}}>👁️</button>
                          <button className="btn btn-sm btn-error btn-outline gap-1 tooltip" data-tip="Eliminar" onClick={() => abrirDialogoEliminar(u.id)}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {items.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center text-sm text-gray-500 py-8">No hay inventarios</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {item &&( <div className = {`fixed z-50 inset-0 transition-opacity duration-300 ${ventanaEmergente ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
       <div className='absolute inset-0 backdrop-blur-sm flex items-center justify-center'>
        <div className='relative border border-gray-300 w-full max-w-6xl h-[85vh] rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col'>
          {/* Header */}
          <div className='bg-gradient-to-r from-cyan-500 to-cyan-600 w-full py-4 px-6 flex items-center justify-between border-b border-cyan-200'>
            <h2 className='text-lg font-bold text-white'>📦 Detalles del Item</h2> 
            <button className='btn btn-circle btn-ghost btn-sm text-white hover:bg-cyan-700' onClick={()=>{setventanaEmergente(false); sethabilitarEdicion(true);}}>✕</button>
          </div>
          
          {/* Content */}
          <div className='overflow-y-auto flex-1'>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 bg-gray-50'>
              <div className='flex flex-col gap-2'>
                <label className='text-xs font-semibold text-gray-600 uppercase tracking-wider'>Nombre del Item</label>
                <input type="text" className='input input-sm input-bordered focus:input-primary rounded-lg' disabled={habilitarEdicion} value={nombre} onChange={(e) => setNombre(e.target.value)}/>
              </div>
              <div className='flex flex-col gap-2'>
                <label className='text-xs font-semibold text-gray-600 uppercase tracking-wider'>Stock Actual</label>
                <input type="number" className='input input-sm input-bordered focus:input-primary rounded-lg' disabled={habilitarEdicion} value={stock} onChange={(e) => setStock(e.target.value)}/>
              </div>
              <div className='flex flex-col gap-2'>
                <label className='text-xs font-semibold text-gray-600 uppercase tracking-wider'>Costo Unitario</label>
                <input placeholder='0.00' className='input input-sm input-bordered focus:input-primary rounded-lg' disabled={habilitarEdicion} value={costo} onChange={(e) => setCosto(e.target.value)}/>
              </div>
              <div className='flex flex-col gap-2'>
                <label className='text-xs font-semibold text-gray-600 uppercase tracking-wider'>Stock Mínimo</label>
                <input type="number" className='input input-sm input-bordered focus:input-primary rounded-lg' disabled={habilitarEdicion} value={stockMin} onChange={(e) => setStockMin(Number(e.target.value))}/>
              </div>
              <div className='flex flex-col gap-2'>
                <label className='text-xs font-semibold text-gray-600 uppercase tracking-wider'>Bodega</label>
                <select className='select select-sm select-bordered focus:select-primary rounded-lg' disabled={habilitarEdicion} value={bodegaSeleccionada} onChange={(e) => setBodegaSeleccionada(e.target.value)}>
                  <option value="">Seleccione una bodega</option>
                  {bodegas?.map(b => <option key={b.id} value={b.id}>{b.bodega}</option>)}
                </select>
              </div>
              <div className='flex flex-col gap-2'>
                <label className='text-xs font-semibold text-gray-600 uppercase tracking-wider'>Sección</label>
                <select className='select select-sm select-bordered focus:select-primary rounded-lg' disabled={habilitarEdicion} value={seccionSeleccionada} onChange={(e) => setSeccionSeleccionada(e.target.value)}>
                  <option value="">Seleccione una sección</option>
                  {secciones?.map(s => <option key={s.id} value={s.id}>{s.seccion}</option>)}
                </select>
              </div>
              <div className='flex flex-col gap-2'>
                <label className='text-xs font-semibold text-gray-600 uppercase tracking-wider'>Percha</label>
                <select className='select select-sm select-bordered focus:select-primary rounded-lg' disabled={habilitarEdicion} value={ perchaSeleccionada} onChange={(e) => setperchaSeleccionada(e.target.value)}>
                  <option value="">Seleccione una percha</option>
                  {perchas?.map(p => <option key={p.id} value={p.id}>{p.percha}</option>)}
                </select>
              </div>
              <div className='flex flex-col gap-2'>
                <label className='text-xs font-semibold text-gray-600 uppercase tracking-wider'>Estado</label>
                <select className='select select-sm select-bordered focus:select-primary rounded-lg' disabled={habilitarEdicion} value={estado ? "true" : "false"} onChange={(e) => setEstado(e.target.value === "true")}>
                  <option value="true">✓ ACTIVO</option>
                  <option value="false">✕ INACTIVO</option>
                </select>
              </div>
              <div className='flex flex-col gap-2 lg:col-span-3'>
                <label className='text-xs font-semibold text-gray-600 uppercase tracking-wider'>Imagen del Item</label>
                {imagenEditada && typeof imagenEditada ==='string' ?(
                <div  className='relative w-full h-64 bg-gray-100 rounded-lg border-2 border-cyan-200 overflow-hidden group flex items-center justify-center'>
                  <img src={typeof imagenEditada === 'string' ? imagenEditada : URL.createObjectURL(imagenEditada)} className='max-w-full max-h-full object-contain' /> 
                 {!habilitarEdicion && (
                   <div className='absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center cursor-pointer' onClick={()=>{setimagenEditada(null); if(refImg.current) refImg.current.value = "";}}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500 opacity-0 group-hover:opacity-100 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                 )}
                </div>
                ):(
                  <div className='border-2 border-dashed border-cyan-300 rounded-lg p-6 bg-cyan-50'>
                    <input type="file"
                      accept='image/*'
                      ref={refImg}
                      className='file-input file-input-bordered file-input-sm w-full'
                      disabled={habilitarEdicion}
                      onChange={(e)=> setimagenEditada(e.target.files ? e.target.files[0] : null)}
                    />
                    {imagenEditada && (
                      <p className="text-xs text-success mt-2">✓ Imagen cargada correctamente</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="w-full p-6 flex justify-between items-center border-t border-gray-200 bg-gray-50">
            {!habilitarEdicion ? (
              <>
                <button className="btn btn-primary gap-2" onClick={guardarCambios}>💾 Guardar Cambios</button>
                <button className="btn btn-ghost gap-2" onClick={() => { sethabilitarEdicion(true); }}>↶ Cancelar</button>
              </>
            ) : (
              <>
                <button className="btn btn-warning gap-2" onClick={() => { sethabilitarEdicion(!habilitarEdicion); }}>✏️ Editar</button>
                <button className="btn btn-ghost gap-2" onClick={() => { setventanaEmergente(false); sethabilitarEdicion(true); setBodegaSeleccionada(""); setSeccionSeleccionada(""); }}>Cerrar</button>
              </>
            )}
          </div>
        </div>
       </div>
      </div>)}

    {/* Modal de confirmación de eliminación */}
    <dialog ref={dialogEliminarRef} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box bg-white rounded-xl">
        <h3 className="text-lg font-bold text-gray-800 mb-2">⚠️ Confirmar eliminación</h3>
        <p className="text-gray-600 text-sm mb-6">¿Estás seguro de que deseas eliminar este item del inventario? Esta acción no se puede deshacer.</p>
        <div className="modal-action">
          <button className="btn btn-sm btn-ghost" onClick={cerrarDialogoEliminar}>Cancelar</button>
          <button className="btn btn-sm btn-error gap-2" onClick={() => { 
            if (idAEliminar !== null) {
              metodoEliminarInventario(idAEliminar);
            }
            cerrarDialogoEliminar();
          }}>🗑️ Eliminar</button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={cerrarDialogoEliminar}>close</button>
      </form>
    </dialog>

    {/* Alert de éxito/error */}
    {tipoAlerta && (
      <div className="fixed bottom-6 right-6 z-50">
        <div role="alert" className={`alert ${tipoAlerta === 'success' ? 'alert-success' : 'alert-error'}`}>
          <svg
            className="h-6 w-6 shrink-0 stroke-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24">
            {tipoAlerta === 'success' ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4v2m0-10a4 4 0 110 8 4 4 0 010-8z" />
            )}
          </svg>
          <span>{mensajeAlerta}</span>
        </div>
      </div>
    )}
    
    {/* 
    // Diseño alternativo comentado (más personalizado):
    {tipoAlerta && (
      <div className="fixed bottom-6 right-6 z-50">
        <div className={`shadow-lg rounded-xl border-2 p-4 flex items-center gap-3 ${tipoAlerta === 'success' ? 'bg-emerald-50 border-emerald-500' : 'bg-red-50 border-red-500'}`}>
          {tipoAlerta === 'success' ? (
            <svg className="w-6 h-6 text-emerald-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          )}
          <span className={`text-sm font-semibold ${tipoAlerta === 'success' ? 'text-emerald-800' : 'text-red-800'}`}>
            {mensajeAlerta}
          </span>
        </div>
      </div>
    )}
    */}
    </>
  );
}
