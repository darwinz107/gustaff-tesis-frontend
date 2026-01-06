import React, { useEffect, useState } from 'react'
import type { Inventarios } from '../models/inventarios';
import { getInventario, filtrarInventarioAdvanced } from '../controller/inventario-api';

export const GestionInventario = () => {
  const [items, setItems] = useState<Inventarios[]>([]);
  const [item, setitem] = useState<Inventarios | null>(null);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroBodega, setFiltroBodega] = useState<string>("");
  const [filtroStockMin, setFiltroStockMin] = useState<number | "">("");
  const [filtroStockMax, setFiltroStockMax] = useState<number | "">("");
  const [filtroActivo, setFiltroActivo] = useState<string>("");
  const [ventanaEmergente, setventanaEmergente] = useState(false);

const load = async () => {
      const res = await getInventario();
      setItems(res || []);
    }

  useEffect(() => {
    
    load();
  }, []);

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

  return (
    <>
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
                          <button className="btn btn-ghost btn-xs" onClick={()=>{setventanaEmergente(true); setitem(u)}}>Ver detalles</button>
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
        <div className='relative border border-gray-300 w-full max-w-6xl h-[85vh] rounded-md bg-white shadow-lg overflow-y-auto'>
          <div className='w-full h-14 flex items-center justify-between border-b p-4'>
            <h2 className='text-lg font-semibold text-gray-700'>Detalles del item</h2> 
            <button className='btn btn-ghost btn-sm cursor-pointer ' onClick={()=>setventanaEmergente(false)}>Cerrar</button>
          </div>
          <div className='grid grid-cols-3 gap-4 p-4 '>
            <div>
              <label className='text-sm text-gray-500 block'>Item</label>
              <input type="text" className='input input-sm' disabled value={item.nombre}/>
            </div>
             <div>
              <label className='text-sm text-gray-500 block'>Stock</label>
              <input type="text" className='input input-sm' disabled value={item.stock}/>
            </div>
             <div>
              <label className='text-sm text-gray-500 block'>Costo</label>
              <input type="text" className='input input-sm' disabled value={item.costo}/>
            </div>
             <div>
              <label className='text-sm text-gray-500 block'>Bodega</label>
              <input type="text" className='input input-sm' disabled value={item.bodega ? item.bodega.bodega:"N/A"}/>
            </div>
             <div>
              <label className='text-sm text-gray-500 block'>Estado</label>
              <input type="text" className='input input-sm' disabled value={item.estado ? "ACTIVO":"INACTIVO"}/>
            </div>
             <div>
              <label className='text-sm text-gray-500 block'>Imagen</label>
              {item.imagen ?(
              <div  className='relative w-full h-60 overflow-hidden group'>
                <img src={item.imagen} className='w-full h-full object-contain ' /> 
               <button className='cursor-pointer absolute inset-0 flex items-center justify-center bg-white bg-opacity-0 group-hover:bg-opacity-50 transition opacity-0 group-hover:opacity-50'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
              </button>
              </div>
              ):(
<div>
  <input type="file"
  accept='image/*'
  className='file-input'
  />
</div>
              )}
            
            </div>

          </div>
        </div>
       </div>
      </div>)}
    </>
  );
}
