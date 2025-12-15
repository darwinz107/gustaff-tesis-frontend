import React, { useState } from 'react'
import { createProovedor } from '../controller/actaEntrada-api';

export const CrearProovedor = ({setventanaAgregarProovedor,ventanaAgregarProovedor}) => {

  const [nombre, setnombre] = useState("");
  const [nombreComercial, setnombreComercial] = useState("");
  const [ruc, setruc] = useState("");
  const [email, setemail] = useState("");
  const [telefono, settelefono] = useState("");
  const [direccion, setdireccion] = useState("");
  const [ciudad, setciudad] = useState("");
  const [notas, setnotas] = useState("");


  const registrarProovedor = async() =>{

    const res = await createProovedor({
      nombre:nombre,
      nombreComercial:nombreComercial,
      ruc:ruc,
      email:email,
      telefono:telefono,
      direccion:direccion,
      ciudad:ciudad,
      notas:notas
    });

    if(!res.ok){
    alert(res.message);
    return;
    }

    alert(res.message);

    setnombre("");
setnombreComercial("");
setruc("");
setemail("");
settelefono("");
setdireccion("");
setciudad("");
setnotas("");
    setventanaAgregarProovedor(!ventanaAgregarProovedor);
  }

  return (
    <>
    <div className="bg-base-100 p-6">
  <header className="flex items-center justify-between mb-4">
    <h3 className="text-xl font-semibold">Registrar proveedor</h3>
      <button
      type="button"
      className="btn btn-ghost btn-sm"
      onClick={() => { setventanaAgregarProovedor(!ventanaAgregarProovedor) }}
      aria-label="Cerrar"
    >
      ✕
    </button>
  </header>

  <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={(e) => { e.preventDefault(); }}>
    <div className="form-control">
      <label className="label"><span className="label-text">Razón social / Nombre</span></label>
      <input onChange={(e)=>setnombre(e.target.value)} value={nombre} name="razonSocial" placeholder="Razón social" className="input input-bordered w-full" />
    </div>

    <div className="form-control">
      <label className="label"><span className="label-text">Nombre comercial</span></label>
      <input onChange={(e)=>setnombreComercial(e.target.value)} value={nombreComercial} name="nombreComercial" placeholder="Nombre comercial" className="input input-bordered w-full" />
    </div>

    <div className="form-control">
      <label className="label"><span className="label-text">RUC</span></label>
      <input onChange={(e)=>setruc(e.target.value)} value={ruc} name="ruc" placeholder="RUC" className="input input-bordered w-full" />
    </div>

   
    <div className="form-control">
      <label className="label"><span className="label-text">Email</span></label>
      <input onChange={(e)=>setemail(e.target.value)} value={email} name="email" type="email" placeholder="correo@ejemplo.com" className="input input-bordered w-full" />
    </div>

    <div className="form-control">
      <label className="label"><span className="label-text">Teléfono</span></label>
      <input onChange={(e)=>settelefono(e.target.value)} value={telefono} name="telefono"  className="input input-bordered w-full" />
    </div>

    <div className="form-control md:col-span-2">
      <label className="label"><span className="label-text">Dirección</span></label>
      <input onChange={(e)=>setdireccion(e.target.value)} value={direccion} name="direccion" placeholder="Av. Principal #123" className="input input-bordered w-full" />
    </div>

    <div className="form-control">
      <label className="label"><span className="label-text">Ciudad</span></label>
      <input onChange={(e)=>setciudad(e.target.value)} value={ciudad} name="ciudad" placeholder="Guayaquil" className="input input-bordered w-full" />
    </div>

    <div className="form-control md:col-span-2">
      <label className="label"><span className="label-text">Notas</span></label>
      <textarea onChange={(e)=>setnotas(e.target.value)} value={notas} name="notas" placeholder="Notas internas, condiciones especiales..." className="textarea textarea-bordered w-full" rows={3} />
    </div>

   

    <div className="md:col-span-2 flex justify-end gap-2 mt-2">
      <button type="button" className="btn btn-ghost" onClick={() => {setventanaAgregarProovedor(!ventanaAgregarProovedor);setnombre("");
setnombreComercial("");
setruc("");
setemail("");
settelefono("");
setdireccion("");
setciudad("");
setnotas("");  }}>
        Cancelar
      </button>
      <button type="submit" className="btn btn-primary" onClick={registrarProovedor}>
        Guardar proveedor
      </button>
    </div>
  </form>
</div>
    </>
  )
}
