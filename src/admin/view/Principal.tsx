import { useState } from "react"
import { NuevosRegistros } from "./components/NuevosRegistros"


export const Principal = () => {

    const [principal, setprincipal] = useState(false);
    const [nuevoRegistro, setnuevoRegistro] = useState(false);

  return (
    <>
          <div className='flex relative h-screen w-auto'>
        <div className='absolute inset-y-0 left-0 h-full w-1/5 z-20 bg-white border-r border-gray-300 flex flex-col'>
          <img src="public\gustaff_logo.jpg" className='cursor-pointer mb-7' alt="Gustaff S.A" onClick={()=>setnuevoRegistro(false)}/>
          <div className='flex flex-col h-full'>
            <button className={nuevoRegistro?"btn w-full hover: bg-gray-400":"btn w-full"} onClick={()=>setnuevoRegistro(true)}>Nuevo registro</button>
            <button className="btn w-full" >Editar</button>
            <button className="btn w-full" >Eliminar</button>
          </div>
        </div>
        <div className='h-full w-1/5 bg-white'>
          xd
        </div>
        {nuevoRegistro &&(<NuevosRegistros></NuevosRegistros>)}
      </div>
    </>
  )
}

