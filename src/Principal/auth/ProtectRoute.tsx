import { useEffect, useState } from "react"
import { controlByRol } from "../controller/api/auth-api";
import { useNavigate } from "react-router-dom";


export const ProtectRoute = ({route}) => {

  const [validate, setvalidate] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
   
    const validateRoute = async () => {
        try {
          const res = await controlByRol();
            setvalidate(res.isRol);
        } catch (error) {
            console.error("Error al validar la ruta: ",error);
        }
    }

  }, [route])
  
if(validate === null) return (<div>Cargando...</div>);

if(validate === false) navigate('/principal');   
 
if(validate) return (route);
}
