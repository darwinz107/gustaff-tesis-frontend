import React, { useEffect, useState, useRef } from 'react'
import { newTipoTrabajo, getAllTiposTrabajo, editarTipoTrabajo, eliminarTipoTrabajo } from '../../controller/api/admin-api';

interface TipoTrabajo {
  id?: number;
  tipo: string;
}

export const AdministrarTiposTrabajo = () => {
  const [tipoTrabajo, settipoTrabajo] = useState("");
  const [tiposTrabajo, settiposTrabajo] = useState<TipoTrabajo[]>([]);
  const [tipoEnEdicion, settipoEnEdicion] = useState<TipoTrabajo | null>(null);
  const [ventanaEdicion, setventanaEdicion] = useState(false);
  const [tipoAEliminar, settipoAEliminar] = useState<TipoTrabajo | null>(null);
  const [habilitarBotonGuardar, sethabilitarBotonGuardar] = useState(true);

  const [showSuccess, setshowSuccess] = useState(false);
  const [showError, setshowError] = useState(false);
  const [mensajeError, setmensajeError] = useState("");
  const [errores, seterrores] = useState("");

  const dialog = useRef<HTMLDialogElement>(null);

  const validarNombre = (valor: string) => {
    if (!valor.trim()) return "Este campo es requerido";
    if (!/^[a-záéíóúñA-ZÁÉÍÓÚÑ0-9\s\-_]+$/.test(valor)) return "Formato no válido";
    return "";
  };

  useEffect(() => {
    cargarTiposTrabajo();
  }, []);

  const cargarTiposTrabajo = async () => {
    try {
      const res = await getAllTiposTrabajo();
      settiposTrabajo(res);
    } catch (error) {
      console.error("Error al cargar tipos de trabajo:", error);
    }
  };

  const crearTipoTrabajoMetodo = async () => {
    const error = validarNombre(tipoTrabajo);
    if (error) {
      seterrores(error);
      setmensajeError(error);
      setshowError(true);
      setTimeout(() => setshowError(false), 3000);
      return;
    }

    try {
      const res = await newTipoTrabajo({ tipo: tipoTrabajo });
      setmensajeError(res.msj || "Tipo de trabajo creado correctamente");
      setshowSuccess(true);
      setTimeout(() => setshowSuccess(false), 2000);
      settipoTrabajo("");
      seterrores("");
      cargarTiposTrabajo();
    } catch (error) {
      console.error("Error al crear tipo de trabajo:", error);
    }
  };

  const abrirEdicion = (tipo: TipoTrabajo) => {
    settipoEnEdicion({ ...tipo });
    seterrores("");
    sethabilitarBotonGuardar(true);
    setventanaEdicion(true);
  };

  const guardarEdicion = async () => {
    if (!tipoEnEdicion) return;
    
    const error = validarNombre(tipoEnEdicion.tipo);
    if (error) {
      seterrores(error);
      setmensajeError(error);
      setshowError(true);
      setTimeout(() => setshowError(false), 3000);
      return;
    }

    try {
      console.log(tipoEnEdicion);
      const res = await editarTipoTrabajo(tipoEnEdicion.id || 0, tipoEnEdicion.tipo);
      if (res.validate) {
        setmensajeError(res.msj || "Tipo de trabajo actualizado correctamente");
        setshowSuccess(true);
        setTimeout(() => setshowSuccess(false), 2000);
        setventanaEdicion(false);
        seterrores("");
        cargarTiposTrabajo();
      } else {
        setmensajeError(res.msj || "Error al actualizar tipo de trabajo");
        setshowError(true);
        setTimeout(() => setshowError(false), 3000);
      }
    } catch (error) {
      console.error("Error al actualizar tipo de trabajo:", error);
    }
  };

  const abrirDialogoEliminar = (tipo: TipoTrabajo) => {
    settipoAEliminar(tipo);
    dialog.current?.showModal();
  };

  const eliminarTipoMetodo = async () => {
    if (!tipoAEliminar?.id) return;
    
    try {
      const res = await eliminarTipoTrabajo(tipoAEliminar.id);
      if (res.validate) {
        setmensajeError(res.msj || "Tipo de trabajo eliminado correctamente");
        setshowSuccess(true);
        setTimeout(() => setshowSuccess(false), 2000);
        cargarTiposTrabajo();
      } else {
        setmensajeError(res.msj || "Error al eliminar tipo de trabajo");
        setshowError(true);
        setTimeout(() => setshowError(false), 3000);
      }
      settipoAEliminar(null);
    } catch (error) {
      console.error("Error al eliminar tipo de trabajo:", error);
    }
  };

  const cerrarEdicion = () => {
    setventanaEdicion(false);
    settipoEnEdicion(null);
    seterrores("");
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
          <p className="py-4">¿Está seguro que desea eliminar el tipo de trabajo "{tipoAEliminar?.tipo}"?</p>
          <div className="modal-action">
            <form method="dialog" className="flex gap-2">
              <button className="btn btn-primary" onClick={eliminarTipoMetodo}>Eliminar</button>
              <button className="btn">Cancelar</button>
            </form>
          </div>
        </div>
      </dialog>

      <div className="w-full h-full p-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex items-center gap-3">
            <span className="text-4xl">⚙️</span>
            <div>
              <h1 className="text-3xl font-bold text-white">Gestionar Tipos de Trabajo</h1>
              <p className="text-amber-100">Crea y administra los tipos de trabajo disponibles</p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="mb-6 bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>➕</span>
              Nuevo Tipo de Trabajo
            </h2>
          </div>

          <div className="p-6">
            <div className="max-w-md">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-amber-700">Nombre del tipo</span>
                </label>
                <input 
                  type="text" 
                  placeholder="Ej: Mantenimiento, Reparación, Inspección..."
                  className="input input-bordered focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all" 
                  onChange={(e) => {
                    settipoTrabajo(e.target.value);
                    seterrores(validarNombre(e.target.value));
                  }} 
                  value={tipoTrabajo}
                />
                {errores && <label className="label-text-alt text-error">{errores}</label>}
              </div>
              <button 
                className="btn bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0 hover:from-amber-600 hover:to-amber-700 w-full mt-4 font-semibold" 
                onClick={crearTipoTrabajoMetodo}
              >
                ✓ Crear Tipo
              </button>
            </div>
          </div>
        </div>

        {/* List Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>📋</span>
              Listado de Tipos de Trabajo
            </h2>
          </div>

          <div className="p-6">
            {tiposTrabajo.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">📭 No hay tipos de trabajo registrados</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr className="border-b-2 border-amber-200">
                      <th className="text-amber-700 font-bold">Nombre</th>
                      <th className="text-center text-amber-700 font-bold">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tiposTrabajo.map((tipo) => (
                      <tr key={tipo.id} className="hover:bg-amber-50 border-b border-amber-100 transition-colors">
                        <td className="text-gray-700 font-medium">{tipo.tipo}</td>
                        <td className="text-center">
                          <div className="flex justify-center gap-2">
                            <button className="btn btn-xs btn-ghost tooltip" data-tip="Editar" onClick={() => abrirEdicion(tipo)}>✏️</button>
                            <button className="btn btn-xs btn-ghost text-red-500 tooltip" data-tip="Eliminar" onClick={() => abrirDialogoEliminar(tipo)}>🗑️</button>
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
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-2xl">✏️</span>
                <h2 className="text-xl font-bold text-white">Editar Tipo de Trabajo</h2>
              </div>
              <button onClick={cerrarEdicion} className="text-white hover:bg-amber-700 p-2 rounded-lg transition">✕</button>
            </div>
            
            {/* Content */}
            <div className="p-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-amber-700">Nombre del tipo</span>
                </label>
                <input 
                  type="text" 
                  placeholder="Ej: Mantenimiento, Reparación, Inspección..."
                  className="input input-bordered focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all"
                  value={tipoEnEdicion?.tipo || ""}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    settipoEnEdicion({...tipoEnEdicion, tipo: newValue} as TipoTrabajo);
                    seterrores(validarNombre(newValue));
                    sethabilitarBotonGuardar(newValue.trim() === "");
                  }}
                />
                {errores && <label className="label-text-alt text-error">{errores}</label>}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-end border-t">
              <button className="btn btn-ghost hover:bg-gray-200" onClick={cerrarEdicion}>
                Cancelar
              </button>
              <button 
                className="btn bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0 hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed" 
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
