import { View, Text } from "react-native";
import Header from "../../components/Header";

import { styles } from "./styles";

function MenuPerfil(){
  return(
    <View style={styles.container}>
      <Header />
      <Text>MenuPerfil</Text>
    </View>
  )
}

export default MenuPerfil;