

import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2';

export const DbLogistica = () => {
const API = "http://localhost:3000/dashboard"; 
const [loading, setloading] = useState(true);
    const [entradasPorDia, setentradasPorDia] = useState<{fechaRemision:string,total:number}[]|null>(null);

    useEffect(() => {

     let mounted = true;   
 
         const load = async()=>{
    try { 
        const [entradasDia] = await Promise.all([
            axios.get(`${API}/entradas-por-dia?days=30`).then((r)=>r.data)
        ]);

        if(!mounted) return;

        setentradasPorDia(entradasDia);
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
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <div className='card p-4 bg-base-100 border'>
            <h3>Entradas (últimos 30 días)</h3>
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
                    plugins:{legend:false},
                }
            }
            />
        </div>
        
      </div>
    </div>
  )
}
