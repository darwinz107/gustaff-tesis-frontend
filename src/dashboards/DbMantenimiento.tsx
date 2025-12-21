import React, { useEffect, useState } from "react";
import axios from "axios";
import "../lib/chartSetup";
import { Bar, Line } from "react-chartjs-2";


export const DbMantenimiento = () => {
  const API = "http://localhost:3000/dashboard"; 

  const [kpis, setKpis] = useState(null);
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

  return (
    <div className="p-6 space-y-6">
      
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
        {/* Chart: ordenes por estado */}
        <div className="card p-4 bg-base-100 border">
          <h3 className="font-medium mb-3">Órdenes por estado</h3>
          <Bar
            data={{
              labels: ordenesEstado.map((d) => d.estado),
              datasets: [
                {
                  label: "",
                  data: ordenesEstado.map((d) => d.count),
                  borderWidth: 1,
                },
              ],
            }}
            options={{ responsive: true, plugins: { legend: { display: false } } }}
          />
        </div>

        {/* Chart: solicitudes por dia */}
        <div className="card p-4 bg-base-100 border">
          <h3 className="font-medium mb-3">Solicitudes (últimos 30 días)</h3>
          <Line
            data={{
              labels: solicitudesDia.map((d) => d.date.split("T")[0]),
              datasets: [
                {
                  label: "Solicitudes",
                  data: solicitudesDia.map((d) => d.count),
                  borderWidth: 2,
                  fill: true,
                },
              ],
            }}
            options={{ responsive: true, plugins: { legend: { display: false } } }}
          />
        </div>
      </div>

      {/* Tablas simples con daisyUI classes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-4 bg-base-100 border">
          <h3 className="font-medium mb-3">Últimas órdenes</h3>
          <div className="overflow-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>#</th><th>NumOrden</th><th>Solicitante</th><th>Estado</th><th>Descripcion</th>
                </tr>
              </thead>
              <tbody>
                {ultimasOrdenes.map(o => (
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td>{o.numOrden}</td>
                    <td>{o.solicitante}</td>
                    <td>{o.estado}</td>
                    <td>{o.descripcion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card p-4 bg-base-100 border">
          <h3 className="font-medium mb-3">Últimas solicitudes</h3>
          <div className="overflow-auto">
            <table className="table w-full">
              <thead>
                <tr><th>#</th><th>NumOrden</th><th>Solicitante</th><th>Destino</th><th>Total items</th></tr>
              </thead>
              <tbody>
                {ultimasSolicitudes.map(s => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>{s.numOrden}</td>
                    <td>{s.solicitante}</td>
                    <td>{s.destino}</td>
                    <td>{s.total_items}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
