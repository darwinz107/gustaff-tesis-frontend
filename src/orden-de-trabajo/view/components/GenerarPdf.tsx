import { Document, Image, Page, PDFViewer, Text, View } from "@react-pdf/renderer"
import {Table, TR, TH, TD} from '@ag-media/react-pdf-table';
import { styles } from "../../../styles"
import logo from "../../../../public/logo_alternativo.png"
import { useEffect, useState } from "react";
import { getLastSolicitud } from "../../controller/api/orden-api";
import type { SolicitudOrden } from "../../models/solicitudOrden";
import { useParams } from "react-router-dom";



export const GenerarPdf = () => {

  const [newSolicitud, setnewSolicitud] = useState<SolicitudOrden>();
const id = useParams();
  useEffect(() => {
   
    try {
      console.log(id.id);
        const cargarSolicitud = async() =>{
       const res = await getLastSolicitud(id.id);
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
              <View style={styles.segundo}><Text>GUSTAFF S.A.</Text>
                <Text>DEPARTAMENTO DE MANTENIMIENTO</Text>
                <Text>ORDEN DE TRABAJO</Text></View>
              <View style={styles.tercero}>
                <View style={styles.terceroTexto}><Text>GUMA-RG003</Text></View>
                <View style={styles.terceroTexto}><Text>REV-002</Text></View>
                <View ><Text>PAG 1 de 1</Text></View>
              </View>

            </View>
            <View style={styles.containerPrincipal}>
            <View style={styles.container}>
              <View style={styles.child}>
                <Text style={styles.childTitulo}>FECHA DE INICIO PLANIFICADA:</Text>
                <Text style={styles.childContenido}>{newSolicitud?.fechaInicio}</Text>
                </View>
                <View style={styles.child}>
                <Text style={styles.childTitulo}>HORA DE INICIO:</Text>
                <Text style={styles.childContenido}>{newSolicitud?.HoraInicio}</Text>
                </View>
                <View style={styles.child}>
                <Text style={styles.childTitulo}>ÁREA DE TRABAJO</Text>
                <Text style={styles.childContenido}>{newSolicitud?.Area}</Text>
                </View>
            </View>
             <View style={styles.container}>
              <View style={styles.child}>
                <Text style={styles.childTitulo}>FECHA DE FINALIZACION:</Text>
                <Text style={styles.childContenido}>{newSolicitud?.fechaFinal}</Text>
                </View>
                <View style={styles.child}>
                <Text style={styles.childTitulo}>HORA DE FINALIZACION:</Text>
                <Text style={styles.childContenido}>{newSolicitud?.HoraFinal}</Text>
                </View>
                <View style={styles.child}>
                <View style={styles.orden}>
                  <Text >Orden:    </Text>
                <Text >{newSolicitud?.NumOrden}</Text>
                </View>
                </View>
            </View>
          
            </View>
                 <View style={styles.container}>
             <Table style={styles.table}>
              <TH style={styles.th}>
                <TD style={styles.td}>CATEGORIA</TD>
                <TD style={styles.td}>TIPO DE TRABAJO</TD>
              </TH>
              <TR style={styles.tr}>
                <TD style={styles.td}>{newSolicitud?.Categoria}</TD>
                <TD style={styles.td}>{newSolicitud?.TipoTrabajo}</TD>
              </TR>
             </Table>
            </View>
                 <View style={styles.container}>
             <Table style={styles.table}>
              <TH style={styles.th}>
                <TD style={styles.td}>CODIGO</TD>
                <TD style={styles.td}>NOMBRE DE MÁQUINA, EQUIPO O PIEZA</TD>
              </TH>
              <TR style={styles.tr}>
                <TD style={styles.td}>{newSolicitud?.Codigo}</TD>
                <TD style={styles.td}>{newSolicitud?.Maquina ?? "N/A"}</TD>
              </TR>
             </Table>
            </View>
               <View style={styles.container}>
             <Table style={styles.table}>
              <TH style={styles.th}>
                <TD style={styles.td}>DESCRIPCIÓN DE TRABAJO</TD>
                
              </TH>
              <TR style={styles.tr}>
                <TD style={styles.textArea}>{newSolicitud?.DescripcionTrabajo ?? "N/A" } 
</TD>                
              </TR>
             </Table>
            </View>
             <View style={styles.containerFirmas}>
              <View style={styles.childFirma}>  
                <Text style={styles.childContenido}>{newSolicitud?.userSolicitante.name}</Text>
                <Text >SOLICITA</Text>              
                </View> 
                <View style={styles.childFirma}>  
                <Text style={styles.childContenido}>             </Text>
                <Text >COOR. DE MANTENIMIENTO</Text> 
                <Text>VERIFICACIÓN</Text>             
                </View>
                <View style={styles.childFirma}>  
                <Text style={styles.childContenido}>{newSolicitud?.userReceptor.name}</Text>
                <Text >RECIBE</Text>              
                </View>              
            </View>
          </Page>
        </Document>
      </PDFViewer>
    </>
  )
}

