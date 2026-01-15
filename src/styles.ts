import { StyleSheet } from "@react-pdf/renderer";
import { table } from "console";


export const styles = StyleSheet.create({
    page:{
      backgroundColor:"#ffffffff",
      fontSize:"8px"
    },

    principal:{
        margin:10
        
    },
    header:{
        margin:"10px",
        width:"97%",
        border:"1px solid black",
        display:"flex",
        flexDirection:"row",     
        alignItems:"center",
        fontWeight:"bold"
    },
   
  
    image:{
      width:"60px",
      margin:"5px"
    }
,
    primero:{
      width:"15%",
      
    },
    segundo:{
     width:"80%",
     height:"100%",
     display:"flex",
     flexDirection:"column",
     textAlign:"center",
     borderLeft:"1px black solid",
     borderRight:"1px black solid",
     justifyContent:"center"
    },
  
    tercero:{
     width:"20%",
     textAlign:"center",
     justifyContent:"center"
    },
    terceroTexto:{
      borderBottom:"1px black solid"
    },
    containerPrincipal:{
      display:"flex",
      flexDirection:"row"
    },
    container:{
      marginHorizontal:"5px",
      marginVertical:"10px"
      
    },
    child:{
      display:"flex",
      flexDirection:"row",
      marginTop:"9px"
    },

    childTitulo:{
      marginRight:"15px"
    },
    childContenido:{
      borderBottom:"1px solid black",
      paddingHorizontal:"50px"
    },
    orden:{
      fontWeight:"bold",
      display:"flex",
      flexDirection:"row"
    },
  
    th:{
     textAlign:"center",
     backgroundColor:"#bdbdbdff"
    }
    ,
    tr:{

    }
    ,
    td:{
      padding:"2px",
      justifyContent:"center"
    },
    textArea:{
      minHeight:"50%",
      alignItems:"flex-start",
      padding:"2px"
    }
    ,
    containerFirmas:{
      position:"absolute",
      top:"47%",
      left:"2%",
      display:"flex",
      flexDirection:"row",
      width:"97%",
      justifyContent:"space-between"
    },
    childFirma:{
      display:"flex",
      flexDirection:"column",
      alignItems:"center"
    },

      ocSegundo:{
     width:"100%",
     height:"100%",
     display:"flex",
     flexDirection:"column",
     textAlign:"center",
     borderLeft:"1px black solid",
     justifyContent:"center"
    },

    ocTercero:{
      marginHorizontal:"10px",
        width:"85%"
      
    }

    
    
})