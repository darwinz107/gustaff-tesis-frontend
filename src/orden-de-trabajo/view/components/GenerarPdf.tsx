import { Document, Image, Page, PDFViewer, Text, View } from "@react-pdf/renderer"
import { styles } from "../../../styles"
import logo from "../../../../public/gustaff_logo.jpg"


export const GenerarPdf = () => {
  return (
    <>
    <PDFViewer width={"100%"} height={"1000vh"}>
    <Document>
        <Page size={'A4'} style={styles.page}>
          <View style={styles.header}>
            <View><Image src={logo} style={styles.image}></Image></View>
            <View><Text>GUSTAFF S.A.
DEPARTAMENTO DE MANTENIMIENTO
ORDEN DE TRABAJO</Text></View>
            <View></View>
            <Text>xdxd</Text>
          </View>
        </Page>
    </Document>
    </PDFViewer>
    </>
  )
}

