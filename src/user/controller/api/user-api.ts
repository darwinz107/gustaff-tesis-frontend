import type { Users } from "../../../admin/models/users";

const route = "http://localhost:3000/";

export const getUsers = async():Promise<Users[]>=>{
      const response:Response = await fetch(`${route}users/users/all`,{
      method:"GET"
      });
      const data = await response.json();
      return data;
  }

export const getOneUser = async(id:number):Promise<Users[]>=>{
      const response:Response = await fetch(`${route}users/${id}`,{
      method:"GET"
      });
      const data = await response.json();
      return data;
  }  