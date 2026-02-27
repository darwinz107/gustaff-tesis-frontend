import React, { useEffect, useState, useRef } from 'react'
import { crearCategoria, getAllCategorias, editarCategoria, eliminarCategoria } from '../../controller/api/admin-api';

interface Categoria {
  id?: number;
  nombre: string;
}

export const AdministrarCategorias = () => {
  const [categoria, setcategoria] = useState("");
  const [categorias, setcategorias] = useState<Categoria[]>([]);
  const [categoriasOriginales, setcategoriasOriginales] = useState<Categoria[]>([]);
  const [categoriaEnEdicion, setcategoriaEnEdicion] = useState<Categoria | null>(null);
  const [ventanaEdicion, setventanaEdicion] = useState(false);
  const [categoriaAEliminar, setcategoriaAEliminar] = useState<Categoria | null>(null);
  const [habilitarBotonGuardar, sethabilitarBotonGuardar] = useState(true);

  // Estados para filtros
  const [filtroNombre, setfiltroNombre] = useState("");

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
      setcategoriasOriginales(res);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    }
  };

  // Funciones de filtrado local
  const aplicarFiltros = () => {
    let categoriasFiltradas = [...categoriasOriginales];

    if (filtroNombre.trim()) {
      categoriasFiltradas = categoriasFiltradas.filter(cat =>
        cat.nombre.toLowerCase().includes(filtroNombre.toLowerCase())
      );
    }

    setcategorias(categoriasFiltradas);
  };

  const limpiarFiltros = () => {
    setfiltroNombre("");
    setcategorias(categoriasOriginales);
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
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🏷️</span>
            <div>
              <h1 className="text-3xl font-bold text-white">Gestionar Categorías</h1>
              <p className="text-pink-100">Crea y administra las categorías de productos</p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="mb-6 bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-pink-500 to-pink-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>➕</span>
              Nueva Categoría
            </h2>
          </div>

          <div className="p-6">
            <div className="max-w-md">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-pink-700">Nombre de la categoría</span>
                </label>
                <input 
                  type="text" 
                  placeholder="Ej: Electrónicos, Ropa, Alimentos..."
                  className="input input-bordered focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all" 
                  onChange={(e) => {
                    setcategoria(e.target.value);
                    seterrores(validarNombre(e.target.value));
                  }} 
                  value={categoria}
                />
                {errores && <label className="label-text-alt text-error">{errores}</label>}
              </div>
              <button 
                className="btn bg-gradient-to-r from-pink-500 to-pink-600 text-white border-0 hover:from-pink-600 hover:to-pink-700 w-full mt-4 font-semibold" 
                onClick={crearCategoriaMetodo}
              >
                ✓ Crear Categoría
              </button>
            </div>
          </div>
        </div>

        {/* Filter Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-pink-600 to-pink-700 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔍</span>
              <h3 className="text-white font-bold text-lg">Buscar Categorías</h3>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn btn-sm bg-white text-pink-600 hover:bg-pink-50 border-0 font-semibold" onClick={limpiarFiltros}>
                ✕ Limpiar
              </button>
              <button className="btn btn-sm bg-gradient-to-r from-pink-500 to-pink-600 text-white border-0 hover:from-pink-600 hover:to-pink-700 font-semibold" onClick={aplicarFiltros}>
                ✓ Aplicar
              </button>
            </div>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">📌 Nombre</label>
              <input
                type="text"
                placeholder="Buscar por nombre..."
                className="input input-bordered w-full focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all"
                value={filtroNombre}
                onChange={(e) => setfiltroNombre(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* List Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-pink-500 to-pink-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>📋</span>
              Listado de Categorías
            </h2>
          </div>

          <div className="p-6">
            {categorias.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">📭 No hay categorías registradas</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr className="border-b-2 border-pink-200">
                      <th className="text-pink-700 font-bold">Nombre</th>
                      <th className="text-center text-pink-700 font-bold">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categorias.map((cat) => (
                      <tr key={cat.id} className="hover:bg-pink-50 border-b border-pink-100 transition-colors">
                        <td className="text-gray-700 font-medium">{cat.nombre}</td>
                        <td className="text-center">
                          <div className="flex justify-center gap-2">
                            <button className="btn btn-xs btn-ghost tooltip" data-tip="Editar" onClick={() => abrirEdicion(cat)}>✏️</button>
                            <button className="btn btn-xs btn-ghost text-red-500 tooltip" data-tip="Eliminar" onClick={() => abrirDialogoEliminar(cat)}>🗑️</button>
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
            <div className="bg-gradient-to-r from-pink-500 to-pink-600 px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-2xl">✏️</span>
                <h2 className="text-xl font-bold text-white">Editar Categoría</h2>
              </div>
              <button onClick={cerrarEdicion} className="text-white hover:bg-pink-700 p-2 rounded-lg transition">✕</button>
            </div>
            
            {/* Content */}
            <div className="p-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-pink-700">Nombre de la categoría</span>
                </label>
                <input 
                  type="text" 
                  placeholder="Ej: Electrónicos, Ropa, Alimentos..."
                  className="input input-bordered focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all"
                  value={categoriaEnEdicion?.nombre || ""}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setcategoriaEnEdicion({...categoriaEnEdicion, nombre: newValue} as Categoria);
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
                className="btn bg-gradient-to-r from-pink-500 to-pink-600 text-white border-0 hover:from-pink-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed" 
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
