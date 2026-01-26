
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';

// Material Design Color Palette - Colores profesionales y armónicos (vibrantes)
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

// Función para obtener colores dinámicos según cantidad de elementos
const getColorsByLength = (length: number) => {
  const colors = [];
  for (let i = 0; i < length; i++) {
    colors.push(MATERIAL_COLORS[i % MATERIAL_COLORS.length]);
  }
  return colors;
};

export const AdminDashboard: React.FC = () => {
  const API = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}dashboard` : 'http://localhost:3000/dashboard';
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

  
  // Generar colores dinámicos según cantidad de datos
  const cargoColors = getColorsByLength(usersByCargo.length);
  const areaColors = getColorsByLength(maquinasPorArea.length);

  const pieData = {
    labels: usersByCargo.map(u => u.cargo),
    datasets: [{ 
      data: usersByCargo.map(u => u.count), 
      backgroundColor: cargoColors.map(c => c.bg),
      borderColor: cargoColors.map(c => c.border),
      borderWidth: 2
    }]
  };

  const barData = {
    labels: maquinasPorArea.map(m => m.area),
    datasets: [{ 
      label: 'Máquinas', 
      data: maquinasPorArea.map(m => m.count),
      backgroundColor: areaColors.map(c => c.bg),
      borderColor: areaColors.map(c => c.border),
      borderWidth: 2
    }]
  };

  const commonOptions = { responsive: true, plugins: { legend: { display: false } } };

  return (
    <div className="p-6 space-y-6 w-full">
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

      <div className="grid grid-cols-1  gap-6">
        <div className="card p-4 h-130 bg-base-100 border flex items-center justify-center">
          <h3 className="font-medium mb-3">Usuarios por cargo</h3>
          <Pie data={pieData} options={{ ...commonOptions }} className='p-6' />
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
