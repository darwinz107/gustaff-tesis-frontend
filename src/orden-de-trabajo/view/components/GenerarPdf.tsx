import { Document, Image, Page, PDFViewer, Text, View } from "@react-pdf/renderer"
import {Table, TR, TH, TD} from '@ag-media/react-pdf-table';
import { styles } from "../../../styles"
import logo from "../../../../public/logo_alternativo.png"



export const GenerarPdf = () => {
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
                <Text style={styles.childTitulo}>FECHA DE REQUERIMIENTO:</Text>
                <Text style={styles.childContenido}>01/10/2025</Text>
                </View>
                <View style={styles.child}>
                <Text style={styles.childTitulo}>HORA DE REQUERIMIENTO:</Text>
                <Text style={styles.childContenido}>01/10/2025</Text>
                </View>
                <View style={styles.child}>
                <Text style={styles.childTitulo}>ÁREA DE TRABAJO</Text>
                <Text style={styles.childContenido}></Text>
                </View>
            </View>
             <View style={styles.container}>
              <View style={styles.child}>
                <Text style={styles.childTitulo}>FECHA DE INICIO PLANIFICADA:</Text>
                <Text style={styles.childContenido}>10:51:34</Text>
                </View>
                <View style={styles.child}>
                <Text style={styles.childTitulo}>HORA DE REQUERIMIENTO:</Text>
                <Text style={styles.childContenido}>10:51:34</Text>
                </View>
                <View style={styles.child}>
                <View style={styles.orden}>
                  <Text >Orden:    </Text>
                <Text >OTM00634</Text>
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
                <TD style={styles.td}>MECÁNICA</TD>
                <TD style={styles.td}>FABRICACION</TD>
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
                <TD style={styles.td}>N/A</TD>
                <TD style={styles.td}>TEMPERADORA NUEVA</TD>
              </TR>
             </Table>
            </View>
               <View style={styles.container}>
             <Table style={styles.table}>
              <TH style={styles.th}>
                <TD style={styles.td}>DESCRIPCIÓN DE TRABAJO</TD>
                
              </TH>
              <TR style={styles.tr}>
                <TD style={styles.textArea}>FABRICACION Y HABILITACION DE SISTEMAS DE AGUA PARA LA TEMPERADORA 
</TD>                
              </TR>
             </Table>
            </View>
             <View style={styles.containerFirmas}>
              <View style={styles.childFirma}>  
                <Text style={styles.childContenido}>Darwin Zambrano</Text>
                <Text >SOLICITA</Text>              
                </View> 
                <View style={styles.childFirma}>  
                <Text style={styles.childContenido}>   </Text>
                <Text >COOR. DE MANTENIMIENTO</Text> 
                <Text>VERIFICACIÓN</Text>             
                </View>
                <View style={styles.childFirma}>  
                <Text style={styles.childContenido}>Jhonson Cando</Text>
                <Text >RECIBE</Text>              
                </View>              
            </View>
          </Page>
        </Document>
      </PDFViewer>
    </>
  )
}

