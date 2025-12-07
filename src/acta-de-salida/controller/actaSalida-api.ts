
const route = "http://localhost:3000/";

  export const createActaSalidaApi = async(id:number):Promise<{msj:string, validate:boolean}> => {
    
            const response:Response = await fetch(`${route}inventario/acta-salida/${id}`,{
           method:"GET"
            });
            const data = await response.json();
            return data;
        }