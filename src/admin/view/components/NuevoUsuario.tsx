
import React, { useEffect, useRef, useState } from 'react'
import { crearUsuario, getAllCargos } from '../../controller/api/admin-api';

export const NuevoUsuario = ({showCrearUsuario,setshowCrearUsuario,setconfirmarCambio}) => {

  const [selectFechaNac, setselectFechaNac] = useState("");
  const [nombre, setnombre] = useState("");
  const [cedula, setcedula] = useState(0);
  const [celular, setcelular] = useState(0);
  const [email, setemail] = useState("");
  const [contrasenia, setcontrasenia] = useState("");
  const [cargos, setcargos] = useState<{ id:number,name: string}[]>([]);
  const [selectCargo, setselectCargo] = useState(0);
  const callyPpopover3 = useRef(null);

  useEffect(() => {
   const asignarCargos = async () =>{
    const traerCargos = await getAllCargos();
    console.log(traerCargos);
    setcargos(traerCargos);
   };
   asignarCargos();
  }, []);
  
  const crearNuevoUsuario = async() =>{
try {
  const res = await crearUsuario({name:nombre,fechaNacimiento:selectFechaNac,identification:cedula,cellphone:celular,email:email,password:contrasenia,cargo:selectCargo});

    alert(res.msj);
    setconfirmarCambio((prev)=>!prev);

} catch (error) {
  
}
    
  }

  return (
    <>
    
        <div className='w-full h-[12%] flex justify-between p-5 '>
          <div>Listado de ordenes</div>
          <div onClick={() =>  setshowCrearUsuario(!showCrearUsuario)} className='cursor-pointer'>❌</div>
        </div>
        <div className='w-full h-[76%] border-y border-gray-300 px-4 flex'>
          <div className='w-[33.33%] h-[100%]'>
            <div className='w-[100%] h-[33.33%]'><p>Nombre</p><input onChange={(e)=>setnombre(e.target.value)} type="text"  className='input' /></div>
            <div className='w-[100%] h-[33.33%]'><p>Cedula</p><input onChange={(e)=>setcedula(e.target.value)} type="text"  className='input' /></div>
            <div className='w-[100%] h-[33.34%]'><p>Celular</p><input onChange={(e)=>setcelular(e.target.value)} type="text"  className='input' /></div>
          </div>
          <div className='w-[33.33%] h-[100%]'>
            <div className='w-[100%] h-[33.33%]'><p>Fecha de nacimiento</p><button type="button" onClick={() => { callyPpopover3.current?.showPopover() }} className="input input-border" id="cally3" style={{ anchorName: "--cally3" }}>
                  Pick a date
                </button>
                <div popover="auto" ref={callyPpopover3} className="dropdown bg-base-100 rounded-box shadow-lg" style={{ positionAnchor: "--cally3" }}>
                  <calendar-date className="cally" onchange={(e) =>{document.getElementById("cally3").innerText = e.target.value; setselectFechaNac(e.target.value);}}>
                    <svg aria-label="Previous" className="fill-current size-4" slot="previous" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.75 19.5 8.25 12l7.5-7.5"></path></svg>
                    <svg aria-label="Next" className="fill-current size-4" slot="next" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="m8.25 4.5 7.5 7.5-7.5 7.5"></path></svg>
                    <calendar-month></calendar-month>
                  </calendar-date>
                </div></div>
            <div className='w-[100%] h-[33.33%]'><p>Email</p><input onChange={(e)=>setemail(e.target.value)} type="text"  className='input' /></div>
            <div className='w-[100%] h-[33.34%]'><p>Contraseña</p><input onChange={(e)=>setcontrasenia(e.target.value)} type="text"  className='input' /></div>
          </div>
          <div className='w-[33.34%] h-[100%]'>
            <div className='w-[100%] h-[33.33%]'>
              <p>Cargo</p>
               <select className="select" id="" defaultValue={"..."} onChange={(e)=>setselectCargo(e.target.value)}>
                <option  disabled={true} defaultChecked={true}>...</option>
              {cargos.map((a)=><>
              <option value={a.id}>{a.name}</option>
              </>)}
              </select>
        </div>
            <div className='w-[100%] h-[33.33%]'></div>
            <div className='w-[100%] h-[33.34%]'></div>
          </div>
        </div>
        <div className='w-full h-[12%] flex justify-between p-5'>

         
           
          <button className='btn' onClick={crearNuevoUsuario}>Hecho</button>
            <button className='btn' onClick={() =>  setshowCrearUsuario(!showCrearUsuario)}>Cancelar</button>
         
        </div>
    </>
  )
}
