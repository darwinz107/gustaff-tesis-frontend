import { use, useEffect, useState } from "react";
import { crearNuevaArea, getAllAreas } from "../controller/api/admin-api";


export const NuevosRegistros = () => {

  const [areas, setareas] = useState<{ nombre: string }[]>([]);
  const [newArea, setnewArea] = useState(null);
  const [newCod, setnewCod] = useState(null);

  const getAreas = async () => {
      try {
        const res = await getAllAreas();
        console.log(res);
        setareas(res);
      } catch (error) {
        console.error("Error al cargar las areas: ", error);
        
      }
    }

  useEffect(() => {
    
    getAreas();
    
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


  return (
    <>


      <div className='flex relative h-screen w-auto bg-pink-200'>
        <div className='absolute inset-y-0 left-0 h-full w-1/5 z-20 bg-white border-r border-gray-300 flex flex-col'>
          <img src="public\gustaff_logo.jpg" className='cursor-pointer mb-7' alt="Gustaff S.A" />
          <div className='flex flex-col h-full'>
            <button className="btn w-full hover: bg-gray-400" >Nuevo registro</button>
            <button className="btn w-full" >Editar</button>
            <button className="btn w-full" >Eliminar</button>
          </div>
        </div>
        <div className='h-full w-1/5 bg-white'>
          xd
        </div>
        <div className='flex items-center justify-center w-4/5 bg-white h-full'>
          <div className="min-w-150 min-h-150 border border-gray-200 bg-gray-50 flex flex-col justify-center" action="" method="post">

            <div className="flex flex-col items-center justify-center border-b border-gray-200"><label htmlFor="">Nueva area </label><input type="text" className="input mb-2" onChange={(e)=>setnewArea(e.target.value)}/>
            <label htmlFor="">Codigo</label> <input type="text" className="input" onChange={(e)=>setnewCod(e.target.value)}/>
            <button className="btn my-4" onClick={crearArea}>Crear</button>
            </div>
            <div className="flex flex-col items-center justify-center border-b border-gray-200"><div><label htmlFor="">Nueva maquina </label><input type="text" className="input" /></div>
              <div><label htmlFor="">Area </label> <select className="select" id="" defaultValue={"..."}><option  disabled={true} defaultChecked={true}>...</option>
              {areas.map((a)=><>
              <option value={a.nombre}>{a.nombre}</option>
              </>)}
              </select></div>
              <button className="btn my-4">Crear</button>
            </div>
            <div>
              <div className="flex flex-col items-center justify-center border-b border-gray-200">
                <label htmlFor="">Nueva categoria</label> <input type="text" className="input" />
                <button className="btn my-4">Crear</button>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center border-b border-gray-200">
              <label htmlFor="">Nuevo tipo de categoria</label><input type="text" className="input mb-4" />
              <label htmlFor="">Categoria</label>
              <select className="select"><option defaultValue={"..."} disabled={true}>...</option></select>
              <button className="btn my-4">Crear</button>
            </div>

          </div>
        </div>
      </div>

    </>
  )
}
