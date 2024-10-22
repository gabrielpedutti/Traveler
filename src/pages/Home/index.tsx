import { View, Text, Image, ScrollView, FlatList } from "react-native";
import HeaderFixo from "../../components/HeaderFixo";
import ItemViagem from "../../components/ItemViagem/index";
import BotaoAdicionar from "../../components/BotaoAdicionar";

import { styles } from "./styles";
import Titulo from "../../components/Titulo";
import { mockupViagens } from "../../data/MockupViagens";
import { MockupViagens } from "../../types/MockupViagens";

function Home(){
  
  const renderItem = ({ item }: { item: MockupViagens }) => (
    <ItemViagem
      imagem={item.imagem}
      destino={item.destino}
      data={item.data}
      tipoTransporte={item.tipoTransporte}
      numeroBilhete={item.numeroBilhete}
      tipoHospedagem={item.tipoHospedagem}
      nomeHospedagem={item.nomeHospedagem}
      pagina={item.pagina}
    />
  );

  return(
    <View style={styles.container}>
      <HeaderFixo />
      <Titulo texto="Viagens" />
      <FlatList
        data={mockupViagens}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
      <BotaoAdicionar />
    </View>
  )
}

export default Home;