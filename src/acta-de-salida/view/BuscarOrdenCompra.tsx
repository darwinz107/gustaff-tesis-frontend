import React, { useEffect, useRef, useState } from 'react'

import { getAllSolicitudes, getAllSolicitudesParciales } from '../../orden-de-compra/controller/ordenCompraApi';
import type { BuscarSolMaterial } from '../../orden-de-compra/models/buscarSolMaterial';
import type { DetallesPrevioCompra } from '../../orden-de-compra/models/DetallesPrevioCompra';

export const BuscarOrdenCompra = ({ordenes,setventanaBuscarOrdenTrabajo,ventanaBuscarOrdenTrabajo,setidSolMaterial}) => {
    const callyPpopover = useRef(null);
    const [filtroNumSolicitud, setFiltroNumSolicitud] = useState("");
    const [filtroSolicitante, setFiltroSolicitante] = useState("");
    const [filtroAutoriza, setFiltroAutoriza] = useState("");
    const [ordenesFiltradasLocal, setOrdenesFiltradasLocal] = useState<DetallesPrevioCompra[]>([]);

    useEffect(() => {
      setOrdenesFiltradasLocal(ordenes || []);
    }, [ordenes]);

    const aplicarFiltros = () => {
      const resultados = (ordenes || []).filter((orden) => {
        const cumpleNumOrden = !filtroNumSolicitud || 
          orden.numOrden?.toLowerCase().includes(filtroNumSolicitud.toLowerCase());
        
        const cumpleSolicitante = !filtroSolicitante || 
          orden.numOrdenTrabajo?.userSolicitante?.name?.toLowerCase().includes(filtroSolicitante.toLowerCase());
        
        const cumpleAutoriza = !filtroAutoriza || 
          orden.Autoriza?.toLowerCase().includes(filtroAutoriza.toLowerCase());
        
        return cumpleNumOrden && cumpleSolicitante && cumpleAutoriza;
      });
      setOrdenesFiltradasLocal(resultados);
    };

    const limpiarFiltros = () => {
      setFiltroNumSolicitud("");
      setFiltroSolicitante("");
      setFiltroAutoriza("");
      setOrdenesFiltradasLocal(ordenes || []);
    };

  

  return (
    <>
     <div className='w-full bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200 px-6 py-4 flex justify-between items-center'>
          <div className='flex items-center gap-2'>
            <span className='text-lg font-semibold text-amber-900'>🔍 Filtros</span>
            <span className='text-xs text-amber-600'>Busca y filtra solicitudes</span>
          </div>
        </div>
        <div className='w-full bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200 px-6 py-6 flex flex-row gap-4'>
         <div className='flex-1 flex flex-col gap-1'>
           <label className='text-sm font-semibold text-gray-700'>N° Solicitud</label>
           <input type="text" className='input input-sm input-bordered rounded-lg focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-400' placeholder="Buscar..." value={filtroNumSolicitud} onChange={(e) => setFiltroNumSolicitud(e.target.value)} /></div>
         <div className='flex-1 flex flex-col gap-1'>
           <label className='text-sm font-semibold text-gray-700'>Solicitante</label>
           <input type="text" className='input input-sm input-bordered rounded-lg focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-400' placeholder="Buscar..." value={filtroSolicitante} onChange={(e) => setFiltroSolicitante(e.target.value)} /></div>
         <div className='flex-1 flex flex-col gap-1'>
           <label className='text-sm font-semibold text-gray-700'>Autoriza</label>
           <input type="text" className='input input-sm input-bordered rounded-lg focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-400' placeholder="Buscar..." value={filtroAutoriza} onChange={(e) => setFiltroAutoriza(e.target.value)} /></div>
         <div className='flex items-end gap-2'>
           <button className='btn btn-sm btn-primary gap-2' onClick={aplicarFiltros}>✓ Aplicar</button>
           <button className='btn btn-sm btn-ghost gap-2' onClick={limpiarFiltros}>✕ Limpiar</button>
         </div>
        </div>
        
        <div className='w-full flex-1 overflow-hidden flex flex-col'>
 
        <div className="w-full flex-1 overflow-y-auto overflow-x-auto p-4">
          <table className="table table-sm">

            <thead className='bg-gradient-to-r from-amber-100 to-orange-100 border-b-2 border-amber-300'>
              <tr>

                <th className='text-amber-900'>N.Solicitud</th>
                <th className='text-amber-900'>Fecha de remision</th>
                <th className='text-amber-900'>Solicitante</th>
                <th className='text-amber-900'>Autoriza</th>
                <th className='text-amber-900'>Descripcion</th>
                <th className='text-amber-900'>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ordenesFiltradasLocal && ordenesFiltradasLocal.length > 0 ? (
                ordenesFiltradasLocal.map((u, i) =>
                  <tr key={u.id} className='hover:bg-amber-50 border-b border-gray-200'>
                    <td className='font-semibold text-amber-900'>
                      {u.numOrden}
                    </td>
                    <td className='text-gray-700'>
                      {u.fechaRemision ? u.fechaRemision.split("T")[0] : "N/A"}
                    </td>
                    <td className='text-gray-700'>
                      {u.numOrdenTrabajo?.userSolicitante?.name ?? "N/A"}
                    </td>
                    <td className='text-gray-700'>{u.Autoriza ?? "N/A"}</td>
                    <td className='text-gray-700'>{u.numOrdenTrabajo ? u.numOrdenTrabajo?.DescripcionTrabajo : "N/A"}</td>
                    <td>
                      <button className="btn btn-sm bg-gradient-to-r from-amber-500 to-orange-600 text-white border-none hover:from-amber-600 hover:to-orange-700 rounded-lg" onClick={() => {setidSolMaterial(u.id); console.log(u.id); setventanaBuscarOrdenTrabajo(!ventanaBuscarOrdenTrabajo);}}>✓ Seleccionar</button>
                    </td>
                  </tr>
                )
              ) : (
                <tr>
                  <td colSpan={6} className='text-center text-gray-500 py-8'>
                    No se encontraron solicitudes
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
          
        </div>
        
    </>
  )
}
