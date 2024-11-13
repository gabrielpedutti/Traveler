import { TouchableOpacity, Text } from "react-native";

import { styles } from "./styles";

interface BotaoProps {
  label: string;
  onPress: () => void;
}

function Botao(props: BotaoProps) {
  return(
    <TouchableOpacity 
      style={styles.botao}
      onPress={() => {
        props.onPress();
      }}>
      <Text style={styles.textoBotao}>{props.label}</Text>
    </TouchableOpacity>
  )
}

export default Botao;