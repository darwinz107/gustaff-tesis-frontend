import { useEffect, useState } from "react"
import { BuscarOrdenCompra } from "./BuscarOrdenCompra";
import type { InfoPdfCompra } from "../../orden-de-compra/models/infoPdfCompra";
import { ordenCompraById } from "../../orden-de-compra/controller/ordenCompraApi";
import { getUsers } from "../../user/controller/api/user-api";
import type { Users } from "../../admin/models/users";
import { createActaSalidaApi } from "../controller/actaSalida-api";


export const CrearActaSalida = () => {
  //const [sinOrden, setsinOrden] = useState(false);
  const [conOrden, setconOrden] = useState(true);
  const [ventanaBuscarOrdenTrabajo, setventanaBuscarOrdenTrabajo] = useState(false);
  const [ventanaEmergente, setventanaEmergente] = useState(false);
  const [solicitudMaterial, setsolicitudMaterial] = useState<InfoPdfCompra>({itemSolicitados:[]});
  const [users, setusers] = useState<Users[]>([]);
  const [entrega, setentrega] = useState(0);
  const [observacion, setobservacion] = useState("");
  //const [idSolMaterial, setidSolMaterial] = useState<number>(0);

 const cargarInfoSolMaterial = async(id:number) =>{
        const res = await ordenCompraById(id);
        setsolicitudMaterial(res);
    }

    const generarActaSalida = async() =>{
     
      if(solicitudMaterial.id != null ||solicitudMaterial.id != undefined){
       const res = await createActaSalidaApi(solicitudMaterial.id);
       if(res.validate){
         alert(res.msj);
       }
      }else{
        alert("Debe llenar la informacion necesaria antes de generar una acta de salida!")
      }

    }

    useEffect(() => {
       const getAllUsers = async () => {
             const res = await getUsers();
             setusers(res);
           } ;
         getAllUsers(); 
    }, []);
    

  

  return (
     <>
         <div className='w-full h-[85%] '>
            <div className='w-full h-[10%] flex items-center justify-center bg-white '>
                <button className='btn' disabled={!conOrden}onClick={()=>setventanaBuscarOrdenTrabajo(!ventanaBuscarOrdenTrabajo)}>Asignar orden de compra</button>
                
            </div>
            
            <div className='w-full h-[30%] bg-gray-100 rounded-xl shadow-md p-4 mb-6'>
            <div className=' h-[15%] mb-4'>
               <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Informacion de orden de material</h2> 
            </div>
            <div className='w-full h-[85%] flex flex-row'>
             <div className='w-[33.33%] h-[80%] pl-2'>
                <div className='w-[100%] h-[33.33%] flex flex-row'><p className='min-w-[17%]'>Solicitante</p><input type="text"  className='input ml-10 mr-3' value={solicitudMaterial?.numOrdenTrabajo?.userSolicitante?.name}  disabled={true}/></div>
                <div className='w-[100%] h-[33.34%] flex flex-row'><p className='min-w-[17%]'>Area</p><input   type="text"  className='input ml-1 mr-2' value={solicitudMaterial?.numOrdenTrabajo?.Area} disabled={true}/></div>
                <div className='w-[100%] h-[33.34%] flex flex-row'><p className='min-w-[17%]'>Destino</p><input  type="text"  className='input ml-5 mr-2' disabled={true} value={solicitudMaterial?.Destino}/></div>
              </div>
                <div className='w-[33.33%] h-[80%] '>
                <div className='w-[100%] h-[33.33%] flex flex-row'><p className='min-w-[17%]'>Entrega</p>  <select value={entrega} className="select mr-2 ml-3" id="" disabled={!conOrden} onChange={(e)=>setentrega(e.target.value)}>
                    <option value={0} disabled={true}>...</option>
                    {users.map((m) => <>
                      <option value={m.id}>{m.name}</option>
                    </>)}
                  </select></div>
                <div className='w-[100%] h-[33.34%] flex flex-row'><p className='min-w-[17%]'>Codigo</p><input   type="text"  className='input ml-1' value={solicitudMaterial?.numOrdenTrabajo?.Codigo} disabled={true}/></div>
                <div className='w-[100%] h-[33.34%] flex flex-row'><p className='min-w-[17%] mr-5'>Observacion</p><input  type="text"  className='input ml-5' disabled={!conOrden} onChange={(e)=>setobservacion(e.target.value)}/></div>
              </div>
              <div className='w-[33.34%] h-[80%] pr-2'>
                <div className='w-[100%] h-[33.33%] flex flex-row'><p className='min-w-[17%]'>Recibe</p><input type="text"  className='input ml-5'  value={solicitudMaterial?.numOrdenTrabajo?.userSolicitante?.name} disabled={true}/></div>
                <div className='w-[100%] h-[33.34%] flex flex-row'><p className='min-w-[17%]'>Maquina</p><input   type="text"  className='input ml-4' value={solicitudMaterial?.numOrdenTrabajo?.Maquina} disabled={true}/></div>
               <div className='w-[100%] h-[33.34%] flex flex-row'><p className='min-w-[17%] mr-5'>N.Orden</p><input  type="text"  className='input ml-5' disabled={true} value={solicitudMaterial?.numOrden}/></div>
              </div>
             </div>
            </div>
                 <div className='w-full min-h-[25%] bg-gray-100 rounded-xl shadow-md p-4 mb-6'>
            <div className=' min-h-[20%]'>
                <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Agregar items</h2>    
            </div>
            <div className='w-full h-[80%] mt-4 text-center'>
             <div className='w-full h-[80%] pl-2 flex flex-row mb-4'>
                <div className='w-[100%]  flex flex-col mr-2'><p className='min-w-[17%]'>Cantidad</p><input disabled={conOrden}  type="text"  className='input'  /*onChange={(e)=>setcantidad(e.target.value)}*//></div>
                <div className='w-[100%]  flex flex-col mr-2'>
                  <p className='min-w-[17%]'>Item</p>
                  <div className="relative w-full">
      <input disabled={conOrden}
        type="text"
        className="input input-bordered w-full pr-10"
        /*value={item}
        onChange={(e) => setitem(e.target.value)}*/
      />
    
      <button
      disabled={conOrden}
        type="button"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
        onClick={()=>setventanaEmergente(!ventanaEmergente)}
      >
        {conOrden ?'': '🔎'}
      </button>
    </div>
    </div>
                <div className='w-[100%]  flex flex-col mr-2'><p className='min-w-[17%]'>Destino</p><input disabled={conOrden}   type="text"  className='input'  /*onChange={(e)=>setcaracteristica(e.target.value)}*//></div>
                <div className='w-[100%]  flex flex-col mr-2'><p className='min-w-[17%]'>Observacion</p><input disabled={conOrden}  type="text"  className='input' /*onChange={(e)=>setobservacion(e.target.value)}*/ /></div>
              </div>
            
             {
                conOrden ? (<button className='btn' onClick={()=>{setconOrden(!conOrden); setsolicitudMaterial({numOrden:"",numOrdenTrabajo:{Area:"",userSolicitante:{name:""},Maquina:"",Codigo:""},Destino:"",itemSolicitados:[]});setentrega(0);}}>Activar</button>):
                <><button className='btn' /*onClick={funcionAgregarItems}*/>Agregar a compras</button>
                <button className='btn' onClick={()=>setconOrden(!conOrden)}>Cancelar</button></>
             } 
             </div>
            
           </div>
            
            <div className='w-full h-[40%] bg-gray-100 rounded-xl shadow-md p-4 mb-6'>
              <div className=' min-h-[10%]'>
                <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Salidas</h2>  
             </div>
            <div className='w-full h-[70%] mt-4 text-center'>
             <div className='w-full h-[90%] pl-2 flex flex-row mb-4'>
                <div className="overflow-x-auo w-full h-[100%] m-2">
              <table className="table">
    
            {conOrden ?<><thead >
                  <tr>
    
                    <th>Cantidad</th>
                    <th>Item</th>
                    <th>Caracteristica</th>
                    <th>Observacion</th>
                    
                    
                  </tr>
                </thead>
                <tbody>
                  {solicitudMaterial?.itemSolicitados?.map((u,i) =>( u.existencia ? 
                    <>
                      <tr>
    
                        <td>
                          {u.cantidad}
                        </td>
                        <td>
                          {u.item}
    
                        </td>
                        <td>{u.caracteristica}</td>
                        <td>{u.Observacion}</td>
 
                      </tr>
                    </>:<></>))}
    
                </tbody></>:
                <>
                                <thead >
                  <tr>
    
                    <th>Cantidad</th>
                    <th>Item</th>
                    <th>Caracteristica</th>
                    <th>Observacion</th>
                    
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {/*solicitudMaterial?.itemSolicitados.map((u,i) =>
                    <>
                      <tr>
    
                        <td>
                          {u.cantidad}
                        </td>
                        <td>
                          {u.item}
    
                        </td>
                        <td>{u.caracteristica}</td>
                        <td>{u.Observacion}</td>
                        
                        <td>
                          
                          <button className="btn btn-ghost btn-xs" onClick={()=>funcionEliminarItems(i)}>Eliminar</button>
                        </td>
                      </tr>
                    </>)*/}
    
                </tbody>
                </>}
    
              </table>
            </div>
              </div>
              <div className=' text-center'><button className='btn' onClick={generarActaSalida}>Generar acta de salida</button></div>
             </div>
            </div>
         </div>
    
           <div className={`z-10 fixed  bg-transparent inset-0 flex items-center justify-center transition-opacity duration-300 ${ventanaBuscarOrdenTrabajo ? "opacity-100" : "opacity-0 pointer-events-none"} `}>
               <div className={`border border-gray-300 w-4/5 h-4/5 rounded-sm fixed  bg-white`}>
              <BuscarOrdenCompra setidSolMaterial={cargarInfoSolMaterial} setventanaBuscarOrdenTrabajo={setventanaBuscarOrdenTrabajo} ventanaBuscarOrdenTrabajo={ventanaBuscarOrdenTrabajo}></BuscarOrdenCompra>
               </div>
               </div>
                 <div className={`z-10 fixed  bg-transparent inset-0 flex items-center justify-center transition-opacity duration-300 ${ventanaEmergente ? "opacity-100" : "opacity-0 pointer-events-none"} `}>
                      <div className={`border border-gray-300 w-2/5 h-2/5 rounded-sm fixed  bg-white`}>
                        <div className='w-full h-[12%] flex justify-between p-5 mb-2'>
                          <div>Listado de items</div>
                          <div onClick={() => { setventanaEmergente(!ventanaEmergente); console.log(ventanaEmergente) }} className='cursor-pointer'>❌</div>
                        </div>
                        <div className='w-full h-[76%] border-y border-gray-300 px-4 flex flex-col'>
                          <div className='flex justify-end h-[15%] w-full mt-2'>
                            <div className='flex'> <p>Buscar: </p> <input className='input ml-2' type="text" /*onChange={(e)=>setbuscarItem(e.target.value)}*//></div>
                          </div>
                         <div className="overflow-x-auto w-full h-[85%] m-2">
              <table className="table">
    
                <thead >
                  <tr>
    
                    
                    <th>Item</th>
                    <th>Stock</th>
      
                    <th>Accion</th>
                  </tr>
                </thead>
                <tbody>
                  {/*inventarios.map((i) =>
                    <>
                      <tr>
    
                        <td>
                          {i.nombre}
                        </td>
                        <td>
                          {i.stock}
    
                        </td>
                        
                        <td>
                          
                          <button className="btn btn-ghost btn-xs" onClick={()=>{setitem(i.nombre); setventanaEmergente(false);}}>Seleccionar</button>
                        </td>
                      </tr>
                    </>)*/}
    
                </tbody>
    
              </table>
            </div>
                        </div>
                        <div className='w-full h-[12%] flex justify-between p-5'>
                
                  
                        </div>
                      </div>
                      </div>
         </>
  )
}
