import { StyleSheet } from "react-native";

const styles = StyleSheet.create({

  wrapper: {
    marginTop: 20
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
    backgroundColor: '#fff',
    borderRadius: 5,
    marginStart: 15,
    marginEnd: 15,
    borderWidth: 1,
    borderColor: '#2c88d9'
  },
  error: {
    color: '#f56362',
    marginStart: 20,
    marginTop: 5
  },
})

export { styles };