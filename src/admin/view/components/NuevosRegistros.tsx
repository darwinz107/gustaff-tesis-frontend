import { use, useEffect, useState } from "react";
import { crearCategoria, crearNuevaArea, crearNuevaMaquina, getAllAreas, getAllCategorias } from "../../controller/api/admin-api";


export const NuevosRegistros = () => {

  const [areas, setareas] = useState<{ nombre: string }[]>([]);
  const [categorias, setcategorias] = useState<{nombre:string}[]>([]);
  const [newArea, setnewArea] = useState(null);
  const [newCod, setnewCod] = useState(null);
  const [maquina, setmaquina] = useState(null);
  const [categoria, setcategoria] = useState(null);
  const [selectArea, setselectArea] = useState(null);

  const getAreas = async () => {
      try {
        const res = await getAllAreas();
        console.log(res);
        setareas(res);
      } catch (error) {
        console.error("Error al cargar las areas: ", error);
        
      }
    }

     const getCategorias = async () => {
    try {
      const res = await getAllCategorias();
      setcategorias(res);

    } catch (error) {
      console.error("Error al cargar las categorias: ", error);
    }
  }


  useEffect(() => {
    
    getAreas();
    getCategorias();

    
  }, []);


  const crearArea = async () =>{
    try {
      console.log(newArea);
      
      const res = await crearNuevaArea({area:newArea,cod:newCod});
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
      getCategorias();
    } catch (error) {
      console.error("Error al crear nueva categoria: ",error);
    }
  }

 



  return (
    <>

        <div className='flex items-center justify-center w-4/5 bg-white h-full'>
          <div className="min-w-150 min-h-150 border border-gray-200 bg-gray-50 flex flex-col justify-center" action="" method="post">

            <div className="flex flex-col items-center justify-center border-b border-gray-200"><label htmlFor="">Nueva area </label><input type="text" className="input mb-2" onChange={(e)=>setnewArea(e.target.value)}/>
            <label htmlFor="">Codigo</label> <input type="text" className="input" onChange={(e)=>setnewCod(e.target.value)}/>
            <button className="btn my-4" onClick={crearArea}>Crear</button>
            </div>
            <div className="flex flex-col items-center justify-center border-b border-gray-200"><div><label htmlFor="">Nueva maquina </label><input type="text" className="input" onChange={(e)=>setmaquina(e.target.value)}/></div>
              <div><label htmlFor="">Area </label> <select className="select" id="" defaultValue={"..."} onChange={(e)=>setselectArea(e.target.value)}><option  disabled={true} defaultChecked={true}>...</option>
              {areas.map((a)=><>
              <option value={a.nombre}>{a.nombre}</option>
              </>)}
              </select></div>
              <button className="btn my-4" onClick={crearMaquina}>Crear</button>
            </div>
            <div>
              <div className="flex flex-col items-center justify-center border-b border-gray-200">
                <label htmlFor="">Nueva categoria</label> <input type="text" className="input" onChange={(e)=>setcategoria(e.target.value)}/>
                <button className="btn my-4" onClick={crearNuevaCategoria}>Crear</button>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center border-b border-gray-200">
              <label htmlFor="">Nuevo tipo de categoria</label><input type="text" className="input mb-4" />
              <label htmlFor="">Categoria</label>
              <select className="select"
              defaultValue={"..."}
              >
              <option disabled={true} defaultChecked={true}>...</option>
              {categorias.map((c)=><>
              <option value={c.nombre}>{c.nombre}</option>
              </>)}
              </select>
              <button className="btn my-4">Crear</button>
            </div>

          </div>
        </div>
     
    </>
  )
}
