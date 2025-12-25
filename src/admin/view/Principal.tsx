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
/*import { AdministrarBodegasSeccionesPerchas } from "./components/AdministrarBodegasSeccionesPerchas";
import { AdministrarCategorias } from "./components/AdministrarCategorias";
import { AdministrarTiposTrabajo } from "./components/AdministrarTiposTrabajo";
import { AdministrarCargos } from "./components/AdministrarCargos";*/

export const Principal = () => {

  const [ventanaEmergente, setventanaEmergente] = useState(false);
  const [principal, setprincipal] = useState(false);
  const [nuevoRegistro, setnuevoRegistro] = useState(false);
  const [cargarAuto, setcargarAuto] = useState(false);
  const navigate = useNavigate();
  const [sendId, setsendId] = useState<Number | null | undefined>(null);

  
  const [collapsed, setCollapsed] = useState(false);

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
    3: <NuevosRegistros />,
    4: <AdministrarUsuarios />,
    5: <OrdenCompra id={sendId} />,
    6: <GestionCompra />,
    7: <CrearActaEntrada />,
    8: <GestionEntrada />,
    9: <CrearActaSalida />,
    10: <GestionSalida />,
    11: <GestionInventario />,
    12: <AdministrarAreasMaquinas />,
  /*  13: <AdministrarBodegasSeccionesPerchas />,
    14: <AdministrarCategorias />,
    15: <AdministrarTiposTrabajo />,
    16: <AdministrarCargos />*/
  }

  const [cargarComponente, setcargarComponente] = useState(0);

  useEffect(() => {
    if (cargarComponente !== 5) {
      setsendId(0);
    }
  }, [cargarComponente]);

  return (
    <>
      <div className="flex min-h-screen w-full bg-gray-50">

      
        <div
          className={`min-h-full bg-white border-r border-gray-300
          transition-all duration-300 flex flex-col
          ${collapsed ? "w-20" : "w-1/5"}`}
        >

          
          <div className="flex items-center justify-between px-4 py-6">
            {!collapsed && (
              <img
                src="public/logo_alternativo.png"
                className="cursor-pointer w-32"
                alt="Gustaff S.A"
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

            <button className="btn btn-ghost justify-start" onClick={() => setcargarComponente(4)}>
              👤 {!collapsed && "Gestión de usuarios"}
            </button>

            <button className="btn btn-ghost justify-start" onClick={() => setcargarComponente(3)}>
              ⚙️ {!collapsed && "Nuevo parámetro"}
            </button>

            <button className="btn btn-ghost justify-start" onClick={() => setcargarComponente(12)}>
              🏭 {!collapsed && "Áreas y Máquinas"}
            </button>

            <button className="btn btn-ghost justify-start" onClick={() => setcargarComponente(13)}>
              📦 {!collapsed && "Bodegas, Secciones y Perchas"}
            </button>

            <button className="btn btn-ghost justify-start" onClick={() => setcargarComponente(14)}>
              🏷️ {!collapsed && "Categorías"}
            </button>

            <button className="btn btn-ghost justify-start" onClick={() => setcargarComponente(15)}>
              🔧 {!collapsed && "Tipos de Trabajo"}
            </button>

            <button className="btn btn-ghost justify-start" onClick={() => setcargarComponente(16)}>
              💼 {!collapsed && "Cargos"}
            </button>

            <button className="btn btn-ghost justify-start" onClick={() => setcargarComponente(1)}>
              🛠️ {!collapsed && "Nueva orden"}
            </button>

            <button className="btn btn-ghost justify-start" onClick={() => setcargarComponente(2)}>
              📋 {!collapsed && "Gestión de órdenes"}
            </button>

            <button className="btn btn-ghost justify-start" onClick={() => setcargarComponente(5)}>
              📦 {!collapsed && "Nueva solicitud"}
            </button>

            <button className="btn btn-ghost justify-start" onClick={() => setcargarComponente(6)}>
              📑 {!collapsed && "Gestión solicitudes"}
            </button>

            <button className="btn btn-ghost justify-start" onClick={() => setcargarComponente(7)}>
              📥 {!collapsed && "Nueva entrada"}
            </button>

            <button className="btn btn-ghost justify-start" onClick={() => setcargarComponente(8)}>
              📥 {!collapsed && "Gestión entradas"}
            </button>

            <button className="btn btn-ghost justify-start" onClick={() => setcargarComponente(9)}>
              📤 {!collapsed && "Nueva salida"}
            </button>

            <button className="btn btn-ghost justify-start" onClick={() => setcargarComponente(10)}>
              📤 {!collapsed && "Gestión salidas"}
            </button>

            <button className="btn btn-ghost justify-start" onClick={() => setcargarComponente(11)}>
              📊 {!collapsed && "Inventario"}
            </button>
          </div>

          
          <div className="mt-auto px-2 pb-4 ">
            <button className="btn btn-ghost justify-start w-full" onClick={terminarSesion}>
              🚪 {!collapsed && "Cerrar sesión"}
            </button>
          </div>
        </div>

        
        <div className="flex-1 flex items-center justify-center my-2">
          {componentes[cargarComponente]}
        </div>

      </div>

      <VerDetalles setventanaEmergente={setventanaEmergente} ventanaEmergente={ventanaEmergente} />
    </>
  )
}
