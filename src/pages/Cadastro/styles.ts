import { StyleSheet } from "react-native";

const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: '#2c88d9',
  },
  container: {
    flex: 1,
    backgroundColor:  '#F2F2F2'
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
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
  icon: {
    position: 'absolute',
    left: 20,
  },
  inputDuplo: {
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  botaoCEP: {
    marginEnd: 15,
    backgroundColor: "#2c88D9",
    borderRadius: 3,
    padding: 12
  },
  error: {
    color: '#f56362',
    marginStart: 20,
    marginTop: 5
  },
})

export { styles };