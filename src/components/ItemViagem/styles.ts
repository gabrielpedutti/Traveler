import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    margin: 0,
    marginBottom: 20,
    marginTop: 15,
    paddingTop: 5,
    paddingBottom: 5,
  },
  titulo: {
    color: "#2b88d9",
    fontSize: 14,
    marginLeft: 15,
  },
  tituloData: {
    color: "#2b88d9",
    fontSize: 14,
  },
  text: {
    fontSize: 14,
    marginLeft: 15,
},
primeiraLinha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 280,
    margin: 0,
    padding: 0,
},
linha: {
    flexDirection: 'row',
    flexWrap: 'wrap',

},
img: {
  margin: 15,
  marginRight: 0,
  width: 70,
  height: 70,
}
})

export { styles };