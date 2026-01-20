import React, { useState, useEffect, useRef } from 'react'
import { logoutSession, decodeCookie, actualizarUsuario, getAllCargos } from '../../admin/controller/api/admin-api';
import { getOneUser } from '../../user/controller/api/user-api';
import { useNavigate } from 'react-router-dom';
import { CrearActaSalida } from '../../acta-de-salida/view/CrearActaSalida';
import { GestionSalida } from '../../acta-de-salida/view/GestionSalida';
import { CrearActaEntrada } from '../../acta-de-entrada/view/CrearActaEntrada';
import { GestionEntrada } from '../../acta-de-entrada/view/GestionEntrada';
import { GestionInventario } from '../../inventario/view/GestionInventario';
import { DbLogistica } from '../../dashboards/DbLogistica';
import type { Users } from '../../admin/models/users';

export const Rol2Main = () => {

  const navigate = useNavigate();
  const [ventanaEmergente, setventanaEmergente] = useState(false);
  const [cargarComponente, setcargarComponente] = useState<number>(0);
  const [collapsed, setCollapsed] = useState(false);
  const [usuario, setUsuario] = useState<Users | null>(null);
  const [usuarioEnEdicion, setUsuarioEnEdicion] = useState<Users | null>(null);
  const [showEdicion, setShowEdicion] = useState(false);
  const [cargos, setCargos] = useState<any[]>([]);
  const [contrasenaNueva, setContrasenaNueva] = useState("");
  const [mostrarCambioPassword, setMostrarCambioPassword] = useState(false);
  const [mostrarLogoutSuccess, setMostrarLogoutSuccess] = useState(false);
  const dialogLogout = useRef<HTMLDialogElement>(null);

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
        setContrasenaNueva("");
      }
    } catch (error) {
      console.error("Error al cambiar contraseña:", error);
      alert("Error al cambiar contraseña");
    }
  }

  const logout = () => {
    dialogLogout.current?.showModal();
  }

  const confirmarLogout = async () => {
    try {
      await logoutSession();
      setMostrarLogoutSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error(error);
    }finally{
      cancelarLogout();
    }
  }

  const cancelarLogout = () => {
    dialogLogout.current?.close();
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
        <div className="fixed top-0 w-full bg-white shadow-md border-b border-gray-200 z-40">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center gap-4">
              <img
                src="public/logo_alternativo.png"
                className="cursor-pointer h-10 w-auto"
                alt="Gustaff S.A"
              />
              <h1 className="text-xl font-bold text-gray-800">Gustaff - Logística</h1>
            </div>
            <div className="flex items-center gap-4">
              <div>{usuario?.name ?? ""}</div>
            <div className="dropdown dropdown-end">
            <button tabIndex={0} className="avatar placeholder cursor-pointer">
              <div className="bg-gradient-to-br from-indigo-400 to-indigo-600 text-white rounded-full w-10 flex items-center justify-center text-sm font-bold">
                {usuario?.name ? usuario.name.charAt(0).toUpperCase() : "GL"}
              </div>
            </button>
            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
              <li><button onClick={() => setShowEdicion(true)} className="text-sm">👤 Ver/Editar Perfil</button></li>
              
              <li><button onClick={logout} className="text-error text-sm">🚪 Cerrar sesión</button></li>
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
              className="btn btn-ghost justify-start text-left rounded-lg hover:bg-indigo-100 hover:text-indigo-700 transition-colors" 
              onClick={() => setcargarComponente(0)}
              title="Dashboard"
            >
              <span className="text-lg">📊</span>
              {!collapsed && <span className="text-sm font-medium">Dashboard</span>}
            </button>

            {/* Actas de Entrada */}
            {!collapsed && <div className="text-xs font-semibold text-gray-500 mt-4 mb-2 px-2">ACTAS DE ENTRADA</div>}
            <button className="btn btn-ghost justify-start rounded-lg hover:bg-cyan-100 hover:text-cyan-700 transition-colors" onClick={() => setcargarComponente(3)}>
              <span className="text-lg">📥</span> {!collapsed && <span className="text-sm">Nueva Entrada</span>}
            </button>

            <button className="btn btn-ghost justify-start rounded-lg hover:bg-cyan-100 hover:text-cyan-700 transition-colors" onClick={() => setcargarComponente(4)}>
              <span className="text-lg">📥</span> {!collapsed && <span className="text-sm">Gestionar Entradas</span>}
            </button>

            {/* Actas de Salida */}
            {!collapsed && <div className="text-xs font-semibold text-gray-500 mt-4 mb-2 px-2">ACTAS DE SALIDA</div>}
            <button className="btn btn-ghost justify-start rounded-lg hover:bg-indigo-100 hover:text-indigo-700 transition-colors" onClick={() => setcargarComponente(1)}>
              <span className="text-lg">📤</span> {!collapsed && <span className="text-sm">Nueva Salida</span>}
            </button>

            <button className="btn btn-ghost justify-start rounded-lg hover:bg-indigo-100 hover:text-indigo-700 transition-colors" onClick={() => setcargarComponente(2)}>
              <span className="text-lg">📤</span> {!collapsed && <span className="text-sm">Gestionar Salidas</span>}
            </button>

            {/* Inventario */}
            {!collapsed && <div className="text-xs font-semibold text-gray-500 mt-4 mb-2 px-2">INVENTARIO</div>}
            <button className="btn btn-ghost justify-start rounded-lg hover:bg-cyan-100 hover:text-cyan-700 transition-colors" onClick={() => setcargarComponente(5)}>
              <span className="text-lg">📊</span> {!collapsed && <span className="text-sm">Gestionar Inventario</span>}
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

      {/* MODAL EDICIÓN DE PERFIL */}
      {showEdicion && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-4 flex justify-between items-center sticky top-0">
              <div className="flex items-center gap-3">
                <span className="text-3xl">👤</span>
                <div>
                  <h2 className="text-2xl font-bold text-white">Mi Perfil</h2>
                  <p className="text-indigo-100 text-sm">Edita tu información</p>
                </div>
              </div>
              <button onClick={() => setShowEdicion(false)} className="text-white hover:bg-indigo-700 p-2 rounded-lg transition">✕</button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label"><span className="label-text font-semibold text-indigo-700">Nombre</span></label>
                  <input type="text" className="input input-bordered focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all" value={usuarioEnEdicion?.name || ""} onChange={(e) => setUsuarioEnEdicion({...usuarioEnEdicion, name: e.target.value} as Users)} />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text font-semibold text-indigo-700">Email</span></label>
                  <input type="email" className="input input-bordered focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all" value={usuarioEnEdicion?.email || ""} onChange={(e) => setUsuarioEnEdicion({...usuarioEnEdicion, email: e.target.value} as Users)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label"><span className="label-text font-semibold text-indigo-700">Cédula</span></label>
                  <input type="text" className="input input-bordered focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all" value={usuarioEnEdicion?.identificacion || ""} onChange={(e) => setUsuarioEnEdicion({...usuarioEnEdicion, identificacion: e.target.value} as Users)} />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text font-semibold text-indigo-700">Celular</span></label>
                  <input type="text" className="input input-bordered focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all" value={usuarioEnEdicion?.celular || ""} onChange={(e) => setUsuarioEnEdicion({...usuarioEnEdicion, celular: e.target.value} as Users)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label"><span className="label-text font-semibold text-indigo-700">Fecha de Nacimiento</span></label>
                  <input type="date" className="input input-bordered focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all" value={usuarioEnEdicion?.fecha_nacimiento?.split('T')[0] || ""} onChange={(e) => setUsuarioEnEdicion({...usuarioEnEdicion, fecha_nacimiento: e.target.value} as Users)} />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text font-semibold text-indigo-700">Cargo</span></label>
                  <select className="select select-bordered focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all" value={usuarioEnEdicion?.cargoId?.id || usuarioEnEdicion?.cargo || ""} onChange={(e) => setUsuarioEnEdicion({...usuarioEnEdicion, cargo: e.target.value} as Users)}>
                    <option value="">Selecciona cargo</option>
                    {cargos.map((cargo) => <option key={cargo.id} value={cargo.id}>{cargo.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text font-semibold text-indigo-700">Estado</span></label>
                <div className="flex items-center gap-2">
                  <span className={`badge badge-lg ${usuarioEnEdicion?.estado === 'ACTIVO' ? 'badge-success' : 'badge-error'}`}>{usuarioEnEdicion?.estado || "INACTIVO"}</span>
                </div>
              </div>

              <div className="divider">Cambiar Contraseña</div>
              
              {!mostrarCambioPassword ? (
                <button onClick={() => setMostrarCambioPassword(true)} className="btn btn-outline btn-sm w-full">🔑 Cambiar Contraseña</button>
              ) : (
                <div className="space-y-3 border-t pt-4">
                  <div className="form-control">
                    <label className="label"><span className="label-text font-semibold text-indigo-700">Nueva Contraseña</span></label>
                    <input type="password" placeholder="Ingresa nueva contraseña" className="input input-bordered focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all" value={contrasenaNueva} onChange={(e) => setContrasenaNueva(e.target.value)} />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={cambiarContraseña} className="btn btn-sm bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-0 hover:from-indigo-600 hover:to-indigo-700 flex-1">✓ Cambiar</button>
                    <button onClick={() => { setMostrarCambioPassword(false); setContrasenaNueva(""); }} className="btn btn-sm btn-ghost flex-1">Cancelar</button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-end border-t sticky bottom-0">
              <button onClick={() => setShowEdicion(false)} className="btn btn-ghost">Cancelar</button>
              <button onClick={guardarEdicionPerfil} className="btn bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-0 hover:from-indigo-600 hover:to-indigo-700">✓ Guardar Cambios</button>
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
