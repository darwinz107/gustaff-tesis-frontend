
import './App.css'

import { useNavigate } from 'react-router-dom'
import { logoutSession } from './Principal/controller/api/auth-api';

function App() {
  
  const navigate = useNavigate();

  /*const soloAdmin = async () =>{
    try {
       const res = await controlByRol();
    if(res.isRol){
       alert("Acceso permitido");
    }else{
      alert("Acceso no permitido");
    }
    } catch (error) {
      console.error("Error al cargar la api: ",error);
    }
   
  }*/

   const logout = async () =>{
    try {
      const res = await logoutSession();
    
      alert(res.msj);
      navigate('/');
    
    } catch (error) {
      console.error("Error al cargar la api: ",error);
    }
   
  }

  return (
    <>
      
      
      <div className='flex  h-screen w-auto bg-pink-200'>
        <div className='absolute inset-y-0 left-0 h-full w-1/5 z-20 bg-white border-r border-gray-300 flex flex-col'>
        <img src="public\logo_alternativo.png" className='cursor-pointer my-7' alt="Gustaff S.A" />
        <div className='flex flex-col h-full'> 
   <div className='min-w-min border-y border-gray-300 mx-4'>
     <div className="w-full dropdown dropdown-hover" >
  <div tabIndex={0} role="button" className="btn w-full border-none">Orden de trabajo </div>
  <ul tabIndex="-1" className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm w-full ">
    <li><a onClick={()=>navigate('/crear-orden')}>Generar</a></li>
    <li><a>Historial</a></li>
  </ul>
</div>
      <button className="btn w-full border-none" onClick={logout}>Cerrar sesion</button>
   </div>
     

      </div>
        </div>
        <div className='h-full w-1/5 bg-white'>
          xd
        </div>
        <div className=' w-4/5 bg-white h-full'>
     </div>
</div>
    </>
  )
}

export default App
