import { View, Text, Image, ScrollView, FlatList } from "react-native";
import HeaderFixo from "../../components/HeaderFixo";
import ItemViagem from "../../components/ItemViagem/index";
import BotaoAdicionar from "../../components/BotaoAdicionar";

import { styles } from "./styles";
import Titulo from "../../components/Titulo";
import { useContext, useEffect, useState } from "react";
import travelerApi from "../../services/api/travelerApi";
import { GetViagensResponseDto } from "../../types/dto/GetViagensResponseDto";
import { formatDate } from "../../utils/DataFormat";
import { CadastroContext } from "../../contexts/cadastro";
import Loading from "../../components/Loading";

function Viagens(){

  const { user } = useContext(CadastroContext);

  const [viagens, setViagens] = useState<GetViagensResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const renderItem = ({ item }: { item: GetViagensResponseDto }) => (
    <ItemViagem item={item} />
  );

  useEffect(() => {
    const listarViagens = async () => {
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
    listarViagens();
  }, []);

  return(
    <View style={styles.container}>
      <HeaderFixo />
      <Titulo texto="Viagens" />
      {isLoading &&
      <View style={styles.wrapper}>
        <Loading />
      </View>
      }
      {viagens.length == 0 && !isLoading &&
      <View style={styles.wrapper}>
        <Text style={styles.text}>Você ainda não possui nenhuma viagem cadastrada.</Text>
      </View> }
      
      {viagens.length > 0 && !isLoading &&
      <FlatList
        data={viagens}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />}
      <BotaoAdicionar />
    </View>
  )
}

export default Viagens;