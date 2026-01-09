import React, { useEffect, useRef, useState } from "react";
import { BuscarOrdenCompra } from "../../acta-de-salida/view/BuscarOrdenCompra";
import type { InfoPdfCompra } from "../../orden-de-compra/models/infoPdfCompra";
import { getAllSolicitudesParciales, ordenCompraById } from "../../orden-de-compra/controller/ordenCompraApi";
import type { BuscarSolMaterial } from "../../orden-de-compra/models/buscarSolMaterial";
import { asignarInfoActaEntrada, existeItem, filtrarInventario } from "../../inventario/controller/inventario-api";
import type { AsignarInfoEntrada } from "../../inventario/models/AsignarInfoEntrada";
import { createActaEntrada, findProovedorByNombre, getPerchasBySeccion, getSeccionesByBodega } from "../controller/actaEntrada-api";
import { CrearProovedor } from "./CrearProovedor";
import { getAllBodegas } from "../../admin/controller/api/admin-api";
import { ConvertToBase64 } from "../controller/ConvertToBase64";
import { Base64ToBlob } from "../controller/Base64ToBlob";
import type { Users } from "../../admin/models/users";
import { getUsers } from "../../user/controller/api/user-api";



export const CrearActaEntrada = () => {

    const [ventanaBuscarSolicitudMaterial, setventanaBuscarSolicitudMaterial] = useState(false);
    const [solicitudMaterial, setsolicitudMaterial] = useState<AsignarInfoEntrada>({itemsSolicitados:[]});
    const [solCompraId, setsolCompraId] = useState<number>(0);
    const [total, settotal] = useState<number>(0.00);
    const [proovedores, setproovedores] = useState<{id:number,nombreComercial:string}[]>([]);
    const [proovedor, setproovedor] = useState("");
    const [factura, setfactura] = useState("");
    const [item, setitem] = useState(null);
    const [cantidad, setcantidad] = useState(null);
    const [stockMin, setstockMin] = useState(null);
    const [precioUni, setprecioUni] = useState(0);
    const [descuento, setdescuento] = useState(null);
    const [iva, setiva] = useState(false);
    const [bodega, setbodega] = useState("...");
    const [seccion, setseccion] = useState("...");
    const [percha, setpercha] = useState("...");
    const [bodegas, setbodegas] = useState<{id:number,bodega:string}[]>([]);
    const [secciones, setsecciones] = useState<{id:number,seccion:string}[]>([]);
    const [perchas, setperchas] = useState<{id:number,percha:string}[]>([]);
    const [observacion, setobservacion] = useState("");
    const [ventanaAgregarProovedor, setventanaAgregarProovedor] = useState(false);
    const [items, setitems] = useState<{nombre:string,costo:number}[]>([]);
    const [ordenes, setordenes] = useState<BuscarSolMaterial[]>([]);
    const [habilitarStockMin, sethabilitarStockMin] = useState(false);
    const [erroresProovedor, seterroresProovedor] = useState("");
    const [erroresItems, seterroresItems] = useState({factura: "", item: "", cantidad: "", precioUni: "", descuento: "", stockMin: "", bodega: "", seccion: "", percha: ""});
    const [showSuccess, setshowSuccess] = useState(false);
    const [showError, setshowError] = useState(false);
    const [mensajeError, setmensajeError] = useState("");
    const [imagen, setimagen] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [recibe, setrecibe] = useState(0);
    const [users, setusers] = useState<Users[]>([]);


const cargarInfoSolMaterial = async() =>{
        const res = await asignarInfoActaEntrada(solCompraId);
       
        
        setsolicitudMaterial(res);
        
       setsolicitudMaterial(prev => ({
  ...prev,
  itemsSolicitados: prev.itemsSolicitados.map(item => ({
    ...item,
    subtotal: item.cantidad * (item.costo ?? 0),
    total: (item.cantidad * (item.costo ?? 0)),
    esActualizado: false
  }))
}));

    }

 const asignarCampos = async(index:number, itemData: any) => {
 console.log("itemData en asignarCampos:", itemData.costo);
  // Validar que no haya campos ingresados
  if (item !== "" ||  observacion !== "" || imagen !== null || bodega !== "..." || seccion !== "..." || percha !== "...") {
    setmensajeError("No es posible editar mientras hay campos ingresados. Por favor, limpie los campos primero.");
    setshowError(true);
    setTimeout(() => setshowError(false), 3000);
    return;
  }

  const validar = await existeItem(itemData.nombre);
  sethabilitarStockMin(validar);

  console.log("index que llega", index);
  console.log("antes:", solicitudMaterial.itemsSolicitados);

  // Precarga todos los campos del item
  setitem(itemData.nombre);
  setprecioUni(itemData.costo);
  setcantidad(itemData.cantidad);
  setdescuento(itemData.descuento);
  setstockMin(itemData.stockMin);
  setiva(itemData.iva);
  setobservacion(itemData.Observacion || "");

  const imgBlob = itemData.imagen ? Base64ToBlob(itemData.imagen) : null; 
  console.log("imgBlob", imgBlob);  
  setimagen(imgBlob); 

  
  // Precarga los selectores si no es un item de stock mínimo
  if (!validar && itemData.bodegaId) {
    setbodega(itemData.bodegaId.toString());
    setseccion(itemData.seccionId ? itemData.seccionId.toString() : "...");
    setpercha(itemData.perchaId ? itemData.perchaId.toString() : "...");
  }

  setsolicitudMaterial(prev => {
    const nuevo = prev.itemsSolicitados.filter((_, idx) => idx !== index);
    console.log("después:", nuevo);
    return { ...prev, itemsSolicitados: nuevo };
  });
};

     const getAllUsers = async () => {
               const res = await getUsers();
               console.log(res);
               setusers(res);
             } ;
          

    useEffect(() => {
       getAllUsers(); 
    }, []);
    

    useEffect(() => {

       if (!solicitudMaterial?.itemsSolicitados?.length) {
    settotal(0);
    return;
  }
      
      const asignarTotal = ()=>{
        const suma = solicitudMaterial?.itemsSolicitados?.reduce((acumulador,item)=>{return acumulador + item.total},0);
        settotal(suma);
      }

      asignarTotal();
      
    }, [solicitudMaterial])
    

   const metodoSolicitudesMaterialesEntradas = async() =>{
      
      const res = await getAllSolicitudesParciales();
      console.log(res);
      setordenes(res);
     }

     useEffect(() => {
      if(ventanaBuscarSolicitudMaterial){
        metodoSolicitudesMaterialesEntradas();
      }
      
     }, [ventanaBuscarSolicitudMaterial]);
     
     useEffect(() => {
      console.log("solCompraId",solCompraId);
      if (!solCompraId) return;
      console.log("entro solCompraId")
      cargarInfoSolMaterial();
     }, [solCompraId])
     
     
  const agregarItemsActualizado = async () => {
  const errorItem = validarItem(item);
  const errorCantidad = validarCantidad(cantidad);
  const errorPrecio = validarPrecio(precioUni);
  const errorDescuento = validarDescuento(descuento);
  const errorStockMin = validarStockMin(stockMin, habilitarStockMin);
  const errorBodega = validarBodega(habilitarStockMin ?"" :bodega);
  const errorSeccion = validarSeccion(habilitarStockMin ?"" :seccion);
  const errorPercha = validarPercha(habilitarStockMin ?"" :percha);

  seterroresItems({
    factura: "",
    item: errorItem,
    cantidad: errorCantidad,
    precioUni: errorPrecio,
    descuento: errorDescuento,
    stockMin: errorStockMin,
    bodega: errorBodega,
    seccion: errorSeccion,
    percha: errorPercha
  });

  if (errorItem || errorCantidad || errorPrecio || errorDescuento || errorStockMin || errorBodega || errorSeccion || errorPercha) {
    console.log("Errores en la validación de ítems:", {
      item: errorItem,
      cantidad: errorCantidad,
      precioUni: errorPrecio,
      descuento: errorDescuento,
      stockMin: errorStockMin,
      bodega: errorBodega,
      seccion: errorSeccion,
      percha: errorPercha
    });
    return;
  }

  const c = Number(cantidad ?? 0);
  const pu = Number(precioUni ?? 0);
  const d = Number(descuento ?? 0);
  const ivaFinal = iva ? 0.15 : 0;

  const subtotal1 = c * pu;
  const descuento1 = subtotal1 * (d / 100);
  const iva1 = (subtotal1 - descuento1) * ivaFinal;
  const calcTotal = subtotal1 - descuento1 + iva1;

  let newItem: any = {};

  // Convertir imagen a base64 si existe
  let imagenBase64 = null;
  if (imagen && imagen !== null) {
    imagenBase64 = await ConvertToBase64(imagen);
    console.log(imagenBase64);
  }

  if(habilitarStockMin){
 newItem = {
    nombre: item ?? "",
    cantidad: c,
   
    costo: pu,
    descuento: d,
    iva: iva,
    subtotal: parseFloat(subtotal1.toString()),
    total: parseFloat(calcTotal.toString()),
    
    Observacion: observacion ?? "",
    esActualizado: true,
    ...(imagenBase64 && { imagen: imagenBase64 })
  };
  }else{
newItem = {
    nombre: item ?? "",
    cantidad: c,
    stockMin: Number(stockMin ?? 0),
    costo: pu,
    descuento: d,
    iva: iva,
    subtotal: parseFloat(subtotal1.toString()),
    total: parseFloat(calcTotal.toString()),
    bodegaId: Number(bodega),
    seccionId: Number(seccion),
    perchaId: Number(percha),
    Observacion: observacion ?? "",
    esActualizado: true,
    ...(imagenBase64 && { imagen: imagenBase64 })
  };
  }
 

 /* newItem = {
    nombre: item ?? "",
    cantidad: c,
    stockMin: Number(stockMin ?? 0),
    costo: pu,
    descuento: d,
    iva: iva,
    subtotal: parseFloat(subtotal1.toString()),
    total: parseFloat(calcTotal.toString()),
    bodegaId: Number(bodega),
    seccionId: Number(seccion),
    perchaId: Number(percha),
    Observacion: observacion ?? ""
  };*/

   

  setsolicitudMaterial(prev => ({
    ...prev,
    itemsSolicitados: [
      ...(prev.itemsSolicitados),
      newItem
    ]
  }));

  setitem("");
  setcantidad(null);
  setstockMin(null);
  setprecioUni(0);
  setdescuento(0);
  setiva(false);
  setobservacion("");
  setbodega("...");
  setseccion("...");
  setpercha("...");
  setimagen(null);
   if (fileInputRef.current) {
    fileInputRef.current.value = "";
  }
  
  seterroresItems({factura: "", item: "", cantidad: "", precioUni: "", descuento: "", stockMin: "", bodega: "", seccion: "", percha: ""});
};

const validarProovedor = (valor: string): string => {
  if (!valor || valor.trim() === "") {
    return "El campo no puede estar vacío";
  }
  if (!/^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]+$/.test(valor)) {
    return "El proveedor solo puede contener letras";
  }
  const existe = proovedores.some(p => p.nombreComercial.toLowerCase() === valor.toLowerCase());
  if (!existe) {
    return "Debe digitar un proveedor existente";
  }
  return "";
};

