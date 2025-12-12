import React, { useEffect, useState } from 'react'
import type { InfoPdfEntrada } from '../models/infoPdfEntrada';
import { findAllRegistroEntrada } from '../controller/actaEntrada-api';

export const GestionEntrada = () => {
  
  const [actas, setactas] = useState<InfoPdfEntrada[]>([]);
  
  useEffect(() => {
    const llenarActas = async()=>{
     const res = await findAllRegistroEntrada();
     setactas(res);
     
    }
    llenarActas();
  }, []);
  
  const cargarPdf = async(id:number)=>{
  
    window.open(`/pdf-entrada/${id}`,"_blank");
  }
  
  
  return (
      <>
  <div className="min-w-[70%] min-h-[60%] rounded-xl border border-gray-200 m-4">
  <div className="bg-gray-200 w-full h-9 flex items-center justify-center mb-2 rounded-t-lg">
  <p>Listado de actas de entrada</p>
  </div>
  
  
  <div className="flex w-full p-5">
  <div className="dropdown w-[50%]">
  <div tabIndex={0} role="button" className="btn m-1">Mostrar 3 filas</div>
  <ul tabIndex={-1} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
  <li><a>Item 1</a></li>
  <li><a>Item 2</a></li>
  </ul>
  </div>
  
  
  <div className="flex justify-end w-[50%]">
  <div className="flex items-center">
  <p>Buscar:</p>
  <input className="input ml-2" type="text" placeholder="Buscar..." />
  </div>
  </div>
  </div>
  
  
  <div className="overflow-x-auto p-5">
  <table className="table w-full">
  <thead>
  <tr>
  <th>N.Acta de entrada</th>
  <th>Fecha de remisión</th>
  <th>Factura</th>
  <th>Recibe</th>
  <th>Destino</th>
  <th className='text-center'>Acciones</th>
  </tr>
  </thead>
  <tbody>
  {actas.map((u,i) => (
  <tr key={i} className="hover:bg-gray-50">
  <td>{u.numActa}</td>
  <td>{u.fechaRemision.split("T")[0]}</td>
  <td>{u.factura}</td>
  <td>{u.numSolicitudCompra.numOrdenTrabajo.userSolicitante.name}</td>
  <td>{u.numSolicitudCompra.Destino}</td>
  <td className="flex gap-2 justify-center">
  <button className="btn btn-ghost btn-xs" disabled={true}>Ver detalles</button>
  <button className="btn btn-ghost btn-xs" disabled={true}>Eliminar</button>
  <button className="btn btn-ghost btn-xs" onClick={()=>cargarPdf(u.numSolicitudCompra.id)}>Ver PDF</button>
  </td>
  </tr>
  ))}
  
  
  </tbody>
  </table>
  </div>
  </div>
  </>
  );
}
