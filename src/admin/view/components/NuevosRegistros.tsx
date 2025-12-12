import { use, useEffect, useState } from "react";
import { crearCargo, crearCategoria, crearNuevaArea, crearNuevaMaquina, crearUsuario, getAllAreas, getAllCategorias, getAllRoles, newTipoTrabajo } from "../../controller/api/admin-api";
import type { CreateTipoTrabajo } from "../../models/create-tipo-trabajo";


export const NuevosRegistros = () => {
  
  //const [user, setuser] = useState("");
  const [areas, setareas] = useState<{ nombre: string }[]>([]);
  const [rol, setrol] = useState<{ id:number,role: string }[]>([])
  const [newArea, setnewArea] = useState("");
  const [cambioRealizado, setcambioRealizado] = useState(false);
  const [maquina, setmaquina] = useState("");
  const [categoria, setcategoria] = useState("");
  const [selectArea, setselectArea] = useState("");
  const [tipoTrabajo, settipoTrabajo] = useState("");
  const [selectRol, setselectRol] = useState(0);
  const [cargo, setcargo] = useState("");


 /* const crearNuevoUsuario = async () => {
  try {
   
  } catch (error) {
   
  }
    
  }*/

  const getAreas = async () => {
      try {
        const res = await getAllAreas();
        console.log(res);
        setareas(res);
      } catch (error) {
        console.error("Error al cargar las areas: ", error);
      }
    }

     const getRoles = async () => {
      try {
        const res = await getAllRoles();
        
        setrol(res);
      } catch (error) {
        console.error("Error al cargar los roles: ", error);

      }
    }


  useEffect(() => {
    
    getAreas();
    getRoles();
  }, []);


  const crearArea = async () =>{
    try {
      console.log(newArea);
      
      const res = await crearNuevaArea({area:newArea});
      alert(res.msj);
       console.log(res);
      getAreas();
      
    } catch (error) {
      console.error("Error al crear nueva area: ",error);
    }
  }

  const crearMaquina = async () => {
  try {
    const res = await crearNuevaMaquina({maquina:maquina,area:selectArea});
    alert(res.msj);
  } catch (error) {
    console.error("Error al crear nueva maquina: ",error);
  }
    
  }

  const crearNuevaCategoria = async () => {
    try {
     const res = await crearCategoria({nombre:categoria});
      alert(res.msj);
      
    } catch (error) {
      console.error("Error al crear nueva categoria: ",error);
    }
  }

  const crearNuevoTipoTrabajo = async () => {

    try {
    
      const res = await newTipoTrabajo({tipo:tipoTrabajo});
      alert(res.msj);
    } catch (error) {
      console.error("Error al crear nuevo tipo de trabajo: ",error);
    }
  }

  const crearNuevoCargo = async () => {

    try {
    
      const res = await crearCargo({rol:selectRol,cargo:cargo});
      alert(res.msj);
    } catch (error) {
      console.error("Error al crear nuevo tipo de trabajo: ",error);
    }
  }

  return (
    <>

        <div className='flex items-center justify-center w-4/5 bg-white h-full'>
          <div className="min-w-150 min-h-150 border border-gray-200 bg-gray-50 flex flex-col justify-center" action="" method="post">

            <div className="flex flex-col items-center justify-center border-b border-gray-200">
              <div className="bg-gray-200 w-full h-9 flex items-center justify-center mb-2"><p className="">Area</p></div>
              <label htmlFor="">Nueva area </label><input type="text" className="input mb-2" onChange={(e)=>setnewArea(e.target.value)}/>
            
            <button className="btn my-4" onClick={crearArea}>Crear</button>
            </div>
            <div className="flex flex-col items-center justify-center border-b border-gray-200">
              <div className="flex "><div className="mr-6"><label htmlFor="">Nueva maquina </label><input type="text" className="input" onChange={(e)=>setmaquina(e.target.value)}/></div>
              <div>
                <label htmlFor="">Area </label> 
              <select className="select" id="" defaultValue={"..."} onChange={(e)=>setselectArea(e.target.value)}>
                <option  disabled={true} defaultChecked={true}>...</option>
              {areas.map((a)=><>
              <option value={a.nombre}>{a.nombre}</option>
              </>)}
              </select></div></div>
              <button className="btn my-4" onClick={crearMaquina}>Crear</button>
            </div>
            <div>
              <div className="flex flex-col items-center justify-center border-b border-gray-200">
                <label htmlFor="">Nueva categoria</label> <input type="text" className="input" onChange={(e)=>setcategoria(e.target.value)}/>
                <button className="btn my-4" onClick={crearNuevaCategoria}>Crear</button>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center border-b border-gray-200 mx-2">
             <div className="flex  w-full flex-col items-center justify-center"> 
              <label htmlFor="">Nuevo tipo de trabajo</label><input type="text" className="input" onChange={(e)=>settipoTrabajo(e.target.value)}/>
           
              </div>
              <button className="btn my-4" onClick={crearNuevoTipoTrabajo}>Crear</button>
            </div>
 <div className="flex flex-col items-center justify-center border-b border-gray-200 mx-2">
             <div className="flex w-full"> 
             <div className="w-3/1 mr-4"> <label htmlFor="">Nuevo cargo</label><input type="text" className="input mb-4" onChange={(e)=>setcargo(e.target.value)}/></div>
            <div className="w-3/1">  <label htmlFor="">Rol</label>
              <select className="select"
              defaultValue={"..."}
              onChange={(e)=>setselectRol(e.target.value)}
              >
              <option disabled={true} defaultChecked={true}>...</option>
              {rol.map((r)=><>
              <option value={r.id}>{r.role}</option>
              </>)}
              </select></div>
              </div>
              <button className="btn my-4" onClick={crearNuevoCargo}>Crear</button>
            </div>
          </div>
        </div>
     
    </>
  )
}
