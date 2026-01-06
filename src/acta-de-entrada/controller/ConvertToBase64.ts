export const ConvertToBase64 = async (file:Blob):Promise<string> =>{
 
  return  new Promise((resolve,reject)=>{
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload=()=>{resolve(reader.result as string);}
    reader.onerror=(err)=>reject(err);
    });
   
}