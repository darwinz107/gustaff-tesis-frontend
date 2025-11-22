
import React, { useEffect, useRef, useState } from 'react'
import { NuevoUsuario } from './NuevoUsuario';
import { getUsers } from '../../../user/controller/api/user-api';
import type { Users } from '../../models/users';

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
  //const [ventanaDetalleUsuario, setventanaDetalleUsuario] = useState(false);
  const [validarCambio, setvalidarCambio] = useState(false);
  const [asignarDetalle, setasignarDetalle] = useState<Users>({});
  const [cargos, setcargos] = useState<{ id:number,name: string}[]>([]);

   useEffect(() => {
     const asignarCargos = async () =>{
      const traerCargos = await getAllCargos();
      console.log(traerCargos);
      setcargos(traerCargos);
     };
     asignarCargos();
    }, []);

   useEffect(() => {
   const obtenerUsers = async () =>{
     const getUsersbyApi = await getUsers();
     setusers(getUsersbyApi);
   };
   obtenerUsers();
  }, [validarCambio]);

  return (
    <>
      <div className='min-w-[70%] min-h-[60%] rounded-xl border border-gray-200'>
        <div className="bg-gray-200 w-full h-9 flex items-center justify-center mb-2 rounded-t-lg"><p className="">Listado de usuarios</p></div>
        <button className="btn mx-5" onClick={() =>  setventanaCrearUsuario(!ventanaCrearUsuario)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="size-[1.2em]"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>
          Nuevo usuario
        </button>
        <div className='flex w-full p-5 '>
          <div className="dropdown w-[50%]">
            <div tabindex="0" role="button" class="btn m-1">Mostrar 3 filas</div>
            <ul tabindex="-1" class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
              <li><a>Item 1</a></li>
              <li><a>Item 2</a></li>
            </ul>

          </div>
          <div className='flex justify-end w-[50%]'>
            <div className='flex'> <p>Buscar: </p> <input className='input ml-2' type="text" /></div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="table">

            <thead >
              <tr>

                <th>Nombre</th>
                <th>Telefono</th>
                <th>Email</th>
                <th>Cargo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) =>
                <>
                  <tr>

                    <td>
                      {u.name}
                    </td>
                    <td>
                      {u.cellphone}

                    </td>
                    <td>{u.fechaNacimiento}</td>
                    <td>{u.cargoId.name}</td>
                    <td>
                      <button className="btn btn-ghost btn-xs" onClick={() =>{ setasignarDetalle(u); setventanaEmergente(!ventanaEmergente); }}>Detalles</button>
                      <button className="btn btn-ghost btn-xs">Eliminar</button>
                    </td>
                  </tr>
                </>)}

            </tbody>

          </table>
        </div>
      </div>

      <div className={`z-10 fixed  bg-transparent inset-0 flex items-center justify-center transition-opacity duration-300 ${ventanaEmergente ? "opacity-100" : "opacity-0 pointer-events-none"} `}>
      <div className={`border border-gray-300 w-4/5 h-4/5 rounded-sm fixed  bg-white`}>
        <div className='w-full h-[12%] flex justify-between p-5'>
          <div>Listado de ordenes</div>
          <div onClick={() => { setventanaEmergente(!ventanaEmergente); console.log(ventanaEmergente) }} className='cursor-pointer'>❌</div>
        </div>
        <div className='w-full h-[76%] border-y border-gray-300 px-4 flex'>
          <div className='w-[33.33%] h-[100%]'>
            <div className='w-[100%] h-[33.33%]'><p>Nombre</p><input type="text" disabled={!habilitarEdicion} className='input' value={asignarDetalle.name} onChange={(e)=>setasignarDetalle((prev)=>prev.name == e.target.value)}/></div>
            <div className='w-[100%] h-[33.33%]'><p>Fecha de nacimiento</p><button disabled={!habilitarEdicion} type="button" onClick={() => { callyPpopover3.current?.showPopover() }} className="input input-border" id="cally3" style={{ anchorName: "--cally3" }}>
                 {asignarDetalle.fechaNacimiento}
                </button>
                <div popover="auto" ref={callyPpopover3} className="dropdown bg-base-100 rounded-box shadow-lg" style={{ positionAnchor: "--cally3" }}>
                  <calendar-date className="cally" onchange={(e) =>{document.getElementById("cally3").innerText = e.target.value; setasignarDetalle((prev)=>prev.fechaNacimiento == e.target.value)}}>
                    <svg aria-label="Previous" className="fill-current size-4" slot="previous" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.75 19.5 8.25 12l7.5-7.5"></path></svg>
                    <svg aria-label="Next" className="fill-current size-4" slot="next" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="m8.25 4.5 7.5 7.5-7.5 7.5"></path></svg>
                    <calendar-month></calendar-month>
                  </calendar-date>
                </div></div>
            <div className='w-[100%] h-[33.34%]'><p>Cedula</p><input type="text" disabled={!habilitarEdicion} className='input' /></div>
          </div>
          <div className='w-[33.33%] h-[100%]'>
            <div className='w-[100%] h-[33.33%]'><p>Celular</p><input type="text" disabled={!habilitarEdicion} className='input' /></div>
            <div className='w-[100%] h-[33.33%]'><p>Email</p><input type="text" disabled={!habilitarEdicion} className='input' /></div>
            <div className='w-[100%] h-[33.34%]'><p>Contraseña</p><input type="text" disabled={!habilitarEdicion} className='input' /></div>
          </div>
          <div className='w-[33.34%] h-[100%]'>
            <div className='w-[100%] h-[33.33%]'><p>Cargo</p>  <select className="select" id="" defaultValue={"..."} onChange={(e)=>setselectCargo(e.target.value)}>
                <option  disabled={true} defaultChecked={true}>...</option>
              {cargos.map((a)=><>
              <option value={a.id}>{a.name}</option>
              </>)}
              </select></div>
            <div className='w-[100%] h-[33.33%]'></div>
            <div className='w-[100%] h-[33.34%]'></div>
          </div>
        </div>
        <div className='w-full h-[12%] flex justify-between p-5'>

          {habilitarEdicion 
          ? <>
          <button className='btn'>Hecho</button>
            <button className='btn' onClick={() => { sethabilitarEdicion(!habilitarEdicion); }}>Cancelar</button></> 
          : <>
          <button className='btn' onClick={() => { sethabilitarEdicion(!habilitarEdicion); }}>Editar</button>
            <button className='btn' onClick={() => { setventanaEmergente(!ventanaEmergente); console.log(ventanaEmergente) }}>Cerrar</button></>}
        </div>
      </div>
      </div>
      
      <div className={`z-10 fixed  bg-transparent inset-0 flex items-center justify-center transition-opacity duration-300 ${ventanaCrearUsuario ? "opacity-100" : "opacity-0 pointer-events-none"} `}>
      <div className={`border border-gray-300 w-4/5 h-4/5 rounded-sm fixed  bg-white`}>
      <NuevoUsuario cargos={cargos} setconfirmarCambio={setvalidarCambio}  showCrearUsuario={ventanaCrearUsuario} setshowCrearUsuario={setventanaCrearUsuario}></NuevoUsuario>
      </div>
      </div>
      
    </>
  )
}
