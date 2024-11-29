import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    text: {
      fontSize: 18,
      color: '#2b88d9',
      margin: 15,
      fontWeight: 'bold',
    },
    img: {
      margin: 0,
      width: "100%",
      height: 180,
      marginRight: 0,
    },
    linha: {
        flexDirection: 'row',
        alignContent: 'center',
        marginStart: 15
    },
    icone: {
      alignSelf: 'center'
    }
})

export { styles };