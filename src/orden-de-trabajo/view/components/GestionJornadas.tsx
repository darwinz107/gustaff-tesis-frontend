import React, { useEffect, useState } from 'react'
import type { OrdenTrabajo } from '../../models/jornadasFases';
import { getAllJornadas } from '../../controller/api/orden-api';

export const GestionJornadas = () => {

    const [jornadas, setjornadas] = useState<OrdenTrabajo[]>([]);

    const cargarJornadas = async () => {
        const res = await getAllJornadas();
        setjornadas(res);
    }

    useEffect(() => {
        cargarJornadas();
    }, []);


    return (
        <>
            <div className="w-full h-full p-6 space-y-6">
                <div className="bg-white rounded-xl shadow-md p-4">
                    <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Jornadas y fases</h2>
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
                                                                            {per.completo ? <p className="text-sm text-gray-700">✅ Completado</p>
                                                                             : per.completo === false && per.agotado === true ? <p className="text-sm text-gray-700"> ❌ Agotado</p> 
                                                                             : <p className="text-sm text-gray-700">Transcurriendo</p>}
                                                                              <p className="text-sm text-gray-700">🔹Reporte: {per.descripcion ?? ""}</p>
                                                                             
                                                                            <div className="flex gap-2">
                                                                                <button
                                                                                    className="btn btn-xs btn-ghost"

                                                                                >
                                                                                    Editar
                                                                                </button>
                                                                                <button
                                                                                    className="btn btn-xs btn-error"

                                                                                >
                                                                                    Eliminar
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                       
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <p className="text-sm text-gray-500 italic ml-3">Sin fases asignadas</p>
                                                            )}

                                                            <div className="flex gap-2 ml-3 mt-2">
                                                                <button
                                                                    className="btn btn-xs btn-ghost"

                                                                >
                                                                    Editar
                                                                </button>
                                                                <button
                                                                    className="btn btn-xs btn-error"

                                                                >
                                                                    Eliminar
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-gray-500 italic ml-4">Sin jornadas asignadas</p>
                                            )}
                                        </div>

                                        <div className="flex gap-2 ml-4">
                                            <button
                                                className="btn btn-xs btn-ghost"

                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="btn btn-xs btn-error"

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
        </>
    )
}
