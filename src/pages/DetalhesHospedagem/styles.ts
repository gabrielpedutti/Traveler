import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#F2F2F2",
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
  containerInfos: {
    flexDirection: 'row',
    alignItems: 'center',
    marginEnd: 30,
    marginLeft: 10,
    gap: 10,
  },
  containerDataIcone: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateIcons: {
    marginBottom: -8,
    marginLeft: 10,
  },
  arrow: {
    marginLeft: 10,
    marginBottom: -25,
  },
  dateText: {
    fontSize: 16,
    color: '#2b2b2b',
    marginTop: 5,
    marginRight: 5,
  },
  containerData: {
    alignItems: 'center',
  },
  textCheckInOut: {
    fontSize: 12,
    color: '#2b2b2b',
    marginLeft: 15,
    marginTop: 15,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#2b88d9',
    paddingTop: -100,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    paddingBlock: 20,
    margin: 10,
    marginTop: 0,
    marginBottom: 0,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    gap: 5,
  },
  textoHospedagem: {
    fontSize: 16,
    color: '#2b88d9',
    fontWeight: 'bold',
  },
  dadosHospedagem: {
    fontSize: 16,
    color: '#2b2b2b',
  },
  textoEndereco: {
    fontSize: 16,
    color: '#2b88d9',
    textDecorationLine: 'underline',
    marginLeft: 10,
  },
  containerEndereco: {
    flexDirection: 'row',
    alignItems: 'center',
    marginEnd: 30,
    marginLeft: 10,
    gap: 10,
  },
  containerBotoes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export { styles };