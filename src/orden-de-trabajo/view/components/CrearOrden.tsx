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
  <div className="fixed top-5 right-5 z-50">
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
      <span>¡Orden de trabajo creada!</span>
    </div>
  </div>
)}



<dialog ref={dialog} id="my_modal_1" className="modal">
  <div className="modal-box">
    <h3 className="font-bold text-lg">Solicitud de material!</h3>
    <p className="py-4">¿Desea generar la solicitud de material?</p>
    <div className="modal-action">
      <form method="dialog">
        <button className="btn mr-3" onClick={redirigirSolMaterial}>Crear</button>
        <button className="btn">Cancelar</button>
      </form>
    </div>
  </div>
</dialog>
      <div className='flex items-center justify-center mt-[20%]'>
        <form className='min-w-170'  onSubmit={(e) => { addSolicitudOrden(e); }} >
          <div className=' bg-gray-100 rounded-xl shadow-md p-4 mb-6'>
             <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">
    Tiempos de trabajo
  </h2>
            <div>
              <div className='flex flex-row mb-3 my-4 px-2'>
                <p>Fecha y hora planificada</p> <button type="button" onClick={() => { callyPpopover1.current?.showPopover() }} className="input input-border" id="cally1" style={{ anchorName: "--cally1" }}>
                  Pick a date
                </button>
                <div popover="auto" ref={callyPpopover1} className="dropdown bg-base-100 rounded-box shadow-lg" style={{ positionAnchor: "--cally1" }}>
                  <calendar-date className="cally" onchange={(e) =>{document.getElementById("cally1").innerText = e.target.value; const arr = tiempos; arr[0] = e.target.value; settiempos(arr);}}>
                    <svg aria-label="Previous" className="fill-current size-4" slot="previous" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.75 19.5 8.25 12l7.5-7.5"></path></svg>
                    <svg aria-label="Next" className="fill-current size-4" slot="next" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="m8.25 4.5 7.5 7.5-7.5 7.5"></path></svg>
                    <calendar-month></calendar-month>
                  </calendar-date>
                </div>
                <div className="mx-2"></div>
                <input onChange={(e)=>{const arr = tiempos; arr[1] = e.target.value; settiempos(arr);}} type="time" className="input" />
                <div className="mx-2"></div>
                <p>Tiempo estimado</p> <div className="mx-2"></div> <input onChange={(e)=>{const arr = tiempos; arr[2] = e.target.value; settiempos(arr);}} type="time" className="input" />
              </div>
              <div className='flex flex-row px-2'><p className="mr-2">Fecha estimada de finalizacion</p> <button type="button" onClick={() => { callyPpopover3.current?.showPopover() }} className="input input-border" id="cally3" style={{ anchorName: "--cally3" }}>
                  Pick a date
                </button>
                <div popover="auto" ref={callyPpopover3} className="dropdown bg-base-100 rounded-box shadow-lg" style={{ positionAnchor: "--cally3" }}>
                  <calendar-date className="cally" onchange={(e) =>{document.getElementById("cally3").innerText = e.target.value; const arr = tiempos; arr[3] = e.target.value; settiempos(arr);}}>
                    <svg aria-label="Previous" className="fill-current size-4" slot="previous" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.75 19.5 8.25 12l7.5-7.5"></path></svg>
                    <svg aria-label="Next" className="fill-current size-4" slot="next" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="m8.25 4.5 7.5 7.5-7.5 7.5"></path></svg>
                    <calendar-month></calendar-month>
                  </calendar-date>
                </div></div>
            </div>
          </div>

          <div className="bg-gray-100 rounded-xl shadow-md p-4 mb-6">
             <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">
    Ubicación
  </h2>
            <div className="flex flex-row mb-4 px-2">
              <p className="mr-2">Area</p>
              <select defaultValue={'...'} className="select" id="" onChange={(e) => {
              setselectArea(e.target.value);
              }}>
                <option disabled={true}>...</option>
                {area?.map((a) =>
                  <>
                    <option value={a?.nombre}>{a?.nombre}</option>
                  </>
                )}
              </select>

              <p className="mx-2">Codigo</p>
              <select ref={select1}  defaultValue={'...'} className="select" id="" onChange={(e) => {
                setselectCodigo(e.target.value);
               
              }}>
                <option disabled={true}>...</option>
                {codigos?.map((c) => <>
                  <option value={c?.cod}>{c?.cod}</option>
                </>)}
              </select>

              <p className="mx-2">Maquina</p>
              <select defaultValue={'...'} className="select" id="" onChange={(e) => {
                setselectMaquina(e.target.value);
              }}>
                <option disabled={true}>...</option>
                {maquinas?.map((m) => <>
                  <option value={m?.nombre }>{m?.nombre}</option>
                </>)}
              </select>
            </div>
            <div className="flex flex-row px-2">
              <p className="mr-2">Equipos/Piezas</p>
              <textarea className="textarea" onChange={(e) => {
              setespecPiezas(e.target.value);
              }}></textarea>
            </div>
          </div>

         <div className="bg-gray-100 rounded-xl shadow-md p-4 mb-6">
  <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">
    Especificación del trabajo
  </h2>
            <div className="px-2">
              <p className="mr-2">Categoria</p>
              <select defaultValue={'...'} className="select" id="" onChange={(e) => {
                const nueva = [...especificacion];
                nueva[0] = e.target.value;
                setespecificacion(nueva);

              }}>
                <option disabled={true}>...</option>
                {categorias.map((c) => <>
                  <option value={c.nombre}>{c.nombre}</option>
                </>)}
              </select>
            </div>
            <div className="px-2">
              <p className="mr-2">Tipo de trabajo</p>
              <select defaultValue={'...'} className="select" onChange={(e)=>{
                const nueva = [...especificacion];
                nueva[1] = e.target.value;
                setespecificacion(nueva);
              }      
              }>
                <option disabled={true}>...</option>
                {tipoTrabajos.map((t) => <>
                  <option value={t.tipo}>{t.tipo}</option>
                </>)}
              </select>
            </div>
            <div className="px-2">
              <p className="mr-2">Descripcion del trabajo</p>
              <textarea className="textarea" id="" onChange={(e) => {
                const nueva = [...especificacion];
                nueva[2] = e.target.value;
                setespecificacion(nueva)
              }}></textarea>
            </div>
          </div>
         <div className="bg-gray-50 rounded-xl shadow p-4 mt-6">
  <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">
    Personal
  </h2>
          <div className="mt-4"><div className="flex"><label htmlFor="" className="mr-2">Solicitante</label> 
          <select className="select mr-2" defaultValue={"..."} onChange={(e)=>setsolicitante(e.target.value)}>
            <option defaultChecked={true}>...</option>
            {users.map((u)=><>
             <option value={u.name}>{u.name}</option>
            </>)}
            </select>
             <label htmlFor="" className="mr-2">Tecnico 1</label> 
            <select className="select" defaultValue={"..."} onChange={(e)=>setreceptor(e.target.value)}>
            <option defaultChecked={true} disabled={true}>...</option>
            {users.map((u)=><>
             <option value={u.name}>{u.name}</option>
            </>)}
            </select></div>
            <div className="mt-5">
              <label htmlFor="" className="mr-2">Tecnico 2</label>
              <select className="select" defaultValue={"..."} onChange={(e)=>settecnico(e.target.value)}>
            <option defaultChecked={true} disabled={true}>...</option>
            {users.map((u)=><>
             <option value={u.name}>{u.name}</option>
            </>)}
            </select>
              </div></div>
          <div></div>
         </div>

  <div className="my-2 flex items-center justify-center"><button className="btn p-4 btn-primary" type="submit">Crear</button></div>
          
        </form>
      </div>
    </>
  )
}
