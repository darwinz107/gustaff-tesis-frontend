import React, { useEffect, useRef, useState } from 'react'
import { crearUsuario, getAllCargos } from '../../controller/api/admin-api';

export const NuevoUsuario = ({showCrearUsuario,setshowCrearUsuario,setconfirmarCambio,cargos}) => {

  const [selectFechaNac, setselectFechaNac] = useState("");
  const [nombre, setnombre] = useState("");
  const [cedula, setcedula] = useState(0);
  const [celular, setcelular] = useState(0);
  const [email, setemail] = useState("");
  const [contrasenia, setcontrasenia] = useState("");
  const [selectCargo, setselectCargo] = useState(0);

  const callyPpopover2 = useRef(null);

  const crearNuevoUsuario = async() =>{
    try {
      const res = await crearUsuario({
        name:nombre,
        fechaNac:selectFechaNac,
        identification:cedula,
        cellphone:celular,
        email:email,
        password:contrasenia,
        cargo:selectCargo
      });

      alert(res.msj);
      setconfirmarCambio((prev)=>!prev);

    } catch (error) {
      console.log(error); 
    }
  }

  return (
    <>
      
      <div className="w-full h-[12%] flex items-center justify-between px-6 border-b">
        <h2 className="text-lg font-semibold">Crear usuario</h2>
        <button
          onClick={() => setshowCrearUsuario(!showCrearUsuario)}
          className="btn text-lg hover:text-red-500 transition"
        >
          ❌
        </button>
      </div>

      
      <div className="w-full h-[76%] px-6 py-4 grid grid-cols-3 gap-6 overflow-y-auto">

        
        <div className="space-y-4">
          <div>
            <label className="label">Nombre</label>
            <input className="input w-full" onChange={(e)=>setnombre(e.target.value)} />
          </div>

          <div>
            <label className="label">Cédula</label>
            <input className="input w-full" onChange={(e)=>setcedula(e.target.value)} />
          </div>

          <div>
            <label className="label">Celular</label>
            <input className="input w-full" onChange={(e)=>setcelular(e.target.value)} />
          </div>
        </div>

        
        <div className="space-y-4">
          <div>
            <label className="label">Fecha de nacimiento</label>
            <button
              type="button"
              onClick={() => callyPpopover2.current?.showPopover()}
              className="input w-full text-left"
              id="cally2"
              style={{ anchorName: "--cally2" }}
            >
              {selectFechaNac || "Seleccionar fecha"}
            </button>

            <div
              popover="auto"
              ref={callyPpopover2}
              className="dropdown bg-base-100 rounded-box shadow-lg"
              style={{ positionAnchor: "--cally2" }}
            >
              <calendar-date
                className="cally"
                onchange={(e) => {
                  document.getElementById("cally2").innerText = e.target.value;
                  setselectFechaNac(e.target.value);
                }}
              >
                <svg slot="previous" className="fill-current size-4" viewBox="0 0 24 24">
                  <path d="M15.75 19.5 8.25 12l7.5-7.5"></path>
                </svg>
                <svg slot="next" className="fill-current size-4" viewBox="0 0 24 24">
                  <path d="m8.25 4.5 7.5 7.5-7.5 7.5"></path>
                </svg>
                <calendar-month></calendar-month>
              </calendar-date>
            </div>
          </div>

          <div>
            <label className="label">Email</label>
            <input className="input w-full" onChange={(e)=>setemail(e.target.value)} />
          </div>

          <div>
            <label className="label">Contraseña</label>
            <input className="input w-full" type="password" onChange={(e)=>setcontrasenia(e.target.value)} />
          </div>
        </div>

        
        <div className="space-y-4">
          <div>
            <label className="label">Cargo</label>
            <select className="select w-full" defaultValue={"..."} onChange={(e)=>setselectCargo(e.target.value)}>
              <option disabled>...</option>
              {cargos.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      
      <div className="w-full h-[12%] px-6 flex justify-end gap-3 border-t">
        <button className="btn btn-outline" onClick={() => setshowCrearUsuario(!showCrearUsuario)}>
          Cancelar
        </button>
        <button className="btn btn-primary" onClick={crearNuevoUsuario}>
          Crear usuario
        </button>
      </div>
    </>
  )
}
