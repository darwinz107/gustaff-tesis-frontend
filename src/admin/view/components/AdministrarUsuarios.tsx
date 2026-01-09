import React, { useEffect, useRef, useState } from 'react'
import { NuevoUsuario } from './NuevoUsuario';
import { getOneUser, getUsers } from '../../../user/controller/api/user-api';
import type { Users } from '../../models/users';
import { actualizarUsuario, deleteUser, getAllCargos } from '../../controller/api/admin-api';
import { filtrarUsers } from '../../../user/controller/api/user-api';

export const AdministrarUsuarios = () => {
  const [selectFechaNac, setselectFechaNac] = useState("");
  const [nombre, setnombre] = useState("");
  const [cedula, setcedula] = useState(0);
  const [celular, setcelular] = useState(0);
  const [email, setemail] = useState("");
  const [contrasenia, setcontrasenia] = useState("");
  const [selectCargo, setselectCargo] = useState(0);
  const callyPpopover3 = useRef(null);  const dialogEliminar = useRef<HTMLDialogElement>(null);
  const [usuarioAEliminar, setusuarioAEliminar] = useState<number | null>(null);  const [ventanaEmergente, setventanaEmergente] = useState(false);
  const [users, setusers] = useState<Users[]>([])
  const [habilitarEdicion, sethabilitarEdicion] = useState(false);
  const [ventanaCrearUsuario, setventanaCrearUsuario] = useState(false);
  const [validarCambio, setvalidarCambio] = useState(false);
  const [asignarDetalle, setasignarDetalle] = useState<Users>({});
  const [cargos, setcargos] = useState<{ id:number,name: string}[]>([]);

  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroEmail, setFiltroEmail] = useState("");
  const [filtroCargoId, setFiltroCargoId] = useState<number | "">("");
  const [filtroIdentificacion, setFiltroIdentificacion] = useState("");
  const [filtroActivo, setFiltroActivo] = useState<string>("");

  // Estados para alertas de éxito y error
  const [showError, setshowError] = useState(false);
  const [showSuccess, setshowSuccess] = useState(false);
  const [mensajeError, setmensajeError] = useState("");
  
  // Estados para errores de validación en detalles
  const [erroresEdicion, seterroresEdicion] = useState({});
  const [showErrorEdicion, setshowErrorEdicion] = useState(false);
  const [showSuccessEdicion, setshowSuccessEdicion] = useState(false);
  const [mensajeErrorEdicion, setmensajeErrorEdicion] = useState("");

  useEffect(() => {
    const asignarCargos = async () =>{
      const traerCargos = await getAllCargos();
      setcargos(traerCargos);
    };
    asignarCargos();
  }, []);

