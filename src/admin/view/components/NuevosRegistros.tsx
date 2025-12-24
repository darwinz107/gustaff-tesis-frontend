import { use, useEffect, useState } from "react";
import { crearBodega, crearCargo, crearCategoria, crearNuevaArea, crearNuevaMaquina, crearPercha, crearSeccion, crearUsuario, getAllAreas, getAllBodegas, getAllCategorias, getAllRoles, getAllSecciones, newTipoTrabajo } from "../../controller/api/admin-api";
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
  
  // Estados para errores de validación
  const [errores, seterrores] = useState({});
  const [showError, setshowError] = useState(false);
  const [showSuccess, setshowSuccess] = useState(false);
  const [mensajeError, setmensajeError] = useState("");

  // Funciones de validación
  const validarNombre = (valor) => {
    if (!valor.trim()) return "Este campo es requerido";
    if (!/^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]+$/.test(valor)) return "Solo se permiten letras y espacios";
    return "";
  };

  const validarNombreGeneral = (valor) => {
    if (!valor.trim()) return "Este campo es requerido";
    if (!/^[a-záéíóúñA-ZÁÉÍÓÚÑ0-9\s\-_]+$/.test(valor)) return "Formato no válido";
    return "";
  };

  const validarSeleccion = (valor, mensaje = "Debe seleccionar una opción") => {
    if (!valor || valor === "..." || valor === 0) return mensaje;
    return "";
  };


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
    const error = validarNombre(newArea);
    if (error) {
      seterrores({...errores, newArea: error});
      setmensajeError(error);
      setshowError(true);
      setTimeout(() => {
        setshowError(false);
      }, 3000);
      return;
    }

    try {
      console.log(newArea);
      
      const res = await crearNuevaArea({area:newArea});
      setmensajeError(res.msj);
      setshowSuccess(true);
      setTimeout(() => {
        setshowSuccess(false);
      }, 2000);
      console.log(res);
      getAreas();
      setnewArea("");
      seterrores({...errores, newArea: ""});
      
    } catch (error) {
      console.error("Error al crear nueva area: ",error);
    }
  }

  const crearMaquina = async () => {
    const errorMaquina = validarNombreGeneral(maquina);
    const errorArea = validarSeleccion(selectArea, "Debe seleccionar un área");
    
    if (errorMaquina || errorArea) {
      seterrores({...errores, maquina: errorMaquina, selectArea: errorArea});
      setmensajeError(errorMaquina || errorArea);
      setshowError(true);
      setTimeout(() => {
        setshowError(false);
      }, 3000);
      return;
    }

    try {
      const res = await crearNuevaMaquina({maquina:maquina,area:selectArea});
      setmensajeError(res.msj);
      setshowSuccess(true);
      setTimeout(() => {
        setshowSuccess(false);
      }, 2000);
      setmaquina("");
      setselectArea("");
      seterrores({...errores, maquina: "", selectArea: ""});
    } catch (error) {
      console.error("Error al crear nueva maquina: ",error);
    }
    
  }

  const crearNuevaCategoria = async () => {
    const error = validarNombre(categoria);
    if (error) {
      seterrores({...errores, categoria: error});
      setmensajeError(error);
      setshowError(true);
      setTimeout(() => {
        setshowError(false);
      }, 3000);
      return;
    }

    try {
     const res = await crearCategoria({nombre:categoria});
      setmensajeError(res.msj);
      setshowSuccess(true);
      setTimeout(() => {
        setshowSuccess(false);
      }, 2000);
      setcategoria("");
      seterrores({...errores, categoria: ""});
      
    } catch (error) {
      console.error("Error al crear nueva categoria: ",error);
    }
  }

  const crearNuevoTipoTrabajo = async () => {
    const error = validarNombreGeneral(tipoTrabajo);
    if (error) {
      seterrores({...errores, tipoTrabajo: error});
      setmensajeError(error);
      setshowError(true);
      setTimeout(() => {
        setshowError(false);
      }, 3000);
      return;
    }

    try {
    
      const res = await newTipoTrabajo({tipo:tipoTrabajo});
      setmensajeError(res.msj);
      setshowSuccess(true);
      setTimeout(() => {
        setshowSuccess(false);
      }, 2000);
      settipoTrabajo("");
      seterrores({...errores, tipoTrabajo: ""});
    } catch (error) {
      console.error("Error al crear nuevo tipo de trabajo: ",error);
    }
  }

  const crearNuevoCargo = async () => {
    const errorCargo = validarNombreGeneral(cargo);
    const errorRol = validarSeleccion(selectRol, "Debe seleccionar un rol");
    
    if (errorCargo || errorRol) {
      seterrores({...errores, cargo: errorCargo, selectRol: errorRol});
      setmensajeError(errorCargo || errorRol);
      setshowError(true);
      setTimeout(() => {
        setshowError(false);
      }, 3000);
      return;
    }

    try {
    
      const res = await crearCargo({rol:selectRol,cargo:cargo});
      setmensajeError(res.msj);
      setshowSuccess(true);
      setTimeout(() => {
        setshowSuccess(false);
      }, 2000);
      setcargo("");
      setselectRol(0);
      seterrores({...errores, cargo: "", selectRol: ""});
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
      try {
        const res = await getAllSecciones();
      setsecciones(res);
      } catch (error) {
        console.error("Error cargando secciones:", error);
      }    
    }

  const nuevaBodega = async() =>{
     const error = validarNombreGeneral(bodega);
     if (error) {
       seterrores({...errores, bodega: error});
       setmensajeError(error);
       setshowError(true);
       setTimeout(() => {
         setshowError(false);
       }, 3000);
       return;
     }

     const res = await crearBodega({bodega:bodega});
     if(!res.ok){
      setmensajeError(res.message);
      setshowError(true);
      setTimeout(() => {
        setshowError(false);
      }, 3000);
      throw new Error("Error al crear bodega");
      
     }

     setmensajeError(res.message);
     setshowSuccess(true);
     setTimeout(() => {
       setshowSuccess(false);
     }, 2000);
     setbodega("");
     seterrores({...errores, bodega: ""});
     cargarBodegas();
   }

     const nuevaSeccion = async() =>{
     const errorSeccion = validarNombreGeneral(seccion);
     const errorBodega = validarSeleccion(bodegaId, "Debe seleccionar una bodega");
     
     if (errorSeccion || errorBodega) {
       seterrores({...errores, seccion: errorSeccion, bodegaId: errorBodega});
       setmensajeError(errorSeccion || errorBodega);
       setshowError(true);
       setTimeout(() => {
         setshowError(false);
       }, 3000);
       return;
     }

     const res = await crearSeccion({seccion:seccion,bodegaId:bodegaId});
     
     if(!res.ok){
      setmensajeError(res.message);
      setshowError(true);
      setTimeout(() => {
        setshowError(false);
      }, 3000);
       throw new Error("Error al crear seccion");   
     }

     setmensajeError(res.message);
     setshowSuccess(true);
     setTimeout(() => {
       setshowSuccess(false);
     }, 2000);
     setseccion("");
     setbodegaId(0);
     seterrores({...errores, seccion: "", bodegaId: ""});
     cargarSecciones();
   }

        const nuevaPercha = async() =>{
     const errorPercha = validarNombreGeneral(percha);
     const errorSeccion = validarSeleccion(seccionId, "Debe seleccionar una sección");
     
     if (errorPercha || errorSeccion) {
       seterrores({...errores, percha: errorPercha, seccionId: errorSeccion});
       setmensajeError(errorPercha || errorSeccion);
       setshowError(true);
       setTimeout(() => {
         setshowError(false);
       }, 3000);
       return;
     }

     const res = await crearPercha({percha:percha,seccionId:seccionId});
     if(!res.ok){
      setmensajeError(res.message);
      setshowError(true);
      setTimeout(() => {
        setshowError(false);
      }, 3000);
       throw new Error("Error al crear percha");   
     }

     setmensajeError(res.message);
     setshowSuccess(true);
     setTimeout(() => {
       setshowSuccess(false);
     }, 2000);
     setpercha("");
     setseccionId(0);
     seterrores({...errores, percha: "", seccionId: ""});
    
   }

  useEffect(() => {
    
    cargarBodegas();
    cargarSecciones();
   
  }, []);
  

  return (
  <>
    {showSuccess && (
      <div className="fixed top-5 right-5 z-50">
        <div role="alert" className="alert alert-success shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{mensajeError}</span>
        </div>
      </div>
    )}

    {showError && (
      <div className="fixed top-5 right-5 z-50">
        <div role="alert" className="alert alert-error shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{mensajeError}</span>
        </div>
      </div>
    )}
    <div className="w-full h-full p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-100 rounded-xl shadow-md p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Área</h2>
          <div className="flex flex-col gap-3">
            <div>
              <label className="block text-sm">Nueva área</label>
              <input 
                type="text" 
                className={`input w-full ${errores.newArea ? 'input-error' : ''}`} 
                onChange={(e) => {
                  setnewArea(e.target.value);
                  seterrores({...errores, newArea: validarNombre(e.target.value)});
                }} 
                value={newArea}
              />
              <div className="h-5">{errores.newArea && <p className="text-red-500 text-sm">{errores.newArea}</p>}</div>
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
              <input 
                type="text" 
                className={`input w-full ${errores.maquina ? 'input-error' : ''}`} 
                onChange={(e) => {
                  setmaquina(e.target.value);
                  seterrores({...errores, maquina: validarNombreGeneral(e.target.value)});
                }} 
                value={maquina}
              />
              <div className="h-5">{errores.maquina && <p className="text-red-500 text-sm">{errores.maquina}</p>}</div>
            </div>
            <div>
              <label className="block text-sm">Área</label>
              <select 
                className={`select w-full ${errores.selectArea ? 'select-error' : ''}`} 
                defaultValue={"..."} 
                onChange={(e) => {
                  setselectArea(e.target.value);
                  seterrores({...errores, selectArea: validarSeleccion(e.target.value, "Debe seleccionar un área")});
                }}
              >
                <option disabled={true} defaultChecked={true}>...</option>
                {areas.map((a) => <option key={a.nombre} value={a.nombre}>{a.nombre}</option>)}
              </select>
              <div className="h-5">{errores.selectArea && <p className="text-red-500 text-sm">{errores.selectArea}</p>}</div>
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
              <input 
                type="text" 
                className={`input w-full ${errores.categoria ? 'input-error' : ''}`} 
                onChange={(e) => {
                  setcategoria(e.target.value);
                  seterrores({...errores, categoria: validarNombre(e.target.value)});
                }} 
                value={categoria}
              />
              <div className="h-5">{errores.categoria && <p className="text-red-500 text-sm">{errores.categoria}</p>}</div>
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
              <input 
                type="text" 
                className={`input w-full ${errores.tipoTrabajo ? 'input-error' : ''}`} 
                onChange={(e) => {
                  settipoTrabajo(e.target.value);
                  seterrores({...errores, tipoTrabajo: validarNombreGeneral(e.target.value)});
                }} 
                value={tipoTrabajo}
              />
              <div className="h-5">{errores.tipoTrabajo && <p className="text-red-500 text-sm">{errores.tipoTrabajo}</p>}</div>
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
              <input 
                type="text" 
                className={`input w-full ${errores.cargo ? 'input-error' : ''}`} 
                onChange={(e) => {
                  setcargo(e.target.value);
                  seterrores({...errores, cargo: validarNombreGeneral(e.target.value)});
                }} 
                value={cargo}
              />
              <div className="h-5">{errores.cargo && <p className="text-red-500 text-sm">{errores.cargo}</p>}</div>
            </div>
            <div>
              <label className="block text-sm">Rol</label>
              <select
                className={`select w-full ${errores.selectRol ? 'select-error' : ''}`}
                defaultValue={"..."}
                onChange={(e) => {
                  setselectRol(e.target.value);
                  seterrores({...errores, selectRol: validarSeleccion(e.target.value, "Debe seleccionar un rol")});
                }}
              >
                <option disabled={true} defaultChecked={true}>...</option>
                {rol.map((r) => <option key={r.id} value={r.id}>{r.role}</option>)}
              </select>
              <div className="h-5">{errores.selectRol && <p className="text-red-500 text-sm">{errores.selectRol}</p>}</div>
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
              <input 
                type="text" 
                className={`input w-full ${errores.bodega ? 'input-error' : ''}`} 
                placeholder="Nombre de bodega" 
                value={bodega} 
                onChange={(e) => {
                  setbodega(e.target.value);
                  seterrores({...errores, bodega: validarNombreGeneral(e.target.value)});
                }}
              />
              <div className="h-5">{errores.bodega && <p className="text-red-500 text-sm">{errores.bodega}</p>}</div>
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
              <input 
                type="text" 
                className={`input w-full ${errores.seccion ? 'input-error' : ''}`} 
                placeholder="Nombre de sección" 
                value={seccion} 
                onChange={(e) => {
                  setseccion(e.target.value);
                  seterrores({...errores, seccion: validarNombreGeneral(e.target.value)});
                }}
              />
              <div className="h-5">{errores.seccion && <p className="text-red-500 text-sm">{errores.seccion}</p>}</div>
            </div>
            <div>
              <label className="block text-sm">Bodega</label>
              <select 
                className={`select w-full ${errores.bodegaId ? 'select-error' : ''}`} 
                defaultValue={"..."} 
                onChange={(e) => {
                  setbodegaId(e.target.value);
                  seterrores({...errores, bodegaId: validarSeleccion(e.target.value, "Debe seleccionar una bodega")});
                }}
              >
                <option value="..." disabled={true} defaultChecked={true}>Seleccione una bodega</option>
      {bodegas?.map(bodega => (
        <option key={bodega.id} value={bodega.id}>{bodega.bodega}</option>
      ))}
              </select>
              <div className="h-5">{errores.bodegaId && <p className="text-red-500 text-sm">{errores.bodegaId}</p>}</div>
            </div>
            <div className="flex justify-end">
              <button type="button" className="btn" onClick={nuevaSeccion}>Crear</button>
            </div>
          </div>
        </div>

        <div className="bg-gray-100 rounded-xl shadow-md p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Percha</h2>
          <div className="flex flex-col gap-3">
            <div>
              <label className="block text-sm">Nueva percha</label>
              <input 
                type="text" 
                className={`input w-full ${errores.percha ? 'input-error' : ''}`} 
                placeholder="Nombre de percha" 
                value={percha} 
                onChange={(e) => {
                  setpercha(e.target.value);
                  seterrores({...errores, percha: validarNombreGeneral(e.target.value)});
                }}
              />
              <div className="h-5">{errores.percha && <p className="text-red-500 text-sm">{errores.percha}</p>}</div>
            </div>
            <div>
              <label className="block text-sm">Sección</label>
              <select 
                className={`select w-full ${errores.seccionId ? 'select-error' : ''}`} 
                defaultValue={"..."} 
                onChange={(e) => {
                  setseccionId(e.target.value);
                  seterrores({...errores, seccionId: validarSeleccion(e.target.value, "Debe seleccionar una sección")});
                }}
              >
                      <option value="..." disabled={true} defaultChecked={true}>Seleccione una sección</option>
      {secciones?.map(seccion => (
        <option key={seccion.id} value={seccion.id}>{seccion.seccion}</option>
      ))}

              </select>
              <div className="h-5">{errores.seccionId && <p className="text-red-500 text-sm">{errores.seccionId}</p>}</div>
            </div>
            <div className="flex justify-end">
              <button type="button" className="btn" onClick={nuevaPercha}>Crear</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
);

}
