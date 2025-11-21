
import React from 'react'

export const NuevoUsuario = ({showCrearUsuario,setshowCrearUsuario}) => {
  return (
    <>
    
        <div className='w-full h-[12%] flex justify-between p-5'>
          <div>Listado de ordenes</div>
          <div onClick={() =>  setshowCrearUsuario(!showCrearUsuario)} className='cursor-pointer'>❌</div>
        </div>
        <div className='w-full h-[76%] border-y border-gray-300 px-4 flex'>
          <div className='w-[33.33%] h-[100%]'>
            <div className='w-[100%] h-[33.33%]'><p>Nombre</p><input type="text"  className='input' /></div>
            <div className='w-[100%] h-[33.33%]'><p>Fecha de nacimiento</p><input type="text"  className='input' /></div>
            <div className='w-[100%] h-[33.34%]'><p>Cargo</p><input type="text"  className='input' /></div>
          </div>
          <div className='w-[33.33%] h-[100%]'>
            <div className='w-[100%] h-[33.33%]'><p>Nombre</p><input type="text"  className='input' /></div>
            <div className='w-[100%] h-[33.33%]'><p>Fecha de nacimiento</p><input type="text"  className='input' /></div>
            <div className='w-[100%] h-[33.34%]'><p>Cargo</p><input type="text"  className='input' /></div>
          </div>
          <div className='w-[33.34%] h-[100%]'>
            <div className='w-[100%] h-[33.33%]'><p>Nombre</p><input type="text"  className='input' /></div>
            <div className='w-[100%] h-[33.33%]'><p>Fecha de nacimiento</p><input type="text"  className='input' /></div>
            <div className='w-[100%] h-[33.34%]'><p>Cargo</p><input type="text"  className='input' /></div>
          </div>
        </div>
        <div className='w-full h-[12%] flex justify-between p-5'>

         
           
          <button className='btn'>Hecho</button>
            <button className='btn' onClick={() =>  setshowCrearUsuario(!showCrearUsuario)}>Cancelar</button>
         
        </div>
    </>
  )
}
