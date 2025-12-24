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
  
  // Estados para errores y alertas
  const [errores, seterrores] = useState({});
  const [showError, setshowError] = useState(false);
  const [showSuccess, setshowSuccess] = useState(false);
  const [mensajeError, setmensajeError] = useState("");

  // Validaciones
  const validarNombre = (valor) => {
    if (!valor.trim()) return "La razón social es requerida";
    if (!/^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]+$/.test(valor)) return "La razón social solo puede contener letras y espacios";
    return "";
  };

  const validarNombreComercial = (valor) => {
    if (!valor.trim()) return "El nombre comercial es requerido";
    if (!/^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]+$/.test(valor)) return "El nombre comercial solo puede contener letras y espacios";
    return "";
  };

  const validarRuc = (valor) => {
    if (valor && !/^\d+$/.test(valor.toString())) return "El RUC solo puede contener números";
    return "";
  };

  const validarEmail = (valor) => {
    if (valor && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) return "El email no es válido";
    return "";
  };

  const validarTelefono = (valor) => {
    if (valor && !/^\d+$/.test(valor.toString())) return "El teléfono solo puede contener números";
    return "";
  };

  const handleNombreChange = (e) => {
    const valor = e.target.value;
    setnombre(valor);
    seterrores({...errores, nombre: validarNombre(valor)});
  };

  const handleNombreComercialChange = (e) => {
    const valor = e.target.value;
    setnombreComercial(valor);
    seterrores({...errores, nombreComercial: validarNombreComercial(valor)});
  };

  const handleRucChange = (e) => {
    const valor = e.target.value;
    setruc(valor);
    seterrores({...errores, ruc: validarRuc(valor)});
  };

  const handleEmailChange = (e) => {
    const valor = e.target.value;
    setemail(valor);
    seterrores({...errores, email: validarEmail(valor)});
  };

  const handleTelefonoChange = (e) => {
    const valor = e.target.value;
    settelefono(valor);
    seterrores({...errores, telefono: validarTelefono(valor)});
  };

  const validarFormulario = () => {
    const nuevosErrores = {
      nombre: validarNombre(nombre),
      nombreComercial: validarNombreComercial(nombreComercial),
      ruc: validarRuc(ruc),
      email: validarEmail(email),
      telefono: validarTelefono(telefono)
    };

    seterrores(nuevosErrores);

    return Object.values(nuevosErrores).every(error => error === "");
  };

  const limpiarFormulario = () => {
    setnombre("");
    setnombreComercial("");
    setruc("");
    setemail("");
    settelefono("");
    setdireccion("");
    setciudad("");
    setnotas("");
    seterrores({});
    setshowError(false);
    setshowSuccess(false);
    setmensajeError("");
  };


  const registrarProovedor = async() =>{
    if (!validarFormulario()) {
      setmensajeError("Por favor complete correctamente los campos requeridos");
      setshowError(true);
      setTimeout(() => {
        setshowError(false);
      }, 3000);
      return;
    }

    try {
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
        setmensajeError(res.message);
        setshowError(true);
        setTimeout(() => {
          setshowError(false);
        }, 3000);
        return;
      }

      setmensajeError(res.message);
      setshowSuccess(true);
      setTimeout(() => {
        setshowSuccess(false);
        limpiarFormulario();
        setventanaAgregarProovedor(!ventanaAgregarProovedor);
      }, 3000);
    } catch (error) {
      setmensajeError("Error al registrar el proveedor");
      setshowError(true);
      setTimeout(() => {
        setshowError(false);
      }, 3000);
    }
  }

  return (
    <>
    {showSuccess && (
      <div className="fixed top-5 right-5 z-50">
        <div role="alert" className="alert alert-success shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{mensajeError}</span>
        </div>
      </div>
    )}

    {showError && (
      <div className="fixed top-5 right-5 z-50">
        <div role="alert" className="alert alert-error shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{mensajeError}</span>
        </div>
      </div>
    )}

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
      <input onChange={handleNombreChange} value={nombre} name="razonSocial" placeholder="Razón social" className={`input input-bordered w-full ${errores.nombre ? 'input-error' : ''}`} />
      <div className="h-5">{errores.nombre && <p className="text-red-500 text-sm">{errores.nombre}</p>}</div>
    </div>

    <div className="form-control">
      <label className="label"><span className="label-text">Nombre comercial</span></label>
      <input onChange={handleNombreComercialChange} value={nombreComercial} name="nombreComercial" placeholder="Nombre comercial" className={`input input-bordered w-full ${errores.nombreComercial ? 'input-error' : ''}`} />
      <div className="h-5">{errores.nombreComercial && <p className="text-red-500 text-sm">{errores.nombreComercial}</p>}</div>
    </div>

    <div className="form-control">
      <label className="label"><span className="label-text">RUC</span></label>
      <input onChange={handleRucChange} value={ruc} name="ruc" placeholder="RUC" className={`input input-bordered w-full ${errores.ruc ? 'input-error' : ''}`} />
      <div className="h-5">{errores.ruc && <p className="text-red-500 text-sm">{errores.ruc}</p>}</div>
    </div>

   
    <div className="form-control">
      <label className="label"><span className="label-text">Email</span></label>
      <input onChange={handleEmailChange} value={email} name="email" type="email" placeholder="correo@ejemplo.com" className={`input input-bordered w-full ${errores.email ? 'input-error' : ''}`} />
      <div className="h-5">{errores.email && <p className="text-red-500 text-sm">{errores.email}</p>}</div>
    </div>

    <div className="form-control">
      <label className="label"><span className="label-text">Teléfono</span></label>
      <input onChange={handleTelefonoChange} value={telefono} name="telefono" className={`input input-bordered w-full ${errores.telefono ? 'input-error' : ''}`} />
      <div className="h-5">{errores.telefono && <p className="text-red-500 text-sm">{errores.telefono}</p>}</div>
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
      <button type="button" className="btn btn-ghost" onClick={() => {setventanaAgregarProovedor(!ventanaAgregarProovedor); limpiarFormulario();}}>
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
