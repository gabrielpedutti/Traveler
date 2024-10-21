import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 20,
    flex: 1
  },
  label: {
    color: "#2c88d9",
    fontWeight: 'bold',
    marginLeft: 15,
    marginBottom: 10,
    fontSize: 16
  },
  input: {
    marginStart: 20,
    width: '100%',
    padding: 10,

  },
  containerInput: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    marginStart: 15,
    marginEnd: 15,
    borderWidth: 1,
    borderColor: '#2c88d9',
  },
  icon: {
    position: 'absolute',
    left: 20,
  }
})

export { styles };