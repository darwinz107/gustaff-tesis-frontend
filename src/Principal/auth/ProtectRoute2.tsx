import { useEffect, useState } from "react"
import { controlByRol, controlByUser1, controlByUser2 } from "../controller/api/auth-api";
import { Navigate, useNavigate } from "react-router-dom";


export const ProtectRoute2 = ({route}) => {

  const [validate, setvalidate] = useState(null);
  const [validate1, setvalidate1] = useState(null);
  const [validate2, setvalidate2] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
   
    const validateRoute = async () => {
        try {
          const res = await controlByRol();
          console.log("res ProtectRoute: ",res);  
            setvalidate(res.isRol);
            console.log("validate ProtectRoute: ",res.isRol);

          const res1 = await controlByUser1();
          setvalidate1(res1.isRol);
          console.log("validate1 ProtectRoute: ",res1.isRol);
          
          const res2 = await controlByUser2();
          setvalidate2(res2.isRol);
          console.log("validate2 ProtectRoute: ",res2.isRol);
        } catch (error) {
            console.error("Error al validar la ruta: ",error);
        }
    }

    validateRoute();

  }, [route])
  
//if(validate === null)  return (route);

if(validate) return <Navigate to='/admin'></Navigate>
if(validate1) return <Navigate to='/principal1'></Navigate>; 
if(validate2) return (route);
//if(!validate && !validate1 && !validate2) return <Navigate to='/'></Navigate>  ;
}