const obtenerUsers = async () =>{
      const getUsersbyApi = await getUsers();
      setusers(getUsersbyApi);
    };

  // Validaciones para detalles
  const validarNombre = (valor) => {
    if (!valor.trim()) return "El nombre es requerido";
    if (!/^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]+$/.test(valor)) return "El nombre solo puede contener letras y espacios";
    return "";
  };

  const validarCedula = (valor) => {
    if (!valor) return "La cédula es requerida";
    if (!/^\d+$/.test(valor.toString())) return "La cédula solo puede contener números";
    if (valor.toString().length < 10) return "La cédula debe tener al menos 10 dígitos";
    return "";
  };

  const validarCelular = (valor) => {
    if (!valor) return "El celular es requerido";
    if (!/^\d+$/.test(valor.toString())) return "El celular solo puede contener números";
    if (valor.toString().length < 10) return "El celular debe tener al menos 10 dígitos";
    return "";
  };

  const validarEmail = (valor) => {
    if (!valor.trim()) return "El email es requerido";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) return "El email no es válido";
    return "";
  };

  const validarFecha = (valor) => {
    if (!valor) return "La fecha de nacimiento es requerida";
    return "";
  };

  const validarCargo = (valor) => {
    if (!valor || valor === 0) return "Debe seleccionar un cargo";
    return "";
  };

  const limpiarErroresEdicion = () => {
    seterroresEdicion({});
    setshowErrorEdicion(false);
    setshowSuccessEdicion(false);
    setmensajeErrorEdicion("");
    setcontrasenia("");
  };

  useEffect(() => {
    const obtenerUsers = async () =>{
      const getUsersbyApi = await getUsers();
      setusers(getUsersbyApi);
    };
    obtenerUsers();
  }, [validarCambio]);

  const detalleUsuario = async (id:number) =>{
    const infoUsuario = await getOneUser(id);
    console.log(infoUsuario);
    setselectCargo(infoUsuario.cargoId.id);
    setasignarDetalle(infoUsuario);
    limpiarErroresEdicion();
  };

  const actualizarInfoUsuario = async () =>{
    // Validar campos
    const nuevosErrores = {
      nombre: validarNombre(asignarDetalle.name || ""),
      cedula: validarCedula(asignarDetalle.identification || ""),
      celular: validarCelular(asignarDetalle.cellphone || ""),
      email: validarEmail(asignarDetalle.email || ""),
      fecha: validarFecha(asignarDetalle.fechaNac || ""),
      cargo: validarCargo(selectCargo)
    };

    seterroresEdicion(nuevosErrores);

    // Si hay errores, mostrar mensaje
    if (Object.values(nuevosErrores).some(error => error !== "")) {
      setmensajeErrorEdicion("Por favor complete correctamente todos los campos");
      setshowErrorEdicion(true);
      setTimeout(() => {
        setshowErrorEdicion(false);
      }, 3000);
      return;
    }

    try {
      if(contrasenia===""){
        const newInfoUsuario = {
          name: asignarDetalle.name,
          fechaNac: asignarDetalle.fechaNac,
          identification: asignarDetalle.identification,
          cellphone: asignarDetalle.cellphone,
          email: asignarDetalle.email,
          cargo: selectCargo
        }
        const res = await actualizarUsuario(asignarDetalle.id, newInfoUsuario);
        setmensajeErrorEdicion(res.msj);
        setshowSuccessEdicion(true);
        setTimeout(() => {
          setshowSuccessEdicion(false);
            console.log(res);
        detalleUsuario(asignarDetalle.id);
       
        }, 2000);
       sethabilitarEdicion(!habilitarEdicion);
      }else{
        const newInfoUsuario = {
          name: asignarDetalle.name,
          fechaNac: asignarDetalle.fechaNac,
          identification: asignarDetalle.identification,
          cellphone: asignarDetalle.cellphone,
          email: asignarDetalle.email,
          password: contrasenia,
          cargoId: selectCargo
        }
        const res = await actualizarUsuario(asignarDetalle.id, newInfoUsuario);
        if(res.validate === false){
          setmensajeErrorEdicion("Fallo al actualizar los datos!");
          setshowErrorEdicion(true);
          setTimeout(() => {
            setshowErrorEdicion(false);
          }, 3000);
          return;
        }
        setmensajeErrorEdicion(res.msj);
        setshowSuccessEdicion(true);
        setTimeout(() => {
          setshowSuccessEdicion(false);
           
        }, 2000);
               setcontrasenia("");
               detalleUsuario(asignarDetalle.id);
        sethabilitarEdicion(!habilitarEdicion);
        const res2 = await getUsers();
    setusers(res2);

      }
    } catch (error) {
      console.log(error);
      setmensajeErrorEdicion("Error al actualizar el usuario");
      setshowErrorEdicion(true);
      setTimeout(() => {
        setshowErrorEdicion(false);
      }, 3000);
    }
  };

  const aplicarFiltros = async () => {
    const filtros: any = {};
    if (filtroNombre.trim() !== "") filtros.name = filtroNombre;
    if (filtroEmail.trim() !== "") filtros.email = filtroEmail;
    if (filtroCargoId !== "") filtros.cargoId = Number(filtroCargoId);
    if (filtroIdentificacion.trim() !== "") filtros.identification = filtroIdentificacion;
    if (filtroActivo === "true") filtros.activo = true;
    if (filtroActivo === "false") filtros.activo = false;
    const res = await filtrarUsers(filtros);
    setusers(res || []);
  };

  const limpiarFiltros = async () => {
    setFiltroNombre("");
    setFiltroEmail("");
    setFiltroCargoId("");
    setFiltroIdentificacion("");
    setFiltroActivo("");
    const res = await getUsers();
    setusers(res);
  };

  const metodoEliminarUser = async () => {
   if (usuarioAEliminar === null) return;
   
   const res = await deleteUser(usuarioAEliminar);

   if(res.validate === true){
    setmensajeError(res.msj ?? "Usuario eliminado correctamente");
    setshowSuccess(true);
    setTimeout(() => {
      setshowSuccess(false);
      
    }, 2000);
    setusuarioAEliminar(null);
    obtenerUsers();
   } else {
    setmensajeError(res.msj);
    setshowError(true);
    setTimeout(() => {
      setshowError(false);
    }, 3000);
    setusuarioAEliminar(null);
   }
  }

  return (
    <>
      {showSuccess && (
        <div className="fixed top-5 right-5 z-50">
          <div role="alert" className="alert alert-success shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{mensajeError}</span>
          </div>
        </div>
      )}

      {showError && (
        <div className="fixed top-5 right-5 z-50">
          <div role="alert" className="alert alert-error shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{mensajeError}</span>
          </div>
        </div>
      )}

      {showSuccessEdicion && (
        <div className="fixed top-5 right-5 z-50">
          <div role="alert" className="alert alert-success shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{mensajeErrorEdicion}</span>
          </div>
        </div>
      )}

      {showErrorEdicion && (
        <div className="fixed top-5 right-5 z-50">
          <div role="alert" className="alert alert-error shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{mensajeErrorEdicion}</span>
          </div>
        </div>
      )}
      <div className="min-w-[70%] min-h-[60%] rounded-xl border border-gray-200 bg-white shadow-sm m-4">
        <div className="bg-gray-100 w-full h-12 flex items-center justify-between rounded-t-lg border-b px-4">
          <p className="font-semibold text-gray-700">Listado de usuarios</p>
          <div className="flex items-center gap-2">
            <button className="btn btn-sm btn-ghost" onClick={() => setventanaCrearUsuario(!ventanaCrearUsuario)}>Nuevo usuario</button>
            <button className="btn btn-sm btn-ghost" onClick={() => obtenerUsers()}>Refrescar</button>
            <button className="btn btn-sm btn-outline" onClick={limpiarFiltros}>Limpiar</button>
            <button className="btn btn-sm btn-primary" onClick={aplicarFiltros}>Aplicar</button>
          </div>
        </div>

        <div className="p-4 grid grid-cols-1 lg:grid-cols-5 gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Nombre</label>
            <input className="input input-sm" value={filtroNombre} onChange={(e)=>setFiltroNombre(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Email</label>
            <input className="input input-sm" value={filtroEmail} onChange={(e)=>setFiltroEmail(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Cargo</label>
            <select className="select select-sm" value={filtroCargoId} onChange={(e)=>setFiltroCargoId(e.target.value === "" ? "" : Number(e.target.value))}>
              <option value="">Todos</option>
              {cargos.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Cédula</label>
            <input className="input input-sm" value={filtroIdentificacion} onChange={(e)=>setFiltroIdentificacion(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Estado</label>
            <select className="select select-sm" value={filtroActivo} onChange={(e)=>setFiltroActivo(e.target.value)}>
              <option value="">Todos</option>
              <option value="true">ACTIVO</option>
              <option value="false">INACTIVO</option>
            </select>
          </div>
        </div>

        <div className="px-4 pb-4">
          <div className="overflow-hidden border rounded-lg">
            <div className="max-h-[520px] overflow-auto">
              <table className="table w-full min-w-full">
                <thead className="bg-white sticky top-0 z-10">
                  <tr className="text-sm text-left text-gray-600">
                    <th className="px-4 py-3">Nombre</th>
                    <th className="px-4 py-3">Telefono</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Cargo</th>
                    <th className="px-4 py-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="even:bg-gray-50 hover:bg-gray-100">
                      <td className="px-4 py-3 align-top">{u.name}</td>
                      <td className="px-4 py-3 align-top">{u.cellphone}</td>
                      <td className="px-4 py-3 align-top">{u.email}</td>
                      <td className="px-4 py-3 align-top">{u.cargoId?.name}</td>
                      <td className="px-4 py-3 align-top text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button className="btn btn-outline btn-sm" onClick={() => { detalleUsuario(u.id); setventanaEmergente(true); }}>Detalles</button>
                           <button className="btn btn-outline btn-sm" onClick={() => { setusuarioAEliminar(u.id); if(dialogEliminar.current) dialogEliminar.current.showModal(); }}>Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center text-sm text-gray-500 py-8">No hay usuarios</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className={`z-50 fixed inset-0 flex items-center justify-center transition-opacity duration-300 ${ventanaEmergente ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative border border-gray-300 w-11/12 max-w-4xl h-[85vh] rounded-md bg-white shadow-lg overflow-auto">
          <div className="w-full h-[12%] flex justify-between p-5 border-b">
            <div className="font-medium text-gray-700">Detalle de usuario</div>
            <div onClick={() => {limpiarErroresEdicion(); setventanaEmergente(!ventanaEmergente);}} className="cursor-pointer">❌</div>
          </div>

          <div className="w-full h-[76%] border-y border-gray-300 px-6 py-4 flex">
            <div className="w-1/3">
              <p className="text-xs text-gray-500">Nombre</p>
              <input type="text" disabled={!habilitarEdicion} className={`input w-full mt-1 ${erroresEdicion.nombre ? 'input-error' : ''}`} value={asignarDetalle.name ?? ""} onChange={(e)=>{setasignarDetalle(prev=>({...prev, name: e.target.value})); seterroresEdicion({...erroresEdicion, nombre: validarNombre(e.target.value)});}} />
              <div className="h-5">{erroresEdicion.nombre && <p className="text-red-500 text-sm">{erroresEdicion.nombre}</p>}</div>
              
              <p className="text-xs text-gray-500 mt-4">Fecha de nacimiento</p>
              <input type="date" className={`input input-sm ${erroresEdicion.fecha ? 'input-error' : ''}`} value={asignarDetalle.fechaNac ?? ""} disabled={!habilitarEdicion} onChange={(e)=>{ setasignarDetalle(prev=>({...prev, fechaNac: e.target.value})); seterroresEdicion({...erroresEdicion, fecha: validarFecha(e.target.value)});}} />
              <div className="h-5">{erroresEdicion.fecha && <p className="text-red-500 text-sm">{erroresEdicion.fecha}</p>}</div>
              
              <p className="text-xs text-gray-500 mt-4">Cédula</p>
              <input className={`input w-full mt-1 ${erroresEdicion.cedula ? 'input-error' : ''}`} value={asignarDetalle.identification ?? ""} onChange={(e)=>{setasignarDetalle(prev=>({...prev, identification: e.target.value})); seterroresEdicion({...erroresEdicion, cedula: validarCedula(e.target.value)});}} disabled={!habilitarEdicion} />
              <div className="h-5">{erroresEdicion.cedula && <p className="text-red-500 text-sm">{erroresEdicion.cedula}</p>}</div>
            </div>

            <div className="w-1/3 px-4">
              <p className="text-xs text-gray-500">Celular</p>
              <input className={`input w-full mt-1 ${erroresEdicion.celular ? 'input-error' : ''}`} value={asignarDetalle.cellphone ?? ""} onChange={(e)=>{setasignarDetalle(prev=>({...prev, cellphone: e.target.value})); seterroresEdicion({...erroresEdicion, celular: validarCelular(e.target.value)});}} disabled={!habilitarEdicion} />
              <div className="h-5">{erroresEdicion.celular && <p className="text-red-500 text-sm">{erroresEdicion.celular}</p>}</div>
              
              <p className="text-xs text-gray-500 mt-4">Email</p>
              <input className={`input w-full mt-1 ${erroresEdicion.email ? 'input-error' : ''}`} value={asignarDetalle.email ?? ""} onChange={(e)=>{setasignarDetalle(prev=>({...prev, email: e.target.value})); seterroresEdicion({...erroresEdicion, email: validarEmail(e.target.value)});}} disabled={!habilitarEdicion} />
              <div className="h-5">{erroresEdicion.email && <p className="text-red-500 text-sm">{erroresEdicion.email}</p>}</div>
              
              <p className="text-xs text-gray-500 mt-4">Nueva contraseña</p>
              <input className="input w-full mt-1" value={contrasenia} onChange={(e)=>setcontrasenia(e.target.value)} disabled={!habilitarEdicion} />
            </div>

            <div className="w-1/3">
              <p className="text-xs text-gray-500">Cargo</p>
              <select disabled={!habilitarEdicion} className={`select w-full mt-1 ${erroresEdicion.cargo ? 'select-error' : ''}`} value={selectCargo} onChange={(e)=>{setselectCargo(Number(e.target.value)); seterroresEdicion({...erroresEdicion, cargo: validarCargo(Number(e.target.value))});}}>
                <option value={0}>...</option>
                {cargos.map((a)=><option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
              <div className="h-5">{erroresEdicion.cargo && <p className="text-red-500 text-sm">{erroresEdicion.cargo}</p>}</div>
              
              <p className="text-xs text-gray-500 mt-4">Estado</p>
              <input className="input w-full mt-1" disabled={!habilitarEdicion} value={asignarDetalle?.estado ?"ACTIVO":"INACTIVO"} />
            </div>
          </div>

          <div className="w-full h-[12%] flex justify-between items-center px-6 border-t">
            {habilitarEdicion ? (
              <>
                <button className="btn btn-primary" onClick={actualizarInfoUsuario}>Hecho</button>
                <button className="btn" onClick={() => { limpiarErroresEdicion(); detalleUsuario(asignarDetalle.id); sethabilitarEdicion(!habilitarEdicion); }}>Cancelar</button>
              </>
            ) : (
              <>
                <button className="btn" onClick={() => sethabilitarEdicion(!habilitarEdicion)}>Editar</button>
                <button className="btn btn-ghost" onClick={() =>{ limpiarErroresEdicion(); setventanaEmergente(!ventanaEmergente);}}>Cerrar</button>
              </>
            )}
          </div>
        </div>
      </div>

      <dialog ref={dialogEliminar} id="dialog_eliminar_usuario" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Advertencia!</h3>
          <p className="py-4">¿Está seguro que desea eliminar este usuario?</p>
          <div className="modal-action">
            <form method="dialog" className="flex gap-2">
              <button className="btn btn-primary" onClick={metodoEliminarUser}>Eliminar</button>
              <button className="btn" onClick={() => setusuarioAEliminar(null)}>Cancelar</button>
            </form>
          </div>
        </div>
      </dialog>

      <div className={`z-10 fixed inset-0 flex items-center justify-center transition-opacity duration-300 ${ventanaCrearUsuario ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative border border-gray-300 w-11/12 max-w-4xl h-[85vh] rounded-md bg-white shadow-lg overflow-auto">
          <NuevoUsuario cargos={cargos} setconfirmarCambio={setvalidarCambio} showCrearUsuario={ventanaCrearUsuario} setshowCrearUsuario={setventanaCrearUsuario} />
        </div>
      </div>
    </>
  )
}
