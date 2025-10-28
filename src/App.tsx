
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
      
      <div className='text-lg font-sans font-bold'>Hello world</div>
      <button className="btn" onClick={soloAdmin}>Solo admin</button>
      <button className="btn" onClick={()=>navigate('/orden-de-trabajo')}>Orden de trabajo</button>
      <button className="btn" onClick={logout}>Cerrar sesion</button>

    </>
  )
}

export default App
