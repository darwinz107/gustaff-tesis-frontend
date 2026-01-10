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
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex items-center gap-3">
            <span className="text-4xl">👔</span>
            <div>
              <h1 className="text-3xl font-bold text-white">Gestionar Cargos</h1>
              <p className="text-indigo-100">Crea y administra los cargos y roles de la empresa</p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="mb-6 bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>➕</span>
              Nuevo Cargo
            </h2>
          </div>

          <div className="p-6">
            <div className="max-w-md space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-indigo-700">Nombre del cargo</span>
                </label>
                <input 
                  type="text" 
                  placeholder="Ej: Gerente, Supervisor, Técnico..."
                  className="input input-bordered focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all" 
                  onChange={(e) => {
                    setcargo(e.target.value);
                    seterrores({...errores, cargo: validarCargo(e.target.value)});
                  }} 
                  value={cargo}
                />
                {errores.cargo && <label className="label-text-alt text-error">{errores.cargo}</label>}
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-indigo-700">Rol</span>
                </label>
                <select 
                  className="select select-bordered focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all" 
                  value={selectRol}
                  onChange={(e) => {
                    setselectRol(e.target.value ? Number(e.target.value) : "");
                    seterrores({...errores, rol: validarRol(e.target.value)});
                  }}
                >
                  <option value="">Selecciona un rol</option>
                  {roles.map((r) => <option key={r.id} value={r.id}>{r.role}</option>)}
                </select>
                {errores.rol && <label className="label-text-alt text-error">{errores.rol}</label>}
              </div>
              <button 
                className="btn bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-0 hover:from-indigo-600 hover:to-indigo-700 w-full mt-4 font-semibold" 
                onClick={crearCargoMetodo}
              >
                ✓ Crear Cargo
              </button>
            </div>
          </div>
        </div>

        {/* List Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>📋</span>
              Listado de Cargos
            </h2>
          </div>

          <div className="p-6">
            {cargos.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">📭 No hay cargos registrados</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr className="border-b-2 border-indigo-200">
                      <th className="text-indigo-700 font-bold">Nombre</th>
                      <th className="text-indigo-700 font-bold">Rol</th>
                      <th className="text-center text-indigo-700 font-bold">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cargos.map((car) => (
                      <tr key={car.id} className="hover:bg-indigo-50 border-b border-indigo-100 transition-colors">
                        <td className="text-gray-700 font-medium">{car.name}</td>
                        <td className="text-gray-700"><span className="badge badge-outline badge-lg">{car.rolId.role}</span></td>
                        <td className="text-center">
                          <div className="flex justify-center gap-2">
                            <button className="btn btn-xs btn-ghost tooltip" data-tip="Editar" onClick={() => abrirEdicion(car)}>✏️</button>
                            <button className="btn btn-xs btn-ghost text-red-500 tooltip" data-tip="Eliminar" onClick={() => abrirDialogoEliminar(car)}>🗑️</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL EDICIÓN */}
      {ventanaEdicion && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-2xl">✏️</span>
                <h2 className="text-xl font-bold text-white">Editar Cargo</h2>
              </div>
              <button onClick={cerrarEdicion} className="text-white hover:bg-indigo-700 p-2 rounded-lg transition">✕</button>
            </div>
            
            {/* Content */}
            <div className="p-6">
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold text-indigo-700">Nombre del cargo</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="Ej: Gerente, Supervisor, Técnico..."
                    className="input input-bordered focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                    value={cargoEnEdicion?.name || ""}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setcargoEnEdicion({...cargoEnEdicion, name: newValue} as Cargo);
                      seterrores({...errores, cargo: validarCargo(newValue)});
                      sethabilitarBotonGuardar(newValue.trim() === "");
                    }}
                  />
                  {errores.cargo && <label className="label-text-alt text-error">{errores.cargo}</label>}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold text-indigo-700">Rol</span>
                  </label>
                  <select 
                    className="select select-bordered focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
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
                  {errores.rol && <label className="label-text-alt text-error">{errores.rol}</label>}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-end border-t">
              <button className="btn btn-ghost hover:bg-gray-200" onClick={cerrarEdicion}>
                Cancelar
              </button>
              <button 
                className="btn bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-0 hover:from-indigo-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed" 
                disabled={habilitarBotonGuardar} 
                onClick={guardarEdicion}
              >
                ✓ Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
