export const Base64ToBlob = (base64) =>{
    const type = base64.split(";")[0].split(":")[1];
    console.log("TYPE: ",type);
    const textBinary = atob(base64.split(",")[1]);
    const byteNumbers = new Array(textBinary.length);

    for (let index = 0; index < byteNumbers.length; index++) {
        
        byteNumbers[index] = textBinary.charCodeAt(index);

    }

    const byteArray = new Uint8Array(byteNumbers);

    return new Blob([byteArray],{type:type});
}