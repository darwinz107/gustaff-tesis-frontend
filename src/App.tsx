
import './App.css'
import { controlByRol, logoutSession } from './Principal/controller/api/auth-api'
import { useNavigate } from 'react-router-dom'

function App() {
  
  const navigate = useNavigate();

  const soloAdmin = async () =>{
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
   
  }

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
      
      
      <div className='flex relative h-screen w-auto bg-pink-200'>
        <div className='absolute inset-y-0 left-0 h-full w-1/5 z-20 bg-white border-r border-gray-300 flex flex-col'>
        <img src="public\gustaff_logo.jpg" className='cursor-pointer mb-7' alt="Gustaff S.A" />
        <div className='flex flex-col h-full'> 
           <button className="btn w-full" onClick={soloAdmin}>Solo admin</button>
      <button className="btn w-full" onClick={()=>navigate('/orden-de-trabajo')}>Orden de trabajo</button>
      <button className="btn w-full" onClick={logout}>Cerrar sesion</button>
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
