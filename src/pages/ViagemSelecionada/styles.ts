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
    fontSize: 22,
    color: '#2b88d9',
    marginLeft: 15,
    marginTop: 10,
    fontWeight: 'bold',
    width: "65%",
  },
  data: {
    fontSize: 18,
    lineHeight: 30,
    color: '#2b88d9',
    marginLeft: 15,
    marginTop: 5
  },
  headerContainer: {
    backgroundColor: "#f5f5f5",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -25,
    padding: 10,
    borderBottomColor: "#cacaca",
    borderBottomWidth: 1,
  },
  titleWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginEnd: 15,
  },
  descricao: {
    fontSize: 16,
    lineHeight: 30,
    color: '#222222',
    marginHorizontal: 15,
    paddingBottom: 10,
  },
  botaoMais: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    borderRadius: 50,
    backgroundColor: '#2c88d9',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  wrapper: {
    flex: 1,
    top: '25%',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: '#2b88d9',
    margin: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  img: {
    margin: 15,
    marginRight: 0,
    width: 70,
    height: 70,
  },
  linha: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  botaoExcluir: {
    height: 50,
    width: '80%',
    marginStart: '10%',
    marginBottom: 20,
    backgroundColor: '#e75757',
    borderWidth: 2,
    borderColor: '#eb4545',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  textoExcluir: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export { styles };