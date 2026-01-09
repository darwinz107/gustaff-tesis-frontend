import React, { useEffect, useState } from 'react'
import type { Fases, OrdenTrabajo } from '../../models/jornadasFases';
import { actualizarFases, faseCompletada, filtrarFases, getAllJornadas, getEstados, getFasesByOrdenTrabajo } from '../../controller/api/orden-api';
import type { Estado } from '../../../orden-de-compra/models/Estados';

export const GestionJornadas = () => {

    const [jornadas, setjornadas] = useState<OrdenTrabajo[]>([]);
    const [faseHabilitada, setfaseHabilitada] = useState(false);
    const [ventanaFase, setventanaFase] = useState(false);
    const [faseActual, setfaseActual] = useState<Fases|null>(null);
    const [mensajeFase, setmensajeFase] = useState("");
    const [showErrorFase, setshowErrorFase] = useState(false);
    const [showSuccessFase, setshowSuccessFase] = useState(false);
    const [descripcionFase, setdescripcionFase] = useState("");
    const [estados, setestados] = useState<Estado[]>([]);
    const [filtroNumOrden, setFiltroNumOrden] = useState("");
const [filtroFechaInicial, setFiltroFechaInicial] = useState("");
const [filtroEstado, setFiltroEstado] = useState("");

    const cargarJornadas = async () => {
        const res = await getAllJornadas();
        setjornadas(res);
    }

    useEffect(() => {
      const actualizarEstadoFases = async() =>{
        await actualizarFases();
        const res4 = await getEstados();
               setestados(res4);
      }
      actualizarEstadoFases();
        cargarJornadas();
    }, []);

    const applyFilters = async () => {
      const filtros = {
        numOrden: filtroNumOrden || undefined,
        fechaInicio: filtroFechaInicial || undefined,
        
        estado: filtroEstado || undefined,
        
      };
      const res = await filtrarFases(filtros);
      console.log(res);
      setjornadas(res);
    }

    const clearFilters = async () => {
      setFiltroNumOrden(""); setFiltroFechaInicial(""); setFiltroEstado("");
      cargarJornadas();
    }

      const enviarFaseCompletada = async() => {
        if (!faseActual) {
          setmensajeFase("No hay fase para completar");
          setshowErrorFase(true);
          setTimeout(() => setshowErrorFase(false), 3000);
          return;
        }
    
        if (!descripcionFase.trim()) {
          setmensajeFase("La descripción no puede estar vacía");
          setshowErrorFase(true);
          setTimeout(() => setshowErrorFase(false), 3000);
          return;
        }
    
        try {
          const res = await faseCompletada(faseActual.id, descripcionFase);
          setmensajeFase(res.msj);
          setshowSuccessFase(true);
          setTimeout(() => {
            setshowSuccessFase(false);
            setventanaFase(false);
            setdescripcionFase("");
            setfaseHabilitada(false);
           
          }, 2000);
          cargarJornadas();
        } catch (error) {
          setmensajeFase("Error al completar la fase");
          setshowErrorFase(true);
          setTimeout(() => setshowErrorFase(false), 3000);
        }
      }

       const cerrarModalFase = () => {
    setventanaFase(false);
    setdescripcionFase("");
    setfaseHabilitada(false);
    setfaseActual(null);
  }

    return (
        <>
        {showSuccessFase && (
      <div className="fixed top-5 right-5 z-100">
        <div role="alert" className="alert alert-success shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{mensajeFase}</span>
        </div>
      </div>
    )}

    {showErrorFase && (
      <div className="fixed top-5 right-5 z-100">
        <div role="alert" className="alert alert-error shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{mensajeFase}</span>
        </div>
      </div>
    )}
    <div className="w-full h-full rounded-2xl border border-gray-200 bg-white shadow-lg">
      <div className="bg-gradient-to-r from-green-500 to-green-600 w-full py-4 rounded-t-2xl border-b border-green-200 px-6">
        <h2 className="font-bold text-white text-lg">⏱️ Gestión de Jornadas y Fases</h2>
      </div>

      <div className="p-6">
        {/* Filtros */}
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 mb-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-700 mb-4 pb-3 border-b border-green-200">🔍 Filtros</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">Número de Orden</label>
              <input className="input input-sm input-bordered w-full mt-2 focus:input-success rounded-lg" value={filtroNumOrden} onChange={(e)=>setFiltroNumOrden(e.target.value)} />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">Fecha Inicial</label>
              <input type="date" className="input input-sm input-bordered w-full mt-2 focus:input-success rounded-lg" value={filtroFechaInicial} onChange={(e)=>setFiltroFechaInicial(e.target.value)}/>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">Estado</label>
              <select className="select select-sm select-bordered w-full mt-2 focus:select-success rounded-lg" value={filtroEstado} onChange={(e)=>setFiltroEstado(e.target.value)}>
                <option value="">Todos</option>
                {estados.map((es)=> <option key={es.id} value={es.estado}>{es.estado}</option>)}
              </select>
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <button className="btn btn-sm btn-ghost gap-2" onClick={clearFilters}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
              Limpiar
            </button>
            <button className="btn btn-sm bg-green-500 hover:bg-green-600 text-white border-0 gap-2" onClick={applyFilters}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/></svg>
              Aplicar
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="space-y-4">
          {jornadas.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No hay jornadas registradas</p>
            </div>
          ) : (
            <div className="space-y-3">
              {jornadas.map((j) => (
                <div key={j.id} className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-lg text-gray-800">📦 Orden: <span className="text-green-600">{j.NumOrden}</span></h3>
                  </div>

                  {j.jornadas && j.jornadas.length > 0 ? (
                    <div className="space-y-4 border-t pt-4">
                      {j.jornadas.map((sec) => (
                        <div key={sec.id} className="bg-gray-50 rounded-lg p-4 border-l-4 border-green-500">
                          <p className="text-sm font-semibold text-gray-700 mb-3">📂 Jornada: <span className="text-green-600">{sec.fecha}</span></p>

                          {sec.fases && sec.fases.length > 0 ? (
                            <div className="mt-2 space-y-2">
                              {sec.fases.map((per) => (
                                <div key={per.id} className="flex items-start justify-between bg-white p-3 rounded-lg border border-gray-200">
                                  <div className="flex-1">
                                    <p className="text-sm font-semibold text-gray-700">🔶 Hora: <span className="text-green-600">{per.hora}</span></p>
                                    {per.completo ? (
                                      <div className="mt-2">
                                        <span className="badge badge-success badge-sm">✅ Completado</span>
                                        <p className="text-sm text-gray-600 mt-1">📝 {per.descripcion ?? "Sin descripción"}</p>
                                      </div>
                                    ) : per.completo === false && per.agotado === true ? (
                                      <div className="mt-2">
                                        <span className="badge badge-error badge-sm">❌ Agotado</span>
                                        <p className="text-sm text-gray-600 mt-1">📝 {per.descripcion ?? "Sin descripción"}</p>
                                      </div>
                                    ) : (
                                      <span className="badge badge-warning badge-sm mt-2">⏳ Pendiente</span>
                                    )}
                                  </div>
                                  <button
                                    className="btn btn-sm btn-ghost gap-1 ml-2"
                                    onClick={()=>{setfaseActual(per); setventanaFase(true);
                                      setdescripcionFase(per.descripcion ?? "");
                                    }}
                                  >
                                    ✏️
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 italic">No hay fases registradas</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No hay jornadas registradas</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal para registrar fase completada */}
      <div className={`z-50 fixed inset-0 flex items-center justify-center transition-opacity duration-300 ${ventanaFase ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Registrar Fase</h3>
            <button onClick={cerrarModalFase} className="btn btn-circle btn-sm btn-ghost">✕</button>
          </div>

          {faseActual ? (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">Hora de la Fase</label>
                <input 
                  type="text" 
                  className="input input-sm input-bordered w-full mt-2 focus:input-success rounded-lg bg-gray-50" 
                  value={faseActual.hora} 
                  disabled 
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">Descripción del Trabajo</label>
                <textarea 
                  className="textarea textarea-sm textarea-bordered w-full mt-2 focus:textarea-success rounded-lg"
                  placeholder="Describe el trabajo realizado en esta fase..."
                  value={descripcionFase}
                  onChange={(e) => setdescripcionFase(e.target.value)}
                  disabled={!faseHabilitada}
                  rows={4}
                />
              </div>

              <div className="flex gap-2 pt-4">
                {!faseHabilitada ? (
                  <button 
                    className="btn btn-sm bg-green-500 hover:bg-green-600 text-white border-0 flex-1 gap-2"
                    onClick={() => setfaseHabilitada(true)}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/></svg>
                    Editar
                  </button>
                ) : (
                  <button 
                    className="btn btn-sm bg-green-500 hover:bg-green-600 text-white border-0 flex-1 gap-2"
                    onClick={enviarFaseCompletada}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
                    Enviar
                  </button>
                )}
                <button 
                  className="btn btn-sm btn-ghost flex-1 gap-2"
                  onClick={cerrarModalFase}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
                  Cerrar
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No hay fases pendientes para completar</p>
            </div>
          )}
        </div>
      </div>
    </div>
        </>
    )
}
