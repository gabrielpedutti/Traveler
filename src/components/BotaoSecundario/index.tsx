import { TouchableOpacity, Text } from "react-native";

import { styles } from "./styles";
import { JSX } from "react";

interface BotaoSecundarioProps {
  label: string | JSX.Element;
  onPress: () => void;
}

function BotaoSecundario(props: BotaoSecundarioProps) {
  return(
    <TouchableOpacity 
      style={styles.botao}
      onPress={() => {
        props.onPress();
      }}>
        {
        typeof props.label === 'string' ? (
          <Text style={styles.textoBotaoSecundario}>{props.label}</Text>
        ) : (
          props.label
        )
        }
    </TouchableOpacity>
  )
}

export default BotaoSecundario;