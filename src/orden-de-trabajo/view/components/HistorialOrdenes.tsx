
import React, { useEffect, useRef, useState } from 'react'
import { areas, getAllCategorias, getAllCodByArea, getAllMaquinasByCod, getAllOrdenesTrabajo, getAllTipoTrabajo, getOrdenTrabajoById, getOrdenTrabajoBySolicitante } from '../../controller/api/orden-api';
import type { OrdenesTrabajo } from '../../models/ordenesTrabajo';
import type { Maquina } from '../../models/maquinas';
import { getUsers } from '../../../user/controller/api/user-api';
import type { Users } from '../../../admin/models/users';

export const HistorialOrdenes = () => {

   const [ordenesTrabajo, setordenesTrabajo] = useState<OrdenesTrabajo[]>([]);
   const [validarCambio, setvalidarCambio] = useState(false);
   const [habilitarEdicion, sethabilitarEdicion] = useState(false);
   const callyPpopover4 = useRef(null);
   const callyPpopover5 = useRef(null);
    const [ventanaEmergente, setventanaEmergente] = useState(false);   
     const [ventanaCrearUsuario, setventanaCrearUsuario] = useState(false);
    const [filtrarxSolicitante, setfiltrarxSolicitante] = useState("");
    const [ordenTrabajoxUser, setordenTrabajoxUser] = useState<OrdenesTrabajo>({});
    const [areasAll, setareasAll] = useState<{
    nombre: string;}[]>([]);
    const [codigossAll, setcodigossAll] = useState<{
    cod: string;}[]>([]);
    const [maquinasAll, setmaquinasAll] = useState<Maquina[]>([]);
    const [selectArea, setselectArea] = useState("");
    const [selectCodigo, setselectCodigo] = useState("");
    const [selectMaquina, setselectMaquina] = useState("");
    const [categorias, setcategorias] = useState<{nombre:string}[]>([]);
    const [tiposTrabajo, settiposTrabajo] = useState<{tipo:string}[]>([]);
    const [selectCategoria, setselectCategoria] = useState("");
    const [selectTipoTrabajo, setselectTipoTrabajo] = useState("");
    const [users, setusers] = useState<Users[]>([])
    const [confirmarCambio, setconfirmarCambio] = useState(false);
    const [salto, setsalto] = useState(false);



    
    
     useEffect(() => {
      const ordenesTrabajoApi  = async() =>{
       const res = await getAllOrdenesTrabajo();
       console.log("res ordenes trabajo: ",res);
       setordenesTrabajo(res);
      }
      ordenesTrabajoApi();

      const areasApi = async() =>{
       const res = await areas();
       setareasAll(res);
       
      }
      areasApi();

      const parametrosApi = async() =>{
        const res1 = await getAllCategorias();
        setcategorias(res1);
        const res2 = await getAllTipoTrabajo();
        settiposTrabajo(res2);

        const res3 = await getUsers();
        setusers(res3);
      }
      parametrosApi();
      
     }, []);

     useEffect(() => {

      console.log("selectArea***************: ",selectArea);
      console.log("selectCodigo*************: ",selectCodigo);

      if(ventanaEmergente === true){
         
         const getCodigosApi = async() =>{
           const res = await getAllCodByArea(selectArea);
           console.log("res codigos by area: ",res);
           setcodigossAll(res);

           
         }

          getCodigosApi();

          const getMaquinasApi = async() =>{
           const res = await getAllMaquinasByCod(selectCodigo);
           console.log("res maquinas by cod: ",res);
           setmaquinasAll(res);
          }
          getMaquinasApi();
      }
       
     }, [selectArea,selectCodigo,ventanaEmergente])
   
     

     useEffect(() => {
      const ejecutarFiltroxSolicitante = async() =>{
        if(filtrarxSolicitante === ""){
          const res = await getAllOrdenesTrabajo();
          setordenesTrabajo(res);
        }else{
          const res = await getOrdenTrabajoBySolicitante(filtrarxSolicitante);
          setordenesTrabajo(res);
        }


      }
      ejecutarFiltroxSolicitante();
     },[filtrarxSolicitante]);
     
    const asignarSolicitantexOrden = async(id:number) =>{
      console.log("id orden trabajo: ",id);
      const res = await getOrdenTrabajoById(id);
      console.log("res orden trabajo by id: ",res); 
      setordenTrabajoxUser(res);
     }
     

     const cargarPdf = (id:number) => {
      window.open(`/pdf/${id}`,"_blank");
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
                        <div className='flex'> <p>Buscar por solicitante: </p> <input className='input ml-2' type="text" onChange={(e)=>setfiltrarxSolicitante(e.target.value)}/></div>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="table">
            
                        <thead >
                          <tr>
            
                            <th>N.Orden</th>
                            <th>Fecha final</th>
                            <th>Solicitante</th>
                            <th>Estado</th>
                            <th className='text-center'>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ordenesTrabajo.map((u) =>
                            <>
                              <tr>
            
                                <td>
                                  {u.NumOrden}
                                </td>
                                <td>
                                  {u.fechaFinal}
            
                                </td>
                                <td>{u.userSolicitante.name}</td>
                                <td>{u.estadoTrabajo.estado}</td>
                                <td>
                                  <button className="btn btn-ghost btn-xs" onClick={() => { asignarSolicitantexOrden(u.id); setventanaEmergente(!ventanaEmergente); setselectArea(u.Area); setselectCodigo(u.Codigo);}}>Detalles</button>
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
                      <div onClick={() => { setventanaEmergente(!ventanaEmergente); setordenTrabajoxUser({}); console.log(ventanaEmergente) }} className='cursor-pointer'>❌</div>
                    </div>
                    <div className='w-full h-[76%] border-y border-gray-300 px-4 flex'>
                      <div className='w-[33.33%] h-[100%]'>
                        <div className='w-[100%] h-[20%]'><p>N.Orden</p><input type="text" disabled={true} className='input' value={ordenTrabajoxUser.NumOrden} onChange={(e)=>setordenTrabajoxUser((prev)=>({...prev,NumOrden:e.target.value}))}/></div>
                        <div className='w-[100%] h-[20%]'><p>Fecha de inicio</p><button disabled={!habilitarEdicion} type="button" onClick={() => { callyPpopover4.current?.showPopover() }} className="input input-border" id="cally4" style={{ anchorName: "--cally4" }}>
                           {ordenTrabajoxUser.fechaInicio}
                            </button>
                            <div popover="auto" ref={callyPpopover4} className="dropdown bg-base-100 rounded-box shadow-lg" style={{ positionAnchor: "--cally4" }}>
                              <calendar-date className="cally" onchange={(e) =>{document.getElementById("cally4").innerText = e.target.value; setordenTrabajoxUser((prev)=>({...prev,fechaInicio:e.target.value})); setconfirmarCambio(true);}}>
                                <svg aria-label="Previous" className="fill-current size-4" slot="previous" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.75 19.5 8.25 12l7.5-7.5"></path></svg>
                                <svg aria-label="Next" className="fill-current size-4" slot="next" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="m8.25 4.5 7.5 7.5-7.5 7.5"></path></svg>
                                <calendar-month></calendar-month>
                              </calendar-date>
                            </div></div>
                        <div className='w-[100%] h-[20%]'><p>Fecha de finalizacion</p><button disabled={!habilitarEdicion} type="button" onClick={() => { callyPpopover4.current?.showPopover() }} className="input input-border" id="cally5" style={{ anchorName: "--cally5" }}>
                           {ordenTrabajoxUser.fechaFinal}
                            </button>
                            <div popover="auto" ref={callyPpopover5} className="dropdown bg-base-100 rounded-box shadow-lg" style={{ positionAnchor: "--cally5" }}>
                              <calendar-date className="cally" onchange={(e) =>{document.getElementById("cally5").innerText = e.target.value; setordenTrabajoxUser((prev)=>({...prev,fechaFinal:e.target.value})); setconfirmarCambio(true);}}>
                                <svg aria-label="Previous" className="fill-current size-4" slot="previous" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.75 19.5 8.25 12l7.5-7.5"></path></svg>
                                <svg aria-label="Next" className="fill-current size-4" slot="next" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="m8.25 4.5 7.5 7.5-7.5 7.5"></path></svg>
                                <calendar-month></calendar-month>
                              </calendar-date>
                            </div></div>
                        <div className='w-[100%] h-[20%]'><p>Hora de inicio</p><input  type="time" disabled={!habilitarEdicion} className='input' value={ordenTrabajoxUser.HoraInicio} onChange={(e)=>{setordenTrabajoxUser((prev)=>({...prev,HoraInicio:e.target.value}));setconfirmarCambio(true);}}/></div>
                        <div className='w-[100%] h-[20%]'><p>Hora de finalizacion</p><input  type="time" disabled={!habilitarEdicion} className='input' value={ordenTrabajoxUser.HoraFinal} onChange={(e)=>{setordenTrabajoxUser((prev)=>({...prev,HoraFinal:e.target.value}));setconfirmarCambio(true);}}/></div>
                      </div>
                      <div className='w-[33.33%] h-[100%]'>
                        <div className='w-[100%] h-[20%]'><p>Area</p><select   disabled={!habilitarEdicion} defaultValue={ordenTrabajoxUser.Area} className="select" id="" onChange={(e) => {
                          setordenTrabajoxUser((prev)=>({...prev,Area:e.target.value}));setconfirmarCambio(true);
              }}>
                <option disabled={true}>...</option>
                {areasAll.map((a) => <>
                  <option value={a.nombre}>{a.nombre}</option>
                </>)}
              </select></div>
                        <div className='w-[100%] h-[20%]'><p>Codigo</p><select   disabled={!habilitarEdicion} defaultValue={ordenTrabajoxUser.Codigo} className="select" id="" onChange={(e) => {
                         setordenTrabajoxUser((prev)=>({...prev,Codigo:e.target.value}));setconfirmarCambio(true);
              }}>
                <option disabled={true}>...</option>
                {codigossAll.map((c) => <>
                  <option value={c.cod}>{c.cod}</option>
                </>)}
              </select></div>
                        <div className='w-[100%] h-[20%]'><p>Maquina</p><select   disabled={!habilitarEdicion} defaultValue={ordenTrabajoxUser.Maquina} className="select" id="" onChange={(e) => {
               setordenTrabajoxUser((prev)=>({...prev,Maquinaea:e.target.value})); setconfirmarCambio(true);
              }}>
                <option disabled={true}>...</option>
                {maquinasAll.map((m) => <>
                  <option value={m.nombre}>{m.nombre}</option>
                </>)}
              </select></div>
                        <div className='w-[100%] h-[20%]'><p>Especificacion</p><input   type="text" disabled={!habilitarEdicion} className='input' value={ordenTrabajoxUser.EspecificacionMaquina} onChange={(e)=>{setordenTrabajoxUser((prev)=>({...prev,HoraFinal:e.target.value})); setconfirmarCambio(true);}}/></div>
                       <div className='w-[100%] h-[20%]'><p>Categoria</p><select   disabled={!habilitarEdicion} defaultValue={ordenTrabajoxUser.Categoria} className="select" id="" onChange={(e) => {
               setordenTrabajoxUser((prev)=>({...prev,Categoria:e.target.value})); setconfirmarCambio(true);
              }}>
                <option disabled={true}>...</option>
                {categorias.map((ca) => <>
                  <option value={ca.nombre}>{ca.nombre}</option>
                </>)}
              </select></div>
               
                      </div>
                      <div className='w-[33.34%] h-[100%]'>
                       <div className='w-[100%] h-[20%]'><p>Tipo de trabajo</p><select   disabled={!habilitarEdicion} defaultValue={ordenTrabajoxUser.TipoTrabajo} className="select" id="" onChange={(e) => {
               setordenTrabajoxUser((prev)=>({...prev,TipoTrabajo:e.target.value})); setconfirmarCambio(true);
              }}>
                <option disabled={true}>...</option>
                {tiposTrabajo.map((tp) => <>
                  <option value={tp.tipo}>{tp.tipo}</option>
                </>)}
              </select></div>
                        <div className='w-[100%] h-[20%]'><p>Descripcion</p><input   type="text" disabled={!habilitarEdicion} className='input' value={ordenTrabajoxUser.DescripcionTrabajo} onChange={(e)=>{setordenTrabajoxUser((prev)=>({...prev,DescripcionTrabajo:e.target.value})); setconfirmarCambio(true);}}/></div>
                        <div className='w-[100%] h-[20%]'><p>Solicitante</p><select   disabled={!habilitarEdicion} defaultValue={ordenTrabajoxUser.userSolicitante?.name ?? ""} className="select" id="" onChange={(e) => {
               setordenTrabajoxUser((prev)=>({...prev,userSolicitante:e.target.value})); setconfirmarCambio(true);
              }}>
                <option disabled={true}>...</option>
                {users.map((u) => <>
                  <option value={u.name}>{u.name}</option>
                </>)}
              </select></div>
                        <div className='w-[100%] h-[20%]'><p>Receptor</p><select   disabled={!habilitarEdicion} defaultValue={ordenTrabajoxUser.userReceptor?.name ?? ""} className="select" id="" onChange={(e) => {
               setordenTrabajoxUser((prev)=>({...prev,userReceptor:e.target.value})); setconfirmarCambio(true);
              }}>
                <option disabled={true}>...</option>
                {users.map((u) => <>
                  <option value={u.name}>{u.name}</option>
                </>)}
              </select></div>
                        <div className='w-[100%] h-[20%]'><p>Tecnico</p><select   disabled={!habilitarEdicion} defaultValue={ordenTrabajoxUser.userTecnico?.name ?? ""} className="select" id="" onChange={(e) => {
               setordenTrabajoxUser((prev)=>({...prev,userTecnico:e.target.value})); setconfirmarCambio(true);
              }}>
                <option disabled={true}>...</option>
                {users.map((u) => <>
                  <option value={u.name}>{u.name}</option>
                </>)}
              </select></div>
                      </div>
                    </div>
                    <div className='w-full h-[12%] flex justify-between p-5'>
            
                      {habilitarEdicion 
                      ? <>
                      <button className='btn' disabled={!confirmarCambio}>Hecho</button>
                        <button className='btn' onClick={()=>{asignarSolicitantexOrden(ordenTrabajoxUser.id);  sethabilitarEdicion(!habilitarEdicion); setconfirmarCambio(false);}}>Cancelar</button></> 
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
