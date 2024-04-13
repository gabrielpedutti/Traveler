import { View, Text, TextInput } from "react-native";

import { styles } from "./styles";

function ItemMenu(props) {
  return(
    <View style={styles.container}>
      <Text style={styles.label}>{props.label}</Text>
    </View>
  )
}

export default ItemMenu;