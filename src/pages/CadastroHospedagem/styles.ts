import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    paddingBottom: 20,
  },
  titulo: {
    fontSize: 25,
    lineHeight: 45,
    color: '#2b88d9',
    marginLeft: 15,
    marginTop: 15,
    fontWeight: 'bold',
  },
  error: {
    color: '#f56362',
    marginStart: 20,
    marginTop: 5
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
  containerInput: {
    backgroundColor: '#fff',
    borderRadius: 5,
    marginStart: 15,
    marginEnd: 15,
    borderWidth: 1,
    borderColor: '#2c88d9'
  },
  containerDatas: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginStart: 0,
    marginEnd: 1,
  },
  containerData: {
    width: '48%',
  }
});

export { styles };