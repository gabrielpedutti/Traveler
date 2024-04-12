import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  modal: {
    position: 'absolute',
    top: '50%',
    marginTop: -50,
    height: 150,
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
    backgroundColor: '#f56362',
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
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
    width: '100%',
    borderRadius: 5,
    padding: 20,
  },
  erro: {
    textAlign: 'center',
    fontSize: 16,
  },

})

export { styles };