import { Document, Image, Page, PDFViewer, Text, View } from "@react-pdf/renderer"
import {Table, TR, TH, TD} from '@ag-media/react-pdf-table';
import { useEffect, useState } from "react";
import { styles } from "../../styles";
import logo from '../../../public/logo_alternativo.png';
import { useParams } from "react-router-dom";
import type { InfoPdfEntrada } from "../models/infoPdfEntrada";
import { actaDeEntradaByIdCompra } from "../controller/actaEntrada-api";



export const GenerarPdfActaDeEntrada = () => {
const [newSolicitud, setnewSolicitud] = useState<InfoPdfEntrada>();
const id = useParams();
  useEffect(() => {
   
    try {
        const cargarSolicitud = async() =>{
       const res = await actaDeEntradaByIdCompra(id.id);
       setnewSolicitud(res);
       console.log(res);
    }
    cargarSolicitud();
    } catch (error) {
      console.log(error);
    }
  

  }, []);
  
  return (
    <>
      <PDFViewer width={"100%"} height={"1000vh"}>
        <Document>
          <Page size={'A4'} style={styles.page}>
            <View style={styles.header}>
              <View style={styles.primero}><Image src={logo} style={styles.image}></Image></View>
              <View style={styles.ocSegundo}>
                <Text style={{borderBottomWidth:1,borderColor:"#000"}}>GUSTAFF S.A.</Text>
                <Text style={{borderBottomWidth:1,borderColor:"#000"}}>DEPARTAMENTO DE LOGISTICA INTERNA</Text>
                <Text style={{borderBottomWidth:1,borderColor:"#000"}}>BODEGA DE MATERIALES Y REPUESTOS</Text>
                <Text >ACTA DE Entrada</Text>
                </View>
            
            </View>
           <View style={styles.ocTercero}>
            <View><Text style={{textAlign:"left",fontWeight:"bold"}}>FACTURA N.: {newSolicitud?.factura} </Text> <Text style={{textAlign:"right",fontWeight:"bold"}}>ACTA N°: {newSolicitud?.numActa}</Text></View>
            <View><Text style={{textAlign:"left",fontWeight:"bold"}}>FECHA Y HORA DE RECEPCION: {newSolicitud?.fechaRemision.split("T")[0]}  {newSolicitud?.fechaRemision.split("T")[1].split(".")[0]}</Text> <Text style={{textAlign:"right",fontWeight:"bold"}}>SOLICITA: {newSolicitud?.numSolicitudCompra?.numOrdenTrabajo?.userSolicitante?.name ?? "N/A"}</Text></View>
           </View>
            <View style={{ margin:"10px",   width:"60%",height:"4%", display:"flex",flexDirection:"row",borderWidth:1,borderColor:"#000"}}>
            
             <View style={{  fontWeight:"bold",  textAlign:"center",width:"15%"}}>
             <Text >DESCRIPCION</Text>
            </View>
            <View style={{    textAlign:"center",width:"85%",height:"100%",borderLeftWidth:1,borderColor:"#000"}}>
             <Text >{newSolicitud?.numSolicitudCompra ? newSolicitud?.numSolicitudCompra?.numOrdenTrabajo?.DescripcionTrabajo :"N/A"}</Text>
            </View>
            </View>
            
<View style={{ margin: 10, width: "97%", marginTop: 6 }}>
 
   
  <View
    style={{
      flexDirection: "row",
      borderWidth: 1,
      borderColor: "#000",
      backgroundColor: "#bdbdbd"
    }}
  >
    <Text style={{ width: "15%", fontWeight:"bold", textAlign: "center", borderRightWidth: 1 }}>CANT.</Text>
    <Text style={{ width: "40%", fontWeight:"bold", paddingLeft: 4, borderRightWidth: 1 }}>ITEM</Text>
    <Text style={{ width: "15%", fontWeight:"bold", paddingLeft: 4, borderRightWidth: 1 }}>PRECIO U.</Text>
    <Text style={{ width: "15%", fontWeight:"bold", paddingLeft: 4, borderRightWidth: 1 }}>Descuento</Text>
    <Text style={{ width: "15%", fontWeight:"bold", paddingLeft: 4, borderRightWidth: 1 }}>IVA</Text>
    <Text style={{ width: "15%", fontWeight:"bold", paddingLeft: 4, borderRightWidth: 1 }}>SUBTOTAL</Text>
    <Text style={{ width: "15%", fontWeight:"bold", paddingLeft: 4, borderRightWidth: 1 }}>TOTAL</Text>
    
    
  </View>

 
 {newSolicitud?.itemEntrada.map((i)=> <View
    style={{
      flexDirection: "row",
      paddingVertical: 4
    }}
  >
    <Text style={{ width: "15%", fontSize: 9, textAlign: "center" }}>{i.cantidad} UNDS</Text>
    <Text style={{ width: "40%", fontSize: 9, paddingLeft: 4 }}>{i.item.nombre}</Text>
    <Text style={{ width: "15%", fontSize: 9, paddingLeft: 4 }}>{i.costo}</Text>
    <Text style={{ width: "15%", fontSize: 9, paddingLeft: 4 }}>{i.descuento}%</Text>
    <Text style={{ width: "15%", fontSize: 9, paddingLeft: 4 }}>{i.iva ? 15:0}%</Text>
    <Text style={{ width: "15%", fontSize: 9, paddingLeft: 4 }}>{i.subtotal}</Text>
    <Text style={{ width: "15%", fontSize: 9, paddingLeft: 4 }}>{i.total}</Text>
     

  </View>)}
</View>


<View style={{ marginHorizontal: 10, marginTop: 18, width: "97%", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
  <View style={{ width: "48%" }}>
    <Text style={{ fontSize: 9, fontWeight: "bold" }}>RECIBE: <Text style={{ fontWeight: "bold" }}>{newSolicitud?.recibe.name ?? "N/A" }</Text></Text>
    <View style={{ height: 24 }} />
    <Text style={{ borderTopWidth: 0.7, borderTopColor: "#000", width: "80%", paddingTop: 6 }}>FIRMA</Text>
  </View>

  
</View>

          </Page>
        </Document>
      </PDFViewer>
    </>
  )
}
