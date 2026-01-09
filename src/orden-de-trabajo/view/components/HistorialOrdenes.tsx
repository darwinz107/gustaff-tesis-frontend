
import React, { useEffect, useMemo, useRef, useState } from 'react'
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
   const callyPpopover4 = useRef(null);
   const callyPpopover5 = useRef(null);
    const [ventanaEmergente, setventanaEmergente] = useState(false);   
     const [ventanaCrearUsuario, setventanaCrearUsuario] = useState(false);
    const [filtrarxSolicitante, setfiltrarxSolicitante] = useState("");
    const [ordenTrabajoxUser, setordenTrabajoxUser] = useState<OrdenesTrabajo>({});
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

           
         }

          getCodigosApi();

          const getMaquinasApi = async() =>{
           const res = await getAllMaquinasByCod(selectCodigo);
           console.log("res maquinas by cod: ",res);
           setmaquinasAll(res);
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
     }

     const editarOrdenTrabajo = async() =>{
      
      
      const ordenEditada:SolicitudOrden = {
        
        
        fechaInicio:ordenTrabajoxUser.fechaInicio,
        fechaFinal:ordenTrabajoxUser.fechaFinal,
        HoraInicio:ordenTrabajoxUser.HoraInicio,  
        HoraFinal:ordenTrabajoxUser.HoraFinal,
        Area:ordenTrabajoxUser.Area,
        Codigo:ordenTrabajoxUser.Codigo,
        Maquina:ordenTrabajoxUser.Maquina,
        EspecificacionMaquina:ordenTrabajoxUser.EspecificacionMaquina,
        Categoria:ordenTrabajoxUser.Categoria,
        TipoTrabajo:ordenTrabajoxUser.TipoTrabajo,
        DescripcionTrabajo:ordenTrabajoxUser.DescripcionTrabajo,
        userSolicitante:ordenTrabajoxUser.userSolicitante.name,
        userReceptor:ordenTrabajoxUser.userReceptor.name,
        userTecnico:ordenTrabajoxUser.userTecnico?.name,
        estado:ordenTrabajoxUser.estadoTrabajo?.estado
      };

      const res = await editarOrdenTrabajoApi(ordenTrabajoxUser.id,ordenEditada);
    
      alert(res.msj);
      console.log(res);
      setconfirmarCambio(false);
      sethabilitarEdicion(!habilitarEdicion);
      ordenesTrabajoApi();
     }

     const metodoEliminarOrdenTrabajo = async(id:number)=>{
      
      const res = await eliminarOrdenTrabajo(id);
      ordenesTrabajoApi();
      alert(res.msj);
     }
     

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
      
      const proximaFase = res.find((f: any) => f.agotado === false );
      setfaseActual(proximaFase || null);
      console.log(proximaFase);
      setdescripcionFase(proximaFase.descripcion ?? "");
      setidOrdenTrabajoActual(idOrdenTrabajo);
    } catch (error) {
      console.log("Error al cargar fases:", error);
      setmensajeFase("Error al cargar las fases");
      setshowErrorFase(true);
      setTimeout(() => setshowErrorFase(false), 3000);
    }
  }

  const handleAbrirModalFase = async(idOrdenTrabajo: number) => {
    await cargarFases(idOrdenTrabajo);
    setventanaFase(true);
    //setdescripcionFase("");
    setfaseHabilitada(false);
  }

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
        
       // cargarFases(idOrdenTrabajoActual);
      }, 2000);
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
  }
     
  return (
  <>
    <div className="min-w-[70%] min-h-[60%] rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="bg-gray-100 w-full h-12 flex items-center justify-between rounded-t-lg border-b px-4">
        <p className="font-semibold text-gray-700">Listado de ordenes de trabajo</p>
        <div className="flex items-center gap-3">
           <button className="btn btn-sm btn-ghost" onClick={() => ordenesTrabajoApi()}>Refrescar</button>
          <button className="btn btn-sm btn-outline" onClick={clearFilters}>Limpiar filtros</button>
          <button className="btn btn-sm btn-primary" onClick={applyFilters}>Aplicar filtros</button>
        </div>
      </div>

      <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">NumOrden</label>
          <input className="input input-sm" value={filtroNumOrden} onChange={(e)=>setFiltroNumOrden(e.target.value)} />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Fecha final</label>
          <input type="date" className="input input-sm" value={filtroFechaFinal} onChange={(e)=>setFiltroFechaFinal(e.target.value)} />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Solicitante</label>
          <input className="input input-sm" value={filtroSolicitante} onChange={(e)=>setFiltroSolicitante(e.target.value)} />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Descripcion</label>
          <input className="input input-sm" value={filtroDescripcion} onChange={(e)=>setFiltroDescripcion(e.target.value)} />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Estado</label>
          <select className="select select-sm" value={filtroEstado} onChange={(e)=>setFiltroEstado(e.target.value)}>
            <option value="">Todos</option>
            {estados.map((es)=> <option key={es.id} value={es.estado}>{es.estado}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Area</label>
          <input className="input input-sm" value={filtroArea} onChange={(e)=>setFiltroArea(e.target.value)} />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Codigo</label>
          <input className="input input-sm" value={filtroCodigo} onChange={(e)=>setFiltroCodigo(e.target.value)} />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Maquina</label>
          <input className="input input-sm" value={filtroMaquina} onChange={(e)=>setFiltroMaquina(e.target.value)} />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Categoria</label>
          <input className="input input-sm" value={filtroCategoria} onChange={(e)=>setFiltroCategoria(e.target.value)} />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Tipo trabajo</label>
          <input className="input input-sm" value={filtroTipoTrabajo} onChange={(e)=>setFiltroTipoTrabajo(e.target.value)} />
        </div>
      </div>

      <div className="px-4 pb-4">
        <div className="overflow-hidden border rounded-lg">
          <div className="max-h-[420px] overflow-auto">
            <table className="table w-full min-w-full">
              <thead className="bg-white sticky top-0 z-20">
                <tr className="text-sm text-left text-gray-600">
                  <th className="px-4 py-3">N.Orden</th>
                  <th className="px-4 py-3">Fecha final</th>
                  <th className="px-4 py-3">Solicitante</th>
                  <th className="px-4 py-3">Descripcion</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Progreso</th>
                  <th className="px-4 py-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ordenesConProgreso?.map((u) => (
                  <tr key={u.id} className="even:bg-gray-50 hover:bg-gray-100">
                    <td className="px-4 py-3 align-top">{u.NumOrden}</td>
                    <td className="px-4 py-3 align-top">{u.fechaFinal}</td>
                    <td className="px-4 py-3 align-top">{u.userSolicitante ?? u.userSolicitante ?? "N/A"}</td>
                    <td className="px-4 py-3 align-top">{u.DescripcionTrabajo}</td>
                    <td className="px-4 py-3 align-top">{u.estadoTrabajo.estado}</td>
                    <td className="px-4 py-3 align-top"><div className="radial-progress cursor-pointer" onClick={() => handleAbrirModalFase(u.id)} style={{ "--value": u.progreso ?? 0 } as React.CSSProperties} 
  aria-valuenow={u.progreso ?? 0} role="progressbar">{u.progreso ?? 0}%</div></td>
                    <td className="px-4 py-3 align-top text-center">
                      <div className="flex items-center justify-center flex-wrap gap-2">
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => {
                            asignarSolicitantexOrden(u.id);
                            setventanaEmergente(!ventanaEmergente);
                            setselectArea(u.Area);
                            setselectCodigo(u.Codigo);
                          }}
                        >
                          Detalles
                        </button>
                        <button className="btn btn-outline btn-sm" onClick={() => metodoEliminarOrdenTrabajo(u.id)}>
                          Eliminar
                        </button>
                        <button className="btn btn-outline btn-sm" onClick={() => cargarPdf(u.id)}>
                          Ver pdf
                        </button>
                        <button
                          className="btn btn-outline btn-sm"
                          disabled={u?.estadoUso?.uso}
                          onClick={() => redirigirSolMaterial(u.id)}
                        >
                          Solicitar material
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div className={`z-50 fixed inset-0 flex items-center justify-center transition-opacity duration-300 ${ventanaEmergente ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative border border-gray-300 w-11/12 max-w-6xl h-[85vh] rounded-md bg-white shadow-lg overflow-hidden">
        <div className="w-full h-14 flex items-center justify-between px-6 border-b">
          <div className="font-medium text-gray-700">Detalle de ordenes</div>
          <div onClick={() => { setventanaEmergente(!ventanaEmergente); setordenTrabajoxUser({}); sethabilitarEdicion(false);}} className="cursor-pointer text-xl">❌</div>
        </div>

        <div className="w-full h-[74%] px-6 py-4 grid grid-cols-4 gap-4 overflow-auto border-b">
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-xs text-gray-500">N.Orden</p>
              <input type="text" disabled className="input input-sm w-full mt-1" value={ordenTrabajoxUser.NumOrden} onChange={(e)=>setordenTrabajoxUser((prev)=>({...prev,NumOrden:e.target.value}))}/>
            </div>

            <div>
              <p className="text-xs text-gray-500">Fecha de inicio</p>
              <button disabled={!habilitarEdicion} type="button" onClick={()=>callyPpopover4.current?.showPopover()} className="input input-sm input-border w-full text-left mt-1" id="cally4" style={{ anchorName: "--cally4" }}>{ordenTrabajoxUser.fechaInicio}</button>
              <div popover="auto" ref={callyPpopover4} className="dropdown bg-base-100 rounded-box shadow-lg" style={{ positionAnchor: "--cally4" }}>
                <calendar-date className="cally" onchange={(e)=>{document.getElementById("cally4").innerText = e.target.value; setordenTrabajoxUser((prev)=>({...prev,fechaInicio:e.target.value})); setconfirmarCambio(true);}}>
                  <svg aria-label="Previous" className="fill-current size-4" slot="previous" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.75 19.5 8.25 12l7.5-7.5"></path></svg>
                  <svg aria-label="Next" className="fill-current size-4" slot="next" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="m8.25 4.5 7.5 7.5-7.5 7.5"></path></svg>
                  <calendar-month></calendar-month>
                </calendar-date>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500">Fecha de finalizacion</p>
              <button disabled={!habilitarEdicion} type="button" onClick={()=>callyPpopover5.current?.showPopover()} className="input input-sm input-border w-full text-left mt-1" id="cally5" style={{ anchorName: "--cally5" }}>{ordenTrabajoxUser.fechaFinal}</button>
              <div popover="auto" ref={callyPpopover5} className="dropdown bg-base-100 rounded-box shadow-lg" style={{ positionAnchor: "--cally5" }}>
                <calendar-date className="cally" onchange={(e)=>{document.getElementById("cally5").innerText = e.target.value; setordenTrabajoxUser((prev)=>({...prev,fechaFinal:e.target.value})); setconfirmarCambio(true);}}>
                  <svg aria-label="Previous" className="fill-current size-4" slot="previous" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.75 19.5 8.25 12l7.5-7.5"></path></svg>
                  <svg aria-label="Next" className="fill-current size-4" slot="next" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="m8.25 4.5 7.5 7.5-7.5 7.5"></path></svg>
                  <calendar-month></calendar-month>
                </calendar-date>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500">Hora de inicio</p>
              <input type="time" disabled={!habilitarEdicion} className="input input-sm w-full mt-1" value={ordenTrabajoxUser.HoraInicio} onChange={(e)=>{setordenTrabajoxUser((prev)=>({...prev,HoraInicio:e.target.value}));setconfirmarCambio(true);}}/>
            </div>

            <div>
              <p className="text-xs text-gray-500">Hora de finalizacion</p>
              <input type="time" disabled={!habilitarEdicion} className="input input-sm w-full mt-1" value={ordenTrabajoxUser.HoraFinal} onChange={(e)=>{setordenTrabajoxUser((prev)=>({...prev,HoraFinal:e.target.value}));setconfirmarCambio(true);}}/>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <p className="text-xs text-gray-500">Area</p>
              <select disabled={!habilitarEdicion} value={ordenTrabajoxUser.Area} className="select select-sm w-full mt-1" onChange={(e)=>{setordenTrabajoxUser((prev)=>({...prev,Area:e.target.value}));setconfirmarCambio(true);}}>
                <option disabled>...</option>
                {areasAll.map((a)=> <option key={a.nombre} value={a.nombre}>{a.nombre}</option>)}
              </select>
            </div>

            <div>
              <p className="text-xs text-gray-500">Codigo</p>
              <select disabled={!habilitarEdicion} value={ordenTrabajoxUser.Codigo} className="select select-sm w-full mt-1" onChange={(e)=>{setordenTrabajoxUser((prev)=>({...prev,Codigo:e.target.value}));setconfirmarCambio(true);}}>
                <option disabled>...</option>
                {codigossAll.map((c)=> <option key={c.cod} value={c.cod}>{c.cod}</option>)}
              </select>
            </div>

            <div>
              <p className="text-xs text-gray-500">Maquina</p>
              <select disabled={!habilitarEdicion} value={ordenTrabajoxUser.Maquina} className="select select-sm w-full mt-1" onChange={(e)=>{setordenTrabajoxUser((prev)=>({...prev,Maquinaea:e.target.value})); setconfirmarCambio(true);}}>
                <option disabled>...</option>
                {maquinasAll.map((m)=> <option key={m.nombre} value={m.nombre}>{m.nombre}</option>)}
              </select>
            </div>

            <div>
              <p className="text-xs text-gray-500">Especificacion</p>
              <input type="text" disabled={!habilitarEdicion} className="input input-sm w-full mt-1" value={ordenTrabajoxUser.EspecificacionMaquina} onChange={(e)=>{setordenTrabajoxUser((prev)=>({...prev,HoraFinal:e.target.value})); setconfirmarCambio(true);}}/>
            </div>

            <div>
              <p className="text-xs text-gray-500">Categoria</p>
              <select disabled={!habilitarEdicion} value={ordenTrabajoxUser.Categoria} className="select select-sm w-full mt-1" onChange={(e)=>{setordenTrabajoxUser((prev)=>({...prev,Categoria:e.target.value})); setconfirmarCambio(true);}}>
                <option disabled>...</option>
                {categorias.map((ca)=> <option key={ca.nombre} value={ca.nombre}>{ca.nombre}</option>)}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <p className="text-xs text-gray-500">Tipo de trabajo</p>
              <select disabled={!habilitarEdicion} value={ordenTrabajoxUser.TipoTrabajo} className="select select-sm w-full mt-1" onChange={(e)=>{setordenTrabajoxUser((prev)=>({...prev,TipoTrabajo:e.target.value})); setconfirmarCambio(true);}}>
                <option disabled>...</option>
                {tiposTrabajo.map((tp)=> <option key={tp.tipo} value={tp.tipo}>{tp.tipo}</option>)}
              </select>
            </div>

            <div>
              <p className="text-xs text-gray-500">Descripcion</p>
              <input type="text" disabled={!habilitarEdicion} className="input input-sm w-full mt-1" value={ordenTrabajoxUser.DescripcionTrabajo ?? ""} onChange={(e)=>{setordenTrabajoxUser((prev)=>({...prev,DescripcionTrabajo:e.target.value})); setconfirmarCambio(true);}}/>
            </div>

            <div>
              <p className="text-xs text-gray-500">Solicitante</p>
              <select disabled={!habilitarEdicion} value={ordenTrabajoxUser.userSolicitante ?? ordenTrabajoxUser.userSolicitante?.name ?? "..."} className="select select-sm w-full mt-1" onChange={(e)=>{setordenTrabajoxUser((prev)=>({...prev,userSolicitante:{name: e.target.value}})); setconfirmarCambio(true);}}>
                <option disabled>...</option>
                {users.map((u)=> <option key={u.id} value={u.name}>{u.name}</option>)}
              </select>
            </div>

            <div>
              <p className="text-xs text-gray-500">Receptor</p>
              <select disabled={!habilitarEdicion} value={ordenTrabajoxUser.userReceptor ?? ordenTrabajoxUser.userReceptor?.name ?? "..."} className="select select-sm w-full mt-1" onChange={(e)=>{setordenTrabajoxUser((prev)=>({...prev,userReceptor:{name: e.target.value}})); setconfirmarCambio(true);}}>
                <option disabled>...</option>
                {users.map((u)=> <option key={u.id} value={u.name}>{u.name}</option>)}
              </select>
            </div>

            <div>
              <p className="text-xs text-gray-500">Tecnico</p>
              <select disabled={!habilitarEdicion} value={ordenTrabajoxUser.userTecnic ?? ordenTrabajoxUser.userTecnico?.name ?? "..."} className="select select-sm w-full mt-1" onChange={(e)=>{setordenTrabajoxUser((prev)=>({...prev,userTecnico:{name: e.target.value}})); setconfirmarCambio(true);}}>
                <option disabled>...</option>
                {users.map((u)=> <option key={u.id} value={u.name}>{u.name}</option>)}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <p className="text-xs text-gray-500">Estado</p>
              <select disabled={!habilitarEdicion} value={ordenTrabajoxUser.estadoTrabajo?.estado} className="select select-sm w-full mt-1" onChange={(e)=>{setordenTrabajoxUser((prev)=>({...prev,estadoTrabajo:{estado: e.target.value}})); setconfirmarCambio(true);}}>
                <option disabled>...</option>
                {estados.map((ee)=>(ee.estado === "EN PROCESO" || ee.estado === "VENCIDO"? <option key={ee.estado} disabled={true} value={ee.estado}>{ee.estado}</option> : <option key={ee.estado} value={ee.estado}>{ee.estado}</option>))}
              </select>
            </div>
          </div>
        </div>

        <div className="w-full h-14 flex items-center justify-between px-6">
          {habilitarEdicion ? (
            <>
              <button className="btn btn-primary" disabled={!confirmarCambio} onClick={editarOrdenTrabajo}>Hecho</button>
              <button className="btn btn-ghost" onClick={()=>{asignarSolicitantexOrden(ordenTrabajoxUser.id); sethabilitarEdicion(!habilitarEdicion); setconfirmarCambio(false);}}>Cancelar</button>
            </>
          ) : (
            <>
              <button className="btn" onClick={()=>sethabilitarEdicion(!habilitarEdicion)}>Editar</button>
              <button className="btn btn-ghost" onClick={()=>setventanaEmergente(!ventanaEmergente)}>Cerrar</button>
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
            <p className="text-gray-500">No hay fases pendientes para completar</p>
          </div>
        )}
      </div>
    </div>
  </>
);


}
