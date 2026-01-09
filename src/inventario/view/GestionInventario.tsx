import React, { useEffect, useRef, useState } from 'react'
import type { Inventarios } from '../models/inventarios';
import { getInventario, filtrarInventarioAdvanced, updateInventario } from '../controller/inventario-api';
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

const load = async () => {
      const res = await getInventario();
      
      setItems(res || []);
    }

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

      <div className="min-w-[70%] min-h-[60%] rounded-xl border border-gray-200 m-4 bg-white shadow-sm">
        <div className="bg-gray-100 w-full h-12 flex items-center justify-between rounded-t-lg border-b px-4">
          <p className="font-semibold text-gray-700">Listado de Inventarios</p>
          <div className="flex items-center gap-2">
             <button className="btn btn-sm btn-ghost" onClick={() => load()}>Refrescar</button>
            <button className="btn btn-sm btn-ghost" onClick={limpiarFiltros}>Limpiar</button>
            <button className="btn btn-sm btn-outline" onClick={aplicarFiltros}>Aplicar filtros</button>
          </div>
        </div>

        <div className="p-4 grid grid-cols-1 lg:grid-cols-5 gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Nombre</label>
            <input className="input input-sm" value={filtroNombre} onChange={(e) => setFiltroNombre(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Bodega</label>
            <input className="input input-sm" value={filtroBodega} onChange={(e) => setFiltroBodega(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Stock min</label>
            <input type="number" className="input input-sm" value={filtroStockMin} onChange={(e) => setFiltroStockMin(e.target.value === "" ? "" : Number(e.target.value))} />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Stock max</label>
            <input type="number" className="input input-sm" value={filtroStockMax} onChange={(e) => setFiltroStockMax(e.target.value === "" ? "" : Number(e.target.value))} />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Estado</label>
            <select className="select select-sm" value={filtroActivo} onChange={(e) => setFiltroActivo(e.target.value)}>
              <option value="">Todos</option>
              <option value="true">ACTIVO</option>
              <option value="false">INACTIVO</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto p-5">
          <div className="overflow-hidden border rounded-lg">
            <div className="max-h-[520px] overflow-auto">
              <table className="table w-full">
                <thead className="bg-white sticky top-0">
                  <tr className="text-sm text-left text-gray-600">
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
                    <tr key={u.id ?? i} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{u?.nombre}</td>
                      <td className="px-4 py-3">{u?.stock}</td>
                      <td className="px-4 py-3">{u?.costo}</td>
                      <td className="px-4 py-3">{u?.estado ? "ACTIVO" : "INACTIVO"}</td>
                      <td className="px-4 py-3">{u?.bodega?.bodega}</td>
                      <td className="flex justify-center">
                    {u.imagen ? (
                      <img src={u.imagen} alt="Imagen del item" className="w-12 h-12 object-cover rounded" />
                    ) : (
                      <span className="text-gray-500 text-sm">N/A</span>
                    )}
                  </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex gap-2 justify-center">
                          <button className="btn btn-ghost btn-xs" onClick={()=>{setventanaEmergente(true); setitem(u);}}>Ver detalles</button>
                          <button className="btn btn-ghost btn-xs" disabled>Eliminar</button>
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
        <div className='relative border border-gray-300 w-full max-w-6xl h-[85vh] rounded-md bg-white shadow-lg overflow-y-auto flex flex-col'>
          <div>
          <div className='w-full h-14 flex items-center justify-between border-b p-4'>
            <h2 className='text-lg font-semibold text-gray-700'>Detalles del item</h2> 
            <button className='btn btn-ghost btn-sm cursor-pointer ' onClick={()=>{setventanaEmergente(false); sethabilitarEdicion(true);}}>Cerrar</button>
          </div>
          <div className='grid grid-cols-3 gap-4 p-4 '>
            <div>
              <label className='text-sm text-gray-500 block'>Item</label>
              <input type="text" className='input input-sm' disabled={habilitarEdicion} value={nombre} onChange={(e) => setNombre(e.target.value)}/>
            </div>
             <div>
              <label className='text-sm text-gray-500 block'>Stock</label>
              <input type="number" className='input input-sm' disabled={habilitarEdicion} value={stock} onChange={(e) => setStock(e.target.value)}/>
            </div>
             <div>
              <label className='text-sm text-gray-500 block'>Costo</label>
              <input placeholder='0.00' className='input input-sm' disabled={habilitarEdicion} value={costo} onChange={(e) => setCosto(e.target.value)}/>
            </div>
             <div>
              <label className='text-sm text-gray-500 block'>Stock Min</label>
              <input type="number" className='input input-sm' disabled={habilitarEdicion} value={stockMin} onChange={(e) => setStockMin(Number(e.target.value))}/>
            </div>
             <div>
              <label className='text-sm text-gray-500 block'>Bodega</label>
              <select className='select select-sm' disabled={habilitarEdicion} value={bodegaSeleccionada} onChange={(e) => setBodegaSeleccionada(e.target.value)}>
                <option value="">Seleccione una bodega</option>
                {bodegas?.map(b => <option key={b.id} value={b.id}>{b.bodega}</option>)}
              </select>
            </div>
            <div>
              <label className='text-sm text-gray-500 block'>Seccion</label>
              <select className='select select-sm' disabled={habilitarEdicion} value={seccionSeleccionada} onChange={(e) => setSeccionSeleccionada(e.target.value)}>
                <option value="">Seleccione una sección</option>
                {secciones?.map(s => <option key={s.id} value={s.id}>{s.seccion}</option>)}
              </select>
            </div>
            <div>
              <label className='text-sm text-gray-500 block'>Percha</label>
              <select className='select select-sm' disabled={habilitarEdicion} value={ perchaSeleccionada} onChange={(e) => setperchaSeleccionada(e.target.value)}>
                <option value="">Seleccione una percha</option>
                {perchas?.map(p => <option key={p.id} value={p.id}>{p.percha}</option>)}
              </select>
            </div>
             <div>
              <label className='text-sm text-gray-500 block'>Estado</label>
              <select className='select select-sm' disabled={habilitarEdicion} value={estado ? "true" : "false"} onChange={(e) => setEstado(e.target.value === "true")}>
                <option value="true">ACTIVO</option>
                <option value="false">INACTIVO</option>
              </select>
            </div>
             <div>
              <label className='text-sm text-gray-500 block'>Imagen</label>
              {imagenEditada && typeof imagenEditada ==='string' ?(
              <div  className='relative w-full h-60 overflow-hidden group'>
                <img src={typeof imagenEditada === 'string' ? imagenEditada : URL.createObjectURL(imagenEditada)} className='w-full h-full object-contain ' /> 
               <button onClick={()=>{setimagenEditada(null); if(refImg.current) refImg.current.value = ""; console.log("Hice clic")}} className='cursor-pointer absolute inset-0 flex items-center justify-center bg-white bg-opacity-0 group-hover:bg-opacity-50 transition opacity-0 group-hover:opacity-50'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          
              </button>
              </div>
              ):(
<div>
  <input type="file"
  accept='image/*'
  ref={refImg}
  className='file-input'
  disabled={habilitarEdicion}
  onChange={(e)=> setimagenEditada(e.target.files ? e.target.files[0] : null)}
  />
    {imagenEditada && (
                          <p className="text-xs text-green-600 mt-1">Imagen cargada</p>
                        )}
</div>
              )}
            
            </div>

          </div>
          </div>
           <div className=" w-full p-4 flex justify-between items-center px-6 border-t mt-auto">
            {!habilitarEdicion ? (
              <>
                <button className="btn btn-primary" onClick={guardarCambios}>Hecho</button>
                <button className="btn" onClick={() => { sethabilitarEdicion(true); }}>Cancelar</button>
              </>
            ) : (
              <>
                <button className="btn" onClick={() => { sethabilitarEdicion(!habilitarEdicion); }}>Editar</button>
                <button className="btn btn-ghost" onClick={() => { setventanaEmergente(false); sethabilitarEdicion(true); setBodegaSeleccionada(""); setSeccionSeleccionada(""); }}>Cerrar</button>
              </>
            )}
          </div>
        </div>
       </div>
       
      </div>)}
    </>
  );
}
