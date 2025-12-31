import { Document, Image, Page, PDFViewer, Text, View } from "@react-pdf/renderer"
import {Table, TR, TH, TD} from '@ag-media/react-pdf-table';
import { useEffect, useState } from "react";
import { getLastSolicitud } from "../../controller/api/orden-api";
import type { SolicitudOrden } from "../../models/solicitudOrden";
import { ordenCompraById, ordenCompraByOrdenTrabajoId } from "../controller/ordenCompraApi";
import type { DetallesPrevioCompra } from "../models/DetallesPrevioCompra";
import { styles } from "../../styles";
import logo from '../../../public/gustaff_logo.jpg';
import { useParams } from "react-router-dom";
import type { InfoPdfCompra } from "../models/infoPdfCompra";

export const GenerarPdfOrdenCompra = () => {

const [newSolicitud, setnewSolicitud] = useState<InfoPdfCompra>();
const id = useParams();
  useEffect(() => {
   
    try {
        const cargarSolicitud = async() =>{
       const res = await ordenCompraByOrdenTrabajoId(id.id);
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
              <View style={styles.ocSegundo}><Text>GUSTAFF S.A.</Text>
                <Text>DEPARTAMENTO DE LOGISTICA INTERNA</Text>
                <Text>BODEGA DE MATERIALES Y REPUESTOS</Text></View>
            
            </View>
           <View style={styles.ocTercero}>
            <Text style={{textAlign:"right",fontWeight:"bold"}}>ORDEN DE TRABAJO N°: {newSolicitud?.numOrdenTrabajo?.NumOrden}</Text>
            <View><Text style={{textAlign:"left",fontWeight:"bold"}}>FECHA Y HORA DE RECEPCION: {newSolicitud?.fechaRemision.split("T")[0]}  {newSolicitud?.fechaRemision.split("T")[1].split(".")[0]}</Text> <Text style={{textAlign:"right",fontWeight:"bold"}}>SOLICITUD N°: {newSolicitud?.numOrden}</Text></View>
           </View>
            <View style={{ margin:"10px",   width:"97%"}}>
             <Table >
              <TR >
                <TD style={{fontWeight:"bold",justifyContent:"flex-end"}}>DESTINO DEL USO DE MATERIALES Y/O REPUESTOS:  </TD>
                <TD >{newSolicitud?.Destino ===""||newSolicitud?.Destino === null ? "N/A":newSolicitud?.Destino}</TD>
              </TR>
              <TR style={styles.tr}>
                <TD style={styles.td}><Text style={{fontWeight:"bold"}}>AREA:</Text> {newSolicitud?.numOrdenTrabajo.Area}</TD>
                <TD style={{padding:"2px", justifyContent:"center"}}></TD>
              </TR>
               <TR style={styles.tr}>
                <TD style={styles.td}><Text style={{fontWeight:"bold"}}>MAQUINA:</Text> {newSolicitud?.numOrdenTrabajo.Maquina}</TD>
                <TD style={styles.td}><Text style={{fontWeight:"bold"}}>CODIGO:</Text>{newSolicitud?.numOrdenTrabajo.Codigo}</TD>
              </TR>
             </Table>
             
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
    <Text style={{ width: "50%", fontWeight:"bold", paddingLeft: 4, borderRightWidth: 1 }}>NOMBRE REPUESTO O MATERIAL</Text>
    <Text style={{ width: "25%", fontWeight:"bold", paddingLeft: 4, borderRightWidth: 1 }}>CARACTERISTICA TECNICA</Text>
    <Text style={{ width: "15%", fontWeight:"bold", paddingLeft: 4 }}>OBSERVACION</Text>
    <Text style={{ width: "15%", fontWeight:"bold", paddingLeft: 4, borderLeftWidth: 1 }}>ESTADO</Text>
  </View>

 
 {newSolicitud?.itemSolicitados.map((i)=> <View
    style={{
      flexDirection: "row",
      paddingVertical: 4
    }}
  >
    <Text style={{ width: "10%", fontSize: 9, textAlign: "center" }}>{i.cantidad} UNDS</Text>
    <Text style={{ width: "50%", fontSize: 9, paddingLeft: 4 }}>{i.item}</Text>
    <Text style={{ width: "25%", fontSize: 9, paddingLeft: 4 }}>{i.caracteristica}</Text>
    <Text style={{ width: "15%", fontSize: 9, paddingLeft: 4 }}>{i.Observacion}</Text>
    <Text style={{ width: "15%", fontSize: 9, paddingLeft: 4 }}>{i.existencia ? "EN STOCK":"NO DISPONIBLE"}</Text>
  </View>)}
</View>


<View style={{ marginHorizontal: 10, marginTop: 18, width: "97%", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
  <View style={{ width: "48%" }}>
    <Text style={{ fontSize: 10, fontWeight: "bold" }}>SOLICITA: <Text style={{ fontWeight: "normal" }}>{newSolicitud?.numOrdenTrabajo.userSolicitante.name }</Text></Text>
    <View style={{ height: 24 }} />
    <Text style={{ borderTopWidth: 0.7, borderTopColor: "#000", width: "80%", paddingTop: 6 }}>FIRMA</Text>
  </View>

  <View style={{ width: "48%", alignItems: "flex-end" }}>
    <Text style={{ fontSize: 10, fontWeight: "bold" }}>AUTORIZA: <Text style={{ fontWeight: "normal" }}>{newSolicitud?.Autoriza}</Text></Text>
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

