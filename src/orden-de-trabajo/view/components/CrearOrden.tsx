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
  

  const navigate = useNavigate();

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
     
      setshowSuccess(true);

      setTimeout(() => {
setshowSuccess(false);
        window.open(`/pdf/undefined`,"_blank");
   if(dialog.current){
  dialog.current.showModal();
}     
      }, 1000);

    }

    } catch (error) {
      console.log("Error al generar la solicitud: ",error);
    }

  }

  const redirigirSolMaterial = async() =>{
    setcargarAuto(true);
    setsendId(undefined); 
  }
  
 
 return (
  <>
    {showSuccess && (
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
    )}

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
        {/* Tiempos */}
        <div className="card bg-base-100 shadow-lg rounded-2xl p-4">
          <div className="card-body p-0">
            <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">
              Tiempos de trabajo
            </h2>

            <div className="grid gap-4 md:grid-cols-2 items-center">
              <div className="space-y-2">
                <label className="text-sm">Fecha y hora planificada</label>
                <div className="flex items-center gap-2">
                  
         <input type="date" className="input input-sm" value={tiempos[0]} onChange={(e)=>{const arr = tiempos; arr[0] = e.target.value; settiempos(arr);}} />
                 

                  <input
                    onChange={(e) => { const arr = tiempos; arr[1] = e.target.value; settiempos(arr); }}
                    type="time"
                    className="input input-bordered input-sm w-50"
                  />

                  <span className="text-sm opacity-70">Estimado</span>

                  <input
                    onChange={(e) => { const arr = tiempos; arr[2] = e.target.value; settiempos(arr); }}
                    type="time"
                    className="input input-bordered input-sm w-50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm">Fecha estimada de finalización</label>
                <div className="flex items-center gap-3">
               <input type="date" className="input input-sm" value={tiempos[3]} onChange={(e)=>{const arr = tiempos; arr[3] = e.target.value; settiempos(arr);}} />

                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ubicación */}
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
                  className="select select-bordered"
                  onChange={(e) => setselectArea(e.target.value)}
                >
                  <option disabled={true}>...</option>
                  {area?.map((a) => <option key={a?.nombre} value={a?.nombre}>{a?.nombre}</option>)}
                </select>
              </div>

              <div className="form-control">
                <label className="label p-0 pb-1"><span className="label-text">Codigo</span></label>
                <select
                  ref={select1}
                  defaultValue={'...'}
                  className="select select-bordered"
                  onChange={(e) => setselectCodigo(e.target.value)}
                >
                  <option disabled={true}>...</option>
                  {codigos?.map((c) => <option key={c?.cod} value={c?.cod}>{c?.cod}</option>)}
                </select>
              </div>

              <div className="form-control">
                <label className="label p-0 pb-1"><span className="label-text">Maquina</span></label>
                <select
                  defaultValue={'...'}
                  className="select select-bordered"
                  onChange={(e) => setselectMaquina(e.target.value)}
                >
                  <option disabled={true}>...</option>
                  {maquinas?.map((m) => <option key={m?.nombre} value={m?.nombre}>{m?.nombre}</option>)}
                </select>
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

        {/* Especificación del trabajo */}
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
                  className="select select-bordered"
                  onChange={(e) => {
                    const nueva = [...especificacion];
                    nueva[0] = e.target.value;
                    setespecificacion(nueva);
                  }}
                >
                  <option disabled={true}>...</option>
                  {categorias.map((c) => <option key={c.nombre} value={c.nombre}>{c.nombre}</option>)}
                </select>
              </div>

              <div className="form-control">
                <label className="label p-0 pb-1"><span className="label-text">Tipo de trabajo</span></label>
                <select
                  defaultValue={'...'}
                  className="select select-bordered"
                  onChange={(e) => {
                    const nueva = [...especificacion];
                    nueva[1] = e.target.value;
                    setespecificacion(nueva);
                  }}
                >
                  <option disabled={true}>...</option>
                  {tipoTrabajos.map((t) => <option key={t.tipo} value={t.tipo}>{t.tipo}</option>)}
                </select>
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

        {/* Personal */}
        <div className="card bg-base-100 shadow-lg rounded-2xl p-4">
          <div className="card-body p-0">
            <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">
              Personal
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="label p-0 pb-1"><span className="label-text">Solicitante</span></label>
                <select className="select select-bordered w-full" defaultValue={"..."} onChange={(e) => setsolicitante(e.target.value)}>
                  <option defaultChecked={true}>...</option>
                  {users.map((u) => <option key={u.name} value={u.name}>{u.name}</option>)}
                </select>
              </div>

              <div>
                <label className="label p-0 pb-1"><span className="label-text">Tecnico 1 (Receptor)</span></label>
                <select className="select select-bordered w-full" defaultValue={"..."} onChange={(e) => setreceptor(e.target.value)}>
                  <option defaultChecked={true} disabled={true}>...</option>
                  {users.map((u) => <option key={u.name} value={u.name}>{u.name}</option>)}
                </select>
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

        {/* Submit */}
        <div className="flex justify-center">
          <button className="btn btn-primary btn-lg px-10" type="submit">Crear</button>
        </div>
      </form>
    </div>
  </>
);

}
