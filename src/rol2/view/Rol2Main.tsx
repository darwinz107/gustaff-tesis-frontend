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
      <div className="flex h-screen w-auto bg-gray-100">

        <div
          className={`fixed inset-y-0 left-0 bg-white border-r border-gray-300 flex flex-col transition-all duration-300
          ${collapsed ? "w-20" : "w-64"}`}
        >
          <div className="flex items-center justify-between px-4 py-6">
            {!collapsed && (
              <img
                src="public/logo_alternativo.png"
                className="cursor-pointer w-32"
                onClick={() => setcargarComponente(0)}
              />
            )}
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? "➡️" : "⬅️"}
            </button>
          </div>

          <div className="flex flex-col gap-1 px-2">

            <button className="btn btn-ghost justify-start" label="Nueva entrada" onClick={() => setcargarComponente(3)} >📥{!collapsed && "Nueva entrada"}</button>
            <button className="btn btn-ghost justify-start" onClick={() => setcargarComponente(4)}>
              📥 {!collapsed && "Gestión entradas"}
            </button>

            <div className="divider my-1"></div>

            <button className="btn btn-ghost justify-start" onClick={() => setcargarComponente(1)}>
              📤 {!collapsed && "Nueva salida"}
            </button>

            <button className="btn btn-ghost justify-start" onClick={() => setcargarComponente(2)}>
              📤 {!collapsed && "Gestión salidas"}
            </button>

             <button className="btn btn-ghost justify-start" onClick={() => setcargarComponente(5)}>
              📊 {!collapsed && "Inventario"}
            </button>

          </div>

          <div className="mt-auto px-2 pb-4">
            <button
              className="btn btn-ghost w-full flex items-center gap-3 justify-start"
              onClick={logout}
            >
              🚪 {!collapsed && "Cerrar sesión"}
            </button>
          </div>
        </div>

        <div className={`${collapsed ? "ml-20" : "ml-64"} flex-1 bg-white flex items-center justify-center transition-all duration-300`}>
          {componentes[cargarComponente]}
        </div>

      </div>
    </>
  )
}
