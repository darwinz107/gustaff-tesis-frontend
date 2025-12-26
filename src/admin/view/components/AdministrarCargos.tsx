import React, { useEffect, useState, useRef } from 'react'
import { crearCargo, getAllCargos, getAllRoles, editarCargo, eliminarCargo } from '../../controller/api/admin-api';
import type { Cargo, Rol } from '../../models/cargos';



export const AdministrarCargos = () => {
  const [cargo, setcargo] = useState("");
  const [selectRol, setselectRol] = useState<number | "">("");
  const [cargos, setcargos] = useState<Cargo[]>([]);
  const [roles, setroles] = useState<Rol[]>([]);
  const [cargoEnEdicion, setcargoEnEdicion] = useState<Cargo | null>(null);
  const [ventanaEdicion, setventanaEdicion] = useState(false);
  const [cargoAEliminar, setcargoAEliminar] = useState<Cargo | null>(null);
  const [habilitarBotonGuardar, sethabilitarBotonGuardar] = useState(true);

  const [showSuccess, setshowSuccess] = useState(false);
  const [showError, setshowError] = useState(false);
  const [mensajeError, setmensajeError] = useState("");
  const [errores, seterrores] = useState({ cargo: "", rol: "" });

  const dialog = useRef<HTMLDialogElement>(null);

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

  const abrirEdicion = (car: Cargo) => {
    setcargoEnEdicion({ ...car });
    seterrores({ cargo: "", rol: "" });
    sethabilitarBotonGuardar(true);
    setventanaEdicion(true);
  };

  const guardarEdicion = async () => {
    console.log(cargoEnEdicion);
    if (cargoEnEdicion === null) return; 
    
    const errorCargo = validarCargo(cargoEnEdicion?.name);
    const errorRol = validarRol(cargoEnEdicion.rolId.id || "");
    console.error("No hay cargo en edición");
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
      const res = await editarCargo(cargoEnEdicion.id || 0, cargoEnEdicion?.name, cargoEnEdicion.rolId.id || 0);
      if (res.validate) {
        setmensajeError(res.msj || "Cargo actualizado correctamente");
        setshowSuccess(true);
        setTimeout(() => setshowSuccess(false), 2000);
        setventanaEdicion(false);
        seterrores({ cargo: "", rol: "" });
        cargarCargos();
      } else {
        setmensajeError(res.msj || "Error al actualizar cargo");
        setshowError(true);
        setTimeout(() => setshowError(false), 3000);
      }
    } catch (error) {
      console.error("Error al actualizar cargo:", error);
    }
  };

  const abrirDialogoEliminar = (car: Cargo) => {
    setcargoAEliminar(car);
    dialog.current?.showModal();
  };

  const eliminarCargoMetodo = async () => {
    if (!cargoAEliminar?.id) return;
    
    try {
      const res = await eliminarCargo(cargoAEliminar.id);
      if (res.validate) {
        setmensajeError(res.msj || "Cargo eliminado correctamente");
        setshowSuccess(true);
        setTimeout(() => setshowSuccess(false), 2000);
        cargarCargos();
      } else {
        setmensajeError(res.msj || "Error al eliminar cargo");
        setshowError(true);
        setTimeout(() => setshowError(false), 3000);
      }
      setcargoAEliminar(null);
    } catch (error) {
      console.error("Error al eliminar cargo:", error);
    }
  };

  const cerrarEdicion = () => {
    setventanaEdicion(false);
    setcargoEnEdicion(null);
    seterrores({ cargo: "", rol: "" });
  };

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

      <dialog ref={dialog} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Advertencia!</h3>
          <p className="py-4">¿Está seguro que desea eliminar el cargo "{cargoAEliminar?.name}"?</p>
          <div className="modal-action">
            <form method="dialog" className="flex gap-2">
              <button className="btn btn-primary" onClick={eliminarCargoMetodo}>Eliminar</button>
              <button className="btn">Cancelar</button>
            </form>
          </div>
        </div>
      </dialog>

      <div className="w-full h-full p-6">
        <div className="grid grid-cols-1 gap-6 justify-items-center">
          <div className="lg:col-span-1 bg-gray-100 rounded-xl shadow-md p-4 w-1/2 ">
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
                      <td>{car.name}</td>
                      <td>{car.rolId.role}</td>
                      <td className="text-center">
                        <div className="flex justify-center gap-2">
                          <button className="btn btn-outline btn-xs" onClick={() => abrirEdicion(car)}>Editar</button>
                          <button className="btn btn-outline btn-xs btn-error" onClick={() => abrirDialogoEliminar(car)}>Eliminar</button>
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
      {ventanaEdicion && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Editar Cargo</h2>
              <button onClick={cerrarEdicion} className="text-gray-500 hover:text-gray-700">❌</button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Nombre del cargo</label>
                <input 
                  type="text" 
                  className={`input w-full ${errores.cargo ? 'input-error' : ''}`}
                  value={cargoEnEdicion?.name || ""}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setcargoEnEdicion({...cargoEnEdicion, name: newValue} as Cargo);
                    seterrores({...errores, cargo: validarCargo(newValue)});
                    sethabilitarBotonGuardar(newValue.trim() === "");
                  }}
                />
                <div className="h-5">{errores.cargo && <p className="text-red-500 text-sm">{errores.cargo}</p>}</div>
              </div>

              <div>
                <label className="block text-sm mb-2">Rol</label>
                <select 
                  className={`select w-full ${errores.rol ? 'select-error' : ''}`}
                  value={cargoEnEdicion?.rolId.id || ""}
                  onChange={(e) => {
                    const newValue = e.target.value ? Number(e.target.value) : 0;
                    setcargoEnEdicion({...cargoEnEdicion, rolId:{id: newValue}} as Cargo);
                    seterrores({...errores, rol: validarRol(newValue)});
                    sethabilitarBotonGuardar(newValue === 0);
                  }}
                >
                  <option value="">Selecciona un rol</option>
                  {roles.map((r) => <option key={r.id} value={r.id}>{r.role}</option>)}
                </select>
                <div className="h-5">{errores.rol && <p className="text-red-500 text-sm">{errores.rol}</p>}</div>
              </div>

              <div className="flex gap-2 justify-end">
                <button className="btn btn-ghost" onClick={cerrarEdicion}>Cancelar</button>
                <button className="btn btn-primary" disabled={habilitarBotonGuardar} onClick={guardarEdicion}>Guardar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
