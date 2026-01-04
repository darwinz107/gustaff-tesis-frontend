export const ConvertToBase64 = async (file:Blob) =>{
 
  return  new Promise((resolve,reject)=>{
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload=()=>{resolve(reader.result);}
    reader.onerror=(err)=>reject(err);
    });
   
}