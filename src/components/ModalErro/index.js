import { View, Text } from "react-native";

import { styles } from './styles';

function ModalErro(props) {
  
  return(
    <View style={styles.modal}>
      <View style={styles.containerTitulo}>
        <Text style={styles.titulo}>{props.titulo}</Text>
      </View>
      <View style={styles.containerMensagem}>
        <Text style={styles.erro}>{props.erro}</Text>
      </View>
    </View>
  )
}

export default ModalErro;