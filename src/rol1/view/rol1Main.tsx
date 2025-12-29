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
      <div className="flex min-h-screen w-auto bg-gray-50">

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

                      <button className="btn btn-ghost justify-start" onClick={() => setcargarComponente(1)}>
              🛠️ {!collapsed && "Nueva orden "}
            </button>

            <button className="btn btn-ghost justify-start" onClick={() => setcargarComponente(2)}>
              📋 {!collapsed && "Gestión de órdenes "}
            </button>

             <button className="btn btn-ghost justify-start" onClick={() => setcargarComponente(5)}>
              📅 {!collapsed && "Gestion de jornadas"}
            </button>

<div className="divider my-1"></div>
            <button className="btn btn-ghost justify-start" onClick={() => setcargarComponente(3)}>
              📦 {!collapsed && "Nueva solicitud"}
            </button>

            <button className="btn btn-ghost justify-start" onClick={() => setcargarComponente(4)}>
              📑 {!collapsed && "Gestión solicitudes"}
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

        <div className={`${collapsed ? "ml-20" : "ml-64"} flex-1 bg-gray-50 flex items-center justify-center my-2  transition-all duration-300`}>
          {componentes[cargarComponente]}
        </div>

      </div>

      <VerDetalles setventanaEmergente={setventanaEmergente} ventanaEmergente={ventanaEmergente} />
    </>
  )
}
