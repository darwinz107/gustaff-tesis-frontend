import React, { useEffect, useState } from 'react'
import { newTipoTrabajo, getAllTiposTrabajo, actualizarTipoTrabajo, eliminarTipoTrabajo } from '../../controller/api/admin-api';

interface TipoTrabajo {
  id?: number;
  tipo: string;
}

export const AdministrarTiposTrabajo = () => {
  const [tipoTrabajo, settipoTrabajo] = useState("");
  const [tiposTrabajo, settiposTrabajo] = useState<TipoTrabajo[]>([]);
  const [tipoEnEdicion, settipoEnEdicion] = useState<TipoTrabajo | null>(null);
  const [ventanaEdicion, setventanaEdicion] = useState(false);

  const [showSuccess, setshowSuccess] = useState(false);
  const [showError, setshowError] = useState(false);
  const [mensajeError, setmensajeError] = useState("");
  const [errores, seterrores] = useState("");

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

  // const editarTipo = (tipo: TipoTrabajo) => {
  //   settipoEnEdicion({ ...tipo });
  //   seterrores("");
  //   setventanaEdicion(true);
  // };

  // const guardarEdicion = async () => {
  //   if (!tipoEnEdicion) return;
  //   
  //   const error = validarNombre(tipoEnEdicion.tipo);
  //   if (error) {
  //     seterrores(error);
  //     setmensajeError(error);
  //     setshowError(true);
  //     setTimeout(() => setshowError(false), 3000);
  //     return;
  //   }

  //   try {
  //     const res = await actualizarTipoTrabajo(tipoEnEdicion.id, { tipo: tipoEnEdicion.tipo });
  //     setmensajeError(res.msj || "Tipo de trabajo actualizado correctamente");
  //     setshowSuccess(true);
  //     setTimeout(() => setshowSuccess(false), 2000);
  //     setventanaEdicion(false);
  //     seterrores("");
  //     cargarTiposTrabajo();
  //   } catch (error) {
  //     console.error("Error al actualizar tipo de trabajo:", error);
  //   }
  // };

  // const eliminarTipoMetodo = async (id: number | undefined) => {
  //   if (!id) return;
  //   
  //   try {
  //     const res = await eliminarTipoTrabajo(id);
  //     setmensajeError(res.msj || "Tipo de trabajo eliminado correctamente");
  //     setshowSuccess(true);
  //     setTimeout(() => setshowSuccess(false), 2000);
  //     cargarTiposTrabajo();
  //   } catch (error) {
  //     console.error("Error al eliminar tipo de trabajo:", error);
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
            <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Nuevo Tipo de Trabajo</h2>
            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-sm">Nombre del tipo</label>
                <input 
                  type="text" 
                  className={`input w-full ${errores ? 'input-error' : ''}`} 
                  onChange={(e) => {
                    settipoTrabajo(e.target.value);
                    seterrores(validarNombre(e.target.value));
                  }} 
                  value={tipoTrabajo}
                />
                <div className="h-5">{errores && <p className="text-red-500 text-sm">{errores}</p>}</div>
              </div>
              <div className="flex justify-end">
                <button className="btn btn-primary" onClick={crearTipoTrabajoMetodo}>Crear Tipo</button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Listado de Tipos de Trabajo</h2>
            <div className="overflow-x-auto">
              <table className="table w-full text-sm">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {tiposTrabajo.map((tipo) => (
                    <tr key={tipo.id} className="hover:bg-gray-50">
                      <td>{tipo.tipo}</td>
                      <td className="text-center">
                        <div className="flex justify-center gap-2">
                          {/* <button className="btn btn-outline btn-xs" onClick={() => editarTipo(tipo)}>Editar</button>
                          <button className="btn btn-outline btn-xs btn-error" onClick={() => eliminarTipoMetodo(tipo.id)}>Eliminar</button> */}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {tiposTrabajo.length === 0 && (
                    <tr>
                      <td colSpan={2} className="text-center text-gray-500 py-4">No hay tipos de trabajo registrados</td>
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
            <h2 className="text-lg font-semibold">Editar Tipo de Trabajo</h2>
            <button onClick={() => setventanaEdicion(false)} className="text-gray-500 hover:text-gray-700">❌</button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Nombre del tipo</label>
              <input 
                type="text" 
                className={`input w-full ${errores ? 'input-error' : ''}`}
                value={tipoEnEdicion?.tipo || ""}
                onChange={(e) => {
                  settipoEnEdicion({...tipoEnEdicion, tipo: e.target.value} as TipoTrabajo);
                  seterrores(validarNombre(e.target.value));
                }}
              />
              <div className="h-5">{errores && <p className="text-red-500 text-sm">{errores}</p>}</div>
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
