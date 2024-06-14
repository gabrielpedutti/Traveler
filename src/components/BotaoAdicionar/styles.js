import { StyleSheet } from "react-native";

const styles = StyleSheet.create({

  container: {
    position: 'absolute',
    flex: 1,
    flexDirection: "raw",
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginTop: 35,
    padding: 20,
    bottom: -5,
    width: "100%",
  },
  botaoMais: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    borderRadius: 50,
    backgroundColor: '#fff',
  },
})

export { styles };