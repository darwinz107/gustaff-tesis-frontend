import { useEffect, useState, useRef } from "react"
import { NuevosRegistros } from "./components/NuevosRegistros"
import { logoutSession, decodeCookie, actualizarUsuario, getAllCargos } from "../controller/api/admin-api";
import { useNavigate } from "react-router-dom";
import { getOneUser } from "../../user/controller/api/user-api";
import { CrearOrden } from "../../orden-de-trabajo/view/components/CrearOrden";
import { HistorialOrdenes } from "../../orden-de-trabajo/view/components/HistorialOrdenes";
import { VerDetalles } from "../../orden-de-trabajo/view/components/VerDetalles";
import { AdministrarUsuarios } from "./components/AdministrarUsuarios";
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
import { CrearCronograma } from "../../cronograma/view/CrearCronograma";
import { CalendarioCronograma } from "../../cronograma/view/CalendarioCronograma";
import type { MaquinaInfo } from "../../cronograma/controller/cronograma-api";

export const Principal = () => {

  const [ventanaEmergente, setventanaEmergente] = useState(false);
  const [principal, setprincipal] = useState(false);
  const [nuevoRegistro, setnuevoRegistro] = useState(false);
  const [cargarAuto, setcargarAuto] = useState(false);
  const navigate = useNavigate();
  const [sendId, setsendId] = useState<Number | null | undefined>(null);
 // const [sendMaquina, setsendMaquina] = useState<MaquinaInfo | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [usuario, setUsuario] = useState<Users | null>(null);
  const [usuarioEnEdicion, setUsuarioEnEdicion] = useState<Users | null>(null);
  const [showPerfil, setShowPerfil] = useState(false);
  const [showEdicion, setShowEdicion] = useState(false);
  const [cargos, setCargos] = useState<any[]>([]);
  const [contrasenaActual, setContrasenaActual] = useState("");
  const [contrasenaNueva, setContrasenaNueva] = useState("");
  const [mostrarCambioPassword, setMostrarCambioPassword] = useState(false);
  const [errores, setErrores] = useState<any>({});
  const [mostrarLogoutSuccess, setMostrarLogoutSuccess] = useState(false);
  const dialogPerfil = useRef<HTMLDialogElement>(null);
  const dialogLogout = useRef<HTMLDialogElement>(null);
   const [cargarComponente, setcargarComponente] = useState(0);

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
        const decodedCookie = await decodeCookie();
        if (decodedCookie.success && decodedCookie.id) {
          const userData = await getOneUser(decodedCookie.id);
          setUsuario(userData);
          setUsuarioEnEdicion(userData);
        }
        const cargosList = await getAllCargos();
        setCargos(cargosList);
      } catch (error) {
        console.error("Error al cargar usuario:", error);
      }
    };
    cargarUsuario();
  }, []);

  const terminarSesion = () => {
    dialogLogout.current?.showModal();
  }

  const confirmarLogout = async () => {
    try {
    const res =  await logoutSession();
    console.log(res);
      setMostrarLogoutSuccess(true);
      dialogLogout.current?.close();
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error("Error al cargar la api: ", error);
    }
  }

  const cancelarLogout = () => {
    dialogLogout.current?.close();
  }

  const guardarEdicionPerfil = async () => {
    if (!usuarioEnEdicion?.id) return;
    
    try {
      const dataToUpdate = {
        name: usuarioEnEdicion.name,
        email: usuarioEnEdicion.email,
        cellphone: usuarioEnEdicion.cellphone,
        identification: usuarioEnEdicion.identification,
        fechaNac: usuarioEnEdicion.fechaNac,
        cargo: usuarioEnEdicion.cargoId?.id
      };
      
      const res = await actualizarUsuario(usuarioEnEdicion.id, dataToUpdate);
      if (res.validate) {
        alert("Perfil actualizado correctamente");
        setShowEdicion(false);
        setUsuario(usuarioEnEdicion);
      }
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      alert("Error al actualizar perfil");
    }
  }

  const cambiarContraseña = async () => {
    if (!contrasenaNueva.trim()) {
      alert("Ingresa una nueva contraseña");
      return;
    }
    
    try {
      const res = await actualizarUsuario(usuario?.id || 0, { password: contrasenaNueva });
      if (res.validate) {
        alert("Contraseña cambiada correctamente");
        setMostrarCambioPassword(false);
        setContrasenaActual("");
        setContrasenaNueva("");
      }
    } catch (error) {
      console.error("Error al cambiar contraseña:", error);
      alert("Error al cambiar contraseña");
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
   // 18:<CrearCronograma maquinaId={sendMaquina}></CrearCronograma>,
   // 19:<CalendarioCronograma setSendMaquina={setsendMaquina} setcargarComponente={setcargarComponente}></CalendarioCronograma>
  }

 

  useEffect(() => {
    if (cargarComponente !== 5) {
      setsendId(0);
    }
  }, [cargarComponente]);

 /* useEffect(() => {
    if (cargarComponente !== 18) {
      setsendMaquina(null);
    }
  }, [cargarComponente]);*/

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
              <div ><div className="font-bold text-lg">{usuario?.name ?? ""}</div>
              <div className="text-xs">{usuario?.cargoId.name ??""}</div>
              </div>
              <div className="dropdown dropdown-end">
                <button tabIndex={0} className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                    {usuario?.name ? usuario.name.charAt(0).toUpperCase() : "U"}
                  </div>
                </button>
                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                  <li><button onClick={() => { setShowEdicion(true); }} className="text-sm">👤 Ver/Editar Perfil</button></li>
                  
                  <li><button onClick={terminarSesion} className="text-error text-sm">🚪 Cerrar sesión</button></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div
          className={`z-1 fixed left-0 top-16 h-[calc(100vh-64px)] bg-white border-r border-gray-200 shadow-lg
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

      {/* MODAL EDICIÓN DE PERFIL */}
      {showEdicion && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 flex justify-between items-center sticky top-0">
              <div className="flex items-center gap-3">
                <span className="text-3xl">👤</span>
                <div>
                  <h2 className="text-2xl font-bold text-white">Mi Perfil</h2>
                  <p className="text-blue-100 text-sm">Edita tu información</p>
                </div>
              </div>
              <button 
                onClick={() => setShowEdicion(false)}
                className="text-white hover:bg-blue-700 p-2 rounded-lg transition"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold text-blue-700">Nombre</span>
                  </label>
                  <input 
                    type="text" 
                    className="input input-bordered focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    value={usuarioEnEdicion?.name || ""}
                    onChange={(e) => setUsuarioEnEdicion({...usuarioEnEdicion, name: e.target.value} as Users)}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold text-blue-700">Email</span>
                  </label>
                  <input 
                    type="email" 
                    className="input input-bordered focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    value={usuarioEnEdicion?.email || ""}
                    onChange={(e) => setUsuarioEnEdicion({...usuarioEnEdicion, email: e.target.value} as Users)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold text-blue-700">Cédula</span>
                  </label>
                  <input 
                    type="text" 
                    className="input input-bordered focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    value={usuarioEnEdicion?.identification || ""}
                    onChange={(e) => setUsuarioEnEdicion({...usuarioEnEdicion, identification: e.target.value} as Users)}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold text-blue-700">Celular</span>
                  </label>
                  <input 
                    type="text" 
                    className="input input-bordered focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    value={usuarioEnEdicion?.cellphone || ""}
                    onChange={(e) => setUsuarioEnEdicion({...usuarioEnEdicion, cellphone: e.target.value} as Users)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold text-blue-700">Fecha de Nacimiento</span>
                  </label>
                  <input 
                    type="date" 
                    className="input input-bordered focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    value={usuarioEnEdicion?.fechaNac?.split('T')[0] || ""}
                    onChange={(e) => setUsuarioEnEdicion({...usuarioEnEdicion, fechaNac: e.target.value} as Users)}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold text-blue-700">Cargo</span>
                  </label>
                  <select 
                    className="select select-bordered focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    value={usuarioEnEdicion?.cargoId?.id || usuarioEnEdicion?.cargoId?.name || ""}
                    onChange={(e) => setUsuarioEnEdicion({...usuarioEnEdicion, cargo: e.target.value} as Users)}
                  >
                    <option value="">Selecciona cargo</option>
                    {cargos.map((cargo) => <option key={cargo.id} value={cargo.id}>{cargo.name}</option>)}
                  </select>
                </div>
              </div>

              {/* Estado */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-blue-700">Estado</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className={`badge badge-lg ${usuarioEnEdicion?.estado ? 'badge-success' : 'badge-error'}`}>
                    {usuarioEnEdicion?.estado ? "ACTIVO" : "INACTIVO"}
                  </span>
                </div>
              </div>

              {/* Cambio de Contraseña */}
              <div className="divider">Cambiar Contraseña</div>
              
              {!mostrarCambioPassword ? (
                <button 
                  onClick={() => setMostrarCambioPassword(true)}
                  className="btn btn-outline btn-sm w-full"
                >
                  🔑 Cambiar Contraseña
                </button>
              ) : (
                <div className="space-y-3 border-t pt-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold text-blue-700 mr-2">Nueva Contraseña</span>
                    </label>
                    <input 
                      type="password" 
                      placeholder="Ingresa nueva contraseña"
                      className="input input-bordered focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      value={contrasenaNueva}
                      onChange={(e) => setContrasenaNueva(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={cambiarContraseña}
                      className="btn btn-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 hover:from-blue-600 hover:to-blue-700 flex-1"
                    >
                      ✓ Cambiar
                    </button>
                    <button 
                      onClick={() => {
                        setMostrarCambioPassword(false);
                        setContrasenaNueva("");
                      }}
                      className="btn btn-sm btn-ghost flex-1"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-end border-t sticky bottom-0">
              <button 
                onClick={() => setShowEdicion(false)}
                className="btn btn-ghost"
              >
                Cancelar
              </button>
              <button 
                onClick={guardarEdicionPerfil}
                className="btn bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 hover:from-blue-600 hover:to-blue-700"
              >
                ✓ Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dialog de confirmación de logout */}
      <dialog ref={dialogLogout} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Confirmar cierre de sesión</h3>
          <p className="py-4">¿Está seguro que desea cerrar sesión?</p>
          <div className="modal-action">
            <form method="dialog" className="flex gap-2">
              <button
                type="button"
                className="btn btn-error"
                onClick={confirmarLogout}
              >
                Cerrar sesión
              </button>
              <button
                type="button"
                className="btn"
                onClick={cancelarLogout}
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      </dialog>

      {/* Toast de éxito de logout */}
      {mostrarLogoutSuccess && (
        <div className="fixed top-5 right-5 z-50">
          <div role="alert" className="alert alert-success shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Sesión cerrada correctamente</span>
          </div>
        </div>
      )}
    </>
  )
}
