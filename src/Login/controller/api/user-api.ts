import type { user } from "../../models/user";

const route:string = "http://localhost:3000/users/"

export const createUser =async(user:user):Promise<string>=>{

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