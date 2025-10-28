import { useRef, useState } from "react";
import { CalendarDate, CalendarMonth } from "cally";
import "cally";

export const CrearOrden = () => {

  const areas = ["TUNELES DE ENFRIAMINETO", "REFINACION DE CHOCOLATE", "PULVERIZACION", "TALLER2"];
  const codigos = ["GU-BTT-01", "GU-BTT-02", "GU-BTT-03", "GU-BTT-04"];
  const maquinas = ["DESKTOP-01", "DESKTOP-02", "DESKTOP-03", "DESKTOP-04"];
  const categorias = ["VARIOS", "GASFITERIA", "MECANICA", "SOLDADURA"];
  const tiposTrabajos = ["MODIFICACION", "HABILITACION", "VARIOS", "ADECUACION"];

  const [ubicacion, setubicacion] = useState(Array(3));
  const [especificacion, setespecificacion] = useState(Array(2));
  const callyPpopover1 = useRef(null);
  const callyPpopover2 = useRef(null);
  const callyPpopover3 = useRef(null);


  return (
    <>
      <div className='flex items-center justify-center mt-8'>
        <form className='min-w-170 border border-black-700' action="" onSubmit={(e) => { e.preventDefault(); console.log(ubicacion) }}>
          <div className=' mb-4'>
            <p className='border-4 border-black-800'>Tiempos de trabajo</p>
            <div>
              <div className='flex flex-row mb-3 my-4'>
                <p>Fecha y hora planificada</p> <button onClick={() => { callyPpopover1.current?.showPopover() }} className="input input-border" id="cally1" style={{ anchorName: "--cally1" }}>
                  Pick a date
                </button>
                <div popover="auto" ref={callyPpopover1} className="dropdown bg-base-100 rounded-box shadow-lg" style={{ positionAnchor: "--cally1" }}>
                  <calendar-date className="cally" onchange={(e) => document.getElementById("cally1").innerText = e.target.value}>
                    <svg aria-label="Previous" className="fill-current size-4" slot="previous" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.75 19.5 8.25 12l7.5-7.5"></path></svg>
                    <svg aria-label="Next" className="fill-current size-4" slot="next" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="m8.25 4.5 7.5 7.5-7.5 7.5"></path></svg>
                    <calendar-month></calendar-month>
                  </calendar-date>
                </div>
                <input type="time" className="input" />
                <p>Tiempo estimado</p> <button onClick={() => { callyPpopover2.current?.showPopover() }} className="input input-border" id="cally2" style={{ anchorName: "--cally2" }}>
                  Pick a date
                </button>
                <div popover="auto" ref={callyPpopover2} className="dropdown bg-base-100 rounded-box shadow-lg" style={{ positionAnchor: "--cally2" }}>
                  <calendar-date className="cally" onchange={(e) => document.getElementById("cally2").innerText = e.target.value}>
                    <svg aria-label="Previous" className="fill-current size-4" slot="previous" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.75 19.5 8.25 12l7.5-7.5"></path></svg>
                    <svg aria-label="Next" className="fill-current size-4" slot="next" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="m8.25 4.5 7.5 7.5-7.5 7.5"></path></svg>
                    <calendar-month></calendar-month>
                  </calendar-date>
                </div>
              </div>
              <div className='flex flex-row'><p>Fecha estimada de finalizacion</p> <button onClick={() => { callyPpopover3.current?.showPopover() }} className="input input-border" id="cally3" style={{ anchorName: "--cally3" }}>
                  Pick a date
                </button>
                <div popover="auto" ref={callyPpopover3} className="dropdown bg-base-100 rounded-box shadow-lg" style={{ positionAnchor: "--cally3" }}>
                  <calendar-date className="cally" onchange={(e) => document.getElementById("cally3").innerText = e.target.value}>
                    <svg aria-label="Previous" className="fill-current size-4" slot="previous" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.75 19.5 8.25 12l7.5-7.5"></path></svg>
                    <svg aria-label="Next" className="fill-current size-4" slot="next" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="m8.25 4.5 7.5 7.5-7.5 7.5"></path></svg>
                    <calendar-month></calendar-month>
                  </calendar-date>
                </div></div>
            </div>
          </div>

          <div >
            <p className='border-4 border-black-800 mb-4'>Ubicacion</p>
            <div className="flex flex-row mb-4">
              <p>Area</p>
              <select name="" id="" onChange={(e) => {
                const nueva = [...ubicacion];
                nueva[0] = e.target.value;
                setubicacion(nueva);
              }}>
                <option value="">...</option>
                {areas.map((a) =>
                  <>
                    <option value={a}>{a}</option>
                  </>
                )}
              </select>

              <p>Codigo</p>
              <select name="" id="" onChange={(e) => {
                const nueva = [...ubicacion];
                nueva[1] = e.target.value;
                setubicacion(nueva)
              }}>
                <option value="">...</option>
                {codigos.map((c) => <>
                  <option value={c}>{c}</option>
                </>)}
              </select>

              <p>Maquina</p>
              <select name="" id="" onChange={(e) => {
                const nueva = [...ubicacion];
                nueva[2] = e.target.value;
                setubicacion(nueva)
              }}>
                <option value="">...</option>
                {maquinas.map((m) => <>
                  <option value={m}>{m}</option>
                </>)}
              </select>
            </div>
            <div className="flex flex-row">
              <p>Equipos/Piezas</p>
              <textarea name="" id=""></textarea>
            </div>
          </div>

          <div>
            <p className="border-4 border-black-800 mb-4">Especificacion de trabajo</p>
            <div>
              <p>Categoria</p>
              <select name="" id="" onChange={(e) => {

              }}>
                <option value="">...</option>
                {categorias.map((c) => <>
                  <option value={c}>{c}</option>
                </>)}
              </select>
            </div>
            <div>
              <p>Tipo de trabajo</p>
              <select name="" id="">
                <option value="">...</option>
                {tiposTrabajos.map((t) => <>
                  <option value={t}>{t}</option>
                </>)}
              </select>
            </div>
            <div>
              <p>Descripcion del trabajo</p>
              <textarea name="" id=""></textarea>
            </div>
          </div>

          <button className="p-4 bg-blue-500 cursor-pointer" type="submit">Send</button>
        </form>
      </div>


    </>
  )
}
