import { Pressable, Text } from "react-native";

import { styles } from "./styles";

function Botao(props) {
  return(
    <Pressable 
      style={styles.botao}
      onPress={props.onPress}>
      <Text style={styles.textoBotao}>{props.label}</Text>
    </Pressable>
  )
}

export default Botao;