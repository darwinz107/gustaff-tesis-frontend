import React, { useEffect, useState } from 'react'
import type { ItemsPorGuardar } from '../models/itemsPorGuardar';
import { BuscarOrdenTrabajo } from './buscarOrdenTrabajo';
import type { LllenarDestino } from '../models/llenarDestino';
import { createItemsSolicitados, evaluarStock, filtrarInventario, getInventario } from '../../inventario/controller/inventario-api';
import { getUsers } from '../../user/controller/api/user-api';
import { crearOrdenCompra, getAllOrdenesTrabajoSinUso } from '../controller/ordenCompraApi';
import type { Inventarios } from '../../inventario/models/inventarios';
import type { CreateItemsSolicitados } from '../../inventario/models/createItemsSolocitados';



export const OrdenCompra = ({id}) => {
  const [comprasPorGenerar, setcomprasPorGenerar] = useState<ItemsPorGuardar[]>([]);
  const [items, setitems] = useState<CreateItemsSolicitados[]>([]);
  const [ventanaBuscarOrdenTrabajo, setventanaBuscarOrdenTrabajo] = useState(false);
  const [infoDestino, setinfoDestino] = useState<LllenarDestino>({userSolicitante:{name:""},id:0,NumOrden:"",Area:"",Codigo:"",Maquina:""});
  const [item, setitem] = useState("");
  const [buscarItem, setbuscarItem] = useState("");
  const [cantidad, setcantidad] = useState(0);
  const [caracteristica, setcaracteristica] = useState("");
  const [observacion, setobservacion] = useState("");
  const [users, setusers] = useState<{name:string}[]>([]);
  const [autoriza, setautoriza] = useState("");
  const [destino, setdestino] = useState("");
  const [ventanaEmergente, setventanaEmergente] = useState(false); 
  const [inventarios, setinventarios] = useState<Inventarios[]>([])
  

   const metodoInventarios = async() =>{
      const resInv = await getInventario();
      setinventarios(resInv);
    }

  useEffect(() => {
    const getAllUsers = async () => {
        const res = await getUsers();
        setusers(res);
      } ;
    getAllUsers(); 
    console.log(id);
if(id !== null){
   const preCargarOrdenes = async() =>{
           const ordenesApi = await getAllOrdenesTrabajoSinUso();
           const primerOT = ordenesApi.filter((o)=>o.id != id);
           setinfoDestino(primerOT[0]);
           console.log("ordenesApi");
           console.log(ordenesApi);
         }
preCargarOrdenes();
   }
    metodoInventarios();
    
  }, []);
  



  useEffect(() => {
    if(buscarItem != ""){
    const funcionBuscarItem = async()=>{
        const res = await filtrarInventario(buscarItem);
       
        setinventarios(res);
    }
    funcionBuscarItem();}else{
      const funcionRegresarInventario = async()=>{
       await metodoInventarios();
    }
  funcionRegresarInventario();
  }
  }, [buscarItem]);

  const funcionAgregarItems = async() =>{

    if(cantidad !=0){
 setitems((prev)=>[...prev,{item:item,cantidad:cantidad,caracteristica:caracteristica,Observacion:observacion}]);
    
    const res = await evaluarStock({item:item,cantidad:cantidad});
   if(res.validate){res.arr.map((r)=>{
setcomprasPorGenerar((prev)=>[...prev,{cantidad:r.cantidad,item:item,caracteristica:caracteristica,observacion:observacion,estadoStock:r.estado,validate:r.validate}]);
    })}
    else{
    setcomprasPorGenerar((prev)=>[...prev,{cantidad:cantidad,item:item,caracteristica:caracteristica,observacion:observacion,estadoStock:"Por comprar",validate:res.validate}]);
    }
    setcantidad(0);
    setitem("");
    setcaracteristica("");
    setobservacion("");
    }else{
    alert("Debe agregar una cantidad");
    }

 
  }

  
  const funcionEliminarItems = (id:number) =>{
    const newArray = comprasPorGenerar.filter((item, index) => index !== id);
    setcomprasPorGenerar(newArray);
     const newArrayItems = items.filter((item, index) => index !== id);
     setitems(newArrayItems);
  }

  const crearYGenerarOrdenCompra = async() => {
 
    try {
       const resOrdenCompra = await crearOrdenCompra({
      Autoriza: autoriza,
      ordenTrabajoId: infoDestino.id,
      Destino: destino,
      items:items
    });
console.log(resOrdenCompra.msj);
alert(resOrdenCompra.msj);

    if(resOrdenCompra.validate){
window.open(`/pdf-compra/${infoDestino.id}`,"_blank");

    }

    } catch (error) {
      console.error("Error creating order and items:", error);
    }
  
  }
  
  return (
     <>
     <div className='w-full min-h-screen overflow-auto'>
        <div className='w-full h-[10%] flex items-center justify-center bg-white '>
            <button className='btn' onClick={()=>setventanaBuscarOrdenTrabajo(!ventanaBuscarOrdenTrabajo)}>Asignar orden de trabajo</button>
            
        </div>
        
        <div className='w-full h-[30%] bg-gray-100 rounded-xl shadow-md p-4 mb-6'>
        <div className=' h-[15%] mb-4'>
           <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Destino de orden</h2> 
        </div>
        <div className='w-full h-[85%] flex flex-row'>
         <div className='w-[33.33%] h-[80%] pl-2'>
            <div className='w-[100%] h-[33.33%] flex flex-row'><p className='min-w-[17%]'>Solicitante</p><input type="text"  className='input ml-10 mr-3' value={infoDestino.userSolicitante.name}  disabled={true}/></div>
            <div className='w-[100%] h-[33.34%] flex flex-row'><p className='min-w-[17%]'>Area</p><input   type="text"  className='input ml-1' value={infoDestino.Area} disabled={true}/></div>
            <div className='w-[100%] h-[33.34%] flex flex-row'><p className='min-w-[17%]'>Destino</p><input  type="text"  className='input ml-5' onChange={(e)=>setdestino(e.target.value)}/></div>
          </div>
            <div className='w-[33.33%] h-[80%] '>
            <div className='w-[100%] h-[33.33%] flex flex-row'><p className='min-w-[17%]'>Autoriza</p>  <select defaultValue={'...'} className="select mr-2 ml-3" id="" onChange={(e)=>setautoriza(e.target.value)}>
                <option disabled={true}>...</option>
                {users.map((m) => <>
                  <option value={m.name}>{m.name}</option>
                </>)}
              </select></div>
            <div className='w-[100%] h-[33.34%] flex flex-row'><p className='min-w-[17%]'>Codigo</p><input   type="text"  className='input ml-1' value={infoDestino.Codigo} disabled={true}/></div>
            
          </div>
          <div className='w-[33.34%] h-[80%] pr-2'>
            <div className='w-[100%] h-[33.33%] flex flex-row'><p className='min-w-[17%]'>N.Orden</p><input type="text"  className='input ml-5'  value={infoDestino.NumOrden} disabled={true}/></div>
            <div className='w-[100%] h-[33.34%] flex flex-row'><p className='min-w-[17%]'>Maquina</p><input   type="text"  className='input ml-4' value={infoDestino.Maquina} disabled={true}/></div>
           
          </div>
         </div>
        </div>
             <div className='w-full min-h-[25%] bg-gray-100 rounded-xl shadow-md p-4 mb-6'>
        <div className=' min-h-[20%]'>
            <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Agregar items</h2>    
        </div>
        <div className='w-full h-[80%] mt-4 text-center'>
         <div className='w-full h-[80%] pl-2 flex flex-row mb-4'>
            <div className='w-[100%]  flex flex-col mr-2'><p className='min-w-[17%]'>Cantidad</p><input  type="text"  className='input' value={cantidad}  onChange={(e)=>setcantidad(e.target.value)}/></div>
            <div className='w-[100%]  flex flex-col mr-2'>
              <p className='min-w-[17%]'>Item</p>
              <div className="relative w-full">
  <input
    type="text"
    className="input input-bordered w-full pr-10"
    value={item}
    onChange={(e) => setitem(e.target.value)}
  />

  <button
    type="button"
    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
    onClick={()=>setventanaEmergente(!ventanaEmergente)}
  >
    🔎
  </button>
</div>
</div>
            <div className='w-[100%]  flex flex-col mr-2'><p className='min-w-[17%]'>Caracteristica</p><input   type="text"  className='input' value={caracteristica}  onChange={(e)=>setcaracteristica(e.target.value)}/></div>
            <div className='w-[100%]  flex flex-col mr-2'><p className='min-w-[17%]'>Observacion</p><input  type="text"  className='input' value={observacion} onChange={(e)=>setobservacion(e.target.value)} /></div>
          </div>
          <button className='btn' onClick={funcionAgregarItems}>Agregar a compras</button>
         </div>
        
        </div>
        
        <div className='w-full h-[40%] bg-gray-100 rounded-xl shadow-md p-4 mb-6'>
          <div className=' min-h-[10%]'>
            <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Compras</h2>  
        </div>
        <div className='w-full h-[70%] mt-4 text-center'>
         <div className='w-full h-[90%] pl-2 flex flex-row mb-4'>
            <div className="overflow-x-auto w-full h-[100%] m-2">
          <table className="table">

            <thead >
              <tr>

                <th>Cantidad</th>
                <th>Item</th>
                <th>Caracteristica</th>
                <th>Observacion</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {comprasPorGenerar.map((u,i) =>
                <>
                  <tr>

                    <td>
                      {u.cantidad}
                    </td>
                    <td>
                      {u.item}

                    </td>
                    <td>{u.caracteristica}</td>
                    <td>{u.observacion}</td>
                    <td>{u.estadoStock}</td>
                    <td>
                      
                      <button className="btn btn-ghost btn-xs" onClick={()=>funcionEliminarItems(i)}>Eliminar</button>
                    </td>
                  </tr>
                </>)}

            </tbody>

          </table>
        </div>
          </div>
          <div className=' text-center'><button className='btn' onClick={crearYGenerarOrdenCompra}>Generar orden de compra</button></div>
         </div>
        </div>
     </div>

       <div className={`z-10 fixed  bg-transparent inset-0 flex items-center justify-center transition-opacity duration-300 ${ventanaBuscarOrdenTrabajo ? "opacity-100" : "opacity-0 pointer-events-none"} `}>
           <div className={`border border-gray-300 w-4/5 h-4/5 rounded-sm fixed  bg-white`}>
           <BuscarOrdenTrabajo setinfoDestino={setinfoDestino} ventanaBuscarOrdenTrabajo={ventanaBuscarOrdenTrabajo} setventanaBuscarOrdenTrabajo={setventanaBuscarOrdenTrabajo}></BuscarOrdenTrabajo>
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
                        <div className='flex'> <p>Buscar: </p> <input className='input ml-2' type="text" onChange={(e)=>setbuscarItem(e.target.value)}/></div>
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
              {inventarios.map((i) =>
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
                </>)}

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
