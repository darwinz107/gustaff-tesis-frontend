
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
    <div className="hero bg-base-200 min-h-screen">
  <div className="hero-content flex-col lg:flex-row-reverse items-stretch">
    <div className=" w-full max-w-sm shrink-0 shadow-2xl ">
     
      <img className='w-full ' src="http://scontent.fgye1-2.fna.fbcdn.net/v/t1.6435-9/62355054_675108326287393_6534742468271800320_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=cBKisg3w_zQQ7kNvwEw9nVe&_nc_oc=Adm8RGwaWWVfJFRiTgpoC74MPNRcODpCmmY0nV9WamM_TLmMwydob5yoxK6VSy1jx5Y&_nc_zt=23&_nc_ht=scontent.fgye1-2.fna&_nc_gid=Oyf74rH4nboAh3a_JIBCQA&oh=00_AfgGYour7ptvSjzBlvk7rphsgH3r2w5vmd5BCaiF1iiAYg&oe=6950F336" alt="" />
    </div>
    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
      <div className="card-body">
        <fieldset className="fieldset">
          <label className="label">Email</label>
          <input type="email" className="input" placeholder="Email" onChange={(e)=>setuser(e.target.value)}/>
          <label className="label">Password</label>
          <input type="password" className="input" placeholder="Password" onChange={(e)=>setpassword(e.target.value)}/>
          <div><a className="link link-hover">Forgot password?</a></div>
          <button className="btn btn-neutral mt-4" onClick={(e)=>validateLogin(e)}>Login</button>
        </fieldset>
      </div>
    </div>
  </div>
</div>


    
    </>
  )
}