const validarFactura = (valor: string): string => {
  if (!valor || valor.trim() === "") {
    return "El campo no puede estar vacío";
  }
  return "";
};

const validarItem = (valor: string | null): string => {
  if (!valor || (typeof valor === 'string' && valor.trim() === "")) {
    return "Debe seleccionar un item";
  }
 /* if (typeof valor === 'string' && !/^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]+$/.test(valor)) {
    return "El item solo puede contener letras";
  }*/
  return "";
};

const validarCantidad = (valor: number | null): string => {
  if (!valor || valor === 0 || valor === null) {
    return "La cantidad no puede estar vacía";
  }
  const num = Number(valor);
  if (isNaN(num)) {
    return "Debe ser un número válido";
  }
  if (num < 0) {
    return "La cantidad no puede ser negativa";
  }
  return "";
};

const validarPrecio = (valor: number | null): string => {
  if (!valor || valor === null) {
    return "El precio no puede estar vacío";
  }
  const num = Number(valor);
  if (isNaN(num)) {
    return "Debe ser un número válido";
  }
  if (num < 0) {
    return "El precio no puede ser negativo";
  }
  return "";
};

const validarDescuento = (valor: number | null): string => {
  if (valor === null || valor === undefined) {
    return "El descuento no puede estar vacío";
  }
  const num = Number(valor);
  if (isNaN(num)) {
    return "Debe ser un número válido";
  }
  if (num < 0) {
    return "El descuento no puede ser negativo";
  }
  return "";
};

