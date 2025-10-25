import React from 'react'
import { useNavigate } from 'react-router-dom'

export const SignIn = () => {

    const navigate = useNavigate();

  return (
    <>
    
        <div className='flex py-10 w-200 h-100 border border-gray-200 rounded-md'>
            <div className='p-2 flex items-center justify-center w-1/2'>
                <form className='flex flex-col items-center'  action="">
                    <div className='flex flex-col'>
                        <input className="input mb-2 w-70" type="text" name="" id="" placeholder='user' />
                        <input placeholder='password' className="input mb-2 w-70" type="password"  />
                    </div>  
                    <button className="btn w-30">Sign In</button>
                </form>
            </div>
            <div className='h-full border-l border-gray-200'></div>
            <div className='p-2 w-1/2 flex items-center justify-center'>
                
                <button className="btn" onClick={()=>navigate("/registrar")}>SignUp</button>
            </div>
        </div>
    
    </>
  )
}
