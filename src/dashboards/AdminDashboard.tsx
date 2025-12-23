
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';

export const AdminDashboard: React.FC = () => {
  const API = 'http://localhost:3000/dashboard';
  const [kpis, setKpis] = useState<any>(null);
  const [usersByCargo, setUsersByCargo] = useState<{cargo:string, count:number}[]>([]);
  const [maquinasPorArea, setMaquinasPorArea] = useState<{area:string, count:number}[]>([]);
  const [ultimosUsuarios, setUltimosUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [k, uCargo, mArea, uUltimos] = await Promise.all([
          axios.get(`${API}/kpis/admin`).then(r => r.data),
          axios.get(`${API}/users-by-cargo`).then(r => r.data),
          axios.get(`${API}/maquinas-por-area`).then(r => r.data),
          axios.get(`${API}/ultimos-usuarios?limit=5`).then(r => r.data),
        ]);

        if (!mounted) return;
        setKpis(k);
        setUsersByCargo(uCargo);
        setMaquinasPorArea(mArea);
        setUltimosUsuarios(uUltimos);
      } catch (err) {
        console.error('Error cargando admin dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, []);

  if (loading) return <div className="p-6">Cargando dashboard admin...</div>;
  if (!kpis) return <div className="p-6 text-error">Error cargando datos del dashboard admin</div>;

  
  const pieData = {
    labels: usersByCargo.map(u => u.cargo),
    datasets: [{ data: usersByCargo.map(u => u.count) }]
  };

  const barData = {
    labels: maquinasPorArea.map(m => m.area),
    datasets: [{ label: 'Máquinas', data: maquinasPorArea.map(m => m.count), borderWidth: 1 }]
  };

  const commonOptions = { responsive: true, plugins: { legend: { display: false } } };

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="card p-4 bg-base-100 border">
          <div className="text-sm text-gray-500">Usuarios</div>
          <div className="text-2xl font-semibold">{kpis.totalUsers ?? 0}</div>
        </div>
        <div className="card p-4 bg-base-100 border">
          <div className="text-sm text-gray-500">Áreas</div>
          <div className="text-2xl font-semibold">{kpis.totalAreas ?? 0}</div>
        </div>
        <div className="card p-4 bg-base-100 border">
          <div className="text-sm text-gray-500">Categorías</div>
          <div className="text-2xl font-semibold">{kpis.totalCategorias ?? 0}</div>
        </div>
        <div className="card p-4 bg-base-100 border">
          <div className="text-sm text-gray-500">Máquinas</div>
          <div className="text-2xl font-semibold">{kpis.totalMaquinas ?? 0}</div>
        </div>
        <div className="card p-4 bg-base-100 border">
          <div className="text-sm text-gray-500">Tipo trabajos</div>
          <div className="text-2xl font-semibold">{kpis.totalTipoTrabajos ?? 0}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-4 bg-base-100 border">
          <h3 className="font-medium mb-3">Usuarios por cargo</h3>
          <Pie data={pieData} options={{ ...commonOptions, maintainAspectRatio: true }} />
        </div>

        <div className="card p-4 bg-base-100 border">
          <h3 className="font-medium mb-3">Máquinas por área</h3>
          <Bar data={barData} options={{ ...commonOptions, scales: { x: { ticks: { maxRotation: 30, minRotation: 30 } } } }} />
        </div>
      </div>

      <div className="card p-4 bg-base-100 border">
        <h3 className="font-medium mb-3">Últimos usuarios</h3>
        <div className="overflow-auto">
          <table className="table w-full">
            <thead>
              <tr><th>#</th><th>Nombre</th><th>Email</th><th>Teléfono</th></tr>
            </thead>
            <tbody>
              {ultimosUsuarios.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.cellphone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
