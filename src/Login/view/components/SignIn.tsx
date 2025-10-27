
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { generateToken } from '../../controller/api/user-api';
import type { login } from '../../models/login';

export const SignIn = () => {

    const [user, setuser] = useState("");
    const [password, setpassword] = useState("");

    const navigate = useNavigate();

    const validateLogin = async (e)=>{
        e.preventDefault();
       const login:login = {email:user,password:password}; 
        const resLogin = await generateToken(login);

        if(resLogin.access){
          alert(resLogin.msj);
          navigate("/principal");
        }else{
            alert("Datos incorrectos");
        }
    }

  return (
    <>
    
        <div className='flex py-10 w-200 h-100 border border-gray-200 rounded-md'>
            <div className='p-2 flex items-center justify-center w-1/2'>
                <form className='flex flex-col items-center'  onSubmit={(e)=>validateLogin(e)}>
                    <div className='flex flex-col'>
                        <input className="input mb-2 w-70" type="text" name="" id="" placeholder='user' onChange={(e)=>setuser(e.target.value)}/>
                        <input placeholder='password' className="input mb-2 w-70" type="password"  onChange={(e)=>setpassword(e.target.value)}/>
                    </div>  
                    <button className="btn w-30" type="submit" >Sign In</button>
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
