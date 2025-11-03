import { useEffect, useState } from "react"
import { controlByRol } from "../controller/api/auth-api";
import { Navigate, useNavigate } from "react-router-dom";


export const ProtectRoute = ({route}) => {

  const [validate, setvalidate] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
   
    const validateRoute = async () => {
        try {
          const res = await controlByRol();
          console.log("res ProtectRoute: ",res);  
            setvalidate(res.isRol);
        } catch (error) {
            console.error("Error al validar la ruta: ",error);
        }
    }

    validateRoute();

  }, [route])
  
if(validate === null)  return (route);

if(validate) return <Navigate to='/admin'></Navigate>  
 
if(!validate) return (route);
}
