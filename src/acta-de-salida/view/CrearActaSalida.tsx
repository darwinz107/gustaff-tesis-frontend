import { useEffect, useState } from "react"
import { BuscarOrdenCompra } from "./BuscarOrdenCompra";
import type { InfoPdfCompra } from "../../orden-de-compra/models/infoPdfCompra";
import { getAllSolicitudes, ordenCompraById } from "../../orden-de-compra/controller/ordenCompraApi";
import { getUsers, getUsersGerenciaYCoordinacion } from "../../user/controller/api/user-api";
import type { Users } from "../../admin/models/users";
import { createActaSalidaApi, createActaSalidaSinOrdenApi } from "../controller/actaSalida-api";
import type { BuscarSolMaterial } from "../../orden-de-compra/models/buscarSolMaterial";
import type { Inventarios } from "../../inventario/models/inventarios";
import { getInventario } from "../../inventario/controller/inventario-api";
import type { CreateItemsSolicitados } from "../../inventario/models/createItemsSolocitados";
import type { ItemSalidaSinSM } from "../models/itemSalidaSinSM";


export const CrearActaSalida = () => {
  //const [sinOrden, setsinOrden] = useState(false);
  const [conOrden, setconOrden] = useState(true);
  const [ventanaBuscarOrdenTrabajo, setventanaBuscarOrdenTrabajo] = useState(false);
  const [ventanaEmergente, setventanaEmergente] = useState(false);
  const [solicitudMaterial, setsolicitudMaterial] = useState<InfoPdfCompra>({itemSolicitados:[]});
  const [agregarItems, setagregarItems] = useState<ItemSalidaSinSM[]>([])
  const [users, setusers] = useState<Users[]>([]);
  const [entregan, setentregan] = useState<Users[]>([]);
  const [entrega, setentrega] = useState(0);
  const [observacion, setobservacion] = useState("");
  const [actaSalida, setactaSalida] = useState(false);
  //const [idSolMaterial, setidSolMaterial] = useState<number>(0);
  const [ordenes, setordenes] = useState<BuscarSolMaterial[]>([]);
  const [erroresEntrega, seterroresEntrega] = useState("");
  const [showSuccess, setshowSuccess] = useState(false);
  const [showError, setshowError] = useState(false);
  const [mensajeError, setmensajeError] = useState("");
  const [cantidad, setcantidad] = useState("");
  const [item, setitem] = useState("");
  const [caracteristica, setcaracteristica] = useState("");
  const [observacion2, setobservacion2] = useState("");
  const [recibe, setrecibe] = useState(0);
  const [descripcion, setdescripcion] = useState("");
  const [stockDis, setstockDis] = useState(0);
  
  
  const [inventarios, setinventarios] = useState<Inventarios[]>([]);


  const agregarCompras = async() =>{
    if(stockDis < Number(cantidad)){
        setmensajeError( "Cantidar mayor al stock disponible");
      setshowError(true);
      setTimeout(() => setshowError(false), 3000);
      return;
    }
     setagregarItems(prev => [...prev,{cantidad:cantidad,item:item,Observacion:observacion2,caracteristica:caracteristica}]);
     setcantidad("");
     setitem("");
     setcaracteristica("");
     setobservacion2("");
    }

 const cargarInfoSolMaterial = async(id:number) =>{
        const res = await ordenCompraById(id);
        console.log(res);
        setsolicitudMaterial(res);
        
    }

 const validarEntrega = (valor: number): string => {
  if (!valor || valor === 0 || valor === null) {
    return "Debe seleccionar una persona para entrega";
  }
  return "";
};

   const generarActaSalida = async () => {

  const errorEntrega = validarEntrega(entrega);
  seterroresEntrega(errorEntrega);

  if (errorEntrega) {
    setmensajeError("Debe seleccionar una persona para entrega");
    setshowError(true);
    setTimeout(() => setshowError(false), 3000);
    return;
  }

    

  if (!conOrden && solicitudMaterial.id == null) {
   /* setmensajeError("Debe seleccionar una solicitud de material!");
    setshowError(true);
    setTimeout(() => setshowError(false), 3000);*/
 console.log("entro aqui");

    try {
      
      const info ={
         entregaId:Number(entrega),
   
    recibeId:Number(recibe), 
    
    observacion:observacion2,
    descripcion:descripcion,
     itemsSalida: agregarItems.map(it => ({
    item: it.item,
    cantidad: Number(it.cantidad),  
    Observacion: it.Observacion,
    caracteristica: it.caracteristica
  }))
   
      }

      const res = await createActaSalidaSinOrdenApi(info);
      console.log(res);
     if (res?.validate) {
      setshowSuccess(true);
      setTimeout(() => {
        setshowSuccess(false);
        window.open(`/pdf-salida/${undefined}`, "_blank");

        setsolicitudMaterial({
        
          descripcion:""
        });

        setentrega(0);
        setobservacion2("");
        setrecibe("");
        setagregarItems([]);
      }, 1000);
    } else {
      setmensajeError(res?.msj || "Error al generar acta de salida");
      setshowError(true);
      setTimeout(() => setshowError(false), 3000);
    }
    return;

  } catch (error) {
    console.error("Error generando acta de salida:", error);
  }
    
  }

  if (!solicitudMaterial.itemSolicitados || solicitudMaterial.itemSolicitados.length === 0) {
    setmensajeError("Debe agregar al menos un item a la orden de salida");
    setshowError(true);
    setTimeout(() => setshowError(false), 3000);
    return;
  }

  try {
    const res = await createActaSalidaApi(
      solicitudMaterial.id,
      entrega,
      observacion,
      recibe
    );

    console.log(res);

    if (res?.validate) {
      setshowSuccess(true);
      setTimeout(() => {
        setshowSuccess(false);
        window.open(`/pdf-salida/${undefined}`, "_blank");

        setsolicitudMaterial({
          id: null,
          numOrden: "",
          numOrdenTrabajo: {
            Area: "",
            userSolicitante: { name: "" },
            Maquina: "",
            Codigo: ""
          },
          descripcion: "",
          itemSolicitados: []
        });

        setentrega(0);
        setobservacion("");
      }, 1000);
    } else {
      setmensajeError(res?.msj || "Error al generar acta de salida");
      setshowError(true);
      setTimeout(() => setshowError(false), 3000);
    }

  } catch (error) {
    console.error("Error generando acta de salida:", error);
  }
};
const metodoInventarios = async() =>{
      const resInv = await getInventario();
      console.log(resInv);
      setinventarios(resInv);
    }

 const allEntregan = async() =>{
  const res = await getUsersGerenciaYCoordinacion();
  setentregan(res);
 }   

    useEffect(() => {
       const getAllUsers = async () => {
             const res = await getUsers();
             setusers(res);
           } ;
         getAllUsers(); 
         allEntregan();

    const metodoSolicitudesMaterialesSalidas = async() =>{
    
    const res = await getAllSolicitudes();
    setordenes(res);
   }
   metodoSolicitudesMaterialesSalidas();
   metodoInventarios();
    }, []);
    
      const funcionEliminarItems = (id:number) =>{
   
     const newArrayItems = agregarItems.filter((item, index) => index !== id);
     setagregarItems(newArrayItems);
  }
  

  return (
  <>
    {showSuccess && (
      <div className="fixed top-5 right-5 z-50">
        <div role="alert" className="alert alert-success shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Acta de salida registrada exitosamente!</span>
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

    <div className="w-full h-full p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-t-2xl p-6 shadow-lg border-t-4 border-amber-400">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📤</span>
            <div>
              <h1 className="text-2xl font-bold text-white">Crear Acta de Salida</h1>
              <p className="text-amber-100 text-sm">Registro de salida de materiales del inventario</p>
            </div>
          </div>
          <button
            className="btn btn-sm bg-amber-600 hover:bg-amber-700 text-white border-0 gap-2"
            disabled={!conOrden}
            onClick={() => { setactaSalida(true); setventanaBuscarOrdenTrabajo(!ventanaBuscarOrdenTrabajo); }}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/></svg>
            Asignar Solicitud
          </button>
        </div>
      </div>

     
      <div className="w-full bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-700 mb-4 pb-3 border-b border-amber-200">📋 Información de Orden</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="space-y-3">
            <label className="text-sm text-gray-600">Solicitante</label>
            <input type="text" className="input input-bordered w-full" value={solicitudMaterial?.numOrdenTrabajo?.userSolicitante?.name} disabled />
            <div className="max-h-1"></div>

            <label className="text-sm text-gray-600 mt-2">Área</label>
            <input type="text" className="input input-bordered w-full" value={solicitudMaterial?.numOrdenTrabajo?.Area} disabled />
            <div className="max-h-1"></div>

            <label className="text-sm text-gray-600 mt-2">Descripcion</label>
            {conOrden ?(<input type="text" className="input input-bordered w-full" value={solicitudMaterial?.numOrdenTrabajo?.DescripcionTrabajo ?? ""} disabled />) :(<input type="text" className="input input-bordered w-full" value={descripcion} onChange={(e)=>setdescripcion(e.target.value)}  />)}
          </div>

          <div className="space-y-3">
            <label className="text-sm text-gray-600">Entrega</label>
            <select value={entrega} className={`select select-bordered w-full ${erroresEntrega ? 'select-error' : ''}`} onChange={(e) => {setentrega(e.target.value); seterroresEntrega(validarEntrega(e.target.value));}}>
              <option value={0} disabled>...</option>
              {entregan.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
            <div className="max-h-1">{erroresEntrega && <p className="text-red-500 text-xs">{erroresEntrega}</p>}</div>

            <label className="text-sm text-gray-600 mt-2">Código</label>
            <input type="text" className="input input-bordered w-full" value={solicitudMaterial?.numOrdenTrabajo?.Codigo} disabled />
            <div ></div>

            <label className="text-sm text-gray-600 mt-2">Observación</label>
            <input type="text" className="input input-bordered w-full"  onChange={(e) => setobservacion(e.target.value)} />
          </div>

          <div className="space-y-3">
            <label className="text-sm text-gray-600">Recibe</label>
           
                      <select value={recibe} className={`select select-bordered w-full`} onChange={(e) => {setrecibe(e.target.value);}}>
              <option value={0} disabled>...</option>
              {users.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
            <div className="max-h-1"></div>

            <label className="text-sm text-gray-600 mt-2">Máquina</label>
            <input type="text" className="input input-bordered w-full" value={solicitudMaterial?.numOrdenTrabajo?.Maquina} disabled />
            <div className="max-h-1"></div>

            <label className="text-sm text-gray-600 mt-2">N.Orden</label>
            <input type="text" className="input input-bordered w-full" value={solicitudMaterial?.numOrden} disabled />
          </div>
        </div>
      </div>

    
      <div className="w-full bg-base-100 rounded-2xl shadow p-5">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-3">Agregar ítems (Solo para salida de items sin orden)</h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          <div className="md:col-span-4">
            <label className="text-sm text-gray-600">Cantidad</label>
            <input disabled={conOrden} type="text" className="input input-bordered w-full" value={cantidad} onChange={(e)=>setcantidad(e.target.value)}/>
          </div>

          <div className="md:col-span-4">
            <label className="text-sm text-gray-600">Item</label>
            <div className="relative">
              <input
                disabled={conOrden}
                type="text"
                className="input input-bordered w-full pr-10"
                value={item} onChange={(e)=>setitem(e.target.value)}
              />
              <button
                disabled={conOrden}
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-ghost btn-sm"
                onClick={() => setventanaEmergente(!ventanaEmergente)}
                aria-label="buscar item">
                {conOrden ? '' : '🔎'}
              </button>
            </div>
          </div>

         <div className="md:col-span-4">
            <label className="text-sm text-gray-600">Característica</label>
            <input disabled={conOrden} type="text" className="input input-bordered w-full" 
            value={caracteristica} onChange={(e)=>setcaracteristica(e.target.value)}
            />
          </div>

          <div className="md:col-span-12">
            <label className="text-sm text-gray-600 mt-2">Observación</label>
            <input disabled={conOrden} type="text" className="input input-bordered w-full" 
            value={observacion2} onChange={(e)=>setobservacion2(e.target.value)}
            />
          </div>

          <div className="md:col-span-12 flex gap-3 mt-3">
            {conOrden ? (
              <button className="btn btn-sm bg-amber-500 hover:bg-amber-600 text-white border-0 gap-2" onClick={() => { setconOrden(!conOrden); setsolicitudMaterial({ numOrden: "", numOrdenTrabajo: { Area: "", userSolicitante: { name: "" }, Maquina: "", Codigo: "" }, Destino: "", itemSolicitados: [] }); setentrega(0); }}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
                Activar Modo Sin Orden
              </button>
            ) : (
              <>
                <button className="btn btn-sm bg-amber-500 hover:bg-amber-600 text-white border-0 gap-2" onClick={agregarCompras}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"/></svg>
                  Agregar a Salida
                </button>
                <button className="btn btn-sm btn-ghost gap-2" onClick={() => setconOrden(!conOrden)}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
                  Volver a Con Orden
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      
      <div className="w-full bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-700 mb-4 pb-3 border-b border-amber-200">📋 Salidas Registradas</h2>

        <div className="overflow-auto max-h-80 border border-gray-200 rounded-lg">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Cantidad</th>
                <th>Item</th>
                <th>Característica</th>
                <th>Observación</th>
                {conOrden ? null : <th>Acciones</th>}
              </tr>
            </thead>

            <tbody>
              {conOrden ? (
                solicitudMaterial?.itemSolicitados?.map((u, i) =>
                  u.existencia ? (
                    <tr key={i}>
                      <td>{u.cantidad}</td>
                      <td>{u.item}</td>
                      <td>{u.caracteristica}</td>
                      <td>{u.Observacion ?? "N/A"}</td>
                    </tr>
                  ) : null
                )
              ) : (
                agregarItems.map((u, i) => (
                  <tr key={i}>
                    <td>{u.cantidad}</td>
                    <td>{u.item}</td>
                    <td>{u.caracteristica}</td>
                    <td>{u.Observacion}</td>
                    <td>
                      <button className="btn btn-ghost btn-xs" onClick={()=>funcionEliminarItems(i)}>Eliminar</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      
      <div className="mt-6 flex justify-center gap-3">
        <button className="btn btn-ghost btn-md gap-2" onClick={() => { setconOrden(!conOrden); setsolicitudMaterial({ numOrden: "", numOrdenTrabajo: { Area: "", userSolicitante: { name: "" }, Maquina: "", Codigo: "" }, Destino: "", itemSolicitados: [] }); setentrega(0); setagregarItems([]); }}>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
          Cancelar
        </button>
        <button className="btn btn-md bg-amber-500 hover:bg-amber-600 text-white border-0 gap-2" onClick={generarActaSalida}>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M5 13a3 3 0 105.119-1.023A5.822 5.822 0 1015.956 15H10a1 1 0 11-2 0v-3.379a1 1 0 00-1.823-.5A2.988 2.988 0 005 13z"/></svg>
          Generar Acta de Salida
        </button>
      </div>

      
      <div className={`fixed inset-0 z-40 flex items-center justify-center transition-opacity duration-300 ${ventanaBuscarOrdenTrabajo ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <div className="bg-white w-11/12 md:w-4/5 h-4/5 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 flex flex-col">
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-4 border-b border-amber-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📋</span>
                <div>
                  <h2 className="text-lg font-bold text-white">Seleccionar Orden de Trabajo</h2>
                  <p className="text-amber-100 text-xs">Elige una orden para asociar a la salida</p>
                </div>
              </div>
              <button onClick={() => setventanaBuscarOrdenTrabajo(false)} className="btn btn-circle btn-sm btn-ghost text-white hover:bg-orange-700">
                ✕
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <BuscarOrdenCompra ordenes={ordenes} setidSolMaterial={cargarInfoSolMaterial} setventanaBuscarOrdenTrabajo={setventanaBuscarOrdenTrabajo} ventanaBuscarOrdenTrabajo={ventanaBuscarOrdenTrabajo} />
          </div>
        </div>
      </div>

      
      <div className={`fixed inset-0 z-40 flex items-center justify-center transition-opacity duration-300 ${ventanaEmergente ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <div className="bg-white w-11/12 md:w-2/5 h-3/5 rounded-lg shadow-lg border">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="font-medium">Listado de ítems</div>
            <button className="btn btn-ghost btn-sm" onClick={() => { setventanaEmergente(!ventanaEmergente); }}>❌</button>
          </div>

          <div className="p-4 flex flex-col h-[70%]">
            <div className="flex justify-end mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm">Buscar:</span>
                <input className="input input-bordered input-sm" type="text" />
              </div>
            </div>

            <div className="overflow-auto border rounded">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Stock</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                    {inventarios.map((i) => (
                  <tr key={i.id}>
                    <td>{i.nombre}</td>
                    <td>{i.stock}</td>
                    <td>
                      <button
                        className="btn btn-ghost btn-xs"
                        onClick={() => { if(i.stock === 0){ setmensajeError( "No pude escoger un item sin stock");
      setshowError(true);
      setTimeout(() => setshowError(false), 3000); return;} setitem(i.nombre); setstockDis(i.stock);setventanaEmergente(false); }}
                      >
                        Seleccionar
                      </button>
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>

          
          </div>
        </div>
      </div>
    </div>
  </>
);

}
