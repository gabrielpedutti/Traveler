import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";

interface BotaoExcluirProps {
  onPress: () => void;
}

function BotaoExcluir(props: BotaoExcluirProps) {
  return(
    <View style={styles.wrapperExcluir}>
      <TouchableOpacity style={styles.botaoExcluir} onPress={props.onPress}>
        <FontAwesome5Icon name="trash" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  )
}

export default BotaoExcluir;