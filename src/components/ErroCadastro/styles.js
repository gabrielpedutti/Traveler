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
    padding: 20,
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
  erro: {
    color: 'red',
    fontSize: 16,
    marginBottom: 20,
  }
})

export { styles };