import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
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
  attachButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#fff', // Cor de fundo do botão
    padding: 12,
    borderRadius: 5,
    marginStart: 15,
    marginEnd: 15,
    borderWidth: 1,
    borderColor: '#2b88d9',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  attachButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2b88d9',
  },
  attachedFileContainer: {
    marginTop: 10,
    padding: 10,
    marginStart: 15,
    marginEnd: 15,
    backgroundColor: '#e0e0e0', // Fundo leve para indicar o arquivo anexado
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Espaço entre nome e botão remover (se houver)
  },
  attachedFileName: {
    fontSize: 14,
    fontStyle: 'italic', // Texto em itálico
    color: '#555',
    flexShrink: 1, // Permite que o nome do arquivo quebre se for longo
    marginRight: 10, // Espaço antes do botão remover
  },
})

export { styles };