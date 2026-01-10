import React, { useEffect, useState, useRef } from 'react'
import { crearBodega, crearSeccion, crearPercha, getAllInfoBodegas, getAllSecciones, actualizarBodega, actualizarSeccion, actualizarPercha, eliminarBodega, eliminarSeccion, eliminarPercha, filtrarBodegas } from '../../controller/api/admin-api';
import type { Bodega } from '../../models/bodegas';

export const AdministrarBodegasSeccionesPerchas = () => {
  const [habilitarEdicion, sethabilitarEdicion] = useState(true)
  
 
  const [newBodega, setnewBodega] = useState("");
  const [bodegas, setbodegas] = useState<Bodega[]>([]);


  const [seccion, setseccion] = useState("");
  const [selectBodega, setselectBodega] = useState("");

  
  const [percha, setpercha] = useState("");
  const [selectSeccion, setselectSeccion] = useState("");
  
  const [filtroBodega, setfiltroBodega] = useState("");
  const [filtroSeccion, setfiltroSeccion] = useState("");
  const [filtroPercha, setfiltroPercha] = useState("");
 
  const [modalEdicion, setmodalEdicion] = useState(false);
  const [itemEnEdicion, setitemEnEdicion] = useState<{ tipo: "bodega" | "seccion" | "percha" | null; data: any }>({ tipo: null, data: null });
  const [bodegaEditTemp, setbodegaEditTemp] = useState("");
  const [seccionEditTemp, setseccionEditTemp] = useState("");
  const [perchaEditTemp, setperchaEditTemp] = useState("");
  const [bodegaEditName, setbodegaEditName] = useState("");
  const [seccionEditName, setseccionEditName] = useState("");
  const [perchaEditName, setperchaEditName] = useState("");

  // Estados para alertas
  const [showSuccess, setshowSuccess] = useState(false);
  const [showError, setshowError] = useState(false);
  const [mensajeError, setmensajeError] = useState("");

  // Estados para errores de validación
  const [erroresBodega, seterroresBodega] = useState("");
  const [erroresSeccion, seterroresSeccion] = useState({ seccion: "", bodega: "" });
  const [erroresPercha, seterroresPercha] = useState({ percha: "", seccion: "" });

  const dialog = useRef<HTMLDialogElement>(null);

  // Funciones de validación
  const validarNombreGeneral = (valor: string) => {
    if (!valor.trim()) return "Este campo es requerido";
    if (!/^[a-záéíóúñA-ZÁÉÍÓÚÑ0-9\s\-_]+$/.test(valor)) return "Formato no válido";
    return "";
  };

  const validarSeleccion = (valor: string | number) => {
    if (!valor || valor === "" || valor === 0) return "Debe seleccionar una opción";
    return "";
  };

  
  useEffect(() => {
    cargarBodegas();
  }, []);

  const cargarBodegas = async () => {
    try {
      const res = await getAllInfoBodegas();
      setbodegas(res as Bodega[]);
    } catch (error) {
      console.error("Error al cargar bodegas:", error);
    }
  };


  const applyFilters = async () => {
        const filtros = {
          bodega: filtroBodega || undefined,
          seccion: filtroSeccion || undefined,
          
          percha: filtroPercha || undefined,
          
        };
        const res = await filtrarBodegas(filtros);
        console.log(res);
        setbodegas(res);
      }

       const clearFilters = async () => {
      setfiltroBodega(""); setfiltroSeccion(""); setfiltroPercha("");
      cargarBodegas();
    }

 
  const crearBodegaFunc = async () => {
    const error = validarNombreGeneral(newBodega);
    if (error) {
      seterroresBodega(error);
      setmensajeError(error);
      setshowError(true);
      setTimeout(() => setshowError(false), 3000);
      return;
    }

    try {
      const res = await crearBodega({ bodega: newBodega });
      if (res.ok) {
        setmensajeError(res.message);
        setshowSuccess(true);
        setTimeout(() => setshowSuccess(false), 2000);
        setnewBodega("");
        seterroresBodega("");
        cargarBodegas();
      }
    } catch (error) {
      console.error("Error al crear bodega:", error);
    }
  };

  
  const crearSeccionFunc = async () => {
    const errorSeccion = validarNombreGeneral(seccion);
    const errorBodega = validarSeleccion(selectBodega);

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
      const bodegaId = parseInt(selectBodega);
      const res = await crearSeccion({ seccion, bodegaId });
      if (res.ok) {
        setmensajeError(res.message);
        setshowSuccess(true);
        setTimeout(() => setshowSuccess(false), 2000);
        setseccion("");
        setselectBodega("");
        seterroresSeccion({ seccion: "", bodega: "" });
        cargarBodegas();
      }
    } catch (error) {
      console.error("Error al crear sección:", error);
    }
  };

  
  const crearPerchaFunc = async () => {
    const errorPercha = validarNombreGeneral(percha);
    const errorSeccion = validarSeleccion(selectSeccion);

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
      const seccionId = parseInt(selectSeccion);
      const res = await crearPercha({ percha, seccionId });
      if (res.ok) {
        setmensajeError(res.message);
        setshowSuccess(true);
        setTimeout(() => setshowSuccess(false), 2000);
        setpercha("");
        setselectSeccion("");
        seterroresPercha({ percha: "", seccion: "" });
        cargarBodegas();
      }
    } catch (error) {
      console.error("Error al crear percha:", error);
    }
  };

  
  const abrirEdicion = (tipo: "bodega" | "seccion" | "percha", data: any) => {
    setitemEnEdicion({ tipo, data });
    if (tipo === "bodega") {
      setbodegaEditName(data.bodega);
    } else if (tipo === "seccion") {
      const buscarBodega = bodegas.find(b => b.seccion.some(s => s.id === data.id));
      if (buscarBodega) {
        setbodegaEditTemp(buscarBodega.bodega);
        setseccionEditName(data.seccion);
      }
    } else if (tipo === "percha") {
      const buscarSeccion = bodegas.find(b => b.seccion.some(s => s.percha.some(p => p.id === data.id)));
      if (buscarSeccion) {
        const seccionEncontrada = buscarSeccion.seccion.find(s => s.percha.some(p => p.id === data.id));
        if (seccionEncontrada) {
          setseccionEditTemp(seccionEncontrada.seccion);
          setperchaEditName(data.percha);
        }
      }
    }
    setmodalEdicion(true);
  };

  // Cerrar modal de edición
  const cerrarEdicion = () => {
    setmodalEdicion(false);
    setitemEnEdicion({ tipo: null, data: null });
    setbodegaEditTemp("");
    setseccionEditTemp("");
    setbodegaEditName("");
    setseccionEditName("");
    setperchaEditName("");
    sethabilitarEdicion(true);
  };

  const guardarEdicion = async() => {
    const { tipo, data } = itemEnEdicion;

    if(tipo === "bodega"){
      const res = await actualizarBodega(data.id, bodegaEditName);
      if(res.validate){
        setmensajeError(res.msj);
        setshowSuccess(true);
        setTimeout(() => setshowSuccess(false), 2000);
        cargarBodegas();
        cerrarEdicion();
      }else{ 
        setmensajeError(res.msj);
        setshowError(true);
        setTimeout(() => setshowError(false), 3000);
      }
    }

    if(tipo === "seccion"){
      const res = await actualizarSeccion(data.id, seccionEditName, bodegaEditTemp);
      if(res.validate){
        setmensajeError(res.msj);
        setshowSuccess(true);
        setTimeout(() => setshowSuccess(false), 2000);
        cargarBodegas();
        cerrarEdicion();
      }else{ 
        setmensajeError(res.msj);
        setshowError(true);
        setTimeout(() => setshowError(false), 3000);
      }
    }

    if(tipo === "percha"){
      const res = await actualizarPercha(data.id, perchaEditName, seccionEditTemp);
      if(res.validate){
        setmensajeError(res.msj);
        setshowSuccess(true);
        setTimeout(() => setshowSuccess(false), 2000);
        cargarBodegas();
        cerrarEdicion();
      }else{ 
        setmensajeError(res.msj);
        setshowError(true);
        setTimeout(() => setshowError(false), 3000);
      }
    }
  };

  // Eliminar
  const eliminarItem = async() => {
    const { tipo, data } = itemEnEdicion;
    
    if (tipo === "bodega") {
      const res = await eliminarBodega(data.id);
      if(res.validate){
        setmensajeError(res.msj);
        setshowSuccess(true);
        setTimeout(() => setshowSuccess(false), 2000);
        cargarBodegas();
      }else{
        setmensajeError(res.msj);
        setshowError(true);
        setTimeout(() => setshowError(false), 3000);
      }
    }

    if (tipo === "seccion") {
      const res = await eliminarSeccion(data.id);
      if(res.validate){
        setmensajeError(res.msj);
        setshowSuccess(true);
        setTimeout(() => setshowSuccess(false), 2000);
        cargarBodegas();
      }else{
        setmensajeError(res.msj);
        setshowError(true);
        setTimeout(() => setshowError(false), 3000);
      }
    }

    if (tipo === "percha") {
      const res = await eliminarPercha(data.id);
      if(res.validate){
        setmensajeError(res.msj);
        setshowSuccess(true);
        setTimeout(() => setshowSuccess(false), 2000);
        cargarBodegas();
      }else{
        setmensajeError(res.msj);
        setshowError(true);
        setTimeout(() => setshowError(false), 3000);
      }
    }
    setmodalEdicion(false);
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

      <dialog ref={dialog} id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Advertencia!</h3>
          <p className="py-4">¿Está seguro que desea eliminar {itemEnEdicion.tipo === "bodega" ? "la bodega" : itemEnEdicion.tipo === "seccion" ? "la sección" : "la percha"}?</p>
          <div className="modal-action">
            <form method="dialog" className="flex gap-2">
              <button className="btn btn-primary" onClick={eliminarItem}>Eliminar</button>
              <button className="btn">Cancelar</button>
            </form>
          </div>
        </div>
      </dialog>

      <div className="w-full h-full p-6 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 shadow-lg border-t-4 border-purple-400">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🏢</span>
              <div>
                <h1 className="text-2xl font-bold text-white">Bodegas, Secciones y Perchas</h1>
                <p className="text-purple-100 text-sm mt-1">Gestiona tu estructura de almacenamiento</p>
              </div>
            </div>
          </div>
        </div>

        {/* Formularios para crear */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Nueva Bodega */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-purple-300">
              <span className="text-2xl">📦</span>
              <h2 className="text-lg font-bold text-gray-800">Nueva Bodega</h2>
            </div>
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-gray-700">Nombre de la Bodega</span>
                </label>
                <input
                  type="text"
                  placeholder="Ingresa el nombre"
                  className={`input input-bordered w-full focus:border-purple-500 transition ${erroresBodega ? 'input-error' : ''}`}
                  onChange={(e) => {
                    setnewBodega(e.target.value);
                    seterroresBodega(validarNombreGeneral(e.target.value));
                  }}
                  value={newBodega}
                />
                {erroresBodega && <label className="label"><span className="label-text-alt text-error text-sm">{erroresBodega}</span></label>}
              </div>
              <button className="btn bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 hover:from-purple-600 hover:to-purple-700 w-full gap-2 transition shadow-md" onClick={crearBodegaFunc}>
                ➕ Crear Bodega
              </button>
            </div>
          </div>

          {/* Nueva Sección */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-blue-300">
              <span className="text-2xl">📂</span>
              <h2 className="text-lg font-bold text-gray-800">Nueva Sección</h2>
            </div>
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-gray-700">Nombre de la Sección</span>
                </label>
                <input
                  type="text"
                  placeholder="Ingresa el nombre"
                  className={`input input-bordered w-full focus:border-blue-500 transition ${erroresSeccion.seccion ? 'input-error' : ''}`}
                  onChange={(e) => {
                    setseccion(e.target.value);
                    seterroresSeccion({ ...erroresSeccion, seccion: validarNombreGeneral(e.target.value) });
                  }}
                  value={seccion}
                />
                {erroresSeccion.seccion && <label className="label"><span className="label-text-alt text-error text-sm">{erroresSeccion.seccion}</span></label>}
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-gray-700">Selecciona Bodega</span>
                </label>
                <select
                  className={`select select-bordered w-full focus:border-blue-500 transition ${erroresSeccion.bodega ? 'select-error' : ''}`}
                  value={selectBodega}
                  onChange={(e) => {
                    setselectBodega(e.target.value);
                    seterroresSeccion({ ...erroresSeccion, bodega: validarSeleccion(e.target.value) });
                  }}
                >
                  <option value="">Selecciona una bodega...</option>
                  {bodegas.map((b) => (
                    <option key={b.id} value={b.id}>{b.bodega}</option>
                  ))}
                </select>
                {erroresSeccion.bodega && <label className="label"><span className="label-text-alt text-error text-sm">{erroresSeccion.bodega}</span></label>}
              </div>
              <button className="btn bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 hover:from-blue-600 hover:to-blue-700 w-full gap-2 transition shadow-md" onClick={crearSeccionFunc}>
                ➕ Crear Sección
              </button>
            </div>
          </div>

          {/* Nueva Percha */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-green-300">
              <span className="text-2xl">🔹</span>
              <h2 className="text-lg font-bold text-gray-800">Nueva Percha</h2>
            </div>
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-gray-700">Nombre de la Percha</span>
                </label>
                <input
                  type="text"
                  placeholder="Ingresa el nombre"
                  className={`input input-bordered w-full focus:border-green-500 transition ${erroresPercha.percha ? 'input-error' : ''}`}
                  onChange={(e) => {
                    setpercha(e.target.value);
                    seterroresPercha({ ...erroresPercha, percha: validarNombreGeneral(e.target.value) });
                  }}
                  value={percha}
                />
                {erroresPercha.percha && <label className="label"><span className="label-text-alt text-error text-sm">{erroresPercha.percha}</span></label>}
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-gray-700">Selecciona Sección</span>
                </label>
                <select
                  className={`select select-bordered w-full focus:border-green-500 transition ${erroresPercha.seccion ? 'select-error' : ''}`}
                  value={selectSeccion}
                  onChange={(e) => {
                    setselectSeccion(e.target.value);
                    seterroresPercha({ ...erroresPercha, seccion: validarSeleccion(e.target.value) });
                  }}
                >
                  <option value="">Selecciona una sección...</option>
                  {bodegas.map((b) =>
                    b.seccion.map((s) => (
                      <option key={s.id} value={s.id}>{s.seccion}</option>
                    ))
                  )}
                </select>
                {erroresPercha.seccion && <label className="label"><span className="label-text-alt text-error text-sm">{erroresPercha.seccion}</span></label>}
              </div>
              <button className="btn bg-gradient-to-r from-green-500 to-green-600 text-white border-0 hover:from-green-600 hover:to-green-700 w-full gap-2 transition shadow-md" onClick={crearPerchaFunc}>
                ➕ Crear Percha
              </button>
            </div>
          </div>
        </div>

       
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Filters Header */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔍</span>
              <h3 className="text-white font-bold text-lg">Buscar Bodegas</h3>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn btn-sm bg-white text-purple-600 hover:bg-purple-50 border-0 font-semibold" onClick={clearFilters}>
                ✕ Limpiar
              </button>
              <button className="btn btn-sm bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 hover:from-purple-600 hover:to-purple-700 font-semibold" onClick={applyFilters}>
                ✓ Aplicar
              </button>
            </div>
          </div>

          {/* Filters Grid */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-purple-700">📦 Bodega</span>
              </label>
              <input 
                className="input input-bordered focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all" 
                placeholder="Buscar bodega..." 
                value={filtroBodega} 
                onChange={(e) => setfiltroBodega(e.target.value)}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-blue-700">📂 Sección</span>
              </label>
              <input 
                className="input input-bordered focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" 
                placeholder="Buscar sección..." 
                value={filtroSeccion} 
                onChange={(e) => setfiltroSeccion(e.target.value)}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-green-700">🔹 Percha</span>
              </label>
              <input 
                className="input input-bordered focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all" 
                placeholder="Buscar percha..." 
                value={filtroPercha} 
                onChange={(e) => setfiltroPercha(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Warehouse Structure */}
        <div className="mt-6 bg-white rounded-2xl shadow-2xl overflow-hidden p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">🏢</span>
            Estructura de Almacén
          </h3>

          {bodegas.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 text-lg">📭 No hay bodegas registradas</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bodegas.map((bodega) => (
                <div key={bodega.id} className="border-2 border-purple-200 rounded-xl p-5 bg-gradient-to-br from-purple-50 to-white hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl">📦</span>
                        <h4 className="font-bold text-gray-800 text-lg">{bodega.bodega}</h4>
                      </div>

                      {bodega.seccion && bodega.seccion.length > 0 ? (
                        <div className="space-y-3 ml-6">
                          {bodega.seccion.map((sec) => (
                            <div key={sec.id} className="border-l-4 border-blue-400 pl-4 py-2 bg-blue-50 rounded-r-lg">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-xl">📂</span>
                                  <p className="font-semibold text-blue-800">{sec.seccion}</p>
                                </div>
                                <div className="flex gap-1">
                                  <button
                                    className="btn btn-xs btn-ghost tooltip"
                                    data-tip="Editar Sección"
                                    onClick={() => abrirEdicion("seccion", sec)}
                                  >
                                    ✏️
                                  </button>
                                  <button
                                    className="btn btn-xs btn-ghost text-red-500 tooltip"
                                    data-tip="Eliminar Sección"
                                    onClick={() => { setitemEnEdicion({tipo:"seccion", data: sec}); dialog.current?.showModal(); }}
                                  >
                                    🗑️
                                  </button>
                                </div>
                              </div>

                              {sec.percha && sec.percha.length > 0 ? (
                                <div className="mt-3 space-y-2 ml-6">
                                  {sec.percha.map((per) => (
                                    <div key={per.id} className="flex justify-between items-center bg-white p-2 rounded border border-green-200">
                                      <div className="flex items-center gap-2">
                                        <span className="text-lg">🔹</span>
                                        <p className="text-sm text-gray-700 font-medium">{per.percha}</p>
                                      </div>
                                      <div className="flex gap-1">
                                        <button
                                          className="btn btn-xs btn-ghost tooltip"
                                          data-tip="Editar"
                                          onClick={() => abrirEdicion("percha", per)}
                                        >
                                          ✏️
                                        </button>
                                        <button
                                          className="btn btn-xs btn-ghost text-red-500 tooltip"
                                          data-tip="Eliminar"
                                          onClick={() => { setitemEnEdicion({tipo:"percha", data: per}); dialog.current?.showModal(); }}
                                        >
                                          🗑️
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-gray-400 italic ml-6 mt-2">🔸 Sin perchas asignadas</p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400 italic ml-6">📂 Sin secciones asignadas</p>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        className="btn btn-sm btn-ghost tooltip"
                        data-tip="Editar Bodega"
                        onClick={() => abrirEdicion("bodega", bodega)}
                      >
                        ✏️
                      </button>
                      <button
                        className="btn btn-sm btn-ghost text-red-500 tooltip"
                        data-tip="Eliminar Bodega"
                        onClick={() => { setitemEnEdicion({tipo:"bodega", data: bodega}); dialog.current?.showModal(); }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MODAL DE EDICIÓN */}
      {modalEdicion && (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-lg font-bold mb-4">
              {itemEnEdicion.tipo === "bodega" ? "Editar Bodega" : itemEnEdicion.tipo === "seccion" ? "Editar Sección" : "Editar Percha"}
            </h3>

            {itemEnEdicion.tipo === "bodega" ? (
              <>
                <div className="mb-4">
                  <label className="label">
                    <span className="label-text">Nombre de la bodega</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={bodegaEditName}
                    onChange={(e) => { setbodegaEditName(e.target.value); if(e.target.value.trim() !== ""){ sethabilitarEdicion(false) } else { sethabilitarEdicion(true) } }}
                  />
                </div>
              </>
            ) : itemEnEdicion.tipo === "seccion" ? (
              <>
                <div className="mb-4">
                  <label className="label">
                    <span className="label-text">Nombre de la sección</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={seccionEditName}
                    onChange={(e) => { setseccionEditName(e.target.value); if(e.target.value.trim() !== ""){ sethabilitarEdicion(false) } else { sethabilitarEdicion(true) } }}
                  />
                  <label className="label">
                    <span className="label-text">Nombre de la bodega</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={bodegaEditTemp}
                    onChange={(e) => { setbodegaEditTemp(e.target.value); if(e.target.value.trim() !== ""){ sethabilitarEdicion(false) } else { sethabilitarEdicion(true) } }}
                  >
                    <option value="">Selecciona una bodega</option>
                    {bodegas.map((b) => (
                      <option key={b.id} value={b.bodega}>{b.bodega}</option>
                    ))}
                  </select>
                </div>
              </>
            ) : (
              <>
                <div className="mb-4">
                  <label className="label">
                    <span className="label-text">Nombre de la percha</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={perchaEditName}
                    onChange={(e) => { setperchaEditName(e.target.value); if(e.target.value.trim() !== ""){ sethabilitarEdicion(false) } else { sethabilitarEdicion(true) } }}
                  />
                  <label className="label">
                    <span className="label-text">Nombre de la sección</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={seccionEditTemp}
                    onChange={(e) => { setseccionEditTemp(e.target.value); if(e.target.value.trim() !== ""){ sethabilitarEdicion(false) } else { sethabilitarEdicion(true) } }}
                  >
                    <option value="">Selecciona una sección</option>
                    {bodegas.map((b) =>
                      b.seccion.map((s) => (
                        <option key={s.id} value={s.seccion}>{s.seccion}</option>
                      ))
                    )}
                  </select>
                </div>
              </>
            )}

            <div className="flex gap-2 justify-end">
              <button className="btn btn-ghost" onClick={cerrarEdicion}>
                Cancelar
              </button>
              <button className="btn btn-primary" disabled={habilitarEdicion} onClick={guardarEdicion}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
