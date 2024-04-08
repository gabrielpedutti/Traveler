import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#2c88d9",
    height: '100%',
  },
  containerImagem: {
    marginTop: 70,
    alignItems: 'center'
  },
  imagem: {
    width: 300,
    height: 150,
  },
  containerLembrar: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  switch: {
    width: 40,
    marginStart: 18,
    marginRight: 5,
  },
  textoBranco: {
    color: '#fff',
    fontWeight: 'bold'
  },
  botao: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginStart: 15,
    marginEnd: 15,
    marginTop: 40,
  },
  botaoText: {
    fontWeight: 'bold',
    textAlign: 'center'
  },
  containerContinue: {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginStart: 40,
    marginEnd: 40
  },
  divisao: {
    borderBottomWidth: 2,
    borderColor: '#fff',
    width: 100
  },
  containerIcons: {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginStart: 60,
    marginEnd: 60
  },
  containerCadastre: {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textoCadastre: {
    fontWeight: 'bold',
    marginLeft: 10,
    textDecorationLine: 'underline',
    color: '#f7c325'
  }
})

export { styles };