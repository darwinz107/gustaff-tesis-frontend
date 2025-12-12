import React, { useEffect, useRef, useState } from 'react'
import type { InfoOrdenTrabajo } from '../models/infoOrdenTrabajo';
import { filtrarOrdenTrabajo, getAllOrdenesTrabajoSinUso } from '../controller/ordenCompraApi';
import type { LllenarDestino } from '../models/llenarDestino';

export const BuscarOrdenTrabajo = ({ventanaBuscarOrdenTrabajo,setventanaBuscarOrdenTrabajo,setinfoDestino}) => {

    const [ordenes, setordenes] = useState<LllenarDestino[]>([]);
    const callyPpopover = useRef(null);
    const [selectFechaNac, setselectFechaNac] = useState<string>('');
    const [selectUserSolicitante, setselectUserSolicitante] = useState<string>('');

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
    
  return (
    <>
     <div className='w-full h-[10%] flex justify-between p-5 '>
          <div>Filtros</div>
          <div onClick={() => { setventanaBuscarOrdenTrabajo(!ventanaBuscarOrdenTrabajo);preCargarOrdenes(); }} className='cursor-pointer'>❌</div>
        </div>
        <div className='w-full h-[20%] border-y border-gray-300 px-4 flex flex-row'>
         <div className='h-full w-[33.33%]'><p>Solicitante</p><input type="text" className='input' onChange={(e)=>{setselectUserSolicitante(e.target.value);}}/></div>
         <div className='h-full w-[33.33%]'><p>Fecha</p><button type="button" onClick={() => { callyPpopover.current?.showPopover() }} className="input input-border" id="cally" style={{ anchorName: "--cally" }}>
                  Pick a date
                </button>
                <div popover="auto" ref={callyPpopover} className="dropdown bg-base-100 rounded-box shadow-lg" style={{ positionAnchor: "--cally" }}>
                  <calendar-date className="cally" onchange={(e) =>{document.getElementById("cally").innerText = e.target.value; setselectFechaNac(e.target.value);}}>
                    <svg aria-label="Previous" className="fill-current size-4" slot="previous" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.75 19.5 8.25 12l7.5-7.5"></path></svg>
                    <svg aria-label="Next" className="fill-current size-4" slot="next" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="m8.25 4.5 7.5 7.5-7.5 7.5"></path></svg>
                    <calendar-month></calendar-month>
                  </calendar-date>
                </div></div>
         <div className='h-full w-[33.34%]'></div>
        </div>
        
        <div className='w-full h-[70%] flex justify-between p-5'>
 
        <div className="overflow-x-auto w-full h-[100%] m-2">
          <table className="table">

            <thead >
              <tr>

                <th>Area</th>
                <th>Codigo</th>
                <th>N.Orden de trabajo</th>
                <th>Solicitante</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ordenes.map((u,i) =>
                <>
                  <tr>

                    <td>
                      {u.Area}
                    </td>
                    <td>
                      {u.Codigo}

                    </td>
                    <td>{u.NumOrden}</td>
                    <td>{u.userSolicitante.name}</td>
                    <td>
                      
                      <button className="btn btn-ghost btn-xs" onClick={()=>{setinfoDestino(u);setventanaBuscarOrdenTrabajo(!ventanaBuscarOrdenTrabajo);}}>Seleccionar</button>
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
