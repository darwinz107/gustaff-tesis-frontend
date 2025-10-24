import { useState } from "react"
import { createUser } from "../../controller/api/user-api";
import type { user } from "../../models/user";


export const SignUp = () => {

  const [newUser, setnewUser] = useState(Array(4));

  const asignarValues=(e:any,num:number)=>{
    const userArray = newUser; 
    userArray[num] = e.target.value; 
    setnewUser(userArray);
  }

  const registrar = async(e:any)=>{
    e.preventDefault();
    const user:user = {name:newUser[0],identification:newUser[1],cellphone:newUser[2],email:newUser[3],password:newUser[4]}
    const registrarApi = await createUser(user);
    alert(registrarApi);
  }

  return (
    <>
    <div className='h-screen flex items-center justify-center'>
      <form className='p-2 border border-gray-200 rounded-md h-100 w-auto flex flex-col items-center justify-center' onSubmit={(e)=>registrar(e)}>
       <div className='flex'><label htmlFor="">Nombre: </label>
      <input className="input ml-2 my-2" type="text" name="" id="" onChange={(e)=>asignarValues(e,0)}/></div> 
      <div className='flex'><label htmlFor="">Cedula: </label>
      <input className="input ml-2 my-2" type="text" name="" id="" onChange={(e)=>asignarValues(e,1)}/></div> 
        <div className='flex'><label htmlFor="">Celular: </label>
      <input className="input ml-2 my-2" type="text" name="" id="" onChange={(e)=>asignarValues(e,2)}/></div> 
        <div className='flex'><label htmlFor="">Correo: </label>
      <input className="input ml-2 my-2" type="text" name="" id="" onChange={(e)=>asignarValues(e,3)}/></div> 
        <div className='flex'><label htmlFor="">Contraseña: </label>
      <input className="input ml-2 my-2" type="password" name="" id="" onChange={(e)=>asignarValues(e,4)}/></div> 
      <button className='btn' type="submit">Registrar</button>
    </form>
    </div> 
    </>
  )
}
