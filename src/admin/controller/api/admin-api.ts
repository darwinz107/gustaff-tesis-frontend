import type { CrearArea } from "../../models/create-area";

const route:string = "http://localhost:3000/"

export const getAllAreas =async():Promise<{area:string}>=>{
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