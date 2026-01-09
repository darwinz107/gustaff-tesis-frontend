import React, { useEffect, useRef, useState } from 'react'

import { getAllSolicitudes, getAllSolicitudesParciales } from '../../orden-de-compra/controller/ordenCompraApi';
import type { BuscarSolMaterial } from '../../orden-de-compra/models/buscarSolMaterial';

export const BuscarOrdenCompra = ({ordenes,setventanaBuscarOrdenTrabajo,ventanaBuscarOrdenTrabajo,setidSolMaterial}) => {
    const callyPpopover = useRef(null);

  

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
           <label className='text-sm font-semibold text-gray-700'>Solicitante</label>
           <input type="text" className='input input-sm input-bordered rounded-lg focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-400' /*onChange={(e)=>{setselectUserSolicitante(e.target.value);}}*//></div>
         <div className='flex-1 flex flex-col gap-1'>
           <label className='text-sm font-semibold text-gray-700'>Fecha</label>
           <button type="button" onClick={() => { callyPpopover.current?.showPopover() }} className="input input-sm input-bordered rounded-lg text-left focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-400" id="cally" style={{ anchorName: "--cally" }}>
                  📅 Pick a date
                </button>
                <div popover="auto" ref={callyPpopover} className="dropdown bg-base-100 rounded-box shadow-lg" style={{ positionAnchor: "--cally" }}>
                  <calendar-date className="cally" onchange={(e) =>{document.getElementById("cally").innerText = e.target.value; /*setselectFechaNac(e.target.value);*/}}>
                    <svg aria-label="Previous" className="fill-current size-4" slot="previous" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.75 19.5 8.25 12l7.5-7.5"></path></svg>
                    <svg aria-label="Next" className="fill-current size-4" slot="next" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="m8.25 4.5 7.5 7.5-7.5 7.5"></path></svg>
                    <calendar-month></calendar-month>
                  </calendar-date>
                </div></div>
        </div>
        
        <div className='w-full flex-1 overflow-hidden flex flex-col'>
 
        <div className="w-full flex-1 overflow-y-auto overflow-x-auto p-4">
          <table className="table table-sm">

            <thead className='bg-gradient-to-r from-amber-100 to-orange-100 border-b-2 border-amber-300'>
              <tr>

                <th className='text-amber-900'>N.Orden</th>
                <th className='text-amber-900'>Fecha de remision</th>
                <th className='text-amber-900'>Autoriza</th>
                <th className='text-amber-900'>Destino</th>
                <th className='text-amber-900'>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ordenes.map((u,i) =>
                <>
                  <tr className='hover:bg-amber-50 border-b border-gray-200'>

                    <td className='font-semibold text-amber-900'>
                      {u.numOrden}
                    </td>
                    <td className='text-gray-700'>
                      {u.fechaRemision.split("T")[0]}

                    </td>
                    <td className='text-gray-700'>{u.Autoriza}</td>
                    <td className='text-gray-700'>{u.Destino}</td>
                    <td>
                      
                      <button className="btn btn-sm bg-gradient-to-r from-amber-500 to-orange-600 text-white border-none hover:from-amber-600 hover:to-orange-700 rounded-lg" onClick={()=>{setidSolMaterial(u.id); console.log(u.id);setventanaBuscarOrdenTrabajo(!ventanaBuscarOrdenTrabajo);}}>✓ Seleccionar</button>
                    </td>
                  </tr>
                </>)}

            </tbody>

          </table>
        </div>
          
        </div>
        
    </>
  )
}
