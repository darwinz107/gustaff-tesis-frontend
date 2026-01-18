import React, { useEffect, useRef, useState } from 'react'
import type { InfoOrdenTrabajo } from '../models/infoOrdenTrabajo';
import { filtrarOrdenSinUso, filtrarOrdenTrabajo, getAllOrdenesTrabajoSinUso } from '../controller/ordenCompraApi';
import type { LllenarDestino } from '../models/llenarDestino';

export const BuscarOrdenTrabajo = ({ventanaBuscarOrdenTrabajo,setventanaBuscarOrdenTrabajo,setinfoDestino}) => {

    const [ordenes, setordenes] = useState<LllenarDestino[]>([]);
    const callyPpopover = useRef(null);
    const [selectFechaNac, setselectFechaNac] = useState<string>('');
    const [selectUserSolicitante, setselectUserSolicitante] = useState<string>('');
    const [filtroSolicitante, setfiltroSolicitante] = useState("");
    const [filtroNOrden, setfiltroNOrden] = useState("");
    const [filtroArea, setfiltroArea] = useState("");

const preCargarOrdenes = async() =>{
        const ordenesApi = await getAllOrdenesTrabajoSinUso();
        setordenes(ordenesApi);
        console.log("ordenesApi");
        console.log(ordenesApi);
      }


    useEffect(() => {
     
      
      preCargarOrdenes();
      

    }, [ventanaBuscarOrdenTrabajo])
    

    useEffect(() => {
     const ordenTrabajoFiltrar = async() => {
      
      if(selectUserSolicitante != "" || selectFechaNac != ""){
 const res = await filtrarOrdenTrabajo({userSolicitante:selectUserSolicitante,fechaInicio:selectFechaNac});
      setordenes(res);
      console.log(res);
      }else{
preCargarOrdenes();
      }

    };
    ordenTrabajoFiltrar();
    }, [selectFechaNac,selectUserSolicitante]);

    const aplicarFiltros = async() =>{
      const res = await filtrarOrdenSinUso(filtroNOrden,filtroSolicitante,filtroArea);
      setordenes(res);
      console.log(res);
    }

    const limpiarFiltros = async() =>{
      setfiltroArea("");
      setfiltroNOrden("");
      setfiltroSolicitante("");
      preCargarOrdenes();
    }
    
  return (
    <>
     <div className='z-50 w-full bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-200 px-6 py-4 flex justify-between items-center'>
          <div className='flex items-center gap-2'>
            <span className='text-lg font-semibold text-purple-900'>🔍 Filtros</span>
            <span className='text-xs text-purple-600'>Busca órdenes de trabajo disponibles</span>
          </div>
        </div>
        <div className='w-full bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-200 px-6 py-6 '>
        <div className='flex flex-row gap-4'>
          <div className='flex-1 flex flex-col gap-1'>
           <label className='text-sm font-semibold text-gray-700'>Solicitante</label>
           <input type="text" className='input input-sm input-bordered rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-400' value={filtroSolicitante} onChange={(e)=>setfiltroSolicitante(e.target.value)} /></div>
         <div className='flex-1 flex flex-col gap-1'>
          <label className='text-sm font-semibold text-gray-700'>N.Orden de trabajo</label>
           <input type="text" className='input input-sm input-bordered rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-400' value={filtroNOrden} onChange={(e)=>setfiltroNOrden(e.target.value)} />
          </div>
           <div className='flex-1 flex flex-col gap-1'>
            <label className='text-sm font-semibold text-gray-700'>Area</label>
           <input type="text" className='input input-sm input-bordered rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-400' value={filtroArea} onChange={(e)=>setfiltroArea(e.target.value)} />
          </div>
          </div> 
           <div className="px-6 py-3 flex items-center justify-end gap-2 bg-gray-50 border-b border-gray-200">
          <button className="btn btn-sm btn-ghost hover:btn-primary gap-2" onClick={preCargarOrdenes}>🔄 Refrescar</button>
          <button className="btn btn-sm btn-ghost hover:btn-warning gap-2" onClick={limpiarFiltros}>✕ Limpiar</button>
          <button className="btn btn-sm btn-primary gap-2" onClick={aplicarFiltros}>✓ Aplicar</button>
        </div>
        </div>
        
        <div className='w-full flex-1 flex flex-col overflow-auto'>
 
        <div className="w-full flex-1   p-4">
          <table className="table table-sm">

            <thead className='bg-gradient-to-r from-purple-100 to-pink-100 border-b-2 border-purple-300'>
              <tr>

                <th className='text-purple-900'>Area</th>
                <th className='text-purple-900'>Codigo</th>
                <th className='text-purple-900'>N.Orden de trabajo</th>
                <th className='text-purple-900'>Solicitante</th>
                <th className='text-purple-900'>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ordenes?.map((u,i) =>
                <>
                  <tr className='hover:bg-purple-50 border-b border-gray-200'>

                    <td className='font-semibold text-purple-900'>
                      {u.Area}
                    </td>
                    <td className='text-gray-700'>
                      {u.Codigo}

                    </td>
                    <td className='text-gray-700'>{u.NumOrden}</td>
                    <td className='text-gray-700'>{u.userSolicitante ? u.userSolicitante.name : "N/A"}</td>
                    <td>
                      
                      <button className="btn btn-sm bg-gradient-to-r from-purple-500 to-pink-600 text-white border-none hover:from-purple-600 hover:to-pink-700 rounded-lg" onClick={()=>{setinfoDestino(u);setventanaBuscarOrdenTrabajo(!ventanaBuscarOrdenTrabajo);}}>✓ Seleccionar</button>
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
