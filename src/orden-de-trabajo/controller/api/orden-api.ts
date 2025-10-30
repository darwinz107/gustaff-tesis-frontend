const route = "http://localhost:3000/orden-de-trabajo";


export const areas = async ():Promise<{nombre:string}> => {
    const res = await fetch(`${route}`,{
        method: 'GET',
    });
    const data = await res.json();
    return data;
}

export const getAllCodByArea = async (area:string):Promise<{cod:string}> => {
    const res = await fetch(`${route}/all/codigos`,{
        method: 'POST',
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({area:area})
    });
    const data = await res.json();
    return data;
}