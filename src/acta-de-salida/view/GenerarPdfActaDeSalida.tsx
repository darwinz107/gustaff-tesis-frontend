import { Document, Image, Page, PDFViewer, Text, View } from "@react-pdf/renderer"
import {Table, TR, TH, TD} from '@ag-media/react-pdf-table';
import { useEffect, useState } from "react";
import { getLastSolicitud } from "../../controller/api/orden-api";
import type { SolicitudOrden } from "../../models/solicitudOrden";
import type { DetallesPrevioCompra } from "../models/DetallesPrevioCompra";
import { styles } from "../../styles";
import logo from '../../../public/logo_alternativo.png';
import { useParams } from "react-router-dom";
import type { InfoPdfCompra } from "../models/infoPdfCompra";
import { ordenCompraById } from "../../orden-de-compra/controller/ordenCompraApi";
import type { InfoPdfSalida } from "../models/InfoPdfSalida";
import { actaDeSalidaByIdCompra } from "../controller/actaSalida-api";

export const GenerarPdfActaDeSalida = () => {

const [newSolicitud, setnewSolicitud] = useState<InfoPdfSalida>();
const { id } = useParams<{ id?: string }>();

useEffect(() => {
  const cargarSolicitud = async () => {
    console.log(id);
    const res = id
      ? await actaDeSalidaByIdCompra(Number(id))
      : await actaDeSalidaByIdCompra(undefined as any);

    setnewSolicitud(res);
  };

  cargarSolicitud();
}, [id]);

  
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
                <Text >ACTA DE SALIDA</Text>
                </View>
            
            </View>
           <View style={styles.ocTercero}>
            <Text style={{textAlign:"right",fontWeight:"bold"}}>ACTA N°: {newSolicitud?.numActa}</Text>
            <View><Text style={{textAlign:"left",fontWeight:"bold"}}>FECHA Y HORA DE RECEPCION: {newSolicitud?.fechaRemision.split("T")[0]}  {newSolicitud?.fechaRemision.split("T")[1].split(".")[0]}</Text> <Text style={{textAlign:"right",fontWeight:"bold"}}>SOLICITA: {newSolicitud?.numSolicitudCompra?.numOrdenTrabajo?.userSolicitante?.name ?? "POR AGREGAR"}</Text></View>
           </View>
            <View style={{ margin:"10px",   width:"60%",height:"4%", display:"flex",flexDirection:"row",borderWidth:1,borderColor:"#000"}}>
            
             <View style={{  fontWeight:"bold",  textAlign:"center",width:"15%"}}>
             <Text >Descripcion</Text>
            </View>
            <View style={{    textAlign:"center",width:"85%",height:"100%",borderLeftWidth:1,borderColor:"#000"}}>
             <Text >{newSolicitud?.numSolicitudCompra?.numOrdenTrabajo ? newSolicitud?.numSolicitudCompra?.numOrdenTrabajo.DescripcionTrabajo : newSolicitud?.descripcion ?newSolicitud?.descripcion :'N/A'}</Text>
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
    <Text style={{ width: "10%", fontWeight:"bold", textAlign: "center", borderRightWidth: 1 }}>CANT.</Text>
    <Text style={{ width: "40%", fontWeight:"bold", paddingLeft: 4, borderRightWidth: 1 }}>Item</Text>
    <Text style={{ width: "15%", fontWeight:"bold", paddingLeft: 4, borderRightWidth: 1 }}>Precio</Text>
    {!newSolicitud?.numSolicitudCompra && (
  <Text style={{ width: "15%", fontWeight:"bold", paddingLeft: 4, borderRightWidth: 1 }}>
    Característica
  </Text>
)}

    <Text style={{ width: "35%", fontWeight:"bold", paddingLeft: 4 }}>OBSERVACION</Text>
    
  </View>

 
 {newSolicitud?.itemSalida.map((i)=> <View
    style={{
      flexDirection: "row",
      paddingVertical: 4
    }}
  >
    <Text style={{ width: "10%", fontSize: 9, textAlign: "center" }}>{i?.cantidad} UNDS</Text>
    <Text style={{ width: "40%", fontSize: 9, paddingLeft: 4 }}>{i?.inventario?.nombre}</Text>
    <Text style={{ width: "15%", fontSize: 9, paddingLeft: 4 }}>{i?.inventario?.costo}</Text>
     {!newSolicitud?.numSolicitudCompra && (
  <Text style={{ width: "15%", fontSize: 9, paddingLeft: 4 }}>
    {i?.caracteristica ?? "N/A"}
  </Text>
)}

    <Text style={{ width: "35%", fontSize: 9, paddingLeft: 4 }}>{i?.Observacion ??"N/A"}</Text>

  </View>)}
</View>


<View style={{ marginHorizontal: 10, marginTop: 18, width: "97%", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
  <View style={{ width: "48%" }}>
    <Text style={{ fontSize: 9, fontWeight: "bold" }}>RECIBE: <Text style={{ fontWeight: "bold" }}>{newSolicitud?.numSolicitudCompra?.numOrdenTrabajo?.userSolicitante?.name ?? newSolicitud?.recibeSinSM?.name ?? "N/A"}</Text></Text>
    <View style={{ height: 24 }} />
    <Text style={{ borderTopWidth: 0.7, borderTopColor: "#000", width: "80%", paddingTop: 6 }}>FIRMA</Text>
  </View>

  <View style={{ width: "48%", alignItems: "flex-end" }}>
    <Text style={{ fontSize: 9, fontWeight: "bold" }}>ENTREGA: <Text style={{ fontWeight: "bold" }}>{newSolicitud?.entrega?.name ?? "N/A"}</Text></Text>
    <View style={{ height: 24 }} />
    <Text style={{ borderTopWidth: 0.7, borderTopColor: "#000", width: "80%", paddingTop: 6, textAlign: "right" }}>FIRMA</Text>
  </View>
</View>

          </Page>
        </Document>
      </PDFViewer>
    </>
  )
}

