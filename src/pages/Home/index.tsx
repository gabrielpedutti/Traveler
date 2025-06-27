import { View, Text, Image, ScrollView, FlatList } from "react-native";
import HeaderFixo from "../../components/HeaderFixo";
import ItemViagem from "../../components/ItemViagem/index";
import BotaoAdicionar from "../../components/BotaoAdicionar";

import { styles } from "./styles";
import Titulo from "../../components/Titulo";
import { mockupViagens } from "../../data/MockupViagens";
import { MockupViagens } from "../../types/MockupViagens";
import Botao from "../../components/Botao";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/RootStackParamList";
import BotaoPequeno from "../../components/BotaoPequeno";
import { useCallback, useContext, useState } from "react";
import { CadastroContext } from "../../contexts/cadastro";
import { GetViagensResponseDto } from "../../types/dto/GetViagensResponseDto";
import travelerApi from "../../services/api/travelerApi";
import { formatarIntervaloDatas } from "../../utils/DataFormat";

function Home(){

  const { user } = useContext(CadastroContext);
  const [viagens, setViagens] = useState<GetViagensResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Função para carregar viagens
  const carregarViagens = async () => {
    try {
      setIsLoading(true);
      const response = await travelerApi.get(`/viagem/usuario/${user.id}`);
      setViagens(response.data);
    } catch (error) {
      console.error("Erro ao buscar viagens:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Usando useFocusEffect para carregar viagens ao voltar para a tela
  useFocusEffect(
    useCallback(() => {
      // Chama a função de forma síncrona
      carregarViagens();
    }, [user.id])
  );

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  return(
    <View style={styles.container}>
      <HeaderFixo />
      <ScrollView contentContainerStyle={styles.scrollView}>
        {/* <Text style={styles.titulo}>Viaje sem preocupações, deixe-nos ser sua assistente de viagens!</Text> */}
        <View style={styles.tituloWrapper}>
          <Text style={styles.titulo}>Sua próxima </Text>
          <Text style={styles.titulo}>aventura te espera!</Text>
          <Text style={styles.textoSubtitulo}>Planeje, organize e viva experiências inesquecíveis com total tranquilidade</Text>
        </View>
        <Botao label={'Começar minha jornada!'} onPress={() => navigation.navigate("CadastroViagem")}/>
        <Image
          style={styles.imagem}
          source={require('../../assets/terra.png')}
        />
          <Text style={styles.subtitulo}>Sua próxima viagem ⛱️</Text>
        <View style={styles.containerViagem}>
          {viagens.length == 0 ? (
            <Text style={styles.semViagens}>Você ainda não possui viagens cadastradas...</Text>
          ) :
          (
            <View>
              <Text style={styles.local}>{viagens[0].nome}</Text>
              <Text style={styles.texto}><Text style={styles.label}>Data:</Text>  {formatarIntervaloDatas(viagens[0].data_inicio, viagens[0].data_fim)}</Text>
              <Text style={styles.texto}><Text style={styles.label}>País:</Text> {viagens[0].viagem_destino.nm_pais}</Text>
              <Text style={styles.texto}><Text style={styles.label}>Estado:</Text> {viagens[0].viagem_destino.nm_estado}</Text>
              <Text style={styles.texto}><Text style={styles.label}>Cidade:</Text> {viagens[0].viagem_destino.nm_municipio}</Text>
              <View style={styles.textContainer}>
              </View>
              <Text style={styles.texto}><Text style={styles.label}>Status:</Text> {viagens[0].status_viagem.descricao}</Text>
              <View style={styles.wrapperBotao}>
                <BotaoPequeno label="Mais informações" onPress={() => navigation.navigate('ViagemSelecionada', {viagem: viagens[0]})}/>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      
    </View>
  )
}

export default Home;