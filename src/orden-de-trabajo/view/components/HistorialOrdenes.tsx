
import React, { useEffect, useMemo, useRef, useState } from 'react'
import Select from 'react-select';
import { Combobox } from '@headlessui/react';
import { areas, editarOrdenTrabajoApi, eliminarOrdenTrabajo, faseCompletada, getAllCategorias, getAllCodByArea, getAllMaquinasByCod, getAllOrdenesTrabajo, getAllTipoTrabajo, getEstados, getFasesByOrdenTrabajo, getOrdenTrabajoById, getOrdenTrabajoBySolicitante, getPromedioFasesByOrdenTrabajo } from '../../controller/api/orden-api';
import type { OrdenesTrabajo } from '../../models/ordenesTrabajo';
import type { Maquina } from '../../models/maquinas';
import { getUsers } from '../../../user/controller/api/user-api';
import type { Users } from '../../../admin/models/users';
import type { SolicitudOrden } from '../../models/solicitudOrden';
import type { Estado } from '../../../orden-de-compra/models/Estados';
import { filtrarOrdenes } from '../../controller/api/orden-api';

export const HistorialOrdenes = ({setcargaAuto,setsendId}) => {

   const [ordenesTrabajo, setordenesTrabajo] = useState<OrdenesTrabajo[]>([]);
   const [validarCambio, setvalidarCambio] = useState(false);
   const [habilitarEdicion, sethabilitarEdicion] = useState(false);
    const [ventanaEmergente, setventanaEmergente] = useState(false);   
     const [ventanaCrearUsuario, setventanaCrearUsuario] = useState(false);
    const [filtrarxSolicitante, setfiltrarxSolicitante] = useState("");
    const [ordenTrabajoxUser, setordenTrabajoxUser] = useState<OrdenesTrabajo>({});
    const [ordenTrabajoxUserOriginal, setordenTrabajoxUserOriginal] = useState<OrdenesTrabajo>({});
    const [selectAreaOriginal, setselectAreaOriginal] = useState("");
    const [selectCodigoOriginal, setselectCodigoOriginal] = useState("");
    const [selectMaquinaOriginal, setselectMaquinaOriginal] = useState("");
    const [areasAll, setareasAll] = useState<{
    nombre: string;}[]>([]);
    const [codigossAll, setcodigossAll] = useState<{
    cod: string;}[]>([]);
    const [maquinasAll, setmaquinasAll] = useState<Maquina[]>([]);
    const [selectArea, setselectArea] = useState("");
    const [selectCodigo, setselectCodigo] = useState("");
    const [selectMaquina, setselectMaquina] = useState("");
    const [categorias, setcategorias] = useState<{nombre:string}[]>([]);
    const [tiposTrabajo, settiposTrabajo] = useState<{tipo:string}[]>([]);
    const [selectCategoria, setselectCategoria] = useState("");
    const [selectTipoTrabajo, setselectTipoTrabajo] = useState("");
    const [users, setusers] = useState<Users[]>([])
    const [confirmarCambio, setconfirmarCambio] = useState(false);
    const [salto, setsalto] = useState(false);
    const [estados, setestados] = useState<Estado[]>([]);
    const [filtroNumOrden, setFiltroNumOrden] = useState("");
const [filtroFechaFinal, setFiltroFechaFinal] = useState("");
const [filtroSolicitante, setFiltroSolicitante] = useState("");
const [filtroDescripcion, setFiltroDescripcion] = useState("");
const [filtroEstado, setFiltroEstado] = useState("");
const [filtroArea, setFiltroArea] = useState("");
const [filtroCodigo, setFiltroCodigo] = useState("");
const [filtroMaquina, setFiltroMaquina] = useState("");
const [filtroCategoria, setFiltroCategoria] = useState("");
const [filtroTipoTrabajo, setFiltroTipoTrabajo] = useState("");
const [promedios, setpromedios] = useState<{otId:number,promedio:number}[]>([]);
   const [ventanaFase, setventanaFase] = useState(false);
 //  const [fases, setfases] = useState<{}[]>([]);
   const [faseActual, setfaseActual] = useState<any>(null);
   const [descripcionFase, setdescripcionFase] = useState("");
   const [faseHabilitada, setfaseHabilitada] = useState(false);
   const [showErrorFase, setshowErrorFase] = useState(false);
   const [showSuccessFase, setshowSuccessFase] = useState(false);
   const [mensajeFase, setmensajeFase] = useState("");
   const [idOrdenTrabajoActual, setidOrdenTrabajoActual] = useState<number>(0);
   const [isPending, setisPending] = useState(false);
   
   const dialogEliminarRef = useRef<HTMLDialogElement>(null);
   const [idAEliminar, setidAEliminar] = useState<number | null>(null);
   const [mensajeAlerta, setmensajeAlerta] = useState("");
   const [tipoAlerta, settipoAlerta] = useState<"success" | "error" | null>(null);
   const [showSuccessCrearOrden, setshowSuccessCrearOrden] = useState(false);
    const [showErrorCrearOrden, setshowErrorCrearOrden] = useState(false);


const applyFilters = async () => {
  const filtros = {
    numOrden: filtroNumOrden || undefined,
    fechaFinal: filtroFechaFinal || undefined,
    solicitante: filtroSolicitante || undefined,
    descripcion: filtroDescripcion || undefined,
    estado: filtroEstado || undefined,
    area: filtroArea || undefined,
    codigo: filtroCodigo || undefined,
    maquina: filtroMaquina || undefined,
    categoria: filtroCategoria || undefined,
    tipoTrabajo: filtroTipoTrabajo || undefined
  };
  const res = await filtrarOrdenes(filtros);
  setordenesTrabajo(res);
}

const clearFilters = async () => {
  setFiltroNumOrden(""); setFiltroFechaFinal(""); setFiltroSolicitante(""); setFiltroDescripcion("");
  setFiltroEstado(""); setFiltroArea(""); setFiltroCodigo(""); setFiltroMaquina("");
  setFiltroCategoria(""); setFiltroTipoTrabajo("");
  ordenesTrabajoApi();
}


const ordenesTrabajoApi  = async() =>{
       const res = await getAllOrdenesTrabajo();
       console.log("res ordenes trabajo: ",res);
       setordenesTrabajo(res);
   const nuevosPromedios = await Promise.all(
    res.map(async (a) => {
      const prom = await getPromedioFasesByOrdenTrabajo(a.id);
      return { otId: a.id, promedio: prom };
    })
  );

  setpromedios(nuevosPromedios);

      }

     /* useEffect(() => {
       const actualizarProgresos = () => {
        const ordenesConProgreso = 
        setordenesTrabajo(ordenesConProgreso);
       };
       actualizarProgresos();
      }, [ordenesTrabajo,promedios])*/
      
     const ordenesConProgreso = useMemo(() => {
    return  ordenesTrabajo.map((ot) => {
          const promedioObj = promedios.find((p) => p.otId === ot.id);
          const progreso = promedioObj ? promedioObj.promedio : 0;
          return { ...ot, progreso };
        });},
     [ordenesTrabajo,promedios])
    
    
     useEffect(() => {
      
      ordenesTrabajoApi();

      const areasApi = async() =>{
       const res = await areas();
       setareasAll(res);
       
    

      }
      areasApi();

      const parametrosApi = async() =>{
        const res1 = await getAllCategorias();
        setcategorias(res1);
        const res2 = await getAllTipoTrabajo();
        settiposTrabajo(res2);

        const res3 = await getUsers();
        setusers(res3);

        const res4 = await getEstados();
        setestados(res4);
      }
      parametrosApi();
      
     }, []);

     useEffect(() => {

      console.log("selectArea***************: ",selectArea);
      console.log("selectCodigo*************: ",selectCodigo);

      if(ventanaEmergente === true){
         
         const getCodigosApi = async() =>{
           const res = await getAllCodByArea(selectArea);
           console.log("res codigos by area: ",res);
           setcodigossAll(res);
           if(res.length === 0){
            setmaquinasAll([]);
            return;
           }
           
         }

          getCodigosApi();

          const getMaquinasApi = async() =>{
          
           const res = await getAllMaquinasByCod(selectCodigo);
           console.log("res maquinas by cod: ",res);
            setmaquinasAll(res);
            // Si hay solo una máquina, asignarla automáticamente
            if (res && res.length === 1) {
              setselectMaquina(res[0]?.nombre || "");
            } else {
              setselectMaquina("");
            }
          }
          getMaquinasApi();

      }
       
     }, [selectArea,selectCodigo,ventanaEmergente])
   
     

     useEffect(() => {
      const ejecutarFiltroxSolicitante = async() =>{
        if(filtrarxSolicitante === ""){
          const res = await getAllOrdenesTrabajo();
          setordenesTrabajo(res);
        }else{
          const res = await getOrdenTrabajoBySolicitante(filtrarxSolicitante);
          setordenesTrabajo(res);
        }


      }
      ejecutarFiltroxSolicitante();
     },[filtrarxSolicitante]);
     
    const asignarSolicitantexOrden = async(id:number) =>{
      console.log("id orden trabajo: ",id);
      const res = await getOrdenTrabajoById(id);
      console.log("res orden trabajo by id: ",res); 
      setordenTrabajoxUser(res);
      // Guardar el estado original para poder restaurar en cancelar
      setordenTrabajoxUserOriginal(JSON.parse(JSON.stringify(res)));
     /* setselectAreaOriginal("");
      setselectCodigoOriginal("");
      setselectMaquinaOriginal("");*/
     }

     const editarOrdenTrabajo = async() =>{
      
      
      const ordenEditada:SolicitudOrden = {
        
        
        fechaInicio:ordenTrabajoxUser.fechaInicio,
        fechaFinal:ordenTrabajoxUser.fechaFinal,
        HoraInicio:ordenTrabajoxUser.HoraInicio,  
        HoraFinal:ordenTrabajoxUser.HoraFinal,
        Area:selectArea,
        Codigo:selectCodigo,
       
        EspecificacionMaquina:ordenTrabajoxUser.EspecificacionMaquina,
        Categoria:ordenTrabajoxUser.Categoria,
        TipoTrabajo:ordenTrabajoxUser.TipoTrabajo,
        DescripcionTrabajo:ordenTrabajoxUser.DescripcionTrabajo,
        userSolicitante:ordenTrabajoxUser.userSolicitante ? ordenTrabajoxUser.userSolicitante.name : null,
        userReceptor:ordenTrabajoxUser.userReceptor ? ordenTrabajoxUser.userReceptor.name : null,
        userTecnico:ordenTrabajoxUser.userTecnico ? ordenTrabajoxUser.userTecnico.name : null,
        estado:ordenTrabajoxUser.estadoTrabajo?.estado
      };

      if(selectMaquina.trim() !== ""){
        ordenEditada.Maquina = selectMaquina;
      }
    setisPending(true);
      try {
            const res = await editarOrdenTrabajoApi(ordenTrabajoxUser.id,ordenEditada);
 
      if(res.validate){
      setshowSuccessCrearOrden(true);     
      ordenesTrabajoApi(); 
       setisPending(false);
       setventanaEmergente(false);
        setTimeout(() => {
           setshowSuccessCrearOrden(false);

        }, 2000);
        
      }else{
        setshowErrorCrearOrden(true);
        setTimeout(() => {
            setshowErrorCrearOrden(false);
        }, 2000);
      }
      
      setconfirmarCambio(false);
      sethabilitarEdicion(!habilitarEdicion);
      
      } catch (error) {
        setshowErrorCrearOrden(true);
        setTimeout(() => {
            setshowErrorCrearOrden(false);
        }, 2000);
      }finally{
        setisPending(false);
      }

     }

      const getEstadoColor = (estado: string) => {
        console.log("estado para color: ",estado);
    const estadoUpper = estado?.toUpperCase() || "";
    if (estadoUpper.includes("FINALIZADO") || estadoUpper.includes("ENTREGADO")) {
      return { /*bg: "bg-green-100", text: "text-green-800",*/ badge: "badge-success" };
    } else if (estadoUpper.includes("PROCESO") || estadoUpper.includes("EN PROCESO"))
    {
      return { /*bg: "bg-yellow-100", text: "text-yellow-800",*/ badge: "badge-warning" };
    } 
      else if (estadoUpper.includes("LISTA PARA ENTREGA")) {
      return { /*bg: "bg-orange-100", text: "text-orange-800",*/ badge: "badge-warning" };
    }
    else if (estadoUpper.includes("VENCIDO")) {
      return { /*bg: "bg-red-100", text: "text-red-800",*/ badge: "badge-error" };
    } else {
      return { /*bg: "bg-blue-100", text: "text-blue-800",*/ badge: "badge-info" };
    }
  };

     const metodoEliminarOrdenTrabajo = async(id:number)=>{
      const res = await eliminarOrdenTrabajo(id);
      if (res.validate) {
        setmensajeAlerta(res.msj);
        settipoAlerta("success");
        await ordenesTrabajoApi();
      } else {
        setmensajeAlerta(res.msj || "Error al eliminar la orden de trabajo");
        settipoAlerta("error");
      }
      setTimeout(() => {
        settipoAlerta(null);
      }, 4000);
      console.log(res);
     };

     const abrirDialogoEliminar = (id: number) => {
       setidAEliminar(id);
       dialogEliminarRef.current?.showModal();
     };

     const cerrarDialogoEliminar = () => {
       dialogEliminarRef.current?.close();
       setidAEliminar(null);
     };
     

     const cargarPdf = (id:number) => {
      window.open(`/pdf/${id}`,"_blank");
     }

       const redirigirSolMaterial = async(id:number) =>{
    setsendId(id);
    setcargaAuto(true);
  }

  const cargarFases = async(idOrdenTrabajo: number) => {
    try {
      const res = await getFasesByOrdenTrabajo(idOrdenTrabajo);
     // setfases(res);
      console.log(res);
      const proximaFase = res.find((f: any) => f.agotado === false );
      setfaseActual(proximaFase || null);
      console.log(proximaFase);
      setdescripcionFase(proximaFase.descripcion ?? "");
      setidOrdenTrabajoActual(idOrdenTrabajo);
    } catch (error) {
      console.log("Error al cargar fases:", error);
    /*  setmensajeFase("Error al cargar las fases");
      setshowErrorFase(true);*/
    //  setTimeout(() => setshowErrorFase(false), 3000);
    }
  }

  const handleAbrirModalFase = async(idOrdenTrabajo: number) => {
    await cargarFases(idOrdenTrabajo);
    setventanaFase(true);
    //setdescripcionFase("");
    setfaseHabilitada(false);
  }

  /*const validarFaseCompletada = async(proceso:number) => {
    if (proceso === 100) {
      setmensajeFase("Todas las fases han sido completadas");
      setshowSuccessFase(true);
      setTimeout(() => setshowSuccessFase(false), 3000);
      return true;
    }
    return false;
  }*/

  const enviarFaseCompletada = async() => {
    if (!faseActual) {
      setmensajeFase("No hay fase para completar");
      setshowErrorFase(true);
      setTimeout(() => setshowErrorFase(false), 3000);
      return;
    }

    if (!descripcionFase.trim()) {
      setmensajeFase("La descripción no puede estar vacía");
      setshowErrorFase(true);
      setTimeout(() => setshowErrorFase(false), 3000);
      return;
    }

    try {
      const res = await faseCompletada(faseActual.id, descripcionFase);
      setmensajeFase(res.msj);
      setshowSuccessFase(true);

      setTimeout(() => {
        setshowSuccessFase(false);
        
      
      }, 2000);
       cargarFases(idOrdenTrabajoActual);
      setventanaFase(false);
        setdescripcionFase("");
        setfaseHabilitada(false);
       ordenesTrabajoApi();
    } catch (error) {
      setmensajeFase("Error al completar la fase");
      setshowErrorFase(true);
      setTimeout(() => setshowErrorFase(false), 3000);
    }
  }

  const cerrarModalFase = () => {
    setventanaFase(false);
    setdescripcionFase("");
    setfaseHabilitada(false);
    setfaseActual(null);
     ordenesTrabajoApi();
  }
     
  return (
  <>
   {showSuccessCrearOrden && (
      <div className="fixed top-5 right-5 z-100">
        <div role="alert" className="alert alert-success shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{ "¡Editado correctamente!"}</span>
        </div>
      </div>
    )}

    {showErrorCrearOrden && (
      <div className="fixed top-5 right-5 z-100">
        <div role="alert" className="alert alert-error shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{"Fallo al editar"}</span>
        </div>
      </div>
    )}
    <div className="w-full h-full rounded-2xl border border-gray-200 bg-white shadow-lg">
      <div className="bg-gradient-to-r from-green-500 to-green-600 w-full py-4 rounded-t-2xl border-b border-green-200 px-6">
        <h2 className="font-bold text-white text-lg">📋 Órdenes de Trabajo</h2>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-4 gap-4 bg-gray-50 border-b border-gray-200">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-600">N° Orden</label>
          <input className="input input-sm input-bordered focus:input-primary rounded-lg" value={filtroNumOrden} onChange={(e)=>setFiltroNumOrden(e.target.value)} />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-600">Fecha Final</label>
          <input type="date" className="input input-sm input-bordered focus:input-primary rounded-lg" value={filtroFechaFinal} onChange={(e)=>setFiltroFechaFinal(e.target.value)} />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-600">Solicitante</label>
          <input className="input input-sm input-bordered focus:input-primary rounded-lg" value={filtroSolicitante} onChange={(e)=>setFiltroSolicitante(e.target.value)} />
        </div>

       

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-600">Estado</label>
          <Select
            options={estados.map(es => ({ value: es.estado, label: es.estado }))}
            value={filtroEstado ? { value: filtroEstado, label: filtroEstado } : null}
            onChange={(opt) => setFiltroEstado(opt?.value || "")}
            placeholder="Buscar o seleccionar..."
            isClearable
            isSearchable
            className="text-sm"
            styles={{
              control: (base) => ({...base, minHeight: '34px', fontSize: '14px' })
            }}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-600">Área</label>
          <input className="input input-sm input-bordered focus:input-primary rounded-lg" value={filtroArea} onChange={(e)=>setFiltroArea(e.target.value)} />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-600">Código</label>
          <input className="input input-sm input-bordered focus:input-primary rounded-lg" value={filtroCodigo} onChange={(e)=>setFiltroCodigo(e.target.value)} />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-600">Máquina</label>
          <input className="input input-sm input-bordered focus:input-primary rounded-lg" value={filtroMaquina} onChange={(e)=>setFiltroMaquina(e.target.value)} />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-600">Categoría</label>
          <input className="input input-sm input-bordered focus:input-primary rounded-lg" value={filtroCategoria} onChange={(e)=>setFiltroCategoria(e.target.value)} />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-600">Tipo Trabajo</label>
          <input className="input input-sm input-bordered focus:input-primary rounded-lg" value={filtroTipoTrabajo} onChange={(e)=>setFiltroTipoTrabajo(e.target.value)} />
        </div>
      </div>

      <div className="px-6 py-3 flex items-center justify-end gap-2 bg-gray-50 border-b border-gray-200">
         <button className="btn btn-sm btn-ghost hover:btn-primary gap-2" onClick={()=> window.open('http://localhost:3000/reporte/orden-trabajo','_blank')}>Reporte</button>
        <button className="btn btn-sm btn-ghost hover:btn-primary gap-2" onClick={() => ordenesTrabajoApi()}>🔄 Refrescar</button>
        <button className="btn btn-sm btn-ghost hover:btn-warning gap-2" onClick={clearFilters}>✕ Limpiar</button>
        <button className="btn btn-sm btn-primary gap-2" onClick={applyFilters}>✓ Aplicar</button>
      </div>

      <div className="px-6 pb-6 pt-4">
        <div className="overflow-hidden border border-gray-200 rounded-xl shadow-sm">
          <div className="max-h-[520px] overflow-auto">
            <table className="table w-full">
              <thead className="bg-gradient-to-r from-green-50 to-green-100 sticky top-0 z-20">
                <tr className="text-sm text-left text-gray-700 font-semibold">
                  <th className="px-4 py-3">N° Orden</th>
                  <th className="px-4 py-3">Fecha Final</th>
                  <th className="px-4 py-3">Solicitante</th>
                  <th className="px-4 py-3">Descripción</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Progreso</th>
                  <th className="px-4 py-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ordenesConProgreso?.map((u) =>{
                  const getColorConfig = getEstadoColor(u.estadoTrabajo?.estado || "");
                  return(
                  <tr key={u.id} className="border-t border-gray-100 hover:bg-green-50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-gray-800 align-top">{u.NumOrden}</td>
                    <td className="px-4 py-3 text-gray-700 align-top">{u.fechaFinal}</td>
                    <td className="px-4 py-3 text-gray-700 align-top">{u.userSolicitante?.name ?? "N/A"}</td>
                    <td className="px-4 py-3 text-gray-700 text-sm align-top">{u.DescripcionTrabajo}</td>
                    <td className="px-4 py-3 align-top whitespace-nowrap"><span className={`badge ${getColorConfig.badge} gap-1`}>{u.estadoTrabajo.estado}</span></td>
                    <td className="px-4 py-3 align-top"><div className="radial-progress text-primary cursor-pointer" onClick={() =>{ if(u.progreso !== 100){handleAbrirModalFase(u.id);}}} style={{ "--value": u.progreso ?? 0 } as React.CSSProperties} 
  aria-valuenow={u.progreso ?? 0} role="progressbar">{u.progreso ?? 0}%</div></td>
                    <td className="px-4 py-3 align-top text-center">
                      <div className="flex items-center justify-center flex-wrap gap-2">
                        <button
                          className={`btn btn-sm btn-info btn-outline gap-1 tooltip ${ordenesConProgreso.indexOf(u) === 0 ? "tooltip-bottom" : ""}`}
                          data-tip="Ver detalles"
                          onClick={() => {
                            asignarSolicitantexOrden(u.id);
                            setventanaEmergente(!ventanaEmergente);
                            setselectArea(u.Area);
                            setselectAreaOriginal(u.Area);
                            setselectCodigo(u.Codigo);
                            setselectCodigoOriginal(u.Codigo);
                          }}
                        >
                          👁️
                        </button>
                        <button className={`btn btn-sm btn-error btn-outline gap-1 tooltip ${ordenesConProgreso.indexOf(u) === 0 ? "tooltip-bottom" : ""}`} data-tip="Eliminar" onClick={() => abrirDialogoEliminar(u.id)}>
                          🗑️
                        </button>
                        <button className={`btn btn-sm btn-success btn-outline gap-1 tooltip ${ordenesConProgreso.indexOf(u) === 0 ? "tooltip-bottom" : ""}`} data-tip="Descargar PDF" onClick={() => cargarPdf(u.id)}>
                          📄
                        </button>
                        <button
                          className={`btn btn-sm btn-warning btn-outline gap-1 tooltip ${ordenesConProgreso.indexOf(u) === 0 ? "tooltip-bottom" : ""}`}
                          data-tip="Solicitar Material"
                          disabled={u?.estadoUso?.uso}
                          onClick={() => redirigirSolMaterial(u.id)}
                        >
                          📦
                        </button>
                      </div>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div className={`z-50 fixed inset-0 flex items-center justify-center transition-opacity duration-300 ${ventanaEmergente ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div className="relative w-full max-w-6xl h-[88vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4 flex items-center justify-between border-b-4 border-green-200 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1 4.5 4.5 0 1-4.384 5.98z"/></svg>
            </div>
            <div>
              <h3 className="font-bold text-lg">Detalles de Orden de Trabajo</h3>
              <p className="text-xs text-green-100">N° {ordenTrabajoxUser.NumOrden ?? "N/A"}</p>
            </div>
          </div>
          <button onClick={() => { setventanaEmergente(!ventanaEmergente); setordenTrabajoxUser({}); sethabilitarEdicion(false);}} className="btn btn-circle btn-sm btn-ghost text-white hover:bg-white/20">✕</button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-gray-50 px-6 py-6">
          <div className="bg-white rounded-xl shadow-sm p-6 grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">N° Orden</label>
              <input type="text" disabled className="input input-sm input-bordered w-full mt-2 focus:input-success rounded-lg bg-gray-50" value={ordenTrabajoxUser.NumOrden} onChange={(e)=>setordenTrabajoxUser((prev)=>({...prev,NumOrden:e.target.value}))}/>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">Fecha de Inicio</label>
              <input 
                type="date" 
                disabled={!habilitarEdicion} 
                className="input input-sm input-bordered w-full mt-2 focus:input-success rounded-lg disabled:bg-gray-50"
                value={ordenTrabajoxUser.fechaInicio || ''}
                onChange={(e) => {
                  setordenTrabajoxUser((prev) => ({ ...prev, fechaInicio: e.target.value }));
                  setconfirmarCambio(true);
                }}
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">Fecha de Finalización</label>
              <input 
                type="date" 
                disabled={!habilitarEdicion} 
                className="input input-sm input-bordered w-full mt-2 focus:input-success rounded-lg disabled:bg-gray-50"
                value={ordenTrabajoxUser.fechaFinal || ''}
                onChange={(e) => {
                  setordenTrabajoxUser((prev) => ({ ...prev, fechaFinal: e.target.value }));
                  setconfirmarCambio(true);
                }}
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">Hora de Inicio</label>
              <input type="time" disabled={!habilitarEdicion} className="input input-sm input-bordered w-full mt-2 focus:input-success rounded-lg disabled:bg-gray-50" value={ordenTrabajoxUser.HoraInicio} onChange={(e)=>{setordenTrabajoxUser((prev)=>({...prev,HoraInicio:e.target.value}));setconfirmarCambio(true);}}/>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">Hora de Finalización</label>
              <input type="time" disabled={!habilitarEdicion} className="input input-sm input-bordered w-full mt-2 focus:input-success rounded-lg disabled:bg-gray-50" value={ordenTrabajoxUser.HoraFinal} onChange={(e)=>{setordenTrabajoxUser((prev)=>({...prev,HoraFinal:e.target.value}));setconfirmarCambio(true);}}/>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">Área</label>
              <Select
                isDisabled={!habilitarEdicion}
                options={Array.isArray(areasAll) ? areasAll.map(a => ({ value: a.nombre, label: a.nombre })) : []}
                value={selectArea ? { value: selectArea, label: selectArea } : null}
                onChange={(opt) => {
                  setselectArea(opt?.value || "");
                  // Limpiar código y máquina cuando se limpia el área
                  if (!opt?.value) {
                    setselectCodigo("");
                    setselectMaquina("");
                  } else {
                    setselectMaquina(""); // Limpiar máquina cuando se selecciona nueva área
                  }
                  setconfirmarCambio(true);
                }}
                placeholder="Buscar o seleccionar..."
                isClearable
                isSearchable
                className="text-sm"
                styles={{
                  control: (base) => ({...base, minHeight: '36px', fontSize: '14px' })
                }}
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">Código</label>
              <Select
                isDisabled={!habilitarEdicion || !selectArea}
                options={Array.isArray(codigossAll) ? codigossAll.map(c => ({ value: c.cod, label: c.cod })) : []}
                value={selectCodigo ? { value: selectCodigo, label: selectCodigo } : null}
                onChange={(opt) => {
                  setselectCodigo(opt?.value || "");
                  // Limpiar máquina cuando se cambia el código
                  setselectMaquina("");
                  setconfirmarCambio(true);
                }}
                placeholder="Buscar o seleccionar..."
                isClearable
                isSearchable
                className="text-sm"
                styles={{
                  control: (base) => ({...base, minHeight: '36px', fontSize: '14px' })
                }}
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">Máquina</label>
              <input
                type="text"
                disabled={true}
                value={selectMaquina}
                className="input input-sm input-bordered w-full mt-2 focus:input-success rounded-lg disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">EQUIPO O PIEZA</label>
              <input type="text" disabled={!habilitarEdicion} className="input input-sm input-bordered w-full mt-2 focus:input-success rounded-lg disabled:bg-gray-50" value={ordenTrabajoxUser.EspecificacionMaquina ?? "N/A"} onChange={(e)=>{setordenTrabajoxUser((prev)=>({...prev,EspecificacionMaquina:e.target.value})); setconfirmarCambio(true);}}/>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">Categoría</label>
              <Select
                isDisabled={!habilitarEdicion}
                options={Array.isArray(categorias) ? categorias.map(ca => ({ value: ca.nombre, label: ca.nombre })) : []}
                value={ordenTrabajoxUser.Categoria ? { value: ordenTrabajoxUser.Categoria, label: ordenTrabajoxUser.Categoria } : null}
                onChange={(opt) => {setordenTrabajoxUser((prev)=>({...prev,Categoria:opt?.value || ""})); setconfirmarCambio(true);}}
                placeholder="Buscar o seleccionar..."
                isClearable
                isSearchable
                className="text-sm"
                styles={{
                  control: (base) => ({...base, minHeight: '36px', fontSize: '14px' })
                }}
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">Tipo de Trabajo</label>
              <Select
                isDisabled={!habilitarEdicion}
                options={Array.isArray(tiposTrabajo) ? tiposTrabajo.map(tp => ({ value: tp.tipo, label: tp.tipo })) : []}
                value={ordenTrabajoxUser.TipoTrabajo ? { value: ordenTrabajoxUser.TipoTrabajo, label: ordenTrabajoxUser.TipoTrabajo } : null}
                onChange={(opt) => {setordenTrabajoxUser((prev)=>({...prev,TipoTrabajo:opt?.value || ""})); setconfirmarCambio(true);}}
                placeholder="Buscar o seleccionar..."
                isClearable
                isSearchable
                className="text-sm"
                styles={{
                  control: (base) => ({...base, minHeight: '36px', fontSize: '14px' })
                }}
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">Estado</label>
              <Select
                isDisabled={!habilitarEdicion}
                options={estados.filter(ee => ee.estado !== "EN PROCESO" && ee.estado !== "VENCIDO").map(ee => ({ value: ee.estado, label: ee.estado }))}
                value={ordenTrabajoxUser.estadoTrabajo?.estado ? { value: ordenTrabajoxUser.estadoTrabajo.estado, label: ordenTrabajoxUser.estadoTrabajo.estado } : null}
                onChange={(opt) => {setordenTrabajoxUser((prev)=>({...prev,estadoTrabajo:{estado: opt?.value || ""}})); setconfirmarCambio(true);}}
                placeholder="Buscar o seleccionar..."
                isClearable
                isSearchable
                className="text-sm"
                styles={{
                  control: (base) => ({...base, minHeight: '36px', fontSize: '14px' })
                }}
              />
            </div>

            <div className="lg:col-span-4">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">Descripción</label>
              <input type="text" disabled={!habilitarEdicion} className="input input-sm input-bordered w-full mt-2 focus:input-success rounded-lg disabled:bg-gray-50" value={ordenTrabajoxUser.DescripcionTrabajo ?? ""} onChange={(e)=>{setordenTrabajoxUser((prev)=>({...prev,DescripcionTrabajo:e.target.value})); setconfirmarCambio(true);}}/>
            </div>
          </div>

          {/* Usuarios */}
          <div className="bg-white rounded-xl shadow-sm p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">Solicitante</label>
              <Select
                isDisabled={!habilitarEdicion}
                options={Array.isArray(users) ? users.map(u => ({ value: u.name, label: u.name })) : []}
                value={ordenTrabajoxUser.userSolicitante?.name ? { value: ordenTrabajoxUser.userSolicitante.name, label: ordenTrabajoxUser.userSolicitante.name } : null}
                onChange={(opt) => {setordenTrabajoxUser((prev)=>({...prev,userSolicitante:{name: opt?.value || ""}})); setconfirmarCambio(true);}}
                placeholder="Buscar o seleccionar..."
                isClearable
                isSearchable
                className="text-sm"
                styles={{
                  control: (base) => ({...base, minHeight: '36px', fontSize: '14px' })
                }}
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">Receptor</label>
              <Select
                isDisabled={!habilitarEdicion}
                options={Array.isArray(users) ? users.map(u => ({ value: u.name, label: u.name })) : []}
                value={ordenTrabajoxUser.userReceptor?.name ? { value: ordenTrabajoxUser.userReceptor.name, label: ordenTrabajoxUser.userReceptor.name } : null}
                onChange={(opt) => {setordenTrabajoxUser((prev)=>({...prev,userReceptor:{name: opt?.value || ""}})); setconfirmarCambio(true);}}
                placeholder="Buscar o seleccionar..."
                isClearable
                isSearchable
                className="text-sm"
                styles={{
                  control: (base) => ({...base, minHeight: '36px', fontSize: '14px' })
                }}
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-700">Técnico</label>
              <Select
                isDisabled={!habilitarEdicion}
                options={Array.isArray(users) ? users.map(u => ({ value: u.name, label: u.name })) : []}
                value={ordenTrabajoxUser.userTecnico?.name ? { value: ordenTrabajoxUser.userTecnico.name, label: ordenTrabajoxUser.userTecnico.name } : null}
                onChange={(opt) => {setordenTrabajoxUser((prev)=>({...prev,userTecnico:{name: opt?.value || ""}})); setconfirmarCambio(true);}}
                placeholder="Buscar o seleccionar..."
                isClearable
                isSearchable
                className="text-sm"
                styles={{
                  control: (base) => ({...base, minHeight: '36px', fontSize: '14px' })
                }}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between">
          {habilitarEdicion ? (
            <>
              <button className="btn btn-sm bg-green-500 hover:bg-green-600 text-white border-0 gap-2" disabled={!confirmarCambio} onClick={editarOrdenTrabajo}>                       
                 {isPending ? (
    // Spinner de DaisyUI
    <span className="loading loading-spinner loading-sm"></span>
  ) : (
    // Icono original
     <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
  )}
  {isPending ? "Procesando..." : "Guardar"}
              </button>
              <button className="btn btn-sm btn-ghost gap-2" onClick={()=>{
                // Restaurar los datos originales
                setordenTrabajoxUser(ordenTrabajoxUserOriginal);
                setselectArea(selectAreaOriginal);
                setselectCodigo(selectCodigoOriginal);
                setselectMaquina(selectMaquinaOriginal);
                sethabilitarEdicion(!habilitarEdicion);
                setconfirmarCambio(false);
              }}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
                Cancelar
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-sm bg-green-500 hover:bg-green-600 text-white border-0 gap-2" onClick={()=>sethabilitarEdicion(!habilitarEdicion)}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/></svg>
                Editar
              </button>
              <button className="btn btn-sm btn-ghost gap-2" onClick={()=>setventanaEmergente(!ventanaEmergente)}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
                Cerrar
              </button>
            </>
          )}
        </div>
      </div>
    </div>

    <div className={`z-50 fixed inset-0 flex items-center justify-center transition-opacity duration-300 ${ventanaCrearUsuario ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative border border-gray-300 w-4/5 h-4/5 rounded-sm bg-white" />
    </div>
    

    {showSuccessFase && (
      <div className="fixed top-5 right-5 z-100">
        <div role="alert" className="alert alert-success shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{mensajeFase}</span>
        </div>
      </div>
    )}

    {showErrorFase && (
      <div className="fixed top-5 right-5 z-100">
        <div role="alert" className="alert alert-error shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{mensajeFase}</span>
        </div>
      </div>
    )}

    <div className={`z-50 fixed inset-0 flex items-center justify-center transition-opacity duration-300 ${ventanaFase ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative border border-gray-300 w-full max-w-md rounded-lg bg-white shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Registrar fase completada</h3>
          <button onClick={cerrarModalFase} className="btn btn-ghost btn-sm">✕</button>
        </div>

        {faseActual ? (
          <div className="space-y-4">
            <div>
              <label className="label">Hora de la fase</label>
              <input 
                type="text" 
                className="input input-bordered w-full" 
                value={faseActual.hora} 
                disabled 
              />
            </div>

            <div>
              <label className="label">Descripción</label>
              <textarea 
                className="textarea textarea-bordered w-full" 
                placeholder="Describe el trabajo realizado en esta fase..."
                value={descripcionFase}
                onChange={(e) => setdescripcionFase(e.target.value)}
                disabled={!faseHabilitada}
                rows={4}
              />
            </div>

            <div className="flex gap-2">
              {!faseHabilitada ? (
                <button 
                  className="btn btn-primary flex-1"
                  onClick={() => setfaseHabilitada(true)}
                >
                  Editar
                </button>
              ) : (
                <button 
                  className="btn btn-success flex-1"
                  onClick={enviarFaseCompletada}
                >
                  Enviar
                </button>
              )}
              <button 
                className="btn btn-ghost flex-1"
                onClick={cerrarModalFase}
              >
                Cerrar
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500"> No hay fases pendientes para completar</p>
          </div>
        )}
      </div>
    </div>

    {/* Modal de confirmación de eliminación */}
    <dialog ref={dialogEliminarRef} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box bg-white rounded-xl">
        <h3 className="text-lg font-bold text-gray-800 mb-2">⚠️ Confirmar eliminación</h3>
        <p className="text-gray-600 text-sm mb-6">¿Estás seguro de que deseas eliminar esta orden de trabajo? Esta acción no se puede deshacer.</p>
        <div className="modal-action">
          <button className="btn btn-sm btn-ghost" onClick={cerrarDialogoEliminar}>Cancelar</button>
          <button className="btn btn-sm btn-error gap-2" onClick={() => { 
            if (idAEliminar !== null) {
              metodoEliminarOrdenTrabajo(idAEliminar);
            }
            cerrarDialogoEliminar();
          }}>🗑️ Eliminar</button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={cerrarDialogoEliminar}>close</button>
      </form>
    </dialog>

    {/* Alert de éxito/error */}
    {tipoAlerta && (
      <div className="fixed bottom-6 right-6 z-50 animate-pulse">
        <div className={`alert alert-${tipoAlerta} shadow-lg rounded-lg border-2 ${tipoAlerta === 'success' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
          <div className="flex items-center gap-3">
            {tipoAlerta === 'success' ? (
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            <span className={`text-sm font-semibold ${tipoAlerta === 'success' ? 'text-green-800' : 'text-red-800'}`}>
              {mensajeAlerta}
            </span>
          </div>
        </div>
      </div>
    )}
  </>
);


}
