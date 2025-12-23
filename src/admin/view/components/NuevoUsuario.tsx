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
    console.log(selectCargo);
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
     if(res.validate===false){
      alert("Hubo un error al crear el usuario, por favor verifique los datos ingresados");
      return;
     }
      alert(res.msj);
      console.log(res);
      setconfirmarCambio((prev)=>!prev);
      setshowCrearUsuario(!showCrearUsuario);

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
            
              <input type="date" className="input input-sm" value={selectFechaNac} onChange={(e)=>{ setselectFechaNac(e.target.value);}} />
           
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
