import React, { useEffect, useRef, useState } from 'react'
import { NuevoUsuario } from './NuevoUsuario';
import { getOneUser, getUsers } from '../../../user/controller/api/user-api';
import type { Users } from '../../models/users';
import { actualizarUsuario, getAllCargos } from '../../controller/api/admin-api';
import { filtrarUsers } from '../../../user/controller/api/user-api';

export const AdministrarUsuarios = () => {
  const [selectFechaNac, setselectFechaNac] = useState("");
  const [nombre, setnombre] = useState("");
  const [cedula, setcedula] = useState(0);
  const [celular, setcelular] = useState(0);
  const [email, setemail] = useState("");
  const [contrasenia, setcontrasenia] = useState("");
  const [selectCargo, setselectCargo] = useState(0);
  const callyPpopover3 = useRef(null);
  const [ventanaEmergente, setventanaEmergente] = useState(false);
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
  };

  const actualizarInfoUsuario = async () =>{
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
      alert(res.msj);
      console.log(res);
      detalleUsuario(asignarDetalle.id);
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
      if(res.validte ===false){
       alert("Fallo al actualizar los datos!");
       return;
      }
      alert(res.msj);
      detalleUsuario(asignarDetalle.id);
      sethabilitarEdicion(!habilitarEdicion);
      setcontrasenia("");
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

  return (
    <>
      <div className="min-w-[70%] min-h-[60%] rounded-xl border border-gray-200 bg-white shadow-sm">
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
            <div onClick={() => setventanaEmergente(!ventanaEmergente)} className="cursor-pointer">❌</div>
          </div>

          <div className="w-full h-[76%] border-y border-gray-300 px-6 py-4 flex">
            <div className="w-1/3">
              <p className="text-xs text-gray-500">Nombre</p>
              <input type="text" disabled={!habilitarEdicion} className="input w-full mt-1" value={asignarDetalle.name ?? ""} onChange={(e)=>setasignarDetalle(prev=>({...prev, name: e.target.value}))} />
              <p className="text-xs text-gray-500 mt-4">Fecha de nacimiento</p>
        
              <input type="date" className="input input-sm" value={asignarDetalle.fechaNac ?? ""} disabled={!habilitarEdicion} onChange={(e)=>{ setasignarDetalle(prev=>({...prev, fechaNac: e.target.value}));}} />
              <p className="text-xs text-gray-500 mt-4">Cédula</p>
              <input className="input w-full mt-1" value={asignarDetalle.identification ?? ""} onChange={(e)=>setasignarDetalle(prev=>({...prev, identification: e.target.value}))} disabled={!habilitarEdicion} />
            </div>

            <div className="w-1/3 px-4">
              <p className="text-xs text-gray-500">Celular</p>
              <input className="input w-full mt-1" value={asignarDetalle.cellphone ?? ""} onChange={(e)=>setasignarDetalle(prev=>({...prev, cellphone: e.target.value}))} disabled={!habilitarEdicion} />
              <p className="text-xs text-gray-500 mt-4">Email</p>
              <input className="input w-full mt-1" value={asignarDetalle.email ?? ""} onChange={(e)=>setasignarDetalle(prev=>({...prev, email: e.target.value}))} disabled={!habilitarEdicion} />
              <p className="text-xs text-gray-500 mt-4">Nueva contraseña</p>
              <input className="input w-full mt-1" value={contrasenia} onChange={(e)=>setcontrasenia(e.target.value)} disabled={!habilitarEdicion} />
            </div>

            <div className="w-1/3">
              <p className="text-xs text-gray-500">Cargo</p>
              <select disabled={!habilitarEdicion} className="select w-full mt-1" value={selectCargo} onChange={(e)=>setselectCargo(Number(e.target.value))}>
                <option value={0}>...</option>
                {cargos.map((a)=><option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
              <p className="text-xs text-gray-500 mt-4">Estado</p>
              <input className="input w-full mt-1" disabled={!habilitarEdicion} value={asignarDetalle?.estado ?"ACTIVO":"INACTIVO"} />
            </div>
          </div>

          <div className="w-full h-[12%] flex justify-between items-center px-6 border-t">
            {habilitarEdicion ? (
              <>
                <button className="btn btn-primary" onClick={actualizarInfoUsuario}>Hecho</button>
                <button className="btn" onClick={() => { detalleUsuario(asignarDetalle.id); setcontrasenia(""); sethabilitarEdicion(!habilitarEdicion); }}>Cancelar</button>
              </>
            ) : (
              <>
                <button className="btn" onClick={() => sethabilitarEdicion(!habilitarEdicion)}>Editar</button>
                <button className="btn btn-ghost" onClick={() =>{ setventanaEmergente(!ventanaEmergente); setcontrasenia("")}}>Cerrar</button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className={`z-10 fixed inset-0 flex items-center justify-center transition-opacity duration-300 ${ventanaCrearUsuario ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative border border-gray-300 w-11/12 max-w-4xl h-[85vh] rounded-md bg-white shadow-lg overflow-auto">
          <NuevoUsuario cargos={cargos} setconfirmarCambio={setvalidarCambio} showCrearUsuario={ventanaCrearUsuario} setshowCrearUsuario={setventanaCrearUsuario} />
        </div>
      </div>
    </>
  )
}
