import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#00000063',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    position: 'absolute',
    top: '25%',
    width: 300,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    backgroundColor: '#fff',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  containerTitulo: {
    height: 40,
    justifyContent: 'center',
    backgroundColor: '#2b88d9',
    width: '100%',
    borderRadius: 5,
  },
  titulo: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 16,
  },
  containerMensagem: {
    padding: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoExcluir: {
    backgroundColor: '#f56362',
    width: '100%',
    height: 40,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  textExcluir: {
    color: '#fff',
    fontWeight: 'bold',
  },
  botaoCancelar: {
    backgroundColor: '#ccc',
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
  },

})

export { styles };