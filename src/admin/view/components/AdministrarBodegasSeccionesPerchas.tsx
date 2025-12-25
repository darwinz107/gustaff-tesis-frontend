import React, { useEffect, useState } from 'react'
import { crearBodega, crearSeccion, crearPercha, getAllBodegas, getAllSecciones, getPerchasBySeccion, actualizarBodega, actualizarSeccion, actualizarPercha, eliminarBodega, eliminarSeccion, eliminarPercha } from '../../controller/api/admin-api';

interface Bodega {
  id?: number;
  bodega: string;
}

interface Seccion {
  id?: number;
  seccion: string;
  bodegaId?: number;
  bodega?: string;
}

interface Percha {
  id?: number;
  percha: string;
  seccionId?: number;
  seccion?: string;
}

export const AdministrarBodegasSeccionesPerchas = () => {
  // Estados para crear bodega
  const [bodega, setbodega] = useState("");
  const [bodegas, setbodegas] = useState<Bodega[]>([]);

  // Estados para crear sección
  const [seccion, setseccion] = useState("");
  const [bodegaIdSeccion, setbodegaIdSeccion] = useState<number | "">("");
  const [secciones, setsecciones] = useState<Seccion[]>([]);

  // Estados para crear percha
  const [percha, setpercha] = useState("");
  const [seccionIdPercha, setseccionIdPercha] = useState<number | "">("");
  const [perchas, setperchas] = useState<Percha[]>([]);

  // Estados para edición
  const [bodegaEnEdicion, setbodegaEnEdicion] = useState<Bodega | null>(null);
  const [seccionEnEdicion, setseccionEnEdicion] = useState<Seccion | null>(null);
  const [perchaEnEdicion, setperchaEnEdicion] = useState<Percha | null>(null);
  const [ventanaEdicionBodega, setventanaEdicionBodega] = useState(false);
  const [ventanaEdicionSeccion, setventanaEdicionSeccion] = useState(false);
  const [ventanaEdicionPercha, setventanaEdicionPercha] = useState(false);

  // Estados para alertas
  const [showSuccess, setshowSuccess] = useState(false);
  const [showError, setshowError] = useState(false);
  const [mensajeError, setmensajeError] = useState("");

  // Estados para errores de validación
  const [erroresBodega, seterroresBodega] = useState("");
  const [erroresSeccion, seterroresSeccion] = useState({ seccion: "", bodega: "" });
  const [erroresPercha, seterroresPercha] = useState({ percha: "", seccion: "" });

  // Funciones de validación
  const validarNombre = (valor: string) => {
    if (!valor.trim()) return "Este campo es requerido";
    if (!/^[a-záéíóúñA-ZÁÉÍÓÚÑ0-9\s\-_]+$/.test(valor)) return "Formato no válido";
    return "";
  };

  const validarSeleccion = (valor: number | string) => {
    if (!valor || valor === "") return "Debe seleccionar una opción";
    return "";
  };

  // Cargar datos iniciales
  useEffect(() => {
    cargarBodegas();
    cargarSecciones();
    cargarPerchas();
  }, []);

  const cargarBodegas = async () => {
    try {
      const res = await getAllBodegas();
      setbodegas(res);
    } catch (error) {
      console.error("Error al cargar bodegas:", error);
    }
  };

  const cargarSecciones = async () => {
    try {
      const res = await getAllSecciones();
      setsecciones(res);
    } catch (error) {
      console.error("Error al cargar secciones:", error);
    }
  };

  const cargarPerchas = async () => {
    try {
      const res = await getPerchasBySeccion();
      setperchas(res || []);
    } catch (error) {
      console.error("Error al cargar perchas:", error);
    }
  };

  // CRUD BODEGAS
  const crearBodegaMetodo = async () => {
    const error = validarNombre(bodega);
    if (error) {
      seterroresBodega(error);
      setmensajeError(error);
      setshowError(true);
      setTimeout(() => setshowError(false), 3000);
      return;
    }

    try {
      const res = await crearBodega({ bodega });
      setmensajeError(res.message || "Bodega creada correctamente");
      setshowSuccess(true);
      setTimeout(() => setshowSuccess(false), 2000);
      setbodega("");
      seterroresBodega("");
      cargarBodegas();
    } catch (error) {
      console.error("Error al crear bodega:", error);
    }
  };

  // const editarBodega = (bod: Bodega) => {
  //   setbodegaEnEdicion({ ...bod });
  //   seterroresBodega("");
  //   setventanaEdicionBodega(true);
  // };

  // const guardarEdicionBodega = async () => {
  //   if (!bodegaEnEdicion) return;
  //   
  //   const error = validarNombre(bodegaEnEdicion.bodega);
  //   if (error) {
  //     seterroresBodega(error);
  //     setmensajeError(error);
  //     setshowError(true);
  //     setTimeout(() => setshowError(false), 3000);
  //     return;
  //   }

  //   try {
  //     const res = await actualizarBodega(bodegaEnEdicion.id, { bodega: bodegaEnEdicion.bodega });
  //     setmensajeError(res.message || "Bodega actualizada correctamente");
  //     setshowSuccess(true);
  //     setTimeout(() => setshowSuccess(false), 2000);
  //     setventanaEdicionBodega(false);
  //     seterroresBodega("");
  //     cargarBodegas();
  //   } catch (error) {
  //     console.error("Error al actualizar bodega:", error);
  //   }
  // };

  // const eliminarBodegaMetodo = async (id: number | undefined) => {
  //   if (!id) return;
  //   
  //   try {
  //     const res = await eliminarBodega(id);
  //     setmensajeError(res.message || "Bodega eliminada correctamente");
  //     setshowSuccess(true);
  //     setTimeout(() => setshowSuccess(false), 2000);
  //     cargarBodegas();
  //     cargarSecciones();
  //     cargarPerchas();
  //   } catch (error) {
  //     console.error("Error al eliminar bodega:", error);
  //   }
  // };

  // CRUD SECCIONES
  const crearSeccionMetodo = async () => {
    const errorSeccion = validarNombre(seccion);
    const errorBodega = validarSeleccion(bodegaIdSeccion);
    
    if (errorSeccion || errorBodega) {
      seterroresSeccion({
        seccion: errorSeccion,
        bodega: errorBodega
      });
      setmensajeError(errorSeccion || errorBodega);
      setshowError(true);
      setTimeout(() => setshowError(false), 3000);
      return;
    }

    try {
      const res = await crearSeccion({ seccion, bodegaId: bodegaIdSeccion });
      setmensajeError(res.message || "Sección creada correctamente");
      setshowSuccess(true);
      setTimeout(() => setshowSuccess(false), 2000);
      setseccion("");
      setbodegaIdSeccion("");
      seterroresSeccion({ seccion: "", bodega: "" });
      cargarSecciones();
    } catch (error) {
      console.error("Error al crear sección:", error);
    }
  };

  // const editarSeccion = (sec: Seccion) => {
  //   setseccionEnEdicion({ ...sec });
  //   seterroresSeccion({ seccion: "", bodega: "" });
  //   setventanaEdicionSeccion(true);
  // };

  // const guardarEdicionSeccion = async () => {
  //   if (!seccionEnEdicion) return;
  //   
  //   const errorSeccion = validarNombre(seccionEnEdicion.seccion);
  //   const errorBodega = validarSeleccion(seccionEnEdicion.bodegaId || "");
  //   
  //   if (errorSeccion || errorBodega) {
  //     seterroresSeccion({
  //       seccion: errorSeccion,
  //       bodega: errorBodega
  //     });
  //     setmensajeError(errorSeccion || errorBodega);
  //     setshowError(true);
  //     setTimeout(() => setshowError(false), 3000);
  //     return;
  //   }

  //   try {
  //     const res = await actualizarSeccion(seccionEnEdicion.id, { seccion: seccionEnEdicion.seccion, bodegaId: seccionEnEdicion.bodegaId });
  //     setmensajeError(res.message || "Sección actualizada correctamente");
  //     setshowSuccess(true);
  //     setTimeout(() => setshowSuccess(false), 2000);
  //     setventanaEdicionSeccion(false);
  //     seterroresSeccion({ seccion: "", bodega: "" });
  //     cargarSecciones();
  //   } catch (error) {
  //     console.error("Error al actualizar sección:", error);
  //   }
  // };

  // const eliminarSeccionMetodo = async (id: number | undefined) => {
  //   if (!id) return;
  //   
  //   try {
  //     const res = await eliminarSeccion(id);
  //     setmensajeError(res.message || "Sección eliminada correctamente");
  //     setshowSuccess(true);
  //     setTimeout(() => setshowSuccess(false), 2000);
  //     cargarSecciones();
  //     cargarPerchas();
  //   } catch (error) {
  //     console.error("Error al eliminar sección:", error);
  //   }
  // };

  // CRUD PERCHAS
  const crearPerchaMetodo = async () => {
    const errorPercha = validarNombre(percha);
    const errorSeccion = validarSeleccion(seccionIdPercha);
    
    if (errorPercha || errorSeccion) {
      seterroresPercha({
        percha: errorPercha,
        seccion: errorSeccion
      });
      setmensajeError(errorPercha || errorSeccion);
      setshowError(true);
      setTimeout(() => setshowError(false), 3000);
      return;
    }

    try {
      const res = await crearPercha({ percha, seccionId: seccionIdPercha });
      setmensajeError(res.message || "Percha creada correctamente");
      setshowSuccess(true);
      setTimeout(() => setshowSuccess(false), 2000);
      setpercha("");
      setseccionIdPercha("");
      seterroresPercha({ percha: "", seccion: "" });
      cargarPerchas();
    } catch (error) {
      console.error("Error al crear percha:", error);
    }
  };

  // const editarPercha = (per: Percha) => {
  //   setperchaEnEdicion({ ...per });
  //   seterroresPercha({ percha: "", seccion: "" });
  //   setventanaEdicionPercha(true);
  // };

  // const guardarEdicionPercha = async () => {
  //   if (!perchaEnEdicion) return;
  //   
  //   const errorPercha = validarNombre(perchaEnEdicion.percha);
  //   const errorSeccion = validarSeleccion(perchaEnEdicion.seccionId || "");
  //   
  //   if (errorPercha || errorSeccion) {
  //     seterroresPercha({
  //       percha: errorPercha,
  //       seccion: errorSeccion
  //     });
  //     setmensajeError(errorPercha || errorSeccion);
  //     setshowError(true);
  //     setTimeout(() => setshowError(false), 3000);
  //     return;
  //   }

  //   try {
  //     const res = await actualizarPercha(perchaEnEdicion.id, { percha: perchaEnEdicion.percha, seccionId: perchaEnEdicion.seccionId });
  //     setmensajeError(res.message || "Percha actualizada correctamente");
  //     setshowSuccess(true);
  //     setTimeout(() => setshowSuccess(false), 2000);
  //     setventanaEdicionPercha(false);
  //     seterroresPercha({ percha: "", seccion: "" });
  //     cargarPerchas();
  //   } catch (error) {
  //     console.error("Error al actualizar percha:", error);
  //   }
  // };

  // const eliminarPerchaMetodo = async (id: number | undefined) => {
  //   if (!id) return;
  //   
  //   try {
  //     const res = await eliminarPercha(id);
  //     setmensajeError(res.message || "Percha eliminada correctamente");
  //     setshowSuccess(true);
  //     setTimeout(() => setshowSuccess(false), 2000);
  //     cargarPerchas();
  //   } catch (error) {
  //     console.error("Error al eliminar percha:", error);
  //   }
  // };

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

      <div className="w-full h-full p-6 space-y-6">
        {/* SECCIÓN BODEGAS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-gray-100 rounded-xl shadow-md p-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Nueva Bodega</h2>
            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-sm">Nombre de la bodega</label>
                <input 
                  type="text" 
                  className={`input w-full ${erroresBodega ? 'input-error' : ''}`} 
                  onChange={(e) => {
                    setbodega(e.target.value);
                    seterroresBodega(validarNombre(e.target.value));
                  }} 
                  value={bodega}
                />
                <div className="h-5">{erroresBodega && <p className="text-red-500 text-sm">{erroresBodega}</p>}</div>
              </div>
              <div className="flex justify-end">
                <button className="btn btn-primary" onClick={crearBodegaMetodo}>Crear Bodega</button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Listado de Bodegas</h2>
            <div className="overflow-x-auto">
              <table className="table w-full text-sm">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {bodegas.map((bod) => (
                    <tr key={bod.id} className="hover:bg-gray-50">
                      <td>{bod.bodega}</td>
                      <td className="text-center">
                        <div className="flex justify-center gap-2">
                          {/* <button className="btn btn-outline btn-xs" onClick={() => editarBodega(bod)}>Editar</button>
                          <button className="btn btn-outline btn-xs btn-error" onClick={() => eliminarBodegaMetodo(bod.id)}>Eliminar</button> */}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {bodegas.length === 0 && (
                    <tr>
                      <td colSpan={2} className="text-center text-gray-500 py-4">No hay bodegas registradas</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* SECCIÓN SECCIONES */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-gray-100 rounded-xl shadow-md p-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Nueva Sección</h2>
            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-sm">Nombre de la sección</label>
                <input 
                  type="text" 
                  className={`input w-full ${erroresSeccion.seccion ? 'input-error' : ''}`} 
                  onChange={(e) => {
                    setseccion(e.target.value);
                    seterroresSeccion({...erroresSeccion, seccion: validarNombre(e.target.value)});
                  }} 
                  value={seccion}
                />
                <div className="h-5">{erroresSeccion.seccion && <p className="text-red-500 text-sm">{erroresSeccion.seccion}</p>}</div>
              </div>
              <div>
                <label className="block text-sm">Bodega</label>
                <select 
                  className={`select w-full ${erroresSeccion.bodega ? 'select-error' : ''}`} 
                  value={bodegaIdSeccion}
                  onChange={(e) => {
                    setbodegaIdSeccion(e.target.value ? Number(e.target.value) : "");
                    seterroresSeccion({...erroresSeccion, bodega: validarSeleccion(e.target.value)});
                  }}
                >
                  <option value="">Selecciona una bodega</option>
                  {bodegas.map((b) => <option key={b.id} value={b.id}>{b.bodega}</option>)}
                </select>
                <div className="h-5">{erroresSeccion.bodega && <p className="text-red-500 text-sm">{erroresSeccion.bodega}</p>}</div>
              </div>
              <div className="flex justify-end">
                <button className="btn btn-primary" onClick={crearSeccionMetodo}>Crear Sección</button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Listado de Secciones</h2>
            <div className="overflow-x-auto">
              <table className="table w-full text-sm">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Bodega</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {secciones.map((sec) => (
                    <tr key={sec.id} className="hover:bg-gray-50">
                      <td>{sec.seccion}</td>
                      <td>{sec.bodega}</td>
                      <td className="text-center">
                        <div className="flex justify-center gap-2">
                          {/* <button className="btn btn-outline btn-xs" onClick={() => editarSeccion(sec)}>Editar</button>
                          <button className="btn btn-outline btn-xs btn-error" onClick={() => eliminarSeccionMetodo(sec.id)}>Eliminar</button> */}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {secciones.length === 0 && (
                    <tr>
                      <td colSpan={3} className="text-center text-gray-500 py-4">No hay secciones registradas</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* SECCIÓN PERCHAS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-gray-100 rounded-xl shadow-md p-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Nueva Percha</h2>
            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-sm">Nombre de la percha</label>
                <input 
                  type="text" 
                  className={`input w-full ${erroresPercha.percha ? 'input-error' : ''}`} 
                  onChange={(e) => {
                    setpercha(e.target.value);
                    seterroresPercha({...erroresPercha, percha: validarNombre(e.target.value)});
                  }} 
                  value={percha}
                />
                <div className="h-5">{erroresPercha.percha && <p className="text-red-500 text-sm">{erroresPercha.percha}</p>}</div>
              </div>
              <div>
                <label className="block text-sm">Sección</label>
                <select 
                  className={`select w-full ${erroresPercha.seccion ? 'select-error' : ''}`} 
                  value={seccionIdPercha}
                  onChange={(e) => {
                    setseccionIdPercha(e.target.value ? Number(e.target.value) : "");
                    seterroresPercha({...erroresPercha, seccion: validarSeleccion(e.target.value)});
                  }}
                >
                  <option value="">Selecciona una sección</option>
                  {secciones.map((s) => <option key={s.id} value={s.id}>{s.seccion}</option>)}
                </select>
                <div className="h-5">{erroresPercha.seccion && <p className="text-red-500 text-sm">{erroresPercha.seccion}</p>}</div>
              </div>
              <div className="flex justify-end">
                <button className="btn btn-primary" onClick={crearPerchaMetodo}>Crear Percha</button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Listado de Perchas</h2>
            <div className="overflow-x-auto">
              <table className="table w-full text-sm">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Sección</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {perchas.map((per) => (
                    <tr key={per.id} className="hover:bg-gray-50">
                      <td>{per.percha}</td>
                      <td>{per.seccion}</td>
                      <td className="text-center">
                        <div className="flex justify-center gap-2">
                          {/* <button className="btn btn-outline btn-xs" onClick={() => editarPercha(per)}>Editar</button>
                          <button className="btn btn-outline btn-xs btn-error" onClick={() => eliminarPerchaMetodo(per.id)}>Eliminar</button> */}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {perchas.length === 0 && (
                    <tr>
                      <td colSpan={3} className="text-center text-gray-500 py-4">No hay perchas registradas</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL EDICIÓN BODEGA */}
      {/* <div className={`z-50 fixed inset-0 flex items-center justify-center transition-opacity duration-300 ${ventanaEdicionBodega ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative border border-gray-300 w-96 rounded-lg bg-white shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Editar Bodega</h2>
            <button onClick={() => setventanaEdicionBodega(false)} className="text-gray-500 hover:text-gray-700">❌</button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Nombre de la bodega</label>
              <input 
                type="text" 
                className={`input w-full ${erroresBodega ? 'input-error' : ''}`}
                value={bodegaEnEdicion?.bodega || ""}
                onChange={(e) => {
                  setbodegaEnEdicion({...bodegaEnEdicion, bodega: e.target.value} as Bodega);
                  seterroresBodega(validarNombre(e.target.value));
                }}
              />
              <div className="h-5">{erroresBodega && <p className="text-red-500 text-sm">{erroresBodega}</p>}</div>
            </div>

            <div className="flex gap-2 justify-end">
              <button className="btn btn-ghost" onClick={() => setventanaEdicionBodega(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={guardarEdicionBodega}>Guardar</button>
            </div>
          </div>
        </div>
      </div> */}

      {/* MODAL EDICIÓN SECCIÓN */}
      {/* <div className={`z-50 fixed inset-0 flex items-center justify-center transition-opacity duration-300 ${ventanaEdicionSeccion ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative border border-gray-300 w-96 rounded-lg bg-white shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Editar Sección</h2>
            <button onClick={() => setventanaEdicionSeccion(false)} className="text-gray-500 hover:text-gray-700">❌</button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Nombre de la sección</label>
              <input 
                type="text" 
                className={`input w-full ${erroresSeccion.seccion ? 'input-error' : ''}`}
                value={seccionEnEdicion?.seccion || ""}
                onChange={(e) => {
                  setseccionEnEdicion({...seccionEnEdicion, seccion: e.target.value} as Seccion);
                  seterroresSeccion({...erroresSeccion, seccion: validarNombre(e.target.value)});
                }}
              />
              <div className="h-5">{erroresSeccion.seccion && <p className="text-red-500 text-sm">{erroresSeccion.seccion}</p>}</div>
            </div>

            <div>
              <label className="block text-sm mb-2">Bodega</label>
              <select 
                className={`select w-full ${erroresSeccion.bodega ? 'select-error' : ''}`}
                value={seccionEnEdicion?.bodegaId || ""}
                onChange={(e) => {
                  setseccionEnEdicion({...seccionEnEdicion, bodegaId: Number(e.target.value)} as Seccion);
                  seterroresSeccion({...erroresSeccion, bodega: validarSeleccion(e.target.value)});
                }}
              >
                <option value="">Selecciona una bodega</option>
                {bodegas.map((b) => <option key={b.id} value={b.id}>{b.bodega}</option>)}
              </select>
              <div className="h-5">{erroresSeccion.bodega && <p className="text-red-500 text-sm">{erroresSeccion.bodega}</p>}</div>
            </div>

            <div className="flex gap-2 justify-end">
              <button className="btn btn-ghost" onClick={() => setventanaEdicionSeccion(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={guardarEdicionSeccion}>Guardar</button>
            </div>
          </div>
        </div>
      </div> */}

      {/* MODAL EDICIÓN PERCHA */}
      {/* <div className={`z-50 fixed inset-0 flex items-center justify-center transition-opacity duration-300 ${ventanaEdicionPercha ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative border border-gray-300 w-96 rounded-lg bg-white shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Editar Percha</h2>
            <button onClick={() => setventanaEdicionPercha(false)} className="text-gray-500 hover:text-gray-700">❌</button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Nombre de la percha</label>
              <input 
                type="text" 
                className={`input w-full ${erroresPercha.percha ? 'input-error' : ''}`}
                value={perchaEnEdicion?.percha || ""}
                onChange={(e) => {
                  setperchaEnEdicion({...perchaEnEdicion, percha: e.target.value} as Percha);
                  seterroresPercha({...erroresPercha, percha: validarNombre(e.target.value)});
                }}
              />
              <div className="h-5">{erroresPercha.percha && <p className="text-red-500 text-sm">{erroresPercha.percha}</p>}</div>
            </div>

            <div>
              <label className="block text-sm mb-2">Sección</label>
              <select 
                className={`select w-full ${erroresPercha.seccion ? 'select-error' : ''}`}
                value={perchaEnEdicion?.seccionId || ""}
                onChange={(e) => {
                  setperchaEnEdicion({...perchaEnEdicion, seccionId: Number(e.target.value)} as Percha);
                  seterroresPercha({...erroresPercha, seccion: validarSeleccion(e.target.value)});
                }}
              >
                <option value="">Selecciona una sección</option>
                {secciones.map((s) => <option key={s.id} value={s.id}>{s.seccion}</option>)}
              </select>
              <div className="h-5">{erroresPercha.seccion && <p className="text-red-500 text-sm">{erroresPercha.seccion}</p>}</div>
            </div>

            <div className="flex gap-2 justify-end">
              <button className="btn btn-ghost" onClick={() => setventanaEdicionPercha(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={guardarEdicionPercha}>Guardar</button>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
};
