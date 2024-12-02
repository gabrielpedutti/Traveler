import { View, Text } from "react-native";
import Header from "../../components/Header";
import ItemMenu from "../../components/ItemMenu";
import Divisoria from "../../components/Divisoria";

import { styles } from "./styles";
import { SafeAreaView } from "react-native-safe-area-context";

function MenuPrincipal(){
  return(
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header botaoFechar={true}/>
        <View style={styles.wrapper}>
          <ItemMenu label="Viagens" name='airplane-outline' pagina = "Viagens" />
          <Divisoria />
          <ItemMenu label="Transportes" name='bus-outline' pagina = "" />
          <Divisoria />
          <ItemMenu label="Hospedagens" name='business-outline' pagina = "" />
          <Divisoria />
          <ItemMenu label="Passeios turísticos" name='ticket-outline' pagina = "" />
          <Divisoria />
          <ItemMenu label="Financeiro" name='wallet-outline' pagina = "" />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default MenuPrincipal;