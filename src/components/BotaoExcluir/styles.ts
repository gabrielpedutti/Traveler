import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    wrapperExcluir: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  botaoExcluir: {
    marginTop: 25,
    marginStart: 15,
    marginEnd: 15,
    backgroundColor: '#e75757',
    borderWidth: 2,
    borderColor: '#eb4545',
    borderRadius: 5,
    elevation: 3,
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 50,
  },
  textoExcluir: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
})

export { styles };