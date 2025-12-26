import React, { useEffect, useState, useRef } from 'react'
import { crearBodega, crearSeccion, crearPercha, getAllInfoBodegas, getAllSecciones, actualizarBodega, actualizarSeccion, actualizarPercha, eliminarBodega, eliminarSeccion, eliminarPercha } from '../../controller/api/admin-api';
import type { Bodega } from '../../models/bodegas';

export const AdministrarBodegasSeccionesPerchas = () => {
  const [habilitarEdicion, sethabilitarEdicion] = useState(true)
  
  // Estados para crear bodega
  const [newBodega, setnewBodega] = useState("");
  const [bodegas, setbodegas] = useState<Bodega[]>([]);

  // Estados para crear sección
  const [seccion, setseccion] = useState("");
  const [selectBodega, setselectBodega] = useState("");

  // Estados para crear percha
  const [percha, setpercha] = useState("");
  const [selectSeccion, setselectSeccion] = useState("");

  // Estados para edición
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

  // Cargar datos iniciales
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

  // CRUD BODEGAS
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

  // CRUD SECCIONES
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

  // CRUD PERCHAS
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

  // Abrir modal de edición
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
        {/* SECCIÓN CREAR BODEGA, SECCIÓN Y PERCHA */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Crear Bodega */}
          <div className="bg-gray-100 rounded-xl shadow-md p-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Nueva Bodega</h2>
            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-sm">Nombre de la bodega</label>
                <input
                  type="text"
                  className={`input w-full ${erroresBodega ? 'input-error' : ''}`}
                  onChange={(e) => {
                    setnewBodega(e.target.value);
                    seterroresBodega(validarNombreGeneral(e.target.value));
                  }}
                  value={newBodega}
                />
                <div className="h-5">{erroresBodega && <p className="text-red-500 text-sm">{erroresBodega}</p>}</div>
              </div>
              <div className="flex justify-end">
                <button className="btn btn-primary" onClick={crearBodegaFunc}>Crear Bodega</button>
              </div>
            </div>
          </div>

          {/* Crear Sección */}
          <div className="bg-gray-100 rounded-xl shadow-md p-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Nueva Sección</h2>
            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-sm">Nombre de la sección</label>
                <input
                  type="text"
                  className={`input w-full ${erroresSeccion.seccion ? 'input-error' : ''}`}
                  onChange={(e) => {
                    setseccion(e.target.value);
                    seterroresSeccion({ ...erroresSeccion, seccion: validarNombreGeneral(e.target.value) });
                  }}
                  value={seccion}
                />
                <div className="h-5">{erroresSeccion.seccion && <p className="text-red-500 text-sm">{erroresSeccion.seccion}</p>}</div>
              </div>
              <div>
                <label className="block text-sm">Bodega</label>
                <select
                  className={`select w-full ${erroresSeccion.bodega ? 'select-error' : ''}`}
                  value={selectBodega}
                  onChange={(e) => {
                    setselectBodega(e.target.value);
                    seterroresSeccion({ ...erroresSeccion, bodega: validarSeleccion(e.target.value) });
                  }}
                >
                  <option value="">Selecciona una bodega</option>
                  {bodegas.map((b) => (
                    <option key={b.id} value={b.id}>{b.bodega}</option>
                  ))}
                </select>
                <div className="h-5">{erroresSeccion.bodega && <p className="text-red-500 text-sm">{erroresSeccion.bodega}</p>}</div>
              </div>
              <div className="flex justify-end">
                <button className="btn btn-primary" onClick={crearSeccionFunc}>Crear Sección</button>
              </div>
            </div>
          </div>

          {/* Crear Percha */}
          <div className="bg-gray-100 rounded-xl shadow-md p-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Nueva Percha</h2>
            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-sm">Nombre de la percha</label>
                <input
                  type="text"
                  className={`input w-full ${erroresPercha.percha ? 'input-error' : ''}`}
                  onChange={(e) => {
                    setpercha(e.target.value);
                    seterroresPercha({ ...erroresPercha, percha: validarNombreGeneral(e.target.value) });
                  }}
                  value={percha}
                />
                <div className="h-5">{erroresPercha.percha && <p className="text-red-500 text-sm">{erroresPercha.percha}</p>}</div>
              </div>
              <div>
                <label className="block text-sm">Sección</label>
                <select
                  className={`select w-full ${erroresPercha.seccion ? 'select-error' : ''}`}
                  value={selectSeccion}
                  onChange={(e) => {
                    setselectSeccion(e.target.value);
                    seterroresPercha({ ...erroresPercha, seccion: validarSeleccion(e.target.value) });
                  }}
                >
                  <option value="">Selecciona una sección</option>
                  {bodegas.map((b) =>
                    b.seccion.map((s) => (
                      <option key={s.id} value={s.id}>{s.seccion}</option>
                    ))
                  )}
                </select>
                <div className="h-5">{erroresPercha.seccion && <p className="text-red-500 text-sm">{erroresPercha.seccion}</p>}</div>
              </div>
              <div className="flex justify-end">
                <button className="btn btn-primary" onClick={crearPerchaFunc}>Crear Percha</button>
              </div>
            </div>
          </div>
        </div>

        {/* SECCIÓN TABLA DE BODEGAS CON SECCIONES Y PERCHAS */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Bodegas con Secciones y Perchas</h2>

          {bodegas.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No hay bodegas registradas</p>
          ) : (
            <div className="space-y-3">
              {bodegas.map((bodega) => (
                <div key={bodega.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 mb-3">📦 {bodega.bodega}</h3>

                      {bodega.seccion && bodega.seccion.length > 0 ? (
                        <div className="space-y-3 ml-4">
                          {bodega.seccion.map((sec) => (
                            <div key={sec.id} className="border-l-2 border-blue-400 pl-3">
                              <p className="text-sm font-semibold text-blue-700">📂 Sección: {sec.seccion}</p>

                              {sec.percha && sec.percha.length > 0 ? (
                                <div className="mt-2 space-y-1 ml-3">
                                  {sec.percha.map((per) => (
                                    <div key={per.id} className="flex justify-between items-center">
                                      <p className="text-sm text-gray-700">🔹 {per.percha}</p>
                                      <div className="flex gap-2">
                                        <button
                                          className="btn btn-xs btn-ghost"
                                          onClick={() => abrirEdicion("percha", per)}
                                        >
                                          Editar
                                        </button>
                                        <button
                                          className="btn btn-xs btn-error"
                                          onClick={() => { setitemEnEdicion({tipo:"percha", data: per}); dialog.current?.showModal(); }}
                                        >
                                          Eliminar
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-gray-500 italic ml-3">Sin perchas asignadas</p>
                              )}

                              <div className="flex gap-2 ml-3 mt-2">
                                <button
                                  className="btn btn-xs btn-ghost"
                                  onClick={() => abrirEdicion("seccion", sec)}
                                >
                                  Editar
                                </button>
                                <button
                                  className="btn btn-xs btn-error"
                                  onClick={() => { setitemEnEdicion({tipo:"seccion", data: sec}); dialog.current?.showModal(); }}
                                >
                                  Eliminar
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic ml-4">Sin secciones asignadas</p>
                      )}
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        className="btn btn-xs btn-ghost"
                        onClick={() => abrirEdicion("bodega", bodega)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-xs btn-error"
                        onClick={() => { setitemEnEdicion({tipo:"bodega", data: bodega}); dialog.current?.showModal(); }}
                      >
                        Eliminar
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
