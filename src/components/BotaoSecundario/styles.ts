import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  botao: {
    marginTop: 25,
    marginStart: 15,
    marginEnd: 15,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#2c88d9',
    borderRadius: 5,
    elevation: 3,
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 50,
  },
  textoBotaoSecundario: {
    color: '#2c88d9',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 15,
  },
})

export { styles };