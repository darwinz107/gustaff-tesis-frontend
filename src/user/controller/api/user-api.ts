import type { Users } from "../../../admin/models/users";
import type { FiltrarUserDto } from "../../models/filtrarUser";

const route = "http://localhost:3000/";

export const getUsers = async():Promise<Users[]>=>{
      const response:Response = await fetch(`${route}users/users/all`,{
      method:"GET"
      });
      const data = await response.json();
      return data;
  }

export const getOneUser = async(id:number):Promise<Users>=>{
      const response:Response = await fetch(`${route}users/${id}`,{
      method:"GET"
      });
      const data = await response.json();
      return data;
  }  

  export const filtrarUsers = async (filtros: FiltrarUserDto): Promise<Users[]> => {
  try {
    const response: Response = await fetch(`${route}users/filter`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(filtros)
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("filtrarUsers error:", error);
    return [];
  }
};