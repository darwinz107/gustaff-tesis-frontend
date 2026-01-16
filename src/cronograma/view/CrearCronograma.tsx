import React, { useEffect, useState } from 'react'
import type { MaquinaInfo } from '../controller/cronograma-api'
import { obtenerTiposMantenimiento, obtenerPeriodos } from '../controller/cronograma-api'
import { getUsers } from '../../user/controller/api/user-api'
import { getInventario, filtrarInventario } from '../../inventario/controller/inventario-api'
import type { Inventarios } from '../../inventario/models/inventarios'

export const CrearCronograma = ({ maquinaId }: { maquinaId?: MaquinaInfo }) => {
  const [infoMaquina, setinfoMaquina] = useState<MaquinaInfo | null>(null);
  const [tiposMantenimiento, settiposMantenimiento] = useState<{ id: number; inicial: string; mantenimiento: string }[]>([]);
  const [periodos, setperiodos] = useState<{ id: number; nombre: string }[]>([]);
  const [users, setusers] = useState<{ name: string }[]>([]);
  const [ventanaEmergente, setventanaEmergente] = useState(false);
  const [inventarios, setinventarios] = useState<Inventarios[]>([]);
  const [buscarItem, setbuscarItem] = useState("");
  const [item, setitem] = useState("");
  const [cantidad, setcantidad] = useState(0);
  const [observacion, setobservacion] = useState("");
  const [repuestosAgregados, setrepuestosAgregados] = useState<{item: string; cantidad: number; observacion: string}[]>([]);
  const [erroresRepuestos, seterroresRepuestos] = useState({cantidad: "", item: ""});

  useEffect(() => {
    if (maquinaId !== undefined && maquinaId !== null) {
      setinfoMaquina(maquinaId);
    }
  }, [maquinaId]);

  const metodoInventarios = async() => {
    const resInv = await getInventario();
    setinventarios(resInv);
  }

  useEffect(() => {
    const cargarDatos = async () => {
      const tipos = await obtenerTiposMantenimiento();
      settiposMantenimiento(tipos);
      
      const periods = await obtenerPeriodos();
      setperiodos(periods);

      const usersData = await getUsers();
      setusers(usersData);
    };
    cargarDatos();
    metodoInventarios();
  }, []);

  useEffect(() => {
    if(buscarItem != ""){
      const funcionBuscarItem = async() => {
        const res = await filtrarInventario(buscarItem);
        setinventarios(res);
      }
      funcionBuscarItem();
    } else {
      const funcionRegresarInventario = async() => {
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
    return "";
  };

  const funcionAgregarRepuesto = () => {
    const errorCantidad = validarCantidadItem(cantidad);
    const errorItem = validarItemField(item);
    
    seterroresRepuestos({ cantidad: errorCantidad, item: errorItem });
    
    if (errorCantidad || errorItem) {
      return;
    }

    const existeItem = repuestosAgregados.some((i) => i.item === item);
    
    if(existeItem){
      seterroresRepuestos({ cantidad: "", item: "Error! Item ya ingresado." });
      setTimeout(() => {
        seterroresRepuestos({ cantidad: "", item: "" });
      }, 3000);
      return;
    }

    setrepuestosAgregados(prev => [
      ...prev,
      { item: item, cantidad: Number(cantidad), observacion: observacion }
    ]);

    seterroresRepuestos({ cantidad: "", item: "" });
    setcantidad(0);
    setitem("");
    setobservacion("");
  };

  const funcionEliminarRepuesto = (index: number) => {
    const newArray = repuestosAgregados.filter((_, i) => i !== index);
    setrepuestosAgregados(newArray);
  };

  return (
   <>
   <div className='w-full h-full rounded-2xl border border-gray-200 shadow-lg'>
     <div className="bg-gradient-to-r from-green-500 to-green-600 w-full py-4 rounded-t-2xl border-b border-green-200 px-6">
        <h2 className="font-bold text-white text-lg">📋 Crear Cronograma</h2>
      </div>
    <form className='p-6 space-y-6'>

        <div className='bg-white rounded-xl p-4 border border-gray-100 shadow-sm '>
        <h3 className='text-sm font-semibold uppercase tracking-wider text-gray-700 mb-4 pb-3 border-b border-green-200'>Equipo</h3>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='flex flex-col'>
            <label className='text-xs font-semibold uppercase text-gray-700 tracking-wider'>Area</label>
            <input disabled value={infoMaquina?.area || ''} className='input input-sm input-ghost w-full mt-2 rounded-lg mt-2' type="text" />

        </div>
          <div className='flex flex-col'>
            <label className='text-xs font-semibold uppercase text-gray-700 tracking-wider'>Codigo</label>
            <input disabled value={infoMaquina?.codigo || ''} className='input input-sm input-ghost w-full mt-2 rounded-lg mt-2' type="text" />

        </div>
          <div className='flex flex-col'>
            <label className='text-xs font-semibold uppercase text-gray-700 tracking-wider'>Maquina</label>
            <input disabled value={infoMaquina?.nombre || ''} className='input input-sm input-ghost w-full mt-2 rounded-lg mt-2' type="text" />

        </div>
        </div>
        </div>

    <div className='bg-white rounded-xl p-4 border border-gray-100 shadow-sm'> 
        <h3 className='text-sm font-semibold uppercase tracking-wider text-gray-700 mb-4 pb-3 border-b border-green-200'>Programacion</h3>
     <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div>
            <label className='text-xs font-semibold uppercase text-gray-700 tracking-wider'>Fecha de planificacion</label>
            <input type="date" className='input input-sm mt-2'/>
        </div>

 <div className='flex flex-col'>
            <label className='text-xs font-semibold uppercase text-gray-700 tracking-wider'>Tipo de mantenimiento</label>
             <select className=' select select-sm select-bordered w-full mt-2 focus:select-primary rounded-lg'>
            <option value="">Seleccione tipo de mantenimiento</option>
            {tiposMantenimiento.map((tipo) => (
              <option key={tipo.id} value={tipo.mantenimiento}>
                {tipo.inicial} - {tipo.mantenimiento}
              </option>
            ))}
        </select>
        </div>

         <div className='flex flex-col'>
            <label className='text-xs font-semibold uppercase text-gray-700 tracking-wider'>Periodo</label>
             <select className='select select-sm select-bordered w-full mt-2 focus:select-primary rounded-lg'>
            <option value="">Seleccione un período</option>
            {periodos.map((periodo) => (
              <option key={periodo.id} value={periodo.nombre}>
                {periodo.nombre}
              </option>
            ))}
        </select>
        </div>

         <div>
            <label className='text-xs font-semibold uppercase text-gray-700 tracking-wider'>Descripcion del trabajo</label>
            <textarea className='textarea textarea-sm w-full mt-2' ></textarea>
        </div>
     </div>
    </div>

    <div className='bg-white rounded-xl p-4 border border-gray-100 shadow-sm'>
    <h3 className='text-sm font-semibold uppercase tracking-wider text-gray-700 mb-4 pb-3 border-b border-green-200'>Responsables</h3>
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
       <div className='flex flex-col'>
        <label className='text-xs font-semibold uppercase text-gray-700 tracking-wider'>Tecnico 1</label>
        <select className='select select-sm select-bordered w-full mt-2 focus:select-primary rounded-lg'>
            <option value="">Seleccione un tecnico</option>
            {users.map((u) => <option key={u.name} value={u.name}>{u.name}</option>)}
        </select>
       </div>
         <div className='flex flex-col'>
        <label className='text-xs font-semibold uppercase text-gray-700 tracking-wider'>Tecnico 2</label>
        <select className='select select-sm select-bordered w-full mt-2 focus:select-primary rounded-lg'>
            <option value="">Seleccione un tecnico</option>
            {users.map((u) => <option key={u.name} value={u.name}>{u.name}</option>)}
        </select>
       </div>
    </div>
    </div>

<div className='bg-white rounded-xl p-4 border border-gray-100 shadow-sm'>
    <h3 className='text-sm font-semibold uppercase tracking-wider text-gray-700 mb-4 pb-3 border-b border-green-200'>Repuestos</h3>
    <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4'>
       <div className='flex flex-col'>
        <label className='text-xs font-semibold uppercase text-gray-700 tracking-wider'>Cantidad</label>
        <input 
          type="number" 
          className={`input input-sm input-bordered mt-2 rounded-lg ${erroresRepuestos.cantidad ? 'input-error' : ''}`}
          placeholder="0"
          value={cantidad === 0 ? "" : cantidad}
          onChange={(e) => setcantidad(e.target.value)}
        />
        {erroresRepuestos.cantidad && <p className="text-red-500 text-xs mt-1">{erroresRepuestos.cantidad}</p>}
       </div>
       <div className='flex flex-col'>
        <label className='text-xs font-semibold uppercase text-gray-700 tracking-wider'>Item</label>
        <div className="relative mt-2">
          <input
            className={`input input-sm input-bordered w-full pr-10 focus:input-primary rounded-lg ${erroresRepuestos.item ? 'input-error' : ''}`}
            placeholder="Buscar item..."
            value={item}
            onChange={(e) => setitem(e.target.value)}
          />
          <button
            type="button"
            className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 z-20 text-gray-500 hover:text-green-600 transition"
            onClick={() => setventanaEmergente(!ventanaEmergente)}
          >
            🔎
          </button>
        </div>
        {erroresRepuestos.item && <p className="text-red-500 text-xs mt-1">{erroresRepuestos.item}</p>}
       </div>
       <div className='flex flex-col'>
        <label className='text-xs font-semibold uppercase text-gray-700 tracking-wider'>Observacion</label>
        <input 
          type="text" 
          className='input input-sm input-bordered mt-2 rounded-lg'
          placeholder="Notas adicionales..."
          value={observacion}
          onChange={(e) => setobservacion(e.target.value)}
        />
       </div>
    </div>
    <button type="button" className='btn btn-sm bg-green-500 hover:bg-green-600 text-white border-0 gap-2' onClick={funcionAgregarRepuesto}>
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"/></svg>
      Agregar Repuesto
    </button>
</div>

        <div className='bg-white rounded-xl p-4 border border-gray-100 shadow-sm'>
            <h3 className='text-sm font-semibold uppercase tracking-wider text-gray-700 mb-4 pb-3 border-b border-green-200'>Lista de repuestos</h3>
            <div className='overflow-auto max-h-80 border border-gray-200 rounded-lg'>
            <table className='table w-full'>
                <thead>
                    <tr className='bg-gray-50'>
                        <th>Cantidad</th>
                        <th>Item</th>
                        <th>Observación</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {repuestosAgregados?.map((repuesto, i) => (
                      <tr key={i} className='hover:bg-gray-50'>
                        <td><span className='badge badge-sm'>{repuesto.cantidad}</span></td>
                        <td>{repuesto.item}</td>
                        <td>{repuesto.observacion}</td>
                        <td><button type="button" className='btn btn-sm btn-error' onClick={() => funcionEliminarRepuesto(i)}>🗑️ Eliminar</button></td>
                      </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </div>
    </form>
   </div>

   <div className={` fixed inset-0 z-50 flex items-center justify-center transition-opacity ${ventanaEmergente ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
      <div className="bg-white w-11/12 md:w-2/5 max-h-[80vh] rounded-2xl shadow-2xl border border-gray-200 flex flex-col">
        <div className="bg-gradient-to-r from-green-500 to-green-600 flex justify-between items-center px-6 py-4 border-b border-green-200 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xl">📦</span>
            <div>
              <span className="font-bold text-white text-lg">Seleccionar Items</span>
              <p className="text-green-100 text-xs">Elige los artículos que necesitas</p>
            </div>
          </div>
          <button onClick={() => setventanaEmergente(false)} className="btn btn-circle btn-sm btn-ghost text-white hover:bg-green-700">✕</button>
        </div>

        <div className="p-6 flex-1 flex flex-col overflow-hidden">
          <div className="mb-4">
            <label className="text-sm font-semibold text-gray-700 block mb-2">🔍 Buscar item</label>
            <input className="input input-bordered w-full rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-400" placeholder="Escribe el nombre del artículo..." onChange={(e) => setbuscarItem(e.target.value)} />
          </div>

          <div className="overflow-y-auto overflow-x-auto flex-1 border border-gray-200 rounded-lg">
            <table className="table table-sm">
              <thead className='bg-gradient-to-r from-green-100 to-green-50 border-b-2 border-green-300 sticky top-0'>
                <tr>
                  <th className='text-green-900'>Nombre</th>
                  <th className='text-green-900'>Stock</th>
                  <th className='text-green-900'>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {inventarios.map((i) => (
                  <tr key={i.nombre} className='hover:bg-green-50 border-b border-gray-200'>
                    <td className='font-medium text-gray-800'>{i.nombre}</td>
                    <td className='text-gray-700'><span className='badge badge-lg badge-success'>{i.stock}</span></td>
                    <td>
                      <button
                        className="btn btn-sm bg-gradient-to-r from-green-500 to-green-600 text-white border-none hover:from-green-600 hover:to-green-700 rounded-lg"
                        onClick={() => { setitem(i.nombre); setventanaEmergente(false); setbuscarItem(""); }}
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
  )
}
