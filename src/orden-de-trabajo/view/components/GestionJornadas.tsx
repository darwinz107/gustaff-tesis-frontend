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
            <div className="w-full h-full p-6 space-y-6">
                <div className="bg-white rounded-xl shadow-md p-4">
                   <div className="bg-gray-100 w-full h-12 flex items-center justify-between rounded-t-lg border-b px-4">
                    <p className="font-semibold text-gray-700">Jornadas y fases</p>
                    <div className="flex items-center gap-3">
          
          <button className="btn btn-sm btn-outline" onClick={clearFilters}>Limpiar filtros</button>
          <button className="btn btn-sm btn-primary" onClick={applyFilters}>Aplicar filtros</button>
        </div>
        </div>
        <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600" >NumOrden</label>
          <input className="input input-sm"  value={filtroNumOrden} onChange={(e)=>setFiltroNumOrden(e.target.value)} />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Fecha inicial</label>
          <input type="date" className="input input-sm"  value={filtroFechaInicial} onChange={(e)=>setFiltroFechaInicial(e.target.value)}/>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Estado</label>
          <select className="select select-sm" value={filtroEstado} onChange={(e)=>setFiltroEstado(e.target.value)}>
            <option value="">Todos</option>
            {estados.map((es)=> <option key={es.id} value={es.estado}>{es.estado}</option>)}
          </select>
        </div>

      </div>
                    {jornadas.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No hay jornadas registradas</p>
                    ) : (
                        <div className="space-y-3">
                            {jornadas.map((j) => (
                                <div key={j.id} className="border rounded-lg p-4 bg-gray-50">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-800 mb-3">📦 {j.NumOrden}</h3>

                                            {j.jornadas && j.jornadas.length > 0 ? (
                                                <div className="space-y-3 ml-4">
                                                    {j.jornadas.map((sec) => (
                                                        <div key={sec.id} className="border-l-2 border-blue-400 pl-3">
                                                            <p className="text-sm font-semibold text-blue-700">📂 Jornada: {sec.fecha}</p>

                                                            {sec.fases && sec.fases.length > 0 ? (
                                                                <div className="mt-2 space-y-1 ml-3">
                                                                    {sec.fases.map((per) => (
                                                                        <div key={per.id} className="flex justify-between items-center">
                                                                            <p className="text-sm font-semibold text-blue-700">🔶 Hora: {per.hora}</p>
                                                                            {per.completo ? (<><p className="text-sm text-gray-700">✅ Completado</p>  
                                                                            <p className="text-sm text-gray-700">🔹Reporte: {per.descripcion ?? ""}</p>
                                                                            <div className="flex gap-1">
                                                                                <button
                                                                                    className="btn btn-xs btn-ghost"
                                                                                    onClick={()=>{setfaseActual(per); setventanaFase(true);
                                                                                        setdescripcionFase(per.descripcion ?? "");
                                                                                    }}
                                                                                >
                                                                                    Editar
                                                                                </button>
                                                                              
                                                                            </div>
                                                                            </>  ) 
                                                                             : per.completo === false && per.agotado === true ?<>
                                                                             <p className="text-sm text-gray-700"> ❌ Agotado</p> 
                                                                              <p className="text-sm text-gray-700">🔹Reporte: {per.descripcion ?? ""}</p>
                                                                            <div className="flex gap-1">
                                                                                <button
                                                                                    className="btn btn-xs btn-ghost"
                                                                                    onClick={()=>{setfaseActual(per); setventanaFase(true);}}
                                                                                >
                                                                                    Editar
                                                                                </button>
                                                                              
                                                                            </div>
                                                                             </> 
                                                                             : <></>}
                                                                             
                                                                             
                                                                            
                                                                        </div>
                                                                       
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <p className="text-sm text-gray-500 italic ml-3">Sin fases asignadas</p>
                                                            )}

                                                           
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-gray-500 italic ml-4">Sin jornadas asignadas</p>
                                            )}
                                        </div>

                             
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

             <div className={`z-50 fixed inset-0 flex items-center justify-center transition-opacity duration-300 ${ventanaFase ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative border border-gray-300 w-full max-w-md rounded-lg bg-white shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Registrar fase completada</h3>
          <button onClick={cerrarModalFase} className="btn btn-ghost btn-sm">✕</button>
        </div>

        {faseActual ? (
          <div className="space-y-4">
            <div>
              <label className="label">Hora de la fase</label>
              <input 
                type="text" 
                className="input input-bordered w-full" 
                value={faseActual.hora} 
                disabled 
              />
            </div>

            <div>
              <label className="label">Descripción</label>
              <textarea 
                className="textarea textarea-bordered w-full" 
                placeholder="Describe el trabajo realizado en esta fase..."
                value={descripcionFase}
                onChange={(e) => setdescripcionFase(e.target.value)}
                disabled={!faseHabilitada}
                rows={4}
              />
            </div>

            <div className="flex gap-2">
              {!faseHabilitada ? (
                <button 
                  className="btn btn-primary flex-1"
                  onClick={() => setfaseHabilitada(true)}
                >
                  Editar
                </button>
              ) : (
                <button 
                  className="btn btn-success flex-1"
                  onClick={enviarFaseCompletada}
                >
                  Enviar
                </button>
              )}
              <button 
                className="btn btn-ghost flex-1"
                onClick={cerrarModalFase}
              >
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
        </>
    )
}
