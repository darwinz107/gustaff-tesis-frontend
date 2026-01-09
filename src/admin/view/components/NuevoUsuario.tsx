import React, { useEffect, useRef, useState } from 'react'
import { crearUsuario, getAllCargos } from '../../controller/api/admin-api';

export const NuevoUsuario = ({showCrearUsuario,setshowCrearUsuario,setconfirmarCambio,cargos}) => {

  const [selectFechaNac, setselectFechaNac] = useState("");
  const [nombre, setnombre] = useState("");
  const [cedula, setcedula] = useState("");
  const [celular, setcelular] = useState("");
  const [email, setemail] = useState("");
  const [contrasenia, setcontrasenia] = useState("");
  const [selectCargo, setselectCargo] = useState(0);

  // Estados para errores de validación
  const [errores, seterrores] = useState({});
  const [showError, setshowError] = useState(false);
  const [showSuccess, setshowSuccess] = useState(false);
  const [mensajeError, setmensajeError] = useState("");

  const callyPpopover2 = useRef(null);

  // Validaciones
  const validarNombre = (valor) => {
    if (!valor.trim()) return "El nombre es requerido";
    if (!/^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]+$/.test(valor)) return "El nombre solo puede contener letras y espacios";
    return "";
  };

  const validarCedula = (valor) => {
    if (!valor) return "La cédula es requerida";
    if (!/^\d+$/.test(valor.toString())) return "La cédula solo puede contener números";
    if (valor.toString().length < 10) return "La cédula debe tener al menos 10 dígitos";
    return "";
  };

  const validarCelular = (valor) => {
    if (!valor) return "El celular es requerido";
    if (!/^\d+$/.test(valor.toString())) return "El celular solo puede contener números";
    if (valor.toString().length < 10) return "El celular debe tener al menos 10 dígitos";
    return "";
  };

  const validarEmail = (valor) => {
    if (!valor.trim()) return "El email es requerido";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) return "El email no es válido";
    return "";
  };

  const validarContrasenia = (valor) => {
    if (!valor) return "La contraseña es requerida";
    if (valor.length < 6) return "La contraseña debe tener al menos 6 caracteres";
    return "";
  };

  const validarFecha = (valor) => {
    if (!valor) return "La fecha de nacimiento es requerida";
    return "";
  };

  const validarCargo = (valor) => {
    if (!valor || valor === 0) return "Debe seleccionar un cargo";
    return "";
  };

  const handleNombreChange = (e) => {
    const valor = e.target.value;
    setnombre(valor);
    seterrores({...errores, nombre: validarNombre(valor)});
  };

  const handleCedulaChange = (e) => {
    const valor = e.target.value;
    setcedula(valor);
    seterrores({...errores, cedula: validarCedula(valor)});
  };

  const handleCelularChange = (e) => {
    const valor = e.target.value;
    setcelular(valor);
    seterrores({...errores, celular: validarCelular(valor)});
  };

  const handleEmailChange = (e) => {
    const valor = e.target.value;
    setemail(valor);
    seterrores({...errores, email: validarEmail(valor)});
  };

  const handleContraseniaChange = (e) => {
    const valor = e.target.value;
    setcontrasenia(valor);
    seterrores({...errores, contrasenia: validarContrasenia(valor)});
  };

  const handleFechaChange = (e) => {
    const valor = e.target.value;
    setselectFechaNac(valor);
    seterrores({...errores, fecha: validarFecha(valor)});
  };

  const handleCargoChange = (e) => {
    const valor = e.target.value;
    setselectCargo(valor);
    seterrores({...errores, cargo: validarCargo(valor)});
  };

  const validarFormulario = () => {
    const nuevosErrores = {
      nombre: validarNombre(nombre),
      cedula: validarCedula(cedula),
      celular: validarCelular(celular),
      email: validarEmail(email),
      contrasenia: validarContrasenia(contrasenia),
      fecha: validarFecha(selectFechaNac),
      cargo: validarCargo(selectCargo)
    };

    seterrores(nuevosErrores);

    return Object.values(nuevosErrores).every(error => error === "");
  };

  const limpiarFormulario = () => {
    setnombre("");
    setcedula("");
    setcelular("");
    setemail("");
    setcontrasenia("");
    setselectFechaNac("");
    setselectCargo(0);
    seterrores({});
    setshowError(false);
    setshowSuccess(false);
    setmensajeError("");
  };

  const crearNuevoUsuario = async() =>{
    if (!validarFormulario()) {
      setmensajeError("Por favor complete correctamente todos los campos");
      setshowError(true);
      setTimeout(() => {
        setshowError(false);
      }, 3000);
      return;
    }

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
      setmensajeError(res.msj);
      setshowError(true);
      setTimeout(() => {
        setshowError(false);
      }, 3000);
      return;
     }
      setmensajeError(res.msj);
      setshowSuccess(true);
      setTimeout(() => {
        setshowSuccess(false);
           console.log(res);
      setconfirmarCambio((prev)=>!prev);
      setshowCrearUsuario(!showCrearUsuario);
      limpiarFormulario();
      }, 3000);
   

    } catch (error) {
      console.log(error); 
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
      
      <div className="w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-600 border-b border-blue-200 rounded-t-2xl">
        <div className="flex items-center gap-3">
          <span className="text-2xl">👤</span>
          <div>
            <h2 className="text-lg font-bold text-white">Crear Nuevo Usuario</h2>
            <p className="text-blue-100 text-xs">Completa los datos para registrar un nuevo usuario</p>
          </div>
        </div>
        <button
          onClick={() => {limpiarFormulario(); setshowCrearUsuario(!showCrearUsuario);}}
          className="btn btn-circle btn-sm btn-ghost text-white hover:bg-blue-700"
        >
          ✕
        </button>
      </div>

      
      <div className="w-full flex-1 px-8 py-6 grid grid-cols-1 lg:grid-cols-3 gap-8 overflow-y-auto bg-gradient-to-b from-white to-blue-50">

        
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">👤 Nombre</label>
            <input 
              className={`input input-sm input-bordered w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-400 ${errores.nombre ? 'input-error' : ''}`} 
              onChange={handleNombreChange}
              value={nombre}
            />
            <div className="h-5">{errores.nombre && <p className="text-red-500 text-xs mt-1">{errores.nombre}</p>}</div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">📌 Cédula</label>
            <input 
              className={`input input-sm input-bordered w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-400 ${errores.cedula ? 'input-error' : ''}`} 
              onChange={handleCedulaChange}
              value={cedula}
              type="text"
            />
            <div className="h-5">{errores.cedula && <p className="text-red-500 text-xs mt-1">{errores.cedula}</p>}</div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">📱 Celular</label>
            <input 
              className={`input input-sm input-bordered w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-400 ${errores.celular ? 'input-error' : ''}`} 
              onChange={handleCelularChange}
              value={celular}
              type="text"
            />
            <div className="h-5">{errores.celular && <p className="text-red-500 text-xs mt-1">{errores.celular}</p>}</div>
          </div>
        </div>

        
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">🗓️ Fecha de nacimiento</label>
            <input 
              type="date" 
              className={`input input-sm input-bordered w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-400 ${errores.fecha ? 'input-error' : ''}`} 
              value={selectFechaNac} 
              onChange={handleFechaChange}
            />
            <div className="h-5">{errores.fecha && <p className="text-red-500 text-xs mt-1">{errores.fecha}</p>}</div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">✉️ Email</label>
            <input 
              className={`input input-sm input-bordered w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-400 ${errores.email ? 'input-error' : ''}`} 
              onChange={handleEmailChange}
              value={email}
              type="email"
            />
            <div className="h-5">{errores.email && <p className="text-red-500 text-xs mt-1">{errores.email}</p>}</div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">🔐 Contraseña</label>
            <input 
              className={`input input-sm input-bordered w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-400 ${errores.contrasenia ? 'input-error' : ''}`} 
              type="password" 
              onChange={handleContraseniaChange}
              value={contrasenia}
            />
            <div className="h-5">{errores.contrasenia && <p className="text-red-500 text-xs mt-1">{errores.contrasenia}</p>}</div>
          </div>
        </div>

        
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">🏷️ Cargo</label>
            <select 
              className={`select select-sm select-bordered w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-400 ${errores.cargo ? 'select-error' : ''}`} 
              defaultValue={0} 
              onChange={handleCargoChange}
            >
              <option value={0} disabled>Selecciona un cargo...</option>
              {cargos.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
            <div className="h-5">{errores.cargo && <p className="text-red-500 text-xs mt-1">{errores.cargo}</p>}</div>
          </div>
        </div>
      </div>

      
      <div className="w-full px-8 py-4 flex justify-end gap-3 border-t border-blue-200 bg-gradient-to-r from-blue-50 to-transparent">
        <button className="btn btn-ghost gap-2" onClick={() => {limpiarFormulario(); setshowCrearUsuario(!showCrearUsuario);}}>
          ❌ Cancelar
        </button>
        <button className="btn bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-0 hover:from-blue-600 hover:to-cyan-700 gap-2" onClick={crearNuevoUsuario}>
          ✓ Crear Usuario
        </button>
      </div>
    </>
  )
}
