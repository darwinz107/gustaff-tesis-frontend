
const route:string = "http://localhost:3000/users/"

export const controlByRol= async():Promise<{isRol:boolean}> =>{

 const response = await fetch(`${route}rol`,{
    method:"GET",
    credentials:'include'
 });

 const data = await response.json();
 return data;
}

export const logoutSession = async():Promise<{msj:string}> =>{
 
   const response = await fetch(`${route}logout`,{
     method:"GET",
     credentials:'include'
   });

   const data = await response.json();
   return data;
}