import React, { useState } from 'react'
import type { ItemsPorGuardar } from '../models/itemsPorGuardar';
import { BuscarOrdenTrabajo } from './buscarOrdenTrabajo';
import type { LllenarDestino } from '../models/llenarDestino';



export const OrdenCompra = () => {
  const [comprasPorGenerar, setcomprasPorGenerar] = useState<ItemsPorGuardar[]>([]);
  const [ventanaBuscarOrdenTrabajo, setventanaBuscarOrdenTrabajo] = useState(false);
  const [infoDestino, setinfoDestino] = useState<LllenarDestino>({userSolicitante:{name:""},NumOrden:"",Area:"",Codigo:"",Maquina:""});
  return (
     <>
     <div className='w-full h-[85%] '>
        <div className='w-full h-[10%] flex items-center justify-center bg-white '>
            <button className='btn' onClick={()=>setventanaBuscarOrdenTrabajo(!ventanaBuscarOrdenTrabajo)}>Asignar orden de trabajo</button>
            <button className='btn'>Asignar item</button>
        </div>
        <div className='w-full h-[30%]'>
        <div className='border border-gray-500 text-center bg-gray-400 h-[15%] mb-4'>
            <p>Destino de orden</p>   
        </div>
        <div className='w-full h-[85%] flex flex-row'>
         <div className='w-[33.33%] h-[80%] pl-2'>
            <div className='w-[100%] h-[33.33%] flex flex-row'><p className='min-w-[17%]'>Solicitante</p><input type="text"  className='input ml-1' value={infoDestino.userSolicitante.name}  disabled={true}/></div>
            <div className='w-[100%] h-[33.34%] flex flex-row'><p className='min-w-[17%]'>Area</p><input   type="text"  className='input ml-1' value={infoDestino.Area} disabled={true}/></div>
            <div className='w-[100%] h-[33.34%] flex flex-row'><p className='min-w-[17%]'>Destino</p><input  type="text"  className='input ml-1' /></div>
          </div>
            <div className='w-[33.33%] h-[80%] '>
            <div className='w-[100%] h-[33.33%] flex flex-row'><p className='min-w-[17%]'>Autoriza</p><input type="text"  className='input ml-1' /></div>
            <div className='w-[100%] h-[33.34%] flex flex-row'><p className='min-w-[17%]'>Codigo</p><input   type="text"  className='input ml-1' value={infoDestino.Codigo} disabled={true}/></div>
            
          </div>
          <div className='w-[33.34%] h-[80%] pr-2'>
            <div className='w-[100%] h-[33.33%] flex flex-row'><p className='min-w-[17%]'>N.Orden</p><input type="text"  className='input ml-1'  value={infoDestino.NumOrden} disabled={true}/></div>
            <div className='w-[100%] h-[33.34%] flex flex-row'><p className='min-w-[17%]'>Maquina</p><input   type="text"  className='input ml-1' value={infoDestino.Maquina} disabled={true}/></div>
           
          </div>
         </div>
        </div>
             <div className='w-full min-h-[25%]'>
        <div className='border border-gray-500 text-center bg-gray-400 min-h-[20%]'>
            <p >Agregar items</p>   
        </div>
        <div className='w-full h-[80%] mt-4 text-center'>
         <div className='w-full h-[80%] pl-2 flex flex-row mb-4'>
            <div className='w-[100%]  flex flex-col'><p className='min-w-[17%]'>Cantidad</p><input  type="text"  className='input' /></div>
            <div className='w-[100%]  flex flex-col'><p className='min-w-[17%]'>Item</p><input type="text" className="input" list="browsers" />
<datalist id="browsers">
  
</datalist></div>
            <div className='w-[100%]  flex flex-col'><p className='min-w-[17%]'>Area</p><input   type="text"  className='input' /></div>
            <div className='w-[100%]  flex flex-col'><p className='min-w-[17%]'>Destino</p><input  type="text"  className='input' /></div>
          </div>
          <button className='btn'>Agregar a compras</button>
         </div>
        
        </div>
        
        <div className='w-full h-[40%] '>
          <div className='border border-gray-500 text-center bg-gray-400 min-h-[10%]'>
            <p >Compras</p>   
        </div>
        <div className='w-full h-[70%] mt-4 text-center'>
         <div className='w-full h-[90%] pl-2 flex flex-row mb-4'>
            <div className="overflow-x-auto w-full h-[100%] m-2">
          <table className="table">

            <thead >
              <tr>

                <th>Nombre</th>
                <th>Telefono</th>
                <th>Email</th>
                <th>Cargo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {comprasPorGenerar.map((u) =>
                <>
                  <tr>

                    <td>
                      {u.cantidad}
                    </td>
                    <td>
                      {u.item}

                    </td>
                    <td>{u.caracteristica}</td>
                    <td>{u.observacion}</td>
                    <td>
                      
                      <button className="btn btn-ghost btn-xs">Eliminar</button>
                    </td>
                  </tr>
                </>)}

            </tbody>

          </table>
        </div>
          </div>
          <div className=' text-center'><button className='btn'>Agregar a compras</button></div>
         </div>
        </div>
     </div>

       <div className={`z-10 fixed  bg-transparent inset-0 flex items-center justify-center transition-opacity duration-300 ${ventanaBuscarOrdenTrabajo ? "opacity-100" : "opacity-0 pointer-events-none"} `}>
           <div className={`border border-gray-300 w-4/5 h-4/5 rounded-sm fixed  bg-white`}>
           <BuscarOrdenTrabajo setinfoDestino={setinfoDestino} ventanaBuscarOrdenTrabajo={ventanaBuscarOrdenTrabajo} setventanaBuscarOrdenTrabajo={setventanaBuscarOrdenTrabajo}></BuscarOrdenTrabajo>
           </div>
           </div>
     </>
  )
}
