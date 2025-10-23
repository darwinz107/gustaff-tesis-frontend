import React from 'react'

export const SignUp = () => {
  return (
    <>
    <div className='h-screen flex items-center justify-center'>
      <form className='p-2 border border-gray-200 rounded-md h-100 w-auto flex flex-col items-center justify-center' action="">
       <div className='flex'><label htmlFor="">Nombre: </label>
      <input className="input ml-2 my-2" type="text" name="" id="" /></div> 
        <div className='flex'><label htmlFor="">Cedula: </label>
      <input className="input ml-2 my-2" type="text" name="" id="" /></div> 
        <div className='flex'><label htmlFor="">Correo: </label>
      <input className="input ml-2 my-2" type="text" name="" id="" /></div> 
        <div className='flex'><label htmlFor="">Contraseña: </label>
      <input className="input ml-2 my-2" type="text" name="" id="" /></div> 
      <button className='btn'>Registrar</button>
    </form>
    </div> 
    </>
  )
}
