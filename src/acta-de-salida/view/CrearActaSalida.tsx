import { useEffect, useState } from "react"
import { BuscarOrdenCompra } from "./BuscarOrdenCompra";
import type { InfoPdfCompra } from "../../orden-de-compra/models/infoPdfCompra";
import { getAllSolicitudes, ordenCompraById } from "../../orden-de-compra/controller/ordenCompraApi";
import { getUsers } from "../../user/controller/api/user-api";
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
  const [recibe, setrecibe] = useState("");
  const [destino, setdestino] = useState("");
  
  const [inventarios, setinventarios] = useState<Inventarios[]>([]);


  const agregarCompras = async() =>{
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
 console.log("entro aqui")
    try {
      
      const info ={
         entregaId:Number(entrega),
   
    recibeId:Number(recibe), 
    
    observacion:observacion2,
    
    destino:destino,
     itemsSalida: agregarItems.map(it => ({
    item: it.item,
    cantidad: Number(it.cantidad),  
    Observacion: it.Observacion,
    caracteristica: it.caracteristica
  }))
   // caracteristica:caracteristica
      }

      const res = await createActaSalidaSinOrdenApi(info);
      console.log(res);
     if (res?.validate) {
      setshowSuccess(true);
      setTimeout(() => {
        setshowSuccess(false);
        window.open(`/pdf-salida/${undefined}`, "_blank");

        setsolicitudMaterial({
        
          Destino:""
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
      observacion
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
          Destino: "",
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

    useEffect(() => {
       const getAllUsers = async () => {
             const res = await getUsers();
             setusers(res);
           } ;
         getAllUsers(); 

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

      
      <div className="w-full flex items-center justify-center">
        <button
          className="btn btn-primary"
          disabled={!conOrden}
          onClick={() => { setactaSalida(true); setventanaBuscarOrdenTrabajo(!ventanaBuscarOrdenTrabajo); }}
        >
          Asignar solicitud de material
        </button>
      </div>

     
      <div className="w-full bg-base-100 rounded-2xl shadow p-5">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-3">
          Información
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-3">
            <label className="text-sm text-gray-600">Solicitante</label>
            <input type="text" className="input input-bordered w-full" value={solicitudMaterial?.numOrdenTrabajo?.userSolicitante?.name} disabled />
            <div className="max-h-1"></div>

            <label className="text-sm text-gray-600 mt-2">Área</label>
            <input type="text" className="input input-bordered w-full" value={solicitudMaterial?.numOrdenTrabajo?.Area} disabled />
            <div className="max-h-1"></div>

            <label className="text-sm text-gray-600 mt-2">Destino</label>
            {conOrden ?(<input type="text" className="input input-bordered w-full" value={solicitudMaterial?.Destino} disabled />) :(<input type="text" className="input input-bordered w-full" value={destino} onChange={(e)=>setdestino(e.target.value)}  />)}
          </div>

          <div className="space-y-3">
            <label className="text-sm text-gray-600">Entrega</label>
            <select value={entrega} className={`select select-bordered w-full ${erroresEntrega ? 'select-error' : ''}`} onChange={(e) => {setentrega(e.target.value); seterroresEntrega(validarEntrega(e.target.value));}}>
              <option value={0} disabled>...</option>
              {users.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
            <div className="max-h-1">{erroresEntrega && <p className="text-red-500 text-xs">{erroresEntrega}</p>}</div>

            <label className="text-sm text-gray-600 mt-2">Código</label>
            <input type="text" className="input input-bordered w-full" value={solicitudMaterial?.numOrdenTrabajo?.Codigo} disabled />
            <div ></div>

            <label className="text-sm text-gray-600 mt-2">Observación</label>
            <input type="text" className="input input-bordered w-full" disabled={!conOrden} onChange={(e) => setobservacion(e.target.value)} />
          </div>

          <div className="space-y-3">
            <label className="text-sm text-gray-600">Recibe</label>
            {conOrden ? (<input type="text" className="input input-bordered w-full" value={solicitudMaterial?.numOrdenTrabajo?.userSolicitante?.name} disabled />)
                      :(<select value={recibe} className={`select select-bordered w-full`} onChange={(e) => {setrecibe(e.target.value);}}>
              <option value={0} disabled>...</option>
              {users.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>)}
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
              <button className="btn btn-outline" onClick={() => { setconOrden(!conOrden); setsolicitudMaterial({ numOrden: "", numOrdenTrabajo: { Area: "", userSolicitante: { name: "" }, Maquina: "", Codigo: "" }, Destino: "", itemSolicitados: [] }); setentrega(0); }}>
                Activar
              </button>
            ) : (
              <>
                <button className="btn btn-primary" onClick={agregarCompras}>Agregar a compras</button>
                <button className="btn" onClick={() => setconOrden(!conOrden)}>Cancelar</button>
              </>
            )}
          </div>
        </div>
      </div>

      
      <div className="w-full bg-base-100 rounded-2xl shadow p-5">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-3">Salidas</h2>

        <div className="overflow-auto max-h-72">
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

      
      <div className="flex justify-center">
        <button className="btn btn-success" onClick={generarActaSalida}>Generar acta de salida</button>
      </div>

      
      <div className={`fixed inset-0 z-40 flex items-center justify-center transition-opacity duration-300 ${ventanaBuscarOrdenTrabajo ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <div className="bg-white w-11/12 md:w-4/5 h-4/5 rounded-lg shadow-lg overflow-hidden border">
          <BuscarOrdenCompra ordenes={ordenes} setidSolMaterial={cargarInfoSolMaterial} setventanaBuscarOrdenTrabajo={setventanaBuscarOrdenTrabajo} ventanaBuscarOrdenTrabajo={ventanaBuscarOrdenTrabajo} />
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
                        onClick={() => { setitem(i.nombre); setventanaEmergente(false); }}
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
