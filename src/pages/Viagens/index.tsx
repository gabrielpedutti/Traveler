import { View, Text, Image, ScrollView, FlatList } from "react-native";
import HeaderFixo from "../../components/HeaderFixo";
import ItemViagem from "../../components/ItemViagem/index";
import BotaoAdicionar from "../../components/BotaoAdicionar";

import { styles } from "./styles";
import Titulo from "../../components/Titulo";
import { mockupViagens } from "../../data/MockupViagens";
import { MockupViagens } from "../../types/MockupViagens";
import { useEffect, useState } from "react";
import travelerApi from "../../services/api/travelerApi";
import { GetViagensResponseDto } from "../../types/dto/GetViagensResponseDto";
import { formatDate } from "../../utils/DataFormat";

function Viagens(){

  const [viagens, setViagens] = useState<GetViagensResponseDto[]>([]);
  
  const renderItem = ({ item }: { item: GetViagensResponseDto }) => (
    <ItemViagem
      nome={item.nome}
      descricao={item.descricao}
      destino={(item.viagem_destino_id).toString()}
      dataInicio={formatDate(item.data_inicio)}
      dataFim={formatDate(item.data_fim)}
      statusViagem={(item.status_viagem_id).toString()}
    />
  );

  useEffect(() => {
    const listarViagens = async () => {
      const response = await travelerApi.get('/viagem');
      setViagens(response.data)
    }
    listarViagens();
  }, []);

  return(
    <View style={styles.container}>
      <HeaderFixo />
      <Titulo texto="Viagens" />
      <View style={styles.wrapper}>
        <Text style={styles.text}>Você ainda não possui nenhuma viagem cadastrada.</Text>
      </View>
      <FlatList
        data={viagens}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
      <BotaoAdicionar />
    </View>
  )
}

export default Viagens;