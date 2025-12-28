import { useEffect, useRef, useState } from "react";
import { CalendarDate, CalendarMonth } from "cally";
import "cally";
import { areas, getAllCategorias, getAllCodByArea, getAllMaquinasByCod, getAllTipoTrabajo, getAllTipoTrabajoByCategoria, getLastSolicitud, registerSolicitudOrden } from "../../controller/api/orden-api";
import type { Area } from "../../models/areas";
import type { Codigo } from "../../models/codigos";
import type { Maquina } from "../../models/maquinas";
import type { SolicitudOrden } from "../../models/solicitudOrden";
import { useNavigate } from "react-router-dom";
import { getUsers } from "../../../user/controller/api/user-api";

export const CrearOrden = ({setcargarAuto,setsendId}) => {

  const [area, setarea] = useState<Area[]>([]);
  const [codigos, setcodigos] = useState<Codigo[]>([]);
  const [maquinas, setmaquinas] = useState<Maquina[]>([]);
  const [categorias, setcategorias] = useState<{nombre:string}[]>([]);
  const [users, setusers] = useState<{name:string}[]>([])
  const [tiempos, settiempos] = useState(Array(4));
  const [ubicacion, setubicacion] = useState(Array(3));
  const [selectArea, setselectArea] = useState("");
  const [selectCodigo, setselectCodigo] = useState("");
  const [selectMaquina, setselectMaquina] = useState("");
  const [especPiezas, setespecPiezas] = useState("");
  const [especificacion, setespecificacion] = useState(Array(3));
  const [isEmptyArea, setisEmptyArea] = useState(false);
  const [isEmptyCod, setisEmptyCod] = useState(false);
  const callyPpopover1 = useRef(null);
  const callyPpopover2 = useRef(null);
  const callyPpopover3 = useRef(null);
  const select1 = useRef<HTMLSelectElement|null>(null);
  const [descripcion, setdescripcion] = useState(null);
  const [tipoTrabajoShow, settipoTrabajoShow] = useState(false);
  const [tipoTrabajos, settipoTrabajos] = useState<{tipo:string}[]>([]);
  const [solicitante, setsolicitante] = useState("");
  const [receptor, setreceptor] = useState("");
  const [tecnico, settecnico] = useState(null);
  const [showSuccess, setshowSuccess] = useState(false);
  
  // Estados para validaciones y alertas
  const [erroresCrearOrden, seterroresCrearOrden] = useState({});
  const [showErrorCrearOrden, setshowErrorCrearOrden] = useState(false);
  const [showSuccessCrearOrden, setshowSuccessCrearOrden] = useState(false);
  const [mensajeErrorCrearOrden, setmensajeErrorCrearOrden] = useState("");

  const navigate = useNavigate();

  // Validaciones de campos obligatorios
  const validarArea = (valor) => !valor || valor === "..." ? "El área es requerida" : "";
  const validarCodigo = (valor) => !valor || valor === "..." ? "El código es requerido" : "";
  const validarMaquina = (valor) => !valor || valor === "..." ? "La máquina es requerida" : "";
  const validarCategoria = (valor) => !valor || valor === "..." ? "La categoría es requerida" : "";
  const validarTipoTrabajo = (valor) => !valor || valor === "..." ? "El tipo de trabajo es requerido" : "";
  const validarSolicitante = (valor) => !valor || valor === "..." ? "El solicitante es requerido" : "";
  const validarReceptor = (valor) => !valor || valor === "..." ? "El técnico 1 (receptor) es requerido" : "";

  // Validaciones de fechas y horas
  const validarFechaInicio = (valor) => !valor ? "La fecha de inicio es requerida" : "";
  const validarHoraInicio = (valor) => !valor ? "La hora de inicio es requerida" : "";
  const validarHoraFin = (valor) => !valor ? "La hora de fin estimada es requerida" : "";
  const validarFechaFin = (valor) => !valor ? "La fecha de finalización es requerida" : "";

  const validarCoherenciaFechas = (fechaIni, horaIni, horaFin, fechaFin) => {
    if (!fechaIni || !fechaFin) return "";
    if (fechaIni > fechaFin) {
      return "La fecha de inicio no puede ser mayor que la de finalización";
    }
    if (fechaIni === fechaFin && horaIni && horaFin && horaIni > horaFin) {
      return "La hora de inicio no puede ser mayor que la de fin";
    }
    return "";
  };

  const limpiarErroresCrearOrden = () => {
    seterroresCrearOrden({});
    setshowErrorCrearOrden(false);
   // setshowSuccessCrearOrden(false);
    setmensajeErrorCrearOrden("");
  };

  useEffect(() => {
    
    const getAreas = async () => {
      
      const data = await areas();
      setarea(data);
    }

    const  getCategorias = async () => {
      const res = await getAllCategorias();
      console.log(res);
      setcategorias(res);
      };



    const getAllUsers = async () => {
      const res = await getUsers();
      setusers(res);
    }  
    
    getAreas();
    getCategorias();
    getAllUsers();

    settiempos(["","09:30","16:30",""]);

  }, []);

  useEffect(() => {

     if(selectArea != ""){
const getCodigos = async () => {
        
        const data = await getAllCodByArea(selectArea);
        console.log(data);
        setcodigos(data);
           if(select1.current){
     select1.current.value = "...";
      }
    setmaquinas([]);
    }
      getCodigos();
    
     }

    
  }, [selectArea]);

  useEffect(() => {
  
    const getMaquinas = async () => {
      const data = await getAllMaquinasByCod(selectCodigo);
       
        setmaquinas(data);
      }
      getMaquinas();
  }, [selectCodigo])
  

  useEffect(() => {
 
       const setTiposTrabajos = async() => {

        const AlltiposTrabajos = await getAllTipoTrabajo(especificacion[0]);
        settipoTrabajos(AlltiposTrabajos);
       }
        setTiposTrabajos();


  }, []);

  const dialog = useRef<HTMLDialogElement|null>(null);
  
  const addSolicitudOrden = async(e:Event) =>{
       e.preventDefault();
    
    // Validar campos obligatorios
    const nuevosErrores = {
      area: validarArea(selectArea),
      codigo: validarCodigo(selectCodigo),
      maquina: validarMaquina(selectMaquina),
      categoria: validarCategoria(especificacion[0]),
      tipoTrabajo: validarTipoTrabajo(especificacion[1]),
      solicitante: validarSolicitante(solicitante),
      receptor: validarReceptor(receptor),
      fechaInicio: validarFechaInicio(tiempos[0]),
      horaInicio: validarHoraInicio(tiempos[1]),
      horaFin: validarHoraFin(tiempos[2]),
      fechaFin: validarFechaFin(tiempos[3]),
      coherenciaFechas: validarCoherenciaFechas(tiempos[0], tiempos[1], tiempos[2], tiempos[3])
    };

    seterroresCrearOrden(nuevosErrores);

    // Si hay errores, mostrar mensaje
    if (Object.values(nuevosErrores).some(error => error !== "")) {
      setmensajeErrorCrearOrden("Por favor complete correctamente todos los campos obligatorios");
      setshowErrorCrearOrden(true);
      setTimeout(() => {
        setshowErrorCrearOrden(false);
      }, 3000);
      return;
    }

    try {
       const infoSolicitud:SolicitudOrden ={
      fechaInicio:tiempos[0],
      fechaFinal:tiempos[3],
      HoraInicio:tiempos[1],
      HoraFinal:tiempos[2],
      Area:selectArea,
      Codigo:selectCodigo,
      Maquina:selectMaquina,
      EspecificacionMaquina:especPiezas,
      Categoria:especificacion[0],
      TipoTrabajo:especificacion[1],
      DescripcionTrabajo:especificacion[2],
      userSolicitante:solicitante,
      userReceptor:receptor,
      userTecnico:tecnico
    } 
    console.log(infoSolicitud);
    const res = await registerSolicitudOrden(infoSolicitud);
    
    if(res.validate){
     
      
      setmensajeErrorCrearOrden("¡Orden de trabajo creada correctamente!");
      setshowSuccessCrearOrden(true);
      limpiarErroresCrearOrden();

      setTimeout(() => {
        window.open(`/pdf/undefined`,"_blank");
        setshowSuccessCrearOrden(false);
        
   if(dialog.current){
  dialog.current.showModal();
}     
      }, 2000);

    } else {
      setmensajeErrorCrearOrden(res.msj || "Error al crear la orden de trabajo");
      setshowErrorCrearOrden(true);
      setTimeout(() => {
        setshowErrorCrearOrden(false);
      }, 3000);
    }

    } catch (error) {
      console.log("Error al generar la solicitud: ",error);
      setmensajeErrorCrearOrden("Error al generar la solicitud");
      setshowErrorCrearOrden(true);
      setTimeout(() => {
        setshowErrorCrearOrden(false);
      }, 3000);
    }

  }

  const redirigirSolMaterial = async() =>{
    setcargarAuto(true);
    setsendId(undefined); 
  }
  
 
 return (
  <>
    {showSuccessCrearOrden && (
      <div className="fixed top-5 right-5 z-50">
        <div role="alert" className="alert alert-success shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{ "¡Orden de trabajo creada correctamente!"}</span>
        </div>
      </div>
    )}

    {showErrorCrearOrden && (
      <div className="fixed top-5 right-5 z-50">
        <div role="alert" className="alert alert-error shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{mensajeErrorCrearOrden}</span>
        </div>
      </div>
    )}

    {/*showSuccess && (
      <div className="fixed top-6 right-6 z-50">
        <div role="alert" className="alert alert-success shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="font-medium">¡Orden de trabajo creada!</h3>
            <div className="text-sm">La orden se generó correctamente.</div>
          </div>
        </div>
      </div>
    )*/}

    <dialog ref={dialog} id="my_modal_1" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Solicitud de material!</h3>
        <p className="py-4">¿Desea generar la solicitud de material?</p>
        <div className="modal-action">
          <form method="dialog" className="flex gap-2">
            <button className="btn btn-primary" onClick={redirigirSolMaterial}>Crear</button>
            <button className="btn">Cancelar</button>
          </form>
        </div>
      </div>
    </dialog>

    <div className="max-w-4xl mx-auto p-6">
      <form className="space-y-6" onSubmit={(e) => { addSolicitudOrden(e); }}>
        
        <div className="card bg-base-100 shadow-lg rounded-2xl p-4">
          <div className="card-body p-0">
            <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">
              Tiempos de trabajo
            </h2>

            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-3 block">Fecha y hora planificada</label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <input 
                      type="date" 
                      className={`input input-sm w-full ${erroresCrearOrden.fechaInicio ? 'input-error' : ''}`}
                      value={tiempos[0] || ''} 
                      onChange={(e)=>{const arr = tiempos; arr[0] = e.target.value; settiempos(arr); seterroresCrearOrden({...erroresCrearOrden, fechaInicio: validarFechaInicio(e.target.value), coherenciaFechas: validarCoherenciaFechas(e.target.value, tiempos[1], tiempos[2], tiempos[3])});}} 
                    />
                    <div className="h-5">{erroresCrearOrden.fechaInicio && <p className="text-red-500 text-xs">{erroresCrearOrden.fechaInicio}</p>}</div>
                  </div>

                  <div>
                    <input
                      onChange={(e) => { const arr = tiempos; arr[1] = e.target.value; settiempos(arr); seterroresCrearOrden({...erroresCrearOrden, horaInicio: validarHoraInicio(e.target.value), coherenciaFechas: validarCoherenciaFechas(tiempos[0], e.target.value, tiempos[2], tiempos[3])}); }}
                      type="time"
                      className={`input input-sm w-full ${erroresCrearOrden.horaInicio ? 'input-error' : ''}`}
                      value={tiempos[1] || ''}
                    />
                    <div className="h-5">{erroresCrearOrden.horaInicio && <p className="text-red-500 text-xs">{erroresCrearOrden.horaInicio}</p>}</div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <input
                        onChange={(e) => { const arr = tiempos; arr[2] = e.target.value; settiempos(arr); seterroresCrearOrden({...erroresCrearOrden, horaFin: validarHoraFin(e.target.value), coherenciaFechas: validarCoherenciaFechas(tiempos[0], tiempos[1], e.target.value, tiempos[3])}); }}
                        type="time"
                        className={`input input-sm w-full ${erroresCrearOrden.horaFin ? 'input-error' : ''}`}
                        value={tiempos[2] || ''}
                      />
                      <span className="text-xs opacity-70 whitespace-nowrap">Est.</span>
                    </div>
                    <div className="h-5">{erroresCrearOrden.horaFin && <p className="text-red-500 text-xs">{erroresCrearOrden.horaFin}</p>}</div>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-3 block">Fecha estimada de finalización</label>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <input 
                      type="date" 
                      className={`input input-sm w-full ${erroresCrearOrden.fechaFin ? 'input-error' : ''}`}
                      value={tiempos[3] || ''} 
                      onChange={(e)=>{const arr = tiempos; arr[3] = e.target.value; settiempos(arr); seterroresCrearOrden({...erroresCrearOrden, fechaFin: validarFechaFin(e.target.value), coherenciaFechas: validarCoherenciaFechas(tiempos[0], tiempos[1], tiempos[2], e.target.value)});}} 
                    />
                    <div className="h-5">{erroresCrearOrden.fechaFin && <p className="text-red-500 text-xs">{erroresCrearOrden.fechaFin}</p>}</div>
                  </div>
                </div>
                <div className="h-5 mt-2">{erroresCrearOrden.coherenciaFechas && <p className="text-red-500 text-xs">{erroresCrearOrden.coherenciaFechas}</p>}</div>
              </div>
            </div>
          </div>
        </div>

        
        <div className="card bg-base-100 shadow-lg rounded-2xl p-4">
          <div className="card-body p-0">
            <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">
              Ubicación
            </h2>

            <div className="grid gap-4 md:grid-cols-3 items-end">
              <div className="form-control">
                <label className="label p-0 pb-1"><span className="label-text">Area</span></label>
                <select
                  defaultValue={'...'}
                  className={`select select-bordered ${erroresCrearOrden.area ? 'select-error' : ''}`}
                  onChange={(e) => {setselectArea(e.target.value); seterroresCrearOrden({...erroresCrearOrden, area: validarArea(e.target.value)});}}
                >
                  <option disabled={true}>...</option>
                  {area?.map((a) => <option key={a?.nombre} value={a?.nombre}>{a?.nombre}</option>)}
                </select>
                <div className="h-5">{erroresCrearOrden.area && <p className="text-red-500 text-sm">{erroresCrearOrden.area}</p>}</div>
              </div>

              <div className="form-control">
                <label className="label p-0 pb-1"><span className="label-text">Codigo</span></label>
                <select
                  ref={select1}
                  defaultValue={'...'}
                  className={`select select-bordered ${erroresCrearOrden.codigo ? 'select-error' : ''}`}
                  onChange={(e) => {setselectCodigo(e.target.value); seterroresCrearOrden({...erroresCrearOrden, codigo: validarCodigo(e.target.value)});}}
                >
                  <option disabled={true}>...</option>
                  {codigos?.map((c) => <option key={c?.cod} value={c?.cod}>{c?.cod}</option>)}
                </select>
                <div className="h-5">{erroresCrearOrden.codigo && <p className="text-red-500 text-sm">{erroresCrearOrden.codigo}</p>}</div>
              </div>

              <div className="form-control">
                <label className="label p-0 pb-1"><span className="label-text">Maquina</span></label>
                <select
                  defaultValue={'...'}
                  className={`select select-bordered ${erroresCrearOrden.maquina ? 'select-error' : ''}`}
                  onChange={(e) => {setselectMaquina(e.target.value); seterroresCrearOrden({...erroresCrearOrden, maquina: validarMaquina(e.target.value)});}}
                >
                  <option disabled={true}>...</option>
                  {maquinas?.map((m) => <option key={m?.nombre} value={m?.nombre}>{m?.nombre}</option>)}
                </select>
                <div className="h-5">{erroresCrearOrden.maquina && <p className="text-red-500 text-sm">{erroresCrearOrden.maquina}</p>}</div>
              </div>
            </div>

            <div className="mt-4">
              <label className="label p-0 pb-1"><span className="label-text">Equipos/Piezas</span></label>
              <textarea
                className="textarea textarea-bordered w-full"
                onChange={(e) => setespecPiezas(e.target.value)}
              />
            </div>
          </div>
        </div>

        
        <div className="card bg-base-100 shadow-lg rounded-2xl p-4">
          <div className="card-body p-0">
            <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">
              Especificación del trabajo
            </h2>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="form-control">
                <label className="label p-0 pb-1"><span className="label-text">Categoria</span></label>
                <select
                  defaultValue={'...'}
                  className={`select select-bordered ${erroresCrearOrden.categoria ? 'select-error' : ''}`}
                  onChange={(e) => {
                    const nueva = [...especificacion];
                    nueva[0] = e.target.value;
                    setespecificacion(nueva);
                    seterroresCrearOrden({...erroresCrearOrden, categoria: validarCategoria(e.target.value)});
                  }}
                >
                  <option disabled={true}>...</option>
                  {categorias.map((c) => <option key={c.nombre} value={c.nombre}>{c.nombre}</option>)}
                </select>
                <div className="h-5">{erroresCrearOrden.categoria && <p className="text-red-500 text-sm">{erroresCrearOrden.categoria}</p>}</div>
              </div>

              <div className="form-control">
                <label className="label p-0 pb-1"><span className="label-text">Tipo de trabajo</span></label>
                <select
                  defaultValue={'...'}
                  className={`select select-bordered ${erroresCrearOrden.tipoTrabajo ? 'select-error' : ''}`}
                  onChange={(e) => {
                    const nueva = [...especificacion];
                    nueva[1] = e.target.value;
                    setespecificacion(nueva);
                    seterroresCrearOrden({...erroresCrearOrden, tipoTrabajo: validarTipoTrabajo(e.target.value)});
                  }}
                >
                  <option disabled={true}>...</option>
                  {tipoTrabajos.map((t) => <option key={t.tipo} value={t.tipo}>{t.tipo}</option>)}
                </select>
                <div className="h-5">{erroresCrearOrden.tipoTrabajo && <p className="text-red-500 text-sm">{erroresCrearOrden.tipoTrabajo}</p>}</div>
              </div>

              <div className="form-control">
                <label className="label p-0 pb-1"><span className="label-text">Descripcion del trabajo</span></label>
                <textarea
                  className="textarea textarea-bordered h-24"
                  onChange={(e) => {
                    const nueva = [...especificacion];
                    nueva[2] = e.target.value;
                    setespecificacion(nueva);
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        
        <div className="card bg-base-100 shadow-lg rounded-2xl p-4">
          <div className="card-body p-0">
            <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">
              Personal
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="label p-0 pb-1"><span className="label-text">Solicitante</span></label>
                <select className={`select select-bordered w-full ${erroresCrearOrden.solicitante ? 'select-error' : ''}`} defaultValue={"..."} onChange={(e) => {setsolicitante(e.target.value); seterroresCrearOrden({...erroresCrearOrden, solicitante: validarSolicitante(e.target.value)})}}>
                  <option defaultChecked={true}>...</option>
                  {users.map((u) => <option key={u.name} value={u.name}>{u.name}</option>)}
                </select>
                <div className="h-5">{erroresCrearOrden.solicitante && <p className="text-red-500 text-sm">{erroresCrearOrden.solicitante}</p>}</div>
              </div>

              <div>
                <label className="label p-0 pb-1"><span className="label-text">Tecnico 1</span></label>
                <select className={`select select-bordered w-full ${erroresCrearOrden.receptor ? 'select-error' : ''}`} defaultValue={"..."} onChange={(e) => {setreceptor(e.target.value); seterroresCrearOrden({...erroresCrearOrden, receptor: validarReceptor(e.target.value)})}}>
                  <option defaultChecked={true} disabled={true}>...</option>
                  {users.map((u) => <option key={u.name} value={u.name}>{u.name}</option>)}
                </select>
                <div className="h-5">{erroresCrearOrden.receptor && <p className="text-red-500 text-sm">{erroresCrearOrden.receptor}</p>}</div>
              </div>

              <div className="md:col-span-2">
                <label className="label p-0 pb-1"><span className="label-text">Tecnico 2</span></label>
                <select className="select select-bordered w-full" defaultValue={"..."} onChange={(e) => settecnico(e.target.value)}>
                  <option defaultChecked={true} disabled={true}>...</option>
                  {users.map((u) => <option key={u.name} value={u.name}>{u.name}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        
        <div className="flex justify-center">
          <button className="btn btn-primary btn-lg px-10" type="submit">Crear</button>
        </div>
      </form>
    </div>
  </>
);

}
