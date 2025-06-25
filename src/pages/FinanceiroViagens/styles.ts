import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      height: '100%',
      backgroundColor: '#F2F2F2',
    },
    wrapper: {
      flex: 1,
      top: '25%',
      alignItems: 'center',
    },
    text: {
      fontSize: 18,
      color: '#2b88d9',
      margin: 15,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    textSubtitle: {
      fontSize: 16,
      color: '#3b3b3b',
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
    safeArea: {
      flex: 1,
      backgroundColor: '#F2F2F2',
      paddingTop: -100,
    },
})

export { styles };