const validarStockMin = (valor: number | null, habilitado: boolean): string => {
  if (habilitado) {
    return "";
  }
  if (!valor || valor === null) {
    return "El stock mínimo no puede estar vacío";
  }
  const num = Number(valor);
  if (isNaN(num)) {
    return "Debe ser un número válido";
  }
  if (num < 0) {
    return "El stock mínimo no puede ser negativo";
  }
  return "";
};

const validarBodega = (valor: string): string => {
  if(habilitarStockMin === true) return "";
  if (!valor || valor === "...") {
    return "Debe seleccionar una bodega";
  }
  return "";
};

const validarSeccion = (valor: string): string => {
  if(habilitarStockMin === true) return "";
  if (!valor || valor === "...") {
    return "Debe seleccionar una sección";
  }
  return "";
};

const validarPercha = (valor: string): string => {
  if(habilitarStockMin === true) return "";
  if (!valor || valor === "...") {
    return "Debe seleccionar una percha";
  }
  return "";
};

 const enviarygenerarActaDeEntrada = async() =>{
 const errorProovedor = validarProovedor(proovedor);
 const errorFactura = validarFactura(factura);
 
 seterroresProovedor(errorProovedor);
 seterroresItems({...erroresItems, factura: errorFactura});

 if (errorProovedor || errorFactura) {
   setmensajeError("Debe llenar correctamente los campos obligatorios");
   setshowError(true);
   setTimeout(() => setshowError(false), 3000);
   return;
 }

/* if (errorFactura) {
   setmensajeError(errorFactura);
   setshowError(true);
   setTimeout(() => setshowError(false), 3000);
   return;
 }*/

 if (solicitudMaterial.itemsSolicitados.length === 0) {
   setmensajeError("Debe agregar al menos un item a la orden de entrada");
   setshowError(true);
   setTimeout(() => setshowError(false), 3000);
   return;
 }

   const registroEntradaFinal = {
    proovedor:proovedor,
    factura: factura,
    total:total,
    recibe:recibe,
    itemsSolicitados:solicitudMaterial.itemsSolicitados,
    
   }
  console.log("registroEntradaFinal");
  console.log(registroEntradaFinal);
   const res = await createActaEntrada(solCompraId,registroEntradaFinal);

   if(res.validate){
   setshowSuccess(true);
   setTimeout(() => {
     setshowSuccess(false);
     setsolicitudMaterial({numOrden:"",numOrdenTrabajo:"",itemsSolicitados:[],id:0});
     setproovedor("");
     setfactura("");
     window.open(`/pdf-entrada/${undefined}`,"_blank");
   }, 1000);
   }else{
    setmensajeError(res.msj || "Error al crear el acta de entrada");
    setshowError(true);
    setTimeout(() => setshowError(false), 3000);
   }
  

 }

