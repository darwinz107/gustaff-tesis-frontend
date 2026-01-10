import React, { useEffect, useState, useRef } from 'react'
import { actualizarArea, crearNuevaArea, crearNuevaMaquina, editarMaquina, eliminarArea, eliminarMaquina, getAllInfoAreas } from '../../controller/api/admin-api';
import type { Area } from '../../models/areas.dto';
import { ConvertToBase64 } from '../../../acta-de-entrada/controller/ConvertToBase64';
import { Base64ToBlob } from '../../../acta-de-entrada/controller/Base64ToBlob';

/*interface Maquina {
  id: number;
  nombre: string;
}

interface Codigo {
  id: number;
  cod: string;
  maquina: Maquina[];
}

interface Area {
  id: number;
  nombre: string;
  codigo: Codigo[];
}*/

export const AdministrarAreasMaquinas = () => {

  const [habilitarEdicion, sethabilitarEdicion] = useState(true)
  // Estados para crear área
  const [newArea, setnewArea] = useState("");
  const [areas, setareas] = useState<Area[]>([]);

  // Estados para crear máquina
  const [maquina, setmaquina] = useState("");
  const [selectArea, setselectArea] = useState("");

  // Estados para edición
  const [modalEdicion, setmodalEdicion] = useState(false);
  const [itemEnEdicion, setitemEnEdicion] = useState<{ tipo: "area" | "maquina" | null; data: any }>({ tipo: null, data: null });
  const [areaEditTemp, setareaEditTemp] = useState("");
  const [maquinaEditTemp, setmaquinaEditTemp] = useState("");
  const [areName, setareName] = useState("");
  

  // Estados para alertas
  const [showSuccess, setshowSuccess] = useState(false);
  const [showError, setshowError] = useState(false);
  const [mensajeError, setmensajeError] = useState("");

  // Estados para errores de validación
  const [erroresArea, seterroresArea] = useState("");
  const [erroresMaquina, seterroresMaquina] = useState({ maquina: "", area: "" });

  const dialog = useRef<HTMLDialogElement>(null);
  const [imagen, setimagen] = useState<File | null>(null);
  const [imagenEditada, setimagenEditada] = useState<string | File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRefModal = useRef<HTMLInputElement | null>(null);

  // Funciones de validación
  const validarNombre = (valor: string) => {
    if (!valor.trim()) return "Este campo es requerido";
   // if (!/^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]+$/.test(valor)) return "Solo se permiten letras y espacios";
    return "";
  };

  const validarNombreGeneral = (valor: string) => {
    if (!valor.trim()) return "Este campo es requerido";
    if (!/^[a-záéíóúñA-ZÁÉÍÓÚÑ0-9\s\-_]+$/.test(valor)) return "Formato no válido";
    return "";
  };

  const validarSeleccion = (valor: string) => {
    if (!valor || valor === "") return "Debe seleccionar un área";
    return "";
  };

  // Cargar datos iniciales
  useEffect(() => {
    cargarAreas();
  }, []);

  const cargarAreas = async () => {
    try {
      const res = await getAllInfoAreas();
      setareas(res as Area[]);
    } catch (error) {
      console.error("Error al cargar áreas:", error);
    }
  };

  // CRUD ÁREAS
  const crearArea = async () => {
    const error = validarNombre(newArea);
    if (error) {
      seterroresArea(error);
      setmensajeError(error);
      setshowError(true);
      setTimeout(() => setshowError(false), 3000);
      return;
    }

    try {
      const res = await crearNuevaArea({ area: newArea });
      setmensajeError(res.msj);
      setshowSuccess(true);
      setTimeout(() => setshowSuccess(false), 2000);
      setnewArea("");
      seterroresArea("");
      cargarAreas();
    } catch (error) {
      console.error("Error al crear área:", error);
    }
  };

  // CRUD MÁQUINAS
  const crearMaquina = async () => {
    const errorMaquina = validarNombreGeneral(maquina);
    const errorArea = validarSeleccion(selectArea);

    if (errorMaquina || errorArea) {
      seterroresMaquina({
        maquina: errorMaquina,
        area: errorArea
      });
      setmensajeError(errorMaquina || errorArea);
      setshowError(true);
      setTimeout(() => setshowError(false), 3000);
      return;
    }

    try {

      const imagenBase64 =  imagen ? await ConvertToBase64(imagen) : null;
      const payload: any = {
  maquina,
  area: selectArea,
};

if (imagenBase64) {
  payload.imagen = imagenBase64;
}

const res = await crearNuevaMaquina(payload);
      console.log(res);
      if(!res.validate){
        setmensajeError(res.msj);
        setshowError(true);
        setTimeout(() => setshowError(false), 3000);
        return;
      }
      setmensajeError(res.msj);
      setshowSuccess(true);
      setTimeout(() => setshowSuccess(false), 2000);
      setmaquina("");
      setselectArea("");
      seterroresMaquina({ maquina: "", area: "" });
      setimagen(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      cargarAreas();
    } catch (error) {
      console.error("Error al crear máquina:", error);
    }
  };

  // Abrir modal de edición
  const abrirEdicion = (tipo: "area" | "maquina", data: any) => {
    setitemEnEdicion({ tipo, data });
    setimagenEditada(data.imagen || null);
    if (tipo === "area") {
      
      setareName(data.nombre);
    } else {
    const buscarArea = areas.find(a => a.codigo.some(c => c.maquina.some(m => m.id === data.id)));
      if (buscarArea) {
        setareaEditTemp(buscarArea.nombre);
      setmaquinaEditTemp(data.nombre);
    }
    
  };
  setmodalEdicion(true);
  };
  // Cerrar modal de edición
  const cerrarEdicion = () => {
    setmodalEdicion(false);
    setitemEnEdicion({ tipo: null, data: null });
    setareaEditTemp("");
    setmaquinaEditTemp("");
    setareName("");
    sethabilitarEdicion(true);
    setimagenEditada(null);
    if (fileInputRefModal.current) {
      fileInputRefModal.current.value = "";
    }
  };


  const guardarEdicion = async() => {
    const { tipo, data } = itemEnEdicion;
console.log(areName);
   if(tipo === "area"){
   const res = await actualizarArea(data.id, areName);
   if(res.validate){
    setmensajeError(res.msj);
    setshowSuccess(true);
    setTimeout(() => setshowSuccess(false), 2000);
    cargarAreas();
    cerrarEdicion();
   }else{ 
    setmensajeError(res.msj);
    setshowError(true);
    setTimeout(() => setshowError(false), 3000);
   }
    
  };

  if(tipo === "maquina"){
    let imagenBase64 = imagenEditada;
    
    // Si la imagen es un archivo, convertirla a base64
    if (imagenEditada instanceof File) {
      imagenBase64 = await ConvertToBase64(imagenEditada);
    }

    if(imagenBase64 instanceof File){
    return;
    }
    
    console.log(data.id,areaEditTemp);
    const res = await editarMaquina(data.id, areaEditTemp, maquinaEditTemp, imagenBase64);
    if(res.validate){
     setmensajeError(res.msj);
      setshowSuccess(true);
      setTimeout(() => setshowSuccess(false), 2000);
      cargarAreas();
      cerrarEdicion();
    }else{ 
      setmensajeError(res.msj);
      setshowError(true);
      setTimeout(() => setshowError(false), 3000);
    }
     setselectArea("");
  }
  };
  // Eliminar (por ahora no hace nada)
  const eliminarItem = async() => {
const { tipo, data } = itemEnEdicion;
    if (tipo === "area") {
      const res = await eliminarArea(data.id);
      if(res.validate){
        setmensajeError(res.msj);
        setshowSuccess(true);
        setTimeout(() => setshowSuccess(false), 2000);
        cargarAreas();
      }else{
        setmensajeError(res.msj);
        setshowError(true);
        setTimeout(() => setshowError(false), 3000);
      }
    }

    if (tipo === "maquina") {
      const res = await eliminarMaquina(data.id);
      if(res.validate){
        setmensajeError(res.msj);
        setshowSuccess(true);
        setTimeout(() => setshowSuccess(false), 2000);
        cargarAreas();
      }else{
        setmensajeError(res.msj);
        setshowError(true);
        setTimeout(() => setshowError(false), 3000);
      }
    }
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
        <p className="py-4">¿Esta seguro que desea eliminar la {itemEnEdicion.tipo}?</p>
        <div className="modal-action">
          <form method="dialog" className="flex gap-2">
            <button className="btn btn-primary" onClick={eliminarItem}>Eliminar</button>
            <button className="btn">Cancelar</button>
          </form>
        </div>
      </div>
    </dialog>

      <div className="w-full h-full p-6 space-y-6 flex flex-col">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-teal-500 to-cyan-600 rounded-2xl p-6 shadow-lg border-t-4 border-teal-400">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">⚙️</span>
              <div>
                <h1 className="text-2xl font-bold text-white">Áreas y Máquinas</h1>
                <p className="text-teal-100 text-sm">Gestiona las áreas de trabajo y máquinas disponibles</p>
              </div>
            </div>
          </div>
        </div>

        {/* SECCIÓN CREAR ÁREA Y MÁQUINA */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Crear Área */}
          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl shadow-sm p-6 border border-teal-100">
            <h2 className="text-lg font-bold text-teal-900 mb-4 pb-3 border-b-2 border-teal-300 flex items-center gap-2"><span>📍</span> Nueva Área</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre del área</label>
                <input
                  type="text"
                  className={`input input-sm input-bordered w-full rounded-lg focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-400 ${erroresArea ? 'input-error' : ''}`}
                  onChange={(e) => {
                    setnewArea(e.target.value);
                    seterroresArea(validarNombre(e.target.value));
                  }}
                  value={newArea}
                />
                <div className="h-5">{erroresArea && <p className="text-red-500 text-xs mt-1">{erroresArea}</p>}</div>
              </div>
              <div className="flex justify-end">
                <button className="btn btn-sm bg-gradient-to-r from-teal-500 to-cyan-600 text-white border-0 hover:from-teal-600 hover:to-cyan-700 gap-2" onClick={crearArea}>➕ Crear Área</button>
              </div>
            </div>
          </div>

          {/* Crear Máquina */}
          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl shadow-sm p-6 border border-teal-100">
            <h2 className="text-lg font-bold text-teal-900 mb-4 pb-3 border-b-2 border-teal-300 flex items-center gap-2"><span>⚙️</span> Nueva Máquina</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre de la máquina</label>
                <input
                  type="text"
                  className={`input input-sm input-bordered w-full rounded-lg focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-400 ${erroresMaquina.maquina ? 'input-error' : ''}`}
                  onChange={(e) => {
                    setmaquina(e.target.value);
                    seterroresMaquina({ ...erroresMaquina, maquina: validarNombreGeneral(e.target.value) });
                  }}
                  value={maquina}
                />
                <div className="h-5">{erroresMaquina.maquina && <p className="text-red-500 text-xs mt-1">{erroresMaquina.maquina}</p>}</div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Área</label>
                <select
                  className={`select select-sm select-bordered w-full rounded-lg focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-400 ${erroresMaquina.area ? 'select-error' : ''}`}
                  value={selectArea}
                  onChange={(e) => {
                    setselectArea(e.target.value);
                    seterroresMaquina({ ...erroresMaquina, area: validarSeleccion(e.target.value) });
                  }}
                >
                  <option value="">Selecciona un área</option>
                  {areas.map((a) => (
                    <option key={a.id} value={a.nombre}>{a.nombre}</option>
                  ))}
                </select>
                <div className="h-5">{erroresMaquina.area && <p className="text-red-500 text-xs mt-1">{erroresMaquina.area}</p>}</div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Imagen</label>
            <input 
              type="file" 
              className="file-input file-input-sm file-input-bordered w-full rounded-lg focus:outline-none" 
              accept="image/*"
              ref={fileInputRef}
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setimagen(file);
              }}
            />
             {imagen && <p className="text-xs text-green-600 mt-1">✓ Imagen seleccionada</p>}
              </div>
              <div className="flex justify-end">
                <button className="btn btn-sm bg-gradient-to-r from-teal-500 to-cyan-600 text-white border-0 hover:from-teal-600 hover:to-cyan-700 gap-2" onClick={crearMaquina}>➕ Crear Máquina</button>
              </div>
            </div>
          </div>
        </div>

        {/* SECCIÓN TABLA DE ÁREAS CON CÓDIGOS Y MÁQUINAS */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-bold text-teal-900 mb-4 pb-3 border-b-2 border-teal-300 flex items-center gap-2"><span>📊</span> Áreas con Códigos y Máquinas</h2>

          {areas.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No hay áreas registradas</p>
          ) : (
            <div className="space-y-3">
              {areas.map((area) => (
                <div key={area.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 mb-3">📍 {area.nombre}</h3>

                      {area.codigo && area.codigo.length > 0 ? (
                        <div className="space-y-3 ml-4">
                          {area.codigo.map((cod) => (
                            <div key={cod.id} className="border-l-2 border-blue-400 pl-3">
                              <p className="text-sm font-semibold text-blue-700">🔹 Código: {cod.cod}</p>

                              {cod.maquina && cod.maquina.length > 0 ? (
                                <div className="mt-2 space-y-1 ml-3">
                                  {cod.maquina.map((maq) => (
                                    <>
                                    <div key={maq.id} className="flex justify-between items-center">
                                      <p className="text-sm text-gray-700">⚙️ {maq.nombre}</p>
                                      <div className="flex gap-2">
                                        <button
                                          className="btn btn-xs btn-ghost tooltip"
                                          data-tip="Detalles"
                                          onClick={() => abrirEdicion("maquina", maq)}
                                        >
                                          ℹ️
                                        </button>
                                        <button
                                          className="btn btn-xs btn-error tooltip"
                                          data-tip="Eliminar"
                                          onClick={() => {setitemEnEdicion({tipo:"maquina",data:maq});if(dialog.current) dialog.current.showModal(); }}
                                        >
                                          🗑️
                                        </button>
                                      </div>
                                     
                                    </div>
                                     <div className='ml-10'>
                                        {maq.imagen ? (
                                          <img src={maq.imagen} alt="Imagen de la máquina" className="w-10 h-10 object-cover rounded" />
                                        ) : (
                                          <span className="text-gray-500 text-sm">N/A</span>
                                        )}
                                      </div>
                                      </>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-gray-500 italic ml-3">Sin máquinas asignadas</p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic ml-4">Sin códigos asignados</p>
                      )}
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        className="btn btn-xs btn-ghost tooltip"
                        data-tip="Detalles"
                        onClick={() => abrirEdicion("area", area)}
                      >
                        ℹ️
                      </button>
                      <button
                        className="btn btn-xs btn-error tooltip"
                        data-tip="Eliminar"
                       onClick={() => {setitemEnEdicion({tipo:"area",data: area}); if(dialog.current) dialog.current.showModal(); }}
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-96 border border-gray-200 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  {itemEnEdicion.tipo === "area" ? "✏️ Editar Área" : "✏️ Editar Máquina"}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {itemEnEdicion.tipo === "area" ? "Modifica los datos del área" : "Modifica los datos de la máquina"}
                </p>
              </div>
              <button 
                onClick={cerrarEdicion} 
                className="btn btn-circle btn-sm btn-ghost hover:bg-gray-200 transition"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            {itemEnEdicion.tipo === "area" ? (
              <div className="space-y-4 mb-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold text-gray-700">📍 Nombre del Área</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ingresa el nombre del área"
                    className="input input-bordered w-full focus:border-teal-500 transition"
                    value={areName}
                    onChange={(e) =>{setareName(e.target.value); if(e.target.value.trim() !== ""){sethabilitarEdicion(false)} else{sethabilitarEdicion(true)} }}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4 mb-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold text-gray-700">⚙️ Nombre de la Máquina</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ingresa el nombre de la máquina"
                    className="input input-bordered w-full focus:border-teal-500 transition"
                    value={maquinaEditTemp}
                    onChange={(e) =>{setmaquinaEditTemp(e.target.value); if(e.target.value.trim() !== ""){sethabilitarEdicion(false)} else{sethabilitarEdicion(true)} }}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold text-gray-700">📍 Área Asignada</span>
                  </label>
                  <select
                    className="select select-bordered w-full focus:border-teal-500 transition"
                    value={areaEditTemp}
                    onChange={(e)=>{setareaEditTemp(e.target.value); if(e.target.value.trim() !== ""){sethabilitarEdicion(false)} else{sethabilitarEdicion(true)};}}
                  >
                    <option value="">Selecciona un área...</option>
                    {areas.map((a) => (
                      <option key={a.id} value={a.nombre}>{a.nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold text-gray-700">🖼️ Imagen</span>
                  </label>
                  {imagenEditada ? (
                    <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden group border-2 border-dashed border-gray-300">
                      {typeof imagenEditada === 'string' ? (
                        <img src={imagenEditada} alt="Imagen de máquina" className="w-full h-full object-contain" />
                      ) : (
                        <img src={URL.createObjectURL(imagenEditada)} alt="Imagen de máquina" className="w-full h-full object-contain" />
                      )}
                      <button
                        type="button"
                        className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition opacity-0 group-hover:opacity-100 cursor-pointer"
                        onClick={() => {
                          setimagenEditada(null);
                          if (fileInputRefModal.current) {
                            fileInputRefModal.current.value = "";
                          }
                          sethabilitarEdicion(true);
                        }}
                        title="Haz clic para eliminar la imagen"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <input
                      type="file"
                      className="file-input file-input-bordered w-full focus:file-input-success transition"
                      accept="image/*"
                      ref={fileInputRefModal}
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        if (file) {
                          setimagenEditada(file);
                          sethabilitarEdicion(false);
                        }
                      }}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex gap-3 justify-end pt-6 border-t border-gray-200">
              <button 
                className="btn btn-ghost gap-2 hover:bg-gray-200 transition" 
                onClick={cerrarEdicion}
              >
                ✕ Cancelar
              </button>
              <button 
                className="btn bg-gradient-to-r from-teal-500 to-teal-600 text-white border-0 hover:from-teal-600 hover:to-teal-700 gap-2 transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed" 
                disabled={habilitarEdicion} 
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
