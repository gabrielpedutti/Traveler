import { View, Text } from "react-native";

import { styles } from './styles';

function ErroCadastro(props) {
  
  return(
    <View style={styles.modal}>
      <Text style={styles.erro}>Erro ao Cadastrar</Text>
      <Text style={styles.erro}>{props.erro}</Text>
    </View>
  )
}

export default ErroCadastro;