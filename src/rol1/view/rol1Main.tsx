import React, { useState } from 'react'
import { logoutSession } from '../../Principal/controller/api/auth-api';
import { CrearOrden } from '../../orden-de-trabajo/view/components/CrearOrden';
import { HistorialOrdenes } from '../../orden-de-trabajo/view/components/HistorialOrdenes';
import { VerDetalles } from '../../orden-de-trabajo/view/components/VerDetalles';
import { OrdenCompra } from '../../orden-de-compra/view/ordenCompra';
import { GestionCompra } from '../../orden-de-compra/view/GestionCompra';
import { useNavigate } from 'react-router-dom';



export const Rol1Main = () => {

   const navigate = useNavigate();
   const [ventanaEmergente, setventanaEmergente] = useState(false);

   const logout = async () =>{
    try {
      const res = await logoutSession();
    
      alert(res.msj);
      navigate('/');
    
    } catch (error) {
      console.error("Error al cargar la api: ",error);
    }
   
  }

  const componentes = 
  [
    <></>,
    <CrearOrden></CrearOrden>,
    <HistorialOrdenes setValidate={setventanaEmergente}></HistorialOrdenes>,
    <OrdenCompra></OrdenCompra>,
    <GestionCompra></GestionCompra>
  ]

  const [cargarComponente, setcargarComponente] = useState<number>(0);

  return (
      <>
      
      
      <div className='flex  h-screen w-auto bg-pink-200'>
        <div className='absolute inset-y-0 left-0 h-full w-1/5 z-0 bg-white border-r border-gray-300 flex flex-col'>
        <img src="public\logo_alternativo.png" className='cursor-pointer my-7' alt="Gustaff S.A" onClick={()=>setcargarComponente(0)}/>
        <div className='flex flex-col h-full'> 
   <div className='min-w-min border-y border-gray-300 mx-4'>
    <div className="w-full dropdown dropdown-hover" >
  <div tabIndex={0} role="button" className="btn w-full border-none" >Orden de trabajo</div>
  <ul tabIndex="-1" className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm w-full ">
    <li><a onClick={()=>setcargarComponente(1)}>Nueva orden</a></li>
    <li><a onClick={()=>setcargarComponente(2)}>Gestion de orden</a></li>
  </ul>
</div>
<div className="w-full dropdown dropdown-hover" >
  <div tabIndex={0} role="button" className="btn w-full border-none" >Solicitud de materiales</div>
  <ul tabIndex="-1" className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm w-full ">
    <li><a onClick={()=>setcargarComponente(3)}>Nueva solicitud</a></li>
    <li><a onClick={()=>setcargarComponente(4)}>Gestion de solicitud</a></li>
  </ul>
</div>
<button className="btn w-full border-none" onClick={logout}>Cerrar sesion</button>
</div>
      
   </div>
     

      </div>
        
        <div className='h-full w-1/5 bg-white'>
          xd
        </div>
        <div className=' w-4/5 bg-white h-full flex items-center justify-center'>
        {
         componentes[cargarComponente]
        }
        
     </div>
 </div>   

<VerDetalles setventanaEmergente={setventanaEmergente} ventanaEmergente={ventanaEmergente}></VerDetalles>
    </>
  )
}