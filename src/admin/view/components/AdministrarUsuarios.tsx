
import React, { useState } from 'react'
import { NuevoUsuario } from './NuevoUsuario';

export const AdministrarUsuarios = () => {
  const [ventanaEmergente, setventanaEmergente] = useState(false);
  const [users, setusers] = useState<{ nombre: string, cargo: string, fechaNac: string }[]>([{ nombre: "darwin", cargo: "programador", fechaNac: "12/05/2000" }])
  const [habilitarEdicion, sethabilitarEdicion] = useState(false);
  const [ventanaCrearUsuario, setventanaCrearUsuario] = useState(false)
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

                <th>Name</th>
                <th>Job</th>
                <th>Favorite Color</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) =>
                <>
                  <tr>

                    <td>
                      {u.nombre}
                    </td>
                    <td>
                      {u.cargo}

                    </td>
                    <td>{u.fechaNac}</td>
                    <th>
                      <button className="btn btn-ghost btn-xs" onClick={() => setventanaEmergente(!ventanaEmergente)}>Detalles</button>
                      <button className="btn btn-ghost btn-xs">Eliminar</button>
                    </th>
                  </tr>
                </>)}

            </tbody>

          </table>
        </div>
      </div>

      <div className={`z-10 border border-gray-300 w-4/5 h-4/5 rounded-sm fixed  bg-white top-[50%] left-[50%]  ${ventanaEmergente ? "-translate-x-1/2 -translate-y-[50%]" : "-translate-x-1/2 -translate-y-[200%]"} `}>
        <div className='w-full h-[12%] flex justify-between p-5'>
          <div>Listado de ordenes</div>
          <div onClick={() => { setventanaEmergente(!ventanaEmergente); console.log(ventanaEmergente) }} className='cursor-pointer'>❌</div>
        </div>
        <div className='w-full h-[76%] border-y border-gray-300 px-4 flex'>
          <div className='w-[33.33%] h-[100%]'>
            <div className='w-[100%] h-[33.33%]'><p>Nombre</p><input type="text" disabled={!habilitarEdicion} className='input' /></div>
            <div className='w-[100%] h-[33.33%]'><p>Fecha de nacimiento</p><input type="text" disabled={!habilitarEdicion} className='input' /></div>
            <div className='w-[100%] h-[33.34%]'><p>Cargo</p><input type="text" disabled={!habilitarEdicion} className='input' /></div>
          </div>
          <div className='w-[33.33%] h-[100%]'>
            <div className='w-[100%] h-[33.33%]'><p>Nombre</p><input type="text" disabled={!habilitarEdicion} className='input' /></div>
            <div className='w-[100%] h-[33.33%]'><p>Fecha de nacimiento</p><input type="text" disabled={!habilitarEdicion} className='input' /></div>
            <div className='w-[100%] h-[33.34%]'><p>Cargo</p><input type="text" disabled={!habilitarEdicion} className='input' /></div>
          </div>
          <div className='w-[33.34%] h-[100%]'>
            <div className='w-[100%] h-[33.33%]'><p>Nombre</p><input type="text" disabled={!habilitarEdicion} className='input' /></div>
            <div className='w-[100%] h-[33.33%]'><p>Fecha de nacimiento</p><input type="text" disabled={!habilitarEdicion} className='input' /></div>
            <div className='w-[100%] h-[33.34%]'><p>Cargo</p><input type="text" disabled={!habilitarEdicion} className='input' /></div>
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
      <div className={`z-10 border border-gray-300 w-4/5 h-4/5 rounded-sm fixed  bg-white top-[50%] left-[50%]  ${ventanaCrearUsuario ? "-translate-x-1/2 -translate-y-[50%]" : "-translate-x-1/2 -translate-y-[200%]"} `}>
      <NuevoUsuario showCrearUsuario={ventanaCrearUsuario} setshowCrearUsuario={setventanaCrearUsuario}></NuevoUsuario>
      </div>
    </>
  )
}
