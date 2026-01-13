

import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Line, Pie } from 'react-chartjs-2';

const MATERIAL_COLORS = [
  { bg: 'rgba(233, 30, 99, 0.7)', border: 'rgba(233, 30, 99, 1)' },      // Pink (vibrante)
  { bg: 'rgba(156, 39, 176, 0.7)', border: 'rgba(156, 39, 176, 1)' },    // Purple
  { bg: 'rgba(63, 81, 181, 0.7)', border: 'rgba(63, 81, 181, 1)' },      // Indigo
  { bg: 'rgba(33, 150, 243, 0.7)', border: 'rgba(33, 150, 243, 1)' },    // Blue
  { bg: 'rgba(0, 188, 212, 0.7)', border: 'rgba(0, 188, 212, 1)' },      // Cyan
  { bg: 'rgba(0, 150, 136, 0.7)', border: 'rgba(0, 150, 136, 1)' },      // Teal
  { bg: 'rgba(76, 175, 80, 0.7)', border: 'rgba(76, 175, 80, 1)' },      // Green
  { bg: 'rgba(255, 193, 7, 0.7)', border: 'rgba(255, 193, 7, 1)' },      // Amber
  { bg: 'rgba(255, 87, 34, 0.7)', border: 'rgba(255, 87, 34, 1)' },      // Deep Orange
  { bg: 'rgba(244, 67, 54, 0.7)', border: 'rgba(244, 67, 54, 1)' },      // Red
];

const getColorsByLength = (length: number) => {
  const colors = [];
  for (let i = 0; i < length; i++) {
    colors.push(MATERIAL_COLORS[i % MATERIAL_COLORS.length]);
  }
  return colors;
};

export const DbLogistica = () => {
const API = "http://localhost:3000/dashboard"; 
const [loading, setloading] = useState(true);
    const [logistica, setlogistica] = useState<{totalStock:{total:number},
        totalRegEntrada:number,
        totalItemsEntrada:{cantidad:number},
        totalRegSalida:number,
        totalItemsSalida:{cantidad:number}}|null>(null);
    const [entradasPorDia, setentradasPorDia] = useState<{fechaRemision:string,total:number}[]|null>(null);
    const [salidasPorDia, setsalidasPorDia] = useState<{fechaRemision:string,total:number}[]|null>(null);

    useEffect(() => {

     let mounted = true;   
 
         const load = async()=>{
    try { 
        const [entradasDia,totalesLog,salidasDia] = await Promise.all([
            axios.get(`${API}/entradas-por-dia?days=30`).then((r)=>r.data),
            axios.get(`${API}/logistica`).then((r)=>r.data),
            axios.get(`${API}/salidas-por-dia?days=30`).then((r)=>r.data),
        ]);

        if(!mounted) return;

        setentradasPorDia(entradasDia);
        setlogistica(totalesLog);
        setsalidasPorDia(salidasDia);
        
} catch (error) {
        console.error("Error cargando dashboard:", err);
     }finally{
setloading(false);
     }
    };

      load();
    return ()=> mounted = false
     
    }, []);

    if(loading) return <div>Cargando...</div>;
     if (!entradasPorDia) {
  return (
    <div className="p-6 text-error">
      Error cargando datos del dashboard
    </div>
  );}
    
  return (
    <div className='p-6 h-full w-full space-y-6'>

     <div className='grid grid-cols-2 sm:grid-cols-5 gap-4'>
         <div className='card p-4 bg-base-100 border'>
          <div className='text-sm text-gray-500'>Total Stock</div>
          <div className='text-2xl font-semibold'>{logistica?.totalStock.total ?? 0}</div>   
         </div>
         <div className='card p-4 bg-base-100 border'>
               <div className='text-sm text-gray-500'>Total registros entrada</div>
               <div className='text-2xl font-semibold'>{logistica?.totalRegEntrada}</div>
         </div>
          <div className='card p-4 bg-base-100 border'>
               <div className='text-sm text-gray-500'>Total items entrada</div>
               <div className='text-2xl font-semibold'>{logistica?.totalItemsEntrada.cantidad}</div>
         </div>
          <div className='card p-4 bg-base-100 border'>
               <div className='text-sm text-gray-500'>Total registros salida</div>
               <div className='text-2xl font-semibold'>{logistica?.totalRegSalida}</div>
         </div>
          <div className='card p-4 bg-base-100 border'>
               <div className='text-sm text-gray-500'>Total items salida</div>
               <div className='text-2xl font-semibold'>{logistica?.totalItemsSalida.cantidad}</div>
         </div>
     </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <div className='card p-4 bg-base-100 border'>
            <h3 className='font-medium mb-4'>Entradas (últimos 30 días)</h3>
            <Line
            data={{
                labels:entradasPorDia.map((d)=>d.fechaRemision.split("T")[0]),
                datasets:[
                    {data:entradasPorDia.map((t)=>t.total),
                       
                    },
                ]
            }}
            options={
                {
                    responsive:true,
                    maintainAspectRatio:true,
                    plugins:{legend:{display:false}},
                }
            }
            />
        </div>
        <div className='card bg-base-100 border p-4'>
          <div className='font-medium mb-4'>Salidas (últimos 30 días)</div>
          <Line 
          data={{
            labels: salidasPorDia?.map((d)=>d.fechaRemision.split("T")[0]),
            datasets:[{
              data: salidasPorDia?.map((f)=>f.total)
            }]
          }}
          options={{ responsive:true,maintainAspectRatio:true,plugins:{legend:{display:false}},scales:{
            x:{
              ticks:{
                maxRotation:20,
                minRotation:20
              }
            }
          }}}
          />
        </div>
        
      </div>
      <div className='grid grid-cols-1 '>
       <div className='card p-4 bg-base-100 border mb-4'>
        <div className='font-medium mb-4'>Historial items ingresados y salientes</div>
        <div className='h-100 w-full flex justify-center'>
        {(() => {
          const colors = getColorsByLength(2);
          return (
            <Pie
            data={{
              labels: ['Entrada','Salida'],
              datasets:[
                {data:[logistica?.totalItemsEntrada?.cantidad ??0,logistica?.totalItemsSalida?.cantidad ?? 0],
                  backgroundColor:[
                    colors[0].bg,
                    colors[1].bg
                  ],
                  borderColor:[
                    colors[0].border,
                    colors[1].border
                  ],
                  borderWidth: 2
                }
              ]
            }}
            options={{maintainAspectRatio:false}}
            />
          );
        })()}
        </div>
       </div>
      </div>
    </div>
  )
}
