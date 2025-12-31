
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { generateToken } from '../../controller/api/user-api';
import type { login } from '../../models/login';

export const SignIn = () => {

    const [user, setuser] = useState("");
    const [password, setpassword] = useState("");
    const [showSuccessLogin, setshowSuccessLogin] = useState(false);
    const [showErrorLogin, setshowErrorLogin] = useState(false);
    //const [mensajeErrorLogin, setmensajeErrorLogin] = useState(fa)

    const navigate = useNavigate();

    const validateLogin = async (e)=>{
        e.preventDefault();
       const login:login = {email:user,password:password}; 
        const resLogin = await generateToken(login);

        if(resLogin.access){
          setshowSuccessLogin(true);
          setTimeout(() => {
        
        setshowSuccessLogin(false);
      navigate("/principal1");
      }, 2000);

         
        }else{
          setshowErrorLogin(true);
            setTimeout(() => {
        
        setshowErrorLogin(false);
      
      }, 2000); 
        }
    }

  return (
    <>
     {showSuccessLogin && (
      <div className="fixed top-5 right-5 z-50">
        <div role="alert" className="alert alert-success shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Datos validados, Bienvenido</span>
        </div>
      </div>
    )}

    {showErrorLogin && (
      <div className="fixed top-5 right-5 z-50">
        <div role="alert" className="alert alert-error shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Datos incorrectos</span>
        </div>
      </div>
    )}
    <div className="hero bg-base-200 min-h-screen">
  <div className="hero-content flex-col lg:flex-row-reverse items-stretch">
    <div className=" w-full max-w-sm shrink-0 shadow-2xl ">
     
      <img className='w-full ' src="public\gustaff_login.jpg" alt="" />
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
