import { useEffect, useState } from "react"
import { NuevosRegistros } from "./components/NuevosRegistros"
import { logoutSession } from "../controller/api/admin-api";
import { useNavigate } from "react-router-dom";
import { CrearOrden } from "../../orden-de-trabajo/view/components/CrearOrden";
import { HistorialOrdenes } from "../../orden-de-trabajo/view/components/HistorialOrdenes";
import { VerDetalles } from "../../orden-de-trabajo/view/components/VerDetalles";
import { AdministrarUsuarios } from "./components/administrarUsuarios";
import { OrdenCompra } from "../../orden-de-compra/view/ordenCompra";
import { GestionCompra } from "../../orden-de-compra/view/GestionCompra";
import { CrearActaSalida } from "../../acta-de-salida/view/CrearActaSalida";
import { GestionEntrada } from "../../acta-de-entrada/view/GestionEntrada";
import { CrearActaEntrada } from "../../acta-de-entrada/view/CrearActaEntrada";
import { GestionSalida } from "../../acta-de-salida/view/GestionSalida";
import { GestionInventario } from "../../inventario/view/GestionInventario";
import { getLastSolicitud } from "../../orden-de-trabajo/controller/api/orden-api";
import { AdminDashboard } from "../../dashboards/AdminDashboard";
import { AdministrarAreasMaquinas } from "./components/AdministrarAreasMaquinas";
import { AdministrarBodegasSeccionesPerchas } from "./components/AdministrarBodegasSeccionesPerchas";
import { AdministrarCategorias } from "./components/AdministrarCategorias";
import { AdministrarTiposTrabajo } from "./components/AdministrarTiposTrabajo";
import { AdministrarCargos } from "./components/AdministrarCargos";
import { GestionJornadas } from "../../orden-de-trabajo/view/components/GestionJornadas";
import { getUsers } from "../../user/controller/api/user-api";
import type { Users } from "../../admin/models/users";