useEffect(() => {
  if(proovedor != ""){
      const metodoExecProovedores = async()=>{
    const res = await findProovedorByNombre(proovedor);
    setproovedores(res);
    console.log(res);
  }
metodoExecProovedores();
  }else{
    setproovedores([]);
  }

}, [proovedor]);

useEffect(() => {
  if(item != ""){
      const metodoExecProovedores = async()=>{
    const res = await filtrarInventario(item);
    setitems(res);
    const existe = res.some(
        (r) => r.nombre.toLowerCase() === item.toLowerCase()
      );

      sethabilitarStockMin(existe);
  if(existe){
    const seleccionado = res.find(p => p.nombre === item);
    if (seleccionado) {
      setprecioUni(seleccionado.costo);
    }
  }else{
      setprecioUni(null);
    }
    console.log(res);
  }
metodoExecProovedores();
  }else{
    setitems([]);
  }

}, [item]);


useEffect(() => {
  try {
    const asignarBodegas = async()=>{
   const res = await getAllBodegas();
   setbodegas(res);
 }
 asignarBodegas();
  } catch (error) {
    console.error(error);
  }
 
}, []);

const selSecc = useRef<HTMLSelectElement|null>(null);

useEffect(() => {
  try {
    if(bodega !== ""){
      const asignarSecciones = async()=>{
   const res = await getSeccionesByBodega(bodega);
   setsecciones(res);
   setperchas([]);
   if (selSecc.current) {
  selSecc.current.value = "...";
}
 }
 asignarSecciones();
    }else{
      setsecciones([]);
    }
    
  } catch (error) {
    console.error(error);
  }
 
}, [bodega]);

