import React, { useEffect, useState } from "react";
import { BuscarOrdenCompra } from "../../acta-de-salida/view/BuscarOrdenCompra";
import type { InfoPdfCompra } from "../../orden-de-compra/models/infoPdfCompra";
import { getAllSolicitudesParciales, ordenCompraById } from "../../orden-de-compra/controller/ordenCompraApi";
import type { BuscarSolMaterial } from "../../orden-de-compra/models/buscarSolMaterial";



export const CrearActaEntrada = () => {

    const [ventanaBuscarSolicitudMaterial, setventanaBuscarSolicitudMaterial] = useState(false);
    const [solicitudMaterial, setsolicitudMaterial] = useState<InfoPdfCompra>([{itemSolicitados:[]}]);
    
    const [ordenes, setordenes] = useState<BuscarSolMaterial[]>([]);


const cargarInfoSolMaterial = async(id:number) =>{
        const res = await ordenCompraById(id);
        setsolicitudMaterial(res);       
    }

   const metodoSolicitudesMaterialesEntradas = async() =>{
      
      const res = await getAllSolicitudesParciales();
      console.log(res);
      setordenes(res);
     }

     useEffect(() => {
      metodoSolicitudesMaterialesEntradas();
     }, []);
     

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
              <select className="select w-full">
                <option>...</option>
              </select>
            </div>

          

            <div className="flex-1 min-w-[180px]">
              <label className="block text-sm">S/Factura</label>
              <input className="input w-full"  />
            </div>

            <div className="flex-1 min-w-[180px]">
              <label className="block text-sm">N. Orden</label>
              <input className="input w-full"  disabled={true}/>
            </div>

            
            <div className="flex-1 min-w-[220px]">
              <label className="block text-sm">N. Solicitud</label>
              <input className="input w-full"  disabled={true}/>
            </div>

          </div>
        </div>

       
        <div className="w-full bg-gray-100 rounded-xl shadow-md p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Agregar ítems</h2>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          
            <div className="md:col-span-6">
              <label className="block text-sm">Descripción</label>
              <textarea className="textarea w-full" placeholder="Descripción del ítem" />
            </div>

           
            <div className="md:col-span-2">
              <label className="block text-sm">Cantidad</label>
              <input className="input w-full" placeholder="0" />
            </div>

           
            <div className="md:col-span-2">
              <label className="block text-sm">Stock Min.</label>
              <input className="input w-full" placeholder="—" />
            </div>

            
            <div className="md:col-span-2">
              <label className="block text-sm">Precio U.</label>
              <input className="input w-full" placeholder="0.00" />
            </div>

            
            <div className="md:col-span-2">
              <label className="block text-sm">% Desc.</label>
              <input className="input w-full" placeholder="0" />
            </div>

            
            <div className="md:col-span-3 flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input type="radio" name="iva" />
                Sin IVA
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="iva" />
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
              <input className="input w-full" placeholder="Bodega" />
            </div>

            <div className="w-full md:w-1/4">
              <label className="block text-sm">Sección</label>
              <input className="input w-full" placeholder="Sección" />
            </div>

            <div className="w-full md:w-1/4">
              <label className="block text-sm">Percha</label>
              <input className="input w-full" placeholder="Percha" />
            </div>

            <div className="w-full md:w-1/2">
              <label className="block text-sm">Observación</label>
              <textarea className="textarea w-full" placeholder="Observación de almacenamiento" />
            </div>
          </div>
          
        </div>
 <div className="mt-4 flex justify-center">
            <button type="button" className="btn">Agregar</button>
          </div>
        
        <div className="w-full bg-gray-50 rounded-xl shadow-md p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-medium">TOTAL DOCUMENTO</h3>
              <div className="text-2xl font-bold text-yellow-400">$0.00</div>
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
                  <th>Total</th>
                  <th>Observación</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={8} className="text-center text-gray-500 py-8">Aquí aparecerán los ítems agregados</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
<div className="mt-4 flex justify-center">
            <button type="button" className="btn">Generar</button>
          </div>
       
       

      </div>

       <div className={`z-10 fixed  bg-transparent inset-0 flex items-center justify-center transition-opacity duration-300 ${ventanaBuscarSolicitudMaterial ? "opacity-100" : "opacity-0 pointer-events-none"} `}>
                     <div className={`border border-gray-300 w-4/5 h-4/5 rounded-sm fixed  bg-white`}>
                    <BuscarOrdenCompra ordenes={ordenes} setidSolMaterial={cargarInfoSolMaterial} setventanaBuscarOrdenTrabajo={setventanaBuscarSolicitudMaterial} ventanaBuscarOrdenTrabajo={ventanaBuscarSolicitudMaterial}></BuscarOrdenCompra>
                     </div>
                     </div>
    </>
  );
};
