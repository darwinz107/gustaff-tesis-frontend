import React, { useState } from 'react'
import { logoutSession } from '../../Principal/controller/api/auth-api';
import { useNavigate } from 'react-router-dom';
import { CrearActaSalida } from '../../acta-de-salida/view/CrearActaSalida';
import { GestionSalida } from '../../acta-de-salida/view/GestionSalida';
import { CrearActaEntrada } from '../../acta-de-entrada/view/CrearActaEntrada';
import { GestionEntrada } from '../../acta-de-entrada/view/GestionEntrada';




export const Rol2Main = () => {

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
    <CrearActaSalida></CrearActaSalida>,
    <GestionSalida></GestionSalida>,
    <CrearActaEntrada></CrearActaEntrada>,
    <GestionEntrada></GestionEntrada>
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
  <div tabIndex={0} role="button" className="btn w-full border-none" >Entrada de inventario</div>
  <ul tabIndex="-1" className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm w-full ">
    <li><a onClick={()=>setcargarComponente(3)}>Nueva entrada</a></li>
    <li><a onClick={()=>setcargarComponente(4)}>Gestion de actas de entradas</a></li>
  </ul>
</div>
<div className="w-full dropdown dropdown-hover" >
  <div tabIndex={0} role="button" className="btn w-full border-none" >Salida de inventario</div>
  <ul tabIndex="-1" className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm w-full ">
    <li><a onClick={()=>setcargarComponente(1)}>Nueva salida</a></li>
    <li><a onClick={()=>setcargarComponente(2)}>Gestion de actas de salidas</a></li>
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

    </>
  )
}