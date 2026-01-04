import React, { useEffect, useState } from 'react'
import type { ItemsPorGuardar } from '../models/itemsPorGuardar';
import { BuscarOrdenTrabajo } from './buscarOrdenTrabajo';
import type { LllenarDestino } from '../models/llenarDestino';
import { createItemsSolicitados, evaluarStock, filtrarInventario, getInventario } from '../../inventario/controller/inventario-api';
import { getUsers } from '../../user/controller/api/user-api';
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
  Maquina: ""
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
  const [autoriza, setautoriza] = useState("");
  const [destino, setdestino] = useState("");
  const [ventanaEmergente, setventanaEmergente] = useState(false); 
  const [inventarios, setinventarios] = useState<Inventarios[]>([])
  const [showSuccess, setshowSuccess] = useState(false);
  const [showError, setshowError] = useState(false);
  const [erroresItems, seterroresItems] = useState({cantidad: "", item: ""});
  const [erroresDestino, seterroresDestino] = useState({autoriza: ""});
  const [mensajeErrorOrdenCompra, setmensajeErrorOrdenCompra] = useState("");
  const [showErrorOrdenCompra, setshowErrorOrdenCompra] = useState(false);
  

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
          estadoStock: "Por comprar",
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
    if (!valor || valor === "" || valor === "Seleccionar...") {
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
     console.log("Items", items);
     
      return;
    }

    // Si hay error en autoriza
  
    // Si la tabla está vacía
    if (errorTabla) {
      setmensajeErrorOrdenCompra(errorTabla);
      setshowErrorOrdenCompra(true);
      setTimeout(() => setshowErrorOrdenCompra(false), 3000);
      return;
    }
 

    try {
       const resOrdenCompra = await crearOrdenCompra({
      Autoriza: autoriza,
      ordenTrabajoId: infoDestino.id,
      Destino: destino,
      items:items
    });
    console.log("respuesta crearOrdenCompra:", resOrdenCompra);
    if(resOrdenCompra.validate){

           
      setshowSuccess(true);

      setTimeout(() => {
setshowSuccess(false);
       window.open(`/pdf-compra/${infoDestino.id}`,"_blank");

      }, 1000);

setcomprasPorGenerar([]);
setitems([]);
setdestino("");
setautoriza("");
setbuscarItem("");
setcantidad(0);
setitem("");
setcaracteristica("");
setobservacion("");
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

    <div className="w-full   p-6">

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">
          Destino de orden
        </h2>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Solicitante</label>
            <input className="input input-sm w-full" disabled value={infoDestino.userSolicitante.name} />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Área</label>
            <input className="input input-sm w-full" disabled value={infoDestino.Area} />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Descripción</label>
            <input className="input input-sm w-full" disabled value={infoDestino.DescripcionTrabajo} />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Destino</label>
            <input className="input input-sm w-full" value={destino} onChange={(e)=>setdestino(e.target.value)} />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Autoriza</label>
            <select 
              defaultValue="Seleccionar..." 
              className={`select select-sm w-full ${erroresDestino.autoriza ? 'select-error' : ''}`} 
              onChange={(e) => {
                setautoriza(e.target.value); 
                seterroresDestino({...erroresDestino, autoriza: validarAutoriza(e.target.value)});
              }}
            >
              <option disabled>Seleccionar...</option>
              {users.map((m,i) => (
                <option key={i} value={m.name}>{m.name}</option>
              ))}
            </select>
            <div className="h-5">{erroresDestino.autoriza && <p className="text-red-500 text-xs">{erroresDestino.autoriza}</p>}</div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Código</label>
            <input className="input input-sm w-full" disabled value={infoDestino.Codigo} />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Nº Orden</label>
            <input className="input input-sm w-full" disabled value={infoDestino.NumOrden} />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Máquina</label>
            <input className="input input-sm w-full" disabled value={infoDestino.Maquina} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">
          Agregar items
        </h2>

        <div className="grid grid-cols-4 gap-4 mb-4">
          <div>
            <input 
              className={`input ${erroresItems.cantidad ? 'input-error' : ''}`} 
              placeholder="Cantidad" 
              value={cantidad} 
              onChange={(e) => setcantidad(e.target.value)} 
            />
            <div className="h-5">{erroresItems.cantidad && <p className="text-red-500 text-xs">{erroresItems.cantidad}</p>}</div>
          </div>

          <div>
            <div className="relative">
              <input
                className={`input input-bordered w-full pr-10 ${erroresItems.item ? 'input-error' : ''}`}
                placeholder="Item"
                value={item}
                onChange={(e) => setitem(e.target.value)}
              />
              <button
                type="button"
                className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 z-20 text-gray-400 hover:text-primary transition"
                onClick={() => setventanaEmergente(!ventanaEmergente)}
              >
                🔎
              </button>
            </div>
            <div className="h-5">{erroresItems.item && <p className="text-red-500 text-xs">{erroresItems.item}</p>}</div>
          </div>

          <div>
            <input 
              className="input" 
              placeholder="Característica" 
              value={caracteristica} 
              onChange={(e) => setcaracteristica(e.target.value)} 
            />
          </div>

          <div>
            <input 
              className="input" 
              placeholder="Observación" 
              value={observacion} 
              onChange={(e) => setobservacion(e.target.value)} 
            />
          </div>
        </div>

        <button className="btn btn-primary" onClick={funcionAgregarItems}>
          Agregar a compras
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">
          Compras
        </h2>

        <div className="overflow-auto max-h-54">

          <table className="table">
            <thead>
              <tr>
                <th>Cantidad</th>
                <th>Item</th>
                <th>Característica</th>
                <th>Observación</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {comprasPorGenerar?.map((u, i) => (
                <tr>
                  <td>{u.cantidad}</td>
                  <td>{u.item}</td>
                  <td>{u.caracteristica}</td>
                  <td>{u.Observacion}</td>
                  <td>{u.estadoStock}</td>
                  <td>
                    <button className="btn btn-ghost btn-xs" onClick={() => funcionEliminarItems(i)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-center mt-4">
          <button className="btn btn-success" onClick={crearYGenerarOrdenCompra}>
            Generar orden de compra
          </button>
        </div>
      </div>
    </div>

    <div className={`fixed inset-0 z-10 flex items-center justify-center transition-opacity ${ventanaBuscarOrdenTrabajo ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
      <div className="bg-white w-4/5 h-4/5 rounded-xl shadow-lg border">
        <BuscarOrdenTrabajo
          setinfoDestino={setinfoDestino}
          ventanaBuscarOrdenTrabajo={ventanaBuscarOrdenTrabajo}
          setventanaBuscarOrdenTrabajo={setventanaBuscarOrdenTrabajo}
        />
      </div>
    </div>

    <div className={` fixed inset-x-0 z-50 flex items-center justify-center max-h-2/5 transition-opacity ${ventanaEmergente ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
      <div className="bg-white w-2/5 max-h-[80vh] rounded-xl shadow-lg border">
        <div className="flex justify-between items-center p-4 border-b">
          <span className="font-semibold">Listado de items</span>
          <span className="cursor-pointer" onClick={() => setventanaEmergente(false)}>❌</span>
        </div>

        <div className="p-4 ">
          <input className="input w-full mb-3" placeholder="Buscar item" onChange={(e) => setbuscarItem(e.target.value)} />

          <div className=" overflow-auto max-h-96">
            <table className="table ">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Stock</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {inventarios.map((i) => (
                  <tr>
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
  </>
);

}
