import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  containerButtonsIOS: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  cancelar: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#2b88d9",
    padding: 10,
    color: "#2b88d9",
    borderRadius: 5,
    minWidth: '30%',
  },
  textCancelar: {
    color: "#2b88d9",
    textAlign: 'center',
  },
  confirmar: {
    backgroundColor: "#2b88d9",
    color: "#fff",
    padding: 10,
    borderRadius: 5,
    minWidth: '30%',
  },
  textConfirmar: {
    color: "#fff",
    textAlign: 'center',
  },
  datePicker: {
    height: 120,
    top: -10,
  },
});

export { styles };