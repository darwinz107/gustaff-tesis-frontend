
const route:string = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}auth/` : "http://localhost:3000/auth/";

export const controlByRol= async():Promise<{isRol:boolean}> =>{

 const response = await fetch(`${route}validate/rol`,{
    method:"GET",
    credentials:'include'
 });

 const data = await response.json();
 return data;
}

export const controlByUser1= async():Promise<{isRol:boolean}> =>{

 const response = await fetch(`${route}validate/user1`,{
    method:"GET",
    credentials:'include'
 });

 const data = await response.json();
 return data;
}

export const controlByUser2= async():Promise<{isRol:boolean}> =>{

 const response = await fetch(`${route}validate/user2`,{
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

