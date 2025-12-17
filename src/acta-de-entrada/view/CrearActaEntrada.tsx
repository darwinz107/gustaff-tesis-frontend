import React, { useEffect, useRef, useState } from "react";
import { BuscarOrdenCompra } from "../../acta-de-salida/view/BuscarOrdenCompra";
import type { InfoPdfCompra } from "../../orden-de-compra/models/infoPdfCompra";
import { getAllSolicitudesParciales, ordenCompraById } from "../../orden-de-compra/controller/ordenCompraApi";
import type { BuscarSolMaterial } from "../../orden-de-compra/models/buscarSolMaterial";
import { asignarInfoActaEntrada } from "../../inventario/controller/inventario-api";
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
    
    const [ordenes, setordenes] = useState<BuscarSolMaterial[]>([]);


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

 const asignarCampos = (index:number,item:string,cantidad:number,preciU:number) => {

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
 
 if (!solCompraId || solicitudMaterial.itemsSolicitados.length === 0) {
  alert("Debe llenar la informacion antes de generar la acta de entrada");
  return;
}

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
    window.open(`/pdf-entrada/${solCompraId}`,"_blank");
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

       
        <div className="w-full flex items-center justify-center">
          <button type="button" className="btn" onClick={()=>{ setventanaBuscarSolicitudMaterial(!ventanaBuscarSolicitudMaterial);}}>Asignar solicitud de material</button>
        </div>

        
        <div className="w-full bg-gray-100 rounded-xl shadow-md p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Destino / Documento</h2>
<div className="flex gap-4 flex-wrap">

          <div className="flex flex-row min-w-[180px]">
             <div>  <label className="block text-sm">Proovedor</label>
              <div className=" w-full">
                
 <input className="input w-full" list="browsers" value={proovedor}  onChange={(e)=> setproovedor(e.target.value)}/>
<datalist id="browsers">
 {proovedores?.map((p)=>
<option value={p.nombreComercial} onChange={(e)=>setproovedor(e.target.value)}></option>
) 
}
</datalist>

</div>
</div>
     <div className="flex items-center justify-center">    <button
    type="button"
    className=" text-gray-500 cursor-pointer"
    onClick={()=>setventanaAgregarProovedor(!ventanaAgregarProovedor)}
  >
    <img className="w-5 h-5" src="https://img.icons8.com/ios-glyphs/30/add-user-male.png" alt="add-user-male"/>
  </button>  
  </div>    
            </div>

          

            <div className="flex-1 min-w-[180px]">
              <label className="block text-sm">S/Factura</label>
              <input className="input w-full"  value={factura} onChange={(e)=> setfactura(e.target.value)}/>
            </div>

            <div className="flex-1 min-w-[180px]">
              <label className="block text-sm">N. Orden</label>
              <input className="input w-full" value={solicitudMaterial?.numOrdenTrabajo?.NumOrden} disabled={true}/>
            </div>

            
            <div className="flex-1 min-w-[220px]">
              <label className="block text-sm">N. Solicitud</label>
              <input className="input w-full" value={solicitudMaterial?.numOrden}  disabled={true}/>
            </div>

          </div>
        </div>

       
        <div className="w-full bg-gray-100 rounded-xl shadow-md p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Agregar ítems</h2>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          
            <div className="md:col-span-6">
              <label className="block text-sm">Descripción</label>
              <textarea className="textarea w-full" placeholder="Descripción del ítem" value={item} onChange={(e)=> setitem(e.target.value)}/>
            </div>

           
            <div className="md:col-span-2">
              <label className="block text-sm">Cantidad</label>
              <input className="input w-full" placeholder="0" value={cantidad??""} onChange={(e)=> setcantidad(e.target.value)}/>
            </div>

           
            <div className="md:col-span-2">
              <label className="block text-sm">Stock Min.</label>
              <input className="input w-full" placeholder="—" value={stockMin??""} onChange={(e)=> setstockMin(e.target.value)}/>
            </div>

            
            <div className="md:col-span-2">
              <label className="block text-sm">Precio U.</label>
              <input className="input w-full" placeholder="0.00" value={precioUni??""} onChange={(e)=> setprecioUni(e.target.value)}/>
            </div>

            
            <div className="md:col-span-2">
              <label className="block text-sm">% Desc.</label>
              <input className="input w-full" placeholder="0" value={descuento} onChange={(e)=> setdescuento(e.target.value)}/>
            </div>

            
            <div className="md:col-span-3 flex items-center gap-4">
              <label>
  <input type="radio" name="iva" checked={iva === false} onChange={() => setiva(false)}/>
  Sin IVA
</label>

<label>
  <input type="radio" name="iva" checked={iva === true} onChange={() => setiva(true)}/>
  Con IVA
</label>

            </div>

            
            <div className="md:col-span-9">
              <label className="block text-sm">Observación</label>
              <input className="input w-full" placeholder="Observación del ítem" />
            </div>
          </div>

         
        </div>

        
        <div className="w-full bg-gray-100 rounded-xl shadow-md p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Almacenamiento</h2>

          <div className="flex gap-4 flex-wrap">
            <div className="w-full md:w-1/4">
              <label className="block text-sm">Bodega</label> 
              <select className="select w-full" defaultValue={"..."} onChange={(e)=>setbodega(e.target.value)}>
                <option value="..." disabled={true} defaultChecked={true}>Seleccione una bodega</option>
      {bodegas?.map(bodega => (
        <option key={bodega.id} value={bodega.id}>{bodega.bodega}</option>
      ))}
              </select>
            </div>

            <div className="w-full md:w-1/4">
              <label className="block text-sm">Sección</label>
              <select className="select w-full" ref={selSecc} defaultValue={"..."} onChange={(e)=>setseccion(e.target.value)}>
                      <option value="..." disabled={true} defaultChecked={true}>Seleccione una sección</option>
      {secciones?.map(seccion => (
        <option key={seccion.id} value={seccion.id}>{seccion.seccion}</option>
      ))}

              </select>
            </div>

            <div className="w-full md:w-1/4">
              <label className="block text-sm">Percha</label>
             <select className="select w-full" defaultValue={"..."} onChange={(e)=>setpercha(e.target.value)}>
                      <option value="..." disabled={true} defaultChecked={true}>Seleccione una percha</option>
      {perchas?.map(percha => (
        <option key={percha.id} value={percha.id}>{percha.percha}</option>
      ))}

              </select>
            </div>

            <div className="w-full md:w-1/2">
              <label className="block text-sm">Observación</label>
              <textarea className="textarea w-full" placeholder="Observación de almacenamiento" value={observacion} onChange={(e)=> setobservacion(e.target.value)}/>
            </div>
          </div>
          
        </div>
 <div className="mt-4 flex justify-center">
            <button type="button" className="btn" onClick={agregarItemsActualizado}>Agregar</button>
          </div>
        
        <div className="w-full bg-gray-50 rounded-xl shadow-md p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-medium">TOTAL DOCUMENTO</h3>
              <div className="text-2xl font-bold text-yellow-400">{`$${total.toFixed(2)}`}</div>
            </div>

            
          </div>

          <div className="overflow-x-auto">
            <table className="table w-full">
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
               
                  {solicitudMaterial?.itemsSolicitados?.map((s,i)=>
                     <tr key={i}>
                   <td>{s.nombre}</td>
                   <td>{s.cantidad}</td>
                   <td>{s.costo}</td>
                   <td>{s.descuento}</td>
                   <td>{s.subtotal}</td>
                   <td>{s.iva ?"15%":"0%"}</td>
                   <td>{s.total.toFixed(2)}</td>
                   <td>{s.Observacion}</td>
                  <td>
  <button 
    className="btn"
    onClick={() =>
      asignarCampos(
        i,
        s.nombre,
        s.cantidad,
        s.costo 
      )
    }
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
            <button type="button" className="btn" onClick={enviarygenerarActaDeEntrada}>Generar</button>
          </div>
       
       

      </div>

       <div className={`z-10 fixed  bg-transparent inset-0 flex items-center justify-center transition-opacity duration-300 ${ventanaBuscarSolicitudMaterial ? "opacity-100" : "opacity-0 pointer-events-none"} `}>
                     <div className={`border border-gray-300 w-4/5 h-4/5 rounded-sm fixed  bg-white`}>
                    <BuscarOrdenCompra ordenes={ordenes} setidSolMaterial={setsolCompraId} setventanaBuscarOrdenTrabajo={setventanaBuscarSolicitudMaterial} ventanaBuscarOrdenTrabajo={ventanaBuscarSolicitudMaterial}></BuscarOrdenCompra>
                     </div>
                     </div>

           <div
  className={`fixed inset-0 z-10 flex items-center justify-center bg-black/40 transition-opacity duration-300
    ${ventanaAgregarProovedor ? "opacity-100" : "opacity-0 pointer-events-none"}
  `}
>
<div className="bg-white w-4/5 max-w-5xl h-[78vh] rounded-lg shadow-xl overflow-y-auto">
  <CrearProovedor
    setventanaAgregarProovedor={setventanaAgregarProovedor}
    ventanaAgregarProovedor={ventanaAgregarProovedor}
  />
</div>
</div>           
    </>
  );
};
