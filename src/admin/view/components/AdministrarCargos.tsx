import React, { useEffect, useState } from 'react'
import { crearCargo, getAllCargos, getAllRoles, actualizarCargo, eliminarCargo } from '../../controller/api/admin-api';

interface Cargo {
  id?: number;
  cargo: string;
  rolId?: number;
  rol?: string;
}

interface Rol {
  id: number;
  role: string;
}

export const AdministrarCargos = () => {
  const [cargo, setcargo] = useState("");
  const [selectRol, setselectRol] = useState<number | "">("");
  const [cargos, setcargos] = useState<Cargo[]>([]);
  const [roles, setroles] = useState<Rol[]>([]);
  const [cargoEnEdicion, setcargoEnEdicion] = useState<Cargo | null>(null);
  const [ventanaEdicion, setventanaEdicion] = useState(false);

  const [showSuccess, setshowSuccess] = useState(false);
  const [showError, setshowError] = useState(false);
  const [mensajeError, setmensajeError] = useState("");
  const [errores, seterrores] = useState({ cargo: "", rol: "" });

  const validarCargo = (valor: string) => {
    if (!valor.trim()) return "Este campo es requerido";
    if (!/^[a-záéíóúñA-ZÁÉÍÓÚÑ0-9\s\-_]+$/.test(valor)) return "Formato no válido";
    return "";
  };

  const validarRol = (valor: number | string) => {
    if (!valor || valor === "") return "Debe seleccionar un rol";
    return "";
  };

  useEffect(() => {
    cargarCargos();
    cargarRoles();
  }, []);

  const cargarCargos = async () => {
    try {
      const res = await getAllCargos();
      setcargos(res);
    } catch (error) {
      console.error("Error al cargar cargos:", error);
    }
  };

  const cargarRoles = async () => {
    try {
      const res = await getAllRoles();
      setroles(res);
    } catch (error) {
      console.error("Error al cargar roles:", error);
    }
  };

  const crearCargoMetodo = async () => {
    const errorCargo = validarCargo(cargo);
    const errorRol = validarRol(selectRol);
    
    if (errorCargo || errorRol) {
      seterrores({
        cargo: errorCargo,
        rol: errorRol
      });
      setmensajeError(errorCargo || errorRol);
      setshowError(true);
      setTimeout(() => setshowError(false), 3000);
      return;
    }

    try {
      const res = await crearCargo({ rol: selectRol, cargo });
      setmensajeError(res.msj || "Cargo creado correctamente");
      setshowSuccess(true);
      setTimeout(() => setshowSuccess(false), 2000);
      setcargo("");
      setselectRol("");
      seterrores({ cargo: "", rol: "" });
      cargarCargos();
    } catch (error) {
      console.error("Error al crear cargo:", error);
    }
  };

  // const editarCargo = (car: Cargo) => {
  //   setcargoEnEdicion({ ...car });
  //   seterrores({ cargo: "", rol: "" });
  //   setventanaEdicion(true);
  // };

  // const guardarEdicion = async () => {
  //   if (!cargoEnEdicion) return;
  //   
  //   const errorCargo = validarCargo(cargoEnEdicion.cargo);
  //   const errorRol = validarRol(cargoEnEdicion.rolId || "");
  //   
  //   if (errorCargo || errorRol) {
  //     seterrores({
  //       cargo: errorCargo,
  //       rol: errorRol
  //     });
  //     setmensajeError(errorCargo || errorRol);
  //     setshowError(true);
  //     setTimeout(() => setshowError(false), 3000);
  //     return;
  //   }

  //   try {
  //     const res = await actualizarCargo(cargoEnEdicion.id, { cargo: cargoEnEdicion.cargo, rolId: cargoEnEdicion.rolId });
  //     setmensajeError(res.msj || "Cargo actualizado correctamente");
  //     setshowSuccess(true);
  //     setTimeout(() => setshowSuccess(false), 2000);
  //     setventanaEdicion(false);
  //     seterrores({ cargo: "", rol: "" });
  //     cargarCargos();
  //   } catch (error) {
  //     console.error("Error al actualizar cargo:", error);
  //   }
  // };

  // const eliminarCargoMetodo = async (id: number | undefined) => {
  //   if (!id) return;
  //   
  //   try {
  //     const res = await eliminarCargo(id);
  //     setmensajeError(res.msj || "Cargo eliminado correctamente");
  //     setshowSuccess(true);
  //     setTimeout(() => setshowSuccess(false), 2000);
  //     cargarCargos();
  //   } catch (error) {
  //     console.error("Error al eliminar cargo:", error);
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

      <div className="w-full h-full p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-gray-100 rounded-xl shadow-md p-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Nuevo Cargo</h2>
            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-sm">Nombre del cargo</label>
                <input 
                  type="text" 
                  className={`input w-full ${errores.cargo ? 'input-error' : ''}`} 
                  onChange={(e) => {
                    setcargo(e.target.value);
                    seterrores({...errores, cargo: validarCargo(e.target.value)});
                  }} 
                  value={cargo}
                />
                <div className="h-5">{errores.cargo && <p className="text-red-500 text-sm">{errores.cargo}</p>}</div>
              </div>
              <div>
                <label className="block text-sm">Rol</label>
                <select 
                  className={`select w-full ${errores.rol ? 'select-error' : ''}`} 
                  value={selectRol}
                  onChange={(e) => {
                    setselectRol(e.target.value ? Number(e.target.value) : "");
                    seterrores({...errores, rol: validarRol(e.target.value)});
                  }}
                >
                  <option value="">Selecciona un rol</option>
                  {roles.map((r) => <option key={r.id} value={r.id}>{r.role}</option>)}
                </select>
                <div className="h-5">{errores.rol && <p className="text-red-500 text-sm">{errores.rol}</p>}</div>
              </div>
              <div className="flex justify-end">
                <button className="btn btn-primary" onClick={crearCargoMetodo}>Crear Cargo</button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Listado de Cargos</h2>
            <div className="overflow-x-auto">
              <table className="table w-full text-sm">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Rol</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {cargos.map((car) => (
                    <tr key={car.id} className="hover:bg-gray-50">
                      <td>{car.cargo}</td>
                      <td>{car.rol}</td>
                      <td className="text-center">
                        <div className="flex justify-center gap-2">
                          {/* <button className="btn btn-outline btn-xs" onClick={() => editarCargo(car)}>Editar</button>
                          <button className="btn btn-outline btn-xs btn-error" onClick={() => eliminarCargoMetodo(car.id)}>Eliminar</button> */}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {cargos.length === 0 && (
                    <tr>
                      <td colSpan={3} className="text-center text-gray-500 py-4">No hay cargos registrados</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL EDICIÓN */}
      {/* <div className={`z-50 fixed inset-0 flex items-center justify-center transition-opacity duration-300 ${ventanaEdicion ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative border border-gray-300 w-96 rounded-lg bg-white shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Editar Cargo</h2>
            <button onClick={() => setventanaEdicion(false)} className="text-gray-500 hover:text-gray-700">❌</button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Nombre del cargo</label>
              <input 
                type="text" 
                className={`input w-full ${errores.cargo ? 'input-error' : ''}`}
                value={cargoEnEdicion?.cargo || ""}
                onChange={(e) => {
                  setcargoEnEdicion({...cargoEnEdicion, cargo: e.target.value} as Cargo);
                  seterrores({...errores, cargo: validarCargo(e.target.value)});
                }}
              />
              <div className="h-5">{errores.cargo && <p className="text-red-500 text-sm">{errores.cargo}</p>}</div>
            </div>

            <div>
              <label className="block text-sm mb-2">Rol</label>
              <select 
                className={`select w-full ${errores.rol ? 'select-error' : ''}`}
                value={cargoEnEdicion?.rolId || ""}
                onChange={(e) => {
                  setcargoEnEdicion({...cargoEnEdicion, rolId: Number(e.target.value)} as Cargo);
                  seterrores({...errores, rol: validarRol(e.target.value)});
                }}
              >
                <option value="">Selecciona un rol</option>
                {roles.map((r) => <option key={r.id} value={r.id}>{r.role}</option>)}
              </select>
              <div className="h-5">{errores.rol && <p className="text-red-500 text-sm">{errores.rol}</p>}</div>
            </div>

            <div className="flex gap-2 justify-end">
              <button className="btn btn-ghost" onClick={() => setventanaEdicion(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={guardarEdicion}>Guardar</button>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
};
