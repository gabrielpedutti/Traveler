import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      height: '100%'
    },
    titulo: {
      fontSize: 25,
      lineHeight: 45,
      color: '#2b88d9',
      margin: 15,
      fontWeight: 'bold',
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
      resizeMode: 'contain',
      width: '95%',
      height: 200,
      marginStart: 10,
      marginTop: 40,
      marginBottom: 20,
    },
    local: {
      fontSize: 20,
      color: '#2b88d9',
      margin: 15,
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
    }
})

export { styles };