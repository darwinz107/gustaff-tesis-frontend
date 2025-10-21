import { useState } from "react";


export const CrearOrden = () => {

 const areas = ["TUNELES DE ENFRIAMINETO","REFINACION DE CHOCOLATE","PULVERIZACION","TALLER2"];
 const codigos = ["GU-BTT-01","GU-BTT-02","GU-BTT-03","GU-BTT-04"];
 const maquinas = ["DESKTOP-01","DESKTOP-02","DESKTOP-03","DESKTOP-04"];
 const categorias = ["VARIOS","GASFITERIA","MECANICA","SOLDADURA"];
 const tiposTrabajos = ["MODIFICACION","HABILITACION","VARIOS","ADECUACION"];

 const [ubicacion, setubicacion] = useState(Array(3));
 const [especificacion, setespecificacion] = useState(Array(2))


  return (
    <>
    <div className='flex items-center justify-center mt-8'>
   <form className='min-w-170 border border-black-700' action="" onSubmit={(e)=>{e.preventDefault(); console.log(ubicacion)}}>
     <div className=' mb-4'>
        <p className='border-4 border-black-800'>Tiempos de trabajo</p>
        <div>
            <div className='flex flex-row mb-3 my-4'>
                <p>Fecha y hora planificada</p> <input type="text" className='border border-black-800 mr-2'/> <input type="text" name="" id="" />
                <p>Tiempo estimado</p> <input type="text" />
            </div>
            <div className='flex flex-row'><p>Fecha estimada de finalizacion</p> <input type="text" name="" id="" /></div>
        </div>
     </div>

      <div >
        <p className='border-4 border-black-800 mb-4'>Ubicacion</p>
          <div className="flex flex-row mb-4">
            <p>Area</p> 
            <select name="" id="" onChange={(e)=>{
              const nueva = [...ubicacion];
              nueva[0] = e.target.value;
              setubicacion(nueva);}}>
              <option value="">...</option>
              {areas.map((a)=>
              <>
              <option value={a}>{a}</option>
              </>
              )}
            </select>

            <p>Codigo</p>
            <select name="" id=""  onChange={(e)=>{
              const nueva = [...ubicacion];
              nueva[1]=e.target.value;
              setubicacion(nueva)}}>
              <option value="">...</option>
              {codigos.map((c)=><>
              <option value={c}>{c}</option>
              </>)}
            </select>

            <p>Maquina</p>
            <select name="" id="" onChange={(e)=>{
               const nueva = [...ubicacion];
               nueva[2]=e.target.value;
              setubicacion(nueva)}}>
              <option value="">...</option>
              {maquinas.map((m)=><>
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
          <select name="" id="" onChange={(e)=>{

          }}>
            <option value="">...</option>
            {categorias.map((c)=><>
            <option value={c}>{c}</option>
            </>)}
          </select>
        </div>
        <div>
          <p>Tipo de trabajo</p>
          <select name="" id="">
            <option value="">...</option>
            {tiposTrabajos.map((t)=><>
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
