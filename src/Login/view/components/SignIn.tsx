
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
          navigate("/principal1");
        }else{
            alert("Datos incorrectos");
        }
    }

  return (
    <>
    
        <div className='flex  w-200 h-100 border border-gray-200 rounded-md'>
            <div className='p-2 flex items-center justify-center w-1/2 flex flex-col'>
                <form className='flex flex-col items-center'  onSubmit={(e)=>validateLogin(e)}>
                    <div className='flex flex-col'>
                        <input className="input mb-2 w-70" type="text" name="" id="" placeholder='user' onChange={(e)=>setuser(e.target.value)}/>
                        <input placeholder='password' className="input mb-2 w-70" type="password"  onChange={(e)=>setpassword(e.target.value)}/>
                    </div>  
                    <button className="btn w-30" type="submit" >Sign In</button>
                </form>
                <div> <a href="#" className='hover:underline'>Restaurar la contraseña</a></div>
            </div>
            <div className='h-full border-l border-gray-200'></div>
            <div className=' w-1/2 flex items-center justify-center'>
                
              <img className='h-full w-full' src="http://scontent.fgye1-2.fna.fbcdn.net/v/t1.6435-9/62355054_675108326287393_6534742468271800320_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=cBKisg3w_zQQ7kNvwEw9nVe&_nc_oc=Adm8RGwaWWVfJFRiTgpoC74MPNRcODpCmmY0nV9WamM_TLmMwydob5yoxK6VSy1jx5Y&_nc_zt=23&_nc_ht=scontent.fgye1-2.fna&_nc_gid=Oyf74rH4nboAh3a_JIBCQA&oh=00_AfgGYour7ptvSjzBlvk7rphsgH3r2w5vmd5BCaiF1iiAYg&oe=6950F336" alt="" />
            </div>
        </div>
    
    </>
  )
}
