import { useEffect, useState } from "react"
import { NuevosRegistros } from "./components/NuevosRegistros"
import { logoutSession } from "../controller/api/admin-api";
import { useNavigate, useParams } from "react-router-dom";
import { CrearOrden } from "../../orden-de-trabajo/view/components/CrearOrden";
import { HistorialOrdenes } from "../../orden-de-trabajo/view/components/HistorialOrdenes";
import { VerDetalles } from "../../orden-de-trabajo/view/components/VerDetalles";
import { AdministrarUsuarios } from "./components/administrarUsuarios";
import { OrdenCompra } from "../../orden-de-compra/view/ordenCompra";
import { GestionCompra } from "../../orden-de-compra/view/GestionCompra";
import { CrearActaSalida } from "../../acta-de-salida/view/CrearActaSalida";
import { GestionEntrada } from "../../acta-de-entrada/view/GestionEntrada";
import { CrearActaEntrada } from "../../acta-de-entrada/view/CrearActaEntrada";
import { GestionSalida } from "../../acta-de-salida/view/GestionSalida";
import { GestionInventario } from "../../inventario/view/GestionInventario";
import { getLastSolicitud } from "../../orden-de-trabajo/controller/api/orden-api";



export const Principal = () => {
     const [ventanaEmergente, setventanaEmergente] = useState(false);
    const [principal, setprincipal] = useState(false);
    const [nuevoRegistro, setnuevoRegistro] = useState(false);
    const [cargarAuto, setcargarAuto] = useState(false);
    const navigate = useNavigate();
    const [sendId, setsendId] = useState<Number|null>(null);

useEffect(() => {

  if(cargarAuto){
    const asignarId = async()=>{
      const res = await getLastSolicitud(undefined);
      console.log(res.id);
      setsendId(res.id);
    }
    asignarId();
   setcargarComponente(5);
  }
  setcargarAuto(false);
}, [cargarAuto]);

    const terminarSesion = async()=>{
try {
       const res = await logoutSession();
      alert(res.msj);
      navigate('/');
} catch (error) {
      console.error("Error al cargar la api: ",error);
}
 
    }
     const componentes = 
      {
        0:<></>,
        1:<CrearOrden setcargarAuto={setcargarAuto}></CrearOrden>,
        2:<HistorialOrdenes></HistorialOrdenes>,
        3:<NuevosRegistros></NuevosRegistros>,
        4:<AdministrarUsuarios></AdministrarUsuarios>,
        5:<OrdenCompra id={sendId}></OrdenCompra>,
        6:<GestionCompra></GestionCompra>,
        7:<CrearActaEntrada></CrearActaEntrada>,
        8:<GestionEntrada></GestionEntrada>,
        9:<CrearActaSalida></CrearActaSalida>,
        10:<GestionSalida></GestionSalida>,
        11:<GestionInventario></GestionInventario>
      }
    
      const [cargarComponente, setcargarComponente] = useState(0);



  return (
    <>
                <div className='flex  h-screen w-auto bg-pink-200'>
        <div className='absolute inset-y-0 left-0 h-full w-1/5 z-0 bg-white border-r border-gray-300 flex flex-col'>
        <img src="public\logo_alternativo.png" className='cursor-pointer my-7' alt="Gustaff S.A" onClick={()=>setcargarComponente(0)}/>
        <div className='flex flex-col h-full'> 
   <div className='min-w-min border-y border-gray-300 mx-4'>
     <div className="w-full dropdown dropdown-hover" >
  <div tabIndex={0} role="button" className="btn w-full border-none" >Usuarios</div>
  <ul tabIndex="-1" className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm w-full ">
    <li><a onClick={()=>setcargarComponente(4)}>Gestion de usuarios</a></li>
  </ul>
</div>
  <div className="w-full dropdown dropdown-hover" >
  <div tabIndex={0} role="button" className="btn w-full border-none" >Parametros del sistema</div>
  <ul tabIndex="-1" className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm w-full ">
    <li><a onClick={()=>setcargarComponente(3)}>Nuevo parametro</a></li>
    <li><a>Gestion de parametros</a></li>
  </ul>
</div>
<div className="w-full dropdown dropdown-hover" >
  <div tabIndex={0} role="button" className="btn w-full border-none" >Orden de trabajo</div>
  <ul tabIndex="-1" className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm w-full ">
    <li><a onClick={()=>setcargarComponente(1)}>Nueva orden</a></li>
    <li><a onClick={()=>setcargarComponente(2)}>Gestion de orden</a></li>
  </ul>
</div>
<div className="w-full dropdown dropdown-hover" >
  <div tabIndex={0} role="button" className="btn w-full border-none" >Solicitud de materiales</div>
  <ul tabIndex="-1" className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm w-full ">
    <li><a onClick={()=>setcargarComponente(5)}>Nueva solicitud</a></li>
    <li><a onClick={()=>setcargarComponente(6)}>Gestion de solicitud</a></li>
  </ul>
</div>
<div className="w-full dropdown dropdown-hover" >
  <div tabIndex={0} role="button" className="btn w-full border-none" >Entrada de inventario</div>
  <ul tabIndex="-1" className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm w-full ">
    <li><a onClick={()=>setcargarComponente(7)}>Nueva entrada</a></li>
    <li><a onClick={()=>setcargarComponente(8)}>Gestion de solicitudes de entrada</a></li>
  </ul>
</div>
<div className="w-full dropdown dropdown-hover" >
  <div tabIndex={0} role="button" className="btn w-full border-none" >Salida de inventario</div>
  <ul tabIndex="-1" className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm w-full ">
    <li><a onClick={()=>setcargarComponente(9)}>Nueva salida</a></li>
    <li><a onClick={()=>setcargarComponente(10)}>Gestion de solicitudes de salida</a></li>
  </ul>
</div>
<div className="w-full dropdown dropdown-hover" >
  <div tabIndex={0} role="button" className="btn w-full border-none" >Inventario</div>
  <ul tabIndex="-1" className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm w-full ">
   
    <li><a onClick={()=>setcargarComponente(11)}>Gestion de inventario</a></li>
  </ul>
</div>
      <button className="btn w-full border-none" onClick={terminarSesion}>Cerrar sesion</button>
   </div>
     

      </div>
        </div>
        <div className='h-full w-1/5 bg-white'>
          xd
        </div>
        <div className=' w-4/5 bg-white h-full flex items-center justify-center'>
        {
         componentes[cargarComponente]
        }
        
     </div>
</div>
<VerDetalles setventanaEmergente={setventanaEmergente} ventanaEmergente={ventanaEmergente}></VerDetalles>
    </>
  )
}

