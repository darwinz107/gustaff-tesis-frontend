import { useEffect, useRef, useState } from "react";
import { CalendarDate, CalendarMonth } from "cally";
import "cally";
import { areas, getAllCodByArea } from "../../controller/api/orden-api";
import type { Area } from "../../models/areas";
import type { Codigo } from "../../models/codigos";

export const CrearOrden = () => {

  const [area, setarea] = useState<Area[]>([]);
  const [codigos, setcodigos] = useState<Codigo[]>([])
  const [tiempos, settiempos] = useState(Array(4));
  const [ubicacion, setubicacion] = useState(Array(3));
  const [especificacion, setespecificacion] = useState(Array(2));
  const [isEmptyArea, setisEmptyArea] = useState(false);
  const [isEmptyCod, setisEmptyCod] = useState(false);
  const callyPpopover1 = useRef(null);
  const callyPpopover2 = useRef(null);
  const callyPpopover3 = useRef(null);

  
  const maquinas = ["DESKTOP-01", "DESKTOP-02", "DESKTOP-03", "DESKTOP-04"];
  const categorias = ["VARIOS", "GASFITERIA", "MECANICA", "SOLDADURA"];
  const tiposTrabajos = ["MODIFICACION", "HABILITACION", "VARIOS", "ADECUACION"];

  useEffect(() => {
    
    const getAreas = async () => {
      
      const data = await areas();
      setarea(data);
    }
    getAreas();
  }, []);

  useEffect(() => {
    if(ubicacion[0] != undefined && isEmptyArea ==false){
      setisEmptyArea(true);
      const getCodigos = async () => {
        
        const data = await getAllCodByArea(ubicacion[0]);
        console.log(data);
        setcodigos(data);
      }
      getCodigos();
    }

    if(ubicacion[1] != undefined && isEmptyCod ==false){
      setisEmptyCod(true);
    }
  }, [ubicacion])
  
  




  return (
    <>
      <div className='flex items-center justify-center mt-8'>
        <form className='min-w-170 border border-black-700' action="" onSubmit={(e) => { e.preventDefault(); console.log(ubicacion) }}>
          <div className=' mb-4'>
            <p className='border-4 border-black-800 text-center'>Tiempos de trabajo</p>
            <div>
              <div className='flex flex-row mb-3 my-4'>
                <p>Fecha y hora planificada</p> <button onClick={() => { callyPpopover1.current?.showPopover() }} className="input input-border" id="cally1" style={{ anchorName: "--cally1" }}>
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
              <div className='flex flex-row'><p className="mr-2">Fecha estimada de finalizacion</p> <button type="button" onClick={() => { callyPpopover3.current?.showPopover() }} className="input input-border" id="cally3" style={{ anchorName: "--cally3" }}>
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

          <div >
            <p className='border-4 border-black-800 mb-4 text-center'>Ubicacion</p>
            <div className="flex flex-row mb-4">
              <p className="mr-2">Area</p>
              <select defaultValue={'...'} className="select" id="" onChange={(e) => {
                const nueva = [...ubicacion];
                nueva[0] = e.target.value;
                setubicacion(nueva);
              }}>
                <option disabled={true}>...</option>
                {area.map((a) =>
                  <>
                    <option value={a.nombre}>{a.nombre}</option>
                  </>
                )}
              </select>

              <p className="mx-2">Codigo</p>
              <select disabled={!isEmptyArea} defaultValue={'...'} className="select" id="" onChange={(e) => {
                const nueva = [...ubicacion];
                nueva[1] = e.target.value;
                setubicacion(nueva)
              }}>
                <option disabled={true}>...</option>
                {codigos.map((c) => <>
                  <option value={c.cod}>{c.cod}</option>
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
                  <option value={m}>{m}</option>
                </>)}
              </select>
            </div>
            <div className="flex flex-row">
              <p className="mr-2">Equipos/Piezas</p>
              <textarea className="textarea" id=""></textarea>
            </div>
          </div>

          <div>
            <p className="border-4 border-black-800 my-4 text-center">Especificacion de trabajo</p>
            <div>
              <p className="mr-2">Categoria</p>
              <select defaultValue={'...'} className="select" id="" onChange={(e) => {

              }}>
                <option disabled={true}>...</option>
                {categorias.map((c) => <>
                  <option value={c}>{c}</option>
                </>)}
              </select>
            </div>
            <div>
              <p className="mr-2">Tipo de trabajo</p>
              <select defaultValue={'...'} className="select" id="">
                <option disabled={true}>...</option>
                {tiposTrabajos.map((t) => <>
                  <option value={t}>{t}</option>
                </>)}
              </select>
            </div>
            <div>
              <p className="mr-2">Descripcion del trabajo</p>
              <textarea className="textarea" id=""></textarea>
            </div>
          </div>
  <div className="my-2 flex items-center justify-center"><button className="btn p-4" type="submit">Send</button></div>
          
        </form>
      </div>


    </>
  )
}
