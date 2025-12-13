import { useEffect, useRef, useState } from "react";
import { CalendarDate, CalendarMonth } from "cally";
import "cally";
import { areas, getAllCategorias, getAllCodByArea, getAllMaquinasByCod, getAllTipoTrabajo, getAllTipoTrabajoByCategoria, registerSolicitudOrden } from "../../controller/api/orden-api";
import type { Area } from "../../models/areas";
import type { Codigo } from "../../models/codigos";
import type { Maquina } from "../../models/maquinas";
import type { SolicitudOrden } from "../../models/solicitudOrden";
import { useNavigate } from "react-router-dom";
import { getUsers } from "../../../user/controller/api/user-api";

export const CrearOrden = () => {

  const [area, setarea] = useState<Area[]>([]);
  const [codigos, setcodigos] = useState<Codigo[]>([]);
  const [maquinas, setmaquinas] = useState<Maquina[]>([]);
  const [categorias, setcategorias] = useState<{nombre:string}[]>([]);
  const [users, setusers] = useState<{name:string}[]>([])
  const [tiempos, settiempos] = useState(Array(4));
  const [ubicacion, setubicacion] = useState(Array(3));
  const [especificacion, setespecificacion] = useState(Array(3));
  const [isEmptyArea, setisEmptyArea] = useState(false);
  const [isEmptyCod, setisEmptyCod] = useState(false);
  const callyPpopover1 = useRef(null);
  const callyPpopover2 = useRef(null);
  const callyPpopover3 = useRef(null);
  const select1 = useRef(null);
  const [descripcion, setdescripcion] = useState(null);
  const [tipoTrabajoShow, settipoTrabajoShow] = useState(false);
  const [tipoTrabajos, settipoTrabajos] = useState<{tipo:string}[]>([]);
  const [solicitante, setsolicitante] = useState("");
  const [receptor, setreceptor] = useState("");
  const [tecnico, settecnico] = useState(null);
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
    if(ubicacion[0] != undefined){
     setisEmptyArea(true);
     
     const getCodigos = async () => {
        
        const data = await getAllCodByArea(ubicacion[0]);
        console.log(data);
        setcodigos(data);
      }
      getCodigos();
      console.log(codigos);
    }

    if(ubicacion[1] != undefined){
      setisEmptyCod(true);
     select1.current.selectedIndex;
      const getMaquinas = async () => {
        
        const data = await getAllMaquinasByCod(ubicacion[1]);
        
        setmaquinas(data);
        console.log("current: ",select1.current.value);
        console.log("ubicacion[1]: ",ubicacion[1]);

        if(select1.current.value != ubicacion[1]){
           const newArr = [...ubicacion];
           newArr[1] = select1.current.value;
           setubicacion(newArr);        }
      }
      getMaquinas();
      console.log("maquinas: ",maquinas);
    }
    
  }, [ubicacion]);

  useEffect(() => {
 
       const setTiposTrabajos = async() => {

        const AlltiposTrabajos = await getAllTipoTrabajo(especificacion[0]);
        settipoTrabajos(AlltiposTrabajos);
       }
        setTiposTrabajos();


  }, []);
  
  const addSolicitudOrden = async(e:Event) =>{
       e.preventDefault();
    try {
       const infoSolicitud:SolicitudOrden ={
      fechaInicio:tiempos[0],
      fechaFinal:tiempos[3],
      HoraInicio:tiempos[1],
      HoraFinal:tiempos[2],
      Area:ubicacion[0],
      Codigo:ubicacion[1],
      Maquina:ubicacion[2],
      EspecificacionMaquina:ubicacion[3],
      Categoria:especificacion[0],
      TipoTrabajo:especificacion[1],
      DescripcionTrabajo:especificacion[2],
      userSolicitante:solicitante,
      userReceptor:receptor,
      userTecnico:tecnico
    } 
    const res = await registerSolicitudOrden(infoSolicitud);
    alert(res.msj);
    if(res.validate){
    window.open(`/pdf/undefined`,"_blank");}

    } catch (error) {
      console.log("Error al generar la solicitud: ",error);
    }

  }
  
 
  return (
    <>
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
                const nueva = [...ubicacion];
                nueva[0] = e.target.value;
                setubicacion(nueva);
              }}>
                <option disabled={true}>...</option>
                {area.map((a) =>
                  <>
                    <option value={a?.nombre}>{a?.nombre}</option>
                  </>
                )}
              </select>

              <p className="mx-2">Codigo</p>
              <select ref={select1}  disabled={!isEmptyArea} defaultValue={'...'} className="select" id="" onChange={(e) => {
                const nueva = [...ubicacion];
                nueva[1] = e.target.value;
                setubicacion(nueva)
              }}>
                <option disabled={true}>...</option>
                {codigos.map((c) => <>
                  <option value={c?.cod}>{c?.cod}</option>
                </>)}
              </select>

              <p className="mx-2">Maquina</p>
              <select disabled={!isEmptyCod} defaultValue={'...'} className="select" id="" onChange={(e) => {
                const nueva = [...ubicacion];
                nueva[2] = e.target.value;
                setubicacion(nueva)
              }}>
                <option disabled={true}>...</option>
                {maquinas.map((m) => <>
                  <option value={m?.nombre }>{m?.nombre}</option>
                </>)}
              </select>
            </div>
            <div className="flex flex-row px-2">
              <p className="mr-2">Equipos/Piezas</p>
              <textarea className="textarea" onChange={(e) => {
                const nueva = [...ubicacion];
                nueva[3] = e.target.value;
                setubicacion(nueva)
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
             <label htmlFor="" className="mr-2">Receptor</label> 
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

  <div className="my-2 flex items-center justify-center"><button className="btn p-4" type="submit">Send</button></div>
          
        </form>
      </div>
    </>
  )
}
