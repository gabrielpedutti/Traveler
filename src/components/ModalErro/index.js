import { View, Text } from "react-native";

import { styles } from './styles';

function ModalErro(props) {
  
  return(
    <View style={styles.modal}>
      <Text style={styles.erro}>{props.titulo}</Text>
      <Text style={styles.erro}>{props.erro}</Text>
    </View>
  )
}

export default ModalErro;