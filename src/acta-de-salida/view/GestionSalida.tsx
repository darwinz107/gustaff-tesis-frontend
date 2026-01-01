import React, { useEffect, useState } from 'react'
import type { InfoPdfSalida } from '../models/InfoPdfSalida';
import { findAllRegistroSalida, filtrarActasSalida } from '../controller/actaSalida-api';

export const GestionSalida = () => {
  const [actas, setactas] = useState<InfoPdfSalida[]>([]);
  const [filtroNumActa, setFiltroNumActa] = useState("");
  const [filtroRecibe, setFiltroRecibe] = useState("");
  const [filtroEntrega, setFiltroEntrega] = useState("");
  const [filtroDestino, setFiltroDestino] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");

 const llenarActas = async() => {
      const res = await findAllRegistroSalida();
      setactas(res || []);
    }

  useEffect(() => {
   
    llenarActas();
  }, []);

  const aplicarFiltros = async () => {
    const filtros = {
      numActa: filtroNumActa || undefined,
      fechaRemision: filtroFecha || undefined,
      recibe: filtroRecibe || undefined,
      entrega: filtroEntrega || undefined,
      destino: filtroDestino || undefined
    };
    const res = await filtrarActasSalida(filtros as any);
    setactas(res || []);
  }

  const limpiarFiltros = async () => {
    setFiltroNumActa("");
    setFiltroRecibe("");
    setFiltroEntrega("");
    setFiltroDestino("");
    setFiltroFecha("");
    const res = await findAllRegistroSalida();
    setactas(res || []);
  }

  const cargarPdf = async(id:number) => {
    window.open(`/pdf-salida/${id}`,"_blank");
  }

  return (
    <>
      <div className="min-w-[70%] min-h-[60%] rounded-xl border border-gray-200 m-4 bg-white shadow-sm">
        <div className="bg-gray-100 w-full h-12 flex items-center justify-between rounded-t-lg border-b px-4">
          <p className="font-semibold text-gray-700">Listado de actas de salida</p>
          <div className="flex items-center gap-2">
            <button className="btn btn-sm btn-ghost" onClick={() => llenarActas()}>Refrescar</button>
            <button className="btn btn-sm btn-ghost" onClick={limpiarFiltros}>Limpiar</button>
            <button className="btn btn-sm btn-primary" onClick={aplicarFiltros}>Aplicar filtros</button>
          </div>
        </div>

        <div className="p-4 grid grid-cols-1 lg:grid-cols-5 gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">N.Acta</label>
            <input className="input input-sm" value={filtroNumActa} onChange={(e)=>setFiltroNumActa(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Recibe</label>
            <input className="input input-sm" value={filtroRecibe} onChange={(e)=>setFiltroRecibe(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Entrega</label>
            <input className="input input-sm" value={filtroEntrega} onChange={(e)=>setFiltroEntrega(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Destino</label>
            <input className="input input-sm" value={filtroDestino} onChange={(e)=>setFiltroDestino(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Fecha</label>
            <input type="date" className="input input-sm" value={filtroFecha} onChange={(e)=>setFiltroFecha(e.target.value)} />
          </div>
        </div>

        <div className="overflow-x-auto p-5">
          <div className="overflow-hidden border rounded-lg">
            <div className="max-h-[520px] overflow-auto">
              <table className="table w-full">
                <thead className="bg-white sticky top-0">
                  <tr className="text-sm text-left text-gray-600">
                    <th className="px-4 py-3">N.Acta de salida</th>
                    <th className="px-4 py-3">Fecha de remisión</th>
                    <th className="px-4 py-3">Recibe</th>
                    <th className="px-4 py-3">Entrega</th>
                    <th className="px-4 py-3">Destino</th>
                    <th className="px-4 py-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {actas.map((u, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{u.numActa}</td>
                      <td className="px-4 py-3">{u.fechaRemision ? u.fechaRemision.split("T")[0] : ""}</td>
                      <td className="px-4 py-3">{u.numSolicitudCompra?.numOrdenTrabajo?.userSolicitante?.name ?? u.recibeSinSM?.name}</td>
                      <td className="px-4 py-3">{u.entrega?.name ?? ""}</td>
                      <td className="px-4 py-3">{u.destino ?? "" }</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex gap-2 justify-center">
                          <button className="btn btn-ghost btn-xs" disabled>Ver detalles</button>
                          <button className="btn btn-ghost btn-xs" disabled>Eliminar</button>
                          <button className="btn btn-ghost btn-xs" onClick={()=>cargarPdf(u.id)}>Ver PDF</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {actas.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center text-sm text-gray-500 py-8">No hay actas</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
