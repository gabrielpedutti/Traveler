import { Text, TouchableOpacity, View } from "react-native";

import { styles } from './styles';

interface ModalConfirmacaoExcluirProps {
  onPressExcluir: () => void;
  onPressCancelar: () => void;
}

function ModalConfirmacaoExcluir(props: ModalConfirmacaoExcluirProps) {
  return (
    <TouchableOpacity style={styles.modalBackground} onPress={props.onPressCancelar}>
      <View style={styles.modal} >
        <View style={styles.containerTitulo}>
          <Text style={styles.titulo}>Deseja realmente excluir?</Text>
        </View>
        <View style={styles.containerMensagem}>
          <TouchableOpacity style={styles.botaoExcluir} onPress={props.onPressExcluir}>
            <Text style={styles.textExcluir}>Excluir</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.botaoCancelar} onPress={props.onPressCancelar}>
            <Text>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default ModalConfirmacaoExcluir;