import React, { useEffect, useRef, useState } from "react";
import { BuscarOrdenCompra } from "../../acta-de-salida/view/BuscarOrdenCompra";
import type { InfoPdfCompra } from "../../orden-de-compra/models/infoPdfCompra";
import { getAllSolicitudesParciales, ordenCompraById } from "../../orden-de-compra/controller/ordenCompraApi";
import type { BuscarSolMaterial } from "../../orden-de-compra/models/buscarSolMaterial";
import { asignarInfoActaEntrada, existeItem, filtrarInventario } from "../../inventario/controller/inventario-api";
import type { AsignarInfoEntrada } from "../../inventario/models/AsignarInfoEntrada";
import { createActaEntrada, findProovedorByNombre, getPerchasBySeccion, getSeccionesByBodega } from "../controller/actaEntrada-api";
import { CrearProovedor } from "./CrearProovedor";
import { getAllBodegas } from "../../admin/controller/api/admin-api";



export const CrearActaEntrada = () => {

    const [ventanaBuscarSolicitudMaterial, setventanaBuscarSolicitudMaterial] = useState(false);
    const [solicitudMaterial, setsolicitudMaterial] = useState<AsignarInfoEntrada>({itemsSolicitados:[]});
    const [solCompraId, setsolCompraId] = useState<number>(0);
    const [total, settotal] = useState<number>(0.00);
    const [proovedores, setproovedores] = useState<{id:number,nombreComercial:string}[]>([]);
    const [proovedor, setproovedor] = useState("");
    const [factura, setfactura] = useState("");
    const [item, setitem] = useState(null);
    const [cantidad, setcantidad] = useState(null);
    const [stockMin, setstockMin] = useState(null);
    const [precioUni, setprecioUni] = useState(null);
    const [descuento, setdescuento] = useState(null);
    const [iva, setiva] = useState(false);
    const [bodega, setbodega] = useState("");
    const [seccion, setseccion] = useState("");
    const [percha, setpercha] = useState("");
    const [bodegas, setbodegas] = useState<{id:number,bodega:string}[]>([]);
    const [secciones, setsecciones] = useState<{id:number,seccion:string}[]>([]);
    const [perchas, setperchas] = useState<{id:number,percha:string}[]>([]);
    const [observacion, setobservacion] = useState("");
    const [ventanaAgregarProovedor, setventanaAgregarProovedor] = useState(false);
    const [items, setitems] = useState<{nombre:string,costo:number}[]>([]);
    const [ordenes, setordenes] = useState<BuscarSolMaterial[]>([]);
    const [habilitarStockMin, sethabilitarStockMin] = useState(false);


const cargarInfoSolMaterial = async() =>{
        const res = await asignarInfoActaEntrada(solCompraId);
       
        
        setsolicitudMaterial(res);
        
       setsolicitudMaterial(prev => ({
  ...prev,
  itemsSolicitados: prev.itemsSolicitados.map(item => ({
    ...item,
    subtotal: item.cantidad * (item.costo ?? 0),
    total: (item.cantidad * (item.costo ?? 0))
  }))
}));

    }

 const asignarCampos = async(index:number,item:string,cantidad:number,preciU:number) => {

  const validar = await existeItem(item);
  sethabilitarStockMin(validar);

  console.log("index que llega", index);
  console.log("antes:", solicitudMaterial.itemsSolicitados);

  setitem(item);
  setprecioUni(preciU);
  setcantidad(cantidad);

  setsolicitudMaterial(prev => {
    const nuevo = prev.itemsSolicitados.filter((_, idx) => idx !== index);
    console.log("después:", nuevo);
    return { ...prev, itemsSolicitados: nuevo };
  });
};



    useEffect(() => {

       if (!solicitudMaterial?.itemsSolicitados?.length) {
    settotal(0);
    return;
  }
      
      const asignarTotal = ()=>{
        const suma = solicitudMaterial?.itemsSolicitados?.reduce((acumulador,item)=>{return acumulador + item.total},0);
        settotal(suma);
      }

      asignarTotal();
    }, [solicitudMaterial])
    

   const metodoSolicitudesMaterialesEntradas = async() =>{
      
      const res = await getAllSolicitudesParciales();
      console.log(res);
      setordenes(res);
     }

     useEffect(() => {
      if(ventanaBuscarSolicitudMaterial){
        metodoSolicitudesMaterialesEntradas();
      }
      
     }, [ventanaBuscarSolicitudMaterial]);
     
     useEffect(() => {
      console.log("solCompraId",solCompraId);
      if (!solCompraId) return;
      console.log("entro solCompraId")
      cargarInfoSolMaterial();
     }, [solCompraId])
     
     
  const agregarItemsActualizado = () => {
  const c = Number(cantidad ?? 0);
  const pu = Number(precioUni ?? 0);
  const d = Number(descuento ?? 0);
  const ivaFinal = iva ? 0.15 : 0; 

  const subtotal1 = c * pu;
  const descuento1 = subtotal1 * (d / 100);
  const iva1 = (subtotal1 - descuento1) * ivaFinal;
  const calcTotal = subtotal1 - descuento1 + iva1;

  if(bodega === ""){
   alert("Elija una bodega");
   return;
  }

  if(seccion === ""){
   alert("Elija una seccion");
   return;
  }

   if(percha === ""){
   alert("Elija una percha");
   return;
  }

  const newItem = {
    nombre: item ?? "",
    cantidad: c,
    stockMin: Number(stockMin ?? 0),
    costo: pu,
    descuento: d,
    iva: iva,
    subtotal: parseFloat(subtotal1),
    total: parseFloat(calcTotal),
    bodegaId: Number(bodega),
    seccionId: Number(seccion),
    perchaId: Number(percha),
    Observacion: observacion ?? ""
  };

  setsolicitudMaterial(prev => ({
    ...prev,
    itemsSolicitados: [
      ...(prev.itemsSolicitados),
      newItem
    ]
  }));

  setitem("");
  setcantidad(null);
  setstockMin(null);
  setprecioUni(null);
  setdescuento(null);
  setiva(false);
  //setbodega("");
  //setseccion("");
 // setpercha("");
  setobservacion("");
};


 const enviarygenerarActaDeEntrada = async() =>{
 console.log("hice clic en");
 
/* if (!solCompraId || solicitudMaterial.itemsSolicitados.length === 0) {
  alert("Debe llenar la informacion antes de generar la acta de entrada");
  return;
}*/

   const registroEntradaFinal = {
    proovedor:proovedor,
    factura: factura,
    total:total,
    itemsSolicitados:solicitudMaterial.itemsSolicitados
   }
  console.log("registroEntradaFinal");
  console.log(registroEntradaFinal);
   const res = await createActaEntrada(solCompraId,registroEntradaFinal);

   if(res.validate){
   alert(res.msj);
    setsolicitudMaterial({numOrden:"",numOrdenTrabajo:"",itemsSolicitados:[],id:0});
    window.open(`/pdf-entrada/${undefined}`,"_blank");
   }else{
    console.error(res);
   }
  

 }

useEffect(() => {
  if(proovedor != ""){
      const metodoExecProovedores = async()=>{
    const res = await findProovedorByNombre(proovedor);
    setproovedores(res);
    console.log(res);
  }
metodoExecProovedores();
  }else{
    setproovedores([]);
  }

}, [proovedor]);

useEffect(() => {
  if(item != ""){
      const metodoExecProovedores = async()=>{
    const res = await filtrarInventario(item);
    setitems(res);
    const existe = res.some(
        (r) => r.nombre.toLowerCase() === item.toLowerCase()
      );

      sethabilitarStockMin(existe);
  if(existe){
    const seleccionado = res.find(p => p.nombre === item);
    if (seleccionado) {
      setprecioUni(seleccionado.costo);
    }
  }else{
      setprecioUni(null);
    }
    console.log(res);
  }
metodoExecProovedores();
  }else{
    setitems([]);
  }

}, [item]);


useEffect(() => {
  try {
    const asignarBodegas = async()=>{
   const res = await getAllBodegas();
   setbodegas(res);
 }
 asignarBodegas();
  } catch (error) {
    console.error(error);
  }
 
}, []);

const selSecc = useRef<HTMLSelectElement|null>(null);

useEffect(() => {
  try {
    if(bodega !== ""){
      const asignarSecciones = async()=>{
   const res = await getSeccionesByBodega(bodega);
   setsecciones(res);
   setperchas([]);
   if (selSecc.current) {
  selSecc.current.value = "...";
}
 }
 asignarSecciones();
    }else{
      setsecciones([]);
    }
    
  } catch (error) {
    console.error(error);
  }
 
}, [bodega]);

useEffect(() => {
  try {
    if(seccion !== ""){
      const asignarPerchas = async()=>{
        console.log(seccion);
   const res = await getPerchasBySeccion(seccion);
   console.log(res);
   setperchas(res);
 }
 asignarPerchas();
    }else{
      setperchas([]);
    }
    
  } catch (error) {
    console.error(error);
  }
 
}, [seccion]);

 return (
  <>
    <div className="w-full h-full p-6 space-y-6">

      {/* Asignar solicitud */}
      <div className="w-full flex items-center justify-center">
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => { setventanaBuscarSolicitudMaterial(!ventanaBuscarSolicitudMaterial); }}
        >
          Asignar solicitud de material
        </button>
      </div>

      {/* Destino / Documento */}
      <div className="w-full bg-base-100 rounded-2xl shadow-md p-5">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-3">Destino / Documento</h2>

        <div className="flex gap-4 flex-wrap">
          <div className="flex gap-2 items-start min-w-[220px]">
            <div className="w-full">
              <label className="block text-sm text-gray-600 mb-1">Proveedor</label>
              <div className="relative">
                <input
                  className="input input-bordered w-full"
                  list="browsers"
                  value={proovedor}
                  onChange={(e) => setproovedor(e.target.value)}
                  placeholder="Buscar proveedor..."
                />
                <datalist id="browsers">
                  {proovedores?.map((p) =>
                    <option key={p.id} value={p.nombreComercial} />
                  )}
                </datalist>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-ghost btn-square ml-2 self-end"
              onClick={() => setventanaAgregarProovedor(!ventanaAgregarProovedor)}
              title="Agregar proveedor"
            >
              <img className="w-5 h-5" src="https://img.icons8.com/ios-glyphs/30/add-user-male.png" alt="add" />
            </button>
          </div>

          <div className="min-w-[180px] flex-1">
            <label className="block text-sm text-gray-600 mb-1">S/Factura</label>
            <input className="input input-bordered w-full" value={factura} onChange={(e) => setfactura(e.target.value)} />
          </div>

          <div className="min-w-[180px] flex-1">
            <label className="block text-sm text-gray-600 mb-1">N. Orden</label>
            <input className="input input-bordered w-full bg-gray-50" value={solicitudMaterial?.numOrdenTrabajo?.NumOrden} disabled />
          </div>

          <div className="min-w-[220px] flex-1">
            <label className="block text-sm text-gray-600 mb-1">N. Solicitud</label>
            <input className="input input-bordered w-full bg-gray-50" value={solicitudMaterial?.numOrden} disabled />
          </div>
        </div>
      </div>

      {/* Agregar ítems */}
      <div className="w-full bg-base-100 rounded-2xl shadow-md p-5">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-3">Agregar ítems</h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          <div className="md:col-span-6">
            <label className="block text-sm text-gray-600 mb-1">Descripción</label>
            <input
              className="input input-bordered w-full"
              list="browsers1"
              value={item}
              onChange={(e) => { const value = e.target.value; setitem(value); }}
              placeholder="Buscar o escribir descripción"
            />
            <datalist id="browsers1">
              {items?.map(p => (
                <option key={p.id} value={p.nombre} />
              ))}
            </datalist>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-gray-600 mb-1">Cantidad</label>
            <input className="input input-bordered w-full" placeholder="0" value={cantidad ?? ""} onChange={(e) => setcantidad(e.target.value)} />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-gray-600 mb-1">Stock Min.</label>
            <input className="input input-bordered w-full" disabled={habilitarStockMin} value={stockMin ?? ""} onChange={(e) => setstockMin(e.target.value)} />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-gray-600 mb-1">Precio U.</label>
            <input className="input input-bordered w-full" placeholder="0.00" value={precioUni ?? ""} onChange={(e) => setprecioUni(e.target.value)} />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-gray-600 mb-1">% Desc.</label>
            <input className="input input-bordered w-full" placeholder="0" value={descuento} onChange={(e) => setdescuento(e.target.value)} />
          </div>

          <div className="md:col-span-3 flex items-center gap-6">
            <div className="flex items-center gap-2">
              <input id="iva-no" type="radio" name="iva" checked={iva === false} onChange={() => setiva(false)} className="radio" />
              <label htmlFor="iva-no" className="text-sm">Sin IVA</label>
            </div>
            <div className="flex items-center gap-2">
              <input id="iva-si" type="radio" name="iva" checked={iva === true} onChange={() => setiva(true)} className="radio" />
              <label htmlFor="iva-si" className="text-sm">Con IVA</label>
            </div>
          </div>

          <div className="md:col-span-9">
            <label className="block text-sm text-gray-600 mb-1">Observación</label>
            <input className="input input-bordered w-full" placeholder="Observación del ítem" />
          </div>
        </div>
      </div>

      {/* Almacenamiento */}
      <div className="w-full bg-base-100 rounded-2xl shadow-md p-5">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-3">Almacenamiento</h2>

        <div className="flex gap-4 flex-wrap">
          <div className="w-full md:w-1/4">
            <label className="block text-sm text-gray-600 mb-1">Bodega</label>
            <select className="select select-bordered w-full" defaultValue={"..."} onChange={(e) => setbodega(e.target.value)}>
              <option value="..." disabled>Seleccione una bodega</option>
              {bodegas?.map(b => <option key={b.id} value={b.id}>{b.bodega}</option>)}
            </select>
          </div>

          <div className="w-full md:w-1/4">
            <label className="block text-sm text-gray-600 mb-1">Sección</label>
            <select className="select select-bordered w-full" ref={selSecc} defaultValue={"..."} onChange={(e) => setseccion(e.target.value)}>
              <option value="..." disabled>Seleccione una sección</option>
              {secciones?.map(s => <option key={s.id} value={s.id}>{s.seccion}</option>)}
            </select>
          </div>

          <div className="w-full md:w-1/4">
            <label className="block text-sm text-gray-600 mb-1">Percha</label>
            <select className="select select-bordered w-full" defaultValue={"..."} onChange={(e) => setpercha(e.target.value)}>
              <option value="..." disabled>Seleccione una percha</option>
              {perchas?.map(p => <option key={p.id} value={p.id}>{p.percha}</option>)}
            </select>
          </div>

          <div className="w-full md:w-1/2">
            <label className="block text-sm text-gray-600 mb-1">Observación</label>
            <textarea className="textarea textarea-bordered w-full" placeholder="Observación de almacenamiento" value={observacion} onChange={(e) => setobservacion(e.target.value)} />
          </div>
        </div>

        <div className="mt-4 flex justify-center">
          <button type="button" className="btn btn-success" onClick={agregarItemsActualizado}>Agregar</button>
        </div>
      </div>

      {/* Total y tabla */}
      <div className="w-full bg-base-100 rounded-2xl shadow-md p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-medium text-gray-600">TOTAL DOCUMENTO</h3>
            <div className="text-2xl font-bold text-yellow-500">{`$${total.toFixed(2)}`}</div>
          </div>
        </div>

        <div className="overflow-auto rounded-md border">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Descripción</th>
                <th>Cantidad</th>
                <th>Precio U.</th>
                <th>% Desc.</th>
                <th>Subtotal</th>
                <th>IVA</th>
                <th>Total</th>
                <th>Observación</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {solicitudMaterial?.itemsSolicitados?.map((s, i) =>
                <tr key={i}>
                  <td className="max-w-xs truncate">{s.nombre}</td>
                  <td>{s.cantidad}</td>
                  <td>{s.costo}</td>
                  <td>{s.descuento}</td>
                  <td>{s.subtotal}</td>
                  <td>{s.iva ? "15%" : "0%"}</td>
                  <td>{s.total.toFixed(2)}</td>
                  <td className="max-w-sm truncate">{s.Observacion}</td>
                  <td>
                    <button
                      className="btn btn-ghost btn-xs"
                      onClick={() => asignarCampos(i, s.nombre, s.cantidad, s.costo)}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <button type="button" className="btn btn-primary" onClick={enviarygenerarActaDeEntrada}>Generar</button>
      </div>
    </div>

    {/* Modal: Buscar solicitud (overlay) */}
    <div className={`z-10 fixed inset-0 flex items-center justify-center transition-opacity duration-300 ${ventanaBuscarSolicitudMaterial ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
      <div className="border border-gray-200 w-11/12 md:w-4/5 h-4/5 rounded-lg fixed bg-white shadow-lg overflow-hidden">
        <BuscarOrdenCompra ordenes={ordenes} setidSolMaterial={setsolCompraId} setventanaBuscarOrdenTrabajo={setventanaBuscarSolicitudMaterial} ventanaBuscarOrdenTrabajo={ventanaBuscarSolicitudMaterial} />
      </div>
    </div>

    {/* Modal: Crear proveedor */}
    <div className={`fixed inset-0 z-10 flex items-center justify-center bg-black/40 transition-opacity duration-300 ${ventanaAgregarProovedor ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
      <div className="bg-white w-11/12 md:w-4/5 max-w-5xl h-[78vh] rounded-lg shadow-xl overflow-y-auto">
        <CrearProovedor setventanaAgregarProovedor={setventanaAgregarProovedor} ventanaAgregarProovedor={ventanaAgregarProovedor} />
      </div>
    </div>
  </>
);

};
