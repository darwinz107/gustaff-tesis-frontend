import React, { useState } from 'react'
import { logoutSession } from '../../Principal/controller/api/auth-api';
import { useNavigate } from 'react-router-dom';
import { CrearActaSalida } from '../../acta-de-salida/view/CrearActaSalida';
import { GestionSalida } from '../../acta-de-salida/view/GestionSalida';
import { CrearActaEntrada } from '../../acta-de-entrada/view/CrearActaEntrada';
import { GestionEntrada } from '../../acta-de-entrada/view/GestionEntrada';
import { GestionInventario } from '../../inventario/view/GestionInventario';
import { DbLogistica } from '../../dashboards/DbLogistica';

export const Rol2Main = () => {

  const navigate = useNavigate();
  const [ventanaEmergente, setventanaEmergente] = useState(false);
  const [cargarComponente, setcargarComponente] = useState<number>(0);
  const [collapsed, setCollapsed] = useState(false);

  const logout = async () => {
    try {
      const res = await logoutSession();
      alert(res.msj);
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  }

  const componentes = [
    <DbLogistica></DbLogistica>,
    <CrearActaSalida />,
    <GestionSalida />,
    <CrearActaEntrada />,
    <GestionEntrada />,
    <GestionInventario></GestionInventario>
  ];

  const Item = ({ icon, label, onClick }) => (
    <div
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-100 transition"
    >
      <span className="text-lg">{icon}</span>
      {!collapsed && <span className="text-sm">{label}</span>}
    </div>
  );

  return (
    <>
      <div className="flex h-screen w-full bg-gray-50">
        {/* Navbar */}
        <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-40 flex items-center justify-between px-6 py-3 border-b border-gray-200">
          <div className="text-lg font-bold text-gray-800">Gestión Logística</div>
          <div className="dropdown dropdown-end">
            <div tabIndex={0} className="avatar placeholder cursor-pointer">
              <div className="bg-gradient-to-br from-indigo-400 to-indigo-600 text-white rounded-full w-10 flex items-center justify-center text-sm font-bold">
                GL
              </div>
            </div>
            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
              <li><a>Mi Perfil</a></li>
              <li><a onClick={logout}>Cerrar sesión</a></li>
            </ul>
          </div>
        </div>

        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 bg-white border-r border-gray-300 flex flex-col transition-all duration-300 mt-16 ${collapsed ? "w-20" : "w-64"}`}>
          <div className="flex flex-col gap-2 px-2 py-4">
            <div className="px-4 py-2">
              <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">Actas de Entrada</h3>
            </div>

            <button className="btn btn-ghost justify-start hover:bg-cyan-100 hover:text-cyan-700" onClick={() => setcargarComponente(3)}>
              <span className="text-lg">📥</span>
              {!collapsed && <span className="text-sm">Nueva Entrada</span>}
            </button>

            <button className="btn btn-ghost justify-start hover:bg-cyan-100 hover:text-cyan-700" onClick={() => setcargarComponente(4)}>
              <span className="text-lg">📥</span>
              {!collapsed && <span className="text-sm">Gestionar Entradas</span>}
            </button>

            <div className="divider my-1"></div>

            <div className="px-4 py-2">
              <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">Actas de Salida</h3>
            </div>

            <button className="btn btn-ghost justify-start hover:bg-indigo-100 hover:text-indigo-700" onClick={() => setcargarComponente(1)}>
              <span className="text-lg">📤</span>
              {!collapsed && <span className="text-sm">Nueva Salida</span>}
            </button>

            <button className="btn btn-ghost justify-start hover:bg-indigo-100 hover:text-indigo-700" onClick={() => setcargarComponente(2)}>
              <span className="text-lg">📤</span>
              {!collapsed && <span className="text-sm">Gestionar Salidas</span>}
            </button>

            <div className="divider my-1"></div>

            <div className="px-4 py-2">
              <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">Inventario</h3>
            </div>

            <button className="btn btn-ghost justify-start hover:bg-cyan-100 hover:text-cyan-700" onClick={() => setcargarComponente(5)}>
              <span className="text-lg">📊</span>
              {!collapsed && <span className="text-sm">Gestionar Inventario</span>}
            </button>
          </div>

          <div className="mt-auto px-2 pb-4 border-t">
            <button className="btn btn-ghost w-full flex items-center gap-3 justify-start hover:btn-error" onClick={logout}>
              <span className="text-lg">🚪</span>
              {!collapsed && <span className="text-sm">Cerrar sesión</span>}
            </button>
          </div>
        </div>

        {/* Toggle Button */}
        <button
          className="fixed top-20 left-2 z-30 btn btn-sm btn-ghost"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? "➡️" : "⬅️"}
        </button>

        {/* Main Content */}
        <div className={`${collapsed ? "ml-20" : "ml-64"} mt-16 flex-1 bg-gray-50 flex items-center justify-center p-2 transition-all duration-300 overflow-auto`}>
          {componentes[cargarComponente]}
        </div>
      </div>
    </>
  )
}
