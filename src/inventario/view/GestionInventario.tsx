import React, { useEffect, useState } from 'react'
import type { Inventarios } from '../models/inventarios';
import { getInventario } from '../controller/inventario-api';


export const GestionInventario = () => {
  
  const [actas, setactas] = useState<Inventarios[]>([]);
  
  useEffect(() => {
    const llenarActas = async()=>{
     const res = await getInventario();
     setactas(res);   
    }
    llenarActas();
  }, []);
  

  
  
  return (
      <>
  <div className="min-w-[70%] min-h-[60%] rounded-xl border border-gray-200 m-4">
  <div className="bg-gray-200 w-full h-9 flex items-center justify-center mb-2 rounded-t-lg">
  <p>Listado de Inventarios</p>
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
  <th>Nombre</th>
  <th>Stock</th>
  <th>Costo</th>
  <th>Estado</th>
  <th>Bodega</th>
  <th className='text-center'>Acciones</th>
  </tr>
  </thead>
  <tbody>
  {actas.map((u,i) => (
  <tr key={i} className="hover:bg-gray-50">
  <td>{u?.nombre}</td>
  <td>{u?.stock}</td>
  <td>{u?.costo}</td>
  <td>{u?.estado ?"ACTIVO" :"INACTIVO"}</td>
  <td>{u?.bodega}</td>
  <td className="flex gap-2 justify-center">
  <button className="btn btn-ghost btn-xs" disabled={true}>Ver detalles</button>
  <button className="btn btn-ghost btn-xs" disabled={true}>Eliminar</button>
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
