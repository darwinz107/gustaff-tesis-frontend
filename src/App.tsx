
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
        <div className='absolute inset-y-0 left-0 h-full w-1/5 z-20 bg-red-200 border-r border-yellow-200'>
          xd
        </div>
        <div className='h-full w-1/5 bg-white'>
          xd
        </div>
        <div className=' w-4/5 bg-blue-200 h-full'>
      <button className="btn" onClick={soloAdmin}>Solo admin</button>
      <button className="btn" onClick={()=>navigate('/orden-de-trabajo')}>Orden de trabajo</button>
      <button className="btn" onClick={logout}>Cerrar sesion</button></div>
</div>
    </>
  )
}

export default App
