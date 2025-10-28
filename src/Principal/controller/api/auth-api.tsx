
const route:string = "http://localhost:3000/auth/"

export const controlByRol= async():Promise<{isRol:boolean}> =>{

 const response = await fetch(`${route}validate/rol`,{
    method:"GET",
    credentials:'include'
 });

 const data = await response.json();
 return data;
}

export const logoutSession = async():Promise<{msj:string}> =>{
 
   const response = await fetch(`${route}logout/token`,{
     method:"GET",
     credentials:'include'
   });

   const data = await response.json();
   return data;
}