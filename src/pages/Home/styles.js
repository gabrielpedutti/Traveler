import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    text: {
      fontSize: 18,
      color: '#2b88d9',
      margin: 15,
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
    footer: {
      positivo: 'absolute',
      flexDirection: 'row',
      flexWrap: 'wrap',
      width: "100%",
    }
})

export { styles };