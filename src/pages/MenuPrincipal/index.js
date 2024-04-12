import { View, Text } from "react-native";
import Header from "../../components/Header";

import { styles } from "./styles";

function MenuPrincipal(){
  return(
    <View style={styles.container}>
      <Header botaoFechar={true}/>
      <Text>MenuPrincipal</Text>
    </View>
  )
}

export default MenuPrincipal;