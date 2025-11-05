const route = "http://localhost:3000/";


export const areas = async ():Promise<{nombre:string}> => {
    const res = await fetch(`${route}orden-de-trabajo`,{
        method: 'GET',
    });
    const data = await res.json();
    return data;
}

export const getAllCodByArea = async (area:string):Promise<{cod:string}> => {

    console.log("getAllCodByArea in front",area);
    const res = await fetch(`${route}orden-de-trabajo/all/codigos`,{
        method: 'POST',
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({area})
    });
    const data = await res.json();
    return data;
}

export const getAllMaquinasByCod = async (cod:string):Promise<{maquina:string}> =>{
    const res = await fetch(`${route}orden-de-trabajo/all/maquinas`,{
        method: 'POST',
        headers:{
            "Content-Type":"application/json"
},
        body:JSON.stringify({codigo:cod})            
});
    const data = await res.json();
    return data;
}


  export const getUsers = async():Promise<{name:string}[]>=>{
      const response:Response = await fetch(`${route}users/users/all`,{
      method:"GET"
      });
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

    export const getAllTipoTrabajoByCategoria = async (categoria:string):Promise<{tipo:string}[]> => {
         
        const response:Response = await fetch(`${route}orden-de-trabajo/all/tipo-trabajo/${categoria}`,{
           method:"GET"
        });

        const data = await response.json();
        return data;
    }


    