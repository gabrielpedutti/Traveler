import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  noImage: {
    height: 250,
    width: "100%",
    backgroundColor: "#cacaca",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#cacaca",
  },
  icon: {
    opacity: 0.3,
  },
  editButton: {
    position: "absolute",
    right: 10,
    top: 10,
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