export const Principal = () => {

  const [ventanaEmergente, setventanaEmergente] = useState(false);
  const [principal, setprincipal] = useState(false);
  const [nuevoRegistro, setnuevoRegistro] = useState(false);
  const [cargarAuto, setcargarAuto] = useState(false);
  const navigate = useNavigate();
  const [sendId, setsendId] = useState<Number | null | undefined>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [usuario, setUsuario] = useState<Users | null>(null);

  useEffect(() => {
    if (cargarAuto && sendId === undefined) {
      const asignarId = async () => {
        const res = await getLastSolicitud(undefined);
        setsendId(res.id);
      }
      asignarId();
      setcargarComponente(5);
    } else if (cargarAuto && sendId !== 0) {
      setcargarComponente(5);
    }
    setcargarAuto(false);
  }, [cargarAuto, sendId]);

  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const users = await getUsers();
        if (users && users.length > 0) {
          setUsuario(users[0]);
        }
      } catch (error) {
        console.error("Error al cargar usuario:", error);
      }
    };
    cargarUsuario();
  }, []);

  const terminarSesion = async () => {
    try {
      const res = await logoutSession();
      alert(res.msj);
      navigate('/');
    } catch (error) {
      console.error("Error al cargar la api: ", error);
    }
  }

  const componentes = {
    0: <AdminDashboard></AdminDashboard>,
    1: <CrearOrden setcargarAuto={setcargarAuto} setsendId={setsendId} />,
    2: <HistorialOrdenes setcargaAuto={setcargarAuto} setsendId={setsendId} />,
   // 3: <NuevosRegistros />,
    4: <AdministrarUsuarios />,
    5: <OrdenCompra id={sendId} />,
    6: <GestionCompra />,
    7: <CrearActaEntrada />,
    8: <GestionEntrada />,
    9: <CrearActaSalida />,
    10: <GestionSalida />,
    11: <GestionInventario />,
    12: <AdministrarAreasMaquinas />,
    13: <AdministrarBodegasSeccionesPerchas />,
    14: <AdministrarCategorias />,
    15: <AdministrarTiposTrabajo />,
    16: <AdministrarCargos />,
    17: <GestionJornadas></GestionJornadas>,
  }

  const [cargarComponente, setcargarComponente] = useState(0);

  useEffect(() => {
    if (cargarComponente !== 5) {
      setsendId(0);
    }
  }, [cargarComponente]);

  return (
    <>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
        {/* Navbar */}
        <div className="fixed top-0 w-full bg-white shadow-md border-b border-gray-200 z-40">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center gap-4">
              <img
                src="public/logo_alternativo.png"
                className="cursor-pointer h-10 w-auto"
                alt="Gustaff S.A"
                onClick={() => setcargarComponente(0)}
              />
              <h1 className="text-xl font-bold text-gray-800">Gustaff Admin</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="dropdown dropdown-end">
                <button className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                    {usuario?.name ? usuario.name.charAt(0).toUpperCase() : "U"}
                  </div>
                </button>
                <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                  <li><a className="text-sm">{usuario?.name || "Usuario"}</a></li>
                  <li><a className="text-sm">{usuario?.email || "email@example.com"}</a></li>
                  <li><hr className="my-2" /></li>
                  <li><a onClick={terminarSesion} className="text-error">Cerrar sesión</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div
          className={`fixed left-0 top-16 h-[calc(100vh-64px)] bg-white border-r border-gray-200 shadow-lg
          transition-all duration-300 flex flex-col overflow-y-auto
          ${collapsed ? "w-20" : "w-64"}`}
        >
          <div className="flex items-center justify-center py-4 px-2">
            <button
              className="btn btn-sm btn-ghost btn-circle"
              onClick={() => setCollapsed(!collapsed)}
              title={collapsed ? "Expandir" : "Contraer"}
            >
              {collapsed ? "▶" : "◀"}
            </button>
          </div>

          <div className="flex flex-col gap-2 px-3 pb-4 flex-1">
            {/* Dashboard */}
            <button 
              className="btn btn-ghost justify-start text-left rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-colors" 
              onClick={() => setcargarComponente(0)}
              title="Dashboard"
            >
              <span className="text-lg">📊</span>
              {!collapsed && <span className="text-sm font-medium">Dashboard</span>}
            </button>

            {/* Administración */}
            {!collapsed && <div className="text-xs font-semibold text-gray-500 mt-4 mb-2 px-2">ADMINISTRACIÓN</div>}
            <button className="btn btn-ghost justify-start rounded-lg hover:bg-purple-100 hover:text-purple-700 transition-colors" onClick={() => setcargarComponente(4)}>
              <span className="text-lg">👤</span> {!collapsed && <span className="text-sm">Usuarios</span>}
            </button>

            <button className="btn btn-ghost justify-start rounded-lg hover:bg-purple-100 hover:text-purple-700 transition-colors" onClick={() => setcargarComponente(12)}>
              <span className="text-lg">🏭</span> {!collapsed && <span className="text-sm">Áreas y Máquinas</span>}
            </button>

            <button className="btn btn-ghost justify-start rounded-lg hover:bg-purple-100 hover:text-purple-700 transition-colors" onClick={() => setcargarComponente(13)}>
              <span className="text-lg">📦</span> {!collapsed && <span className="text-sm">Bodegas</span>}
            </button>

            <button className="btn btn-ghost justify-start rounded-lg hover:bg-purple-100 hover:text-purple-700 transition-colors" onClick={() => setcargarComponente(14)}>
              <span className="text-lg">🏷️</span> {!collapsed && <span className="text-sm">Categorías</span>}
            </button>

            <button className="btn btn-ghost justify-start rounded-lg hover:bg-purple-100 hover:text-purple-700 transition-colors" onClick={() => setcargarComponente(15)}>
              <span className="text-lg">🔧</span> {!collapsed && <span className="text-sm">Tipos de Trabajo</span>}
            </button>

            <button className="btn btn-ghost justify-start rounded-lg hover:bg-purple-100 hover:text-purple-700 transition-colors" onClick={() => setcargarComponente(16)}>
              <span className="text-lg">💼</span> {!collapsed && <span className="text-sm">Cargos</span>}
            </button>

            {/* Órdenes de Trabajo */}
            {!collapsed && <div className="text-xs font-semibold text-gray-500 mt-4 mb-2 px-2">ÓRDENES DE TRABAJO</div>}
            <button className="btn btn-ghost justify-start rounded-lg hover:bg-green-100 hover:text-green-700 transition-colors" onClick={() => setcargarComponente(1)}>
              <span className="text-lg">🛠️</span> {!collapsed && <span className="text-sm">Nueva orden</span>}
            </button>

            <button className="btn btn-ghost justify-start rounded-lg hover:bg-green-100 hover:text-green-700 transition-colors" onClick={() => setcargarComponente(2)}>
              <span className="text-lg">📋</span> {!collapsed && <span className="text-sm">Gestión órdenes</span>}
            </button>

            <button className="btn btn-ghost justify-start rounded-lg hover:bg-green-100 hover:text-green-700 transition-colors" onClick={() => setcargarComponente(17)}>
              <span className="text-lg">📅</span> {!collapsed && <span className="text-sm">Jornadas</span>}
            </button>

            {/* Solicitudes de Material */}
            {!collapsed && <div className="text-xs font-semibold text-gray-500 mt-4 mb-2 px-2">MATERIALES</div>}
            <button className="btn btn-ghost justify-start rounded-lg hover:bg-orange-100 hover:text-orange-700 transition-colors" onClick={() => setcargarComponente(5)}>
              <span className="text-lg">📬</span> {!collapsed && <span className="text-sm">Nueva solicitud</span>}
            </button>

            <button className="btn btn-ghost justify-start rounded-lg hover:bg-orange-100 hover:text-orange-700 transition-colors" onClick={() => setcargarComponente(6)}>
              <span className="text-lg">📑</span> {!collapsed && <span className="text-sm">Gestión solicitudes</span>}
            </button>

            {/* Entrada y Salida */}
            {!collapsed && <div className="text-xs font-semibold text-gray-500 mt-4 mb-2 px-2">LOGÍSTICA</div>}
            <button className="btn btn-ghost justify-start rounded-lg hover:bg-indigo-100 hover:text-indigo-700 transition-colors" onClick={() => setcargarComponente(7)}>
              <span className="text-lg">📥</span> {!collapsed && <span className="text-sm">Nueva entrada</span>}
            </button>

            <button className="btn btn-ghost justify-start rounded-lg hover:bg-indigo-100 hover:text-indigo-700 transition-colors" onClick={() => setcargarComponente(8)}>
              <span className="text-lg">📥</span> {!collapsed && <span className="text-sm">Gestión entradas</span>}
            </button>

            <button className="btn btn-ghost justify-start rounded-lg hover:bg-indigo-100 hover:text-indigo-700 transition-colors" onClick={() => setcargarComponente(9)}>
              <span className="text-lg">📤</span> {!collapsed && <span className="text-sm">Nueva salida</span>}
            </button>

            <button className="btn btn-ghost justify-start rounded-lg hover:bg-indigo-100 hover:text-indigo-700 transition-colors" onClick={() => setcargarComponente(10)}>
              <span className="text-lg">📤</span> {!collapsed && <span className="text-sm">Gestión salidas</span>}
            </button>

            {/* Inventario */}
            {!collapsed && <div className="text-xs font-semibold text-gray-500 mt-4 mb-2 px-2">INVENTARIO</div>}
            <button className="btn btn-ghost justify-start rounded-lg hover:bg-cyan-100 hover:text-cyan-700 transition-colors" onClick={() => setcargarComponente(11)}>
              <span className="text-lg">📊</span> {!collapsed && <span className="text-sm">Inventario</span>}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${collapsed ? "ml-20" : "ml-64"} mt-16`}>
          <div className="p-6 min-h-[calc(100vh-64px)]">
            <div className="bg-white rounded-2xl shadow-lg p-6 min-h-full">
              {componentes[cargarComponente]}
            </div>
          </div>
        </div>
      </div>

      <VerDetalles setventanaEmergente={setventanaEmergente} ventanaEmergente={ventanaEmergente} />
    </>
  )
}
