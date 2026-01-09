import React, { useEffect, useState } from 'react'
import { logoutSession } from '../../Principal/controller/api/auth-api';
import { CrearOrden } from '../../orden-de-trabajo/view/components/CrearOrden';
import { HistorialOrdenes } from '../../orden-de-trabajo/view/components/HistorialOrdenes';
import { VerDetalles } from '../../orden-de-trabajo/view/components/VerDetalles';
import { OrdenCompra } from '../../orden-de-compra/view/ordenCompra';
import { GestionCompra } from '../../orden-de-compra/view/GestionCompra';
import { useNavigate } from 'react-router-dom';
import { getLastSolicitud } from '../../orden-de-trabajo/controller/api/orden-api';
import { DbMantenimiento } from '../../dashboards/DbMantenimiento';
import { GestionJornadas } from '../../orden-de-trabajo/view/components/GestionJornadas';


export const Rol1Main = () => {

  const [cargarAuto, setcargarAuto] = useState(false);
  const navigate = useNavigate();
  const [sendId, setsendId] = useState<Number | null | undefined>(null);
  const [cargarComponente, setcargarComponente] = useState<number>(0);
  const [collapsed, setCollapsed] = useState(false);
  const [ventanaEmergente, setventanaEmergente] = useState(false);

  useEffect(() => {
    if (cargarAuto && sendId === undefined) {
      const asignarId = async () => {
        const res = await getLastSolicitud(undefined);
        setsendId(res.id);
      }
      asignarId();
      setcargarComponente(3);
    } else if (cargarAuto && sendId !== 0) {
      setcargarComponente(3);
    }
    setcargarAuto(false);
  }, [cargarAuto, sendId]);

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
    <DbMantenimiento></DbMantenimiento>,
    <CrearOrden setcargarAuto={setcargarAuto} setsendId={setsendId} />,
    <HistorialOrdenes setcargaAuto={setcargarAuto} setsendId={setsendId} />,
    <OrdenCompra id={sendId} />,
    <GestionCompra />,
    <GestionJornadas></GestionJornadas>,
  ];

  useEffect(() => {
    if (cargarComponente !== 3) {
      setsendId(0);
    }
  }, [cargarComponente]);

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
          <div className="text-lg font-bold text-gray-800">Gestión de Órdenes</div>
          <div className="dropdown dropdown-end">
            <div tabIndex={0} className="avatar placeholder cursor-pointer">
              <div className="bg-gradient-to-br from-green-400 to-green-600 text-white rounded-full w-10 flex items-center justify-center text-sm font-bold">
                GT
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
              <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">Órdenes de Trabajo</h3>
            </div>

            <button className="btn btn-ghost justify-start hover:bg-green-100 hover:text-green-700" onClick={() => setcargarComponente(1)}>
              <span className="text-lg">➕</span>
              {!collapsed && <span className="text-sm">Nueva Orden</span>}
            </button>

            <button className="btn btn-ghost justify-start hover:bg-green-100 hover:text-green-700" onClick={() => setcargarComponente(2)}>
              <span className="text-lg">📋</span>
              {!collapsed && <span className="text-sm">Gestionar Órdenes</span>}
            </button>

            <button className="btn btn-ghost justify-start hover:bg-green-100 hover:text-green-700" onClick={() => setcargarComponente(5)}>
              <span className="text-lg">📅</span>
              {!collapsed && <span className="text-sm">Gestionar Jornadas</span>}
            </button>

            <div className="divider my-1"></div>

            <div className="px-4 py-2">
              <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">Solicitudes</h3>
            </div>

            <button className="btn btn-ghost justify-start hover:bg-orange-100 hover:text-orange-700" onClick={() => setcargarComponente(3)}>
              <span className="text-lg">📦</span>
              {!collapsed && <span className="text-sm">Nueva Solicitud</span>}
            </button>

            <button className="btn btn-ghost justify-start hover:bg-orange-100 hover:text-orange-700" onClick={() => setcargarComponente(4)}>
              <span className="text-lg">📑</span>
              {!collapsed && <span className="text-sm">Gestionar Solicitudes</span>}
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

      <VerDetalles setventanaEmergente={setventanaEmergente} ventanaEmergente={ventanaEmergente} />
    </>
  )
}
