import { View, Text } from "react-native";
import Header from "../../components/Header";
import ItemMenu from "../../components/ItemMenu";

import { styles } from "./styles";

function MenuPrincipal(){
  return(
    <View style={styles.container}>
      <Header botaoFechar={true}/>
      <View style={styles.wrapper}>
        <ItemMenu label="Viagens" />
        <ItemMenu label="Transportes" />
        <ItemMenu label="Hospedagens" />
        <ItemMenu label="Passeios turísticos" />
        <ItemMenu label="Financeiro" />
      </View>
    </View>
  )
}

export default MenuPrincipal;