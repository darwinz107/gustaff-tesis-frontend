
import React, { useEffect, useRef, useState } from 'react'
import type { DetallesPrevioCompra } from '../models/DetallesPrevioCompra';
import { findAllSolicitudesCompra } from '../controller/ordenCompraApi';


export const GestionCompra = () => {

   const [ordenesCompra, setordenesCompra] = useState<DetallesPrevioCompra[]>([]);
   const [validarCambio, setvalidarCambio] = useState(false);
   const [habilitarEdicion, sethabilitarEdicion] = useState(false);
   const callyPpopover4 = useRef(null);
    const [ventanaEmergente, setventanaEmergente] = useState(false);   
     const [ventanaCrearUsuario, setventanaCrearUsuario] = useState(false);


     useEffect(() => {
      const ordenesTrabajoApi  = async() =>{
       const res = await findAllSolicitudesCompra();
       setordenesCompra(res);
      }
      ordenesTrabajoApi();
     }, []);


     const cargarPdf = (id:number) => {
      //window.open(`/pdf/${id}`,"_blank");
     }
     
    return (
        <>
             <div className='min-w-[70%] min-h-[60%] rounded-xl border border-gray-200'>
                    <div className="bg-gray-200 w-full h-9 flex items-center justify-center mb-2 rounded-t-lg">
                      <p className="">Listado de ordenes de trabajo</p></div>
                   
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
            
                            <th>N.Orden</th>
                            <th>Fecha de remision</th>
                            <th>Solicitante</th>
                            <th>Descripcion</th>
                            <th>Estado</th>
                            <th className='text-center'>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ordenesCompra.map((u) =>
                            <>
                              <tr>
            
                                <td>
                                  {u.numOrden}
                                </td>
                                <td>
                                  {u.fechaRemision.split("T")[0]}
            
                                </td>
                                <td>{u.numOrdenTrabajo.userSolicitante.name}</td>
                                <td>{u.numOrdenTrabajo.DescripcionTrabajo}</td>
                                <td>{u.estadoCompra.estado}</td>
                                <td>
                                  <button className="btn btn-ghost btn-xs" onClick={() => { setventanaEmergente(!ventanaEmergente)}}>Detalles</button>
                                  <button className="btn btn-ghost btn-xs" >Eliminar</button>
                                  <button className="btn btn-ghost btn-xs" onClick={()=>cargarPdf(u.id)}>Ver pdf</button>
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
                        <div className='w-[100%] h-[33.33%]'><p>Nombre</p><input type="text" disabled={!habilitarEdicion} className='input'  /></div>
                        <div className='w-[100%] h-[33.33%]'><p>Fecha de nacimiento</p><button disabled={!habilitarEdicion} type="button" onClick={() => { callyPpopover4.current?.showPopover() }} className="input input-border" id="cally4" style={{ anchorName: "--cally4" }}>
                            pick a date
                            </button>
                            <div popover="auto" ref={callyPpopover4} className="dropdown bg-base-100 rounded-box shadow-lg" style={{ positionAnchor: "--cally4" }}>
                              <calendar-date className="cally" onchange={(e) =>{document.getElementById("cally3").innerText = e.target.value; }}>
                                <svg aria-label="Previous" className="fill-current size-4" slot="previous" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.75 19.5 8.25 12l7.5-7.5"></path></svg>
                                <svg aria-label="Next" className="fill-current size-4" slot="next" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="m8.25 4.5 7.5 7.5-7.5 7.5"></path></svg>
                                <calendar-month></calendar-month>
                              </calendar-date>
                            </div></div>
                        <div className='w-[100%] h-[33.34%]'><p>Cedula</p><input  type="text" disabled={!habilitarEdicion} className='input' /></div>
                      </div>
                      <div className='w-[33.33%] h-[100%]'>
                        <div className='w-[100%] h-[33.33%]'><p>Celular</p><input   type="text" disabled={!habilitarEdicion} className='input' /></div>
                        <div className='w-[100%] h-[33.33%]'><p>Email</p><input type="text" disabled={!habilitarEdicion} className='input' /></div>
                        <div className='w-[100%] h-[33.34%]'><p>Nueva contraseña</p><input   type="text" disabled={!habilitarEdicion} className='input' /></div>
                      </div>
                      <div className='w-[33.34%] h-[100%]'>
                        <div className='w-[100%] h-[33.33%]'><p>Cargo</p>  <select disabled={!habilitarEdicion} className="select" id="" defaultValue={"..."} >
                            <option  disabled={true} defaultChecked={true}>...</option>
                          {/*cargos.map((a)=><>
                          <option value={a.id}>{a.name}</option>
                          </>)*/}
                          </select></div>
                        <div className='w-[100%] h-[33.33%]'></div>
                        <div className='w-[100%] h-[33.34%]'></div>
                      </div>
                    </div>
                    <div className='w-full h-[12%] flex justify-between p-5'>
            
                      {habilitarEdicion 
                      ? <>
                      <button className='btn' >Hecho</button>
                        <button className='btn' >Cancelar</button></> 
                      : <>
                      <button className='btn' onClick={() => { sethabilitarEdicion(!habilitarEdicion); }}>Editar</button>
                        <button className='btn' onClick={() => { setventanaEmergente(!ventanaEmergente); }}>Cerrar</button></>}
                    </div>
                  </div>
                  </div>
                  
                  <div className={`z-10 fixed  bg-transparent inset-0 flex items-center justify-center transition-opacity duration-300 ${ventanaCrearUsuario ? "opacity-100" : "opacity-0 pointer-events-none"} `}>
                  <div className={`border border-gray-300 w-4/5 h-4/5 rounded-sm fixed  bg-white`}>
                  
                  </div>
                  </div>
        </>
    )
}
