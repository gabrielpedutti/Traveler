import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 20
  },
  label: {
    color: "white",
    fontWeight: 'bold',
    marginLeft: 15,
    marginBottom: 10,
    fontSize: 16
  },
  input: {
    marginStart: 20,
    width: '80%',
    padding: 10,

  },
  containerInput: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    marginStart: 15,
    marginEnd: 15,
  },
  icon: {
    position: 'absolute',
    left: 20,
  }
})

export { styles };