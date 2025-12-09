import React, { useEffect, useState } from "react";
import { BuscarOrdenCompra } from "../../acta-de-salida/view/BuscarOrdenCompra";
import type { InfoPdfCompra } from "../../orden-de-compra/models/infoPdfCompra";
import { getAllSolicitudesParciales, ordenCompraById } from "../../orden-de-compra/controller/ordenCompraApi";
import type { BuscarSolMaterial } from "../../orden-de-compra/models/buscarSolMaterial";
import { asignarInfoActaEntrada } from "../../inventario/controller/inventario-api";
import type { AsignarInfoEntrada } from "../../inventario/models/AsignarInfoEntrada";



export const CrearActaEntrada = () => {

    const [ventanaBuscarSolicitudMaterial, setventanaBuscarSolicitudMaterial] = useState(false);
    const [solicitudMaterial, setsolicitudMaterial] = useState<AsignarInfoEntrada>({itemsSolicitados:[]});
    const [solCompraId, setsolCompraId] = useState<number>(0);
    const [total, settotal] = useState<number>(0.00);
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
    const [observacion, setobservacion] = useState("");
    
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
      metodoSolicitudesMaterialesEntradas();
     }, []);
     
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

  const newItem = {
    nombre: item ?? "",
    cantidad: c,
    stockMin: Number(stockMin ?? 0),
    costo: pu,
    descuento: d,
    iva: iva,
    subtotal: parseFloat(subtotal1),
    total: parseFloat(calcTotal),
    bodega: bodega ?? "",
    seccion: seccion ?? "",
    percha: percha ?? "",
    Observacion: observacion ?? ""
  };

  setsolicitudMaterial(prev => ({
    ...prev,
    itemsSolicitados: [
      ...(prev.itemsSolicitados ?? []),
      newItem
    ]
  }));

  setitem("");
  setcantidad(null);
  setstockMin(null);
  setprecioUni(null);
  setdescuento(null);
  setiva(false);
  setbodega("");
  setseccion("");
  setpercha("");
  setobservacion("");
};


 const enviarygenerarActaDeEntrada = async() =>{
   const registroEntradaFinal = {
    id:solCompraId,
    proovedor:proovedor,
    numFactura: factura,
    itemsSolicitados:solicitudMaterial.itemsSolicitados
   }

   console.log(registroEntradaFinal);
 }


  return (
    <>
      <div className="w-full h-full p-6 space-y-6">

       
        <div className="w-full flex items-center justify-center">
          <button type="button" className="btn" onClick={()=>{ setventanaBuscarSolicitudMaterial(!ventanaBuscarSolicitudMaterial);}}>Asignar solicitud de material</button>
        </div>

        
        <div className="w-full bg-gray-100 rounded-xl shadow-md p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Destino / Documento</h2>
<div className="flex gap-4 flex-wrap">

          <div className="flex-1 min-w-[180px]">
              <label className="block text-sm">Proovedor</label>
             <input className="input w-full"  value={proovedor} onChange={(e)=> setproovedor(e.target.value)}/>
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
              <input className="input w-full" placeholder="Bodega" value={bodega} onChange={(e)=> setbodega(e.target.value)}/>
            </div>

            <div className="w-full md:w-1/4">
              <label className="block text-sm">Sección</label>
              <input className="input w-full" placeholder="Sección" value={seccion} onChange={(e)=> setseccion(e.target.value)}/>
            </div>

            <div className="w-full md:w-1/4">
              <label className="block text-sm">Percha</label>
              <input className="input w-full" placeholder="Percha" value={percha} onChange={(e)=> setpercha(e.target.value)}/>
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
    </>
  );
};
