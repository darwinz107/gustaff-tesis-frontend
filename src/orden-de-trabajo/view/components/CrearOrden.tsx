import React from 'react'

export const CrearOrden = () => {
  return (
    <>
    <div className='flex items-center justify-center mt-8'>
   <form className='w-170 border border-black-700' action="">
     <div className=' mb-4'>
        <p className='border-4 border-black-800'>Tiempos de trabajo</p>
        <div>
            <div className='flex flex-row mb-3 my-4'>
                <p>Fecha y hora planificada</p> <input type="text" className='border border-black-800 mr-2'/> <input type="text" name="" id="" />
                <p>Tiempo estimado</p> <input type="text" />
            </div>
            <div className='flex flex-row'><p>Fecha estimada de finalizacion</p> <input type="text" name="" id="" /></div>
        </div>
     </div>

      <div>
        <p className='border-4 border-black-800'>Ubicacion</p>
      </div>
   </form>
   </div>
    </>
  )
}
