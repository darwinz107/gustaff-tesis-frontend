import React, { useEffect, useState } from 'react'
import type { Inventarios } from '../models/inventarios';
import { getInventario, filtrarInventarioAdvanced } from '../controller/inventario-api';

export const GestionInventario = () => {
  const [items, setItems] = useState<Inventarios[]>([]);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroBodega, setFiltroBodega] = useState<string>("");
  const [filtroStockMin, setFiltroStockMin] = useState<number | "">("");
  const [filtroStockMax, setFiltroStockMax] = useState<number | "">("");
  const [filtroActivo, setFiltroActivo] = useState<string>("");

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
                      <td className="px-4 py-3 text-center">
                        <div className="flex gap-2 justify-center">
                          <button className="btn btn-ghost btn-xs" disabled>Ver detalles</button>
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
    </>
  );
}
