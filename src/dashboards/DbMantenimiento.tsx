import React, { useEffect, useState } from "react";
import axios from "axios";
import "../lib/chartSetup";
import { Bar, Line } from "react-chartjs-2";


export const DbMantenimiento = () => {
  const API = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}dashboard` : "http://localhost:3000/dashboard"; 

  const [kpis, setKpis] = useState(null);
  const [mes, setMes] = useState<number | null>(null);
  const [año, setAño] = useState<number | null>(null);
  const [solicitudes, setsolicitudes] = useState<{totalSol:number,enProceso:number,parcial:number,entregado:number}|null>(null);
  const [ordenesEstado, setOrdenesEstado] = useState([]);
  const [solicitudesDia, setSolicitudesDia] = useState([]);
  const [ultimasOrdenes, setUltimasOrdenes] = useState([]);
  const [ultimasSolicitudes, setUltimasSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const [k,g, oe, sd, uo, us] = await Promise.all([
          axios.get(`${API}/kpis`).then((r) => r.data),
          axios.get(`${API}/solicitudes`).then((r) => r.data),
          axios.get(`${API}/ordenes-por-estado`).then((r) => r.data),
          axios.get(`${API}/solicitudes-por-dia?days=30`).then((r) => r.data),
          axios.get(`${API}/ultimas-ordenes?limit=5`).then((r) => r.data),
          axios.get(`${API}/ultimas-solicitudes?limit=5`).then((r) => r.data),
          
        ]);
        if (!mounted) return;
        setKpis(k);
        setMes(k.mes);
        setAño(k.año);
        setsolicitudes(g);
        setOrdenesEstado(oe);
        setSolicitudesDia(sd);
        setUltimasOrdenes(uo);
        setUltimasSolicitudes(us);
      } catch (err) {
        console.error("Error cargando dashboard:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  if (loading) return <div className="p-6">Cargando dashboard...</div>;
  if (!kpis) {
  return (
    <div className="p-6 text-error">
      Error cargando datos del dashboard
    </div>
  );
}

const MATERIAL_COLORS = [
  { bg: 'rgba(233, 30, 99, 0.7)', border: 'rgba(233, 30, 99, 1)' },      // Pink (vibrante)
  { bg: 'rgba(156, 39, 176, 0.7)', border: 'rgba(156, 39, 176, 1)' },    // Purple
  { bg: 'rgba(63, 81, 181, 0.7)', border: 'rgba(63, 81, 181, 1)' },      // Indigo
  { bg: 'rgba(33, 150, 243, 0.7)', border: 'rgba(33, 150, 243, 1)' },    // Blue
  { bg: 'rgba(0, 188, 212, 0.7)', border: 'rgba(0, 188, 212, 1)' },      // Cyan
  { bg: 'rgba(0, 150, 136, 0.7)', border: 'rgba(0, 150, 136, 1)' },      // Teal
  { bg: 'rgba(76, 175, 80, 0.7)', border: 'rgba(76, 175, 80, 1)' },      // Green
  { bg: 'rgba(255, 193, 7, 0.7)', border: 'rgba(255, 193, 7, 1)' },      // Amber
  { bg: 'rgba(255, 87, 34, 0.7)', border: 'rgba(255, 87, 34, 1)' },      // Deep Orange
  { bg: 'rgba(244, 67, 54, 0.7)', border: 'rgba(244, 67, 54, 1)' },      // Red
];


const getColorsByLength = (length: number) => {
  const colors = [];
  for (let i = 0; i < length; i++) {
    colors.push(MATERIAL_COLORS[i % MATERIAL_COLORS.length]);
  }
  return colors;
};

const getEstadoColor = (estado: string) => {
  const estadoUpper = estado?.toUpperCase() || "";
  if (estadoUpper.includes("COMPLETADO") || estadoUpper.includes("ENTREGADO")) {
    return { bg: "bg-green-100", text: "text-green-800", badge: "badge-success" };
  } else if (estadoUpper.includes("PROCESO") || estadoUpper.includes("EN PROCESO")) {
    return { bg: "bg-yellow-100", text: "text-yellow-800", badge: "badge-warning" };
  } else if (estadoUpper.includes("VENCIDO")) {
    return { bg: "bg-red-100", text: "text-red-800", badge: "badge-error" };
  } else {
    return { bg: "bg-blue-100", text: "text-blue-800", badge: "badge-info" };
  }
};

const cargoColors = getColorsByLength(ordenesEstado.length);
 

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

      <div className="grid grid-cols-1  gap-6">
        <div className="card p-4 bg-base-100 border max-h-64 overflow-y-auto">
          <h3 className="font-medium mb-3 text-lg">📋 Últimas Órdenes</h3>
          <div className="overflow-x-auto">
            <table className="table w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-3 py-2">#</th>
                  <th className="px-3 py-2">NumOrden</th>
                  <th className="px-3 py-2">Solicitante</th>
                  <th className="px-3 py-2">Fecha Inicio</th>
                  <th className="px-3 py-2">Fecha Fin</th>
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
                      <td className="px-3 py-2 text-xs">{o.fechaFinal ? new Date(o.fechaFinal).toLocaleDateString('es-ES') : 'N/A'}</td>
                      <td className="px-3 py-2">
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
          <h3 className="font-medium mb-3 text-lg">📦 Últimas Solicitudes</h3>
          <div className="overflow-x-auto">
            <table className="table w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-3 py-2">#</th>
                  <th className="px-3 py-2">NumSolicitud</th>
                  <th className="px-3 py-2">OT Asoc.</th>
                  <th className="px-3 py-2">Solicitante</th>
                  <th className="px-3 py-2">Fecha</th>
                  <th className="px-3 py-2">Items</th>
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
                      <td className="px-3 py-2 text-xs">{s.fechaRemision ? new Date(s.fechaRemision).toLocaleDateString('es-ES') : 'N/A'}</td>
                      <td className="px-3 py-2 text-center font-semibold">{s.total_items}</td>
                      <td className="px-3 py-2 text-sm">{s.userAutoriza}</td>
                      <td className="px-3 py-2">
                        <span className={`badge ${colorConfig.badge} gap-1`}>{s.estado}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card p-4 bg-base-100 border">
          <div className="text-sm text-gray-500">Total órdenes</div>
          <div className="text-2xl font-semibold">{kpis?.totalOrdenes ?? 0}</div>
        </div>
        <div className="card p-4 bg-base-100 border">
          <div className="text-sm text-gray-500">En proceso</div>
          <div className="text-2xl font-semibold">{kpis?.enProceso ?? 0}</div>
        </div>
        <div className="card p-4 bg-base-100 border">
          <div className="text-sm text-gray-500">Vencidas</div>
          <div className="text-2xl font-semibold">{kpis?.vencidas ?? 0}</div>
        </div>
        <div className="card p-4 bg-base-100 border">
          <div className="text-sm text-gray-500">Ordenes completadas</div>
          <div className="text-2xl font-semibold">{kpis?.finalizadas ?? 0}</div>
        </div>

        <div className="card p-4 bg-base-100 border">
          <div className="text-sm text-gray-500">Total solicitudes</div>
          <div className="text-2xl font-semibold">{solicitudes?.totalSol ?? 0}</div>
        </div>
        <div className="card p-4 bg-base-100 border">
          <div className="text-sm text-gray-500">En proceso</div>
          <div className="text-2xl font-semibold">{solicitudes?.enProceso ?? 0}</div>
        </div>
        <div className="card p-4 bg-base-100 border">
          <div className="text-sm text-gray-500">Parcial</div>
          <div className="text-2xl font-semibold">{solicitudes?.parcial ?? 0}</div>
        </div>
        <div className="card p-4 bg-base-100 border">
          <div className="text-sm text-gray-500">Solicitudes completadas</div>
          <div className="text-2xl font-semibold">{solicitudes?.entregado ?? 0}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
       
        <div className="card p-4 bg-base-100 border">
          <h3 className="font-medium mb-3">Órdenes por estado</h3>
          <Bar
            data={{
              labels: ordenesEstado.map((d) => d.estado),
              datasets: [
                {
                  label: "Cantidad",
                  data: ordenesEstado.map((d) => d.count),
                  backgroundColor: [
                        
                    "rgba(234, 179, 8, 0.7)", 
                    "rgba(34, 197, 94, 0.7)",      
                    "rgba(239, 68, 68, 0.7)"       
                  ],
                  borderColor: [
                            
                    "rgba(202, 138, 4, 1)", 
                    "rgba(22, 163, 74, 1)",       
                    "rgba(220, 38, 38, 1)"         
                  ],
                  borderWidth: 2,
                  borderRadius: 4,
                },
              ],
            }}
            options={{ 
              responsive: true, 
              plugins: { 
                legend: { display: false } 
              },
              scales:{
                y:{
                  ticks:{
                    precision:0
                  },
                  beginAtZero:true
                }
              } 
            }}
          />
        </div>

       
        <div className="card p-4 bg-base-100 border">
          <h3 className="font-medium mb-3">Solicitudes realizadas este mes</h3>
          <Line
            data={{
              labels: solicitudesDia.map((d) => d.date.split("T")[0]),
              datasets: [
                {
                  label: "Solicitudes",
                  data: solicitudesDia.map((d) => d.count),
                  borderColor: "rgba(99, 102, 241, 1)",
                  backgroundColor: "rgba(99, 102, 241, 0.1)",
                  borderWidth: 3,
                  fill: true,
                  tension: 0.4,
                  pointBackgroundColor: "rgba(99, 102, 241, 1)",
                  pointBorderColor: "rgba(255, 255, 255, 1)",
                  pointBorderWidth: 2,
                  pointRadius: 5,
                  pointHoverRadius: 7,
                }
              ],
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
                y:{
                  ticks:{
                    precision:0
                  },
                  beginAtZero:true
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