useEffect(() => {
  try {
    if(seccion !== ""){
      const asignarPerchas = async()=>{
        console.log(seccion);
   const res = await getPerchasBySeccion(seccion);
   console.log(res);
   setperchas(res);
 }
 asignarPerchas();
    }else{
      setperchas([]);
    }
    
  } catch (error) {
    console.error(error);
  }
 
}, [seccion]);

const limpiarCampos = () => {
  setitem("");
  setcantidad(null);
  setstockMin(null);
  setprecioUni(0);
  setdescuento(0);
  setiva(false);
  setobservacion("");
  setbodega("...");
  setseccion("...");
  setpercha("...");
  setimagen(null);
  if (fileInputRef.current) {
    fileInputRef.current.value = "";
  }
  
  seterroresItems({factura: "", item: "", cantidad: "", precioUni: "", descuento: "", stockMin: "", bodega: "", seccion: "", percha: ""});
};

const eliminarItem = (index: number) => {
  setsolicitudMaterial(prev => {
    const nuevo = prev.itemsSolicitados.filter((_, idx) => idx !== index);
    return { ...prev, itemsSolicitados: nuevo };
  });
};

 return (
  <>
    {showSuccess && (
      <div className="fixed top-5 right-5 z-50">
        <div role="alert" className="alert alert-success shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Acta de entrada registrada exitosamente!</span>
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

    <div className="w-full h-full p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-t-2xl p-6 shadow-lg border-t-4 border-blue-400">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📦</span>
            <div>
              <h1 className="text-2xl font-bold text-white">Crear Acta de Entrada</h1>
              <p className="text-blue-100 text-sm">Registro de ingreso de materiales al inventario</p>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white border-0 gap-2"
            onClick={() => { setventanaBuscarSolicitudMaterial(!ventanaBuscarSolicitudMaterial); }}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/></svg>
            Asignar Solicitud
          </button>
        </div>
      </div>

      
      <div className="w-full bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-700 mb-4 pb-3 border-b border-blue-200">📄 Destino / Documento</h2>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="flex gap-2 items-start max-w-[220px]">
            <div className="w-full">
              <label className="block text-sm text-gray-600 mb-1">Proveedor</label>
              <div className="relative">
                <input
                  className={`input input-bordered w-full ${erroresProovedor ? 'input-error' : ''}`}
                  list="browsers"
                  value={proovedor}
                  onChange={(e) => {
                    setproovedor(e.target.value);
                    seterroresProovedor(validarProovedor(e.target.value));
                  }}
                  placeholder="Buscar proveedor..."
                />
                <datalist id="browsers">
                  {proovedores?.map((p) =>
                    <option key={p.id} value={p.nombreComercial} />
                  )}
                </datalist>
              </div>
              <div className="h-5">{erroresProovedor && <p className="text-red-500 text-xs">{erroresProovedor}</p>}</div>
            </div>

            <button
              type="button"
              className="btn btn-ghost btn-square place-self-center"
              onClick={() => setventanaAgregarProovedor(!ventanaAgregarProovedor)}
              title="Agregar proveedor"
            >
              <img className="w-5 h-5" src="https://img.icons8.com/ios-glyphs/30/add-user-male.png" alt="add" />
            </button>
          </div>

          <div className="min-w-[180px] flex-1 mx-1">
            <label className="block text-sm text-gray-600 mb-1">S/Factura</label>
            <input className={`input input-bordered w-full ${erroresItems.factura ? 'input-error' : ''}`} value={factura} onChange={(e) => {setfactura(e.target.value); seterroresItems({...erroresItems, factura: validarFactura(e.target.value)});}} />
            <div className="h-5">{erroresItems.factura && <p className="text-red-500 text-xs">{erroresItems.factura}</p>}</div>
          </div>

          <div className="min-w-[180px] flex-1">
            <label className="block text-sm text-gray-600 mb-1">N. Orden</label>
            <input className="input input-bordered w-full bg-gray-50" value={solicitudMaterial?.numOrdenTrabajo?.NumOrden} disabled />
          </div>

          <div className="min-w-[220px] flex-1">
            <label className="block text-sm text-gray-600 mb-1">N. Solicitud</label>
            <input className="input input-bordered w-full bg-gray-50" value={solicitudMaterial?.numOrden} disabled />
          </div>
           <div className="min-w-[220px] ">
            <label className="block text-sm text-gray-600 mb-1">Recibe</label>
            <select value={recibe} className={`select select-bordered w-full`} onChange={(e) => {setrecibe(e.target.value);}}>
              <option value={0}>...</option>
              {users.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
          
        </div>
      </div>

     
      <div className="w-full bg-base-100 rounded-2xl shadow-md p-5">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-3">Agregar ítems</h2>

        <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-end">
          <div className="md:col-span-5">
            <label className="block text-sm text-gray-600 mb-1">Descripcion</label>
            <input
              className={`input input-bordered w-full ${erroresItems.item ? 'input-error' : ''}`}
              list="browsers1"
              value={item}
              onChange={(e) => { const value = e.target.value; setitem(value); seterroresItems({...erroresItems, item: validarItem(value)}); }}
              
            />
            <datalist id="browsers1">
              {items?.map(p => (
                <option key={p.id} value={p.nombre} />
              ))}
            </datalist>
            <div className="h-5">{erroresItems.item && <p className="text-red-500 text-xs">{erroresItems.item}</p>}</div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-gray-600 mb-1">Cantidad</label>
            <input className={`input input-bordered w-full ${erroresItems.cantidad ? 'input-error' : ''}`} placeholder="0" value={cantidad ?? ""} onChange={(e) => {setcantidad(e.target.value); seterroresItems({...erroresItems, cantidad: validarCantidad(e.target.value)});}} />
            <div className="h-5">{erroresItems.cantidad && <p className="text-red-500 text-xs">{erroresItems.cantidad}</p>}</div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-gray-600 mb-1">Stock Min.</label>
            <input className={`input input-bordered w-full ${erroresItems.stockMin && habilitarStockMin ? 'input-error' : ''}`} disabled={habilitarStockMin} value={stockMin ?? ""} onChange={(e) => {setstockMin(e.target.value); seterroresItems({...erroresItems, stockMin: validarStockMin(e.target.value, habilitarStockMin)});}} />
            <div className="h-5">{erroresItems.stockMin && !habilitarStockMin && <p className="text-red-500 text-xs">{erroresItems.stockMin}</p>}</div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-gray-600 mb-1">Precio U.</label>
            <input className={`input input-bordered w-full ${erroresItems.precioUni ? 'input-error' : ''}`} placeholder="0.00" value={precioUni ?? 0} onChange={(e) => {setprecioUni(e.target.value); seterroresItems({...erroresItems, precioUni: validarPrecio(e.target.value)});}} />
            <div className="h-5">{erroresItems.precioUni && <p className="text-red-500 text-xs">{erroresItems.precioUni}</p>}</div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-gray-600 mb-1">% Desc.</label>
            <input className={`input input-bordered w-full ${erroresItems.descuento ? 'input-error' : ''}`} placeholder="0" value={descuento} onChange={(e) => {setdescuento(e.target.value); seterroresItems({...erroresItems, descuento: validarDescuento(e.target.value)});}} />
            <div className="h-5">{erroresItems.descuento && <p className="text-red-500 text-xs">{erroresItems.descuento}</p>}</div>
          </div>

          <div className="md:col-span-4 flex items-center gap-6 ">
            <div className="flex items-center gap-2">
              <input id="iva-no" type="radio" name="iva" checked={iva === false} onChange={() => setiva(false)} className="radio" />
              <label htmlFor="iva-no" className="text-sm">Sin IVA</label>
            </div>
            <div className="flex items-center gap-2">
              <input id="iva-si" type="radio" name="iva" checked={iva === true} onChange={() => setiva(true)} className="radio" />
              <label htmlFor="iva-si" className="text-sm">Con IVA</label>
            </div>
          </div>

          <div className="md:col-span-8">
            <label className="block text-sm text-gray-600 mb-1">Observación</label>
            <input className="input input-bordered w-full" placeholder="Observación del ítem" value={observacion} onChange={(e) => setobservacion(e.target.value)}/>
          </div>

          <div className="md:col-span-3">
            <label className="block text-sm text-gray-600 mb-1">Imagen</label>
            <input 
              type="file" 
              className="file-input file-input-bordered w-full" 
              accept="image/*"
              ref={fileInputRef}
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setimagen(file);
              }}
            />
            {imagen && <p className="text-xs text-green-600 mt-1">Imagen seleccionado</p>}
          </div>
        </div>
      </div>

      
      <div className="w-full bg-base-100 rounded-2xl shadow-md p-5">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-3">Almacenamiento</h2>

        <div className="flex gap-4 flex-wrap">
          <div className="w-full md:w-1/4">
            <label className="block text-sm text-gray-600 mb-1">Bodega</label>
            <select disabled={habilitarStockMin} className={`select select-bordered w-full ${erroresItems.bodega ? 'select-error' : ''}`} value={bodega} onChange={(e) => {setbodega(e.target.value); setseccion("..."); setpercha("...");  seterroresItems({...erroresItems, bodega: validarBodega(e.target.value)});}}>
              <option value={"..."} disabled>Seleccione una bodega</option>
              {bodegas?.map(b => <option key={b.id} value={b.id}>{b.bodega}</option>)}
            </select>
            <div className="h-5">{erroresItems.bodega && <p className="text-red-500 text-xs">{erroresItems.bodega}</p>}</div>
          </div>

          <div className="w-full md:w-1/4">
            <label className="block text-sm text-gray-600 mb-1">Sección</label>
            <select disabled={habilitarStockMin} className={`select select-bordered w-full ${erroresItems.seccion ? 'select-error' : ''}`} ref={selSecc} value={seccion} onChange={(e) => {setseccion(e.target.value); setpercha("..."); seterroresItems({...erroresItems, seccion: validarSeccion(e.target.value)});}}>
              <option value="..." disabled>Seleccione una sección</option>
              {secciones?.map(s => <option key={s.id} value={s.id}>{s.seccion}</option>)}
            </select>
            <div className="h-5">{erroresItems.seccion && <p className="text-red-500 text-xs">{erroresItems.seccion}</p>}</div>
          </div>

          <div className="w-full md:w-1/4">
            <label className="block text-sm text-gray-600 mb-1">Percha</label>
            <select disabled={habilitarStockMin} className={`select select-bordered w-full ${erroresItems.percha ? 'select-error' : ''}`} value={percha} onChange={(e) => {setpercha(e.target.value); seterroresItems({...erroresItems, percha: validarPercha(e.target.value)});}}>
              <option value="..." disabled>Seleccione una percha</option>
              {perchas?.map(p => <option key={p.id} value={p.id}>{p.percha}</option>)}
            </select>
            <div className="h-5">{erroresItems.percha && <p className="text-red-500 text-xs">{erroresItems.percha}</p>}</div>
          </div>

         
        </div>

       
      </div>

 <div className="mt-4 flex justify-center gap-3">
          <button type="button" className="btn btn-success" onClick={agregarItemsActualizado}>Agregar</button>
          <button type="button" className="btn btn-outline" onClick={limpiarCampos}>Limpiar</button>
        </div>
      
      <div className="w-full bg-base-100 rounded-2xl shadow-md p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-medium text-gray-600">TOTAL DOCUMENTO</h3>
            <div className="text-2xl font-bold text-yellow-500">{`$${total.toFixed(2)}`}</div>
          </div>
        </div>

        <div className="overflow-auto rounded-md border">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Descripción</th>
                <th>Cantidad</th>
                <th>Precio U.</th>
                <th>% Desc.</th>
                <th>Subtotal</th>
                <th>IVA</th>
                <th>Total</th>
                <th>Imagen</th>
                <th>Observación</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {solicitudMaterial?.itemsSolicitados?.map((s, i) =>
                <tr key={i} className={s.esActualizado ? "bg-green-100" : "bg-gray-100"}>
                  <td className="max-w-xs truncate">{s.nombre}</td>
                  <td>{s.cantidad}</td>
                  <td>{s.costo}</td>
                  <td>{s.descuento}</td>
                  <td>{s.subtotal}</td>
                  <td>{s.iva ? "15%" : "0%"}</td>
                  <td>{s.total.toFixed(2)}</td>
                  <td className="flex justify-center">
                    {s.imagen ? (
                      <img src={s.imagen} alt="Imagen del item" className="w-12 h-12 object-cover rounded" />
                    ) : (
                      <span className="text-gray-500 text-sm">N/A</span>
                    )}
                  </td>
                  <td className="max-w-sm truncate">{s.Observacion}</td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        className="btn btn-sm bg-blue-500 hover:bg-blue-600 text-white border-none"
                        onClick={() => asignarCampos(i, s)}
                        title="Editar"
                      >
                        ✏️ Editar
                      </button>
                      {!solCompraId && (
                        <button
                          className="btn btn-sm bg-red-500 hover:bg-red-600 text-white border-none"
                          onClick={() => eliminarItem(i)}
                          title="Eliminar"
                        >
                          🗑️ Eliminar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-3">
        <button type="button" className="btn btn-ghost btn-md gap-2" onClick={() => limpiarCampos()}>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
          Limpiar
        </button>
        <button type="button" className="btn btn-md bg-blue-500 hover:bg-blue-600 text-white border-0 gap-2" onClick={enviarygenerarActaDeEntrada}>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M5 13a3 3 0 105.119-1.023A5.822 5.822 0 1015.956 15H10a1 1 0 11-2 0v-3.379a1 1 0 00-1.823-.5A2.988 2.988 0 005 13z"/></svg>
          Generar Acta
        </button>
      </div>
    </div>

   
    <div className={`z-10 fixed inset-0 flex items-center justify-center transition-opacity duration-300 ${ventanaBuscarSolicitudMaterial ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
      <div className="bg-white w-11/12 md:w-4/5 h-4/5 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 flex flex-col">
        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 px-6 py-4 border-b border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📋</span>
              <div>
                <h2 className="text-lg font-bold text-white">Seleccionar Solicitud</h2>
                <p className="text-blue-100 text-xs">Elige una solicitud de material para asociar</p>
              </div>
            </div>
            <button onClick={() => setventanaBuscarSolicitudMaterial(false)} className="btn btn-circle btn-sm btn-ghost text-white hover:bg-blue-700">
              ✕
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <BuscarOrdenCompra ordenes={ordenes} setidSolMaterial={setsolCompraId} setventanaBuscarOrdenTrabajo={setventanaBuscarSolicitudMaterial} ventanaBuscarOrdenTrabajo={ventanaBuscarSolicitudMaterial} />
        </div>
      </div>
    </div>

    
    <div className={`fixed inset-0 z-10 flex items-center justify-center bg-black/40 transition-opacity duration-300 ${ventanaAgregarProovedor ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
      <div className="bg-white w-11/12 md:w-4/5 max-w-5xl h-[78vh] rounded-lg shadow-xl overflow-y-auto">
        <CrearProovedor setventanaAgregarProovedor={setventanaAgregarProovedor} ventanaAgregarProovedor={ventanaAgregarProovedor} />
      </div>
    </div>
  </>
);

};
