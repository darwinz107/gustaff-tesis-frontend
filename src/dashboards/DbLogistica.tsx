

import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2';
import "../lib/chartSetup";

export const DbLogistica = () => {
  const API = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}dashboard` : "http://localhost:3000/dashboard"; 
  const [loading, setloading] = useState(true);
  const [mes, setMes] = useState<number | null>(null);
  const [año, setAño] = useState<number | null>(null);
  const [logistica, setlogistica] = useState<{totalStock,
    totalRegEntrada:number,
    totalItemsEntrada:{cantidad:number},
    totalRegSalida:number,
    totalItemsSalida:{cantidad:number},
    mes?:number,
    año?:number}|null>(null);
  const [entradasPorDia, setentradasPorDia] = useState<{fechaRemision:string,total:number}[]|null>(null);
  const [salidasPorDia, setsalidasPorDia] = useState<{fechaRemision:string,total:number}[]|null>(null);
  const [ultimasOrdenes, setUltimasOrdenes] = useState([]);
  const [ultimasSolicitudes, setUltimasSolicitudes] = useState([]);
  const [ultimasSalidas, setUltimasSalidas] = useState([]);
  const [ultimasEntradas, setUltimasEntradas] = useState([]);
  const [solicitudes, setsolicitudes] = useState<{totalSol:number,enProceso:number,listoParaEntrega:number,entregado:number}|null>(null);

  const getEstadoColor = (estado: string) => {
    const estadoUpper = estado?.toUpperCase() || "";
    if (estadoUpper.includes("FINALIZADO") || estadoUpper.includes("ENTREGADO")) {
      return { /*bg: "bg-green-100", text: "text-green-800",*/ badge: "badge-success" };
    } else if (estadoUpper.includes("PROCESO") || estadoUpper.includes("EN PROCESO"))
    {
      return { /*bg: "bg-yellow-100", text: "text-yellow-800",*/ badge: "badge-warning" };
    } 
      else if (estadoUpper.includes("LISTA PARA ENTREGA")) {
      return { /*bg: "bg-orange-100", text: "text-orange-800",*/ badge: "badge-warning" };
    }
    else if (estadoUpper.includes("VENCIDO") || estadoUpper.includes("CANCELADO")) {
      return { /*bg: "bg-red-100", text: "text-red-800",*/ badge: "badge-error" };
    } else {
      return { /*bg: "bg-blue-100", text: "text-blue-800",*/ badge: "badge-info" };
    }
  };

  useEffect(() => {
    let mounted = true;   
    
    const load = async()=>{
      try { 
        const [entradasDia, totalesLog, salidasDia, uo, us, us_salida, us_entrada, sol] = await Promise.all([
          axios.get(`${API}/entradas-por-dia?days=30`).then((r)=>r.data),
          axios.get(`${API}/logistica`).then((r)=>r.data),
          axios.get(`${API}/salidas-por-dia?days=30`).then((r)=>r.data),
          axios.get(`${API}/ultimas-ordenes?limit=7`).then((r)=>r.data),
          axios.get(`${API}/ultimas-solicitudes?limit=7`).then((r)=>r.data),
          axios.get(`${API}/actas-salida-mes`).then((r)=>r.data).catch(() => []),
          axios.get(`${API}/actas-entrada-mes`).then((r)=>r.data).catch(() => []),
          axios.get(`${API}/solicitudes`).then((r)=>r.data),
        ]);

        if(!mounted) return;

        setentradasPorDia(entradasDia);
        setlogistica(totalesLog);
        setsalidasPorDia(salidasDia);
        setUltimasOrdenes(uo);
        setUltimasSolicitudes(us);
        setUltimasSalidas(us_salida);
        setUltimasEntradas(us_entrada);
        setsolicitudes(sol);
        setMes(totalesLog.mes);
        setAño(totalesLog.año);
      } catch (error) {
        console.error("Error cargando dashboard:", error);
      } finally {
        setloading(false);
      }
    };

    load();
    return ()=> { mounted = false; }
  }, []);

  if(loading) return <div className="p-6">Cargando...</div>;
  if (!entradasPorDia || !logistica) {
    return (
      <div className="p-6 text-error">
        Error cargando datos del dashboard
      </div>
    );
  }
  
  return (
    <div className="p-6 space-y-6">
      {mes && año && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white shadow-lg">
          <p className="text-sm font-semibold opacity-90">Datos correspondientes a:</p>
          <p className="text-2xl font-bold">
            {new Date(año, mes - 1).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).charAt(0).toUpperCase() + 
             new Date(año, mes - 1).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).slice(1)}
          </p>
        </div>
      )}

            {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className='card p-4 bg-blue-100 border border-blue-300 bg-opacity-50'>
          <div className='text-sm text-blue-500 font-semibold'>Total Items</div>
          <div className='text-2xl font-semibold text-blue-800'>{logistica?.totalStock ?? 0}</div>   
        </div>
        <div className='card p-4 bg-blue-100 border border-blue-300 bg-opacity-50'>
          <div className='text-sm text-blue-500 font-semibold'>Total registros salida</div>
          <div className='text-2xl font-semibold text-blue-800'>{logistica?.totalRegSalida ?? 0}</div>
        </div>
        <div className='card p-4 bg-yellow-100 border border-yellow-300 bg-opacity-50'>
          <div className='text-sm text-yellow-700 font-semibold'>Solicitudes en Proceso</div>
          <div className='text-2xl font-semibold text-yellow-800'>{solicitudes?.enProceso ?? 0}</div>
        </div>
        <div className='card p-4 bg-orange-100 border border-orange-300 bg-opacity-50'>
          <div className='text-sm text-orange-700 font-semibold'>Lista para Entrega</div>
          <div className='text-2xl font-semibold text-orange-800'>{solicitudes?.listoParaEntrega ?? 0}</div>
        </div>
        <div className='card p-4 bg-green-100 border border-green-300 bg-opacity-50'>
          <div className='text-sm text-green-700 font-semibold'>Solicitudes Entregadas</div>
          <div className='text-2xl font-semibold text-green-800'>{solicitudes?.entregado ?? 0}</div>
        </div>
      </div>

      {/* Tablas principales */}
      <div className="grid grid-cols-1 gap-6">
        <div className="card p-4 bg-base-100 border max-h-64 overflow-y-auto">
          <h3 className="font-medium mb-3 text-lg">📋{`Órdenes (últimas 7)`}</h3>
          <div className="overflow-x-auto">
            <table className="table w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-3 py-2">#</th>
                  <th className="px-3 py-2">NumOrden</th>
                  <th className="px-3 py-2">Solicitante</th>
                  <th className="px-3 py-2">Fecha Inicio</th>
                  <th className="px-3 py-2">Fecha Fin</th>
                  <th className="px-3 py-2">Dias transcurridos</th>
                  <th className="px-3 py-2">Estado</th>
                  <th className="px-3 py-2">Descripción</th>
                </tr>
              </thead>
              <tbody>
                {ultimasOrdenes.map(o => {
                  const colorConfig = getEstadoColor(o.estado);
                  return (
                    <tr key={o.id} className="border-b hover:bg-gray-50">
                      <td className="px-3 py-2 font-semibold">{o.id}</td>
                      <td className="px-3 py-2 font-semibold text-blue-600">{o.numOrden}</td>
                      <td className="px-3 py-2">{o.solicitante}</td>
                      <td className="px-3 py-2 text-xs">{o.fechaInicio ? new Date(o.fechaInicio).toLocaleDateString('es-ES') : 'N/A'}</td>
                      <td className="px-3 py-2 text-xs">{o.o_fechaFinal ? new Date(o.o_fechaFinal).toLocaleDateString('es-ES') : 'N/A'}</td>
                      <td className="px-3 py-2 font-semibold">{o.dias_transcurridos ?? "N/A"}</td>
                      <td className="px-3 py-2 ">
                        <span className={`badge ${colorConfig.badge} gap-1`}>{o.estado}</span>
                      </td>
                      <td className="px-3 py-2 text-xs max-w-xs truncate">{o.descripcion}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card p-4 bg-base-100 border max-h-64 overflow-y-auto">
          <h3 className="font-medium mb-3 text-lg">📦{`Solicitudes (últimas 7)`}</h3>
          <div className="overflow-x-auto">
            <table className="table w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-3 py-2">#</th>
                  <th className="px-3 py-2">NumSolicitud</th>
                  <th className="px-3 py-2">OT Asoc.</th>
                  <th className="px-3 py-2">Solicitante</th>
                  <th className="px-3 py-2">Fecha de remision</th>
                  <th className="px-3 py-2">Dias transcurridos</th>
                  <th className="px-3 py-2">Autoriza</th>
                  <th className="px-3 py-2">Estado</th>
                </tr>
              </thead>
              <tbody>
                {ultimasSolicitudes.map(s => {
                  const colorConfig = getEstadoColor(s.estado);
                  return (
                    <tr key={s.id} className="border-b hover:bg-gray-50">
                      <td className="px-3 py-2 font-semibold">{s.id}</td>
                      <td className="px-3 py-2 font-semibold text-purple-600">{s.numOrden}</td>
                      <td className="px-3 py-2 text-sm">{s.numOrdenTrabajo}</td>
                      <td className="px-3 py-2">{s.solicitante}</td>
                      <td className="px-3 py-2 text-xs">{s.s_fechaRemision ? new Date(s.s_fechaRemision).toLocaleDateString('es-ES') : 'N/A'}</td>
                      <td className="px-3 py-2 text-center font-semibold">{s.dias_transcurridos ?? 0}</td>
                      <td className="px-3 py-2 text-sm">{s.userAutoriza}</td>
                      <td className="px-3 py-2 ">
                        <span className={`badge ${colorConfig.badge} gap-1 whitespace-nowrap`}>{s.estado}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card p-4 bg-base-100 border max-h-64 overflow-y-auto">
         <div className='flex justify-between'>
          <h3 className="font-medium mb-3 text-lg">📤{`Actas de Salida (últimas 7)`}</h3>
           <button className="btn btn-sm hover:btn-primary gap-2" onClick={()=> window.open('http://localhost:3000/reporte/acta-salida','_blank')}>Reporte 📄</button>
          </div> 
          <div className="overflow-x-auto">
            <table className="table w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-3 py-2">Nº Acta</th>
                  <th className="px-3 py-2">Fecha</th>
                  <th className="px-3 py-2">Recibe</th>
                  <th className="px-3 py-2">Entrega</th>
                  <th className="px-3 py-2">Nº Compra</th>
                  <th className="px-3 py-2">Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {ultimasSalidas && ultimasSalidas.length > 0 ? ultimasSalidas.map((s, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="px-3 py-2 font-semibold">{s.numActa}</td>
                    <td className="px-3 py-2 text-xs">{s.fechaRemision ? new Date(s.fechaRemision).toLocaleDateString('es-ES') : 'N/A'}</td>
                    <td className="px-3 py-2">{s.recibidoPor ?? 'N/A'}</td>
                    <td className="px-3 py-2">{s.entregadoPor ?? 'N/A'}</td>
                    <td className="px-3 py-2 text-sm">{s.numOrdenCompra ?? 'N/A'}</td>
                    <td className="px-3 py-2 text-center font-semibold">{s.total ?? '0'}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="text-center text-sm text-gray-500 py-4">No hay datos</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card p-4 bg-base-100 border max-h-64 overflow-y-auto">
          <h3 className="font-medium mb-3 text-lg">📥{`Actas de Entrada (últimas 7)`}</h3>
          <div className="overflow-x-auto">
            <table className="table w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-3 py-2">Nº Acta</th>
                  <th className="px-3 py-2">Fecha</th>
                  <th className="px-3 py-2">Factura</th>
                  <th className="px-3 py-2">Proveedor</th>
                  <th className="px-3 py-2">Nº Compra</th>
                  <th className="px-3 py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {ultimasEntradas && ultimasEntradas.length > 0 ? ultimasEntradas.map((e, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="px-3 py-2 font-semibold">{e.numActa}</td>
                    <td className="px-3 py-2 text-xs">{e.fechaRemision ? new Date(e.fechaRemision).toLocaleDateString('es-ES') : 'N/A'}</td>
                    <td className="px-3 py-2">{e.factura}</td>
                    <td className="px-3 py-2">{e.proovedor ?? 'N/A'}</td>
                    <td className="px-3 py-2 text-sm">{e.numOrdenCompra ?? 'N/A'}</td>
                    <td className="px-3 py-2 text-right font-semibold">${e.total ?? '0'}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="text-center text-sm text-gray-500 py-4">No hay datos</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-4 bg-base-100 border">
          <h3 className="font-medium mb-3">Entradas de {new Date(año, mes - 1).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</h3>
          <Line
            data={{
              labels: entradasPorDia.map((d) => d.fechaRemision.split("T")[0]),
              datasets: [
                {
                  label: "Entradas",
                  data: entradasPorDia.map((t) => t.total),
                  borderColor: "rgba(34, 197, 94, 1)",
                  backgroundColor: "rgba(34, 197, 94, 0.1)",
                  borderWidth: 3,
                  fill: true,
                  tension: 0.4,
                  pointBackgroundColor: "rgba(34, 197, 94, 1)",
                  pointBorderColor: "rgba(255, 255, 255, 1)",
                  pointBorderWidth: 2,
                  pointRadius: 5,
                  pointHoverRadius: 7,
                }
              ]
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false, labels: { font: { size: 12 } } }
              },
              scales: {
                x: {
                  ticks: {
                    maxRotation: 50,
                    minRotation: 50
                  }
                },
                y: {
                  ticks: {
                    precision: 0
                  },
                  beginAtZero: true
                }
              }
            }}
          />
        </div>
        <div className="card p-4 bg-base-100 border">
          <h3 className="font-medium mb-3">Salidas de {new Date(año, mes - 1).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</h3>
          <Line
            data={{
              labels: salidasPorDia?.map((d) => d.fechaRemision.split("T")[0]),
              datasets: [{
                label: "Salidas",
                data: salidasPorDia?.map((f) => f.total),
                borderColor: "rgba(239, 68, 68, 1)",
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: "rgba(239, 68, 68, 1)",
                pointBorderColor: "rgba(255, 255, 255, 1)",
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7,
              }]
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false, labels: { font: { size: 12 } } }
              },
              scales: {
                x: {
                  ticks: {
                    maxRotation: 50,
                    minRotation: 50
                  }
                },
                y: {
                  ticks: {
                    precision: 0
                  },
                  beginAtZero: true
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
