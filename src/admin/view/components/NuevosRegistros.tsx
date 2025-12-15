import { use, useEffect, useState } from "react";
import { crearBodega, crearCargo, crearCategoria, crearNuevaArea, crearNuevaMaquina, crearUsuario, getAllAreas, getAllBodegas, getAllCategorias, getAllRoles, getAllSecciones, newTipoTrabajo } from "../../controller/api/admin-api";
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
  const [bodega, setbodega] = useState("");
  const [seccion, setseccion] = useState("");
  const [bodegaId, setbodegaId] = useState(0);
  const [percha, setpercha] = useState("");
  const [seccionId, setseccionId] = useState(0);
  const [bodegas, setbodegas] = useState<{id:number,bodega:string}[]>([]);
  const [secciones, setsecciones] = useState<{id:number,seccion:string}[]>([]);


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

  const cargarBodegas = async()=>{
    try {
        const res = await getAllBodegas();
      console.log(res);
      setbodegas(res);
    } catch (error) {
      console.error("Error cargando bodegas:", error);
    }
    
    }

    const cargarSecciones = async()=>{
      const res = await getAllSecciones();
      setsecciones(res);
    }

  const nuevaBodega = async() =>{
     const res = await crearBodega({bodega:bodega});
     if(!res.ok){
       throw new Error("Error al obtener bodegas");
      alert(res.message);
      
     }

     alert(res.message);
     cargarBodegas();
   }


  useEffect(() => {
    
    cargarBodegas();
    cargarSecciones();
   
  }, []);
  

  return (
  <>
    <div className="w-full h-full p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-100 rounded-xl shadow-md p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Área</h2>
          <div className="flex flex-col gap-3">
            <div>
              <label className="block text-sm">Nueva área</label>
              <input type="text" className="input w-full" onChange={(e) => setnewArea(e.target.value)} />
            </div>
            <div className="flex justify-end">
              <button className="btn" onClick={crearArea}>Crear</button>
            </div>
          </div>
        </div>

        <div className="bg-gray-100 rounded-xl shadow-md p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Máquina</h2>
          <div className="flex flex-col gap-3">
            <div>
              <label className="block text-sm">Nueva máquina</label>
              <input type="text" className="input w-full" onChange={(e) => setmaquina(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm">Área</label>
              <select className="select w-full" defaultValue={"..."} onChange={(e) => setselectArea(e.target.value)}>
                <option disabled={true} defaultChecked={true}>...</option>
                {areas.map((a) => <option key={a.nombre} value={a.nombre}>{a.nombre}</option>)}
              </select>
            </div>
            <div className="flex justify-end">
              <button className="btn" onClick={crearMaquina}>Crear</button>
            </div>
          </div>
        </div>

        <div className="bg-gray-100 rounded-xl shadow-md p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Categoría</h2>
          <div className="flex flex-col gap-3">
            <div>
              <label className="block text-sm">Nueva categoría</label>
              <input type="text" className="input w-full" onChange={(e) => setcategoria(e.target.value)} />
            </div>
            <div className="flex justify-end">
              <button className="btn" onClick={crearNuevaCategoria}>Crear</button>
            </div>
          </div>
        </div>

        <div className="bg-gray-100 rounded-xl shadow-md p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Tipo de trabajo</h2>
          <div className="flex flex-col gap-3">
            <div>
              <label className="block text-sm">Nuevo tipo de trabajo</label>
              <input type="text" className="input w-full" onChange={(e) => settipoTrabajo(e.target.value)} />
            </div>
            <div className="flex justify-end">
              <button className="btn" onClick={crearNuevoTipoTrabajo}>Crear</button>
            </div>
          </div>
        </div>

        <div className="bg-gray-100 rounded-xl shadow-md p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Cargo</h2>
          <div className="flex flex-col gap-3">
            <div>
              <label className="block text-sm">Nuevo cargo</label>
              <input type="text" className="input w-full" onChange={(e) => setcargo(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm">Rol</label>
              <select
                className="select w-full"
                defaultValue={"..."}
                onChange={(e) => setselectRol(e.target.value)}
              >
                <option disabled={true} defaultChecked={true}>...</option>
                {rol.map((r) => <option key={r.id} value={r.id}>{r.role}</option>)}
              </select>
            </div>
            <div className="flex justify-end">
              <button className="btn" onClick={crearNuevoCargo}>Crear</button>
            </div>
          </div>
        </div>

        <div className="bg-gray-100 rounded-xl shadow-md p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Bodega</h2>
          <div className="flex flex-col gap-3">
            <div>
              <label className="block text-sm">Nueva bodega</label>
              <input type="text" className="input w-full" placeholder="Nombre de bodega" value={bodega} onChange={(e)=>setbodega(e.target.value)}/>
            </div>
            <div className="flex justify-end">
              <button type="button" className="btn" onClick={nuevaBodega}>Crear</button>
            </div>
          </div>
        </div>

        <div className="bg-gray-100 rounded-xl shadow-md p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Sección</h2>
          <div className="flex flex-col gap-3">
            <div>
              <label className="block text-sm">Nueva sección</label>
              <input type="text" className="input w-full" placeholder="Nombre de sección" value={seccion} onChange={(e)=>setseccion(e.target.value)}/>
            </div>
            <div>
              <label className="block text-sm">Bodega</label>
              <select className="select w-full" defaultValue={"..."} onChange={(e)=>setbodegaId(e.target.value)}>
                <option value="..." disabled={true} defaultChecked={true}>Seleccione una bodega</option>
      {bodegas.map(bodega => (
        <option key={bodega.id} value={bodega.id}>{bodega.bodega}</option>
      ))}
              </select>
            </div>
            <div className="flex justify-end">
              <button type="button" className="btn">Crear</button>
            </div>
          </div>
        </div>

        <div className="bg-gray-100 rounded-xl shadow-md p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Percha</h2>
          <div className="flex flex-col gap-3">
            <div>
              <label className="block text-sm">Nueva percha</label>
              <input type="text" className="input w-full" placeholder="Nombre de percha" value={percha} onChange={(e)=>setpercha(e.target.value)}/>
            </div>
            <div>
              <label className="block text-sm">Sección</label>
              <select className="select w-full" defaultValue={"..."} onChange={(e)=>setseccionId(e.target.value)}>
                      <option value="..." disabled={true} defaultChecked={true}>Seleccione una sección</option>
      {secciones.map(seccion => (
        <option key={seccion.id} value={seccion.id}>{seccion.seccion}</option>
      ))}

              </select>
            </div>
            <div className="flex justify-end">
              <button type="button" className="btn">Crear</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
);

}
