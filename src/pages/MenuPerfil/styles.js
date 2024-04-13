import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    color: 'white'
  },
  name: {
    margin: 20,
  },
  container: {
    backgroundColor: '#2c88d9',
    height: '100%'
  },
  card: {
    margin: 20,
    marginBottom: 25,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  footer: {
    position: 'absolute',
    flex: 0.1,
    left: 0,
    right: 0,
    bottom: -20,
    backgroundColor:'#236eb0',
    flexDirection:'row',
    height:100,
  },
  imagem: {
    width: 100,
    height: 100,
    borderRadius: 100/2,
    borderColor: 'white',
    borderWidth: 2,
  },
})

export { styles };