import { View, Text, Image, ScrollView, FlatList } from "react-native";
import HeaderFixo from "../../components/HeaderFixo";
import ItemViagem from "../../components/ItemViagem/index";
import BotaoAdicionar from "../../components/BotaoAdicionar";

import { styles } from "./styles";
import Titulo from "../../components/Titulo";
import { mockupViagens } from "../../data/MockupViagens";
import { MockupViagens } from "../../types/MockupViagens";
import Botao from "../../components/Botao";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/RootStackParamList";
import BotaoPequeno from "../../components/BotaoPequeno";

function Home(){

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  return(
    <View style={styles.container}>
      <HeaderFixo />
      <Text style={styles.titulo}>Viaje sem preocupações, deixe-nos ser sua assistente de viagens!</Text>
      <Botao label={'Cadastre uma nova viagem'} onPress={() => navigation.navigate('CadastroViagem')}/>
      <Image
        style={styles.imagem}
        source={require('../../assets/WorldMap.png')}
      />
      <Text style={styles.subtitulo}>Sua próxima viagem</Text>
      {false ? (
        <Text style={styles.local}>Você ainda não possui viagens cadastradas...</Text>
      ) :
      (
        <View>
          <Text style={styles.local}>Rio de Janeiro</Text>
          <Text style={styles.texto}><Text style={styles.label}>Data:</Text> 05/12/2022</Text>
          <Text style={styles.texto}><Text style={styles.label}>Vôo:</Text> AA0274</Text>
          <View style={styles.textContainer}>
            <Text style={styles.texto}><Text style={styles.label}>Terminal:</Text> 2 </Text>
            <Text style={styles.texto}><Text style={styles.label}>Portão:</Text> 115</Text>
          </View>
          <Text style={styles.texto}><Text style={styles.label}>Status:</Text> em embarque</Text>
          <Text style={styles.texto}><Text style={styles.label}>Hotel:</Text> Copacana Palace</Text>
          <View style={styles.wrapperBotao}>
            <BotaoPequeno label="Mais informações" onPress={() => {}}/>
          </View>
        </View>
      )}
      
    </View>
  )
}

export default Home;