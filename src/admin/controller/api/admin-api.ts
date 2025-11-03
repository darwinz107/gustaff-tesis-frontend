import type { CrearArea } from "../../models/create-area";
import type { CrearCategoria } from "../../models/create-categoria";
import type { CreateMaquina } from "../../models/create-maquina";

const route:string = "http://localhost:3000/"

export const getAllAreas =async():Promise<{area:string}[]>=>{
const response:Response = await fetch(`${route}orden-de-trabajo`,{
method:"GET"
});

const data = await response.json();
return data;
}

export const crearNuevaArea = async(crearArea:CrearArea):Promise<{msj:string}>=>{
    console.log("crearNuevaArea in front",crearArea);
  const response:Response = await fetch(`${route}orden-de-trabajo/create/area`,{
    method:"POST",
    headers:{
       "Content-Type":"application/json"
},
    body:JSON.stringify(crearArea)});

    const data = await response.json();
return data;
}

export const crearNuevaMaquina = async(createMaquina:CreateMaquina):Promise<{msj:string}>=>{
  const response:Response = await fetch(`${route}orden-de-trabajo/create/maquina`,{
    method:"POST",
    headers:{
        "Content-Type":"application/json"
  },
  body:JSON.stringify(createMaquina)}
);

  const data = await response.json();
  return data;
}

export const crearCategoria = async(crearCategoria:CrearCategoria):Promise<{msj:string}> =>{

  const response:Response = await fetch(`${route}orden-de-trabajo/create/categoria`,{
    method:"POST",
    headers:{
        "Content-Type":"application/json"
  },
  body:JSON.stringify(crearCategoria)}
);    
  const data = await response.json();
  return data;
  }

  export const getAllCategorias = async():Promise<{nombre:string}[]>=>{
    const response:Response = await fetch(`${route}orden-de-trabajo/categorias/all`,{
      method:"GET"
    });
    const data = await response.json();
    return data;
  }

  export const logoutSession = async():Promise<{msj:string}> =>{
   
     const response:Response = await fetch(`${route}logout/token`,{
       method:"GET",
       credentials:'include'
     });
  
     const data = await response.json();
     return data;
  }


