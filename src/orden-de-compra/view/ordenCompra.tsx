import React, { useEffect, useState } from 'react'
import Select from 'react-select';
import type { ItemsPorGuardar } from '../models/itemsPorGuardar';
import { BuscarOrdenTrabajo } from './buscarOrdenTrabajo';
import type { LllenarDestino } from '../models/llenarDestino';
import { createItemsSolicitados, evaluarStock, filtrarInventario, getInventario } from '../../inventario/controller/inventario-api';
import { getUsers, getUsersSupervisores } from '../../user/controller/api/user-api';
import { crearOrdenCompra, getAllOrdenesTrabajoSinUso } from '../controller/ordenCompraApi';
import type { Inventarios } from '../../inventario/models/inventarios';
import type { CreateItemsSolicitados } from '../../inventario/models/createItemsSolocitados';
import { info } from 'console';



export const OrdenCompra = ({id}) => {

const infoDestinoInicial: LllenarDestino = {
  userSolicitante: { name: "" },
  id: 0,
  NumOrden: "",
  Area: "",
  Codigo: "",
  Maquina: "",
  DescripcionTrabajo: ""
};


  const [comprasPorGenerar, setcomprasPorGenerar] = useState<ItemsPorGuardar[]>([]);
  const [items, setitems] = useState<CreateItemsSolicitados[]>([]);
  const [ventanaBuscarOrdenTrabajo, setventanaBuscarOrdenTrabajo] = useState(false);
  const [infoDestino, setinfoDestino] = useState<LllenarDestino>(infoDestinoInicial);
  const [item, setitem] = useState("");
  const [buscarItem, setbuscarItem] = useState("");
  const [cantidad, setcantidad] = useState(0);
  const [caracteristica, setcaracteristica] = useState("");
  const [observacion, setobservacion] = useState("");
  const [users, setusers] = useState<{name:string}[]>([]);
  const [autoriza, setautoriza] = useState("...");
  const [ventanaEmergente, setventanaEmergente] = useState(false); 
  const [inventarios, setinventarios] = useState<Inventarios[]>([])
  const [showSuccess, setshowSuccess] = useState(false);
  const [showError, setshowError] = useState(false);
  const [erroresItems, seterroresItems] = useState({cantidad: "", item: ""});
  const [erroresDestino, seterroresDestino] = useState({autoriza: ""});
  const [mensajeErrorOrdenCompra, setmensajeErrorOrdenCompra] = useState("");
  const [showErrorOrdenCompra, setshowErrorOrdenCompra] = useState(false);
  const [isPending, setisPending] = useState(false);

   const metodoInventarios = async() =>{
      const resInv = await getInventario();
      setinventarios(resInv);
    }

  useEffect(() => {
    const getAllUsers = async () => {
        const res = await getUsersSupervisores();
        setusers(res);
      } ;
    getAllUsers(); 

    metodoInventarios();
   
    
  }, []);
  
useEffect(() => {
  if (id !== undefined && id !== null && id !==0) {
    const preCargarOrdenes = async () => {
      const ordenesApi = await getAllOrdenesTrabajoSinUso();
      const primerOT = ordenesApi.find((o) => o.id === id);

      if (primerOT) {
        setinfoDestino(primerOT);
      }
    };

    preCargarOrdenes();
  } else {
    
    setinfoDestino(infoDestinoInicial);
  }
}, [id]);

 


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

  const validarCantidadItem = (value: any): string => {
    if (!value || value === "" || value === 0) {
      return "La cantidad no puede estar vacía";
    }
    const num = Number(value);
    if (isNaN(num)) {
      return "La cantidad debe ser un número válido";
    }
    if (num < 0) {
      return "La cantidad no puede ser negativa";
    }
    return "";
  };

  const validarItemField = (value: string): string => {
    if (!value || value.trim() === "") {
      return "Debe seleccionar un item";
    }
   /* if (!/^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]+$/.test(value)) {
      return "El item solo puede contener letras";
    }*/
    return "";
  };

  const funcionAgregarItems = async() =>{
      // Validar cantidad
      const errorCantidad = validarCantidadItem(cantidad);
      const errorItem = validarItemField(item);
      
      seterroresItems({ cantidad: errorCantidad, item: errorItem });
      
      if (errorCantidad || errorItem) {
        return;
      }

  const existeItem =  items.some((i)=>i.item === item);
 
  if(existeItem){
    seterroresItems({ cantidad: "", item: "Error! Item ya ingresado." });
    setTimeout(() => {
      seterroresItems({ cantidad: "", item: "" });
    }, 3000);
    return;
  }
  setitems(prev => [
    ...prev,
    { item: item, cantidad: Number(cantidad), caracteristica: caracteristica, Observacion: observacion }
  ]);

  try {
    const res = await evaluarStock({ item: item, cantidad: Number(cantidad) });
    console.log("respuesta evaluarStock:", res);

    
    if (res && res.validate) {
      
      res.compras.map((r: any) => {
        setcomprasPorGenerar(prev => [
          ...prev,
          {
            cantidad: r.cantidad,
            item: item,
            caracteristica: caracteristica,
            Observacion: observacion,
            estadoStock: r.estado,
            validate: r.validate
          }
        ]);
      });
      
    } else {
      
      setcomprasPorGenerar(prev => [
        ...prev,
        {
          cantidad: Number(cantidad),
          item: item,
          caracteristica: caracteristica,
          Observacion: observacion,
          estadoStock: "No disponible",
          validate: res?.validate ?? false
        }
      ]);

    }

     seterroresItems({ cantidad: "", item: "" });
  setcantidad(0);
  setitem("");
  setcaracteristica("");
  setobservacion("");
  } catch (err) {
    console.error("error al evaluar stock:", err);
   
      setmensajeErrorOrdenCompra("Ocurrió un error al evaluar el stock");
      setshowErrorOrdenCompra(true);
      setTimeout(() => setshowErrorOrdenCompra(false), 3000);
      
  }

 
 
};
 
  const funcionEliminarItems = (id:number) =>{
    const newArray = comprasPorGenerar.filter((item, index) => index !== id);
    setcomprasPorGenerar(newArray);
     const newArrayItems = items.filter((item, index) => index !== id);
     setitems(newArrayItems);
  }

  // Funciones de validación para orden de compra
  const validarOrdenTrabajoSeleccionada = (): string => {
    if (!infoDestino.id || infoDestino.id === 0) {
      return "Debe seleccionar una orden de trabajo";
    }
    return "";
  };

  const validarAutoriza = (valor: string): string => {
    if (!valor || valor === "" || valor === "...") {
      return "Campo obligatorio";
    }
    return "";
  };

  const validarTablaCompras = (): string => {
    if (comprasPorGenerar.length === 0) {
      return "La tabla de compras no puede estar vacía";
    }
    return "";
  };

  const crearYGenerarOrdenCompra = async() => {
    // Validar orden de trabajo seleccionada
    const errorOrdenTrabajo = validarOrdenTrabajoSeleccionada();
const errorAutoriza = validarAutoriza(autoriza);
    const errorTabla = validarTablaCompras();

    seterroresDestino({ autoriza: errorAutoriza });

    // Si hay error en orden de trabajo
    if (errorOrdenTrabajo) {
      setmensajeErrorOrdenCompra(errorOrdenTrabajo);
      setshowErrorOrdenCompra(true);
      setTimeout(() => setshowErrorOrdenCompra(false), 3000);
      return;
    }

    if (errorAutoriza) {
     seterroresDestino({ autoriza: errorAutoriza });
   
      return;
    }

    if (errorTabla) {
      setmensajeErrorOrdenCompra(errorTabla);
      setshowErrorOrdenCompra(true);
      setTimeout(() => setshowErrorOrdenCompra(false), 3000);
      return;
    }
 
    setisPending(true);
    try {
       const resOrdenCompra = await crearOrdenCompra({
      Autoriza: autoriza,
      ordenTrabajoId: infoDestino.id,
      items:items
    });
    console.log("respuesta crearOrdenCompra:", resOrdenCompra);
    if(resOrdenCompra.validate){

           
      setshowSuccess(true);

      setTimeout(() => {
setshowSuccess(false);
       window.open(`/pdf-compra/${undefined}`,"_blank");

      }, 1000);

setcomprasPorGenerar([]);
setitems([]);

setbuscarItem("");
setcantidad(0);
setitem("");
setcaracteristica("");
setobservacion("");
setautoriza("...");
setventanaBuscarOrdenTrabajo(false);
setventanaEmergente(false);
setinfoDestino(infoDestinoInicial);
      
    } else {
      setmensajeErrorOrdenCompra(resOrdenCompra.msj || "Error al crear la orden de compra");
      setshowErrorOrdenCompra(true);
      setTimeout(() => setshowErrorOrdenCompra(false), 3000);
    }

    } catch (error) {
      console.error("Error creating order and items:", error);
      setmensajeErrorOrdenCompra("Error al generar la orden de compra");
      setshowErrorOrdenCompra(true);
      setTimeout(() => setshowErrorOrdenCompra(false), 3000);
    }finally{
      setisPending(false);
    }
  }
  
  return (
  <>
    {showSuccess && (
      <div className="fixed top-5 right-5 z-50">
        <div role="alert" className="alert alert-success shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>¡Solicitud de material creada!</span>
        </div>
      </div>
    )}

    {showError && (
      <div className="fixed top-5 right-5 z-50">
        <div role="alert" className="alert alert-error shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Error! Item ya ingresado.</span>
        </div>
      </div>
    )}

    {showErrorOrdenCompra && (
      <div className="fixed top-5 right-5 z-50">
        <div role="alert" className="alert alert-error shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{mensajeErrorOrdenCompra}</span>
        </div>
      </div>
    )}

    <div className="w-full p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-t-2xl p-6 shadow-lg border-t-4 border-purple-400">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🛒</span>
            <div>
              <h1 className="text-2xl font-bold text-white">Solicitud de Material</h1>
              <p className="text-purple-100 text-sm">Gestión de solicitudes de materiales y compras</p>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-sm bg-purple-600 hover:bg-purple-700 text-white border-0 gap-2"
            onClick={() => { setventanaBuscarOrdenTrabajo(!ventanaBuscarOrdenTrabajo); }}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/></svg>
            Seleccionar OT
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-700 mb-4 pb-3 border-b border-purple-200">
          🎯 Destino de Orden
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">Solicitante</label>
            <input className="input input-sm input-bordered w-full mt-2 focus:input-primary rounded-lg bg-gray-50" disabled value={infoDestino?.userSolicitante?.name ?? "N/A"} />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">Área</label>
            <input className="input input-sm input-bordered w-full mt-2 focus:input-primary rounded-lg bg-gray-50" disabled value={infoDestino.Area} />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">Descripción</label>
            <input className="input input-sm input-bordered w-full mt-2 focus:input-primary rounded-lg bg-gray-50" disabled value={infoDestino.DescripcionTrabajo} />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">Máquina</label>
            <input className="input input-sm input-bordered w-full mt-2 focus:input-primary rounded-lg bg-gray-50" disabled value={infoDestino.Maquina} />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">Código</label>
            <input className="input input-sm input-bordered w-full mt-2 focus:input-primary rounded-lg bg-gray-50" disabled value={infoDestino.Codigo} />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">Nº Orden</label>
            <input className="input input-sm input-bordered w-full mt-2 focus:input-primary rounded-lg bg-gray-50" disabled value={infoDestino.NumOrden} />
          </div>

          

          
          <div className="lg:col-span-1 flex items-end">
            <div className="w-full">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">Autoriza</label>
              <Select
                options={Array.isArray(users) ? users.map(m => ({ value: m.name, label: m.name })) : []}
                value={autoriza !== "..." ? { value: autoriza, label: autoriza } : null}
                onChange={(opt) => {
                  setautoriza(opt?.value || "...");
                  seterroresDestino({...erroresDestino, autoriza: validarAutoriza(opt?.value || "...")});
                }}
                placeholder="Seleccionar..."
                isClearable
                isSearchable
                className="text-sm"
                styles={{
                  control: (base) => ({...base, minHeight: '36px', fontSize: '14px' })
                }}
              />
              {erroresDestino.autoriza && <p className="text-red-500 text-xs mt-1">{erroresDestino.autoriza}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-700 mb-4 pb-3 border-b border-purple-200">
          ➕ Agregar Ítems
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">Item</label>
            <div className="relative mt-2">
              <input
                className={`input input-sm input-bordered w-full pr-10 focus:input-primary rounded-lg ${erroresItems.item ? 'input-error' : ''}`}
                placeholder="Buscar item..."
                value={item}
                onChange={(e) => setitem(e.target.value)}
              />
              <button
                type="button"
                className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 z-20 text-gray-500 hover:text-purple-600 transition"
                onClick={() => setventanaEmergente(!ventanaEmergente)}
              >
                🔎
              </button>
            </div>
            {erroresItems.item && <p className="text-red-500 text-xs mt-1">{erroresItems.item}</p>}
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">Cantidad</label>
            <input 
              className={`input input-sm input-bordered w-full mt-2 focus:input-primary rounded-lg ${erroresItems.cantidad ? 'input-error' : ''}`} 
              placeholder="0" 
              value={cantidad === 0 ? "" : cantidad} 
              onChange={(e) => setcantidad(e.target.value)} 
            />
            {erroresItems.cantidad && <p className="text-red-500 text-xs mt-1">{erroresItems.cantidad}</p>}
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">Característica</label>
            <input 
              className="input input-sm input-bordered w-full mt-2 focus:input-primary rounded-lg" 
              placeholder="Ej: Color, tamaño..." 
              value={caracteristica} 
              onChange={(e) => setcaracteristica(e.target.value)} 
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">Observación</label>
            <input 
              className="input input-sm input-bordered w-full mt-2 focus:input-primary rounded-lg" 
              placeholder="Notas adicionales..." 
              value={observacion} 
              onChange={(e) => setobservacion(e.target.value)} 
            />
          </div>
        </div>

        <button className="btn btn-sm bg-purple-500 hover:bg-purple-600 text-white border-0 gap-2" onClick={funcionAgregarItems}>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"/></svg>
          Agregar a Compras
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-700 mb-4 pb-3 border-b border-purple-200">
          📋 Materiales Agregados
        </h2>

        <div className="overflow-auto max-h-80 border border-gray-200 rounded-lg">
          <table className="table w-full">
            <thead>
              <tr className="bg-gray-50">
                <th>Item</th>
                <th>Cantidad</th>
                <th>Característica</th>
                <th>Observación</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {comprasPorGenerar?.map((u, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td>{u.item}</td>
                  <td><span className="badge badge-sm">{u.cantidad}</span></td>
                  <td>{u.caracteristica}</td>
                  <td>{u.Observacion}</td>
                  <td><span className="badge badge-sm badge-info gap-2  whitespace-nowrap ">{u.estadoStock}</span></td>
                  <td>
                    <button className="btn btn-ghost btn-xs gap-1 tooltip" data-tip="Eliminar" onClick={() => funcionEliminarItems(i)}>
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end gap-3 mt-6">
         
          <button className="btn btn-md bg-purple-500 hover:bg-purple-600 text-white border-0 gap-2" onClick={crearYGenerarOrdenCompra}>
            
                      {isPending ? (
    
    <span className="loading loading-spinner loading-sm"></span>
  ) : (
    // Icono original
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path d="M5 13a3 3 0 105.119-1.023A5.822 5.822 0 1015.956 15H10a1 1 0 11-2 0v-3.379a1 1 0 00-1.823-.5A2.988 2.988 0 005 13z"/>
      </svg>
  )}
  {isPending ? "Procesando..." : "Generar Solicitud"}
          </button>
        </div>
      </div>
    </div>

    <div className={`fixed inset-0 z-30 flex items-center justify-center transition-opacity ${ventanaBuscarOrdenTrabajo ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
      <div className="bg-white w-11/12 md:w-4/5 h-4/5 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 flex flex-col">
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-4 border-b border-purple-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📋</span>
              <div>
                <h2 className="text-lg font-bold text-white">Seleccionar Orden de Trabajo</h2>
                <p className="text-purple-100 text-xs">Elige una orden para asociar a esta solicitud</p>
              </div>
            </div>
            <button onClick={() => setventanaBuscarOrdenTrabajo(false)} className="btn btn-circle btn-sm btn-ghost text-white hover:bg-pink-700">
              ✕
            </button>
          </div>
        </div>
        <div className="flex-1  overflow-y-auto">
          <BuscarOrdenTrabajo
            setinfoDestino={setinfoDestino}
            ventanaBuscarOrdenTrabajo={ventanaBuscarOrdenTrabajo}
            setventanaBuscarOrdenTrabajo={setventanaBuscarOrdenTrabajo}
          />
        </div>
      </div>
    </div>

    <div className={` fixed inset-0 z-50 flex items-center justify-center transition-opacity ${ventanaEmergente ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
      <div className="bg-white w-11/12 md:w-2/5 max-h-[80vh] rounded-2xl shadow-2xl border border-gray-200 flex flex-col">
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 flex justify-between items-center px-6 py-4 border-b border-purple-200 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xl">📦</span>
            <div>
              <span className="font-bold text-white text-lg">Seleccionar Items</span>
              <p className="text-purple-100 text-xs">Elige los artículos que necesitas</p>
            </div>
          </div>
          <button onClick={() => setventanaEmergente(false)} className="btn btn-circle btn-sm btn-ghost text-white hover:bg-pink-700">✕</button>
        </div>

        <div className="p-6 flex-1 flex flex-col overflow-hidden">
          <div className="mb-4">
            <label className="text-sm font-semibold text-gray-700 block mb-2">🔍 Buscar item</label>
            <input className="input input-bordered w-full rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-400" placeholder="Escribe el nombre del artículo..." onChange={(e) => setbuscarItem(e.target.value)} />
          </div>

          <div className="overflow-y-auto overflow-x-auto flex-1 border border-gray-200 rounded-lg">
            <table className="table table-sm">
              <thead className='bg-gradient-to-r from-purple-100 to-pink-100 border-b-2 border-purple-300 sticky top-0'>
                <tr>
                  <th className='text-purple-900'>Nombre</th>
                  <th className='text-purple-900'>Stock</th>
                  <th className='text-purple-900'>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {inventarios.map((i) => (
                  <tr className='hover:bg-purple-50 border-b border-gray-200'>
                    <td className='font-medium text-gray-800'>{i.nombre}</td>
                    <td className='text-gray-700'><span className='badge badge-lg badge-purple'>{i.stock}</span></td>
                    <td>
                      <button
                        className="btn btn-sm bg-gradient-to-r from-purple-500 to-pink-600 text-white border-none hover:from-purple-600 hover:to-pink-700 rounded-lg"
                        onClick={() => { setitem(i.nombre); setventanaEmergente(false); }}
                      >
                        ✓ Seleccionar
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
  </>
);

}
