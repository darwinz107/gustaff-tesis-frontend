import { Document, Image, Page, PDFViewer, Text, View } from "@react-pdf/renderer"
import {Table, TR, TH, TD} from '@ag-media/react-pdf-table';


import { useEffect, useState } from "react";
import { getLastSolicitud } from "../../controller/api/orden-api";
import type { SolicitudOrden } from "../../models/solicitudOrden";
import { ordenCompraById } from "../controller/ordenCompraApi";
import type { DetallesPrevioCompra } from "../models/DetallesPrevioCompra";
import { styles } from "../../styles";
import logo from '../../../public/gustaff_logo.jpg';
import { useParams } from "react-router-dom";

export const GenerarPdfOrdenCompra = () => {

  const [newSolicitud, setnewSolicitud] = useState<DetallesPrevioCompra>();
const id = useParams();
  useEffect(() => {
   
    try {
        const cargarSolicitud = async() =>{
       const res = await ordenCompraById(id);
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
            <Text style={{textAlign:"right",fontWeight:"bold"}}>ORDEN DE TRABAJO N°: {newSolicitud?.numOrdenTrabajo.NumOrden}</Text>
            <View><Text style={{textAlign:"left",fontWeight:"bold"}}>FECHA Y HORA DE RECEPCION: {newSolicitud?.fechaRemision.split("T")[0]}  {newSolicitud?.fechaRemision.split("T")[1].split(".")[0]}</Text> <Text style={{textAlign:"right",fontWeight:"bold"}}>SOLICITUD N°: {newSolicitud?.numOrden}</Text></View>
           </View>
            <View style={{ margin:"10px",   width:"97%"}}>
             <Table >
              <TR >
                <TD style={{fontWeight:"bold",justifyContent:"flex-end"}}>DESTINO DEL USO DE MATERIALES Y/O REPUESTOS:  </TD>
                <TD >{newSolicitud?.Destino}</TD>
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
          </Page>
        </Document>
      </PDFViewer>
    </>
  )
}

