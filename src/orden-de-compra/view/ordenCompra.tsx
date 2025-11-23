import React from 'react'

export const OrdenCompra = () => {
  return (
     <>
     <div className='w-full h-4/5 bg-blue-500'>
        <div className='w-full h-[10%] flex items-center justify-center bg-white '>
            <button className='btn'>Asignar orden de trabajo</button>
            <button className='btn'>Asignar item</button>
        </div>
        <div className='w-full h-[40%]'>
        <div className='border border-gray-500 text-center bg-gray-400 h-[15%]'>
            <p >Destino de orden</p>   
        </div>
        <div className='w-full h-[85%] flex flex-row'>
         <div className='w-[33.33%] h-[80%] pl-2'>
            <div className='w-[100%] h-[33.33%]'><p>Solicitante</p><input type="text"  className='input'  /></div>
            <div className='w-[100%] h-[33.34%]'><p>Area</p><input   type="text"  className='input' /></div>
            <div className='w-[100%] h-[33.34%]'><p>Destino</p><input  type="text"  className='input' /></div>
          </div>
            <div className='w-[33.33%] h-[80%]'>
            <div className='w-[100%] h-[33.33%]'><p>Solicitante</p><input type="text"  className='input'  /></div>
            <div className='w-[100%] h-[33.34%]'><p>Area</p><input   type="text"  className='input' /></div>
            
          </div>
          <div className='w-[33.34%] h-[80%] pr-2'>
            <div className='w-[100%] h-[33.33%]'><p>Solicitante</p><input type="text"  className='input'  /></div>
            <div className='w-[100%] h-[33.34%]'><p>Area</p><input   type="text"  className='input' /></div>
           
          </div>
         </div>
        </div>
             <div className='w-full h-[20%]'>
        <div className='border border-gray-500 text-center bg-gray-400 h-[15%]'>
            <p >Agregar items</p>   
        </div>
        <div className='w-full h-[85%] flex flex-row'>
         <div className='w-[33.33%] h-[80%] pl-2'>
            <div className='w-[100%] h-[33.33%]'><p>Solicitante</p><input type="text"  className='input'  /></div>
            <div className='w-[100%] h-[33.34%]'><p>Area</p><input   type="text"  className='input' /></div>
            <div className='w-[100%] h-[33.34%]'><p>Destino</p><input  type="text"  className='input' /></div>
          </div>
         </div>
         <div className='w-full h-[85%]'></div>
        </div>
     </div>
     </>
  )
}
