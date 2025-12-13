
import React, { useEffect, useRef, useState } from 'react'
import type { DetallesPrevioCompra } from '../models/DetallesPrevioCompra';
import { editarSolicitudMaterial, eliminarSolMaterial, findAllSolicitudesCompra, getAllEstadosCompra, ordenCompraById } from '../controller/ordenCompraApi';
import type { InfoPdfCompra } from '../models/infoPdfCompra';
import { getUsers } from '../../user/controller/api/user-api';
import type { Users } from '../../admin/models/users';
import { allOrdenTrabajoNumOrden } from '../../orden-de-trabajo/controller/api/orden-api';


export const GestionCompra = () => {

   const [ordenesCompra, setordenesCompra] = useState<DetallesPrevioCompra[]>([]);
   const [validarCambio, setvalidarCambio] = useState(false);
   const [habilitarEdicion, sethabilitarEdicion] = useState(false);
   const callyPpopover4 = useRef(null);
    const [ventanaEmergente, setventanaEmergente] = useState(false);   
     const [ventanaCrearUsuario, setventanaCrearUsuario] = useState(false);
   const [detalleSol, setdetalleSol] = useState<InfoPdfCompra>({itemSolicitados:[]});
   const [confirmarCambio, setconfirmarCambio] = useState(true);
   const [users, setusers] = useState<Users[]>([]);
   const [ordenesTrabajo, setordenesTrabajo] = useState<{NumOrden:string}[]>([]);
   const [nOrdenTrabajo, setnOrdenTrabajo] = useState("");
   const [estados, setestados] = useState<{id:number,estado:string}[]>([])

    const ordenesTrabajoApi  = async() =>{
       const res = await findAllSolicitudesCompra();
       console.log(res);
       setordenesCompra(res);

       const res2 = await allOrdenTrabajoNumOrden();
       setordenesTrabajo(res2);
     //  console.log(res2);
      }

     useEffect(() => {


     
      ordenesTrabajoApi();

       const getAllUsers = async () => {
           const res = await getUsers();
           setusers(res);
         } ;
       getAllUsers(); 

       const getAllEstados = async () => {
           const res = await getAllEstadosCompra();
           setestados(res);
         } ;

         getAllEstados();
     }, []);


      const cargarSolicitud = async(id:number) =>{
            const res = await ordenCompraById(id);
            setdetalleSol(res);
            setnOrdenTrabajo(res.numOrdenTrabajo.NumOrden);
            
         }

      const actSolicitudMaterial = async() =>{
            
            const res = await editarSolicitudMaterial(detalleSol.id,{Autoriza:detalleSol.Autoriza,Destino:detalleSol.Destino,ordenTrabajoId:nOrdenTrabajo,estadoCompra:detalleSol.estadoCompra.estado});
            
            alert(res.msj);
            if(res.validate){
            ordenesTrabajoApi();
            cargarSolicitud(detalleSol.id);
            sethabilitarEdicion(!habilitarEdicion);
            setconfirmarCambio(true);
            }
           
         }
         
      const metodoEliminarSolMateriales = async(id:number)=>{
         const res = await eliminarSolMaterial(id);
        await ordenesTrabajoApi();
         alert(res.msj);
      }   

     const cargarPdf = (id:number) => {
      console.log(id);
      window.open(`/pdf-compra/${id}`,"_blank");
     }
     
    return (
        <>
             <div className='min-w-[70%] min-h-[60%] rounded-xl border border-gray-200'>
                    <div className="bg-gray-200 w-full h-9 flex items-center justify-center mb-2 rounded-t-lg">
                      <p className="">Listado de solicitud de materiales</p></div>
                   
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
                            <th>Estado de Entrega</th>
                            <th className='text-center'>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ordenesCompra.map((u) =>{ /*console.log("fila:", u);*/ return(
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
                                  <button className="btn btn-ghost btn-xs" onClick={() => { setventanaEmergente(!ventanaEmergente); cargarSolicitud(u.id);}}>Detalles</button>
                                  <button className="btn btn-ghost btn-xs" onClick={()=>metodoEliminarSolMateriales(u.id)}>Eliminar</button>
                                  <button className="btn btn-ghost btn-xs" onClick={()=>{  cargarPdf(u.numOrdenTrabajo?.id);}}>Ver pdf</button>
                                </td>
                              </tr>
                            </>)})}
            
                        </tbody>
            
                      </table>
                    </div>
                  </div>
            
                  <div className={`z-10 fixed  bg-transparent inset-0 flex items-center justify-center transition-opacity duration-300 ${ventanaEmergente ? "opacity-100" : "opacity-0 pointer-events-none"} `}>
                  <div className={`border border-gray-300 w-4/5 h-4/5 rounded-sm fixed  bg-white`}>
                    <div className='w-full h-[12%] flex justify-between p-5'>
                      <div>Detalle de orden de materiales</div>
                      <div onClick={() => { setventanaEmergente(!ventanaEmergente); console.log(ventanaEmergente) }} className='cursor-pointer'>❌</div>
                    </div>
                    <div className='w-full h-[76%] border-y border-gray-300 px-4 flex flex-col'>
                     <div className='flex'>
                      <div className='w-[33.33%] h-[100%]'>
                        <div className='w-[100%] h-[33.33%]'><p>N.Orden</p><input type="text" disabled={true} className='input'  value={detalleSol?.numOrden}/></div>
                        <div className='w-[100%] h-[33.33%] mt-5'><p>Fecha de remision</p><button disabled={true} type="button" onClick={() => { callyPpopover4.current?.showPopover() }} className="input input-border" id="cally4" style={{ anchorName: "--cally4" }}>
                           {detalleSol.fechaRemision?.split("T")[0]}
                            </button>
                            <div popover="auto" ref={callyPpopover4} className="dropdown bg-base-100 rounded-box shadow-lg" style={{ positionAnchor: "--cally4" }}>
                              <calendar-date className="cally" onchange={(e) =>{document.getElementById("cally4").innerText = e.target.value; }}>
                                <svg aria-label="Previous" className="fill-current size-4" slot="previous" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.75 19.5 8.25 12l7.5-7.5"></path></svg>
                                <svg aria-label="Next" className="fill-current size-4" slot="next" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="m8.25 4.5 7.5 7.5-7.5 7.5"></path></svg>
                                <calendar-month></calendar-month>
                              </calendar-date>
                            </div></div>
                      <div className='w-[100%] h-[33.34%]'>  <p>Estado</p><select   disabled={!habilitarEdicion} value={detalleSol?.estadoCompra?.estado} className="select" id="" 
                       onChange={(e)=>{setdetalleSol((prev)=>({...prev,estadoCompra:{estado: e.target.value}})); setconfirmarCambio(false);}}                                                                                 >
                <option disabled={true}>...</option>
                {estados.map((e) =>(e.estado === "PAUSADO" ?
                  <option  value={e.estado}>{e.estado}</option>
                :<option disabled={true} value={e.estado}>{e.estado}</option>))}
              </select></div>
                      </div>
                      <div className='w-[33.33%] h-[100%]'>
                        <div className='w-[100%] h-[33.33%]'><p>N.Orden de trabajo</p><select disabled={!habilitarEdicion} className="select" id="" value={nOrdenTrabajo} onChange={(e)=>{setnOrdenTrabajo(e.target.value); setconfirmarCambio(false);}}>
                            <option  disabled={true} defaultChecked={true}>...</option>
                          {ordenesTrabajo.map((u)=><>
                          <option value={u.NumOrden}>{u.NumOrden}</option>
                          </>)}
                          </select> </div>
                        <div className='w-[100%] h-[33.33%] mt-5'><p>Destino</p><input type="text" disabled={!habilitarEdicion} className='input' value={detalleSol?.Destino} onChange={(e)=>{setdetalleSol((prev)=>({...prev,Destino:e.target.value})); setconfirmarCambio(false);}}/></div>
                       
                      </div>
                      <div className='w-[33.34%] h-[100%]'>
                        <div className='w-[100%] h-[33.33%]'><p>Autoriza</p>  <select disabled={!habilitarEdicion} className="select" id="" value={detalleSol?.Autoriza} onChange={(e)=>{setdetalleSol((prev)=>({...prev,Autoriza:e.target.value})); setconfirmarCambio(false);}}>
                            <option  disabled={true} defaultChecked={true}>...</option>
                          {users.map((u)=><>
                          <option value={u.name}>{u.name}</option>
                          </>)}
                          </select></div>
                         <div className='w-[100%] h-[33.33%] mt-5'><p>Solicitante</p><input type="text" disabled={true} className='input' value={detalleSol.numOrdenTrabajo?.userSolicitante.name}/></div>
                      </div>
                     
                      </div>
                            <div className="overflow-x-auto mt-5">
                      <table className="table">
            
                        <thead >
                          <tr>
            
                            <th>Item</th>
                            <th>Cantidad</th>
                            <th>Caracteristica</th>
                            <th>Observacion</th>
                            <th>Estado</th>
                            
                          </tr>
                        </thead>
                        <tbody>
                         { detalleSol?.itemSolicitados.map((is)=>
                              <tr>
            
                                <td>
                                  {is.item}
                                </td>
                                <td>
                                 {is.cantidad}
                                  
                                </td>
                                <td>{is.caracteristica}</td>
                                <td>{is.Observacion}</td>
                                <td>{is.existencia? "EN STOCK":"NO DISPONIBLE"}</td>
                                
                              </tr>
                                       )}
            
                        </tbody>
            
                      </table>
                    </div>
                    </div>
                    <div className='w-full h-[12%] flex justify-between p-5'>
            
                      {habilitarEdicion 
                      ? <>
                      <button className='btn' onClick={actSolicitudMaterial} disabled={confirmarCambio}>Hecho</button>
                        <button className='btn' onClick={() => { sethabilitarEdicion(!habilitarEdicion); cargarSolicitud(detalleSol.id);setconfirmarCambio(true);}}>Cancelar</button></> 
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
