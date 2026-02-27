
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import "../lib/chartSetup";

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
  const [mes, setMes] = useState<number | null>(null);
  const [año, setAño] = useState<number | null>(null);
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
          axios.get(`${API}/ultimos-usuarios?limit=7`).then(r => r.data),
        ]);

        if (!mounted) return;
        setKpis(k);
        setMes(k.mes);
        setAño(k.año);
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
      {mes && año && (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-4 text-white shadow-lg">
          <p className="text-sm font-semibold opacity-90">Datos correspondientes a:</p>
          <p className="text-2xl font-bold">
            {new Date(año, mes - 1).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).charAt(0).toUpperCase() + 
             new Date(año, mes - 1).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).slice(1)}
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className='card p-4 bg-blue-100 border border-blue-300 bg-opacity-50'>
          <div className='text-sm text-blue-500 font-semibold'>👥 Usuarios</div>
          <div className='text-2xl font-semibold text-blue-800'>{kpis?.totalUsers ?? 0}</div>
        </div>
        <div className='card p-4 bg-cyan-100 border border-cyan-300 bg-opacity-50'>
          <div className='text-sm text-cyan-600 font-semibold'>🏢 Áreas</div>
          <div className='text-2xl font-semibold text-cyan-800'>{kpis?.totalAreas ?? 0}</div>
        </div>
        <div className='card p-4 bg-purple-100 border border-purple-300 bg-opacity-50'>
          <div className='text-sm text-purple-600 font-semibold'>📂 Categorías</div>
          <div className='text-2xl font-semibold text-purple-800'>{kpis?.totalCategorias ?? 0}</div>
        </div>
        <div className='card p-4 bg-orange-100 border border-orange-300 bg-opacity-50'>
          <div className='text-sm text-orange-700 font-semibold'>⚙️ Máquinas</div>
          <div className='text-2xl font-semibold text-orange-800'>{kpis?.totalMaquinas ?? 0}</div>
        </div>
        <div className='card p-4 bg-green-100 border border-green-300 bg-opacity-50'>
          <div className='text-sm text-green-700 font-semibold'>🔧 Tipo Trabajos</div>
          <div className='text-2xl font-semibold text-green-800'>{kpis?.totalTipoTrabajos ?? 0}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <div className="card p-6 h-130 bg-base-100 border flex items-center justify-center">
          <h3 className="font-medium mb-3 text-lg">👔 Usuarios por Cargo</h3>
          <Pie data={pieData} options={{ ...commonOptions }} />
        </div>

        <div className="card p-4 bg-base-100 border">
          <h3 className="font-medium mb-3 text-lg">⚙️ Máquinas por Área</h3>
          <Bar data={barData} options={{ ...commonOptions, scales: { x: { ticks: { maxRotation: 30, minRotation: 30 } }, y: { ticks: { precision: 0 }, beginAtZero: true } } }} />
        </div>
      </div>

      <div className="card p-4 bg-base-100 border max-h-64 overflow-y-auto">
        <h3 className="font-medium mb-3 text-lg">👥 Últimos Usuarios Registrados</h3>
        <div className="overflow-x-auto">
          <table className="table w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-3 py-2">#</th>
                <th className="px-3 py-2">Nombre</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Teléfono</th>
              </tr>
            </thead>
            <tbody>
              {ultimosUsuarios.map(u => (
                <tr key={u.id} className="border-b hover:bg-gray-50">
                  <td className="px-3 py-2 font-semibold">{u.id}</td>
                  <td className="px-3 py-2">{u.name}</td>
                  <td className="px-3 py-2 text-sm">{u.email}</td>
                  <td className="px-3 py-2">{u.cellphone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
