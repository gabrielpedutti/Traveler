import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      height: '100%'
    },
    tituloWrapper: {
      marginTop: 25,
    },
    titulo: {
      fontSize: 30,
      textAlign: 'center',
      color: '#2b88d9',
      fontWeight: 'bold',
    },
    textoSubtitulo: {
      fontSize: 16,
      textAlign: 'center',
      color: '#2b88d9',
      marginTop: 20,
    },
    subtitulo: {
      fontSize: 25,
      color: '#2b88d9',
      marginHorizontal: 15,
      fontWeight: 'bold',
    },
    img: {
      margin: 15,
      marginRight: 0,
      width: 70,
      height: 70,
    },
    linha: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    imagem: {
      resizeMode: 'cover',
      width: '95%',
      height: 200,
      marginStart: 10,
      marginBottom: 20,
    },
    local: {
      fontSize: 20,
      color: '#2b88d9',
      margin: 15,
    },
    semViagens: {
      fontSize: 20,
      color: '#2b88d9',
      textAlign: 'center',
      marginTop: 20,
      marginBottom: 20,
    },
    textContainer: {
      flexDirection: 'row',
    },
    texto:{
      marginHorizontal: 15,
    },
    label: {
      fontWeight: 'bold',
    },
    wrapperBotao: {
      margin: 15,
    },
    scrollView: {
      paddingHorizontal: 16,
      paddingBottom: 20,
      alignItems: 'center',
    },
    containerViagem: {
      flex: 1,
      alignItems: 'flex-start',
      width: '95%',
      backgroundColor: '#fff',
      borderRadius: 10,
      marginTop: 30,
    }
})

export { styles };