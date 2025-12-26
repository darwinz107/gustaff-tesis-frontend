import React, { useEffect, useState, useRef } from 'react'
import { crearCategoria, getAllCategorias, editarCategoria, eliminarCategoria } from '../../controller/api/admin-api';

interface Categoria {
  id?: number;
  nombre: string;
}

export const AdministrarCategorias = () => {
  const [categoria, setcategoria] = useState("");
  const [categorias, setcategorias] = useState<Categoria[]>([]);
  const [categoriaEnEdicion, setcategoriaEnEdicion] = useState<Categoria | null>(null);
  const [ventanaEdicion, setventanaEdicion] = useState(false);
  const [categoriaAEliminar, setcategoriaAEliminar] = useState<Categoria | null>(null);
  const [habilitarBotonGuardar, sethabilitarBotonGuardar] = useState(true);

  const [showSuccess, setshowSuccess] = useState(false);
  const [showError, setshowError] = useState(false);
  const [mensajeError, setmensajeError] = useState("");
  const [errores, seterrores] = useState("");

  const dialog = useRef<HTMLDialogElement>(null);

  const validarNombre = (valor: string) => {
    if (!valor.trim()) return "Este campo es requerido";
    if (!/^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]+$/.test(valor)) return "Solo se permiten letras y espacios";
    return "";
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      const res = await getAllCategorias();
      console.log(res);
      setcategorias(res);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    }
  };

  const crearCategoriaMetodo = async () => {
    const error = validarNombre(categoria);
    if (error) {
      seterrores(error);
      setmensajeError(error);
      setshowError(true);
      setTimeout(() => setshowError(false), 3000);
      return;
    }

    try {
      const res = await crearCategoria({ nombre: categoria });
      setmensajeError(res.msj || "Categoría creada correctamente");
      setshowSuccess(true);
      setTimeout(() => setshowSuccess(false), 2000);
      setcategoria("");
      seterrores("");
      cargarCategorias();
    } catch (error) {
      console.error("Error al crear categoría:", error);
    }
  };

  const abrirEdicion = (cat: Categoria) => {
    setcategoriaEnEdicion({ ...cat });
    seterrores("");
    sethabilitarBotonGuardar(true);
    setventanaEdicion(true);
  };

  const guardarEdicion = async () => {
    if (!categoriaEnEdicion) return;
    
    const error = validarNombre(categoriaEnEdicion.nombre);
    if (error) {
      seterrores(error);
      setmensajeError(error);
      setshowError(true);
      setTimeout(() => setshowError(false), 3000);
      return;
    }

    try {
      console.log(categoriaEnEdicion);
      const res = await editarCategoria(categoriaEnEdicion.id || 0, categoriaEnEdicion.nombre);
      if (res.validate) {
        setmensajeError(res.msj || "Categoría actualizada correctamente");
        setshowSuccess(true);
        setTimeout(() => setshowSuccess(false), 2000);
        setventanaEdicion(false);
        seterrores("");
        cargarCategorias();
      } else {
        setmensajeError(res.msj || "Error al actualizar categoría");
        setshowError(true);
        setTimeout(() => setshowError(false), 3000);
      }
    } catch (error) {
      console.error("Error al actualizar categoría:", error);
    }
  };

  const abrirDialogoEliminar = (cat: Categoria) => {
    setcategoriaAEliminar(cat);
    dialog.current?.showModal();
  };

  const eliminarCategoriaMetodo = async () => {
    if (!categoriaAEliminar?.id) return;
    
    try {
      const res = await eliminarCategoria(categoriaAEliminar.id);
      if (res.validate) {
        setmensajeError(res.msj || "Categoría eliminada correctamente");
        setshowSuccess(true);
        setTimeout(() => setshowSuccess(false), 2000);
        cargarCategorias();
      } else {
        setmensajeError(res.msj || "Error al eliminar categoría");
        setshowError(true);
        setTimeout(() => setshowError(false), 3000);
      }
      setcategoriaAEliminar(null);
    } catch (error) {
      console.error("Error al eliminar categoría:", error);
    }
  };

  const cerrarEdicion = () => {
    setventanaEdicion(false);
    setcategoriaEnEdicion(null);
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
          <p className="py-4">¿Está seguro que desea eliminar la categoría "{categoriaAEliminar?.nombre}"?</p>
          <div className="modal-action">
            <form method="dialog" className="flex gap-2">
              <button className="btn btn-primary" onClick={eliminarCategoriaMetodo}>Eliminar</button>
              <button className="btn">Cancelar</button>
            </form>
          </div>
        </div>
      </dialog>

      <div className="w-full h-full p-6">
        <div className="grid grid-cols-1  gap-6 justify-items-center">
          <div className="lg:col-span-1 bg-gray-100 rounded-xl shadow-md p-4 w-1/2">
            <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Nueva Categoría</h2>
            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-sm">Nombre de la categoría</label>
                <input 
                  type="text" 
                  className={`input w-full ${errores ? 'input-error' : ''}`} 
                  onChange={(e) => {
                    setcategoria(e.target.value);
                    seterrores(validarNombre(e.target.value));
                  }} 
                  value={categoria}
                />
                <div className="h-5">{errores && <p className="text-red-500 text-sm">{errores}</p>}</div>
              </div>
              <div className="flex justify-end">
                <button className="btn btn-primary" onClick={crearCategoriaMetodo}>Crear Categoría</button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-4 min-w-1/2">
            <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Listado de Categorías</h2>
            <div className="overflow-x-auto">
              <table className="table w-full text-sm">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {categorias.map((cat) => (
                    <tr key={cat.id} className="hover:bg-gray-50">
                      <td>{cat.nombre}</td>
                      <td className="text-center">
                        <div className="flex justify-center gap-2">
                          <button className="btn btn-outline btn-xs" onClick={() => abrirEdicion(cat)}>Editar</button>
                          <button className="btn btn-outline btn-xs btn-error" onClick={() => abrirDialogoEliminar(cat)}>Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {categorias.length === 0 && (
                    <tr>
                      <td colSpan={2} className="text-center text-gray-500 py-4">No hay categorías registradas</td>
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
              <h2 className="text-lg font-bold">Editar Categoría</h2>
              <button onClick={cerrarEdicion} className="text-gray-500 hover:text-gray-700">❌</button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Nombre de la categoría</label>
                <input 
                  type="text" 
                  className={`input w-full ${errores ? 'input-error' : ''}`}
                  value={categoriaEnEdicion?.nombre || ""}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setcategoriaEnEdicion({...categoriaEnEdicion, nombre: newValue} as Categoria);
                    seterrores(validarNombre(newValue));
                    sethabilitarBotonGuardar(newValue.trim() === "");
                  }}
                />
                <div className="h-5">{errores && <p className="text-red-500 text-sm">{errores}</p>}</div>
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
