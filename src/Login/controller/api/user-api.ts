import type { login } from "../../models/login";
import type { user } from "../../models/user";

const route:string = "http://localhost:3000/users/"

export const createUser =async(user:user):Promise<{msj:string}>=>{

    const response:Response = await fetch(`${route}create`,{
     method:"POST",
     headers:{
        "Content-Type":"application/json"
     },
     body:JSON.stringify(user)
    });

    const data = await response.json();
return data;
}

export const generateToken=async(login:login):Promise<{msj:string,access:boolean}>=>{

    const response:Response = await fetch(`${route}login`,{
     method:"POST",
     headers:{
         "Content-Type":"application/json"
     },
     credentials:'include'
     ,
     body:JSON.stringify(login)
    });

    const data = await response.json();

return data;
}